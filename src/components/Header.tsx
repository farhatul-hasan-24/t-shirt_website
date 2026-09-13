import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X, Truck } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const cartCount = useStore((s) => s.getCartCount());
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top banner */}
      <div className="bg-stone-900 text-stone-100 text-xs py-2 px-4 text-center">
        <span className="flex items-center justify-center gap-2">
          <Truck size={14} />
          Free shipping on orders over ৳1,500 (Inside Dhaka) | ৳2,500 (Outside Dhaka)
        </span>
      </div>

      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-stone-800 to-stone-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-stone-900 tracking-tight">TshirtHub</h1>
                <p className="text-[10px] text-stone-500 -mt-1 tracking-widest uppercase">Bangladesh</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors">
                Home
              </Link>
              <Link to="/products" className="text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors">
                Shop
              </Link>
              <Link to="/about" className="text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors">
                Contact
              </Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-stone-700 hover:text-stone-900 transition-colors"
              >
                <Search size={20} />
              </button>
              <Link
                to="/wishlist"
                className="p-2 text-stone-700 hover:text-stone-900 transition-colors hidden sm:block"
              >
                <Heart size={20} />
              </Link>
              <Link
                to="/account"
                className="p-2 text-stone-700 hover:text-stone-900 transition-colors"
              >
                <User size={20} />
              </Link>
              <Link
                to="/cart"
                className="p-2 text-stone-700 hover:text-stone-900 transition-colors relative"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-stone-200 bg-white py-4 px-4">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for t-shirts, styles, brands..."
                className="flex-1 px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent text-sm"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors text-sm font-medium"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white">
            <nav className="px-4 py-4 space-y-3">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-stone-700">
                Home
              </Link>
              <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-stone-700">
                Shop All
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-stone-700">
                About Us
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-stone-700">
                Contact
              </Link>
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-stone-700 sm:hidden">
                Wishlist
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
