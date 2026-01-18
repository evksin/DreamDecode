# Next.js + Prisma + Neon (PostgreSQL)

Минимальный рабочий проект на Next.js (App Router) с Prisma и NeonDB.
Главная страница читает заметки из PostgreSQL и отображает их.

## Быстрый старт

### 1) Создание проекта

```powershell
npx create-next-app@latest . --ts --app --eslint --use-npm --no-tailwind --yes
npm install prisma @prisma/client
npx prisma init --datasource-provider postgresql
```

### 2) Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```powershell
Copy-Item .env.example .env
```

И вставьте строку подключения Neon в `DATABASE_URL`.


### 3) Prisma схема

Файл `prisma/schema.prisma` уже содержит модель `Note`:

```prisma
model Note {
  id        String   @id @default(uuid()) @db.Uuid
  title     String
  createdAt DateTime @default(now())
}
```

### 4) Миграция и seed

```powershell
npx prisma migrate dev --name init
npm run db:seed
```

### 5) Запуск

```powershell
npm run dev
```

Откройте `http://localhost:3000`.

## Деплой на Vercel

1) Добавьте переменную окружения `DATABASE_URL` в настройках проекта на Vercel.
2) Выполните миграции:

```powershell
npm run db:migrate
```

## Полезные команды

- `npm run db:migrate` — применить миграции в проде (Vercel).
- `npm run db:seed` — заполнить БД тестовыми данными.

## Где смотреть код

- `prisma/schema.prisma` — схема Prisma.
- `prisma/seed.js` — минимальный seed.
- `lib/prisma.ts` — Prisma Client.
- `app/page.tsx` — запрос к БД на главной странице.
