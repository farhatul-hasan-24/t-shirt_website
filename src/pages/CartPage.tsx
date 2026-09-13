import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useStore();

  const subtotal = getCartTotal();
  const shippingEstimate = 60; // Inside Dhaka estimate
  const total = subtotal + shippingEstimate;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-stone-400" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900 mb-3">Your Cart is Empty</h1>
        <p className="text-stone-500 mb-8">Looks like you haven't added any items yet.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-stone-800 transition-colors"
        >
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const price = item.variant.salePrice || item.variant.price;
            const image = item.product.images.find((img) => img.isPrimary) || item.product.images[0];
            return (
              <div
                key={item.variant.id}
                className="flex gap-4 bg-white rounded-2xl p-4 border border-stone-200 shadow-sm"
              >
                {/* Image */}
                <Link to={`/products/${item.product.slug}`} className="w-24 h-28 sm:w-32 sm:h-36 rounded-xl overflow-hidden shrink-0">
                  <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="font-semibold text-stone-900 hover:text-amber-700 transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-stone-500 mt-1">
                      {item.variant.color.name} / {item.variant.size.name}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">SKU: {item.variant.sku}</p>
                  </div>

                  <div className="flex items-end justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-stone-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                        disabled={item.quantity >= item.variant.stock}
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 disabled:opacity-30"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price & Remove */}
                    <div className="text-right">
                      <p className="font-bold text-stone-900">৳{(price * item.quantity).toLocaleString()}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-stone-400">৳{price.toLocaleString()} each</p>
                      )}
                      <button
                        onClick={() => removeFromCart(item.variant.id)}
                        className="text-red-500 hover:text-red-600 mt-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm sticky top-28">
            <h2 className="text-lg font-bold text-stone-900 mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Subtotal ({cart.reduce((c, i) => c + i.quantity, 0)} items)</span>
                <span className="font-medium">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Shipping (estimated)</span>
                <span className="font-medium">৳{shippingEstimate}</span>
              </div>
              {subtotal >= 1500 && (
                <div className="flex justify-between text-green-600">
                  <span>Free shipping discount</span>
                  <span>-৳{shippingEstimate}</span>
                </div>
              )}
              <div className="border-t border-stone-200 pt-3 flex justify-between">
                <span className="font-semibold text-stone-900">Total</span>
                <span className="font-bold text-lg text-stone-900">
                  ৳{(subtotal >= 1500 ? subtotal : total).toLocaleString()}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-6 w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-4 rounded-xl font-semibold hover:bg-stone-800 transition-colors"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </Link>

            <Link
              to="/products"
              className="mt-3 w-full flex items-center justify-center gap-2 border border-stone-300 text-stone-700 py-3 rounded-xl font-medium hover:bg-stone-50 transition-colors"
            >
              Continue Shopping
            </Link>

            {/* Trust badges */}
            <div className="mt-6 pt-4 border-t border-stone-200 space-y-2">
              <p className="text-xs text-stone-500 text-center">🔒 Secure checkout</p>
              <p className="text-xs text-stone-500 text-center">📦 Free delivery over ৳1,500</p>
              <p className="text-xs text-stone-500 text-center">↩️ 7-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
