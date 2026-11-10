import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCartTotals, validatePromoCode, formatPrice } from './cart';
import { CartItem, Sneaker } from '../types';

const mockSneaker: Sneaker = {
  id: 'snk-jordan-4',
  name: 'Air Jordan 4 Retro',
  brand: 'Jordan',
  category: 'Basketball',
  collectionType: 'best-sellers',
  price: 189.99,
  rating: 4.9,
  reviewsCount: 142,
  image: '',
  silhouette: 'jordan4',
  colors: ['#000000', '#FFFFFF'],
  colorwayNames: ['White Cement', 'Bred'],
  sizes: [8, 9, 10, 11],
  description: 'Iconic performance silhouette.',
  details: ['Visible Air cushioning', 'Mesh netting inserts'],
};

test('empty cart calculates zero total and shipping', () => {
  const result = calculateCartTotals([]);
  assert.equal(result.subtotal, 0);
  assert.equal(result.total, 0);
  assert.equal(result.shippingFee, 0);
  assert.equal(result.itemCount, 0);
});

test('subtotal over $150 qualifies for free shipping', () => {
  const items: CartItem[] = [
    {
      sneaker: mockSneaker,
      selectedSize: 10,
      selectedColorIndex: 0,
      quantity: 1,
    },
  ];
  const result = calculateCartTotals(items);
  assert.equal(result.subtotal, 189.99);
  assert.equal(result.isFreeShipping, true);
  assert.equal(result.shippingFee, 0);
  assert.equal(result.freeShippingRemaining, 0);
  assert.equal(result.freeShippingProgress, 100);
});

test('subtotal under $150 incurs standard shipping fee', () => {
  const lowPriceSneaker: Sneaker = {
    ...mockSneaker,
    id: 'samba',
    price: 110.0,
  };
  const items: CartItem[] = [
    {
      sneaker: lowPriceSneaker,
      selectedSize: 9,
      selectedColorIndex: 0,
      quantity: 1,
    },
  ];
  const result = calculateCartTotals(items);
  assert.equal(result.subtotal, 110.0);
  assert.equal(result.isFreeShipping, false);
  assert.equal(result.shippingFee, 15);
  assert.equal(result.freeShippingRemaining, 40.0);
});

test('promo code KICKS10 applies 10% discount', () => {
  const codeCheck = validatePromoCode('KICKS10');
  assert.equal(codeCheck.valid, true);
  assert.equal(codeCheck.discountPercent, 10);

  const items: CartItem[] = [
    {
      sneaker: { ...mockSneaker, price: 100 },
      selectedSize: 10,
      selectedColorIndex: 0,
      quantity: 1,
    },
  ];
  const result = calculateCartTotals(items, 10);
  assert.equal(result.discountAmount, 10);
});

test('invalid promo code is rejected with helpful message', () => {
  const codeCheck = validatePromoCode('BOGUS_CODE');
  assert.equal(codeCheck.valid, false);
  assert.equal(codeCheck.discountPercent, 0);
});

test('formatPrice formats amounts cleanly', () => {
  assert.equal(formatPrice(189.99), '$189.99');
  assert.equal(formatPrice(110), '$110.00');
});
