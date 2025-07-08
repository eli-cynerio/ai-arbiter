/*
  # AI Arbiter: Initial Schema & RLS Policies (Idempotent)
  This migration sets up the complete database structure for the MVP.
  It has been updated to be fully idempotent, meaning it can be run multiple times without causing errors.

  **Key Changes for Idempotency:**
  - `CREATE TYPE` statements are wrapped in `DO $$ ... END$$` blocks to prevent errors if types already exist.
  - `CREATE TABLE` statements now use `IF NOT EXISTS`.
  - `CREATE POLICY` statements are preceded by `DROP POLICY IF EXISTS` to ensure they can be re-applied safely.
  - `CREATE INDEX` statements now use `IF NOT EXISTS`.

  **Schema Overview:**
  1.  **Extensions**: Enables `uuid-ossp` and `pgcrypto`.
  2.  **Types**: Creates ENUMs for `conflict_status`, `member_role`, and `arbiter_type`.
  3.  **Tables**: Defines all core tables (`users`, `conflicts`, etc.).
  4.  **Functions**: Adds helper functions `get_my_role_in_conflict` and `hash_phone`.
  5.  **Security**: Enables RLS and applies comprehensive policies.
*/

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pgcrypto" with schema extensions;

-- 2. ENUM TYPES (Idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'conflict_status') THEN
    create type public.conflict_status as enum (
      'collecting',   -- parties entering inputs
      'reviewing',    -- arbiter asking questions
      'decided',      -- AI decision ready, appeal window
      'appeal',       -- in appeal loop
      'final'         -- final decision issued
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'member_role') THEN
    create type public.member_role as enum (
      'partyA','partyB',
      'witness1','witness2',
      'arb'                 -- optional human arbitrator
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'arbiter_type') THEN
    create type public.arbiter_type as enum ('ai','human');
  END IF;
END$$;


-- 3. HELPER FUNCTION for getting user role in a conflict
create or replace function public.get_my_role_in_conflict(p_conflict_id uuid)
returns text language sql security definer as
$$
  select role::text from public.conflict_members
  where conflict_id = p_conflict_id and user_id = auth.uid();
$$;

-- 4. TABLES (Idempotent)

-- 4.1 users
create table if not exists public.users (
  id           uuid primary key default auth.uid(),
  phone_hash   text unique not null,
  lang         text default 'en' check (lang in ('en', 'he')),
  created_at   timestamptz default now() not null
);
comment on table public.users is 'Stores user profile information.';

-- 4.2 conflicts
create table if not exists public.conflicts (
  id             uuid primary key default extensions.uuid_generate_v4(),
  creator_id     uuid references public.users(id) on delete set null,
  title          text not null check (char_length(title) > 0),
  description    text,
  language       text default 'en' check (language in ('en', 'he')),
  status         public.conflict_status default 'collecting' not null,
  created_at     timestamptz default now() not null
);
comment on table public.conflicts is 'Represents a single dispute case.';
create index if not exists conflicts_creator_id_idx on public.conflicts (creator_id);
create index if not exists conflicts_status_idx on public.conflicts (status);

-- 4.3 conflict_members
create table if not exists public.conflict_members (
  conflict_id     uuid references public.conflicts(id) on delete cascade not null,
  user_id         uuid references public.users(id) on delete cascade not null,
  role            public.member_role not null,
  display_name    text not null,
  ready_for_decision boolean default false not null,
  appeal_used     boolean default false not null,
  joined_at       timestamptz default now() not null,
  primary key (conflict_id, user_id)
);
comment on table public.conflict_members is 'Links users to conflicts and defines their roles.';
create index if not exists conflict_members_user_id_idx on public.conflict_members (user_id);

-- 4.4 inputs
create table if not exists public.inputs (
  id            uuid primary key default extensions.uuid_generate_v4(),
  conflict_id   uuid references public.conflicts(id) on delete cascade not null,
  author_id     uuid references public.users(id) on delete cascade not null,
  content       text not null check (char_length(content) <= 5000),
  created_at    timestamptz default now() not null,
  updated_at    timestamptz
);
comment on table public.inputs is 'Stores arguments and evidence from parties and witnesses.';
create index if not exists inputs_conflict_id_author_id_idx on public.inputs (conflict_id, author_id);

-- 4.5 questions
create table if not exists public.questions (
  id            uuid primary key default extensions.uuid_generate_v4(),
  conflict_id   uuid references public.conflicts(id) on delete cascade not null,
  to_user_id    uuid references public.users(id) on delete cascade not null,
  question_text text not null,
  answer_text   text,
  answered      boolean default false not null,
  created_at    timestamptz default now() not null
);
comment on table public.questions is 'Questions generated by the arbiter for specific users.';
create index if not exists questions_conflict_id_to_user_id_idx on public.questions (conflict_id, to_user_id);

