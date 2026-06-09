# Tournament

Модуль хранит и отдает турнирные данные участников события.

`badge` и `nickname` берутся из `EventParticipant`:

- `badge` -> `EventParticipant.badge`;
- `nickname` -> `EventParticipant.userName`, который заполняется из внешнего `user.username`.

Остальные поля хранятся в своей one-to-one модели `ParticipantTournament`.

## Файлы модуля

| Файл                       | Назначение                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `tournament.routes.ts`     | Роуты Express и подключение Zod-валидации.                                            |
| `tournament.controller.ts` | HTTP-слой: читает валидированные params/body и возвращает `{ data }`.                 |
| `tournament.service.ts`    | Бизнес-flow: синхронизация участников, upsert турнирных данных, realtime-уведомления. |
| `tournament.repository.ts` | Prisma-запросы к `EventParticipant` и `ParticipantTournament`.                        |
| `tournament.presenter.ts`  | Формат ответа списка для frontend.                                                    |
| `tournament.schemas.ts`    | Zod-схемы params/body.                                                                |
| `tournament.realtime.ts`   | Socket.IO события модуля.                                                             |

## Модель данных

```prisma
model ParticipantTournament {
  id            String @id @default(cuid())
  participantId String @unique
  reEntry       Int    @default(0)
  addon         Int    @default(0)
  knockouts     Int    @default(0)
  bustoutOrder  Int    @default(0)
  status        String @default("ACTIVE")

  participant EventParticipant @relation(fields: [participantId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Поля:

| Поле           | Назначение                                                |
| -------------- | --------------------------------------------------------- |
| `reEntry`      | Повторный вход после вылета.                              |
| `addon`        | Дополнительное пополнение/докупка в рамках турнира.       |
| `knockouts`    | Сколько игроков этот участник выбил.                      |
| `bustoutOrder` | Порядок вылета игрока.                                    |
| `status`       | Текущее состояние игрока, например `ACTIVE` или `BUSTED`. |

## HTTP API

### Получить турнир по событию

```http
GET /api/events/:eventId/tournament
```

`eventId` - внешний идентификатор события, то есть `Event.externalId`.

Перед чтением списка сервис вызывает:

```ts
participantsService.syncEventParticipants(eventId)
```

Пример ответа:

```json
{
  "data": [
    {
      "participantId": "cmabc123",
      "externalParticipantId": "external-participant-1",
      "externalUserId": "external-user-1",
      "status": "REGISTERED",
      "tableNumber": 1,
      "seatNumber": 2,
      "position": 5,
      "user": {
        "nickname": "player_one",
        "name": "player_one",
        "email": "player@example.com",
        "phone": "+77000000000",
        "telegramId": "123456789",
        "avatarUrl": "https://example.com/avatar.png",
        "badge": "VIP"
      },
      "tournament": {
        "id": "cmtournament123",
        "reEntry": 1,
        "addon": 1,
        "knockouts": 3,
        "bustoutOrder": 0,
        "status": "ACTIVE",
        "updatedAt": "2026-06-09T10:00:00.000Z"
      }
    }
  ]
}
```

Если у участника еще нет турнирной записи, `presenter` возвращает дефолтные значения:

```json
{
  "tournament": {
    "id": null,
    "reEntry": 0,
    "addon": 0,
    "knockouts": 0,
    "bustoutOrder": 0,
    "status": "ACTIVE",
    "updatedAt": null
  }
}
```

Сортировка списка:

1. `tableNumber` по возрастанию.
2. `seatNumber` по возрастанию.
3. `userName` по возрастанию.

### Обновить турнирные данные участника

```http
PATCH /api/tournament/:participantId
```

`participantId` - локальный идентификатор участника из `EventParticipant.id`.

Body:

```json
{
  "reEntry": 1,
  "addon": 1,
  "knockouts": 3,
  "bustoutOrder": 0,
  "status": "ACTIVE"
}
```

Поля body:

| Поле           | Тип      | Обязательное | Правила                         |
| -------------- | -------- | ------------ | ------------------------------- |
| `reEntry`      | `number` | Нет          | Целое число, минимум `0`.       |
| `addon`        | `number` | Нет          | Целое число, минимум `0`.       |
| `knockouts`    | `number` | Нет          | Целое число, минимум `0`.       |
| `bustoutOrder` | `number` | Нет          | Целое число, минимум `0`.       |
| `status`       | `string` | Нет          | Непустая строка после `trim()`. |

Запрос делает upsert:

- если турнирной записи для участника нет, создается новая запись;
- если запись уже есть, обновляются только переданные поля.

## Realtime

После успешного `PATCH /api/tournament/:participantId` сервис отправляет два Socket.IO события.

### `tournament:updated`

Payload:

```json
{
  "eventId": "external-event-1",
  "participantId": "cmparticipant123",
  "tournament": {}
}
```

### `tournament:list-updated`

Payload:

```json
{
  "eventId": "external-event-1",
  "data": []
}
```

`data` имеет тот же формат, что и ответ `GET /api/events/:eventId/tournament`.

## Важные детали реализации

- `GET` принимает внешний `eventId`, а `PATCH` принимает локальный `participantId`.
- `badge` не меняется при `reEntry`; игрок продолжает играть под тем же badge.
- Модуль не обновляет `EventParticipant.badge` и `EventParticipant.userName`.
- Socket.IO события отправляются глобально через `io.emit`, без rooms по событию.
