import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Truck, Tag, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types/index.ts';
import { calculateCartTotals, validatePromoCode, formatPrice } from '../utils/cart.ts';
import { SneakerVisual } from './SneakerVisual.tsx';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
  appliedPromo: string;
  onApplyPromo: (code: string) => void;
  onClearPromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  appliedPromo,
  onApplyPromo,
  onClearPromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error: boolean } | null>(null);

  const promoValidation = appliedPromo ? validatePromoCode(appliedPromo) : null;
  const discountPercent = promoValidation?.valid ? promoValidation.discountPercent : 0;

  const totals = calculateCartTotals(items, discountPercent);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validatePromoCode(promoInput);
    if (result.valid) {
      onApplyPromo(promoInput);
      setPromoMessage({ text: result.message, error: false });
      setPromoInput('');
    } else {
      setPromoMessage({ text: result.message, error: true });
    }
  };

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
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">
                Your Bag
              </h2>
              <span className="bg-neutral-100 text-neutral-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {totals.itemCount}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-neutral-50 px-6 py-3.5 border-b border-neutral-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 mb-1.5">
              <Truck className="w-4 h-4 text-neutral-600" />
              {totals.isFreeShipping && items.length > 0 ? (
                <span className="text-emerald-600 font-bold">
                  You unlocked Free Standard Shipping!
                </span>
              ) : (
                <span>
                  Add <strong className="text-black">${totals.freeShippingRemaining.toFixed(2)}</strong> more for Free Shipping
                </span>
              )}
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-black h-full rounded-full transition-all duration-300"
                style={{ width: `${totals.freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-neutral-100">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                  <Tag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-1">
                  Your bag is empty
                </h3>
                <p className="text-xs text-neutral-500 mb-6">
                  Looks like you haven't added any kicks yet.
                </p>
                <button
                  onClick={onClose}
                  className="bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item, index) => (
                <div key={`${item.sneaker.id}-${item.selectedSize}-${index}`} className="py-4 flex gap-4">
                  {/* Sneaker Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-neutral-100 flex items-center justify-center p-2 shrink-0 border border-neutral-200/60">
                    <SneakerVisual
                      silhouette={item.sneaker.silhouette}
                      image={item.sneaker.image}
                      alt={item.sneaker.name}
                      primaryColor={item.sneaker.colors[item.selectedColorIndex] || '#111111'}
                      size="sm"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                          {item.sneaker.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                          aria-label={`Remove ${item.sneaker.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Size: US {item.selectedSize} · {item.sneaker.colorwayNames[item.selectedColorIndex] || 'Standard'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="p-1.5 hover:bg-neutral-200 text-neutral-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="p-1.5 hover:bg-neutral-200 text-neutral-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-black text-neutral-900">
                        ${(item.sneaker.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-neutral-200 bg-white space-y-4">
              
              {/* Promo Code Input */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-xl border border-emerald-200">
                    <span className="font-semibold">
                      Code <strong>{appliedPromo}</strong> applied ({discountPercent}% off)
                    </span>
                    <button
                      onClick={onClearPromo}
                      className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. KICKS10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-neutral-100 text-xs text-neutral-900 px-3 py-2 rounded-xl uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <button
                      type="submit"
                      className="bg-neutral-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoMessage && !appliedPromo && (
                  <p
                    className={`text-[11px] mt-1 ${
                      promoMessage.error ? 'text-red-500' : 'text-emerald-600'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">
                    {formatPrice(totals.subtotal)}
                  </span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({totals.discountPercent}%)</span>
                    <span>-{formatPrice(totals.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-neutral-900">
                    {totals.isFreeShipping ? 'FREE' : formatPrice(totals.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-neutral-900">
                    {formatPrice(totals.tax)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onCheckout}
                className="w-full bg-[#111111] hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Secure Checkout & Authenticity Guarantee</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
