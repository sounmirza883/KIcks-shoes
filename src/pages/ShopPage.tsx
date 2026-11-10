import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  Check,
  Flame,
  ArrowUpDown,
} from 'lucide-react';
import { Sneaker } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import {
  StoreFilterState,
  INITIAL_STORE_FILTERS,
  filterAndSortSneakers,
} from '../utils/store.ts';

interface ShopPageProps {
  sneakers: Sneaker[];
  wishlistIds: string[];
  onToggleWishlist: (sneaker: Sneaker) => void;
  onAddToCart: (sneaker: Sneaker) => void;
  onSelectSneaker: (sneaker: Sneaker) => void;
  initialCategory?: string;
  initialCollectionType?: string;
}

const STORAGE_KEY = 'kicks_store_filters';

export const ShopPage: React.FC<ShopPageProps> = ({
  sneakers,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onSelectSneaker,
  initialCategory,
  initialCollectionType,
}) => {
  // Load saved store preferences or defaults
  const [filters, setFilters] = useState<StoreFilterState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STORE_FILTERS,
          ...parsed,
          ...(initialCategory ? { category: initialCategory } : {}),
          ...(initialCollectionType ? { collectionType: initialCollectionType } : {}),
        };
      }
    } catch {
      // ignore
    }
    return {
      ...INITIAL_STORE_FILTERS,
      ...(initialCategory ? { category: initialCategory } : {}),
      ...(initialCollectionType ? { collectionType: initialCollectionType } : {}),
    };
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync initialCategory or initialCollectionType if prop changes
  useEffect(() => {
    if (initialCategory) {
      setFilters((prev) => ({ ...prev, category: initialCategory }));
    }
    if (initialCollectionType) {
      setFilters((prev) => ({ ...prev, collectionType: initialCollectionType as any }));
    }
  }, [initialCategory, initialCollectionType]);

  // Persist store filter changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {
      // ignore
    }
  }, [filters]);

  const categories = ['all', 'Lifestyle', 'Running', 'Basketball', 'Casual'];
  const brands = [
    'all',
    'Nike',
    'Jordan',
    'New Balance',
    'Adidas',
    'Asics',
    'Salomon',
    'Converse',
  ];
  const allSizes = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13];

  const filteredSneakers = filterAndSortSneakers(sneakers, filters);

  const handleResetFilters = () => {
    setFilters(INITIAL_STORE_FILTERS);
  };

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.brand !== 'all' ||
    filters.selectedSize !== null ||
    filters.searchQuery.trim() !== '' ||
    filters.collectionType !== 'all' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 500;

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-8 sm:py-12 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Banner */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold font-mono tracking-widest uppercase bg-black text-white px-2.5 py-0.5 rounded-full">
                OFFICIAL STORE
              </span>
              <span className="text-xs text-neutral-500 font-medium">
                {filteredSneakers.length} of {sneakers.length} pairs in stock
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 uppercase">
              THE KICKS VAULT
            </h1>
            <p className="text-neutral-500 text-sm sm:text-base mt-1 max-w-xl">
              Every iconic silhouette, verified authentic by our master lab. Filter by category, brand, or size to find your next grail.
            </p>
          </div>

          {/* Quick Collection Tag Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: 'All Kicks', val: 'all' },
              { label: '🔥 Best Sellers', val: 'best-sellers' },
              { label: '✨ New Arrivals', val: 'new-in' },
              { label: '⚡ Limited Drops', val: 'limited-edition' },
            ].map((tag) => (
              <button
                key={tag.val}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    collectionType: tag.val as any,
                  }))
                }
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filters.collectionType === tag.val
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:border-black'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Layout Grid: Left Sidebar Filters + Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden flex items-center justify-between gap-3">
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="inline-flex items-center gap-2 bg-white border border-neutral-300 px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-800 shadow-sm"
            >
              <Filter className="w-4 h-4" />
              <span>{isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-black ml-1" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))
                }
                className="bg-white border border-neutral-300 px-3 py-2.5 rounded-xl text-xs font-bold text-neutral-800 shadow-sm pr-8 focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Left Filter Sidebar (Desktop & Expandable Mobile) */}
          <aside
            className={`lg:col-span-3 space-y-6 ${
              isMobileFiltersOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-6 sticky top-28">
              
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-neutral-700" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
                    Store Filters
                  </span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Search Inside Store */}
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-2">
                  Search Models
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Jordan, Dunk, 9060..."
                    value={filters.searchQuery}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        searchQuery: e.target.value,
                      }))
                    }
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-7 py-2 text-xs focus:outline-none focus:border-black"
                  />
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
                  {filters.searchQuery && (
                    <button
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, searchQuery: '' }))
                      }
                      className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-black cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-2">
                  Category
                </label>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, category: cat }))
                      }
                      className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        filters.category.toLowerCase() === cat.toLowerCase()
                          ? 'bg-neutral-900 text-white font-bold'
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                      }`}
                    >
                      <span>{cat === 'all' ? 'All Categories' : cat}</span>
                      {filters.category.toLowerCase() === cat.toLowerCase() && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-2">
                  Brand
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, brand: brand }))
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        filters.brand.toLowerCase() === brand.toLowerCase()
                          ? 'bg-black text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
                      }`}
                    >
                      {brand === 'all' ? 'All Brands' : brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase text-neutral-700">
                    US Men Size
                  </label>
                  {filters.selectedSize !== null && (
                    <button
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, selectedSize: null }))
                      }
                      className="text-[10px] text-neutral-400 hover:text-black"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          selectedSize:
                            prev.selectedSize === size ? null : size,
                        }))
                      }
                      className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        filters.selectedSize === size
                          ? 'bg-black text-white shadow-sm'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-neutral-700 mb-2">
                  <span className="uppercase">Max Price</span>
                  <span className="font-mono text-black">
                    ${filters.maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={450}
                  step={10}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
                  <span>$100</span>
                  <span>$250</span>
                  <span>$450</span>
                </div>
              </div>

            </div>
          </aside>

          {/* Right Product Grid Column */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Desktop Sort & Active Count Bar */}
            <div className="hidden lg:flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-neutral-200 shadow-xs">
              <span className="text-xs font-semibold text-neutral-600">
                Showing <strong className="text-neutral-900">{filteredSneakers.length}</strong> items
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-500">
                  Sort By:
                </span>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as any,
                    }))
                  }
                  className="bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Sneakers Grid */}
            {filteredSneakers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSneakers.map((sneaker) => (
                  <ProductCard
                    key={sneaker.id}
                    sneaker={sneaker}
                    isWishlisted={wishlistIds.includes(sneaker.id)}
                    onToggleWishlist={onToggleWishlist}
                    onQuickAdd={onAddToCart}
                    onSelectSneaker={onSelectSneaker}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search / Filter State */
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">
                  No Sneakers Match Your Filters
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
                  Try adjusting your category, price range, or clearing the search query to view available drops.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
