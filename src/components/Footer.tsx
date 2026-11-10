import React from 'react';
import { Instagram, Youtube, Twitter, Disc as BrandTiktok, ArrowUp } from 'lucide-react';
import { PageView } from './Header.tsx';

interface FooterProps {
  onNavigatePage: (page: PageView, filter?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigatePage }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white text-neutral-900 border-t border-neutral-200 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-14">
          
          {/* Brand & Socials Column */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => {
                onNavigatePage('home');
                scrollToTop();
              }}
              className="text-3xl font-black tracking-tighter text-[#111111] hover:opacity-85 text-left cursor-pointer"
            >
              KICKS<span className="text-black">.</span>
            </button>
            <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">
              More than sneakers. A global community celebrating footwear culture, craftsmanship, and performance.
            </p>

            {/* Social Icons matching mockup */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#instagram"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-black hover:text-white flex items-center justify-center text-neutral-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#tiktok"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-black hover:text-white flex items-center justify-center text-neutral-700 transition-colors"
                aria-label="TikTok"
              >
                <BrandTiktok className="w-4 h-4" />
              </a>
              <a
                href="#youtube"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-black hover:text-white flex items-center justify-center text-neutral-700 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-black hover:text-white flex items-center justify-center text-neutral-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
              Store & Catalog
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-500 font-medium">
              <li>
                <button
                  onClick={() => onNavigatePage('shop')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('shop', { collectionType: 'new-in' })}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  New In Drops
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('shop', { collectionType: 'best-sellers' })}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('collections')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  All Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('shop', { collectionType: 'limited-edition' })}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Limited Edition
                </button>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-500 font-medium">
              <li>
                <button
                  onClick={() => onNavigatePage('contact')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('contact')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Shipping & Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('contact')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('contact')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Authenticity Lookup
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('contact')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-500 font-medium">
              <li>
                <button
                  onClick={() => onNavigatePage('about')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  About KICKS
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('about')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  10-Step Lab Protocol
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('about')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Our Curators
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('contact')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Flagship Store Locations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('home')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Back to Home
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar matching mockup */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© 2026 Kicks. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-extrabold tracking-widest text-neutral-800 uppercase text-[11px]">
              SNEAKERS MOVE PEOPLE.
            </span>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
