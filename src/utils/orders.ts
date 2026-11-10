import { CartItem } from '../types/index.ts';

export interface CheckoutForm {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  paymentMethod: 'card' | 'cod';
}

// Arguments for the place_order RPC (supabase/schema.sql). Prices are never sent: the server prices the lines.
export function buildOrderPayload(
  items: CartItem[],
  form: CheckoutForm,
  promo: string,
  requestId: string
) {
  return {
    p_request_id: requestId,
    p_items: items.map((item) => ({
      sneaker_id: item.sneaker.id,
      size: item.selectedSize,
      color_index: item.selectedColorIndex,
      quantity: item.quantity,
    })),
    p_shipping: {
      name: form.name,
      email: form.email,
      address: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
    },
    p_payment_method: form.paymentMethod,
    p_promo: promo.trim() || null,
  };
}

// Idempotency key for place_order. crypto.randomUUID only exists in secure contexts (https/localhost) and the dev
// server listens on 0.0.0.0, so fall back to getRandomValues, which works over plain http too.
export function newRequestId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16)
  );
}

const ORDER_ERRORS: Record<string, string> = {
  invalid_promo: 'That promo code is not valid. Remove it from your bag and try again.',
  invalid_items: 'Something in your bag is unavailable. Please review it and try again.',
  rate_limited: 'Too many orders in the last hour. Please try again later.',
  not_authenticated: 'Please sign in again to place your order.',
};

// Only the error codes raised by place_order are shown; anything else gets a generic message.
export function orderErrorMessage(message: string): string {
  const code = Object.keys(ORDER_ERRORS).find((key) => message.includes(key));
  return code ? ORDER_ERRORS[code] : 'We could not place your order. Please try again.';
}
