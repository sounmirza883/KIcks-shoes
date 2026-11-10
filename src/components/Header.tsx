import React, { useState, useRef, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, X, ArrowRight, Menu } from 'lucide-react';
import { Sneaker } from '../types/index.ts';

export type PageView = 'home' | 'shop' | 'collections' | 'about' | 'contact';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onSelectSneaker: (sneaker: Sneaker) => void;
  sneakers: Sneaker[];
  currentPage: PageView;
  onNavigatePage: (page: PageView) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onSelectSneaker,
  sneakers,
  currentPage,
  onNavigatePage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim()
    ? sneakers.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks: { label: string; page: PageView }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Store', page: 'shop' },
    { label: 'Collections', page: 'collections' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top Banner Ticker */}
      <div className="bg-[#111111] text-neutral-300 text-[11px] font-medium tracking-wider uppercase py-2 px-4 text-center select-none overflow-hidden">
        <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
          <span>Free Shipping on Orders Over $150</span>
          <span className="text-neutral-500 font-light">|</span>
          <span>Easy Returns</span>
          <span className="text-neutral-500 font-light">|</span>
          <span className="text-amber-400">100% Verified Authentic Drops</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 md:gap-8">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-8 shrink-0">
            <button
              onClick={() => onNavigatePage('home')}
              className="text-2xl sm:text-3xl font-black tracking-tighter text-[#111111] hover:opacity-85 transition-opacity cursor-pointer"
            >
              KICKS<span className="text-black">.</span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-neutral-600">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => onNavigatePage(link.page)}
                  className={`transition-colors whitespace-nowrap cursor-pointer pb-1 ${
                    currentPage === link.page
                      ? 'text-black font-extrabold border-b-2 border-black'
                      : 'hover:text-black'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Center Search Input with Instant Dropdown */}
          <div
            ref={searchContainerRef}
            className="relative flex-1 max-w-xs sm:max-w-sm hidden md:block"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search sneakers..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-neutral-100/90 text-sm text-neutral-900 placeholder:text-neutral-500 rounded-full pl-10 pr-8 py-2 border border-transparent focus:border-neutral-300 focus:bg-white focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
            {isSearchOpen && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 max-h-80 overflow-y-auto divide-y divide-neutral-100">
                  {searchResults.length > 0 ? (
                    searchResults.map((sneaker) => (
                      <button
                        key={sneaker.id}
                        onClick={() => {
                          onSelectSneaker(sneaker);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left py-2.5 px-3 flex items-center justify-between hover:bg-neutral-50 rounded-xl transition-colors group cursor-pointer"
                      >
                        <div>
                          <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                            {sneaker.brand}
                          </p>
                          <p className="text-sm font-semibold text-neutral-900 group-hover:text-black">
                            {sneaker.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-neutral-900">
                            ${sneaker.price.toFixed(2)}
                          </p>
                          <span className="text-[11px] text-neutral-500 font-medium">
                            {sneaker.category}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-6 text-center text-sm text-neutral-500">
                      No sneakers found for "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Header Actions: User, Wishlist, Cart */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* User Icon -> Navigates to About or Contact */}
            <button
              onClick={() => onNavigatePage('about')}
              className="p-2 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              aria-label="About Kicks"
              title="About Kicks"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              aria-label="View Wishlist"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Cart Icon */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-full transition-colors flex items-center cursor-pointer"
              aria-label="View Shopping Cart"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 hover:text-black rounded-lg cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 py-4 px-2 space-y-2 bg-white animate-in slide-in-from-top-2 duration-150">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search sneakers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-100 text-sm text-neutral-900 rounded-xl px-4 py-2.5 focus:outline-none"
              />
            </div>
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  onNavigatePage(link.page);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2.5 px-3 text-sm font-bold rounded-xl flex items-center justify-between cursor-pointer ${
                  currentPage === link.page
                    ? 'bg-black text-white'
                    : 'text-neutral-800 hover:bg-neutral-100'
                }`}
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