-- 4.6 decisions
create table if not exists public.decisions (
  conflict_id     uuid primary key references public.conflicts(id) on delete cascade not null,
  arbiter_type    public.arbiter_type not null,
  decision_text   text not null,
  confidence      numeric check (confidence between 0 and 1),
  iteration       int default 1 not null,
  created_at      timestamptz default now() not null
);
comment on table public.decisions is 'Stores the final decision for a conflict.';

-- 4.7 audit_log
create table if not exists public.audit_log (
  id           uuid primary key default extensions.uuid_generate_v4(),
  conflict_id  uuid references public.conflicts(id) on delete cascade,
  user_id      uuid references public.users(id) on delete set null,
  event        text not null,
  meta         jsonb,
  created_at   timestamptz default now() not null
);
comment on table public.audit_log is 'Tracks significant events for auditing and debugging.';
create index if not exists audit_log_conflict_id_idx on public.audit_log (conflict_id);

-- 5. RLS POLICIES (Idempotent)
alter table public.users enable row level security;
alter table public.conflicts enable row level security;
alter table public.conflict_members enable row level security;
alter table public.inputs enable row level security;
alter table public.questions enable row level security;
alter table public.decisions enable row level security;
alter table public.audit_log enable row level security;

-- Users
drop policy if exists "Users can view and update own data" on public.users;
create policy "Users can view and update own data" on public.users
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Conflicts
drop policy if exists "Members can view their conflicts" on public.conflicts;
create policy "Members can view their conflicts" on public.conflicts
  for select using (id in (select conflict_id from public.conflict_members where user_id = auth.uid()));

drop policy if exists "Authenticated users can create conflicts" on public.conflicts;
create policy "Authenticated users can create conflicts" on public.conflicts
  for insert with check (auth.uid() is not null);

-- Conflict Members
drop policy if exists "Members can view other members in their conflict" on public.conflict_members;
create policy "Members can view other members in their conflict" on public.conflict_members
  for select using (conflict_id in (select conflict_id from public.conflict_members where user_id = auth.uid()));

drop policy if exists "Parties can update their own ready status" on public.conflict_members;
create policy "Parties can update their own ready status" on public.conflict_members
  for update using (user_id = auth.uid() and get_my_role_in_conflict(conflict_id) in ('partyA', 'partyB'))
  with check (user_id = auth.uid());

-- Inputs
drop policy if exists "Members can create inputs" on public.inputs;
create policy "Members can create inputs" on public.inputs
  for insert with check (author_id = auth.uid() and conflict_id in (select conflict_id from public.conflict_members where user_id = auth.uid()));

drop policy if exists "Authors can update own inputs before review" on public.inputs;
create policy "Authors can update own inputs before review" on public.inputs
  for update using (author_id = auth.uid() and (select status from public.conflicts where id = conflict_id) = 'collecting')
  with check (author_id = auth.uid());

drop policy if exists "Users can view inputs based on role" on public.inputs;
create policy "Users can view inputs based on role" on public.inputs
  for select using (
    author_id = auth.uid() OR
    'arb' = get_my_role_in_conflict(conflict_id) OR
    (
      get_my_role_in_conflict(conflict_id) in ('partyA', 'partyB') AND
      (select role from public.conflict_members where user_id = author_id and conflict_id = public.inputs.conflict_id) in ('partyA', 'partyB')
    )
  );

-- Questions
drop policy if exists "Users can see questions for them or if they are arb" on public.questions;
create policy "Users can see questions for them or if they are arb" on public.questions
  for select using (to_user_id = auth.uid() or 'arb' = get_my_role_in_conflict(conflict_id));

drop policy if exists "Users can answer their questions" on public.questions;
create policy "Users can answer their questions" on public.questions
  for update using (to_user_id = auth.uid() and answered = false) with check (to_user_id = auth.uid());

-- Decisions
drop policy if exists "Members can view decisions for their conflict" on public.decisions;
create policy "Members can view decisions for their conflict" on public.decisions
  for select using (conflict_id in (select conflict_id from public.conflict_members where user_id = auth.uid()));

-- Audit Log
drop policy if exists "Deny all access to audit_log" on public.audit_log;
create policy "Deny all access to audit_log" on public.audit_log for all using (false);

-- 6. HELPER FUNCTION: phone hash
create or replace function public.hash_phone(p_phone text)
returns text language sql security definer as
$$
  select encode(digest(p_phone, 'sha256'), 'hex');
$$;