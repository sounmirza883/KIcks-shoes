import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Sneaker } from '../types/index.ts';
import { ProductCard } from './ProductCard.tsx';

interface FeaturedProductsProps {
  sneakers: Sneaker[];
  wishlistIds: string[];
  onToggleWishlist: (sneaker: Sneaker) => void;
  onQuickAdd: (sneaker: Sneaker) => void;
  onSelectSneaker: (sneaker: Sneaker) => void;
  onViewAll: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  sneakers,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onSelectSneaker,
  onViewAll,
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'New In' | 'Best Sellers' | 'Limited Edition'>('All');

  const filterTabs: Array<'All' | 'New In' | 'Best Sellers' | 'Limited Edition'> = [
    'All',
    'New In',
    'Best Sellers',
    'Limited Edition',
  ];

  const filteredSneakers = sneakers.filter((sneaker) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'New In') return sneaker.isNewArrival;
    if (activeFilter === 'Best Sellers') return sneaker.isBestSeller;
    if (activeFilter === 'Limited Edition') return sneaker.isLimitedDrop;
    return true;
  });

  // Display top 4 matching
  const displayedSneakers = filteredSneakers.slice(0, 4);

  return (
    <section id="featured-products" className="py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#111111] uppercase mb-1">
              FEATURED PRODUCTS
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">
              Handpicked styles. For every step you take.
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-600 hover:text-black transition-colors self-start md:self-auto"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
                activeFilter === tab
                  ? 'bg-[#111111] text-white shadow-md'
                  : 'bg-neutral-100 hover:bg-neutral-200/70 text-neutral-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedSneakers.map((sneaker) => (
            <ProductCard
              key={sneaker.id}
              sneaker={sneaker}
              isWishlisted={wishlistIds.includes(sneaker.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onSelectSneaker={onSelectSneaker}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
