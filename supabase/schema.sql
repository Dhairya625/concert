-- ============================================
-- Coldplay × Minecraft — Supabase Schema
-- Run in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================
-- TICKET TYPES
-- ============================================
create table if not exists ticket_types (
  id           text primary key,          -- 'emerald' | 'diamond' | 'vip'
  name         text not null,
  price        integer not null,          -- INR paise
  total        integer not null,
  available    integer not null,
  description  text,
  created_at   timestamptz default now()
);

-- Seed ticket types
insert into ticket_types (id, name, price, total, available, description) values
  ('rabdies', 'Rabdies', 6900, 500, 500, 'General admission. Experience the band in the Minecraft world.')
on conflict (id) do nothing;

-- ============================================
-- ORDERS
-- ============================================
create table if not exists orders (
  id                 uuid primary key default gen_random_uuid(),
  razorpay_order_id  text unique not null,
  amount             integer not null,       -- INR paise
  currency           text not null default 'INR',
  status             text not null default 'created', -- created | paid | failed
  ticket_type_id     text not null references ticket_types(id),
  quantity           integer not null default 1,
  user_email         text not null,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

-- Index for fast lookup
create index if not exists idx_orders_razorpay on orders(razorpay_order_id);
create index if not exists idx_orders_email on orders(user_email);

-- ============================================
-- BOOKINGS
-- ============================================
create table if not exists bookings (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references orders(id),
  ticket_type_id   text not null references ticket_types(id),
  quantity         integer not null default 1,
  user_email       text not null,
  first_name       text not null,
  last_name        text not null,
  phone            text not null,
  total_amount     integer not null,         -- INR paise
  status           text not null default 'confirmed', -- confirmed | cancelled | pending
  booking_code     text unique not null,
  razorpay_payment_id text,
  created_at       timestamptz default now()
);

create index if not exists idx_bookings_email on bookings(user_email);
create index if not exists idx_bookings_code  on bookings(booking_code);

-- ============================================
-- TRIGGER: Decrement available on booking
-- ============================================
create or replace function decrement_ticket_availability()
returns trigger as $$
declare
  v_rows_affected integer;
begin
  update ticket_types
  set available = available - NEW.quantity
  where id = NEW.ticket_type_id
    and available >= NEW.quantity;

  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
  
  if v_rows_affected = 0 then
    raise exception 'Not enough tickets available for %', NEW.ticket_type_id;
  end if;

  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trg_decrement_availability on bookings;
create trigger trg_decrement_availability
  before insert on bookings
  for each row execute function decrement_ticket_availability();

-- ============================================
-- RLS POLICIES
-- ============================================

-- ticket_types: public read
alter table ticket_types enable row level security;
create policy "Public can read ticket types"
  on ticket_types for select using (true);

-- orders: users see own orders (or service role bypasses)
alter table orders enable row level security;
create policy "Users read own orders"
  on orders for select
  using (auth.email() = user_email);
create policy "Service role manages orders"
  on orders for all
  using (auth.role() = 'service_role');

-- bookings: users see own bookings
alter table bookings enable row level security;
create policy "Users read own bookings"
  on bookings for select
  using (auth.email() = user_email);
create policy "Service role manages bookings"
  on bookings for all
  using (auth.role() = 'service_role');

-- ============================================
-- UPDATED_AT trigger for orders
-- ============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trg_orders_updated_at on orders;
create trigger trg_orders_updated_at
  before update on orders
  for each row execute function update_updated_at();
