/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SNEAKERS, CATEGORIES } from './data/products.ts';
import { Sneaker, CartItem } from './types/index.ts';
import { Header, PageView } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { WishlistDrawer } from './components/WishlistDrawer.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';

// Dedicated Pages
import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { CollectionsPage } from './pages/CollectionsPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';

export default function App() {
  const [sneakers] = useState<Sneaker[]>(SNEAKERS);
  const [categories] = useState(CATEGORIES);

  // Active page state
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('all');
  const [shopFilterOptions, setShopFilterOptions] = useState<{
    category?: string;
    collectionType?: string;
  }>({});

  // Cart & Wishlist state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      sneaker: SNEAKERS[2], // Jordan 4 Retro pre-loaded for delightful preview
      selectedSize: 10,
      selectedColorIndex: 0,
      quantity: 1,
    },
  ]);

  const [wishlistIds, setWishlistIds] = useState<string[]>([
    'nike-dunk-low',
    'salomon-xt-6',
  ]);

  // Modals & Overlay state
  const [selectedSneaker, setSelectedSneaker] = useState<Sneaker | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger floating toast message
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  // URL Hash synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash.startsWith('collections/')) {
        const sub = hash.replace('collections/', '');
        setCurrentPage('collections');
        setSelectedCollectionId(sub);
      } else if (hash === 'collections') {
        setCurrentPage('collections');
        setSelectedCollectionId('all');
      } else if (hash === 'shop' || hash === 'store') {
        setCurrentPage('shop');
      } else if (hash === 'about') {
        setCurrentPage('about');
      } else if (hash === 'contact') {
        setCurrentPage('contact');
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Page Navigation Handler
  const navigateToPage = (
    page: PageView,
    options?: { category?: string; collectionType?: string; collectionId?: string }
  ) => {
    setCurrentPage(page);
    if (page === 'collections') {
      const colId = options?.collectionId || 'all';
      setSelectedCollectionId(colId);
      window.location.hash = colId !== 'all' ? `collections/${colId}` : 'collections';
    } else {
      window.location.hash = page;
    }

    if (page === 'shop' && options) {
      setShopFilterOptions({
        category: options.category,
        collectionType: options.collectionType,
      });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (
    sneaker: Sneaker,
    size: number = 10,
    colorIndex: number = 0
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.sneaker.id === sneaker.id &&
          item.selectedSize === size &&
          item.selectedColorIndex === colorIndex
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      }

      return [
        ...prev,
        {
          sneaker,
          selectedSize: size,
          selectedColorIndex: colorIndex,
          quantity: 1,
        },
      ];
    });

    showToast(`Added ${sneaker.name} to your bag`);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(index);
      return;
    }
    setCartItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], quantity: newQty };
      return next;
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    showToast('Removed item from bag');
  };

  // Wishlist operations
  const handleToggleWishlist = (sneaker: Sneaker) => {
    setWishlistIds((prev) => {
      if (prev.includes(sneaker.id)) {
        showToast(`Removed from wishlist`);
        return prev.filter((id) => id !== sneaker.id);
      } else {
        showToast(`Saved to wishlist`);
        return [...prev, sneaker.id];
      }
    });
  };

  const wishlistSneakers = sneakers.filter((s) => wishlistIds.includes(s.id));
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-neutral-700 animate-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header Navigation */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onSelectSneaker={(s) => setSelectedSneaker(s)}
        sneakers={sneakers}
        currentPage={currentPage}
        onNavigatePage={(p) => navigateToPage(p)}
      />

      {/* Page Content View Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            sneakers={sneakers}
            categories={categories}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={(s) => handleAddToCart(s)}
            onSelectSneaker={(s) => setSelectedSneaker(s)}
            onNavigateToShop={(filter) => navigateToPage('shop', filter)}
            onNavigateToCollection={(colId) =>
              navigateToPage('collections', { collectionId: colId })
            }
            onNavigateToAbout={() => navigateToPage('about')}
            onPromoReceived={(code) => {
              setAppliedPromo(code);
              showToast(`Promo code ${code} unlocked & ready in your bag!`);
            }}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            sneakers={sneakers}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={(s) => handleAddToCart(s)}
            onSelectSneaker={(s) => setSelectedSneaker(s)}
            initialCategory={shopFilterOptions.category}
            initialCollectionType={shopFilterOptions.collectionType}
          />
        )}

        {currentPage === 'collections' && (
          <CollectionsPage
            categories={categories}
            sneakers={sneakers}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={(s) => handleAddToCart(s)}
            onSelectSneaker={(s) => setSelectedSneaker(s)}
            selectedCollectionId={selectedCollectionId}
            onSelectCollectionId={(id) => {
              setSelectedCollectionId(id);
              window.location.hash = id !== 'all' ? `collections/${id}` : 'collections';
            }}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigateToShop={() => navigateToPage('shop')}
            onNavigateToContact={() => navigateToPage('contact')}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage onShowToast={showToast} />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigatePage={(p, filter) => navigateToPage(p, filter)} />

      {/* Universal Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedPromo={appliedPromo}
        onApplyPromo={(code) => {
          setAppliedPromo(code);
          showToast(`Applied promo code ${code}`);
        }}
        onClearPromo={() => {
          setAppliedPromo('');
          showToast('Promo code removed');
        }}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistSneakers={wishlistSneakers}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToCart={(s) => handleAddToCart(s)}
      />

      <ProductDetailModal
        sneaker={selectedSneaker}
        onClose={() => setSelectedSneaker(null)}
        onAddToCart={(s, size, color) => handleAddToCart(s, size, color)}
        isWishlisted={selectedSneaker ? wishlistIds.includes(selectedSneaker.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discountPercent={appliedPromo ? 10 : 0}
        onOrderComplete={() => {
          setCartItems([]);
          showToast('Order confirmed! Check receipt details.');
        }}
      />

    </div>
  );
}
