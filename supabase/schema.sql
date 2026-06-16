create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  grade smallint check (grade between 8 and 11),
  country text,
  interests text[] default '{}',
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'admin')),
  onboarded boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  tags text[] default '{}',
  deadline date,
  url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, opportunity_id)
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  thumbnail_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  content_url text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

alter table public.profiles enable row level security;
alter table public.opportunities enable row level security;
alter table public.saved_opportunities enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;

create index if not exists idx_saved_opportunities_user_id
on public.saved_opportunities(user_id);

create index if not exists idx_lessons_course_id
on public.lessons(course_id);

create index if not exists idx_lesson_progress_user_id
on public.lesson_progress(user_id);

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Authenticated users can read active opportunities" on public.opportunities;
create policy "Authenticated users can read active opportunities"
on public.opportunities for select
to authenticated
using (is_active = true);

drop policy if exists "Admins can insert opportunities" on public.opportunities;
create policy "Admins can insert opportunities"
on public.opportunities for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can update opportunities" on public.opportunities;
create policy "Admins can update opportunities"
on public.opportunities for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can delete opportunities" on public.opportunities;
create policy "Admins can delete opportunities"
on public.opportunities for delete
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

drop policy if exists "Users can read own saved opportunities" on public.saved_opportunities;
create policy "Users can read own saved opportunities"
on public.saved_opportunities for select
using (auth.uid() = user_id);

drop policy if exists "Users can save opportunities" on public.saved_opportunities;
create policy "Users can save opportunities"
on public.saved_opportunities for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can unsave opportunities" on public.saved_opportunities;
create policy "Users can unsave opportunities"
on public.saved_opportunities for delete
using (auth.uid() = user_id);

drop policy if exists "Authenticated users can read published courses" on public.courses;
create policy "Authenticated users can read published courses"
on public.courses for select
to authenticated
using (is_published = true);

drop policy if exists "Admins can insert courses" on public.courses;
create policy "Admins can insert courses"
on public.courses for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can update courses" on public.courses;
create policy "Admins can update courses"
on public.courses for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can delete courses" on public.courses;
create policy "Admins can delete courses"
on public.courses for delete
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

drop policy if exists "Authenticated users can read lessons of published courses" on public.lessons;
create policy "Authenticated users can read lessons of published courses"
on public.lessons for select
to authenticated
using (
  exists (
    select 1 from public.courses
    where courses.id = lessons.course_id
    and courses.is_published = true
  )
);

drop policy if exists "Admins can insert lessons" on public.lessons;
create policy "Admins can insert lessons"
on public.lessons for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can update lessons" on public.lessons;
create policy "Admins can update lessons"
on public.lessons for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can delete lessons" on public.lessons;
create policy "Admins can delete lessons"
on public.lessons for delete
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

drop policy if exists "Users can read own lesson progress" on public.lesson_progress;
create policy "Users can read own lesson progress"
on public.lesson_progress for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own lesson progress" on public.lesson_progress;
create policy "Users can insert own lesson progress"
on public.lesson_progress for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own lesson progress" on public.lesson_progress;
create policy "Users can update own lesson progress"
on public.lesson_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();