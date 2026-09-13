// Simulated Django database models as TypeScript types and data
// In production, this data comes from PostgreSQL via Django REST API

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface Size {
  id: number;
  name: string;
  label: string;
}

export interface Color {
  id: number;
  name: string;
  hex: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: number;
  sku: string;
  size: Size;
  color: Color;
  stock: number;
  price: number;
  salePrice: number | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
}

export interface ShippingZone {
  id: number;
  name: string;
  charge: number;
  estimatedDays: string;
  freeShippingThreshold: number | null;
}

export interface BankInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  routingNumber: string;
  instructions: string;
}

export const categories: Category[] = [
  { id: 1, name: 'Oversized', slug: 'oversized', description: 'Premium oversized fit t-shirts' },
  { id: 2, name: 'Regular Fit', slug: 'regular-fit', description: 'Classic regular fit t-shirts' },
  { id: 3, name: 'Graphic', slug: 'graphic', description: 'T-shirts with unique graphic designs' },
  { id: 4, name: 'Minimal', slug: 'minimal', description: 'Clean and minimal design t-shirts' },
];

export const sizes: Size[] = [
  { id: 1, name: 'S', label: 'Small' },
  { id: 2, name: 'M', label: 'Medium' },
  { id: 3, name: 'L', label: 'Large' },
  { id: 4, name: 'XL', label: 'Extra Large' },
  { id: 5, name: 'XXL', label: 'Double Extra Large' },
];

export const colors: Color[] = [
  { id: 1, name: 'Black', hex: '#1a1a1a' },
  { id: 2, name: 'White', hex: '#f8f8f8' },
  { id: 3, name: 'Navy', hex: '#1e3a5f' },
  { id: 4, name: 'Beige', hex: '#d4b896' },
  { id: 5, name: 'Olive', hex: '#556b2f' },
  { id: 6, name: 'Charcoal', hex: '#36454f' },
];

export const shippingZones: ShippingZone[] = [
  { id: 1, name: 'Inside Dhaka', charge: 60, estimatedDays: '1-2 days', freeShippingThreshold: 1500 },
  { id: 2, name: 'Outside Dhaka', charge: 120, estimatedDays: '3-5 days', freeShippingThreshold: 2500 },
  { id: 3, name: 'Remote Areas', charge: 180, estimatedDays: '5-7 days', freeShippingThreshold: 3500 },
];

