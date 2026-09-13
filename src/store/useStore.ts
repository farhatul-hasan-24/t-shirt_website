import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products, shippingZones, type Product, type ProductVariant } from '../data/products';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  division: string;
  district: string;
  area: string;
  postalCode: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: Customer;
  shippingMethod: { id: number; name: string; charge: number; estimatedDays: string };
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: string;
  paymentStatus: string;
  transactionId?: string;
  createdAt: string;
  trackingHistory: { status: string; date: string; note: string }[];
}

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  removeFromCart: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Wishlist
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;

  // Auth
  isAuthenticated: boolean;
  user: Customer | null;
  login: (email: string, password: string) => boolean;
  register: (customer: Customer, password: string) => boolean;
  logout: () => void;

  // Orders
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'paymentStatus' | 'trackingHistory'>) => Order;

  // Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedSizes: string[];
  setSelectedSizes: (sizes: string[]) => void;
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  inStockOnly: boolean;
  setInStockOnly: (value: boolean) => void;

  // Products
  getFilteredProducts: () => Product[];
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (product, variant, quantity) => {
        set((state) => {
          const existing = state.cart.find((item) => item.variant.id === variant.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.variant.id === variant.id
                  ? { ...item, quantity: Math.min(item.quantity + quantity, variant.stock) }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { product, variant, quantity }] };
        });
      },
      removeFromCart: (variantId) => {
        set((state) => ({ cart: state.cart.filter((item) => item.variant.id !== variantId) }));
      },
      updateQuantity: (variantId, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.variant.id === variantId ? { ...item, quantity: Math.max(1, Math.min(quantity, item.variant.stock)) } : item
          ),
        }));
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce((total, item) => {
          const price = item.variant.salePrice || item.variant.price;
          return total + price * item.quantity;
        }, 0);
      },
      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Wishlist
      wishlist: [],
      addToWishlist: (product) => {
        set((state) => {
          if (state.wishlist.find((item) => item.product.id === product.id)) return state;
          return { wishlist: [...state.wishlist, { product }] };
        });
      },
      removeFromWishlist: (productId) => {
        set((state) => ({ wishlist: state.wishlist.filter((item) => item.product.id !== productId) }));
      },
      isInWishlist: (productId) => {
        return !!get().wishlist.find((item) => item.product.id === productId);
      },

      // Auth
      isAuthenticated: false,
      user: null,
      login: (email, _password) => {
        const stored = localStorage.getItem('registered_users');
        const users: (Customer & { password: string })[] = stored ? JSON.parse(stored) : [];
        const user = users.find((u) => u.email === email);
        if (user) {
          set({ isAuthenticated: true, user: { ...user } });
          return true;
        }
        // Demo login
        if (email === 'demo@tshirthub.bd') {
          const demoUser: Customer = {
            id: 1,
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@tshirthub.bd',
            phone: '01712345678',
            address: 'House 12, Road 5, Dhanmondi',
            division: 'Dhaka',
            district: 'Dhaka',
            area: 'Dhanmondi',
            postalCode: '1205',
          };
          set({ isAuthenticated: true, user: demoUser });
          return true;
        }
        return false;
      },
      register: (customer, password) => {
        const stored = localStorage.getItem('registered_users');
        const users: (Customer & { password: string })[] = stored ? JSON.parse(stored) : [];
        if (users.find((u) => u.email === customer.email)) return false;
        users.push({ ...customer, password });
        localStorage.setItem('registered_users', JSON.stringify(users));
        set({ isAuthenticated: true, user: customer });
        return true;
      },
      logout: () => set({ isAuthenticated: false, user: null }),

      // Orders
      orders: [],
      placeOrder: (orderData) => {
        const orderId = 'THB-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const now = new Date().toISOString();
        
        let status = 'Pending';
        let paymentStatus = 'Pending';
        
        if (orderData.paymentMethod === 'cod') {
          status = 'Confirmed';
          paymentStatus = 'Pending';
        } else if (orderData.paymentMethod === 'bank_transfer') {
          status = 'Payment Pending';
          paymentStatus = 'Verification Pending';
        } else if (orderData.paymentMethod === 'online_card') {
          status = 'Payment Pending';
          paymentStatus = 'Processing';
        } else {
          // MFS payments
          status = 'Payment Pending';
          paymentStatus = 'Processing';
        }

        const trackingHistory = [{ status, date: now, note: 'Order placed successfully' }];

        const order: Order = {
          ...orderData,
          id: orderId,
          createdAt: now,
          status,
          paymentStatus,
          trackingHistory,
        };

        set((state) => ({ orders: [order, ...state.orders], cart: [] }));
        return order;
      },

      // Filters
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedCategory: null,
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      selectedSizes: [],
      setSelectedSizes: (sizes) => set({ selectedSizes: sizes }),
      selectedColors: [],
      setSelectedColors: (colors) => set({ selectedColors: colors }),
      priceRange: [0, 2000],
      setPriceRange: (range) => set({ priceRange: range }),
      inStockOnly: false,
      setInStockOnly: (value) => set({ inStockOnly: value }),

      getFilteredProducts: () => {
        const { searchQuery, selectedCategory, selectedSizes, selectedColors, priceRange, inStockOnly } = get();
        return products.filter((product) => {
          // Search
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchesSearch = product.name.toLowerCase().includes(q) ||
              product.description.toLowerCase().includes(q) ||
              product.tags.some((t) => t.toLowerCase().includes(q));
            if (!matchesSearch) return false;
          }
          // Category
          if (selectedCategory && product.category.slug !== selectedCategory) return false;
          // Size
          if (selectedSizes.length > 0) {
            const hasSize = product.variants.some((v) => selectedSizes.includes(v.size.name));
            if (!hasSize) return false;
          }
          // Color
          if (selectedColors.length > 0) {
            const hasColor = product.variants.some((v) => selectedColors.includes(v.color.name));
            if (!hasColor) return false;
          }
          // Price
          const prices = product.variants.map((v) => v.salePrice || v.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          if (maxPrice < priceRange[0] || minPrice > priceRange[1]) return false;
          // Stock
          if (inStockOnly) {
            const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
            if (totalStock === 0) return false;
          }
          return true;
        });
      },
    }),
    {
      name: 'tshirt-hub-store',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        orders: state.orders,
      }),
    }
  )
);
