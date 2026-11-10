// URL <-> page mapping for the App Router. The only place that knows what a route looks like.

export type PageView = 'home' | 'shop' | 'collections' | 'about' | 'contact' | 'account';

export interface NavOptions {
  category?: string;
  collectionType?: string;
  collectionId?: string;
}

export const COLLECTION_IDS = ['lifestyle', 'running', 'basketball', 'casual'];

const SHOP_CATEGORIES = ['Lifestyle', 'Running', 'Basketball', 'Casual'];
const COLLECTION_TYPES = ['new-in', 'best-sellers', 'limited-edition'] as const;
const NAMED_PAGES = ['shop', 'collections', 'about', 'contact', 'account'] as const;

export function hrefFor(page: PageView, options: NavOptions = {}): string {
  if (page === 'home') return '/';
  if (page === 'collections') {
    const id = options.collectionId;
    return id && id !== 'all' ? `/collections/${encodeURIComponent(id)}` : '/collections';
  }
  if (page === 'shop') {
    const query = new URLSearchParams();
    if (options.category) query.set('category', options.category);
    if (options.collectionType) query.set('collectionType', options.collectionType);
    const qs = query.toString();
    return qs ? `/shop?${qs}` : '/shop';
  }
  return `/${page}`;
}

export function pageFromPathname(pathname: string): PageView {
  const segment = pathname.split('/')[1];
  return NAMED_PAGES.find((page) => page === segment) ?? 'home';
}

// The shop filters come from the URL, so anything not on the allow-lists is dropped.
export function parseShopFilters(params: { get(name: string): string | null }): {
  category?: string;
  collectionType?: (typeof COLLECTION_TYPES)[number];
} {
  const category = params.get('category');
  const collectionType = params.get('collectionType');
  return {
    category: category && SHOP_CATEGORIES.includes(category) ? category : undefined,
    collectionType: COLLECTION_TYPES.find((type) => type === collectionType),
  };
}
