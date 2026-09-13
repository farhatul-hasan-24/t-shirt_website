# TshirtHub Bangladesh — Premium T-Shirt E-Commerce Platform

A modern, full-stack e-commerce web application for the Bangladesh market featuring premium fashion-store design, Bangladesh-specific payment methods, and comprehensive order management.

![TshirtHub Bangladesh](https://img.shields.io/badge/Built%20for-Bangladesh-red?style=flat-square)
![React](https://img.shields.io/badge/Frontend-React%2018-blue?style=flat-square)
![Django](https://img.shields.io/badge/Backend-Django%204.2-green?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?style=flat-square)

## 🌟 Features

### Frontend Application (React/TypeScript)
- **Premium Fashion Store Design** — Modern, warm, refined aesthetic
- **Fully Responsive** — Desktop, tablet, and mobile optimized
- **Product Browsing** — Category, size, color, price, and stock filtering
- **Product Search** — Full-text search across products
- **Product Detail Pages** — Image gallery, variant selection, stock display
- **Shopping Cart** — Add, remove, update quantities with persistence
- **Wishlist/Favorites** — Save products for later
- **Multi-step Checkout** — Professional 3-step checkout flow
- **Order Tracking** — Real-time order status timeline
- **Customer Accounts** — Registration, login, profile, order history
- **BDT Currency** — All prices in ৳ (Taka)

### Bangladesh Payment Methods
1. **Cash on Delivery (COD)** — Pay when you receive your order
2. **bKash** — Mobile banking payment with transaction verification
3. **Nagad** — Mobile banking payment support
4. **Rocket** — Mobile banking payment support
5. **Bank Transfer** — Direct bank transfer with admin verification
6. **Online Card Payment** — Visa/Mastercard via SSLCommerz gateway

### Bangladesh Shipping
- Inside Dhaka (৳60, 1-2 days)
- Outside Dhaka (৳120, 3-5 days)
- Remote Areas (৳180, 5-7 days)
- Free shipping thresholds per zone

### Backend Architecture (Django)
- **Database-driven** — All data managed through PostgreSQL
- **Payment abstraction layer** — Configurable payment providers
- **Server-side verification** — Payment validation never trusts frontend
- **Admin dashboard** — Comprehensive management interface
- **Security-first** — CSRF, auth, encryption, no sensitive data storage

## 🚀 Quick Start

### Frontend (React Application)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend (Django Application)

See [DJANGO_BACKEND.md](./DJANGO_BACKEND.md) for complete Django setup instructions.

```bash
# Quick setup
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## 📁 Project Structure

```
├── src/
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   ├── components/
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Footer.tsx       # Site footer
│   │   └── ProductCard.tsx  # Product card component
│   ├── pages/
│   │   ├── HomePage.tsx           # Landing page
│   │   ├── ProductsPage.tsx       # Product listing with filters
│   │   ├── ProductDetailPage.tsx  # Product detail with gallery
│   │   ├── CartPage.tsx           # Shopping cart
│   │   ├── CheckoutPage.tsx       # Multi-step checkout
│   │   ├── OrderConfirmationPage.tsx # Order confirmation
│   │   ├── AccountPage.tsx        # User account & orders
│   │   └── WishlistPage.tsx       # Saved items
│   ├── store/
│   │   └── useStore.ts      # Zustand state management
│   └── data/
│       └── products.ts      # Product data & types
├── DJANGO_BACKEND.md        # Django backend architecture
├── .env.example             # Environment variables template
└── README.md                # This file
```

## 🛒 Sample Products

The application includes 6 realistic T-shirt products:

1. **Premium Black Oversized T-shirt** — ৳1,200
2. **Minimal White Cotton T-shirt** — ৳950 (Sale: ৳799)
3. **Bangladesh Graphic T-shirt** — ৳1,100
4. **Heavyweight Beige Oversized T-shirt** — ৳1,400 (Sale: ৳1,199)
5. **Classic Navy Regular-Fit T-shirt** — ৳850
6. **Premium Unisex Graphic T-shirt** — ৳1,350

## 💳 Payment Methods

### Cash on Delivery
- Order confirmed immediately
- Payment collected at delivery
- Admin can update order status

### Mobile Banking (bKash/Nagad/Rocket)
- Customer enters provider number and transaction ID
- Payment verified server-side via official API
- Order status updated after verification

### Bank Transfer
- Bank details displayed at checkout
- Customer submits transaction reference
- Payment proof upload supported
- Admin verifies before order confirmation
- Status: "Payment Verification Pending"

### Online Card Payment (SSLCommerz)
- Redirected to secure payment gateway
- Success/failure/cancel callbacks
- Server-side transaction validation
- No card data stored locally

## 🔒 Security Features

- CSRF protection on all forms
- Server-side payment verification
- No storage of PINs, OTPs, or card numbers
- Payment callbacks verified with provider APIs
- Database transactions for order/payment operations
- Environment variables for all secrets
- Duplicate order/payment protection

## 🇧🇩 Bangladesh-Specific Features

- All prices in BDT (৳ Taka)
- Bangladesh divisions and districts in checkout
- Mobile number validation (01XXXXXXXXX format)
- Local payment methods (bKash, Nagad, Rocket)
- Bangladesh shipping zones and charges
- Local bank transfer details (DBBL)
- Bengali currency formatting

## 🎨 Design

- **Typography**: Modern, clean sans-serif
- **Colors**: Warm stone/amber palette
- **Cards**: Rounded corners, subtle shadows
- **Animations**: Smooth transitions, hover effects
- **Mobile-first**: Responsive from 320px to 4K
- **Accessibility**: Focus states, semantic HTML

## 📋 Demo Credentials

- **Email**: demo@tshirthub.bd
- **Password**: any password
- **Coupon Code**: FIRST200 (৳200 off)

## 📄 Documentation

- [Django Backend Architecture](./DJANGO_BACKEND.md) — Complete backend reference
- [Environment Variables](./.env.example) — Configuration template

## 🏗️ Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Zustand for state management
- Tailwind CSS 4 for styling
- Lucide React for icons
- Framer Motion for animations

### Backend (Reference)
- Django 4.2+
- PostgreSQL
- Django REST Framework
- Celery (async tasks)
- Redis (caching)

## 📝 License

This project is built for educational and demonstration purposes.

---

**Built with ❤️ for Bangladesh**
