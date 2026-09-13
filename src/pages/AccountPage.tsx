import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, LogOut, Heart, MapPin, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useStore, type Customer } from '../store/useStore';

export function AccountPage() {
  const { isAuthenticated, user, login, register, logout, orders } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regForm, setRegForm] = useState<Customer>({
    id: 0, firstName: '', lastName: '', email: '', phone: '',
    address: '', division: '', district: '', area: '', postalCode: '',
  });
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={28} className="text-stone-600" />
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              {isLogin ? 'Sign in to your account' : 'Join TshirtHub Bangladesh'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              if (login(email, password)) {
                setError('');
              } else {
                setError('Invalid email or password. Try demo@tshirthub.bd');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors"
              >
                Sign In
              </button>
              <p className="text-xs text-center text-stone-500 mt-3">
                Demo: demo@tshirthub.bd / any password
              </p>
            </form>
          ) : (
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!regForm.firstName || !regForm.email || !regForm.phone || !password) {
                setError('Please fill all required fields');
                return;
              }
              if (register(regForm, password)) {
                setError('');
              } else {
                setError('Email already registered');
              }
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={regForm.firstName}
                    onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={regForm.lastName}
                    onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors"
              >
                Create Account
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm text-amber-600 font-medium hover:text-amber-700"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle size={16} className="text-green-600" />;
      case 'Shipped': case 'Out for Delivery': return <Truck size={16} className="text-blue-600" />;
      case 'Cancelled': case 'Returned': return <XCircle size={16} className="text-red-600" />;
      default: return <Clock size={16} className="text-amber-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Confirmed': case 'Processing': case 'Packed': return 'bg-blue-100 text-blue-700';
      case 'Shipped': case 'Out for Delivery': return 'bg-indigo-100 text-indigo-700';
      case 'Cancelled': case 'Returned': case 'Refunded': return 'bg-red-100 text-red-700';
      case 'Payment Pending': case 'Payment Verified': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-stone-100 text-stone-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">My Account</h1>
          <p className="text-stone-500 mt-1">Welcome back, {user?.firstName}!</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-8 max-w-md">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'profile' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
          }`}
        >
          <User size={16} /> Profile
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'orders' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
          }`}
        >
          <Package size={16} /> Orders ({orders.length})
        </button>
      </div>

      {activeTab === 'profile' && user && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900 mb-4">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider">Full Name</p>
                <p className="text-sm font-medium text-stone-900">{user.firstName} {user.lastName}</p>
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider">Email</p>
                <p className="text-sm font-medium text-stone-900">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider">Phone</p>
                <p className="text-sm font-medium text-stone-900">{user.phone}</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-amber-600" /> Shipping Address
            </h2>
            {user.address ? (
              <div className="text-sm text-stone-600 space-y-1">
                <p className="font-medium text-stone-900">{user.address}</p>
                <p>{user.area}</p>
                <p>{user.district}, {user.division}</p>
                <p>Postal Code: {user.postalCode || 'N/A'}</p>
              </div>
            ) : (
              <p className="text-sm text-stone-500">No address saved yet.</p>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-bold text-stone-900 mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/wishlist"
                className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
              >
                <Heart size={20} className="text-red-500" />
                <div>
                  <p className="text-sm font-medium text-stone-900">Wishlist</p>
                  <p className="text-xs text-stone-500">View saved items</p>
                </div>
                <ChevronRight size={16} className="text-stone-400 ml-auto" />
              </Link>
              <Link
                to="/products"
                className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
              >
                <Package size={20} className="text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-stone-900">Shop</p>
                  <p className="text-xs text-stone-500">Browse products</p>
                </div>
                <ChevronRight size={16} className="text-stone-400 ml-auto" />
              </Link>
              <button
                onClick={() => setActiveTab('orders')}
                className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors text-left"
              >
                <Clock size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-stone-900">Orders</p>
                  <p className="text-xs text-stone-500">{orders.length} orders</p>
                </div>
                <ChevronRight size={16} className="text-stone-400 ml-auto" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-stone-200 shadow-sm text-center">
              <Package size={48} className="mx-auto text-stone-300 mb-4" />
              <h2 className="text-xl font-bold text-stone-900 mb-2">No Orders Yet</h2>
              <p className="text-stone-500 mb-6">Start shopping to see your orders here.</p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-stone-800"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-stone-500">Order ID</p>
                      <p className="font-bold text-stone-900">{order.id}</p>
                      <p className="text-xs text-stone-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-BD', {
                          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <p className="text-lg font-bold text-stone-900 mt-2">৳{order.total.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex gap-2 mb-4">
                    {order.items.slice(0, 4).map((item) => {
                      const img = item.product.images.find((i) => i.isPrimary) || item.product.images[0];
                      return (
                        <div key={item.variant.id} className="w-12 h-12 rounded-lg overflow-hidden border border-stone-200">
                          <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                        </div>
                      );
                    })}
                    {order.items.length > 4 && (
                      <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center text-xs font-medium text-stone-600">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                    <span>•</span>
                    <span>{order.shippingMethod.name}</span>
                    <span>•</span>
                    <span>Est. {order.shippingMethod.estimatedDays}</span>
                  </div>

                  <Link
                    to={`/order-confirmation/${order.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
                  >
                    View Details <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
