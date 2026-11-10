import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CollectionCategory, Sneaker } from '../types/index.ts';
import { SneakerVisual } from './SneakerVisual.tsx';

interface ExploreCollectionsProps {
  categories: CollectionCategory[];
  onSelectCategory: (categoryName: Sneaker['category']) => void;
  onViewAll: () => void;
}

export const ExploreCollections: React.FC<ExploreCollectionsProps> = ({
  categories,
  onSelectCategory,
  onViewAll,
}) => {
  const mapToCategory = (id: string): Sneaker['category'] => {
    switch (id) {
      case 'running':
        return 'Running';
      case 'basketball':
        return 'Basketball';
      case 'casual':
        return 'Casual';
      default:
        return 'Lifestyle';
    }
  };

  return (
    <section id="explore-collections" className="py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with View All link */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#111111] uppercase">
            EXPLORE COLLECTIONS
          </h2>
          <button
            onClick={onViewAll}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-600 hover:text-black transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4 Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(mapToCategory(cat.id))}
              className="group cursor-pointer rounded-2xl p-5 bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200/60 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
            >
              {/* Visual Box with Sneaker Thumbnail */}
              <div className="w-full aspect-[4/3] rounded-xl bg-white/80 p-4 flex items-center justify-center overflow-hidden mb-4 shadow-sm group-hover:bg-white transition-colors">
                <SneakerVisual
                  silhouette={cat.imageSilhouette}
                  image={cat.image}
                  alt={cat.name}
                  size="md"
                  className="w-full h-full transform group-hover:scale-108 group-hover:-rotate-2 transition-transform duration-300"
                />
              </div>

              {/* Title & Explore link */}
              <div>
                <h3 className="text-base font-bold text-neutral-900 group-hover:text-black mb-1">
                  {cat.name}
                </h3>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 group-hover:text-black transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
