-- KICKS. storefront: Supabase schema (single file, safe to re-run).
--
-- SETUP
--   1. Create a Supabase project. Copy its URL and anon/publishable key into .env.local as
--      VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Never put the service_role key in the browser.
--   2. Paste this whole file into Dashboard > SQL Editor and run it.
--   3. Auth > URL Configuration: set Site URL to http://localhost:3000 and add it to Redirect URLs.
--   4. Auth > Providers > Email: keep "Confirm email" on for production (turn it off for local testing if you
--      don't want to click email links). Consider raising the minimum password length to 8.
--
-- SECURITY MODEL
--   The anon key is public, so row-level security (RLS) is the backend.
--   * orders / order_items: clients can only SELECT their own rows. Orders are written only by place_order().
--   * wishlist_items: clients can SELECT / INSERT / DELETE their own rows only.
--   * products / promo_codes: no client access at all; only place_order() reads them.
--
-- DUPLICATED CONSTANTS (keep in sync; src/utils/orders.test.ts fails if the seeds or constants drift)
--   * products seed       <-> src/data/products.ts (id, name, price)
--   * promo_codes seed    <-> validatePromoCode in src/utils/cart.ts
--   * 150 free-shipping threshold, 15 shipping fee, 0.08 tax rate <-> src/utils/cart.ts

-- ---------------------------------------------------------------------------
-- Reference data (server-side pricing). RLS on with no policies = closed to clients.
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id    text primary key,
  name  text not null,
  price numeric(10,2) not null check (price >= 0)
);

create table if not exists public.promo_codes (
  code    text primary key check (code = upper(code)),
  percent integer not null check (percent between 1 and 90)
);

alter table public.products enable row level security;
alter table public.promo_codes enable row level security;
revoke all on public.products, public.promo_codes from anon, authenticated;

insert into public.products (id, name, price) values
  ('nike-dunk-low', 'Nike Dunk Low', 120.00),
  ('new-balance-9060', 'New Balance 9060', 150.00),
  ('jordan-4-retro', 'Jordan 4 Retro', 199.99),
  ('adidas-samba-og', 'Adidas Samba OG', 110.00),
  ('nike-air-force-1-07', 'Nike Air Force 1 ''07', 110.00),
  ('air-jordan-1-retro', 'Air Jordan 1 Retro', 180.00),
  ('new-balance-530', 'New Balance 530', 130.00),
  ('adidas-campus-00s', 'Adidas Campus 00s', 120.00),
  ('nike-vomero-5', 'Nike Vomero 5', 160.00),
  ('asics-gel-kayano-14', 'Asics Gel-Kayano 14', 150.00),
  ('salomon-xt-6', 'Salomon XT-6', 180.00),
  ('converse-run-star', 'Converse Run Star', 120.00),
  ('air-jordan-4-black-cat', 'Air Jordan 4 Retro "Black Cat"', 295.00),
  ('travis-scott-aj1-phantom', 'Travis Scott x AJ1 Low "Phantom"', 390.00)
on conflict (id) do update set name = excluded.name, price = excluded.price;

insert into public.promo_codes (code, percent) values
  ('KICKS10', 10),
  ('NEXTSTEP', 15),
  ('VIP20', 20),
  ('DROPS', 10)
on conflict (code) do update set percent = excluded.percent;

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create sequence if not exists public.order_number_seq start 100001;
revoke all on sequence public.order_number_seq from anon, authenticated;

create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users (id) on delete cascade,
  order_number      text not null unique,
  client_request_id uuid not null,
  subtotal          numeric(10,2) not null,
  discount          numeric(10,2) not null,
  shipping          numeric(10,2) not null,
  tax               numeric(10,2) not null,
  total             numeric(10,2) not null,
  promo_code        text,
  payment_method    text not null check (payment_method in ('card', 'cod')),
  ship_name         text not null check (char_length(ship_name) between 1 and 100),
  ship_email        text not null check (char_length(ship_email) between 3 and 254),
  ship_address      text not null check (char_length(ship_address) between 1 and 200),
  ship_city         text not null check (char_length(ship_city) between 1 and 100),
  ship_state        text not null check (char_length(ship_state) between 1 and 100),
  ship_zip          text not null check (char_length(ship_zip) between 1 and 20),
  status            text not null default 'placed',
  created_at        timestamptz not null default now(),
  unique (user_id, client_request_id)
);
create index if not exists orders_user_created_idx on public.orders (user_id, created_at desc);

create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders (id) on delete cascade,
  sneaker_id  text not null,
  name        text not null,
  size        numeric(4,1) not null check (size between 3 and 20),
  color_index integer not null check (color_index between 0 and 20),
  quantity    integer not null check (quantity between 1 and 10),
  unit_price  numeric(10,2) not null
);
create index if not exists order_items_order_idx on public.order_items (order_id);

-- ---------------------------------------------------------------------------
-- Wishlist (the only table clients write directly)
-- ---------------------------------------------------------------------------
create table if not exists public.wishlist_items (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  sneaker_id text not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, sneaker_id)
);

-- ---------------------------------------------------------------------------
-- Row-level security and privileges
-- ---------------------------------------------------------------------------
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlist_items enable row level security;

revoke all on public.orders, public.order_items, public.wishlist_items from anon, authenticated;
grant select on public.orders, public.order_items to authenticated;
grant select, insert, delete on public.wishlist_items to authenticated;

