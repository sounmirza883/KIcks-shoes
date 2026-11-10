import test from 'node:test';
import assert from 'node:assert/strict';
import { filterAndSortSneakers, INITIAL_STORE_FILTERS } from './store.ts';
import { SNEAKERS } from '../data/products.ts';

test('filterAndSortSneakers with default filters returns full catalog', () => {
  const result = filterAndSortSneakers(SNEAKERS, INITIAL_STORE_FILTERS);
  assert.equal(result.length, SNEAKERS.length);
});

test('filterAndSortSneakers filters correctly by category', () => {
  const running = filterAndSortSneakers(SNEAKERS, {
    ...INITIAL_STORE_FILTERS,
    category: 'Running',
  });
  assert.ok(running.length > 0);
  assert.ok(running.every((s) => s.category === 'Running'));
});

test('filterAndSortSneakers filters correctly by brand', () => {
  const jordan = filterAndSortSneakers(SNEAKERS, {
    ...INITIAL_STORE_FILTERS,
    brand: 'Jordan',
  });
  assert.ok(jordan.length > 0);
  assert.ok(jordan.every((s) => s.brand === 'Jordan'));
});

test('filterAndSortSneakers sorts by price ascending and descending', () => {
  const asc = filterAndSortSneakers(SNEAKERS, {
    ...INITIAL_STORE_FILTERS,
    sortBy: 'price-asc',
  });
  for (let i = 0; i < asc.length - 1; i++) {
    assert.ok(asc[i].price <= asc[i + 1].price);
  }

  const desc = filterAndSortSneakers(SNEAKERS, {
    ...INITIAL_STORE_FILTERS,
    sortBy: 'price-desc',
  });
  for (let i = 0; i < desc.length - 1; i++) {
    assert.ok(desc[i].price >= desc[i + 1].price);
  }
});
