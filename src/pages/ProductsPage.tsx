import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Grid3X3, LayoutGrid } from 'lucide-react';
import { useStore } from '../store/useStore';
import { categories, sizes, colors } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState(3);

  const {
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    selectedSizes, setSelectedSizes,
    selectedColors, setSelectedColors,
    priceRange, setPriceRange,
    inStockOnly, setInStockOnly,
    getFilteredProducts,
  } = useStore();

  useEffect(() => {
    const cat = searchParams.get('category');
    const search = searchParams.get('search');
    if (cat) setSelectedCategory(cat);
    if (search) setSearchQuery(search);
  }, [searchParams, setSelectedCategory, setSearchQuery]);

  const filteredProducts = getFilteredProducts();
  const activeFilterCount = [
    selectedCategory,
    selectedSizes.length > 0,
    selectedColors.length > 0,
    priceRange[0] > 0 || priceRange[1] < 2000,
    inStockOnly,
    searchQuery,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 2000]);
    setInStockOnly(false);
    setSearchQuery('');
  };

  const toggleSize = (sizeName: string) => {
    setSelectedSizes(
      selectedSizes.includes(sizeName)
        ? selectedSizes.filter((s) => s !== sizeName)
        : [...selectedSizes, sizeName]
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors(
      selectedColors.includes(colorName)
        ? selectedColors.filter((c) => c !== colorName)
        : [...selectedColors, colorName]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">
          {selectedCategory
            ? categories.find((c) => c.slug === selectedCategory)?.name || 'Products'
            : searchQuery
            ? `Search: "${searchQuery}"`
            : 'All Products'}
        </h1>
        <p className="text-stone-500 mt-1">{filteredProducts.length} products found</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-28 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-900">Filters</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="text-xs text-amber-600 hover:text-amber-700">
                  Clear all ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-medium text-stone-700 mb-3">Category</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block text-sm ${!selectedCategory ? 'text-amber-600 font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug === selectedCategory ? null : cat.slug)}
                    className={`block text-sm ${selectedCategory === cat.slug ? 'text-amber-600 font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h4 className="text-sm font-medium text-stone-700 mb-3">Size</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => toggleSize(size.name)}
                    className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSizes.includes(size.name)
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'border-stone-300 text-stone-700 hover:border-stone-500'
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h4 className="text-sm font-medium text-stone-700 mb-3">Color</h4>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => toggleColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColors.includes(color.name) ? 'border-amber-500 scale-110' : 'border-stone-200'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-medium text-stone-700 mb-3">Price Range</h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-amber-600"
                />
                <div className="flex justify-between text-xs text-stone-500">
                  <span>৳{priceRange[0].toLocaleString()}</span>
                  <span>৳{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm text-stone-700">In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg text-sm font-medium text-stone-700"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setGridCols(2)}
                className={`p-2 rounded ${gridCols === 2 ? 'bg-stone-200' : 'hover:bg-stone-100'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setGridCols(3)}
                className={`p-2 rounded ${gridCols === 3 ? 'bg-stone-200' : 'hover:bg-stone-100'}`}
              >
                <Grid3X3 size={18} />
              </button>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="text-sm font-medium text-stone-700 mb-3">Category</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`block text-sm ${!selectedCategory ? 'text-amber-600 font-semibold' : 'text-stone-600'}`}
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.slug === selectedCategory ? null : cat.slug)}
                          className={`block text-sm ${selectedCategory === cat.slug ? 'text-amber-600 font-semibold' : 'text-stone-600'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Sizes */}
                  <div>
                    <h4 className="text-sm font-medium text-stone-700 mb-3">Size</h4>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => toggleSize(size.name)}
                          className={`w-10 h-10 rounded-lg border text-sm font-medium ${
                            selectedSizes.includes(size.name)
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'border-stone-300 text-stone-700'
                          }`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Colors */}
                  <div>
                    <h4 className="text-sm font-medium text-stone-700 mb-3">Color</h4>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => toggleColor(color.name)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            selectedColors.includes(color.name) ? 'border-amber-500 scale-110' : 'border-stone-200'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Price */}
                  <div>
                    <h4 className="text-sm font-medium text-stone-700 mb-3">Max Price</h4>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-amber-600"
                    />
                    <p className="text-xs text-stone-500 mt-1">Up to ৳{priceRange[1].toLocaleString()}</p>
                  </div>
                  {/* Stock */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-stone-700">In Stock Only</span>
                  </label>
                  <button
                    onClick={() => { clearAllFilters(); setShowFilters(false); }}
                    className="w-full py-3 bg-stone-900 text-white rounded-lg font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                  {categories.find((c) => c.slug === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory(null)}><X size={12} /></button>
                </span>
              )}
              {selectedSizes.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 bg-stone-200 text-stone-700 px-3 py-1 rounded-full text-xs font-medium">
                  {s}
                  <button onClick={() => toggleSize(s)}><X size={12} /></button>
                </span>
              ))}
              {selectedColors.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 bg-stone-200 text-stone-700 px-3 py-1 rounded-full text-xs font-medium">
                  {c}
                  <button onClick={() => toggleColor(c)}><X size={12} /></button>
                </span>
              ))}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}><X size={12} /></button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-stone-500 mb-4">No products found</p>
              <button
                onClick={clearAllFilters}
                className="text-amber-600 font-medium hover:text-amber-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
