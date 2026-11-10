'use client';

import React from 'react';
import { Sneaker } from '../types/index.ts';
import { SNEAKERS, CATEGORIES } from '../data/products.ts';
import { useStore } from '../components/StoreProvider.tsx';
import { Hero } from '../components/Hero.tsx';
import { HigherStandardBanner } from '../components/HigherStandardBanner.tsx';
import { WhyChooseUs } from '../components/WhyChooseUs.tsx';
import { AboutSplit } from '../components/AboutSplit.tsx';
import { ExploreCollections } from '../components/ExploreCollections.tsx';
import { BestSellers } from '../components/BestSellers.tsx';
import { CultureBanner } from '../components/CultureBanner.tsx';
import { FeaturedProducts } from '../components/FeaturedProducts.tsx';
import { NewArrivals } from '../components/NewArrivals.tsx';
import { ExclusiveDrops } from '../components/ExclusiveDrops.tsx';
import { DiscountNewsletter } from '../components/DiscountNewsletter.tsx';

export const HomePage: React.FC = () => {
  const { wishlistIds, toggleWishlist, addToCart, selectSneaker, navigate, receivePromo } = useStore();
  const sneakers = SNEAKERS;
  const categories = CATEGORIES;
  const onToggleWishlist = toggleWishlist;
  const onAddToCart = (sneaker: Sneaker) => addToCart(sneaker);
  const onSelectSneaker = selectSneaker;
  const onNavigateToShop = (filter?: { category?: string; collectionType?: string }) =>
    navigate('shop', filter);
  const onNavigateToCollection = (collectionId: string) => navigate('collections', { collectionId });
  const onNavigateToAbout = () => navigate('about');
  const onPromoReceived = receivePromo;

  return (
    <div>
      {/* 1. Hero: "BUILT FOR WHAT'S NEXT" */}
      <Hero
        onShopCollection={() => onNavigateToShop()}
        onSelectSneaker={onSelectSneaker}
        allSneakers={sneakers}
      />

      {/* 2. Higher Standard Editorial Showcase with Featured Jordan 4 Retro */}
      <HigherStandardBanner
        onDiscover={() => onNavigateToShop({ collectionType: 'best-sellers' })}
        onSelectSneaker={onSelectSneaker}
        featuredSneaker={sneakers[2] || sneakers[0]}
      />

      {/* 3. Why Choose Kicks? 4-Perk Value Propositions */}
      <WhyChooseUs />

      {/* 4. About Us: "MORE THAN SNEAKERS." Teaser leading to full About page */}
      <AboutSplit onLearnMore={onNavigateToAbout} />

      {/* 5. Explore Collections Grid */}
      <ExploreCollections
        categories={categories}
        onSelectCategory={(catName) => {
          onNavigateToCollection(catName.toLowerCase());
        }}
        onViewAll={() => onNavigateToCollection('all')}
      />

      {/* 6. Best Sellers 4-Card Grid */}
      <BestSellers
        sneakers={sneakers}
        wishlistIds={wishlistIds}
        onToggleWishlist={onToggleWishlist}
        onQuickAdd={onAddToCart}
        onSelectSneaker={onSelectSneaker}
        onViewAll={() => onNavigateToShop({ collectionType: 'best-sellers' })}
      />

      {/* 7. Culture Banner: "SNEAKERS MOVE PEOPLE." */}
      <CultureBanner onOurStory={onNavigateToAbout} />

      {/* 8. Featured Products with Interactive Filter Tabs */}
      <FeaturedProducts
        sneakers={sneakers}
        wishlistIds={wishlistIds}
        onToggleWishlist={onToggleWishlist}
        onQuickAdd={onAddToCart}
        onSelectSneaker={onSelectSneaker}
        onViewAll={() => onNavigateToShop()}
      />

      {/* 9. New Arrivals 4-Card Grid */}
      <NewArrivals
        sneakers={sneakers}
        wishlistIds={wishlistIds}
        onToggleWishlist={onToggleWishlist}
        onQuickAdd={onAddToCart}
        onSelectSneaker={onSelectSneaker}
        onViewAll={() => onNavigateToShop({ collectionType: 'new-in' })}
      />

      {/* 10. Exclusive Limited Drops Dark Banner */}
      <ExclusiveDrops
        onShopNow={() => {
          const dropShoe = sneakers.find((s) => s.isLimitedDrop) || sneakers[0];
          onSelectSneaker(dropShoe);
        }}
        onSelectSneaker={onSelectSneaker}
        dropSneaker={sneakers.find((s) => s.isLimitedDrop) || sneakers[0]}
      />

      {/* 11. Discount Newsletter: "GET 10% OFF" */}
      <DiscountNewsletter onPromoReceived={onPromoReceived} />
    </div>
  );
};
