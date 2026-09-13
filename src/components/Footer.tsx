import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">TshirtHub</h3>
                <p className="text-[10px] text-stone-400 tracking-widest uppercase">Bangladesh</p>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Premium quality t-shirts delivered across Bangladesh. Crafted with care, designed for the modern you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-sm text-stone-400 hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/about" className="text-sm text-stone-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-stone-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/wishlist" className="text-sm text-stone-400 hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/account" className="text-sm text-stone-400 hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-stone-400">Shipping Policy</span></li>
              <li><span className="text-sm text-stone-400">Return & Exchange</span></li>
              <li><span className="text-sm text-stone-400">Size Guide</span></li>
              <li><span className="text-sm text-stone-400">Track Order</span></li>
              <li><span className="text-sm text-stone-400">FAQ</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <span className="text-sm text-stone-400">House 45, Road 12, Banani, Dhaka-1213</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-amber-500 shrink-0" />
                <span className="text-sm text-stone-400">+880 1712-345678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-amber-500 shrink-0" />
                <span className="text-sm text-stone-400">hello@tshirthub.bd</span>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <span className="text-xs bg-stone-800 px-3 py-1 rounded-full text-stone-400">bKash</span>
              <span className="text-xs bg-stone-800 px-3 py-1 rounded-full text-stone-400">Nagad</span>
              <span className="text-xs bg-stone-800 px-3 py-1 rounded-full text-stone-400">Rocket</span>
              <span className="text-xs bg-stone-800 px-3 py-1 rounded-full text-stone-400">COD</span>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-500">© 2024 TshirtHub Bangladesh. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-xs text-stone-500">Privacy Policy</span>
            <span className="text-xs text-stone-500">Terms of Service</span>
            <span className="text-xs text-stone-500">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
