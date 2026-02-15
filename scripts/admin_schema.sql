-- Execute este script no SQL Editor do Supabase para habilitar
-- o painel administrativo e a gestao de alunos/notas.

create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin_email()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) in (
    'hugocamposdecarvalho@gmail.com',
    'roosevelt.miranda@gmail.com'
  );
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_metrics (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  total_xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  total_answered integer not null default 0,
  total_correct integer not null default 0,
  accuracy numeric(5,2) not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.student_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exam_year integer not null default 2025,
  area text not null check (area in ('humanas', 'natureza', 'linguagens', 'matematica', 'redacao')),
  score numeric(6,2) not null check (score >= 0 and score <= 1000),
  status text not null check (status in ('aprovado', 'recuperacao', 'em_risco')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_student_scores_user_year on public.student_scores(user_id, exam_year);
create index if not exists idx_student_scores_status on public.student_scores(status);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.touch_updated_at();

drop trigger if exists trg_student_metrics_updated_at on public.student_metrics;
create trigger trg_student_metrics_updated_at
before update on public.student_metrics
for each row
execute function public.touch_updated_at();

drop trigger if exists trg_student_scores_updated_at on public.student_scores;
create trigger trg_student_scores_updated_at
before update on public.student_scores
for each row
execute function public.touch_updated_at();

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_name text;
  resolved_role text;
begin
  resolved_name :=
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      split_part(new.email, '@', 1)
    );

  resolved_role := case
    when lower(new.email) in (
      'hugocamposdecarvalho@gmail.com',
      'roosevelt.miranda@gmail.com'
    ) then 'admin'
    else 'student'
  end;

  insert into public.profiles (id, email, full_name, role)
  values (new.id, lower(new.email), resolved_name, resolved_role)
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    updated_at = now();

  insert into public.student_metrics (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user_profile();

insert into public.profiles (id, email, full_name, role)
select
  au.id,
  lower(au.email),
  coalesce(
    nullif(au.raw_user_meta_data ->> 'full_name', ''),
    nullif(au.raw_user_meta_data ->> 'name', ''),
    split_part(au.email, '@', 1)
  ),
  case
    when lower(au.email) in (
      'hugocamposdecarvalho@gmail.com',
      'roosevelt.miranda@gmail.com'
    ) then 'admin'
    else 'student'
  end
from auth.users au
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  updated_at = now();

insert into public.student_metrics (user_id)
select p.id
from public.profiles p
on conflict (user_id) do nothing;

alter table public.profiles enable row level security;
alter table public.student_metrics enable row level security;
alter table public.student_scores enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin_email());

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert
on public.profiles
for insert
to authenticated
with check (id = auth.uid() or public.is_admin_email());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.is_admin_email())
with check (id = auth.uid() or public.is_admin_email());

drop policy if exists metrics_select on public.student_metrics;
create policy metrics_select
on public.student_metrics
for select
to authenticated
using (user_id = auth.uid() or public.is_admin_email());

drop policy if exists metrics_insert on public.student_metrics;
create policy metrics_insert
on public.student_metrics
for insert
to authenticated
with check (user_id = auth.uid() or public.is_admin_email());

drop policy if exists metrics_update on public.student_metrics;
create policy metrics_update
on public.student_metrics
for update
to authenticated
using (user_id = auth.uid() or public.is_admin_email())
with check (user_id = auth.uid() or public.is_admin_email());

drop policy if exists scores_select on public.student_scores;
create policy scores_select
on public.student_scores
for select
to authenticated
using (user_id = auth.uid() or public.is_admin_email());

drop policy if exists scores_insert on public.student_scores;
create policy scores_insert
on public.student_scores
for insert
to authenticated
with check (user_id = auth.uid() or public.is_admin_email());

drop policy if exists scores_update on public.student_scores;
create policy scores_update
on public.student_scores
for update
to authenticated
using (user_id = auth.uid() or public.is_admin_email())
with check (user_id = auth.uid() or public.is_admin_email());
