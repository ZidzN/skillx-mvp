-- SKILLX MVP schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  headline text,
  bio text,
  skills text[] default '{}',
  hourly_rate integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  budget integer not null default 0 check (budget >= 0),
  skills text[] default '{}',
  status text not null default 'open' check (status in ('open','in_progress','completed','cancelled')),
  academic_integrity_ack boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  cover_note text,
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  created_at timestamptz not null default now(),
  unique(project_id, applicant_id)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewee_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique(project_id, reviewer_id, reviewee_id)
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.applications enable row level security;
alter table public.reviews enable row level security;

-- Profiles: public read, owner write.
create policy "profiles public read" on public.profiles for select using (true);
create policy "profiles owner update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles owner insert" on public.profiles for insert to authenticated with check (auth.uid() = id);

-- Projects: public read, authenticated users create; owner update/delete.
create policy "projects public read" on public.projects for select using (true);
create policy "projects authenticated insert" on public.projects for insert to authenticated with check (auth.uid() = owner_id);
create policy "projects owner update" on public.projects for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "projects owner delete" on public.projects for delete to authenticated using (auth.uid() = owner_id);

-- Applications: applicant can create/view own; project owner can view/update.
create policy "applications applicant insert" on public.applications for insert to authenticated
with check (auth.uid() = applicant_id);
create policy "applications participant read" on public.applications for select to authenticated
using (
  auth.uid() = applicant_id
  or exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
);
create policy "applications project owner update" on public.applications for update to authenticated
using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

-- Reviews: participants can read; reviewer creates their own review.
create policy "reviews public read" on public.reviews for select using (true);
create policy "reviews reviewer insert" on public.reviews for insert to authenticated with check (auth.uid() = reviewer_id);
create policy "reviews reviewer update" on public.reviews for update to authenticated using (auth.uid() = reviewer_id);

-- Automatically create a profile after signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Seed a few demo projects only if the table is empty.
-- Remove this block if you want a completely empty production database.
