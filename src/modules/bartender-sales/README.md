# Bartender Sales

Модуль хранит и отдает сумму продаж бара по участникам события.

Основной сценарий:

1. Фронтенд открывает список продаж бара для события.
2. Backend синхронизирует участников события из внешней системы.
3. Backend возвращает участников с текущими данными `bartenderSale`.
4. Бармен обновляет сумму или комментарий по конкретному участнику.
5. Backend делает upsert записи продажи и отправляет Socket.IO события для обновления UI.

## Файлы модуля

| Файл | Назначение |
| --- | --- |
| `bartender-sales.routes.ts` | Роуты Express и подключение Zod-валидации. |
| `bartender-sales.controller.ts` | HTTP-слой: читает валидированные params/body и возвращает `{ data }`. |
| `bartender-sales.service.ts` | Бизнес-flow: синхронизация участников, upsert продажи, realtime-уведомления. |
| `bartender-sales.repository.ts` | Prisma-запросы к `EventParticipant` и `ParticipantBartenderSale`. |
| `bartender-sales.presenter.ts` | Формат ответа списка для frontend. |
| `bartender-sales.schemas.ts` | Zod-схемы params/body. |
| `bartender-sales.realtime.ts` | Socket.IO события модуля. |

## Модель данных

Продажа бара хранится в Prisma-модели `ParticipantBartenderSale`.

```prisma
model ParticipantBartenderSale {
  id            String  @id @default(cuid())
  participantId String  @unique
  amount        Int     @default(0)
  comment       String?

  participant EventParticipant @relation(fields: [participantId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Одна запись продажи относится к одному участнику. При удалении участника продажа удаляется каскадно.

## HTTP API

Все ответы успешных HTTP-запросов возвращаются в формате:

```json
{
  "data": {}
}
```

### Получить продажи бара по событию

```http
GET /api/events/:eventId/bartender-sales
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
      "bartenderSale": {
        "id": "cmbar123",
        "amount": 5000,
        "comment": "2 drinks",
        "updatedAt": "2026-06-09T10:00:00.000Z"
      }
    }
  ]
}
```

Если у участника еще нет продажи бара, `presenter` возвращает дефолтные значения:

```json
{
  "bartenderSale": {
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

### Обновить продажу бара участника

```http
PATCH /api/bartender-sales/:participantId
```

`participantId` - локальный идентификатор участника из `EventParticipant.id`.

Body:

```json
{
  "amount": 5000,
  "comment": "2 drinks"
}
```

Поля body:

| Поле | Тип | Обязательное | Правила |
| --- | --- | --- | --- |
| `amount` | `number` | Нет | Целое число, минимум `0`. |
| `comment` | `string \| null` | Нет | Строка обрезается через `trim()`, можно передать `null`. |

Body может содержать одно поле, оба поля или быть пустым объектом. Запрос делает upsert:

- если продажи для участника нет, создается новая запись;
- если продажа уже есть, обновляются только переданные поля.

Пример ответа:

```json
{
  "data": {
    "id": "cmbar123",
    "participantId": "cmparticipant123",
    "amount": 5000,
    "comment": "2 drinks",
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

После успешного `PATCH /api/bartender-sales/:participantId` сервис отправляет два Socket.IO события.

### `bartender-sale:updated`

Событие точечного обновления продажи.

Payload:

```json
{
  "eventId": "external-event-1",
  "participantId": "cmparticipant123",
  "bartenderSale": {
    "id": "cmbar123",
    "participantId": "cmparticipant123",
    "amount": 5000,
    "comment": "2 drinks",
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

### `bartender-sales:list-updated`

Событие полного обновления списка продаж по событию.

Payload:

```json
{
  "eventId": "external-event-1",
  "data": []
}
```

`data` имеет тот же формат, что и ответ `GET /api/events/:eventId/bartender-sales`.

## Валидация и ошибки

Валидация сделана через `validate.middleware.ts` и Zod-схемы из `bartender-sales.schemas.ts`.

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

В текущем роутинге модуля не подключен `auth.middleware.ts` и нет проверки роли `BARTENDER`.
Если endpoint должен быть закрыт по роли, это нужно добавить отдельно в routes.

## Важные детали реализации

- `GET` принимает внешний `eventId`, а `PATCH` принимает локальный `participantId`.
- Суммы хранятся в `Int`; валюта и единицы измерения в модуле не фиксируются.
- `comment` можно очистить через `null`.
- `updatedAt` обновляется Prisma автоматически.
- Socket.IO события отправляются глобально через `io.emit`, без rooms по событию.
