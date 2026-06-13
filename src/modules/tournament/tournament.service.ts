import { prisma } from '@/database/prisma'
import { ParticipantsService } from '@/modules/participants/participants.service'
import { presentTournamentListItem } from '@/modules/tournament/tournament.presenter'
import { TournamentRepository } from '@/modules/tournament/tournament.repository'
import {
  emitTournamentListUpdated,
  emitTournamentUpdated,
} from '@/modules/tournament/tournament.realtime'
import type { UpdateTournamentDto } from '@/modules/tournament/tournament.schemas'

export class TournamentService {
  private readonly participantsService = new ParticipantsService()
  private readonly tournamentRepository = new TournamentRepository(prisma)

  async getEventTournament(externalEventId: string) {
    await this.participantsService.syncEventParticipantsIfAvailable(externalEventId)
    return this.findPresentedList(externalEventId)
  }

  async updateParticipantTournament(participantId: string, dto: UpdateTournamentDto) {
    await this.participantsService.ensureParticipantCanBeEdited(participantId)

    const tournament = await this.tournamentRepository.upsertByParticipantId(participantId, dto)
    const eventId = tournament.participant.event.externalId
    const list = await this.findPresentedList(eventId)

    emitTournamentUpdated({
      eventId,
      participantId,
      tournament,
    })

    emitTournamentListUpdated(eventId, list)

    return tournament
  }

  private async findPresentedList(externalEventId: string) {
    const participants = await this.tournamentRepository.findListByExternalEventId(externalEventId)
    return participants.map(presentTournamentListItem)
  }
}
