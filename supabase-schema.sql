-- ====================================
-- MENTORIA HUB — Supabase SQL Schema
-- Вставь в SQL Editor в Supabase Dashboard
-- ====================================

-- 1. PROFILES (расширение auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  name text,
  grade int,
  interests text[],
  goals text[],
  role text default 'student',
  created_at timestamp with time zone default now()
);

-- 2. SAVED OPPORTUNITIES
create table if not exists saved_opportunities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  opportunity_id text not null,
  created_at timestamp with time zone default now(),
  unique(user_id, opportunity_id)
);

-- 3. COURSE ENROLLMENTS
create table if not exists course_enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  course_id text not null,
  created_at timestamp with time zone default now(),
  unique(user_id, course_id)
);

-- 4. LESSON PROGRESS
create table if not exists lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  lesson_id text not null,
  completed boolean default false,
  created_at timestamp with time zone default now(),
  unique(user_id, lesson_id)
);

-- ====================================
-- RLS (Row Level Security)
-- ====================================

alter table profiles enable row level security;
alter table saved_opportunities enable row level security;
alter table course_enrollments enable row level security;
alter table lesson_progress enable row level security;

-- Profiles: read/write own
create policy "profiles_own" on profiles using (auth.uid() = id) with check (auth.uid() = id);
-- Admin can read all profiles
create policy "profiles_admin_read" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Saved opportunities: own
create policy "saved_own" on saved_opportunities using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Course enrollments: own
create policy "enrollments_own" on course_enrollments using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Lesson progress: own
create policy "progress_own" on lesson_progress using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ====================================
-- TRIGGER: auto-create profile on signup
-- ====================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ====================================
-- SEED: тестовые аккаунты
-- После вставки схемы — запусти ОТДЕЛЬНО в SQL Editor:
-- ====================================
-- (Тестовых пользователей создай вручную через Supabase Auth > Users)
-- Студент: student@test.com / password123 → role = 'student'
-- Админ:   admin@test.com   / password123 → role = 'admin'
-- После создания — обнови роль админа:
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@test.com';
