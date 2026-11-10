'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { SNEAKERS } from '../data/products.ts';
import { Sneaker, CartItem } from '../types/index.ts';
import { Header } from './Header.tsx';
import { Footer } from './Footer.tsx';
import { CartDrawer } from './CartDrawer.tsx';
import { WishlistDrawer } from './WishlistDrawer.tsx';
import { ProductDetailModal } from './ProductDetailModal.tsx';
import { CheckoutModal } from './CheckoutModal.tsx';
import { AuthModal, AuthMode } from './AuthModal.tsx';
import { supabase, openedFromRecoveryLink } from '../lib/supabase.ts';
import { validatePromoCode, MAX_LINE_QUANTITY } from '../utils/cart.ts';
import { hrefFor, pageFromPathname, PageView, NavOptions } from '../utils/routes.ts';

// What the screens (src/screens) need from the shared state. Everything else stays private to the provider.
interface Store {
  user: User | null | undefined;
  wishlistIds: string[];
  toggleWishlist: (sneaker: Sneaker) => void;
  addToCart: (sneaker: Sneaker, size?: number, colorIndex?: number) => void;
  selectSneaker: (sneaker: Sneaker | null) => void;
  receivePromo: (code: string) => void;
  showToast: (message: string) => void;
  openAuth: (mode: AuthMode) => void;
  navigate: (page: PageView, options?: NavOptions) => void;
}

const StoreContext = createContext<Store | null>(null);

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside <StoreProvider>');
  return store;
}

// Holds the state that used to live in App.tsx and renders the chrome (header, footer, drawers, modals) around the page.
export function StoreProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

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

  // Supabase auth: undefined = session still loading, null = signed out. authMode null = modal closed.
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const closeAuth = useCallback(() => setAuthMode(null), []);

  // Trigger floating toast message
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  // Auth session. onAuthStateChange also fires INITIAL_SESSION for a stored session.
  useEffect(() => {
    if (!supabase) {
      setUser(null);
      return;
    }
    if (openedFromRecoveryLink) setAuthMode('recovery');
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') setAuthMode('recovery');
      // Don't leave one person's wishlist on screen for the next person on this device.
      if (event === 'SIGNED_OUT') setWishlistIds([]);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load the signed-in user's wishlist. Kept out of the callback above: awaiting supabase calls inside it can deadlock.
  const userId = user?.id;
  useEffect(() => {
    if (!supabase || !userId) return;
    let cancelled = false;
    supabase
      .from('wishlist_items')
      .select('sneaker_id')
      .then(({ data }) => {
        if (!cancelled && data) setWishlistIds(data.map((row) => row.sneaker_id));
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const navigate = (page: PageView, options?: NavOptions) => {
    router.push(hrefFor(page, options));
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
          quantity: Math.min(MAX_LINE_QUANTITY, next[existingIndex].quantity + 1),
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
      next[index] = { ...next[index], quantity: Math.min(MAX_LINE_QUANTITY, newQty) };
      return next;
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    showToast('Removed item from bag');
  };

  // Wishlist operations
  const handleToggleWishlist = (sneaker: Sneaker) => {
    const adding = !wishlistIds.includes(sneaker.id);
    const setSaved = (saved: boolean) =>
      setWishlistIds((prev) =>
        saved
          ? prev.includes(sneaker.id) ? prev : [...prev, sneaker.id]
          : prev.filter((id) => id !== sneaker.id)
      );

    setSaved(adding);
    showToast(adding ? 'Saved to wishlist' : 'Removed from wishlist');

    // Signed-out hearts stay session-only. Signed-in: optimistic update, rolled back if the save fails.
    if (!supabase || !user) return;
    const request = adding
      ? supabase.from('wishlist_items').insert({ sneaker_id: sneaker.id })
      : supabase.from('wishlist_items').delete().eq('sneaker_id', sneaker.id);
    request.then(({ error }) => {
      // 23505 = already saved (e.g. a double click): the end state is what the user wanted.
      if (error && error.code !== '23505') {
        setSaved(!adding);
        showToast('Could not update your wishlist');
      }
    });
  };

  const wishlistSneakers = SNEAKERS.filter((s) => wishlistIds.includes(s.id));
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const promo = validatePromoCode(appliedPromo);

  const store: Store = {
    user,
    wishlistIds,
    toggleWishlist: handleToggleWishlist,
    addToCart: handleAddToCart,
    selectSneaker: setSelectedSneaker,
    receivePromo: (code) => {
      setAppliedPromo(code);
      showToast(`Promo code ${code} unlocked & ready in your bag!`);
    },
    showToast,
    openAuth: setAuthMode,
    navigate,
  };

  return (
    <StoreContext.Provider value={store}>
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
          onSelectSneaker={setSelectedSneaker}
          sneakers={SNEAKERS}
          currentPage={pageFromPathname(pathname)}
          onNavigatePage={(p) => navigate(p)}
          isSignedIn={!!user}
          onOpenAccount={() => (user ? navigate('account') : setAuthMode('signin'))}
        />

        {/* The current route's screen */}
        <main className="flex-1">{children}</main>

        {/* Global Footer */}
        <Footer onNavigatePage={(p, filter) => navigate(p, filter)} />

        {/* Universal Modals & Drawers */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onCheckout={() => {
            setIsCartOpen(false);
            if (user) {
              setIsCheckoutOpen(true);
            } else {
              setAuthMode('signin');
              showToast('Sign in to check out');
            }
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
          discountPercent={promo.discountPercent}
          appliedPromo={promo.valid ? appliedPromo : ''}
          userEmail={user?.email ?? ''}
          onOrderComplete={() => {
            setCartItems([]);
            showToast('Order confirmed! Check receipt details.');
          }}
        />

        <AuthModal
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={closeAuth}
          onToast={showToast}
        />

      </div>
    </StoreContext.Provider>
  );
}
