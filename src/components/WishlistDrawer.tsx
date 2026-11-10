import React from 'react';
import { X, Trash2, ShoppingBag, Heart } from 'lucide-react';
import { Sneaker } from '../types/index.ts';
import { SneakerVisual } from './SneakerVisual.tsx';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistSneakers: Sneaker[];
  onRemoveFromWishlist: (sneaker: Sneaker) => void;
  onMoveToCart: (sneaker: Sneaker) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistSneakers,
  onRemoveFromWishlist,
  onMoveToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-current" />
              <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">
                Saved Wishlist
              </h2>
              <span className="bg-neutral-100 text-neutral-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {wishlistSneakers.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-neutral-100">
            {wishlistSneakers.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-400">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-1">
                  Your wishlist is empty
                </h3>
                <p className="text-xs text-neutral-500 mb-6">
                  Save sneakers you love by tapping the heart icon.
                </p>
                <button
                  onClick={onClose}
                  className="bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  Explore Drops
                </button>
              </div>
            ) : (
              wishlistSneakers.map((sneaker) => (
                <div key={sneaker.id} className="py-4 flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl bg-neutral-100 flex items-center justify-center p-2 shrink-0 border border-neutral-200/60">
                    <SneakerVisual
                      silhouette={sneaker.silhouette}
                      image={sneaker.image}
                      alt={sneaker.name}
                      primaryColor={sneaker.colors[0] || '#111111'}
                      size="sm"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-neutral-900 line-clamp-1">
                      {sneaker.name}
                    </h4>
                    <p className="text-sm font-black text-neutral-900 mt-0.5">
                      ${sneaker.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          onMoveToCart(sneaker);
                          onRemoveFromWishlist(sneaker);
                        }}
                        className="bg-neutral-900 hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(sneaker)}
                        className="text-neutral-400 hover:text-red-500 p-1.5 transition-colors"
                        aria-label={`Remove ${sneaker.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-200 bg-neutral-50 text-center">
            <button
              onClick={onClose}
              className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Continue Browsing
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
