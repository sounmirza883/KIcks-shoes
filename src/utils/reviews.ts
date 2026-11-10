import { Review } from '../types/index.ts';

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    star: number;
    count: number;
    percentage: number;
  }[];
}

export function calculateReviewStats(reviews: Review[]): ReviewStats {
  if (!reviews || reviews.length === 0) {
    return {
      averageRating: 5.0,
      totalReviews: 0,
      distribution: [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: 0,
        percentage: 0,
      })),
    };
  }

  const totalReviews = reviews.length;
  const sumRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = Math.round((sumRating / totalReviews) * 10) / 10;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const percentage = Math.round((count / totalReviews) * 100);
    return {
      star,
      count,
      percentage,
    };
  });

  return {
    averageRating,
    totalReviews,
    distribution,
  };
}

export const INITIAL_REVIEWS_SEED: Record<string, Review[]> = {
  'jordan-4-retro': [
    {
      id: 'rev-j4-1',
      author: 'Marcus Vance',
      rating: 5,
      date: '2 days ago',
      title: 'Grail status, unmatched materials',
      comment:
        'The leather quality on the White Cement remastered pair is buttery soft. The netting and waffle wings are rigid and secure. True to size with standard basketball socks.',
      verifiedPurchase: true,
      helpfulCount: 24,
    },
    {
      id: 'rev-j4-2',
      author: 'Elena Rostova',
      rating: 5,
      date: '1 week ago',
      title: 'Head-turner on and off the court',
      comment:
        'Easily the cleanest pair in my sneaker rotation right now. Shipping was rapid and authentication tags were intact. Super comfortable after 1 day break-in.',
      verifiedPurchase: true,
      helpfulCount: 17,
    },
    {
      id: 'rev-j4-3',
      author: 'David Chen',
      rating: 4,
      date: '2 weeks ago',
      title: 'Classic styling, slightly snug pinky toe',
      comment:
        'Phenomenal retro aesthetics and air bubble cushioning. If you have wide feet, I recommend going a half size up (+0.5). Otherwise a perfect 10/10.',
      verifiedPurchase: true,
      helpfulCount: 9,
    },
  ],
  'nike-dunk-low': [
    {
      id: 'rev-dunk-1',
      author: 'Sarah Jenkins',
      rating: 5,
      date: '3 days ago',
      title: 'Timeless Panda colorway',
      comment:
        'Goes with literally everything in my closet. Leather cleans easily with a damp wipe and comfort is great for all-day campus walking.',
      verifiedPurchase: true,
      helpfulCount: 31,
    },
    {
      id: 'rev-dunk-2',
      author: 'Liam O’Connor',
      rating: 4,
      date: '2 weeks ago',
      title: 'Crisp shape and fit',
      comment:
        'Classic dunk silhouette. Flat soles give a grounded feel. Creasing is minimal if you use sneaker shields.',
      verifiedPurchase: true,
      helpfulCount: 12,
    },
  ],
  'new-balance-9060': [
    {
      id: 'rev-nb-1',
      author: 'Tariq Al-Mansoor',
      rating: 5,
      date: '4 days ago',
      title: 'Walking on literal clouds',
      comment:
        'The sculpted dual-density ABZORB pods make this the most comfortable shoe I own. The suede textures and reflective accents are top-tier.',
      verifiedPurchase: true,
      helpfulCount: 42,
    },
    {
      id: 'rev-nb-2',
      author: 'Maya Lin',
      rating: 5,
      date: '1 week ago',
      title: 'Y2K chunky silhouette perfection',
      comment:
        'I get stopped every time I wear these in downtown LA. Sizing is 100% true to size. High arch support that actually works.',
      verifiedPurchase: true,
      helpfulCount: 19,
    },
  ],
};
