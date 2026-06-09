# Shift Dashboard

Модуль показывает краткую read-only сводку смены для управляющего.

Все значения считаются автоматически на основе участников, начислений и оплат. В модуле нет ручного редактирования показателей.

## HTTP API

```http
GET /api/events/:eventId/shift-dashboard
```

`eventId` - внешний идентификатор события, то есть `Event.externalId`.

Перед расчетом dashboard сервис синхронизирует участников:

```ts
participantsService.syncEventParticipants(eventId)
```

## Ответ

```json
{
  "data": {
    "playersInList": 42,
    "playersInTournament": 37,
    "accruals": {
      "tournament": 370000,
      "bar": 85000,
      "dartsBilliards": 0,
      "total": 455000
    },
    "paidAmount": 420000,
    "currentDebt": 35000,
    "playersWithDebt": 5
  }
}
```

## Формулы

| Поле                      | Как считается                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| `playersInList`           | Количество всех `EventParticipant` события.                                                |
| `playersInTournament`     | Количество участников, у которых есть `tableNumber` или `seatNumber`.                      |
| `accruals.tournament`     | Сумма `max(payment.accruedAmount - payment.discountAmount, 0)`.                            |
| `accruals.bar`            | Сумма `bartenderSale.amount`.                                                              |
| `accruals.dartsBilliards` | Сейчас `0`, потому что отдельного модуля/модели дартса и бильярда пока нет.                |
| `accruals.total`          | `tournament + bar + dartsBilliards`.                                                       |
| `paidAmount`              | Сумма `payment.paidAmount`.                                                                |
| `currentDebt`             | Сумма долгов по участникам: `max(totalAccruedByParticipant - paidAmountByParticipant, 0)`. |
| `playersWithDebt`         | Количество участников, у которых текущий долг больше `0`.                                  |

## Важные детали реализации

- Dashboard ничего не сохраняет в базе.
- После изменения участников, платежей или барных начислений следующий `GET` вернет пересчитанные показатели.
- Для live UI можно обновлять dashboard после событий существующих модулей: `payments:list-updated`, `bartender-sales:list-updated`, `participants` sync/refetch.
- Переплата не уменьшает общий долг ниже `0`, потому что долг считается через `max(..., 0)` по каждому участнику.
