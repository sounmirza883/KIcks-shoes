import { CartItem } from '../types/index.ts';

export interface CartCalculationResult {
  itemCount: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  shippingFee: number;
  tax: number;
  total: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  freeShippingProgress: number; // 0 to 100
  isFreeShipping: boolean;
}

export const FREE_SHIPPING_THRESHOLD = 150;
export const STANDARD_SHIPPING_FEE = 15;
export const TAX_RATE = 0.08;

export function calculateCartTotals(
  items: CartItem[],
  discountPercent: number = 0,
  freeShippingThreshold: number = FREE_SHIPPING_THRESHOLD
): CartCalculationResult {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.sneaker.price * item.quantity,
    0
  );

  const roundedSubtotal = Math.round(subtotal * 100) / 100;
  const discountAmount =
    Math.round(roundedSubtotal * (discountPercent / 100) * 100) / 100;
  const taxableAmount = Math.max(0, roundedSubtotal - discountAmount);

  const isFreeShipping = roundedSubtotal >= freeShippingThreshold || items.length === 0;
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;

  const tax = Math.round(taxableAmount * TAX_RATE * 100) / 100;
  const total =
    items.length === 0
      ? 0
      : Math.round((taxableAmount + shippingFee + tax) * 100) / 100;

  const freeShippingRemaining = Math.max(
    0,
    Math.round((freeShippingThreshold - roundedSubtotal) * 100) / 100
  );

  const freeShippingProgress =
    freeShippingThreshold > 0
      ? Math.min(100, Math.round((roundedSubtotal / freeShippingThreshold) * 100))
      : 100;

  return {
    itemCount,
    subtotal: roundedSubtotal,
    discountPercent,
    discountAmount,
    shippingFee,
    tax,
    total,
    freeShippingThreshold,
    freeShippingRemaining,
    freeShippingProgress,
    isFreeShipping,
  };
}

export function validatePromoCode(rawCode: string): {
  valid: boolean;
  discountPercent: number;
  message: string;
} {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { valid: false, discountPercent: 0, message: 'Please enter a code' };
  }

  const promoCodes: Record<string, { percent: number; label: string }> = {
    KICKS10: { percent: 10, label: '10% Welcome Discount applied' },
    NEXTSTEP: { percent: 15, label: '15% Early Access discount applied' },
    VIP20: { percent: 20, label: '20% Collector VIP discount applied' },
    DROPS: { percent: 10, label: '10% Drop promo applied' },
  };

  if (promoCodes[code]) {
    return {
      valid: true,
      discountPercent: promoCodes[code].percent,
      message: promoCodes[code].label,
    };
  }

  return {
    valid: false,
    discountPercent: 0,
    message: 'Invalid promo code. Try "KICKS10"',
  };
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
