import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Minus, Plus, ChevronRight, Truck, Shield, RotateCcw, Check } from 'lucide-react';
import { products } from '../data/products';
import { useStore } from '../store/useStore';
import { ProductCard } from '../components/ProductCard';

export function ProductDetailPage() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const addToCart = useStore((s) => s.addToCart);
  const isInWishlist = useStore((s) => product ? s.isInWishlist(product.id) : false);
  const addToWishlist = useStore((s) => s.addToWishlist);
  const removeFromWishlist = useStore((s) => s.removeFromWishlist);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-stone-900 mb-4">Product Not Found</h1>
        <Link to="/products" className="text-amber-600 font-medium">← Back to Shop</Link>
      </div>
    );
  }

  const availableColors = [...new Set(product.variants.map((v) => v.color.name))];
  const availableSizes = selectedColor
    ? [...new Set(product.variants.filter((v) => v.color.name === selectedColor).map((v) => v.size.name))]
    : [...new Set(product.variants.map((v) => v.size.name))];

  const selectedVariant = product.variants.find(
    (v) => (!selectedColor || v.color.name === selectedColor) && (!selectedSize || v.size.name === selectedSize) && v.stock > 0
  ) || product.variants.find((v) => v.stock > 0);

  const currentPrice = selectedVariant ? (selectedVariant.salePrice || selectedVariant.price) : 0;
  const originalPrice = selectedVariant?.price || 0;
  const hasDiscount = selectedVariant?.salePrice !== null;
  const currentStock = selectedVariant?.stock || 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const relatedProducts = products.filter((p) => p.id !== product.id && p.category.id === product.category.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-500 mb-8">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-stone-900">Shop</Link>
        <ChevronRight size={14} />
        <Link to={`/products?category=${product.category.slug}`} className="hover:text-stone-900">{product.category.name}</Link>
        <ChevronRight size={14} />
        <span className="text-stone-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Image Gallery */}
        <div>
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 mb-4">
            <img
              src={product.images[selectedImage]?.url || product.images[0].url}
              alt={product.images[selectedImage]?.alt || product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-3">
            {product.images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === selectedImage ? 'border-amber-600' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <span className="text-sm text-amber-600 font-medium uppercase tracking-wider">{product.category.name}</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 mt-2 mb-4">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className={`text-3xl font-bold ${hasDiscount ? 'text-red-600' : 'text-stone-900'}`}>
              ৳{currentPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-stone-400 line-through">৳{originalPrice.toLocaleString()}</span>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                  -{Math.round((1 - currentPrice / originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-stone-600 leading-relaxed mb-8">{product.description}</p>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-stone-900 mb-3">
              Color: {selectedColor && <span className="font-normal text-stone-600">{selectedColor}</span>}
            </h3>
            <div className="flex gap-3">
              {availableColors.map((colorName) => {
                const color = product.variants.find((v) => v.color.name === colorName)?.color;
                return (
                  <button
                    key={colorName}
                    onClick={() => { setSelectedColor(colorName); setSelectedSize(null); }}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === colorName ? 'border-amber-500 scale-110 ring-2 ring-amber-200' : 'border-stone-200 hover:border-stone-400'
                    }`}
                    style={{ backgroundColor: color?.hex }}
                    title={colorName}
                  />
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-stone-900 mb-3">Size</h3>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((sizeName) => {
                const variant = product.variants.find(
                  (v) => v.size.name === sizeName && (!selectedColor || v.color.name === selectedColor)
                );
                const isOutOfStock = !variant || variant.stock === 0;
                return (
                  <button
                    key={sizeName}
                    onClick={() => !isOutOfStock && setSelectedSize(sizeName)}
                    disabled={isOutOfStock}
                    className={`w-14 h-12 rounded-lg border-2 text-sm font-medium transition-all ${
                      selectedSize === sizeName
                        ? 'bg-stone-900 text-white border-stone-900'
                        : isOutOfStock
                        ? 'border-stone-200 text-stone-300 cursor-not-allowed line-through'
                        : 'border-stone-300 text-stone-700 hover:border-stone-500'
                    }`}
                  >
                    {sizeName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-stone-900 mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-stone-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-stone-900"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-stone-900"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-sm text-stone-500">
                {currentStock > 0 ? `${currentStock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Add to Cart & Wishlist */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || currentStock === 0}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg transition-all ${
                addedToCart
                  ? 'bg-green-600 text-white'
                  : !selectedVariant || currentStock === 0
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-900 text-white hover:bg-stone-800 hover:scale-[1.02]'
              }`}
            >
              {addedToCart ? (
                <><Check size={20} /> Added to Cart!</>
              ) : (
                <><ShoppingBag size={20} /> Add to Cart</>
              )}
            </button>
            <button
              onClick={() => isInWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
              className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-colors ${
                isInWishlist
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'border-stone-300 text-stone-600 hover:border-stone-500'
              }`}
            >
              <Heart size={22} fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* SKU */}
          {selectedVariant && (
            <p className="text-xs text-stone-400 mb-6">SKU: {selectedVariant.sku}</p>
          )}

          {/* Features */}
          <div className="border-t border-stone-200 pt-6 space-y-4">
            <div className="flex items-center gap-3 text-sm text-stone-600">
              <Truck size={18} className="text-amber-600" />
              <span>Free delivery on orders over ৳1,500 (Inside Dhaka)</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-600">
              <RotateCcw size={18} className="text-amber-600" />
              <span>7-day easy return & exchange</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-600">
              <Shield size={18} className="text-amber-600" />
              <span>100% authentic product guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 lg:mt-24">
          <h2 className="text-2xl font-bold text-stone-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
