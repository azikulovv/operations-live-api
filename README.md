# operations-live-backend

Стек:

- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite
- Zod
- Socket.IO
- JWT
- ESLint
- Prettier

---

## Установка

```bash
npm install
```

---

## Настройка `.env`

Создай `.env` файл:

```bash
cp .env.example .env
```

Пример:

```env
NODE_ENV=development
PORT=5000

APP_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

DATABASE_URL="file:./prisma/dev.db"

JWT_SECRET=super_long_random_secret_at_least_32_chars
JWT_EXPIRES_IN=7d

EXTERNAL_API_URL=https://example.com/api
EXTERNAL_API_KEY=change_me
```

`.env` проверяется через **Zod**. Если переменные указаны неправильно, сервер не запустится.

---

## Роли пользователей

| Role      | Описание    |
| --------- | ----------- |
| `MANAGER` | Управляющий |
| `ADMIN`   | Админ       |
| `HOSTESS` | Хостес      |

---

## Первый запуск

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Сервер будет доступен по адресу:

```txt
http://localhost:5000
```

Проверка:

```bash
curl http://localhost:5000/health
```

---

## Scripts

### Development

```bash
npm run dev
```

Запускает сервер в режиме разработки с автоматическим перезапуском.

---

### Build

```bash
npm run build
```

Собирает TypeScript-проект в папку `dist`.

---

### Start

```bash
npm run start
```

Запускает собранный проект из `dist`.

Перед этим нужно выполнить:

```bash
npm run build
```

---

### ESLint

```bash
npm run lint
```

Проверяет код на ошибки и проблемы качества.

```bash
npm run lint:fix
```

Автоматически исправляет ошибки, которые ESLint может исправить сам.

---

### Prettier

```bash
npm run format
```

Форматирует весь проект через Prettier.

```bash
npm run format:check
```

Проверяет форматирование без исправления файлов.

---

### Prisma

```bash
npm run prisma:generate
```

Генерирует Prisma Client.

```bash
npm run prisma:migrate
```

Создаёт и применяет миграции базы данных.

```bash
npm run prisma:studio
```

Открывает Prisma Studio для просмотра базы.

```bash
npm run prisma:seed
```

Создаёт тестовых пользователей.

---

## Тестовые пользователи

После seed будут созданы:

| Email                | Пароль        | Роль      |
| -------------------- | ------------- | --------- |
| `manager@duck.local` | `password123` | `MANAGER` |
| `admin@duck.local`   | `password123` | `ADMIN`   |
| `hostess@duck.local` | `password123` | `HOSTESS` |

---

Нужные расширения:

- Prettier
- ESLint
- Prisma

---

## Структура проекта

```txt
src/
├─ app.ts
├─ server.ts
├─ config/
├─ database/
├─ realtime/
├─ external/
├─ common/
└─ modules/
```

---

## Автор

Проект создан и поддерживается **Maulen Azikulov**.

[Telegram](https://t.me/azikulovv) |
[GitHub](https://github.com/azikulovv) | [Website](https://shan.kz) | [LinkedIn](https://www.linkedin.com/in/azikulovv)
