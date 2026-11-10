import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { Sneaker } from '../types/index.ts';
import { SneakerVisual } from './SneakerVisual.tsx';

interface ExclusiveDropsProps {
  onShopNow: () => void;
  onSelectSneaker: (sneaker: Sneaker) => void;
  dropSneaker: Sneaker;
}

export const ExclusiveDrops: React.FC<ExclusiveDropsProps> = ({
  onShopNow,
  onSelectSneaker,
  dropSneaker,
}) => {
  return (
    <section className="py-14 sm:py-20 bg-[#0A0A0A] text-white border-b border-neutral-800 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-neutral-800/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-neutral-800/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Limited Edition Message */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-[11px] font-bold tracking-[0.25em] text-red-500 uppercase">
                LIMITED EDITION
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-none mb-5">
              EXCLUSIVE<br />DROPS
            </h2>

            <p className="text-neutral-400 text-base sm:text-lg mb-8 max-w-sm leading-relaxed">
              Rare styles. Limited stock.<br />Be the first to own.
            </p>

            <div>
              <button
                onClick={onShopNow}
                className="inline-flex items-center gap-3 bg-white text-black hover:bg-neutral-200 px-7 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Stealth Black Sneaker Visual */}
          <div className="lg:col-span-7 flex items-center justify-center relative py-6">
            <div 
              onClick={() => onSelectSneaker(dropSneaker)}
              className="relative cursor-pointer group w-full max-w-lg flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-neutral-900/60 rounded-3xl -z-10 blur-xl transform group-hover:scale-105 transition-transform" />
              <SneakerVisual
                silhouette={dropSneaker?.silhouette || 'jordan4'}
                image={dropSneaker?.image || '/images/stealth_drop_shoe_1794331423317.jpg'}
                alt={dropSneaker?.name || 'Exclusive Drop Sneaker'}
                isDarkBg={true}
                size="hero"
                className="transform -rotate-12 group-hover:-rotate-6 group-hover:scale-105 transition-all duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
