'use client';

import React from 'react';
import { ArrowRight, ChevronLeft, Sparkles, Filter, Check } from 'lucide-react';
import { Sneaker } from '../types/index.ts';
import { SNEAKERS, CATEGORIES } from '../data/products.ts';
import { useStore } from '../components/StoreProvider.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { SneakerVisual } from '../components/SneakerVisual.tsx';

interface CollectionsPageProps {
  selectedCollectionId?: string; // 'all' | 'lifestyle' | 'running' | 'basketball' | 'casual', from the route
}

interface CollectionDetailMeta {
  title: string;
  tagline: string;
  description: string;
  heroColor: string;
  categoryFilter: Sneaker['category'];
  bannerBg: string;
}

const COLLECTION_METAS: Record<string, CollectionDetailMeta> = {
  lifestyle: {
    title: 'Lifestyle Sneakers',
    tagline: 'THE EVERYDAY ROTATION',
    description:
      'Engineered for the daily commute, weekend strolls, and timeless streetwear aesthetic. Clean leather overlays, flexible gum soles, and heritage court DNA.',
    heroColor: '#0F172A',
    categoryFilter: 'Lifestyle',
    bannerBg: 'from-neutral-900 via-neutral-800 to-black',
  },
  running: {
    title: 'Running Shoes',
    tagline: 'MAXIMUM CUSHION & TECH',
    description:
      'High-performance silhouettes built with dual-density foam, Zoom Air units, responsive mesh lattices, and rugged trail outsoles for endless movement.',
    heroColor: '#1E293B',
    categoryFilter: 'Running',
    bannerBg: 'from-slate-900 via-neutral-900 to-zinc-950',
  },
  basketball: {
    title: 'Basketball Shoes',
    tagline: 'HARDWOOD HERITAGE',
    description:
      'Legendary high-tops and court beasts from the golden era to tomorrow’s arenas. Sturdy sculpted wing supports, visible air chambers, and ankle lockdown.',
    heroColor: '#111111',
    categoryFilter: 'Basketball',
    bannerBg: 'from-stone-900 via-neutral-900 to-black',
  },
  casual: {
    title: 'Casual Sneakers',
    tagline: 'LOW PROFILE PURITY',
    description:
      'Understated minimalism with gritty suede T-toes, retro soccer lineage, and effortless versatile styling. The pairs that go with every single fit.',
    heroColor: '#262626',
    categoryFilter: 'Casual',
    bannerBg: 'from-zinc-900 via-neutral-900 to-stone-900',
  },
};

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ selectedCollectionId = 'all' }) => {
  const { wishlistIds, toggleWishlist, addToCart, selectSneaker, navigate } = useStore();
  const sneakers = SNEAKERS;
  const categories = CATEGORIES;
  const onToggleWishlist = toggleWishlist;
  const onAddToCart = (sneaker: Sneaker) => addToCart(sneaker);
  const onSelectSneaker = selectSneaker;
  const onSelectCollectionId = (collectionId: string) => navigate('collections', { collectionId });

  // The route is the source of truth, so there is no local copy that could go stale.
  const activeCollection = selectedCollectionId;

  const currentMeta = COLLECTION_METAS[activeCollection];

  const filteredSneakers =
    activeCollection === 'all'
      ? sneakers
      : sneakers.filter(
          (s) =>
            s.category.toLowerCase() ===
            currentMeta?.categoryFilter.toLowerCase()
        );

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-16">
      
      {/* Sub-Header Navigation Tabs for Collections */}
      <div className="bg-white border-b border-neutral-200 sticky top-20 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                onSelectCollectionId('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCollection === 'all'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All Collections ({categories.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCollectionId(cat.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCollection === cat.id
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* VIEW MODE 1: ALL COLLECTIONS OVERVIEW */}
        {activeCollection === 'all' && (
          <div className="space-y-12">
            
            {/* Master Collections Page Headline */}
            <div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400 block mb-1">
                KICKS CURATED ARCHIVE
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 uppercase">
                EXPLORE BY COLLECTION
              </h1>
              <p className="text-neutral-500 text-sm sm:text-base mt-2 max-w-2xl">
                Browse our four signature pillars of sneaker culture. Each collection is carefully authenticated and handpicked for distinctive lifestyle, sport, and heritage expression.
              </p>
            </div>

            {/* 4 Feature Collection Hero Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((cat) => {
                const meta = COLLECTION_METAS[cat.id];
                const count = sneakers.filter(
                  (s) =>
                    s.category.toLowerCase() ===
                    meta?.categoryFilter.toLowerCase()
                ).length;

                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      onSelectCollectionId(cat.id);
                    }}
                    className="group cursor-pointer rounded-3xl overflow-hidden bg-white border border-neutral-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Visual Photo Box */}
                    <div className="relative aspect-[16/10] bg-neutral-100 p-8 flex items-center justify-center overflow-hidden">
                      <div className="absolute top-4 left-4 z-10">
                        <span className="text-[10px] font-bold tracking-widest uppercase bg-black text-white px-2.5 py-1 rounded-full">
                          {cat.tagline}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 z-10">
                        <span className="text-xs font-bold text-neutral-500 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-2xs">
                          {count} models
                        </span>
                      </div>

                      <SneakerVisual
                        silhouette={cat.imageSilhouette}
                        image={cat.image}
                        alt={cat.name}
                        size="lg"
                        className="transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500"
                      />
                    </div>

                    {/* Card Content & Action */}
                    <div className="p-6">
                      <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-400">
                        COLLECTION 0{categories.indexOf(cat) + 1}
                      </span>
                      <h3 className="text-2xl font-black text-neutral-900 uppercase mt-0.5 mb-2 group-hover:text-black">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-6">
                        {meta?.description}
                      </p>

                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-900 group-hover:translate-x-1 transition-transform">
                        <span>Explore {cat.name}</span>
                        <ArrowRight className="w-4 h-4 text-black" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Complete Unified Grid */}
            <div className="pt-8 border-t border-neutral-200">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-tight mb-6">
                ALL SIGNATURE DROPS ({sneakers.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sneakers.map((sneaker) => (
                  <ProductCard
                    key={sneaker.id}
                    sneaker={sneaker}
                    isWishlisted={wishlistIds.includes(sneaker.id)}
                    onToggleWishlist={onToggleWishlist}
                    onQuickAdd={onAddToCart}
                    onSelectSneaker={onSelectSneaker}
                  />
                ))}
              </div>
            </div>

          </div>
        )}

        {/* VIEW MODE 2: SPECIFIC DEDICATED COLLECTION PAGE */}
        {activeCollection !== 'all' && currentMeta && (
          <div className="space-y-8">
            
            {/* Breadcrumb Back Action */}
            <button
              onClick={() => {
                onSelectCollectionId('all');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to All Collections</span>
            </button>

            {/* Dedicated Collection Editorial Hero Banner */}
            <div
              className={`rounded-3xl p-8 sm:p-12 text-white bg-gradient-to-r ${currentMeta.bannerBg} relative overflow-hidden shadow-xl`}
            >
              <div className="relative z-10 max-w-2xl">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-400 block mb-2">
                  {currentMeta.tagline}
                </span>
                <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none mb-4">
                  {currentMeta.title}
                </h1>
                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
                  {currentMeta.description}
                </p>
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white border border-white/20">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{filteredSneakers.length} Verified Models In Stock</span>
                </div>
              </div>
            </div>

            {/* Sneakers belonging specifically to this collection */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-neutral-900">
                  {currentMeta.title} ({filteredSneakers.length} models)
                </h2>
                <span className="text-xs text-neutral-500 font-medium">
                  100% Authentic with Verification Tag
                </span>
              </div>

              {filteredSneakers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredSneakers.map((sneaker) => (
                    <ProductCard
                      key={sneaker.id}
                      sneaker={sneaker}
                      isWishlisted={wishlistIds.includes(sneaker.id)}
                      onToggleWishlist={onToggleWishlist}
                      onQuickAdd={onAddToCart}
                      onSelectSneaker={onSelectSneaker}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-2xl text-center border border-neutral-200">
                  <p className="text-sm text-neutral-500">
                    No models currently available in this collection.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
