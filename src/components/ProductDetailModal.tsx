import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Check,
  ThumbsUp,
  MessageSquarePlus,
  BadgeCheck,
  ChevronRight,
} from 'lucide-react';
import { Sneaker, Review } from '../types/index.ts';
import { SneakerVisual } from './SneakerVisual.tsx';
import { calculateReviewStats, INITIAL_REVIEWS_SEED } from '../utils/reviews.ts';

interface ProductDetailModalProps {
  sneaker: Sneaker | null;
  onClose: () => void;
  onAddToCart: (sneaker: Sneaker, size: number, colorIndex: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (sneaker: Sneaker) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  sneaker,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [selectedSize, setSelectedSize] = useState<number>(sneaker?.sizes[2] || 9);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [isAdded, setIsAdded] = useState(false);

  // Reviews state per sneaker
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formRating, setFormRating] = useState<number>(5);
  const [formHoverRating, setFormHoverRating] = useState<number>(0);
  const [formAuthor, setFormAuthor] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [helpfulVotedIds, setHelpfulVotedIds] = useState<string[]>([]);

  useEffect(() => {
    if (sneaker) {
      setSelectedSize(sneaker.sizes[2] || 9);
      setSelectedColorIndex(0);
      setActiveTab('details');
      setIsFormOpen(false);
      setFormSuccess(false);

      // Load initial reviews or seed reviews for this sneaker
      const seedReviews =
        INITIAL_REVIEWS_SEED[sneaker.id] || [
          {
            id: `rev-${sneaker.id}-1`,
            author: 'Jordan Miller',
            rating: 5,
            date: '3 days ago',
            title: 'Incredible silhouette & comfort',
            comment: `The quality on this pair of ${sneaker.name} is top tier. Fits true to size with premium cushioning. Definitely recommend!`,
            verifiedPurchase: true,
            helpfulCount: 14,
          },
          {
            id: `rev-${sneaker.id}-2`,
            author: 'Taylor Brooks',
            rating: Math.max(4, Math.floor(sneaker.rating)),
            date: '1 week ago',
            title: 'Great authentic quality',
            comment:
              'Box arrived double-boxed and pristine with all verification tags. Styling looks even better in person.',
            verifiedPurchase: true,
            helpfulCount: 8,
          },
        ];
      setReviews(seedReviews);
    }
  }, [sneaker]);

  if (!sneaker) return null;

  const stats = calculateReviewStats(reviews);

  const handleAdd = () => {
    onAddToCart(sneaker, selectedSize, selectedColorIndex);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  const handleHelpfulClick = (reviewId: string) => {
    if (helpfulVotedIds.includes(reviewId)) return;
    setHelpfulVotedIds((prev) => [...prev, reviewId]);
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
      )
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthor.trim()) {
      setFormError('Please enter your name');
      return;
    }
    if (!formTitle.trim()) {
      setFormError('Please enter a review headline');
      return;
    }
    if (!formComment.trim()) {
      setFormError('Please provide your review thoughts');
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      author: formAuthor.trim(),
      rating: formRating,
      date: 'Just now',
      title: formTitle.trim(),
      comment: formComment.trim(),
      verifiedPurchase: true,
      helpfulCount: 0,
    };

