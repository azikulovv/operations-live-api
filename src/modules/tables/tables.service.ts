import { badRequest } from '@/common/errors/app-error'
import { prisma } from '@/database/prisma'
import { presentTableListItem } from '@/modules/tables/tables.presenter'
import { TablesRepository } from '@/modules/tables/tables.repository'
import { emitTableListUpdated, emitTableUpdated } from '@/modules/tables/tables.realtime'
import type { UpdateTableDto } from '@/modules/tables/tables.schemas'

export class TablesService {
  private readonly tablesRepository = new TablesRepository(prisma)

  async getEventTables(externalEventId: string) {
    const event = await this.getEventOrThrow(externalEventId)
    await this.ensureEventTables(event)
    return this.findPresentedList(event.id)
  }

  async updateEventTable(externalEventId: string, tableNumber: number, dto: UpdateTableDto) {
    const event = await this.getEventOrThrow(externalEventId)
    const existingTable = await this.tablesRepository.findByEventIdAndTableNumber(
      event.id,
      tableNumber,
    )
    const maxPlayers = dto.maxPlayers ?? existingTable?.maxPlayers ?? event.seatsPerTable ?? 9
    const playersCount = dto.playersCount ?? existingTable?.playersCount ?? 0

    if (playersCount > maxPlayers) {
      throw badRequest('Количество игроков не может быть больше максимума за столом')
    }

    const table = await this.tablesRepository.upsertByEventIdAndTableNumber(
      event.id,
      tableNumber,
      maxPlayers,
      dto,
    )
    const list = await this.findPresentedList(event.id)

    emitTableUpdated({
      eventId: event.externalId,
      tableNumber,
      table,
    })

    emitTableListUpdated(event.externalId, list)

    return table
  }

  private async getEventOrThrow(externalEventId: string) {
    const event = await this.tablesRepository.findEventByExternalId(externalEventId)

    if (!event) {
      throw badRequest('Событие не найдено')
    }

    return event
  }

  private async ensureEventTables(event: {
    id: string
    tableCount: number
    seatsPerTable: number | null
  }) {
    const existingTables = await this.tablesRepository.findListByEventId(event.id)
    const existingNumbers = new Set(existingTables.map(table => table.tableNumber))
    const maxPlayers = event.seatsPerTable ?? 9
    const missingNumbers = Array.from({ length: event.tableCount }, (_, index) => index + 1).filter(
      tableNumber => !existingNumbers.has(tableNumber),
    )

    await this.tablesRepository.createMissingTables(event.id, missingNumbers, maxPlayers)
  }

  private async findPresentedList(eventId: string) {
    const tables = await this.tablesRepository.findListByEventId(eventId)
    return tables.map(presentTableListItem)
  }
}
