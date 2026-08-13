-- Hosted backend for multi-device RepRoot accounts and future partner features.
-- Run this file in the connected Supabase project's SQL editor before deploying.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.training_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  schema_version integer not null default 4,
  updated_at timestamptz not null default now()
);

create table if not exists public.partner_links (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  partner_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint different_partner_accounts check (requester_id <> partner_id),
  constraint one_partner_pair unique (requester_id, partner_id)
);

alter table public.profiles enable row level security;
alter table public.training_snapshots enable row level security;
alter table public.partner_links enable row level security;

grant select, update on public.profiles to authenticated;
grant select, insert, update on public.training_snapshots to authenticated;
grant select, insert on public.partner_links to authenticated;

create policy "Profiles are private"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

create policy "Users can update their profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users can read their training snapshot"
on public.training_snapshots for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their training snapshot"
on public.training_snapshots for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their training snapshot"
on public.training_snapshots for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Partners can view their link"
on public.partner_links for select to authenticated
using ((select auth.uid()) in (requester_id, partner_id));

create policy "Users can request a partner link"
on public.partner_links for insert to authenticated
with check ((select auth.uid()) = requester_id and status = 'pending');

-- Only the invited partner may change the status column. Keep all other partner
-- link columns immutable through the browser API.
revoke update on public.partner_links from authenticated;
grant update (status, updated_at) on public.partner_links to authenticated;

create policy "Invited users can answer partner requests"
on public.partner_links for update to authenticated
using ((select auth.uid()) = partner_id)
with check ((select auth.uid()) = partner_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
