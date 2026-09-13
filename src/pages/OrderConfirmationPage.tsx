import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Phone, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

export function OrderConfirmationPage() {
  const { orderId } = useParams();
  const orders = useStore((s) => s.orders);
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-stone-900 mb-4">Order Not Found</h1>
        <Link to="/" className="text-amber-600 font-medium">← Go to Homepage</Link>
      </div>
    );
  }

  const paymentMethodNames: Record<string, string> = {
    cod: 'Cash on Delivery',
    bkash: 'bKash',
    nagad: 'Nagad',
    rocket: 'Rocket',
    bank_transfer: 'Bank Transfer',
    online_card: 'Online Payment (Card)',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-3">Order Placed Successfully!</h1>
        <p className="text-stone-600">
          Thank you for your order. Your order ID is <span className="font-bold text-stone-900">{order.id}</span>
        </p>
      </div>

      {/* Order Status */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-stone-900">Order Status</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            order.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
            order.status === 'Payment Pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {order.status}
          </span>
        </div>

        {order.paymentMethod === 'cod' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-green-800">
              ✓ Your order has been confirmed! Our delivery partner will contact you soon.
              Please keep ৳{order.total.toLocaleString()} ready for cash on delivery.
            </p>
          </div>
        )}

        {order.paymentMethod === 'bank_transfer' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-yellow-800">
              ⏳ Your order is pending payment verification. We'll verify your bank transfer and confirm your order within 24 hours.
              {order.transactionId && (
                <span className="block mt-1">Reference ID: <strong>{order.transactionId}</strong></span>
              )}
            </p>
          </div>
        )}

        {(order.paymentMethod === 'bkash' || order.paymentMethod === 'nagad' || order.paymentMethod === 'rocket' || order.paymentMethod === 'online_card') && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-blue-800">
              📱 Payment processing. We'll notify you once your payment is confirmed.
            </p>
          </div>
        )}

        {/* Tracking Timeline */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-stone-700 mb-4">Order Timeline</h3>
          <div className="space-y-4">
            {order.trackingHistory.map((entry, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-amber-500' : 'bg-stone-300'}`} />
                  {idx < order.trackingHistory.length - 1 && <div className="w-0.5 h-8 bg-stone-200" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">{entry.status}</p>
                  <p className="text-xs text-stone-500">{new Date(entry.date).toLocaleString('en-BD')}</p>
                  <p className="text-xs text-stone-600 mt-0.5">{entry.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-stone-900 mb-4">Order Details</h2>

        {/* Items */}
        <div className="space-y-3 mb-6">
          {order.items.map((item) => {
            const price = item.variant.salePrice || item.variant.price;
            const img = item.product.images.find((i) => i.isPrimary) || item.product.images[0];
            return (
              <div key={item.variant.id} className="flex gap-3 py-3 border-b border-stone-100 last:border-0">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-900">{item.product.name}</p>
                  <p className="text-xs text-stone-500">{item.variant.size.name} / {item.variant.color.name} × {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">৳{(price * item.quantity).toLocaleString()}</p>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="space-y-2 text-sm border-t border-stone-200 pt-4">
          <div className="flex justify-between">
            <span className="text-stone-600">Subtotal</span>
            <span>৳{order.subtotal.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-৳{order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-stone-600">Shipping ({order.shippingMethod.name})</span>
            <span>{order.shippingFee === 0 ? 'FREE' : `৳${order.shippingFee}`}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-stone-200 pt-2">
            <span>Total</span>
            <span>৳{order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Delivery & Payment Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
          <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
            <Truck size={16} className="text-amber-600" /> Delivery Details
          </h3>
          <div className="text-sm text-stone-600 space-y-1">
            <p className="font-medium text-stone-900">{order.customer.firstName} {order.customer.lastName}</p>
            <p>{order.customer.address}</p>
            <p>{order.customer.area}, {order.customer.district}</p>
            <p>{order.customer.division} - {order.customer.postalCode}</p>
            <p className="mt-2">📞 {order.customer.phone}</p>
            <p className="mt-2 text-amber-600 font-medium">
              Estimated delivery: {order.shippingMethod.estimatedDays}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
          <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
            <Package size={16} className="text-amber-600" /> Payment Info
          </h3>
          <div className="text-sm text-stone-600 space-y-1">
            <p>Method: <span className="font-medium text-stone-900">{paymentMethodNames[order.paymentMethod]}</span></p>
            <p>Status: <span className={`font-medium ${
              order.paymentStatus === 'Paid' ? 'text-green-600' :
              order.paymentStatus === 'Verification Pending' ? 'text-yellow-600' :
              'text-blue-600'
            }`}>{order.paymentStatus}</span></p>
            {order.transactionId && (
              <p>Transaction ID: <span className="font-medium text-stone-900">{order.transactionId}</span></p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/account"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors"
        >
          <Clock size={18} /> Track Order
        </Link>
        <Link
          to="/products"
          className="flex items-center justify-center gap-2 px-6 py-3 border border-stone-300 text-stone-700 rounded-xl font-medium hover:bg-stone-50 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Support */}
      <div className="mt-10 text-center">
        <p className="text-sm text-stone-500">
          Need help? Contact us at <span className="font-medium text-stone-700">+880 1712-345678</span> or{' '}
          <span className="font-medium text-stone-700">hello@tshirthub.bd</span>
        </p>
      </div>
    </div>
  );
}
