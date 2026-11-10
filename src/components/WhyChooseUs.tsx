import React from 'react';
import { ShieldCheck, Globe, RotateCcw, Headphones } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const perks = [
    {
      icon: ShieldCheck,
      title: 'Authentic Products',
      description: '100% original sneakers verified by our expert team.',
    },
    {
      icon: Globe,
      title: 'Worldwide Shipping',
      description: 'Get your kicks anywhere with tracked express courier.',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: 'Hassle-free returns within 30 days of delivery.',
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      description: "We're here to help around the clock with sneaker care.",
    },
  ];

  return (
    <section className="py-14 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#111111] uppercase mb-8">
          WHY CHOOSE KICKS?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk, index) => {
            const Icon = perk.icon;
            return (
              <div
                key={index}
                className="bg-neutral-50/80 hover:bg-neutral-100/80 p-6 rounded-2xl border border-neutral-200/70 transition-all duration-200 flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6 text-neutral-900" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-1">
                    {perk.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
