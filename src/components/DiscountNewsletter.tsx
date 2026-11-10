import React, { useState } from 'react';
import { ArrowRight, Check, Tag } from 'lucide-react';

interface DiscountNewsletterProps {
  onPromoReceived?: (code: string) => void;
}

export const DiscountNewsletter: React.FC<DiscountNewsletterProps> = ({ onPromoReceived }) => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!agreed) {
      setError('Please agree to receive emails');
      return;
    }

    setError('');
    setSubmitted(true);
    if (onPromoReceived) {
      onPromoReceived('KICKS10');
    }
  };

  return (
    <section id="newsletter" className="py-16 sm:py-20 bg-neutral-900 text-white relative overflow-hidden border-b border-neutral-800">
      
      {/* Background sneaker imagery & dark scrim overlay */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1600&auto=format&fit=crop&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-neutral-950/80 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="text-[11px] font-bold tracking-[0.25em] text-neutral-400 uppercase mb-3 block">
          JOIN THE MOVEMENT
        </span>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-none mb-4">
          GET 10% OFF
        </h2>

        <p className="text-neutral-400 text-sm sm:text-base max-w-lg mx-auto mb-8">
          Be the first to know about new drops, exclusive offers and limited releases.
        </p>

        {submitted ? (
          <div className="bg-neutral-800/90 border border-neutral-700 rounded-2xl p-6 max-w-md mx-auto animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Check className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              You're on the VIP list!
            </h3>
            <p className="text-xs text-neutral-300 mb-4">
              Here is your 10% discount code for your first order:
            </p>
            <div className="inline-flex items-center gap-2 bg-neutral-950 px-4 py-2.5 rounded-xl border border-neutral-700 font-mono font-bold text-amber-400 text-sm">
              <Tag className="w-4 h-4" />
              <span>KICKS10</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex items-center bg-white rounded-xl p-1.5 shadow-2xl">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 px-4 py-2.5 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#111111] hover:bg-black text-white p-3 rounded-lg transition-colors shrink-0"
                aria-label="Submit newsletter subscription"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-xs mt-2 text-left">{error}</p>
            )}

            <label className="flex items-center justify-center gap-2 mt-4 text-xs text-neutral-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded border-neutral-700 bg-neutral-800 text-black focus:ring-0 w-3.5 h-3.5"
              />
              <span>I agree to receive marketing emails.</span>
            </label>
          </form>
        )}

      </div>
    </section>
  );
};