drop policy if exists "orders: read own" on public.orders;
create policy "orders: read own" on public.orders
  for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "order_items: read own" on public.order_items;
create policy "order_items: read own" on public.order_items
  for select to authenticated
  using (exists (
    select 1 from public.orders o
    where o.id = order_id and o.user_id = (select auth.uid())
  ));

drop policy if exists "wishlist: read own" on public.wishlist_items;
create policy "wishlist: read own" on public.wishlist_items
  for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "wishlist: insert own" on public.wishlist_items;
create policy "wishlist: insert own" on public.wishlist_items
  for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "wishlist: delete own" on public.wishlist_items;
create policy "wishlist: delete own" on public.wishlist_items
  for delete to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- place_order: the only way to create an order.
-- Prices, discount, shipping and tax are computed here; the client sends line ids/sizes/quantities only.
-- Errors raised for the client to recognise: not_authenticated, invalid_items, invalid_shipping,
-- invalid_payment, invalid_promo, rate_limited.
-- ---------------------------------------------------------------------------
create or replace function public.place_order(
  p_request_id     uuid,
  p_items          jsonb,
  p_shipping       jsonb,
  p_payment_method text,
  p_promo          text default null
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid        uuid := auth.uid();
  v_existing   public.orders;
  v_order_id   uuid;
  v_number     text;
  v_line_count integer;
  v_priced     integer;
  v_subtotal   numeric(10,2);
  v_code       text := upper(btrim(coalesce(p_promo, '')));
  v_pct        integer := 0;
  v_discount   numeric(10,2);
  v_shipping   numeric(10,2);
  v_tax        numeric(10,2);
  v_total      numeric(10,2);
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_request_id is null then
    raise exception 'invalid_items';
  end if;

  -- Replay of an order this user already placed with the same request id: return it unchanged.
  select * into v_existing from public.orders
   where user_id = v_uid and client_request_id = p_request_id;
  if found then
    return jsonb_build_object('order_number', v_existing.order_number, 'total', v_existing.total);
  end if;

  if jsonb_typeof(p_items) is distinct from 'array' then
    raise exception 'invalid_items';
  end if;
  v_line_count := jsonb_array_length(p_items);
  if v_line_count < 1 or v_line_count > 50 then
    raise exception 'invalid_items';
  end if;
  if jsonb_typeof(p_shipping) is distinct from 'object' then
    raise exception 'invalid_shipping';
  end if;
  if p_payment_method is null or p_payment_method not in ('card', 'cod') then
    raise exception 'invalid_payment';
  end if;

  -- Price every line from public.products. A line that is unknown or out of range is not counted.
  select count(*), coalesce(sum(p.price * l.quantity), 0)
    into v_priced, v_subtotal
    from jsonb_to_recordset(p_items) as l(sneaker_id text, size numeric, color_index integer, quantity integer)
    join public.products p on p.id = l.sneaker_id
   where l.quantity between 1 and 10
     and l.size between 3 and 20
     and l.color_index between 0 and 20;
  if v_priced <> v_line_count then
    raise exception 'invalid_items';
  end if;

  if v_code <> '' then
    select percent into v_pct from public.promo_codes where code = v_code;
    if not found then
      raise exception 'invalid_promo';
    end if;
  end if;

  if (select count(*) from public.orders
       where user_id = v_uid and created_at > now() - interval '1 hour') >= 20 then
    raise exception 'rate_limited';
  end if;

  -- Mirrors calculateCartTotals in src/utils/cart.ts.
  v_discount := round(v_subtotal * v_pct / 100.0, 2);
  v_shipping := case when v_subtotal >= 150 then 0 else 15 end;
  v_tax      := round((v_subtotal - v_discount) * 0.08, 2);
  v_total    := v_subtotal - v_discount + v_shipping + v_tax;
  v_number   := 'KICKS-' || nextval('public.order_number_seq');

  insert into public.orders (
    user_id, order_number, client_request_id, subtotal, discount, shipping, tax, total,
    promo_code, payment_method, ship_name, ship_email, ship_address, ship_city, ship_state, ship_zip
  ) values (
    v_uid, v_number, p_request_id, v_subtotal, v_discount, v_shipping, v_tax, v_total,
    nullif(v_code, ''), p_payment_method,
    btrim(p_shipping ->> 'name'), btrim(p_shipping ->> 'email'), btrim(p_shipping ->> 'address'),
    btrim(p_shipping ->> 'city'), btrim(p_shipping ->> 'state'), btrim(p_shipping ->> 'zip')
  )
  on conflict (user_id, client_request_id) do nothing
  returning id into v_order_id;

  if v_order_id is null then
    -- An identical request committed between the replay check and this insert.
    select * into v_existing from public.orders
     where user_id = v_uid and client_request_id = p_request_id;
    return jsonb_build_object('order_number', v_existing.order_number, 'total', v_existing.total);
  end if;

  insert into public.order_items (order_id, sneaker_id, name, size, color_index, quantity, unit_price)
  select v_order_id, p.id, p.name, l.size, l.color_index, l.quantity, p.price
    from jsonb_to_recordset(p_items) as l(sneaker_id text, size numeric, color_index integer, quantity integer)
    join public.products p on p.id = l.sneaker_id;

  return jsonb_build_object('order_number', v_number, 'total', v_total);
end;
$$;

revoke all on function public.place_order(uuid, jsonb, jsonb, text, text) from public, anon;
grant execute on function public.place_order(uuid, jsonb, jsonb, text, text) to authenticated;
