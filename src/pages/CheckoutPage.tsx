import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Phone, Building, Truck, Check, AlertCircle, Upload } from 'lucide-react';
import { useStore, type Customer } from '../store/useStore';
import { shippingZones, bankInfo, paymentMethods, divisions } from '../data/products';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, placeOrder, user, isAuthenticated } = useStore();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [selectedShipping, setSelectedShipping] = useState(shippingZones[0]);
  const [processing, setProcessing] = useState(false);
  const [mfsNumber, setMfsNumber] = useState('');
  const [mfsTransactionId, setMfsTransactionId] = useState('');
  const [bankTransactionId, setBankTransactionId] = useState('');
  const [bankAmount, setBankAmount] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<Customer>({
    id: 0,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    division: user?.division || '',
    district: user?.district || '',
    area: user?.area || '',
    postalCode: user?.postalCode || '',
  });

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-stone-900 mb-4">Your cart is empty</h1>
        <Link to="/products" className="text-amber-600 font-medium">← Continue Shopping</Link>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shippingFee = subtotal >= (selectedShipping.freeShippingThreshold || Infinity) ? 0 : selectedShipping.charge;
  const total = subtotal - discount + shippingFee;

  const selectedDivision = divisions.find((d) => d.name === form.division);

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'FIRST200') {
      setDiscount(200);
      setCouponApplied(true);
      setError('');
    } else {
      setError('Invalid coupon code');
      setDiscount(0);
      setCouponApplied(false);
    }
  };

  const validateForm = (): boolean => {
    if (!form.firstName.trim() || !form.lastName.trim()) { setError('Please enter your full name'); return false; }
    if (!form.email.trim() || !form.email.includes('@')) { setError('Please enter a valid email'); return false; }
    if (!form.phone.trim() || form.phone.length < 11) { setError('Please enter a valid Bangladesh mobile number'); return false; }
    if (!form.address.trim()) { setError('Please enter your address'); return false; }
    if (!form.division) { setError('Please select your division'); return false; }
    if (!form.district) { setError('Please select your district'); return false; }
    setError('');
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const order = placeOrder({
      items: cart,
      customer: form,
      shippingMethod: {
        id: selectedShipping.id,
        name: selectedShipping.name,
        charge: shippingFee,
        estimatedDays: selectedShipping.estimatedDays,
      },
      paymentMethod,
      subtotal,
      discount,
      shippingFee,
      total,
      transactionId: paymentMethod === 'bank_transfer' ? bankTransactionId : mfsTransactionId || undefined,
    });

    setProcessing(false);
    navigate(`/order-confirmation/${order.id}`);
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'cod': return <Truck size={20} />;
      case 'bkash': case 'nagad': case 'rocket': return <Phone size={20} />;
      case 'bank_transfer': return <Building size={20} />;
      case 'online_card': return <CreditCard size={20} />;
      default: return <CreditCard size={20} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-10">
        {[
          { num: 1, label: 'Information' },
          { num: 2, label: 'Shipping' },
          { num: 3, label: 'Payment' },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
              step >= s.num ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-500'
            }`}>
              {step > s.num ? <Check size={18} /> : s.num}
            </div>
            <span className={`ml-2 text-sm font-medium ${step >= s.num ? 'text-stone-900' : 'text-stone-500'}`}>
              {s.label}
            </span>
            {idx < 2 && <div className={`w-12 sm:w-20 h-0.5 mx-3 ${step > s.num ? 'bg-stone-900' : 'bg-stone-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* Step 1: Customer Information */}
          {step === 1 && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
              <h2 className="text-xl font-bold text-stone-900 mb-6">Customer Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Address *</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    placeholder="House, Road, Area"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Division *</label>
                  <select
                    value={form.division}
                    onChange={(e) => setForm({ ...form, division: e.target.value, district: '' })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                  >
                    <option value="">Select Division</option>
                    {divisions.map((d) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">District *</label>
                  <select
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    disabled={!form.division}
                  >
                    <option value="">Select District</option>
                    {selectedDivision?.districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Area/Upazila</label>
                  <input
                    type="text"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    placeholder="Area or Upazila"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    placeholder="Postal code"
                  />
                </div>
              </div>
              <button
                onClick={() => { if (validateForm()) setStep(2); }}
                className="mt-6 w-full sm:w-auto px-8 py-4 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors"
              >
                Continue to Shipping
              </button>
            </div>
          )}

          {/* Step 2: Shipping */}
          {step === 2 && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
              <h2 className="text-xl font-bold text-stone-900 mb-6">Shipping Method</h2>
              <div className="space-y-3">
                {shippingZones.map((zone) => (
                  <label
                    key={zone.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedShipping.id === zone.id
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={selectedShipping.id === zone.id}
                        onChange={() => setSelectedShipping(zone)}
                        className="w-4 h-4 text-stone-900"
                      />
                      <div>
                        <p className="font-medium text-stone-900">{zone.name}</p>
                        <p className="text-sm text-stone-500">Estimated: {zone.estimatedDays}</p>
                        {zone.freeShippingThreshold && (
                          <p className="text-xs text-green-600 mt-0.5">
                            Free on orders over ৳{zone.freeShippingThreshold.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-semibold text-stone-900">
                      {subtotal >= (zone.freeShippingThreshold || Infinity) ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `৳${zone.charge}`
                      )}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 border border-stone-300 rounded-xl font-medium text-stone-700 hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 sm:flex-none px-8 py-4 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                <h2 className="text-xl font-bold text-stone-900 mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-stone-900 bg-stone-50'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="w-4 h-4 text-stone-900"
                      />
                      <div className="text-amber-600">{getPaymentIcon(method.id)}</div>
                      <div>
                        <p className="font-medium text-stone-900">{method.name}</p>
                        <p className="text-sm text-stone-500">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* MFS Payment Details */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && (
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                  <h3 className="font-semibold text-stone-900 mb-4">
                    {paymentMethod === 'bkash' ? 'bKash' : paymentMethod === 'nagad' ? 'Nagad' : 'Rocket'} Payment
                  </h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                    <p className="text-sm text-amber-800 font-medium mb-2">Payment Instructions:</p>
                    <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                      <li>Open your {paymentMethod === 'bkash' ? 'bKash' : paymentMethod === 'nagad' ? 'Nagad' : 'Rocket'} app</li>
                      <li>Select "Send Money" or "Payment"</li>
                      <li>Enter merchant number: <strong>01712-XXXXXX</strong></li>
                      <li>Enter amount: <strong>৳{total.toLocaleString()}</strong></li>
                      <li>Enter your reference/order ID in the reference field</li>
                      <li>Confirm with your PIN</li>
                    </ol>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Your {paymentMethod} Number</label>
                      <input
                        type="tel"
                        value={mfsNumber}
                        onChange={(e) => setMfsNumber(e.target.value)}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Transaction ID</label>
                      <input
                        type="text"
                        value={mfsTransactionId}
                        onChange={(e) => setMfsTransactionId(e.target.value)}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                        placeholder="e.g., TxnID123456"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 mt-3">
                    ⚠️ Never share your PIN, OTP, or password. We will never ask for these.
                  </p>
                </div>
              )}

              {/* Bank Transfer Details */}
              {paymentMethod === 'bank_transfer' && (
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                  <h3 className="font-semibold text-stone-900 mb-4">Bank Transfer Details</h3>
                  <div className="bg-stone-50 rounded-xl p-4 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-600">Bank Name:</span>
                      <span className="font-medium text-stone-900">{bankInfo.bankName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-600">Account Name:</span>
                      <span className="font-medium text-stone-900">{bankInfo.accountName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-600">Account Number:</span>
                      <span className="font-medium text-stone-900">{bankInfo.accountNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-600">Branch:</span>
                      <span className="font-medium text-stone-900">{bankInfo.branch}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-600">Routing Number:</span>
                      <span className="font-medium text-stone-900">{bankInfo.routingNumber}</span>
                    </div>
                  </div>
                  <p className="text-sm text-stone-600 mb-4">{bankInfo.instructions}</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Transaction/Reference ID *</label>
                      <input
                        type="text"
                        value={bankTransactionId}
                        onChange={(e) => setBankTransactionId(e.target.value)}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                        placeholder="Enter your bank transfer reference"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Transfer Amount *</label>
                      <input
                        type="number"
                        value={bankAmount}
                        onChange={(e) => setBankAmount(e.target.value)}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                        placeholder={`৳${total.toLocaleString()}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Payment Proof (Optional)</label>
                      <div className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center hover:border-stone-400 transition-colors cursor-pointer">
                        <Upload size={24} className="mx-auto text-stone-400 mb-2" />
                        <p className="text-sm text-stone-500">Click to upload screenshot of transfer</p>
                        <p className="text-xs text-stone-400 mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-800">
                      ⏳ Your order will be in "Payment Verification Pending" status until we verify your transfer.
                    </p>
                  </div>
                </div>
              )}

              {/* Online Card Payment */}
              {paymentMethod === 'online_card' && (
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                  <h3 className="font-semibold text-stone-900 mb-4">Online Payment (SSLCommerz)</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <p className="text-sm text-blue-800">
                      You will be redirected to SSLCommerz secure payment gateway to complete your payment.
                      We accept Visa, Mastercard, American Express, and all major debit/credit cards.
                    </p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className="text-xs bg-stone-100 px-3 py-1 rounded-full">Visa</span>
                    <span className="text-xs bg-stone-100 px-3 py-1 rounded-full">Mastercard</span>
                    <span className="text-xs bg-stone-100 px-3 py-1 rounded-full">Amex</span>
                    <span className="text-xs bg-stone-100 px-3 py-1 rounded-full">Nexus</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-3">
                    🔒 Your card details are processed securely by SSLCommerz. We never store card information.
                  </p>
                </div>
              )}

              {/* COD Info */}
              {paymentMethod === 'cod' && (
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                  <h3 className="font-semibold text-stone-900 mb-4">Cash on Delivery</h3>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-800">
                      ✓ Pay with cash when you receive your order. Please keep exact change ready for the delivery person.
                    </p>
                  </div>
                </div>
              )}

              {/* Coupon */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                <h3 className="font-semibold text-stone-900 mb-4">Coupon Code</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    placeholder="Enter coupon code"
                    disabled={couponApplied}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponApplied || !couponCode}
                    className="px-6 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 disabled:opacity-50"
                  >
                    {couponApplied ? 'Applied ✓' : 'Apply'}
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-sm text-green-600 mt-2">Coupon applied! ৳200 discount.</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-4 border border-stone-300 rounded-xl font-medium text-stone-700 hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="flex-1 sm:flex-none px-8 py-4 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Place Order — ৳${total.toLocaleString()}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm sticky top-28">
            <h2 className="text-lg font-bold text-stone-900 mb-4">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cart.map((item) => {
                const price = item.variant.salePrice || item.variant.price;
                const img = item.product.images.find((i) => i.isPrimary) || item.product.images[0];
                return (
                  <div key={item.variant.id} className="flex gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-stone-500">{item.variant.size.name} / {item.variant.color.name} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-stone-900 shrink-0">৳{(price * item.quantity).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="border-t border-stone-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-৳{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-stone-600">Shipping ({selectedShipping.name})</span>
                <span>{shippingFee === 0 ? <span className="text-green-600">FREE</span> : `৳${shippingFee}`}</span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between">
                <span className="font-semibold text-stone-900">Total</span>
                <span className="font-bold text-lg text-stone-900">৳{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment method indicator */}
            {step === 3 && (
              <div className="mt-4 p-3 bg-stone-50 rounded-xl">
                <p className="text-xs text-stone-500">Payment Method:</p>
                <p className="text-sm font-medium text-stone-900">
                  {paymentMethods.find((m) => m.id === paymentMethod)?.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
