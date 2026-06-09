# Debts

Модуль хранит и отдает долги участников события.

Основной сценарий:

1. Фронтенд открывает список долгов для события.
2. Backend синхронизирует участников события из внешней системы.
3. Backend возвращает участников с текущими данными `debt`.
4. Пользователь обновляет сумму долга или комментарий по конкретному участнику.
5. Backend делает upsert записи долга и отправляет Socket.IO события для обновления UI.

## Файлы модуля

| Файл | Назначение |
| --- | --- |
| `debts.routes.ts` | Роуты Express и подключение Zod-валидации. |
| `debts.controller.ts` | HTTP-слой: читает валидированные params/body и возвращает `{ data }`. |
| `debts.service.ts` | Бизнес-flow: синхронизация участников, upsert долга, realtime-уведомления. |
| `debts.repository.ts` | Prisma-запросы к `EventParticipant` и `ParticipantDebt`. |
| `debts.presenter.ts` | Формат ответа списка для frontend. |
| `debts.schemas.ts` | Zod-схемы params/body. |
| `debts.realtime.ts` | Socket.IO события модуля. |

## Модель данных

Долг хранится в Prisma-модели `ParticipantDebt`.

```prisma
model ParticipantDebt {
  id            String  @id @default(cuid())
  participantId String  @unique
  amount        Int     @default(0)
  comment       String?

  participant EventParticipant @relation(fields: [participantId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Одна запись долга относится к одному участнику. При удалении участника долг удаляется каскадно.

## HTTP API

Все успешные HTTP-запросы возвращают ответ в формате:

```json
{
  "data": {}
}
```

### Получить долги по событию

```http
GET /api/events/:eventId/debts
```

`eventId` - внешний идентификатор события, то есть `Event.externalId`.

Перед чтением списка сервис вызывает:

```ts
participantsService.syncEventParticipants(eventId)
```

Это подтягивает актуальных участников из внешней системы, затем список читается из локальной базы.

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
        "name": "Ivan Ivanov",
        "email": "ivan@example.com",
        "phone": "+77000000000",
        "telegramId": "123456789",
        "avatarUrl": "https://example.com/avatar.png",
        "badge": "VIP"
      },
      "debt": {
        "id": "cmdebt123",
        "amount": 5000,
        "comment": "Will pay later",
        "updatedAt": "2026-06-09T10:00:00.000Z"
      }
    }
  ]
}
```

Если у участника еще нет долга, `presenter` возвращает дефолтные значения:

```json
{
  "debt": {
    "id": null,
    "amount": 0,
    "comment": null,
    "updatedAt": null
  }
}
```

Сортировка списка:

1. `tableNumber` по возрастанию.
2. `seatNumber` по возрастанию.
3. `userName` по возрастанию.

### Обновить долг участника

```http
PATCH /api/debts/:participantId
```

`participantId` - локальный идентификатор участника из `EventParticipant.id`.

Body:

```json
{
  "amount": 5000,
  "comment": "Will pay later"
}
```

Поля body:

| Поле | Тип | Обязательное | Правила |
| --- | --- | --- | --- |
| `amount` | `number` | Нет | Целое число, минимум `0`. |
| `comment` | `string \| null` | Нет | Строка обрезается через `trim()`, можно передать `null`. |

Body может содержать одно поле, оба поля или быть пустым объектом. Запрос делает upsert:

- если долга для участника нет, создается новая запись;
- если долг уже есть, обновляются только переданные поля.

Пример ответа:

```json
{
  "data": {
    "id": "cmdebt123",
    "participantId": "cmparticipant123",
    "amount": 5000,
    "comment": "Will pay later",
    "createdAt": "2026-06-09T09:50:00.000Z",
    "updatedAt": "2026-06-09T10:00:00.000Z",
    "participant": {
      "id": "cmparticipant123",
      "externalId": "external-participant-1",
      "externalUserId": "external-user-1",
      "userName": "Ivan Ivanov",
      "event": {
        "id": "cmevent123",
        "externalId": "external-event-1"
      }
    }
  }
}
```

## Realtime

После успешного `PATCH /api/debts/:participantId` сервис отправляет два Socket.IO события.

### `debt:updated`

Событие точечного обновления долга.

Payload:

```json
{
  "eventId": "external-event-1",
  "participantId": "cmparticipant123",
  "debt": {
    "id": "cmdebt123",
    "participantId": "cmparticipant123",
    "amount": 5000,
    "comment": "Will pay later",
    "createdAt": "2026-06-09T09:50:00.000Z",
    "updatedAt": "2026-06-09T10:00:00.000Z",
    "participant": {
      "id": "cmparticipant123",
      "externalId": "external-participant-1",
      "externalUserId": "external-user-1",
      "userName": "Ivan Ivanov",
      "event": {
        "id": "cmevent123",
        "externalId": "external-event-1"
      }
    }
  }
}
```

### `debts:list-updated`

Событие полного обновления списка долгов по событию.

Payload:

```json
{
  "eventId": "external-event-1",
  "data": []
}
```

`data` имеет тот же формат, что и ответ `GET /api/events/:eventId/debts`.

## Валидация и ошибки

Валидация сделана через `validate.middleware.ts` и Zod-схемы из `debts.schemas.ts`.

Ошибки валидации возвращаются как `400`.

Пример:

```json
{
  "message": "Некорректное тело запроса",
  "errors": [
    {
      "field": "amount",
      "message": "Too small: expected number to be >=0"
    }
  ]
}
```

Текущая реализация не оборачивает Prisma-ошибки модуля в доменные `404` или `409`.
Например, `PATCH` с несуществующим `participantId` может завершиться общей ошибкой сервера.

## Права доступа

В текущем роутинге модуля не подключен `auth.middleware.ts` и нет проверки роли.
Если endpoint должен быть закрыт по роли, это нужно добавить отдельно в routes.

## Важные детали реализации

- `GET` принимает внешний `eventId`, а `PATCH` принимает локальный `participantId`.
- Суммы хранятся в `Int`; валюта и единицы измерения в модуле не фиксируются.
- `comment` можно очистить через `null`.
- `updatedAt` обновляется Prisma автоматически.
- Socket.IO события отправляются глобально через `io.emit`, без rooms по событию.
