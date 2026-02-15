# DreamDecode 🌙✨  
AI-powered dream journal & analysis platform

Understand what your dreams really mean using artificial intelligence and psychology.

---

## 🚀 What is DreamDecode?

DreamDecode is a modern AI-powered web app that helps people:

- Record their dreams  
- Analyze patterns  
- Understand emotions  
- Discover hidden psychological signals  

Unlike simple note apps, DreamDecode uses large language models to **interpret dreams in context**, giving meaningful insights instead of generic symbols.

---

## 🧠 How it works

1. You write your dream  
2. DreamDecode stores it in your private journal  
3. AI analyzes emotions, symbols and narrative  
4. You receive psychological insights and summaries  
5. Over time, you see patterns and trends  

This turns dreaming into **self-reflection and mental clarity**.

---

## ✨ Core Features

- 🌙 Dream journal with history  
- 🧠 AI-powered dream interpretation  
- 📊 Analytics & dream statistics  
- 🔮 Pattern detection over time  
- 🎨 Dark, night-themed UI  
- ⚡ Fast modern web app  

---

## 🛠 Tech Stack

- **Next.js 14 (App Router, TypeScript)**  
- **Prisma ORM**  
- **NeonDB (PostgreSQL)**  
- **Tailwind CSS**  
- **Framer Motion**  
- **OpenRouter API (LLMs)**  

---

## ⚙️ Setup

### 1) Install dependencies
```bash
npm install

2) Environment variables

Create .env from .env.example:

DATABASE_URL=...
DIRECT_URL=...
OPENROUTER_API_KEY=...

3) Database
npx prisma migrate dev --name init
npm run db:seed

4) Run
npm run dev


Open: http://localhost:3000

📂 Project Structure
src/
  app/
    page.tsx
    dream/new/page.tsx
    dream/[id]/page.tsx
    analytics/page.tsx
    api/analyze/route.ts
  components/
  lib/
  actions/
  prisma/

🧩 Key Files

prisma/schema.prisma — Database schema

src/app/api/analyze/route.ts — AI analysis

src/actions/dreams.ts — Server Actions

src/app/page.tsx — Dashboard

🎯 Who is this for?

DreamDecode is for people who:

Want to understand their subconscious

Care about mental health

Use journaling and self-reflection

Love AI-powered tools

⚠️ Disclaimer

This is an experimental AI product.
Not intended for medical or psychological diagnosis.

👨‍💻 Author

Built by evksin
Telecommunications engineer & AI-focused developer
