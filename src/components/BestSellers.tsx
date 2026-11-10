import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Sneaker } from '../types/index.ts';
import { ProductCard } from './ProductCard.tsx';

interface BestSellersProps {
  sneakers: Sneaker[];
  wishlistIds: string[];
  onToggleWishlist: (sneaker: Sneaker) => void;
  onQuickAdd: (sneaker: Sneaker) => void;
  onSelectSneaker: (sneaker: Sneaker) => void;
  onViewAll: () => void;
}

export const BestSellers: React.FC<BestSellersProps> = ({
  sneakers,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onSelectSneaker,
  onViewAll,
}) => {
  // Take the 4 best seller sneakers from data
  const bestSellers = sneakers.filter((s) => s.isBestSeller).slice(0, 4);

  return (
    <section id="best-sellers" className="py-16 bg-[#FAFAFA] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#111111] uppercase">
              BEST SELLERS
            </h2>
          </div>
          <button
            onClick={onViewAll}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-600 hover:text-black transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((sneaker) => (
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
