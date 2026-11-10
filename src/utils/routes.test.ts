import test from 'node:test';
import assert from 'node:assert/strict';
import { hrefFor, pageFromPathname, parseShopFilters } from './routes.ts';

test('hrefFor maps every page to its path', () => {
  assert.equal(hrefFor('home'), '/');
  assert.equal(hrefFor('shop'), '/shop');
  assert.equal(hrefFor('collections'), '/collections');
  assert.equal(hrefFor('about'), '/about');
  assert.equal(hrefFor('contact'), '/contact');
  assert.equal(hrefFor('account'), '/account');
});

test('hrefFor puts shop filters in the query string', () => {
  assert.equal(hrefFor('shop', { collectionType: 'new-in' }), '/shop?collectionType=new-in');
  assert.equal(
    hrefFor('shop', { category: 'Running', collectionType: 'best-sellers' }),
    '/shop?category=Running&collectionType=best-sellers'
  );
});

test('hrefFor treats collection id "all" or none as the collections index', () => {
  assert.equal(hrefFor('collections', { collectionId: 'all' }), '/collections');
  assert.equal(hrefFor('collections', { collectionId: 'running' }), '/collections/running');
  assert.equal(hrefFor('collections', { collectionId: 'a/b' }), '/collections/a%2Fb');
});

test('pageFromPathname finds the page for a path and falls back to home', () => {
  assert.equal(pageFromPathname('/'), 'home');
  assert.equal(pageFromPathname('/shop'), 'shop');
  assert.equal(pageFromPathname('/collections/running'), 'collections');
  assert.equal(pageFromPathname('/account'), 'account');
  assert.equal(pageFromPathname('/nope'), 'home');
});

test('parseShopFilters keeps allowed values and drops everything else', () => {
  const read = (qs: string) => parseShopFilters(new URLSearchParams(qs));
  assert.deepEqual(read('category=Running&collectionType=new-in'), {
    category: 'Running',
    collectionType: 'new-in',
  });
  assert.deepEqual(read('category=running&collectionType=free-money'), {
    category: undefined,
    collectionType: undefined,
  });
  assert.deepEqual(read(''), { category: undefined, collectionType: undefined });
});
