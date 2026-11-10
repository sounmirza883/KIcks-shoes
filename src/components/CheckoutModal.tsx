import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Banknote, Truck } from 'lucide-react';
import { CartItem } from '../types/index.ts';
import { calculateCartTotals, formatPrice } from '../utils/cart.ts';
import { supabase } from '../lib/supabase.ts';
import { buildOrderPayload, newRequestId, orderErrorMessage, CheckoutForm } from '../utils/orders.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discountPercent: number;
  appliedPromo: string; // valid promo code or '' (the server re-validates it)
  userEmail: string;
  onOrderComplete: () => void;
}

const EMPTY_FORM: CheckoutForm = {
  name: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  paymentMethod: 'card',
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discountPercent,
  appliedPromo,
  userEmail,
  onOrderComplete,
}) => {
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [formData, setFormData] = useState<CheckoutForm>(EMPTY_FORM);
  const [orderNumber, setOrderNumber] = useState('');
  const [paidTotal, setPaidTotal] = useState<number>(0);
  const [requestId, setRequestId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // This modal stays mounted while closed, so every open starts from a clean form and a fresh
  // idempotency key (a retry of the same submit reuses the key; a new checkout gets a new one).
  useEffect(() => {
    if (!isOpen) return;
    setStep('details');
    setFormData({ ...EMPTY_FORM, email: userEmail });
    setRequestId(newRequestId());
    setSubmitting(false);
    setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const totals = calculateCartTotals(items, discountPercent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!supabase) {
      setError('Checkout is unavailable: Supabase is not configured.');
      return;
    }
    setSubmitting(true);
    setError('');
    // The server prices the order; the success screen shows what it actually charged.
    const { data, error: rpcError } = await supabase.rpc(
      'place_order',
      buildOrderPayload(items, formData, appliedPromo, requestId)
    );
    setSubmitting(false);
    if (rpcError) {
      setError(orderErrorMessage(rpcError.message));
      return;
    }
    setOrderNumber(data.order_number);
    setPaidTotal(Number(data.total));
    setStep('success');
    onOrderComplete();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={step === 'success' ? onClose : undefined}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="min-h-screen px-4 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 border border-neutral-200">
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-black transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 'details' ? (
            <div>
              <div className="mb-6">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold block mb-1">
                  KICKS. SECURE CHECKOUT
                </span>
                <h2 className="text-2xl font-black text-neutral-900 uppercase">
                  Complete Your Order
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                    Payment Option
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                        formData.paymentMethod === 'card'
                          ? 'border-black bg-neutral-50 ring-1 ring-black'
                          : 'border-neutral-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === 'card'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                        className="hidden"
                      />
                      <CreditCard className="w-4 h-4 text-neutral-800" />
                      <span className="text-xs font-bold text-neutral-900">Credit / Debit Card</span>
                    </label>

                    <label
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                        formData.paymentMethod === 'cod'
                          ? 'border-black bg-neutral-50 ring-1 ring-black'
                          : 'border-neutral-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        className="hidden"
                      />
                      <Banknote className="w-4 h-4 text-neutral-800" />
                      <span className="text-xs font-bold text-neutral-900">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 text-xs space-y-1.5 mt-4">
                  <div className="flex justify-between text-neutral-600">
                    <span>Items ({totals.itemCount})</span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({totals.discountPercent}%)</span>
                      <span>-{formatPrice(totals.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span>{totals.isFreeShipping ? 'FREE' : formatPrice(totals.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Sales Tax</span>
                    <span>{formatPrice(totals.tax)}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>Total Amount Due</span>
                    <span>{formatPrice(totals.total)}</span>
                  </div>
                </div>

                {error && (
                  <p role="alert" className="text-xs font-semibold text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#111111] hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-lg mt-4 cursor-pointer"
                >
                  {submitting ? 'Placing order…' : `Confirm & Place Order (${formatPrice(totals.total)})`}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 block mb-1">
                Order Confirmed
              </span>
              <h2 className="text-3xl font-black text-neutral-900 uppercase mb-2">
                Thank You, {formData.name.split(' ')[0]}!
              </h2>
              <p className="text-sm text-neutral-600 max-w-md mx-auto mb-6">
                Your order <strong className="text-black font-mono">#{orderNumber}</strong> has been received and is being prepared for express dispatch.
              </p>

              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 text-left max-w-md mx-auto text-xs space-y-2 mb-6">
                <div className="flex items-center gap-2 text-neutral-800 font-bold mb-1">
                  <Truck className="w-4 h-4 text-neutral-700" />
                  <span>Estimated Delivery: 2-3 Business Days</span>
                </div>
                <p className="text-neutral-500">
                  Shipping to: {formData.address}, {formData.city}, {formData.state} {formData.zip}
                </p>
                <p className="text-neutral-500">
                  Receipt sent to: {formData.email}
                </p>
                <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-neutral-900">
                  <span>Total Paid</span>
                  <span>{formatPrice(paidTotal)}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="bg-black text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Back to Store
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
