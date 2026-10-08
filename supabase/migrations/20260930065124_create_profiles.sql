-- Profiles: one strategy row per auth user. Nested UserProfile fields stay JSONB.
-- Security definer helpers live in private (not exposed via the Data API).

create schema if not exists private;

revoke all on schema private from public;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- First-pass signup without a mailbox: confirm the email at insert time.
create or replace function private.auto_confirm_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is not null and new.email_confirmed_at is null then
    new.email_confirmed_at := now();
  end if;
  return new;
end;
$$;

create or replace function private.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from auth.users where id = (select auth.uid());
end;
$$;

revoke all on function private.set_updated_at() from public, anon, authenticated;
revoke all on function private.handle_new_user() from public, anon, authenticated;
revoke all on function private.auto_confirm_email() from public, anon, authenticated;
revoke all on function private.delete_own_account() from public, anon;
grant execute on function private.delete_own_account() to authenticated;
grant usage on schema private to authenticated;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  financial jsonb not null default '{
    "ageRange": "25_34",
    "employmentStatus": "employed_full_time",
    "annualIncome": 60000,
    "housingStatus": "rent",
    "monthlyHousingPayment": 1500,
    "monthlySpending": 2500,
    "numOpenAccounts": 0,
    "creditAgeMonths": 0,
    "creditScoreBand": "good",
    "utilization": "30_50",
    "recentApplications6mo": 0,
    "recentHardInquiries6mo": 0,
    "hasExistingLoans": false,
    "loanTypes": [],
    "annualFeeTolerance": "low"
  }'::jsonb,
  spending jsonb not null default '{
    "monthlyDining": 200,
    "monthlyGroceries": 300,
    "monthlyGas": 100,
    "monthlyTravel": 100,
    "monthlyOnline": 150,
    "monthlyOther": 200
  }'::jsonb,
  issuer_relationships jsonb not null default '{
    "chase": {"issuerId": "chase", "checking": false, "savings": false, "investment": false},
    "capital_one": {"issuerId": "capital_one", "checking": false, "savings": false, "investment": false},
    "amex": {"issuerId": "amex", "checking": false, "savings": false, "investment": false},
    "citi": {"issuerId": "citi", "checking": false, "savings": false, "investment": false},
    "bank_of_america": {"issuerId": "bank_of_america", "checking": false, "savings": false, "investment": false},
    "wells_fargo": {"issuerId": "wells_fargo", "checking": false, "savings": false, "investment": false},
    "us_bank": {"issuerId": "us_bank", "checking": false, "savings": false, "investment": false},
    "discover": {"issuerId": "discover", "checking": false, "savings": false, "investment": false}
  }'::jsonb,
  owned_cards jsonb not null default '[]'::jsonb,
  goals jsonb not null default '[]'::jsonb,
  travel jsonb not null default '{
    "favoriteAirlines": [],
    "favoriteHotels": [],
    "travelFrequency": "rarely",
    "scope": "mostly_domestic",
    "cabinPreference": "economy"
  }'::jsonb,
  onboarding_complete boolean not null default false,
  next_review_date date default (current_date + 90),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One strategy profile per auth user. Nested financial data is stored as JSONB matching the client UserProfile type.';

alter table public.profiles enable row level security;

create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy profiles_insert_own
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy profiles_delete_own
  on public.profiles
  for delete
  to authenticated
  using ((select auth.uid()) = id);

grant select, insert, update, delete on table public.profiles to authenticated;
revoke all on table public.profiles from anon;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function private.set_updated_at();

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function private.handle_new_user();

create trigger on_auth_user_auto_confirm
  before insert on auth.users
  for each row
  execute function private.auto_confirm_email();

create or replace function public.delete_own_account()
returns void
language sql
security invoker
set search_path = private
as $$
  select private.delete_own_account();
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
comment on function public.delete_own_account() is 'Deletes the calling auth user; profile row cascades.';
