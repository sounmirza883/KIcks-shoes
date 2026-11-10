import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CultureBannerProps {
  onOurStory: () => void;
}

export const CultureBanner: React.FC<CultureBannerProps> = ({ onOurStory }) => {
  return (
    <section className="py-16 sm:py-20 bg-[#F5F5F7] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Culture Message */}
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
            <span className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase mb-3 block">
              THE CULTURE
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#111111] uppercase leading-tight mb-5">
              SNEAKERS<br />MOVE PEOPLE.
            </h2>

            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
              From the streets to the spotlight, sneakers have always been more than just footwear — they connect people, inspire confidence and fuel a global culture. Every release tells a story, and every scuff is proof of the journey.
            </p>

            <div>
              <button
                onClick={onOurStory}
                className="inline-flex items-center gap-3 bg-[#111111] hover:bg-black text-white px-7 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Our Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Streetwear Culture Photo */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 aspect-[4/3] sm:aspect-[16/11]">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80"
                alt="Sneakerhead in urban city stairs"
                className="w-full h-full object-cover contrast-110 hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
