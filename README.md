🌙 DreamDecode

AI-powered Dream & Subconscious Analysis Platform

DreamDecode is a web application that helps people record, analyze and understand their dreams using artificial intelligence.

Your dreams are data — DreamDecode turns them into insight.

🧠 What is DreamDecode?

DreamDecode is a dream journal with built-in AI analysis.

It allows you to:

write down your dreams

track emotional and symbolic patterns

receive AI-generated psychological interpretations

explore what your subconscious is trying to tell you

Instead of just storing dreams, DreamDecode turns them into self-knowledge.

🎯 Why dreams matter

Dreams encode:

stress

fears

desires

unresolved problems

creativity

DreamDecode helps you decode these signals using modern NLP and AI.

🧩 How it works

You write or save a dream

AI analyzes the text

The system extracts:

emotions

symbols

themes

possible meanings

You get a clear, structured interpretation

🖥 Product features

Dream journal with dark “night mode” UI

AI dream analysis

Emotional and symbolic pattern tracking

Dream analytics dashboard

SaaS-style architecture

Secure database storage

🛠 Technology stack

Next.js (TypeScript, App Router)

Prisma ORM

NeonDB (PostgreSQL)

Tailwind CSS

Framer Motion

React Icons

OpenRouter API

⚙️ Quick start
1) Install dependencies
npm install

2) Environment variables

Create .env from .env.example and fill:

DATABASE_URL — pooled connection string from Neon

DIRECT_URL — direct connection string for migrations

OPENROUTER_API_KEY — OpenRouter API key

Copy-Item .env.example .env

3) Migrations & seed
npx prisma migrate dev --name init
npm run db:seed

4) Run
npm run dev


Open:

http://localhost:3000

🚀 Deploy to Vercel

Add DATABASE_URL, DIRECT_URL, OPENROUTER_API_KEY in Vercel

Apply migrations:

npm run db:migrate

🛠 Useful commands

npm run db:migrate — apply migrations in production

npm run db:seed — seed test data

📦 Project structure
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

🔍 Where to find the core logic

prisma/schema.prisma — database schema

prisma/migrations — migrations

prisma/seed.js — test data

src/actions/dreams.ts — Server Actions

src/app/api/analyze/route.ts — OpenRouter AI analysis

src/app/page.tsx — main dashboard

🔮 Vision

DreamDecode aims to become a personal subconscious dashboard — a place where dreams, emotions and inner patterns are understood, tracked and visualized by AI.
