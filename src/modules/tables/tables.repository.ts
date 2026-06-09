import type { PrismaClient } from '@prisma/client'

import type { UpdateTableDto } from '@/modules/tables/tables.schemas'

export class TablesRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findEventByExternalId(externalEventId: string) {
    return this.prisma.event.findUnique({
      where: {
        externalId: externalEventId,
      },
      select: {
        id: true,
        externalId: true,
        tableCount: true,
        seatsPerTable: true,
      },
    })
  }

  async findListByEventId(eventId: string) {
    return this.prisma.eventTable.findMany({
      where: {
        eventId,
      },
      orderBy: {
        tableNumber: 'asc',
      },
    })
  }

  async findByEventIdAndTableNumber(eventId: string, tableNumber: number) {
    return this.prisma.eventTable.findUnique({
      where: {
        eventId_tableNumber: {
          eventId,
          tableNumber,
        },
      },
    })
  }

  async createMissingTables(eventId: string, tableNumbers: number[], maxPlayers: number) {
    if (tableNumbers.length === 0) return { count: 0 }

    return this.prisma.eventTable.createMany({
      data: tableNumbers.map(tableNumber => ({
        eventId,
        tableNumber,
        maxPlayers,
      })),
    })
  }

  async upsertByEventIdAndTableNumber(
    eventId: string,
    tableNumber: number,
    maxPlayers: number,
    dto: UpdateTableDto,
  ) {
    return this.prisma.eventTable.upsert({
      where: {
        eventId_tableNumber: {
          eventId,
          tableNumber,
        },
      },
      create: {
        eventId,
        tableNumber,
        maxPlayers,
        ...dto,
      },
      update: dto,
    })
  }
}
