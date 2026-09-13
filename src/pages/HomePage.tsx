import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RotateCcw, Star } from 'lucide-react';
import { products, categories } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function HomePage() {
  const featuredProducts = products.filter((p) => p.isFeatured);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop')] bg-cover bg-center" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-2xl">
            <span className="inline-block text-amber-400 text-sm font-medium tracking-widest uppercase mb-4">
              New Collection 2024
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Premium T-Shirts for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Bangladesh
              </span>
            </h1>
            <p className="text-lg text-stone-300 mb-8 leading-relaxed">
              Discover our curated collection of premium quality t-shirts. From oversized streetwear to minimal essentials — crafted for the modern Bangladeshi lifestyle.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-amber-600/30"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link
                to="/products?category=oversized"
                className="inline-flex items-center gap-2 border-2 border-stone-500 hover:border-white text-white px-8 py-4 rounded-xl font-semibold transition-all"
              >
                Explore Oversized
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Truck size={24} className="text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-stone-900">Free Delivery</p>
                <p className="text-xs text-stone-500">On orders over ৳1,500</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw size={24} className="text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-stone-900">Easy Returns</p>
                <p className="text-xs text-stone-500">7-day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield size={24} className="text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-stone-900">Secure Payment</p>
                <p className="text-xs text-stone-500">bKash, Nagad, Cards & COD</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star size={24} className="text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-stone-900">Premium Quality</p>
                <p className="text-xs text-stone-500">100% cotton guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 mb-3">Shop by Category</h2>
            <p className="text-stone-500">Find your perfect style</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group relative bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl p-8 lg:p-10 text-center hover:from-stone-800 hover:to-stone-900 transition-all duration-500 overflow-hidden"
              >
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-white transition-colors mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 group-hover:text-stone-300 transition-colors">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-amber-600 group-hover:text-amber-400 transition-colors">
                    Shop Now <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 mb-3">Featured Collection</h2>
              <p className="text-stone-500">Handpicked styles for you</p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10 sm:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-600"
            >
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-3xl p-8 lg:p-16 text-white text-center">
            <span className="text-amber-200 text-sm font-medium tracking-widest uppercase">Special Offer</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-4">Get ৳200 Off on Your First Order</h2>
            <p className="text-amber-100 mb-8 max-w-lg mx-auto">
              Use code <span className="font-bold bg-white/20 px-3 py-1 rounded-lg">FIRST200</span> at checkout. Valid on all products.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-amber-800 px-8 py-4 rounded-xl font-semibold hover:bg-stone-100 transition-colors"
            >
              Shop Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* All Products Preview */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 mb-3">All Products</h2>
            <p className="text-stone-500">Browse our complete collection</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-12 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-6">Payment Methods We Accept</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard', 'COD', 'Bank Transfer'].map((method) => (
              <span
                key={method}
                className="bg-white px-5 py-2 rounded-full text-sm font-medium text-stone-700 shadow-sm border border-stone-200"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
