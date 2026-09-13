import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { type Product } from '../data/products';
import { useStore } from '../store/useStore';

export function ProductCard({ product }: { product: Product }) {
  const isInWishlist = useStore((s) => s.isInWishlist(product.id));
  const addToWishlist = useStore((s) => s.addToWishlist);
  const removeFromWishlist = useStore((s) => s.removeFromWishlist);
  const addToCart = useStore((s) => s.addToCart);

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const prices = product.variants.map((v) => v.salePrice || v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const hasSale = product.variants.some((v) => v.salePrice !== null);
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const availableVariant = product.variants.find((v) => v.stock > 0);
    if (availableVariant) {
      addToCart(product, availableVariant, 1);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100">
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden">
        <img
          src={primaryImage.url}
          alt={primaryImage.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasSale && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Sale</span>
          )}
          {product.isFeatured && (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Featured</span>
          )}
          {totalStock < 10 && totalStock > 0 && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Low Stock</span>
          )}
          {totalStock === 0 && (
            <span className="bg-stone-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Out of Stock</span>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isInWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors ${
              isInWishlist ? 'bg-red-500 text-white' : 'bg-white text-stone-700 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
          </button>
          {totalStock > 0 && (
            <button
              onClick={handleQuickAdd}
              className="w-9 h-9 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-md hover:bg-stone-700 transition-colors"
            >
              <ShoppingBag size={16} />
            </button>
          )}
        </div>
      </Link>

      {/* Info */}
      <Link to={`/products/${product.slug}`} className="block p-4">
        <p className="text-[11px] text-stone-500 uppercase tracking-wider mb-1">{product.category.name}</p>
        <h3 className="text-sm font-semibold text-stone-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-stone-500 mt-1 line-clamp-1">{product.shortDescription}</p>
        <div className="flex items-center gap-2 mt-3">
          {minPrice === maxPrice ? (
            <span className={`text-lg font-bold ${hasSale ? 'text-red-600' : 'text-stone-900'}`}>
              ৳{minPrice.toLocaleString()}
            </span>
          ) : (
            <>
              <span className={`text-lg font-bold ${hasSale ? 'text-red-600' : 'text-stone-900'}`}>
                ৳{minPrice.toLocaleString()}
              </span>
              <span className="text-xs text-stone-400">- ৳{maxPrice.toLocaleString()}</span>
            </>
          )}
          {hasSale && (
            <span className="text-xs text-stone-400 line-through ml-auto">
              ৳{Math.max(...product.variants.map((v) => v.price)).toLocaleString()}
            </span>
          )}
        </div>
        {/* Color swatches */}
        <div className="flex gap-1.5 mt-3">
          {[...new Set(product.variants.map((v) => v.color.id))].slice(0, 4).map((colorId) => {
            const color = product.variants.find((v) => v.color.id === colorId)?.color;
            return color ? (
              <span
                key={colorId}
                className="w-4 h-4 rounded-full border border-stone-200"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ) : null;
          })}
        </div>
      </Link>
    </div>
  );
}
