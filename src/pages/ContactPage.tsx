import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-400 text-sm font-medium tracking-widest uppercase">Get in Touch</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">Contact Us</h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto">
            Have a question, feedback, or need help with your order? We'd love to hear from you. Our team is here to help!
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 lg:py-16 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <MapPin size={24} className="text-amber-600" />
              </div>
              <h3 className="font-bold text-stone-900 mb-2">Visit Us</h3>
              <p className="text-sm text-stone-600">
                House 45, Road 12<br />
                Banani, Dhaka-1213<br />
                Bangladesh
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Phone size={24} className="text-amber-600" />
              </div>
              <h3 className="font-bold text-stone-900 mb-2">Call Us</h3>
              <p className="text-sm text-stone-600">
                +880 1712-345678<br />
                +880 1812-345678<br />
                (10 AM - 8 PM)
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Mail size={24} className="text-amber-600" />
              </div>
              <h3 className="font-bold text-stone-900 mb-2">Email Us</h3>
              <p className="text-sm text-stone-600">
                hello@tshirthub.bd<br />
                support@tshirthub.bd<br />
                orders@tshirthub.bd
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Clock size={24} className="text-amber-600" />
              </div>
              <h3 className="font-bold text-stone-900 mb-2">Working Hours</h3>
              <p className="text-sm text-stone-600">
                Sat - Thu: 10 AM - 8 PM<br />
                Friday: Closed<br />
                Online: 24/7
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">Send Us a Message</h2>
              <p className="text-stone-600 mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                  <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Message Sent!</h3>
                  <p className="text-stone-600">Thank you for reaching out. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Subject *</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="order">Order Inquiry</option>
                        <option value="product">Product Question</option>
                        <option value="return">Return/Exchange</option>
                        <option value="payment">Payment Issue</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Message *</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent resize-none"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors"
                  >
                    <Send size={18} /> Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Map / Additional Info */}
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">Find Us</h2>
              <p className="text-stone-600 mb-8">Visit our office or reach out through any of the channels below.</p>

              {/* Map placeholder */}
              <div className="bg-stone-100 rounded-2xl h-64 flex items-center justify-center mb-8 overflow-hidden">
                <div className="text-center">
                  <MapPin size={40} className="text-stone-400 mx-auto mb-2" />
                  <p className="text-sm text-stone-500">House 45, Road 12, Banani</p>
                  <p className="text-sm text-stone-500">Dhaka-1213, Bangladesh</p>
                </div>
              </div>

              {/* Quick contact options */}
              <div className="space-y-4">
                <h3 className="font-semibold text-stone-900">Quick Contact Options</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="tel:+8801712345678"
                    className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <Phone size={20} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-stone-900">Call Now</p>
                      <p className="text-xs text-stone-600">+880 1712-345678</p>
                    </div>
                  </a>
                  <a
                    href="https://wa.me/8801712345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle size={20} className="text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-stone-900">WhatsApp</p>
                      <p className="text-xs text-stone-600">Chat with us</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* FAQ Teaser */}
              <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
                <h3 className="font-semibold text-stone-900 mb-2">Frequently Asked Questions</h3>
                <p className="text-sm text-stone-600 mb-3">
                  Find quick answers to common questions about orders, shipping, returns, and more.
                </p>
                <div className="space-y-2 text-sm text-stone-700">
                  <p>• How long does delivery take?</p>
                  <p>• What is your return policy?</p>
                  <p>• Do you offer free shipping?</p>
                  <p>• How can I track my order?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-12 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Follow Us</h2>
          <p className="text-stone-600 mb-8">Stay connected for latest updates, offers, and new arrivals.</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors">
              <span className="text-lg">📘</span>
            </a>
            <a href="#" className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors">
              <span className="text-lg">📷</span>
            </a>
            <a href="#" className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors">
              <span className="text-lg">🐦</span>
            </a>
            <a href="#" className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors">
              <span className="text-lg">▶️</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
