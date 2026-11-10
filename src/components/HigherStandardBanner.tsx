import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Sneaker } from '../types/index.ts';
import { SneakerVisual } from './SneakerVisual.tsx';

interface HigherStandardBannerProps {
  onDiscover: () => void;
  onSelectSneaker: (sneaker: Sneaker) => void;
  featuredSneaker: Sneaker;
}

export const HigherStandardBanner: React.FC<HigherStandardBannerProps> = ({
  onDiscover,
  onSelectSneaker,
  featuredSneaker,
}) => {
  return (
    <section className="py-12 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 text-white min-h-[420px] flex items-center shadow-xl">
          
          {/* Background Streetwear Atmosphere with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-gradient-to-r from-black via-neutral-900/90 to-neutral-900/40 relative">
              {/* Subtle background urban asphalt texture */}
              <div 
                className="absolute inset-0 opacity-30 mix-blend-overlay bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1600&auto=format&fit=crop&q=80')`
                }}
              />
            </div>
          </div>

          {/* Content Layout */}
          <div className="relative z-10 w-full p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 max-w-xl">
              <span className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase mb-3 block">
                STEP INTO
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-none mb-4">
                A HIGHER<br />STANDARD.
              </h2>
              <p className="text-neutral-300 text-base sm:text-lg mb-8 max-w-md leading-relaxed">
                Performance meets style. Designed for those who never stop moving. Precision engineered silhouettes crafted for supreme cushioning.
              </p>
              
              <button
                onClick={onDiscover}
                className="inline-flex items-center gap-3 bg-white text-black hover:bg-neutral-100 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Discover More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Floating Featured Showcase Card */}
            <div className="lg:col-span-5 flex justify-end">
              <div 
                onClick={() => onSelectSneaker(featuredSneaker)}
                className="bg-white/95 text-neutral-900 p-5 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md max-w-xs w-full cursor-pointer hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                    Featured
                  </span>
                  <span className="text-[10px] font-mono bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full font-semibold">
                    LIMITED
                  </span>
                </div>

                <div className="py-2 flex items-center justify-center">
                  <SneakerVisual
                    silhouette={featuredSneaker.silhouette}
                    image={featuredSneaker.image}
                    alt={featuredSneaker.name}
                    size="md"
                    className="transform group-hover:-rotate-6 transition-transform duration-300"
                  />
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 group-hover:text-black">
                      {featuredSneaker.name}
                    </h3>
                    <p className="text-sm font-extrabold text-neutral-900">
                      ${featuredSneaker.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center group-hover:bg-black transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