    setReviews([newReview, ...reviews]);
    setFormAuthor('');
    setFormTitle('');
    setFormComment('');
    setFormRating(5);
    setFormError('');
    setIsFormOpen(false);
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3500);
  };

  const starLabels: Record<number, string> = {
    1: '1 - Poor',
    2: '2 - Fair',
    3: '3 - Average',
    4: '4 - Very Good',
    5: '5 - Excellent',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center p-4">
        <div className="inline-block w-full max-w-3xl my-8 text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl overflow-hidden relative border border-neutral-200">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close product preview"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            
            {/* Left Preview Box (Sneaker Visual & Perks) */}
            <div className="md:col-span-5 bg-[#F8F9FA] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-200">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold">
                    {sneaker.brand} / {sneaker.category}
                  </span>
                  {sneaker.isLimitedDrop && (
                    <span className="text-[10px] font-bold uppercase bg-red-600 text-white px-2 py-0.5 rounded-full">
                      {sneaker.tag || 'LIMITED'}
                    </span>
                  )}
                </div>

                {/* Main Sneaker Visual Showcase */}
                <div className="my-6 flex items-center justify-center">
                  <SneakerVisual
                    silhouette={sneaker.silhouette}
                    image={sneaker.image}
                    alt={sneaker.name}
                    primaryColor={sneaker.colors[selectedColorIndex] || '#111111'}
                    size="lg"
                    className="transform -rotate-6 hover:rotate-0 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Perks Row */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-200/80 text-[11px] text-neutral-600 text-center">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-neutral-800 mb-1" />
                  <span>100% Authentic</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 text-neutral-800 mb-1" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 text-neutral-800 mb-1" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>

            {/* Right Pane (Tabbed: Details vs Customer Reviews) */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div>
                
                {/* Header Tab Switcher */}
                <div className="flex items-center gap-3 border-b border-neutral-200 pb-3 mb-5">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`text-xs font-bold uppercase tracking-wider pb-1 transition-colors cursor-pointer ${
                      activeTab === 'details'
                        ? 'text-black border-b-2 border-black font-extrabold'
                        : 'text-neutral-400 hover:text-black'
                    }`}
                  >
                    Product Details
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`text-xs font-bold uppercase tracking-wider pb-1 transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'reviews'
                        ? 'text-black border-b-2 border-black font-extrabold'
                        : 'text-neutral-400 hover:text-black'
                    }`}
                  >
                    <span>Customer Reviews</span>
                    <span className="bg-neutral-100 text-neutral-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {stats.totalReviews}
                    </span>
                  </button>
                </div>

                {/* TAB 1: PRODUCT DETAILS */}
                {activeTab === 'details' && (
                  <div>
                    {/* Title & Clickable Rating */}
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="flex items-center gap-2 mb-2 text-left group cursor-pointer"
                      title="View Customer Reviews"
                    >
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(stats.averageRating)
                                ? 'fill-current text-amber-400'
                                : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-neutral-900">
                        {stats.averageRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-neutral-400 group-hover:text-black transition-colors underline decoration-dotted">
                        ({stats.totalReviews} reviews)
                      </span>
                    </button>

                    <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tight mb-2">
                      {sneaker.name}
                    </h2>

                    <div className="flex items-baseline gap-3 mb-5">
                      <span className="text-2xl font-black text-neutral-900">
                        ${sneaker.price.toFixed(2)}
                      </span>
                      {sneaker.originalPrice && (
                        <span className="text-sm font-semibold text-neutral-400 line-through">
                          ${sneaker.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Color Selector */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-800 mb-2">
                        <span>Colorway:</span>
                        <span className="text-neutral-500 font-medium">
                          {sneaker.colorwayNames[selectedColorIndex] || 'Selected'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {sneaker.colors.map((color, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedColorIndex(idx)}
                            className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                              selectedColorIndex === idx
                                ? 'ring-2 ring-black ring-offset-2 scale-110 border-white'
                                : 'border-neutral-300 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                            aria-label={`Select colorway ${idx + 1}`}
                          >
                            {selectedColorIndex === idx && (
                              <Check
                                className={`w-3 h-3 ${
                                  color === '#FFFFFF' ? 'text-black' : 'text-white'
                                }`}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Size Selector */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-800 mb-2">
                        <span>Select Size (US Men):</span>
                        <span className="text-neutral-500 font-medium cursor-pointer hover:underline">
                          Size Guide
                        </span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {sneaker.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              selectedSize === size
                                ? 'bg-black text-white shadow-md'
                                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                            }`}
                          >
                            US {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description & Specs */}
                    <div className="mb-6">
                      <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                        {sneaker.description}
                      </p>
                      <ul className="space-y-1 text-[11px] text-neutral-500 list-disc list-inside">
                        {sneaker.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Quick Link to Reviews */}
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="w-full py-2.5 px-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-700 flex items-center justify-between transition-colors mb-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                        <span>Read Customer Feedback ({stats.totalReviews} reviews)</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </button>
                  </div>
                )}

                {/* TAB 2: CUSTOMER REVIEWS & FORM */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    
                    {/* Success Alert Banner */}
                    {formSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Thank you! Your verified review has been published.</span>
                      </div>
                    )}

                    {/* Overall Rating & Breakdown Card */}
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        
                        {/* Score */}
                        <div className="sm:col-span-5 text-center sm:text-left sm:border-r border-neutral-200 sm:pr-4">
                          <p className="text-4xl font-black text-neutral-900">
                            {stats.averageRating.toFixed(1)}
                          </p>
                          <div className="flex items-center justify-center sm:justify-start text-amber-400 my-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(stats.averageRating)
                                    ? 'fill-current text-amber-400'
                                    : 'text-neutral-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-neutral-500">
                            Based on {stats.totalReviews} verified reviews
                          </p>
                        </div>

                        {/* Distribution Bars */}
                        <div className="sm:col-span-7 space-y-1 text-xs text-neutral-600">
                          {stats.distribution.map((d) => (
                            <div key={d.star} className="flex items-center gap-2">
                              <span className="w-3 text-[11px] font-semibold">
                                {d.star}★
                              </span>
                              <div className="flex-1 bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-neutral-900 h-full rounded-full transition-all duration-300"
                                  style={{ width: `${d.percentage}%` }}
                                />
                              </div>
                              <span className="w-8 text-right text-[10px] text-neutral-400 font-mono">
                                {d.percentage}%
                              </span>
                            </div>
                          ))}
                        </div>

                      </div>

                      {/* Write Review Action Toggle */}
                      <div className="pt-3 mt-3 border-t border-neutral-200/70 flex items-center justify-between">
                        <span className="text-xs text-neutral-600 font-medium">
                          Have you worn this pair?
                        </span>
                        <button
                          onClick={() => setIsFormOpen(!isFormOpen)}
                          className="inline-flex items-center gap-1.5 bg-[#111111] hover:bg-black text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          <MessageSquarePlus className="w-3.5 h-3.5" />
                          <span>{isFormOpen ? 'Cancel' : 'Write a Review'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Review Submission Form */}
                    {isFormOpen && (
                      <form
                        onSubmit={handleReviewSubmit}
                        className="bg-white p-4 rounded-2xl border-2 border-neutral-900 shadow-md space-y-3.5 animate-in slide-in-from-top-2 duration-200"
                      >
                        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-tight">
                          Write Your Customer Review
                        </h4>

                        {/* Interactive Star Rating Picker */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                            Overall Rating *
                          </label>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const isHighlighted =
                                  (formHoverRating || formRating) >= star;
                                return (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormRating(star)}
                                    onMouseEnter={() => setFormHoverRating(star)}
                                    onMouseLeave={() => setFormHoverRating(0)}
                                    className="p-1 hover:scale-115 transition-transform text-amber-400 cursor-pointer"
                                    aria-label={`Rate ${star} star`}
                                  >
                                    <Star
                                      className={`w-5 h-5 ${
                                        isHighlighted
                                          ? 'fill-current text-amber-400'
                                          : 'text-neutral-300'
                                      }`}
                                    />
                                  </button>
                                );
                              })}
                            </div>
                            <span className="text-xs font-semibold text-neutral-600 ml-2">
                              {starLabels[formHoverRating || formRating]}
                            </span>
                          </div>
                        </div>

                        {/* Name Input */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Alex Morgan"
                            value={formAuthor}
                            onChange={(e) => setFormAuthor(e.target.value)}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-black"
                          />
                        </div>

                        {/* Title Input */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                            Review Headline *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Unmatched comfort and iconic look"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-black"
                          />
                        </div>

                        {/* Written Comments */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                            Written Feedback *
                          </label>
                          <textarea
                            rows={3}
                            required
                            placeholder="How is the sizing, arch support, and leather quality?"
                            value={formComment}
                            onChange={(e) => setFormComment(e.target.value)}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-black resize-none"
                          />
                        </div>

                        {formError && (
                          <p className="text-xs text-red-500 font-medium">
                            {formError}
                          </p>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setIsFormOpen(false)}
                            className="px-3 py-1.5 text-xs text-neutral-600 hover:text-black font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-black hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Post Review
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-3">
                      {reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-3.5 bg-white border border-neutral-200/80 rounded-2xl space-y-2 hover:border-neutral-300 transition-colors"
                        >
                          {/* Top: Stars, Title, Date */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center text-amber-400 mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < rev.rating
                                        ? 'fill-current text-amber-400'
                                        : 'text-neutral-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <h5 className="text-xs font-bold text-neutral-900">
                                {rev.title}
                              </h5>
                            </div>
                            <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                              {rev.date}
                            </span>
                          </div>

                          {/* Comment */}
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            {rev.comment}
                          </p>

                          {/* Bottom Row: Author, Verified Badge, Helpful vote */}
                          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-neutral-800">
                                {rev.author}
                              </span>
                              {rev.verifiedPurchase && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-medium">
                                  <BadgeCheck className="w-3 h-3 text-emerald-600" />
                                  <span>Verified Buyer</span>
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => handleHelpfulClick(rev.id)}
                              className={`inline-flex items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
                                helpfulVotedIds.includes(rev.id)
                                  ? 'text-neutral-900 font-bold'
                                  : 'text-neutral-400 hover:text-black'
                              }`}
                              title="Mark as helpful"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>Helpful ({rev.helpfulCount || 0})</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

              </div>

              {/* Bottom Sticky Action Bar: Add to Bag + Wishlist */}
              <div className="pt-4 mt-4 border-t border-neutral-200 flex items-center gap-3">
                <button
                  onClick={handleAdd}
                  disabled={isAdded}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-98 cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#111111] hover:bg-black text-white hover:-translate-y-0.5'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag (${sneaker.price.toFixed(2)})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleWishlist(sneaker)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
                  />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
