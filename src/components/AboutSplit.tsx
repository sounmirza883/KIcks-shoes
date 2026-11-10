import React from 'react';
import { ArrowRight, Award, Shield } from 'lucide-react';

interface AboutSplitProps {
  onLearnMore: () => void;
}

export const AboutSplit: React.FC<AboutSplitProps> = ({ onLearnMore }) => {
  return (
    <section id="about-us" className="py-16 sm:py-20 bg-[#F9FAFB] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left: High-Contrast Jordan Texture / Macro Craftsmanship with Circular Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 aspect-[4/3] sm:aspect-[16/11]">
              <img
                src="https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=1000&auto=format&fit=crop&q=80"
                alt="Sneaker craftsmanship macro details"
                className="w-full h-full object-cover grayscale contrast-125 hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  // Fallback to high-contrast SVG texture
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Circular Premium Quality Seal Badge (Exact match to Mockup) */}
              <div className="absolute bottom-6 left-6 z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-neutral-950/90 text-white border-2 border-neutral-400/40 p-2 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center text-center">
                <Award className="w-5 h-5 text-amber-400 mb-0.5" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-200">
                  PREMIUM
                </span>
                <span className="text-[8px] font-mono tracking-widest text-neutral-400 uppercase">
                  QUALITY
                </span>
              </div>
            </div>
          </div>

          {/* Right: Story, Mission & Proof Stats */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase mb-3 block">
              ABOUT US
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#111111] uppercase leading-tight mb-5">
              MORE THAN<br />SNEAKERS.
            </h2>

            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
              We believe sneakers are more than just shoes — they’re a lifestyle. Our mission is to bring you authentic, high-quality sneakers that keep you ahead, on and off the streets. From grail retros to tomorrow’s silhouettes, every pair passes through our hands.
            </p>

            <div className="flex items-center gap-6 mb-10">
              <button
                onClick={onLearnMore}
                className="inline-flex items-center gap-3 border-2 border-black text-black hover:bg-black hover:text-white px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-colors"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Stats Row Matching Mockup */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-200/80">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                  5K+
                </p>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">
                  Products
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                  10K+
                </p>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">
                  Happy Customers
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                  50+
                </p>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">
                  Global Brands
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
