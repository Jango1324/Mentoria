# Mentoria Hub — Инструкция по запуску

## Шаг 1 — Установка зависимостей

```bash
cd mentoria-hub
npm install
```


## Шаг  — Запуск

```bash
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000)


```bash
npx vercel
```

Или:
1. Залей на GitHub
2. Зайди на [vercel.com](https://vercel.com) → Import Git Repository
3. Добавь Environment Variables (те же что в `.env.local`)
4. Deploy

## Структура файлов

```
mentoria-hub/
├── app/
│   ├── page.tsx              ← Главная страница
│   ├── login/page.tsx        ← Вход
│   ├── register/page.tsx     ← Регистрация
│   ├── onboarding/page.tsx   ← Онбординг (интересы/класс)
│   ├── dashboard/page.tsx    ← Личный кабинет
│   ├── opportunities/page.tsx ← Каталог возможностей
│   ├── courses/
│   │   ├── page.tsx          ← Список курсов
│   │   └── [id]/page.tsx     ← Страница курса с уроками
│   └── admin/page.tsx        ← Панель администратора
├── components/
│   └── Navbar.tsx            ← Навигация
├── lib/
│   ├── data.ts               ← Все mock данные (10 возможностей, 3 курса)
│   └── supabase/
│       ├── client.ts         ← Supabase клиент (browser)
│       └── server.ts         ← Supabase клиент (server)
├── supabase-schema.sql       ← SQL для Supabase
└── .env.local                ← Переменные окружения
```
