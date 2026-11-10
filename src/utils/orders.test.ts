import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildOrderPayload, newRequestId, orderErrorMessage, CheckoutForm } from './orders';
import {
  FREE_SHIPPING_THRESHOLD,
  MAX_LINE_QUANTITY,
  STANDARD_SHIPPING_FEE,
  TAX_RATE,
  validatePromoCode,
} from './cart';
import { SNEAKERS } from '../data/products';
import { CartItem } from '../types';

const form: CheckoutForm = {
  name: 'Test Buyer',
  email: 'buyer@example.com',
  address: '1 Test St',
  city: 'Testville',
  state: 'CA',
  zip: '90001',
  paymentMethod: 'cod',
};

test('buildOrderPayload sends ids, sizes and quantities but never prices', () => {
  const cart: CartItem[] = [
    { sneaker: SNEAKERS[2], selectedSize: 10, selectedColorIndex: 1, quantity: 2 },
  ];
  const payload = buildOrderPayload(cart, form, '  kicks10 ', 'req-1');

  assert.deepEqual(payload.p_items, [
    { sneaker_id: SNEAKERS[2].id, size: 10, color_index: 1, quantity: 2 },
  ]);
  assert.equal(payload.p_request_id, 'req-1');
  assert.equal(payload.p_payment_method, 'cod');
  assert.equal(payload.p_promo, 'kicks10');
  assert.equal(payload.p_shipping.zip, '90001');
  assert.ok(!JSON.stringify(payload).includes('price'));
});

test('buildOrderPayload sends null when no promo is applied', () => {
  assert.equal(buildOrderPayload([], form, '   ', 'req-2').p_promo, null);
});

test('newRequestId returns distinct v4 UUIDs, with or without crypto.randomUUID', () => {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  assert.match(newRequestId(), uuid);
  assert.notEqual(newRequestId(), newRequestId());

  // Insecure contexts (plain http on a LAN address) have no randomUUID.
  const original = crypto.randomUUID;
  Object.defineProperty(crypto, 'randomUUID', { value: undefined, configurable: true });
  try {
    assert.match(newRequestId(), uuid);
  } finally {
    Object.defineProperty(crypto, 'randomUUID', { value: original, configurable: true });
  }
});

test('orderErrorMessage maps place_order codes and hides everything else', () => {
  assert.match(orderErrorMessage('invalid_promo'), /promo/i);
  assert.match(orderErrorMessage('rate_limited'), /too many/i);
  assert.equal(
    orderErrorMessage('new row violates check constraint "orders_ship_zip_check"'),
    'We could not place your order. Please try again.'
  );
});

// Drift guard: supabase/schema.sql duplicates the catalog prices, promo percents and cart constants.
const sql = readFileSync(
  fileURLToPath(new URL('../../supabase/schema.sql', import.meta.url)),
  'utf8'
);

test('schema.sql products seed matches SNEAKERS (also covers wishlist foreign keys)', () => {
  const seed = [...sql.matchAll(/^\s*\('([a-z0-9-]+)', '((?:[^']|'')*)', ([\d.]+)\),?\s*$/gm)].map(
    (m) => ({ id: m[1], name: m[2].replaceAll("''", "'"), price: Number(m[3]) })
  );
  const expected = SNEAKERS.map((s) => ({ id: s.id, name: s.name, price: s.price }));
  const byId = (a: { id: string }, b: { id: string }) => a.id.localeCompare(b.id);

  assert.deepEqual(seed.sort(byId), expected.sort(byId));
});

test('schema.sql promo seed and cart constants match src/utils/cart.ts', () => {
  const promos = [...sql.matchAll(/^\s*\('([A-Z0-9]+)', (\d+)\),?\s*$/gm)];
  assert.ok(promos.length > 0);
  for (const [, code, percent] of promos) {
    assert.equal(validatePromoCode(code).discountPercent, Number(percent), code);
  }

  assert.ok(
    sql.includes(
      `v_subtotal >= ${FREE_SHIPPING_THRESHOLD} then 0 else ${STANDARD_SHIPPING_FEE} end`
    )
  );
  assert.ok(sql.includes(`* ${TAX_RATE}, 2)`));
  assert.ok(sql.includes(`l.quantity between 1 and ${MAX_LINE_QUANTITY}`));
});
