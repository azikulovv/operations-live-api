# Participants

Модуль синхронизирует участников события из внешней системы и позволяет обновлять локальные данные участника.

## HTTP API

### Получить участников события

```http
GET /api/events/:eventId/participants
```

`eventId` - внешний идентификатор события, то есть `Event.externalId`.

Перед возвратом списка backend синхронизирует участников из внешней системы. В ответ включаются связанные локальные данные:

- `bartenderSale`
- `promotion`
- `debt`
- `payment`
- `tournament`

### Синхронизировать участников события

```http
POST /api/events/:eventId/participants/sync
```

### Обновить участника

```http
PATCH /api/events/:eventId/participants/:participantId
```

`participantId` - локальный идентификатор участника из `EventParticipant.id`.

Body:

```json
{
  "badge": "42",
  "tableNumber": 1,
  "seatNumber": 3,
  "userName": "player_one",
  "arrived": true
}
```

Поля body:

| Поле | Тип | Обязательное |
| --- | --- | --- |
| `status` | `string` | Нет |
| `position` | `number \| null` | Нет |
| `tableNumber` | `number \| null` | Нет |
| `seatNumber` | `number \| null` | Нет |
| `userName` | `string \| null` | Нет |
| `userEmail` | `string \| null` | Нет |
| `userPhone` | `string \| null` | Нет |
| `userTelegramId` | `string \| null` | Нет |
| `userAvatarUrl` | `string \| null` | Нет |
| `badge` | `string \| null` | Нет |
| `arrived` | `boolean` | Нет |

`arrived` управляет присутствием участника в операционных разделах. В остальных
списках события отображаются только участники с `arrived: true`, заполненным
`badge` и статусом не `CANCELLED`. Участники с `arrived: false`, пустым `badge`
или `status: "CANCELLED"` остаются в списке участников события, но не
отображаются в оплатах, долгах, промо, баре, турнире, финальном столе и shift
dashboard.

## Realtime

После успешного `PATCH /api/events/:eventId/participants/:participantId` отправляются события:

- `participant:updated`
- `participants:list-updated`

`participants:list-updated` содержит:

```json
{
  "eventId": "external-event-1",
  "data": []
}
```
