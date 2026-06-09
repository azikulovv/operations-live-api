type TableListItem = {
  id: string
  eventId: string
  tableNumber: number
  playersCount: number
  maxPlayers: number
  status: string
  comment: string | null
  updatedAt: Date
}

export function presentTableListItem(table: TableListItem) {
  return {
    id: table.id,
    eventId: table.eventId,
    tableNumber: table.tableNumber,
    playersCount: table.playersCount,
    maxPlayers: table.maxPlayers,
    status: table.status,
    comment: table.comment,
    updatedAt: table.updatedAt,
  }
}
