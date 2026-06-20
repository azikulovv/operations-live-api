# Final Table

Модуль автоматически создает состав финального стола, когда в турнире остается от 1 до 9
активных участников.

При создании место берется из `EventParticipant.seatNumber`, если оно свободно и находится
в диапазоне от 1 до 9. Иначе назначается первое свободное место. Начальный `stack` равен `0`.
`seat` и `stack` можно изменить вручную. `badge` и `nickname` берутся из `EventParticipant`:

- `badge` -> `EventParticipant.badge`;
- `nickname` -> `EventParticipant.userName`.

## HTTP API

### Получить финальный стол события

```http
GET /api/events/:eventId/final-table
```

`eventId` - внешний идентификатор события, то есть `Event.externalId`.

Ответ содержит оставшихся активных участников, если их количество не превышает 9. Участник
должен прибыть (`arrived = true`), иметь непустой `badge`, не быть отменен и иметь турнирный
статус `ACTIVE`. Отсутствующая турнирная запись считается статусом `ACTIVE`.

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
      "email": "player@example.com",
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

| Поле    | Тип      | Обязательное | Правила                    |
| ------- | -------- | ------------ | -------------------------- |
| `seat`  | `number` | Да           | Целое число от `1` до `9`. |
| `stack` | `number` | Да           | Целое число, минимум `0`.  |

В рамках одного события `seat` уникален. Один участник может иметь только одну запись финального стола.
При попытке занять уже используемое место API возвращает `409 Conflict`.

## Realtime

После успешного `PATCH /api/final-table/:participantId` сервис отправляет два Socket.IO события:

- `final-table:updated`
- `final-table:list-updated`

## Важные детали реализации

- Модуль не хранит `badge` и `nickname` отдельно, чтобы не дублировать данные участника.
- При изменении `badge` или `userName` у участника список финального стола начнет отдавать новые значения.
- Если участник перестал соответствовать условиям допуска, его назначение удаляется и место освобождается.
- Уникальность места обеспечивается индексом `@@unique([eventId, seat])`.
