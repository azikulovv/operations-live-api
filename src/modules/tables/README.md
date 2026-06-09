# Tables

Модуль хранит и отдает состояние столов события.

Столы относятся к событию, а не к конкретному участнику. При первом `GET` модуль создает недостающие строки столов по `Event.tableCount`. Максимум игроков за столом берется из `Event.seatsPerTable`, если он есть, иначе используется `9`.

## Файлы модуля

| Файл                   | Назначение                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `tables.routes.ts`     | Роуты Express и подключение Zod-валидации.                                           |
| `tables.controller.ts` | HTTP-слой: читает валидированные params/body и возвращает `{ data }`.                |
| `tables.service.ts`    | Бизнес-flow: создание недостающих столов, update/upsert стола, realtime-уведомления. |
| `tables.repository.ts` | Prisma-запросы к `Event` и `EventTable`.                                             |
| `tables.presenter.ts`  | Формат ответа списка для frontend.                                                   |
| `tables.schemas.ts`    | Zod-схемы params/body.                                                               |
| `tables.realtime.ts`   | Socket.IO события модуля.                                                            |

## Модель данных

```prisma
model EventTable {
  id           String @id @default(cuid())
  eventId      String
  tableNumber  Int
  playersCount Int    @default(0)
  maxPlayers   Int    @default(9)
  status       String @default("NOT_USED")
  comment      String?

  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Поля:

| Поле           | Назначение                                        |
| -------------- | ------------------------------------------------- |
| `tableNumber`  | Номер стола: `1`, `2`, `3` и так далее.           |
| `playersCount` | Сколько игроков сейчас сидит за этим столом.      |
| `maxPlayers`   | Максимум игроков за столом, обычно `9` для 9-max. |
| `status`       | Текущее состояние стола.                          |
| `comment`      | Заметка админа.                                   |

Рекомендуемые статусы:

| Значение          | Смысл                                             |
| ----------------- | ------------------------------------------------- |
| `NOT_USED`        | Не используется, стол закрыт или не задействован. |
| `ACTIVE`          | Активен / используется.                           |
| `FULL`            | Полный.                                           |
| `CLOSING`         | Закрыть / на закрытие.                            |
| `WAITING_PLAYERS` | Ожидает игроков.                                  |

## HTTP API

### Получить столы события

```http
GET /api/events/:eventId/tables
```

`eventId` - внешний идентификатор события, то есть `Event.externalId`.

Пример ответа:

```json
{
  "data": [
    {
      "id": "cmtable123",
      "eventId": "cmevent123",
      "tableNumber": 1,
      "playersCount": 5,
      "maxPlayers": 9,
      "status": "ACTIVE",
      "comment": "Main table",
      "updatedAt": "2026-06-09T10:00:00.000Z"
    }
  ]
}
```

### Обновить стол события

```http
PATCH /api/events/:eventId/tables/:tableNumber
```

`tableNumber` - номер стола внутри события.

Body:

```json
{
  "playersCount": 9,
  "maxPlayers": 9,
  "status": "FULL",
  "comment": "Table is full"
}
```

Поля body:

| Поле           | Тип              | Обязательное | Правила                                                                                                   |
| -------------- | ---------------- | ------------ | --------------------------------------------------------------------------------------------------------- |
| `playersCount` | `number`         | Нет          | Целое число, минимум `0`; не может быть больше `maxPlayers`, если `maxPlayers` передан в этом же запросе. |
| `maxPlayers`   | `number`         | Нет          | Целое число, минимум `1`.                                                                                 |
| `status`       | `string`         | Нет          | Непустая строка после `trim()`.                                                                           |
| `comment`      | `string \| null` | Нет          | Строка обрезается через `trim()`, можно передать `null`.                                                  |

Запрос делает upsert:

- если стола с таким номером еще нет, создается новая запись;
- если стол уже есть, обновляются только переданные поля.

## Realtime

После успешного `PATCH /api/events/:eventId/tables/:tableNumber` сервис отправляет два Socket.IO события.

### `table:updated`

Payload:

```json
{
  "eventId": "external-event-1",
  "tableNumber": 1,
  "table": {}
}
```

### `tables:list-updated`

Payload:

```json
{
  "eventId": "external-event-1",
  "data": []
}
```

`data` имеет тот же формат, что и ответ `GET /api/events/:eventId/tables`.

## Важные детали реализации

- `GET` и `PATCH` принимают внешний `eventId`.
- Список сортируется по `tableNumber` по возрастанию.
- Модуль хранит ручной `playersCount`; он не пересчитывается автоматически из участников.
- Socket.IO события отправляются глобально через `io.emit`, без rooms по событию.
