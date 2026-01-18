# DreamDecode — дневник снов с AI анализом

Полный проект на Next.js (App Router) + Prisma + NeonDB с тёмной ночной темой, аналитикой и AI анализом снов.

## Стек

- Next.js (TypeScript, App Router)
- Prisma ORM
- NeonDB (PostgreSQL)
- Tailwind CSS
- Framer Motion
- React Icons
- OpenRouter API

## Быстрый старт

### 1) Установка зависимостей

```powershell
npm install
```

### 2) Переменные окружения

Создайте `.env` на основе `.env.example` и заполните:

- `DATABASE_URL` — pooled connection string из Neon
- `DIRECT_URL` — direct connection string для миграций
- `OPENROUTER_API_KEY` — ключ OpenRouter

```powershell
Copy-Item .env.example .env
```

### 3) Миграции и seed

```powershell
npx prisma migrate dev --name init
npm run db:seed
```

### 4) Запуск

```powershell
npm run dev
```

Откройте `http://localhost:3000`.

## Деплой на Vercel

1) Добавьте `DATABASE_URL`, `DIRECT_URL`, `OPENROUTER_API_KEY` в Vercel.
2) Примените миграции:

```powershell
npm run db:migrate
```

## Полезные команды

- `npm run db:migrate` — применить миграции в проде.
- `npm run db:seed` — заполнить БД тестовыми данными.

## Структура

```
src/
  app/
    page.tsx
    dream/new/page.tsx
    dream/[id]/page.tsx
    analytics/page.tsx
    api/analyze/route.ts
  components/
    ui/
    dreams/
    analytics/
    layout/
  lib/
    prisma.ts
    ai.ts
    dreams.ts
  actions/
    dreams.ts
  types/
    index.ts
```

## Где смотреть код

- `prisma/schema.prisma` — схема Prisma.
- `prisma/migrations` — миграции.
- `prisma/seed.js` — тестовые данные.
- `src/actions/dreams.ts` — Server Actions.
- `src/app/api/analyze/route.ts` — OpenRouter анализ.
- `src/app/page.tsx` — дашборд.
