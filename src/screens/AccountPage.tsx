'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.ts';
import { useStore } from '../components/StoreProvider.tsx';
import { Order } from '../types/index.ts';
import { formatPrice } from '../utils/cart.ts';

export const AccountPage: React.FC = () => {
  const { user, openAuth, navigate } = useStore(); // user: undefined = session still loading
  const onSignIn = () => openAuth('signin');
  const onNavigateToShop = () => navigate('shop');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState('');
  const userId = user?.id;

  useEffect(() => {
    if (!supabase || !userId) return;
    let cancelled = false;
    setOrders(null);
    setError('');
    // One request: orders with their lines embedded, newest first, capped at 25.
    supabase
      .from('orders')
      .select('order_number, created_at, total, status, order_items(name, size, quantity, unit_price)')
      .order('created_at', { ascending: false })
      .limit(25)
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) setError('We could not load your orders. Please try again.');
        else setOrders(data as Order[]);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold block mb-1">
        KICKS. ACCOUNT
      </span>
      <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 uppercase mb-8">My Account</h1>

      {!supabase ? (
        <p className="text-sm text-neutral-600">
          Accounts are unavailable until Supabase is configured (see .env.example).
        </p>
      ) : user === undefined ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : user === null ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
          <p className="text-sm text-neutral-700 mb-4">Sign in to see your orders and saved wishlist.</p>
          <button
            onClick={onSignIn}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-50 border border-neutral-200 rounded-2xl p-5 mb-10">
            <div>
              <span className="block text-xs font-bold uppercase text-neutral-500">Signed in as</span>
              <span className="text-sm font-semibold text-neutral-900 break-all">{user.email}</span>
            </div>
            <button
              onClick={() => supabase?.auth.signOut()}
              className="border border-neutral-300 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>

          <h2 className="text-lg font-black uppercase text-neutral-900 mb-4">Order History</h2>

          {error ? (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          ) : orders === null ? (
            <p className="text-sm text-neutral-500">Loading orders…</p>
          ) : orders.length === 0 ? (
            <div className="text-sm text-neutral-600">
              <p className="mb-4">You haven't placed any orders yet.</p>
              <button
                onClick={onNavigateToShop}
                className="bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li
                  key={order.order_number}
                  className="border border-neutral-200 rounded-2xl p-5 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="font-mono font-bold text-neutral-900">#{order.order_number}</span>
                    <span className="text-xs text-neutral-500">
                      {new Date(order.created_at).toLocaleDateString()} · {order.status}
                    </span>
                  </div>
                  <ul className="space-y-1 text-neutral-600 text-xs">
                    {order.order_items.map((item, i) => (
                      <li key={i} className="flex justify-between gap-3">
                        <span>
                          {item.name} · Size {item.size} × {item.quantity}
                        </span>
                        <span>{formatPrice(item.unit_price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between font-bold text-neutral-900 pt-3 mt-3 border-t border-neutral-200">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};
