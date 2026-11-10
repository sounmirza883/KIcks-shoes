import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Check } from 'lucide-react';
import { Sneaker } from '../types/index.ts';
import { SneakerVisual } from './SneakerVisual.tsx';
import { HERO_SLIDES } from '../data/products.ts';

interface HeroProps {
  onShopCollection: () => void;
  onSelectSneaker: (sneaker: Sneaker) => void;
  allSneakers: Sneaker[];
}

export const Hero: React.FC<HeroProps> = ({
  onShopCollection,
  onSelectSneaker,
  allSneakers,
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const currentSlide = HERO_SLIDES[activeSlideIndex];

  // Match the active hero slide with a product from our catalog
  const matchingSneaker =
    allSneakers.find((s) => s.name.includes(currentSlide.sneakerName)) ||
    allSneakers.find((s) => s.silhouette === currentSlide.silhouette) ||
    allSneakers[2];

  return (
    <section className="relative overflow-hidden bg-[#F5F5F7] pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Subhead, CTA, Social Proof */}
          <div className="lg:col-span-5 flex flex-col justify-center z-10">
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-neutral-500 uppercase mb-4 block">
              {currentSlide.kicker}
            </span>
            
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tighter text-[#111111] leading-[0.95] uppercase mb-6">
              {currentSlide.headline.split('\n').map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-md leading-relaxed mb-8">
              {currentSlide.subhead}
            </p>

            {/* Shop Collection CTA Button */}
            <div className="flex items-center gap-4 mb-10">
              <button
                onClick={onShopCollection}
                className="inline-flex items-center gap-3 bg-[#111111] hover:bg-black text-white px-7 py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Customer Social Proof Avatars Stack */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-3 overflow-hidden">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-bold ring-2 ring-white">
                  +10k
                </div>
              </div>
              <div className="text-xs text-neutral-600">
                <span className="font-extrabold text-neutral-900 block text-sm">
                  10K+
                </span>
                <span>Happy Customers</span>
              </div>
            </div>
          </div>

          {/* Center/Right Column: Massive Hero Sneaker Showcase with Geo Backdrop & Carousel Indicators */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            
            {/* Geometric Soft Backdrop Curve */}
            <div className="absolute w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] bg-gradient-to-tr from-neutral-200/80 via-white to-neutral-100 rounded-full -z-0 shadow-inner blur-[1px]" />
            <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] border border-neutral-300/60 rounded-full -z-0" />

            {/* Main Floating Sneaker Visual */}
            <div className="relative z-10 w-full py-8 sm:py-12 flex flex-col items-center justify-center">
              <div 
                className="w-full max-w-lg cursor-pointer transform hover:scale-105 transition-transform duration-300"
                onClick={() => matchingSneaker && onSelectSneaker(matchingSneaker)}
              >
                <SneakerVisual
                  silhouette={currentSlide.silhouette}
                  image={currentSlide.image || matchingSneaker?.image}
                  alt={currentSlide.sneakerName}
                  primaryColor={currentSlide.primaryColor}
                  accentColor={currentSlide.accentColor}
                  size="hero"
                  className="transform -rotate-6 hover:-rotate-3 transition-transform duration-300"
                />
              </div>

              {/* Floating Product Tag & Quick Action (Matching Mockup exactly) */}
              <div className="mt-4 sm:mt-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:px-6 sm:py-3.5 shadow-xl border border-neutral-200/80 flex items-center justify-between gap-6 max-w-xs w-full transition-all hover:shadow-2xl">
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    {currentSlide.colorway}
                  </p>
                  <p className="text-sm font-bold text-neutral-900">
                    {currentSlide.sneakerName}
                  </p>
                  <p className="text-sm font-black text-neutral-900">
                    ${currentSlide.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => matchingSneaker && onSelectSneaker(matchingSneaker)}
                  className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-md hover:scale-105"
                  aria-label={`View ${currentSlide.sneakerName}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Vertical Rail Slide Selector (01 / 03) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-20 bg-white/60 backdrop-blur-sm p-2 rounded-2xl border border-neutral-200/50">
              <span className="text-[11px] font-mono font-bold text-neutral-700 writing-mode-vertical">
                {currentSlide.number}
              </span>
              <div className="flex flex-col gap-2 pt-1">
                {HERO_SLIDES.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveSlideIndex(index)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      activeSlideIndex === index
                        ? 'bg-black text-white shadow-md scale-110'
                        : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    <span className="text-xs font-bold">{index + 1}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
