import { Link } from 'react-router-dom';
import { Award, Heart, Leaf, Users, Truck, Shield } from 'lucide-react';

export function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-400 text-sm font-medium tracking-widest uppercase">Our Story</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 mb-6">About TshirtHub Bangladesh</h1>
          <p className="text-lg text-stone-300 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to bring premium quality, thoughtfully designed t-shirts to every corner of Bangladesh — crafted with care, delivered with love.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-600 text-sm font-medium tracking-widest uppercase">Who We Are</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mt-3 mb-6">
                Born from a Love for Quality & Style
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  TshirtHub Bangladesh was founded in 2024 with a simple belief: everyone deserves access to premium quality t-shirts that look great, feel amazing, and don't break the bank.
                </p>
                <p>
                  Based in Dhaka, we've grown from a small startup to one of Bangladesh's most trusted online fashion destinations. Our team of designers, quality experts, and customer care professionals work tirelessly to bring you the best.
                </p>
                <p>
                  We source only the finest cotton and materials, working with ethical manufacturers who share our commitment to quality and sustainability. Every t-shirt in our collection is carefully inspected to ensure it meets our high standards.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-100 to-stone-100 rounded-3xl p-8 lg:p-12">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-stone-900">10K+</p>
                  <p className="text-sm text-stone-600 mt-1">Happy Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-stone-900">50+</p>
                  <p className="text-sm text-stone-600 mt-1">Unique Designs</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-stone-900">64</p>
                  <p className="text-sm text-stone-600 mt-1">Districts Covered</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-stone-900">4.8★</p>
                  <p className="text-sm text-stone-600 mt-1">Customer Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-amber-600 text-sm font-medium tracking-widest uppercase">Our Values</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mt-3">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-stone-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
                <Award size={28} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Premium Quality</h3>
              <p className="text-stone-600 leading-relaxed">
                We never compromise on quality. Every t-shirt is made from premium cotton with meticulous attention to stitching, fit, and finish.
              </p>
            </div>
            <div className="bg-stone-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
                <Heart size={28} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Customer First</h3>
              <p className="text-stone-600 leading-relaxed">
                Your satisfaction is our priority. From easy returns to responsive support, we're here to make your shopping experience delightful.
              </p>
            </div>
            <div className="bg-stone-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
                <Leaf size={28} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Sustainability</h3>
              <p className="text-stone-600 leading-relaxed">
                We use eco-friendly materials and packaging wherever possible. Our goal is to look good while doing good for the planet.
              </p>
            </div>
            <div className="bg-stone-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
                <Users size={28} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Community</h3>
              <p className="text-stone-600 leading-relaxed">
                We're proud to be a Bangladeshi brand supporting local talent, artisans, and the growing fashion community in our country.
              </p>
            </div>
            <div className="bg-stone-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
                <Truck size={28} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Fast Delivery</h3>
              <p className="text-stone-600 leading-relaxed">
                We deliver across all 64 districts of Bangladesh with reliable courier partners. Get your orders fast and in perfect condition.
              </p>
            </div>
            <div className="bg-stone-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
                <Shield size={28} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Trust & Security</h3>
              <p className="text-stone-600 leading-relaxed">
                Shop with confidence. Secure payments, authentic products, and a hassle-free return policy protect every purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-6">Ready to Find Your Perfect Tee?</h2>
          <p className="text-lg text-stone-600 mb-8">
            Explore our collection of premium t-shirts designed for the modern Bangladeshi lifestyle.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-stone-800 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