export const bankInfo: BankInfo = {
  bankName: 'DBBL (Dutch-Bangla Bank Limited)',
  accountName: 'TshirtHub Bangladesh Ltd.',
  accountNumber: '203.110.45678',
  branch: 'Gulshan Branch, Dhaka',
  routingNumber: '11027352',
  instructions: 'Please use your Order ID as the payment reference. After transfer, submit the transaction ID in the checkout form for verification.',
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Premium Black Oversized T-shirt',
    slug: 'premium-black-oversized',
    description: 'Crafted from 100% premium combed cotton, this oversized t-shirt delivers ultimate comfort with a modern streetwear silhouette. Features a relaxed drop-shoulder design, ribbed neckline, and a heavyweight 240 GSM fabric that drapes beautifully. Perfect for layering or wearing solo.',
    shortDescription: 'Heavyweight 240 GSM premium cotton oversized tee with drop shoulders.',
    category: categories[0],
    images: [
      { id: 1, url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop', alt: 'Premium Black Oversized T-shirt Front', isPrimary: true },
      { id: 2, url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop', alt: 'Premium Black Oversized T-shirt Back', isPrimary: false },
      { id: 3, url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop', alt: 'Premium Black Oversized T-shirt Detail', isPrimary: false },
    ],
    variants: [
      { id: 1, sku: 'PBO-BK-S', size: sizes[0], color: colors[0], stock: 15, price: 1200, salePrice: null },
      { id: 2, sku: 'PBO-BK-M', size: sizes[1], color: colors[0], stock: 22, price: 1200, salePrice: null },
      { id: 3, sku: 'PBO-BK-L', size: sizes[2], color: colors[0], stock: 18, price: 1200, salePrice: null },
      { id: 4, sku: 'PBO-BK-XL', size: sizes[3], color: colors[0], stock: 10, price: 1200, salePrice: null },
      { id: 5, sku: 'PBO-BK-XXL', size: sizes[4], color: colors[0], stock: 5, price: 1300, salePrice: null },
    ],
    tags: ['oversized', 'premium', 'streetwear', 'black'],
    isFeatured: true,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Minimal White Cotton T-shirt',
    slug: 'minimal-white-cotton',
    description: 'The essential white tee reimagined. Made from 100% organic Supima cotton with a silky-soft hand feel. Features a clean crew neck, pre-shrunk fabric, and a tailored regular fit that works with everything from jeans to chinos. A wardrobe staple elevated to perfection.',
    shortDescription: 'Organic Supima cotton essential white tee with a refined regular fit.',
    category: categories[3],
    images: [
      { id: 4, url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&sat=-100&bri=20', alt: 'Minimal White Cotton T-shirt Front', isPrimary: true },
      { id: 5, url: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800&h=1000&fit=crop', alt: 'Minimal White Cotton T-shirt Side', isPrimary: false },
      { id: 6, url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=1000&fit=crop', alt: 'Minimal White Cotton T-shirt Detail', isPrimary: false },
    ],
    variants: [
      { id: 6, sku: 'MWC-WH-S', size: sizes[0], color: colors[1], stock: 20, price: 950, salePrice: 799 },
      { id: 7, sku: 'MWC-WH-M', size: sizes[1], color: colors[1], stock: 30, price: 950, salePrice: 799 },
      { id: 8, sku: 'MWC-WH-L', size: sizes[2], color: colors[1], stock: 25, price: 950, salePrice: 799 },
      { id: 9, sku: 'MWC-WH-XL', size: sizes[3], color: colors[1], stock: 12, price: 950, salePrice: 799 },
      { id: 10, sku: 'MWC-WH-XXL', size: sizes[4], color: colors[1], stock: 8, price: 1050, salePrice: 899 },
    ],
    tags: ['minimal', 'essential', 'white', 'organic'],
    isFeatured: true,
    createdAt: '2024-01-20',
  },
  {
    id: 3,
    name: 'Bangladesh Graphic T-shirt',
    slug: 'bangladesh-graphic',
    description: 'Celebrate your roots with this exclusive Bangladesh-themed graphic tee. Features a hand-drawn illustration of the national flower (Water Lily) combined with modern typography. Printed with eco-friendly water-based inks on a premium 200 GSM cotton blend. Limited edition design.',
    shortDescription: 'Limited edition Bangladesh-themed graphic tee with eco-friendly print.',
    category: categories[2],
    images: [
      { id: 7, url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop', alt: 'Bangladesh Graphic T-shirt Front', isPrimary: true },
      { id: 8, url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop', alt: 'Bangladesh Graphic T-shirt Back', isPrimary: false },
      { id: 9, url: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&h=1000&fit=crop', alt: 'Bangladesh Graphic T-shirt Detail', isPrimary: false },
    ],
    variants: [
      { id: 11, sku: 'BDG-NV-S', size: sizes[0], color: colors[2], stock: 10, price: 1100, salePrice: null },
      { id: 12, sku: 'BDG-NV-M', size: sizes[1], color: colors[2], stock: 15, price: 1100, salePrice: null },
      { id: 13, sku: 'BDG-NV-L', size: sizes[2], color: colors[2], stock: 12, price: 1100, salePrice: null },
      { id: 14, sku: 'BDG-NV-XL', size: sizes[3], color: colors[2], stock: 8, price: 1100, salePrice: null },
      { id: 15, sku: 'BDG-BK-S', size: sizes[0], color: colors[0], stock: 12, price: 1100, salePrice: null },
      { id: 16, sku: 'BDG-BK-M', size: sizes[1], color: colors[0], stock: 18, price: 1100, salePrice: null },
      { id: 17, sku: 'BDG-BK-L', size: sizes[2], color: colors[0], stock: 14, price: 1100, salePrice: null },
    ],
    tags: ['graphic', 'bangladesh', 'limited-edition', 'eco-friendly'],
    isFeatured: true,
    createdAt: '2024-02-01',
  },
  {
    id: 4,
    name: 'Heavyweight Beige Oversized T-shirt',
    slug: 'heavyweight-beige-oversized',
    description: 'Luxurious heavyweight oversized tee in a warm beige tone. Made from 260 GSM brushed cotton fleece with a soft interior. Features a boxy fit, extended body length, and reinforced stitching. The perfect blend of comfort and contemporary style for the modern wardrobe.',
    shortDescription: '260 GSM brushed cotton fleece oversized tee in warm beige.',
    category: categories[0],
    images: [
      { id: 10, url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop', alt: 'Heavyweight Beige Oversized T-shirt Front', isPrimary: true },
      { id: 11, url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop', alt: 'Heavyweight Beige Oversized T-shirt Back', isPrimary: false },
      { id: 12, url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=1000&fit=crop', alt: 'Heavyweight Beige Oversized T-shirt Detail', isPrimary: false },
    ],
    variants: [
      { id: 18, sku: 'HBO-BG-S', size: sizes[0], color: colors[3], stock: 8, price: 1400, salePrice: 1199 },
      { id: 19, sku: 'HBO-BG-M', size: sizes[1], color: colors[3], stock: 14, price: 1400, salePrice: 1199 },
      { id: 20, sku: 'HBO-BG-L', size: sizes[2], color: colors[3], stock: 11, price: 1400, salePrice: 1199 },
      { id: 21, sku: 'HBO-BG-XL', size: sizes[3], color: colors[3], stock: 6, price: 1400, salePrice: 1199 },
      { id: 22, sku: 'HBO-BG-XXL', size: sizes[4], color: colors[3], stock: 3, price: 1500, salePrice: 1299 },
    ],
    tags: ['oversized', 'heavyweight', 'beige', 'premium'],
    isFeatured: true,
    createdAt: '2024-02-10',
  },
  {
    id: 5,
    name: 'Classic Navy Regular-Fit T-shirt',
    slug: 'classic-navy-regular',
    description: 'Timeless navy t-shirt with a perfect regular fit. Constructed from ring-spun cotton for exceptional softness and durability. Features a classic crew neck, double-needle stitching, and a slightly longer body for a flattering silhouette. Ideal for everyday wear.',
    shortDescription: 'Ring-spun cotton regular-fit tee in classic navy blue.',
    category: categories[1],
    images: [
      { id: 13, url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop', alt: 'Classic Navy Regular-Fit T-shirt Front', isPrimary: true },
      { id: 14, url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop', alt: 'Classic Navy Regular-Fit T-shirt Side', isPrimary: false },
      { id: 15, url: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800&h=1000&fit=crop', alt: 'Classic Navy Regular-Fit T-shirt Detail', isPrimary: false },
    ],
    variants: [
      { id: 23, sku: 'CNR-NV-S', size: sizes[0], color: colors[2], stock: 25, price: 850, salePrice: null },
      { id: 24, sku: 'CNR-NV-M', size: sizes[1], color: colors[2], stock: 35, price: 850, salePrice: null },
      { id: 25, sku: 'CNR-NV-L', size: sizes[2], color: colors[2], stock: 28, price: 850, salePrice: null },
      { id: 26, sku: 'CNR-NV-XL', size: sizes[3], color: colors[2], stock: 15, price: 850, salePrice: null },
      { id: 27, sku: 'CNR-NV-XXL', size: sizes[4], color: colors[2], stock: 10, price: 950, salePrice: null },
    ],
    tags: ['classic', 'regular-fit', 'navy', 'everyday'],
    isFeatured: false,
    createdAt: '2024-02-15',
  },
  {
    id: 6,
    name: 'Premium Unisex Graphic T-shirt',
    slug: 'premium-unisex-graphic',
    description: 'A bold statement piece featuring abstract geometric artwork printed on premium 220 GSM cotton. This unisex design combines contemporary art with streetwear culture. Features a relaxed fit, dropped shoulders, and a printed neck label for tagless comfort. Each piece is uniquely numbered.',
    shortDescription: 'Abstract geometric art on 220 GSM premium cotton. Unisex relaxed fit.',
    category: categories[2],
    images: [
      { id: 16, url: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&h=1000&fit=crop', alt: 'Premium Unisex Graphic T-shirt Front', isPrimary: true },
      { id: 17, url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop', alt: 'Premium Unisex Graphic T-shirt Back', isPrimary: false },
      { id: 18, url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop', alt: 'Premium Unisex Graphic T-shirt Detail', isPrimary: false },
    ],
    variants: [
      { id: 28, sku: 'PUG-BK-S', size: sizes[0], color: colors[0], stock: 8, price: 1350, salePrice: null },
      { id: 29, sku: 'PUG-BK-M', size: sizes[1], color: colors[0], stock: 12, price: 1350, salePrice: null },
      { id: 30, sku: 'PUG-BK-L', size: sizes[2], color: colors[0], stock: 10, price: 1350, salePrice: null },
      { id: 31, sku: 'PUG-CH-S', size: sizes[0], color: colors[5], stock: 6, price: 1350, salePrice: null },
      { id: 32, sku: 'PUG-CH-M', size: sizes[1], color: colors[5], stock: 9, price: 1350, salePrice: null },
      { id: 33, sku: 'PUG-CH-L', size: sizes[2], color: colors[5], stock: 7, price: 1350, salePrice: null },
      { id: 34, sku: 'PUG-CH-XL', size: sizes[3], color: colors[5], stock: 4, price: 1350, salePrice: null },
    ],
    tags: ['graphic', 'unisex', 'premium', 'art', 'streetwear'],
    isFeatured: true,
    createdAt: '2024-03-01',
  },
];

// Divisions and Districts of Bangladesh
export const divisions = [
  { name: 'Dhaka', districts: ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Kishoreganj', 'Manikganj', 'Munshiganj', 'Rajbari', 'Faridpur', 'Gopalganj', 'Madaripur', 'Shariatpur'] },
  { name: 'Chittagong', districts: ['Chittagong', 'Cox\'s Bazar', 'Rangamati', 'Bandarban', 'Khagrachhari', 'Feni', 'Noakhali', 'Lakshmipur', 'Comilla', 'Chandpur', 'Brahmanbaria'] },
  { name: 'Rajshahi', districts: ['Rajshahi', 'Bogra', 'Joypurhat', 'Naogaon', 'Natore', 'Chapainawabganj', 'Pabna', 'Sirajganj'] },
  { name: 'Khulna', districts: ['Khulna', 'Bagerhat', 'Satkhira', 'Jessore', 'Jhenaidah', 'Magura', 'Narail', 'Kushtia', 'Chuadanga', 'Meherpur'] },
  { name: 'Sylhet', districts: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'] },
  { name: 'Rangpur', districts: ['Rangpur', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Thakurgaon'] },
  { name: 'Barishal', districts: ['Barishal', 'Barguna', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'] },
  { name: 'Mymensingh', districts: ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'] },
];

// Payment methods
export const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery', description: 'Pay when you receive your order', icon: 'truck' },
  { id: 'bkash', name: 'bKash', description: 'Pay with bKash mobile banking', icon: 'phone' },
  { id: 'nagad', name: 'Nagad', description: 'Pay with Nagad mobile banking', icon: 'phone' },
  { id: 'rocket', name: 'Rocket', description: 'Pay with Rocket mobile banking', icon: 'phone' },
  { id: 'bank_transfer', name: 'Bank Transfer', description: 'Direct bank transfer', icon: 'building' },
  { id: 'online_card', name: 'Online Payment (Card)', description: 'Pay with Visa/Mastercard via SSLCommerz', icon: 'credit-card' },
];

export const orderStatuses = [
  'Pending',
  'Payment Pending',
  'Payment Verified',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Returned',
  'Refunded',
];

export const paymentStatuses = [
  'Pending',
  'Processing',
  'Paid',
  'Failed',
  'Cancelled',
  'Refunded',
  'Verification Pending',
];
