export interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5
  date: string;
  title: string;
  comment: string;
  verifiedPurchase?: boolean;
  helpfulCount?: number;
}

export interface Sneaker {
  id: string;
  name: string;
  brand: string;
  category: 'Lifestyle' | 'Running' | 'Basketball' | 'Casual';
  collectionType: 'all' | 'new-in' | 'best-sellers' | 'limited-edition';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  silhouette: 'jordan4' | 'jordan1' | 'dunk' | 'nb9060' | 'samba' | 'af1' | 'nb530' | 'campus' | 'vomero' | 'kayano' | 'salomon' | 'converse' | 'custom';
  colors: string[]; // hex codes for swatches
  colorwayNames: string[];
  sizes: number[]; // e.g. [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13]
  description: string;
  details: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isLimitedDrop?: boolean;
  tag?: string;
  reviews?: Review[];
}

export interface CartItem {
  sneaker: Sneaker;
  selectedSize: number;
  selectedColorIndex: number;
  quantity: number;
}

// Shape returned by the Account page query on public.orders (with embedded order_items).
export interface OrderItem {
  name: string;
  size: number;
  quantity: number;
  unit_price: number;
}

export interface Order {
  order_number: string;
  created_at: string;
  total: number;
  status: string;
  order_items: OrderItem[];
}

export interface CollectionCategory {
  id: string;
  name: string;
  itemCount: number;
  imageSilhouette: Sneaker['silhouette'];
  image?: string;
  bgColor: string;
  tagline: string;
}
