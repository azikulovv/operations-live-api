import type { Prisma, PrismaClient } from '@prisma/client'

export class EventsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findExternalIds(externalIds: string[]) {
    if (externalIds.length === 0) return new Set<string>()

    const events = await this.prisma.event.findMany({
      where: {
        externalId: {
          in: externalIds,
        },
      },
      select: {
        externalId: true,
      },
    })

    return new Set(events.map(event => event.externalId))
  }

  async findByExternalId(externalId: string) {
    return this.prisma.event.findUnique({
      where: {
        externalId,
      },
    })
  }

  async createMany(events: Prisma.EventCreateManyInput[]) {
    if (events.length === 0) return { count: 0 }

    return this.prisma.event.createMany({
      data: events,
    })
  }

  async updateFromExternalEvents(events: Prisma.EventCreateManyInput[]) {
    if (events.length === 0) return []

    return this.prisma.$transaction(
      events.map(event =>
        this.prisma.event.update({
          where: {
            externalId: String(event.externalId),
          },
          data: {
            title: event.title,
            city: event.city,
            address: event.address,
            gameType: event.gameType,
            startsAt: event.startsAt,
            endsAt: event.endsAt,
            status: event.status,
            participantLimit: event.participantLimit,
            initialDepositAmount: event.initialDepositAmount ?? 0,
            seatsPerTable: event.seatsPerTable,
            tableCount: event.tableCount,
            registrationsCount: event.registrationsCount,
          },
        }),
      ),
    )
  }

  async create(event: Prisma.EventCreateInput) {
    return this.prisma.event.create({
      data: event,
    })
  }

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: {
        startsAt: 'asc',
      },
    })
  }

  async findUpcoming(from: Date) {
    return this.prisma.event.findMany({
      where: {
        startsAt: {
          gte: from,
        },
      },
      orderBy: {
        startsAt: 'asc',
      },
    })
  }
}
