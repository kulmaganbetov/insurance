# LifeGuard KZ — AI-платформа оценки рисков страхования жизни

AI-платформа для оценки рисков страхования жизни в Казахстане. Использует актуарные формулы, таблицы смертности населения РК и нейросеть GPT-4o для персонального расчёта страховой премии.

## Стек технологий

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-4o
- **БД**: Vercel Postgres (опционально)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **PDF**: jsPDF + jspdf-autotable
- **Icons**: Lucide React

## Быстрый старт

```bash
# 1. Клонировать репозиторий
git clone https://github.com/kulmaganbetov/insurance.git
cd insurance

# 2. Установить зависимости
npm install

# 3. Создать .env.local
cp .env.example .env.local
# Добавить OPENAI_API_KEY

# 4. Запустить dev сервер
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000)

## Деплой на Vercel

1. Залить код на GitHub
2. Импортировать проект в [Vercel](https://vercel.com)
3. Добавить переменные окружения:
   - `OPENAI_API_KEY` — ключ OpenAI API
   - `POSTGRES_URL` — (опционально) строка подключения Vercel Postgres
4. Нажать Deploy

## Структура проекта

```
/app
  /page.tsx              — Главная (лендинг)
  /calculator/page.tsx   — Калькулятор (4-шаговая анкета)
  /result/page.tsx       — Дашборд результата
  /dashboard/page.tsx    — Аналитика (B2B дашборд)
  /about/page.tsx        — О методологии
  /api
    /calculate/route.ts  — POST: расчёт через GPT-4o
    /save-result/route.ts— POST: сохранение в БД
    /analytics/route.ts  — GET: статистика
    /export/route.ts     — POST: экспорт PDF
/components
  /calculator/           — Шаги калькулятора
  /result/               — Компоненты результата
  /dashboard/            — Компоненты аналитики
/lib
  /constants.ts          — Константы (регионы, типы)
  /types.ts              — TypeScript типы
```

## Особенности

- Работает без БД (fallback на mock данные)
- Работает без OpenAI API (fallback расчёт на сервере)
- Адаптивный дизайн (mobile-first)
- Тёмная тема с изумрудными акцентами
- Все тексты на русском языке
