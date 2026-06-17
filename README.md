# Mentoria Hub — Инструкция по запуску

## Шаг 1 — Установка зависимостей

```bash
<<<<<<< HEAD
cd mentoria-hub
npm install
```

## Шаг 2 — Настройка Supabase

1. Зайди на [supabase.com](https://supabase.com) → New Project
2. Дай название: `mentoria-hub`
3. Запомни пароль базы данных
4. После создания проекта → **SQL Editor**
5. Вставь содержимое файла `supabase-schema.sql` → Run

## Шаг 3 — Переменные окружения

Открой `.env.local` и замени:

```
NEXT_PUBLIC_SUPABASE_URL=     ← Project Settings > API > Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= ← Project Settings > API > anon public key
```

## Шаг 4 — Создать тестовых пользователей

1. В Supabase → **Authentication > Users > Add user**
2. Создай: `student@test.com` / `password123`
3. Создай: `admin@test.com` / `password123`
4. В SQL Editor запусти:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'admin@test.com';
   ```

## Шаг 5 — Запуск
=======
npm install
```


## Шаг  — Запуск
>>>>>>> 9e467ec305df1bd9c930f1a9da7fd7dd18afa9c2

```bash
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000)

<<<<<<< HEAD
## Шаг 6 — Деплой на Vercel
=======
>>>>>>> 9e467ec305df1bd9c930f1a9da7fd7dd18afa9c2

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
<<<<<<< HEAD

## Демо-путь для видео

1. Открой главную → нажми "Начать бесплатно"
2. Зарегистрируйся → онбординг (класс + интересы + цели)
3. Попадаешь в кабинет → видишь рекомендации
4. Перейди в Возможности → поиск + фильтры → сохрани ♡
5. Перейди в Курсы → запишись → открой урок → ответь на тест → заверши
6. Кабинет обновился: прогресс + дедлайны
7. Войди как admin@test.com → Админ панель → добавь возможность
=======
>>>>>>> 9e467ec305df1bd9c930f1a9da7fd7dd18afa9c2
