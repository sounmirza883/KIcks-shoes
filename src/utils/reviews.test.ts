import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateReviewStats } from './reviews';
import { Review } from '../types';

test('calculateReviewStats handles empty review list gracefully', () => {
  const stats = calculateReviewStats([]);
  assert.equal(stats.totalReviews, 0);
  assert.equal(stats.averageRating, 5.0);
  assert.equal(stats.distribution.length, 5);
});

test('calculateReviewStats calculates accurate averages and star distribution', () => {
  const reviews: Review[] = [
    {
      id: '1',
      author: 'User A',
      rating: 5,
      date: 'today',
      title: 'Great',
      comment: 'Superb sneaker',
    },
    {
      id: '2',
      author: 'User B',
      rating: 4,
      date: 'yesterday',
      title: 'Nice',
      comment: 'Pretty comfortable',
    },
    {
      id: '3',
      author: 'User C',
      rating: 5,
      date: '2 days ago',
      title: 'Love it',
      comment: 'Best purchase ever',
    },
  ];

  const stats = calculateReviewStats(reviews);
  assert.equal(stats.totalReviews, 3);
  // (5 + 4 + 5) / 3 = 4.666... rounded to 4.7
  assert.equal(stats.averageRating, 4.7);

  const fiveStar = stats.distribution.find((d) => d.star === 5);
  const fourStar = stats.distribution.find((d) => d.star === 4);
  assert.equal(fiveStar?.count, 2);
  assert.equal(fiveStar?.percentage, 67);
  assert.equal(fourStar?.count, 1);
  assert.equal(fourStar?.percentage, 33);
});
