import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart size={40} className="text-stone-400" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900 mb-3">Your Wishlist is Empty</h1>
        <p className="text-stone-500 mb-8">Save your favorite items to buy them later.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-stone-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">My Wishlist</h1>
          <p className="text-stone-500 mt-1">{wishlist.length} items saved</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map(({ product }) => {
          const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
          const prices = product.variants.map((v) => v.salePrice || v.price);
          const minPrice = Math.min(...prices);
          const hasSale = product.variants.some((v) => v.salePrice !== null);
          const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

          return (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200">
              <Link to={`/products/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden">
                <img
                  src={primaryImage.url}
                  alt={primaryImage.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {hasSale && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    Sale
                  </span>
                )}
              </Link>
              <div className="p-4">
                <p className="text-[11px] text-stone-500 uppercase tracking-wider mb-1">{product.category.name}</p>
                <Link to={`/products/${product.slug}`}>
                  <h3 className="text-sm font-semibold text-stone-900 line-clamp-1 hover:text-amber-700 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-lg font-bold ${hasSale ? 'text-red-600' : 'text-stone-900'}`}>
                    ৳{minPrice.toLocaleString()}
                  </span>
                  {hasSale && (
                    <span className="text-xs text-stone-400 line-through">
                      ৳{Math.max(...product.variants.map((v) => v.price)).toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/products/${product.slug}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
                  >
                    <ShoppingBag size={14} /> View
                  </Link>
                  {totalStock > 0 && (
                    <button
                      onClick={() => {
                        const variant = product.variants.find((v) => v.stock > 0);
                        if (variant) addToCart(product, variant, 1);
                      }}
                      className="px-4 py-2.5 border border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      Add to Cart
                    </button>
                  )}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="p-2.5 border border-stone-300 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
