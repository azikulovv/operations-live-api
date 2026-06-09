# Final Table

Модуль хранит состав финального стола.

`seat` и `stack` вводятся вручную. `badge` и `nickname` берутся из `EventParticipant`:

- `badge` -> `EventParticipant.badge`;
- `nickname` -> `EventParticipant.userName`.

## HTTP API

### Получить финальный стол события

```http
GET /api/events/:eventId/final-table
```

`eventId` - внешний идентификатор события, то есть `Event.externalId`.

Ответ содержит только участников, которым назначили место за финальным столом.

```json
{
  "data": [
    {
      "id": "cmfinal123",
      "participantId": "cmparticipant123",
      "externalParticipantId": "external-participant-1",
      "externalUserId": "external-user-1",
      "seat": 1,
      "badge": "42",
      "nickname": "player_one",
      "stack": 125000,
      "updatedAt": "2026-06-09T10:00:00.000Z"
    }
  ]
}
```

Список сортируется по `seat` по возрастанию.

### Назначить или обновить участника финального стола

```http
PATCH /api/final-table/:participantId
```

`participantId` - локальный идентификатор участника из `EventParticipant.id`.

Body:

```json
{
  "seat": 1,
  "stack": 125000
}
```

Поля body:

| Поле | Тип | Обязательное | Правила |
| --- | --- | --- | --- |
| `seat` | `number` | Да | Целое число от `1` до `9`. |
| `stack` | `number` | Да | Целое число, минимум `0`. |

В рамках одного события `seat` уникален. Один участник может иметь только одну запись финального стола.

## Realtime

После успешного `PATCH /api/final-table/:participantId` сервис отправляет два Socket.IO события:

- `final-table:updated`
- `final-table:list-updated`

## Важные детали реализации

- Модуль не хранит `badge` и `nickname` отдельно, чтобы не дублировать данные участника.
- При изменении `badge` или `userName` у участника список финального стола начнет отдавать новые значения.
- Уникальность места обеспечивается индексом `@@unique([eventId, seat])`.
