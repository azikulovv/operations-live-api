import { prisma } from '@/database/prisma'
import { ParticipantsService } from '@/modules/participants/participants.service'
import { presentPaymentListItem } from '@/modules/payments/payments.presenter'
import { emitPaymentListUpdated, emitPaymentUpdated } from '@/modules/payments/payments.realtime'
import { PaymentsRepository } from '@/modules/payments/payments.repository'
import type { UpdatePaymentDto } from '@/modules/payments/payments.schemas'

export class PaymentsService {
  private readonly participantsService = new ParticipantsService()
  private readonly paymentsRepository = new PaymentsRepository(prisma)

  async getEventPayments(externalEventId: string) {
    await this.participantsService.syncEventParticipants(externalEventId)
    return this.findPresentedList(externalEventId)
  }

  async updateParticipantPayment(participantId: string, dto: UpdatePaymentDto) {
    const payment = await this.paymentsRepository.upsertByParticipantId(participantId, dto)
    const eventId = payment.participant.event.externalId
    const list = await this.findPresentedList(eventId)

    emitPaymentUpdated({
      eventId,
      participantId,
      payment,
    })

    emitPaymentListUpdated(eventId, list)

    return payment
  }

  private async findPresentedList(externalEventId: string) {
    const participants = await this.paymentsRepository.findListByExternalEventId(externalEventId)
    return participants.map(presentPaymentListItem)
  }
}
