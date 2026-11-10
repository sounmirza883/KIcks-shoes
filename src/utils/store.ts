import { Sneaker } from '../types/index.ts';

export interface StoreFilterState {
  searchQuery: string;
  category: string; // 'all' | 'Lifestyle' | 'Running' | 'Basketball' | 'Casual'
  brand: string; // 'all' | 'Nike' | 'Jordan' | 'New Balance' | 'Adidas' | 'Asics' | 'Salomon' | 'Converse'
  selectedSize: number | null;
  minPrice: number;
  maxPrice: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  collectionType?: 'all' | 'new-in' | 'best-sellers' | 'limited-edition';
}

export const INITIAL_STORE_FILTERS: StoreFilterState = {
  searchQuery: '',
  category: 'all',
  brand: 'all',
  selectedSize: null,
  minPrice: 0,
  maxPrice: 500,
  sortBy: 'featured',
  collectionType: 'all',
};

export function filterAndSortSneakers(
  sneakers: Sneaker[],
  filters: StoreFilterState
): Sneaker[] {
  let result = sneakers.filter((sneaker) => {
    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchesName = sneaker.name.toLowerCase().includes(q);
      const matchesBrand = sneaker.brand.toLowerCase().includes(q);
      const matchesCategory = sneaker.category.toLowerCase().includes(q);
      const matchesDesc = sneaker.description.toLowerCase().includes(q);
      if (!matchesName && !matchesBrand && !matchesCategory && !matchesDesc) {
        return false;
      }
    }

    // Category filter
    if (filters.category !== 'all') {
      if (sneaker.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
    }

    // Brand filter
    if (filters.brand !== 'all') {
      if (sneaker.brand.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }
    }

    // Size filter
    if (filters.selectedSize !== null) {
      if (!sneaker.sizes.includes(filters.selectedSize)) {
        return false;
      }
    }

    // Price range filter
    if (sneaker.price < filters.minPrice || sneaker.price > filters.maxPrice) {
      return false;
    }

    // Collection type
    if (filters.collectionType && filters.collectionType !== 'all') {
      if (filters.collectionType === 'new-in' && !sneaker.isNewArrival) {
        return false;
      }
      if (filters.collectionType === 'best-sellers' && !sneaker.isBestSeller) {
        return false;
      }
      if (filters.collectionType === 'limited-edition' && !sneaker.isLimitedDrop) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  switch (filters.sortBy) {
    case 'price-asc':
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result = [...result].sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      result = [...result].sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      break;
    case 'featured':
    default:
      // Keep natural catalog ordering or prioritize best sellers & limited drops
      break;
  }

  return result;
}
