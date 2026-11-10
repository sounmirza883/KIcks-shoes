import React from 'react';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Sneaker } from '../types/index.ts';
import { SneakerVisual } from './SneakerVisual.tsx';

interface ProductCardProps {
  sneaker: Sneaker;
  isWishlisted: boolean;
  onToggleWishlist: (sneaker: Sneaker) => void;
  onQuickAdd: (sneaker: Sneaker) => void;
  onSelectSneaker: (sneaker: Sneaker) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  sneaker,
  isWishlisted,
  onToggleWishlist,
  onQuickAdd,
  onSelectSneaker,
}) => {
  const [selectedColorIndex, setSelectedColorIndex] = React.useState(0);
  const [justAdded, setJustAdded] = React.useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(sneaker);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(sneaker);
  };

  return (
    <div
      onClick={() => onSelectSneaker(sneaker)}
      className="group cursor-pointer rounded-2xl p-4 bg-white hover:bg-neutral-50/80 border border-neutral-200/70 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
    >
      {/* Top Sneaker Image Card Container with Wishlist Icon */}
      <div className="relative w-full aspect-[4/3] rounded-xl bg-neutral-100/80 p-4 flex items-center justify-center overflow-hidden mb-4 group-hover:bg-neutral-200/50 transition-colors">
        
        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'text-neutral-400 hover:text-black hover:bg-white/80'
          }`}
          aria-label={isWishlisted ? `Remove ${sneaker.name} from wishlist` : `Add ${sneaker.name} to wishlist`}
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-600' : ''}`}
          />
        </button>

        {/* Sneaker Visual with dynamic color swatch reflection */}
        <SneakerVisual
          silhouette={sneaker.silhouette}
          image={sneaker.image}
          alt={sneaker.name}
          primaryColor={sneaker.colors[selectedColorIndex] || '#111111'}
          size="md"
          className="w-full h-full transform group-hover:scale-108 group-hover:-rotate-2 transition-transform duration-300"
        />
      </div>

      {/* Info: Name & Price */}
      <div className="mb-3">
        <h3 className="text-sm font-bold text-neutral-900 group-hover:text-black line-clamp-1">
          {sneaker.name}
        </h3>
        <p className="text-sm font-black text-neutral-900 mt-0.5">
          ${sneaker.price.toFixed(2)}
        </p>
      </div>

      {/* Bottom Row: Color Swatches + Quick Add Button */}
      <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
        
        {/* Color Dots */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {sneaker.colors.map((color, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedColorIndex(idx)}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                selectedColorIndex === idx
                  ? 'ring-2 ring-black ring-offset-1 scale-110'
                  : 'border-neutral-300 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              title={sneaker.colorwayNames[idx] || `Colorway ${idx + 1}`}
              aria-label={sneaker.colorwayNames[idx] || `Colorway ${idx + 1}`}
            />
          ))}
        </div>

        {/* Quick Add to Cart Button (Square black button matching mockup) */}
        <button
          onClick={handleQuickAdd}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            justAdded
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-[#111111] hover:bg-black text-white hover:scale-105 active:scale-95'
          }`}
          aria-label={`Add ${sneaker.name} to cart`}
        >
          {justAdded ? (
            <Check className="w-4 h-4 animate-in zoom-in-50" />
          ) : (
            <ShoppingBag className="w-4 h-4" />
          )}
        </button>

      </div>
    </div>
  );
};
