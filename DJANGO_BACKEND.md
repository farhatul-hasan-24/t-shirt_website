# TshirtHub Bangladesh — Django Backend Architecture

## Overview

This document describes the Django backend architecture for the TshirtHub Bangladesh e-commerce platform. The frontend React application simulates the database-driven experience, while this document provides the complete Django implementation reference.

## Project Structure

```
tshirthub_bd/
├── manage.py
├── requirements.txt
├── .env.example
├── tshirthub_bd/          # Project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── core/                  # Core utilities, base models
├── accounts/              # Customer authentication & profiles
├── products/              # Product catalog & inventory
├── cart/                  # Shopping cart management
├── orders/                # Order processing & tracking
├── payments/              # Payment processing (abstraction layer)
├── shipping/              # Shipping zones & methods
├── coupons/               # Discount coupons
└── templates/             # Django templates (optional SSR)
```

## Django Models Reference

### products/models.py

```python
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Size(models.Model):
    name = models.CharField(max_length=10)  # S, M, L, XL, XXL
    label = models.CharField(max_length=50)  # Small, Medium, etc.
    sort_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['sort_order']

    def __str__(self):
        return self.name


class Color(models.Model):
    name = models.CharField(max_length=50)
    hex = models.CharField(max_length=7)  # #RRGGBB
    sort_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['sort_order']

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    short_description = models.CharField(max_length=500, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def min_price(self):
        variants = self.variants.filter(stock__gt=0)
        if variants.exists():
            return min(v.effective_price for v in variants)
        return Decimal('0')


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['sort_order']


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    sku = models.CharField(max_length=50, unique=True)
    size = models.ForeignKey(Size, on_delete=models.PROTECT)
    color = models.ForeignKey(Color, on_delete=models.PROTECT)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)])
    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['product', 'size', 'color']
        indexes = [
            models.Index(fields=['product', 'is_active']),
            models.Index(fields=['sku']),
        ]

    def __str__(self):
        return f"{self.product.name} - {self.size.name}/{self.color.name}"

    @property
    def effective_price(self):
        return self.sale_price if self.sale_price else self.price

    @property
    def is_in_stock(self):
        return self.stock > 0 and self.is_active
```

### accounts/models.py

```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class Customer(AbstractUser):
    phone = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Address(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='addresses')
    label = models.CharField(max_length=50, default='Home')  # Home, Office, etc.
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=15)
    address_line = models.TextField()
    division = models.CharField(max_length=50)
    district = models.CharField(max_length=50)
    area = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=10, blank=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_default', '-created_at']

    def __str__(self):
        return f"{self.label} - {self.district}, {self.division}"
```

### cart/models.py

```python
from django.db import models
from django.conf import settings

class Cart(models.Model):
    customer = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart', null=True, blank=True)
    session_key = models.CharField(max_length=40, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total(self):
        return sum(item.subtotal for item in self.items.all())

    @property
    def item_count(self):
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey('products.ProductVariant', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['cart', 'variant']

    @property
    def unit_price(self):
        return self.variant.effective_price

    @property
    def subtotal(self):
        return self.unit_price * self.quantity
```

### orders/models.py

```python
from django.db import models
from django.conf import settings
from decimal import Decimal

class OrderStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    PAYMENT_PENDING = 'payment_pending', 'Payment Pending'
    PAYMENT_VERIFIED = 'payment_verified', 'Payment Verified'
    CONFIRMED = 'confirmed', 'Confirmed'
    PROCESSING = 'processing', 'Processing'
    PACKED = 'packed', 'Packed'
    SHIPPED = 'shipped', 'Shipped'
    OUT_FOR_DELIVERY = 'out_for_delivery', 'Out for Delivery'
    DELIVERED = 'delivered', 'Delivered'
    CANCELLED = 'cancelled', 'Cancelled'
    RETURNED = 'returned', 'Returned'
    REFUNDED = 'refunded', 'Refunded'


class Order(models.Model):
    order_number = models.CharField(max_length=30, unique=True, db_index=True)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='orders')
    
    # Shipping info (snapshot at order time)
    shipping_name = models.CharField(max_length=200)
    shipping_email = models.EmailField()
    shipping_phone = models.CharField(max_length=15)
    shipping_address = models.TextField()
    shipping_division = models.CharField(max_length=50)
    shipping_district = models.CharField(max_length=50)
    shipping_area = models.CharField(max_length=100, blank=True)
    shipping_postal_code = models.CharField(max_length=10, blank=True)
    
    # Shipping method
    shipping_method = models.ForeignKey('shipping.ShippingMethod', on_delete=models.PROTECT)
    shipping_charge = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Payment
    payment_method = models.CharField(max_length=30)
    
    # Amounts
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Status
    status = models.CharField(max_length=20, choices=OrderStatus.choices, default=OrderStatus.PENDING)
    
    # Notes
    customer_note = models.TextField(blank=True)
    admin_note = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['customer', 'status']),
        ]

    def __str__(self):
        return self.order_number


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey('products.ProductVariant', on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.variant} × {self.quantity}"


class OrderStatusHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=20, choices=OrderStatus.choices)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    class Meta:
        ordering = ['-created_at']
```

### payments/models.py

```python
from django.db import models
from django.conf import settings

class PaymentStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    PROCESSING = 'processing', 'Processing'
    PAID = 'paid', 'Paid'
    FAILED = 'failed', 'Failed'
    CANCELLED = 'cancelled', 'Cancelled'
    REFUNDED = 'refunded', 'Refunded'
    VERIFICATION_PENDING = 'verification_pending', 'Verification Pending'


class Payment(models.Model):
    order = models.OneToOneField('orders.Order', on_delete=models.CASCADE, related_name='payment')
    method = models.CharField(max_length=30)  # cod, bkash, nagad, rocket, bank_transfer, online_card
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=25, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    provider_transaction_id = models.CharField(max_length=100, blank=True, db_index=True)
    customer_transaction_id = models.CharField(max_length=100, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['provider_transaction_id']),
            models.Index(fields=['status']),
        ]


class PaymentTransaction(models.Model):
    """Tracks individual payment attempts/transactions"""
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='transactions')
    transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=25, choices=PaymentStatus.choices)
    raw_response = models.JSONField(default=dict, blank=True)
    gateway_response = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class BankTransferProof(models.Model):
    """Stores bank transfer payment proof for admin verification"""
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='bank_proof')
    transaction_reference = models.CharField(max_length=100)
    transfer_amount = models.DecimalField(max_digits=10, decimal_places=2)
    proof_image = models.ImageField(upload_to='payment_proofs/', null=True, blank=True)
    verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    admin_note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

### shipping/models.py

```python
from django.db import models

class ShippingZone(models.Model):
    name = models.CharField(max_length=100)  # Inside Dhaka, Outside Dhaka, etc.
    charge = models.DecimalField(max_digits=10, decimal_places=2)
    free_shipping_threshold = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    estimated_days = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['sort_order']

    def __str__(self):
        return self.name


class ShippingMethod(models.Model):
    zone = models.ForeignKey(ShippingZone, on_delete=models.PROTECT)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.zone.name})"
```

### coupons/models.py

```python
from django.db import models
from django.utils import timezone

class Coupon(models.Model):
    DISCOUNT_TYPES = [
        ('fixed', 'Fixed Amount'),
        ('percentage', 'Percentage'),
    ]

    code = models.CharField(max_length=30, unique=True)
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPES)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    minimum_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    maximum_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    usage_limit = models.IntegerField(null=True, blank=True)
    usage_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        now = timezone.now()
        return (
            self.is_active and
            self.valid_from <= now <= self.valid_until and
            (self.usage_limit is None or self.usage_count < self.usage_limit)
        )

    def calculate_discount(self, order_amount):
        if not self.is_valid() or order_amount < self.minimum_order_amount:
            return 0
        
        if self.discount_type == 'fixed':
            discount = self.discount_value
        else:
            discount = order_amount * (self.discount_value / 100)
        
        if self.maximum_discount:
            discount = min(discount, self.maximum_discount)
        
        return min(discount, order_amount)
```

## Payment Abstraction Layer

### payments/services/base.py

```python
from abc import ABC, abstractmethod
from decimal import Decimal
from typing import Optional, Dict, Any

class PaymentResult:
    def __init__(self, success: bool, transaction_id: str = '', 
                 message: str = '', raw_data: Dict = None):
        self.success = success
        self.transaction_id = transaction_id
        self.message = message
        self.raw_data = raw_data or {}


class BasePaymentProvider(ABC):
    """Abstract base class for all payment providers"""

    @abstractmethod
    def initiate_payment(self, order, amount: Decimal, **kwargs) -> PaymentResult:
        """Initiate a payment and return result/redirect URL"""
        pass

    @abstractmethod
    def verify_payment(self, transaction_id: str) -> PaymentResult:
        """Verify payment status with the provider"""
        pass

    @abstractmethod
    def process_callback(self, data: Dict[str, Any]) -> PaymentResult:
        """Process webhook/callback from payment provider"""
        pass

    @abstractmethod
    def refund_payment(self, transaction_id: str, amount: Decimal) -> PaymentResult:
        """Process a refund"""
        pass
```

### payments/services/bkash.py

```python
import requests
from django.conf import settings
from .base import BasePaymentProvider, PaymentResult

class BkashPaymentProvider(BasePaymentProvider):
    """
    bKash Payment Gateway Integration
    Uses official bKash PGW API (Tokenized Checkout)
    Documentation: https://developer.bkashtech.com/
    """

    def __init__(self):
        self.base_url = getattr(settings, 'BKASH_BASE_URL', 'https://tokenized.sandbox.bka.sh/v1.2.0-beta')
        self.app_key = settings.BKASH_APP_KEY
        self.app_secret = settings.BKASH_APP_SECRET
        self.username = settings.BKASH_USERNAME
        self.password = settings.BKASH_PASSWORD
        self._token = None

    def _get_token(self):
        """Authenticate and get token"""
        url = f"{self.base_url}/tokenized/checkout/token/grant/token"
        headers = {
            'username': self.username,
            'password': self.password,
            'app_key': self.app_key,
            'app_secret': self.app_secret,
        }
        response = requests.post(url, headers=headers)
        data = response.json()
        self._token = data.get('id_token')
        return self._token

    def initiate_payment(self, order, amount, **kwargs):
        token = self._get_token()
        url = f"{self.base_url}/tokenized/checkout/create/payment"
        headers = {
            'Authorization': token,
            'X-APP-Key': self.app_key,
        }
        payload = {
            'mode': '0011',
            'payerReference': order.order_number,
            'callbackURL': f"{settings.SITE_URL}/payments/bkash/callback/",
            'amount': str(amount),
            'currency': 'BDT',
            'intent': 'sale',
        }
        response = requests.post(url, json=payload, headers=headers)
        data = response.json()
        
        if data.get('statusCode') == '0000':
            return PaymentResult(
                success=True,
                transaction_id=data.get('paymentID', ''),
                message=data.get('statusMessage', ''),
                raw_data=data
            )
        return PaymentResult(success=False, message=data.get('statusMessage', 'Payment initiation failed'))

    def verify_payment(self, transaction_id):
        token = self._get_token()
        url = f"{self.base_url}/tokenized/checkout/execute/payment"
        headers = {
            'Authorization': token,
            'X-APP-Key': self.app_key,
        }
        payload = {'paymentID': transaction_id}
        response = requests.post(url, json=payload, headers=headers)
        data = response.json()
        
        if data.get('transactionStatus') == 'Completed':
            return PaymentResult(success=True, transaction_id=transaction_id, raw_data=data)
        return PaymentResult(success=False, message='Payment not completed', raw_data=data)

    def process_callback(self, data):
        payment_id = data.get('paymentID')
        if payment_id:
            return self.verify_payment(payment_id)
        return PaymentResult(success=False, message='No payment ID in callback')

    def refund_payment(self, transaction_id, amount):
        token = self._get_token()
        url = f"{self.base_url}/tokenized/checkout/refund"
        headers = {
            'Authorization': token,
            'X-APP-Key': self.app_key,
        }
        payload = {
            'paymentID': transaction_id,
            'amount': str(amount),
            'currency': 'BDT',
        }
        response = requests.post(url, json=payload, headers=headers)
        data = response.json()
        
        if data.get('transactionStatus') == 'Completed':
            return PaymentResult(success=True, transaction_id=transaction_id, raw_data=data)
        return PaymentResult(success=False, message='Refund failed', raw_data=data)
```

### payments/services/sslcommerz.py

```python
import hashlib
import requests
from django.conf import settings
from .base import BasePaymentProvider, PaymentResult

class SSLCommerzProvider(BasePaymentProvider):
    """
    SSLCommerz Payment Gateway Integration
    Documentation: https://developer.sslcommerz.com/
    """

    def __init__(self):
        self.store_id = settings.SSLCOMMERZ_STORE_ID
        self.store_password = settings.SSLCOMMERZ_STORE_PASSWORD
        self.mode = getattr(settings, 'SSLCOMMERZ_MODE', 'sandbox')
        self.base_url = 'https://securepay.sslcommerz.com/gwprocess/v4' if self.mode == 'live' \
            else 'https://sandbox.sslcommerz.com/gwprocess/v4'

    def initiate_payment(self, order, amount, **kwargs):
        url = f"{self.base_url}/gwprocess/v4/gw.php"
        payload = {
            'store_id': self.store_id,
            'store_passwd': self.store_password,
            'total_amount': str(amount),
            'currency': 'BDT',
            'tran_id': order.order_number,
            'success_url': f"{settings.SITE_URL}/payments/sslcommerz/success/",
            'fail_url': f"{settings.SITE_URL}/payments/sslcommerz/fail/",
            'cancel_url': f"{settings.SITE_URL}/payments/sslcommerz/cancel/",
            'emi_option': 0,
            'cus_name': f"{order.shipping_name}",
            'cus_email': order.shipping_email,
            'cus_phone': order.shipping_phone,
            'cus_add1': order.shipping_address,
            'cus_city': order.shipping_district,
            'cus_country': 'Bangladesh',
            'product_name': 'TshirtHub Order',
            'product_category': 'T-Shirts',
            'product_profile': 'physical-goods',
        }
        response = requests.post(url, data=payload)
        data = response.json()
        
        if data.get('status') == 'SUCCESS':
            return PaymentResult(
                success=True,
                transaction_id=data.get('sessionkey', ''),
                message='Payment session created',
                raw_data=data
            )
        return PaymentResult(success=False, message=data.get('failedreason', 'Payment initiation failed'))

    def verify_payment(self, transaction_id):
        """Validate payment using SSLCommerz validation API"""
        url = f"{self.base_url}/validator/api/validationserverAPI.php"
        params = {
            'val_id': transaction_id,
            'store_id': self.store_id,
            'store_passwd': self.store_password,
            'format': 'json',
        }
        response = requests.get(url, params=params)
        data = response.json()
        
        if data.get('status') == 'VALID' and data.get('tran_status') == 'Valid':
            return PaymentResult(success=True, transaction_id=transaction_id, raw_data=data)
        return PaymentResult(success=False, message='Payment validation failed', raw_data=data)

    def process_callback(self, data):
        # Verify hash for security
        if self._verify_hash(data):
            val_id = data.get('val_id')
            if val_id:
                return self.verify_payment(val_id)
        return PaymentResult(success=False, message='Invalid callback')

    def _verify_hash(self, data):
        """Verify the SSLCommerz IPN hash"""
        verify_sign = data.get('verify_sign')
        verify_key = data.get('verify_key', '').split(',')
        hash_string = '&'.join(f"{k}={data.get(k, '')}" for k in sorted(verify_key) if k in data)
        hash_string += f"&store_passwd={self.store_password}"
        computed_hash = hashlib.md5(hash_string.encode()).hexdigest()
        return computed_hash == verify_sign

    def refund_payment(self, transaction_id, amount):
        url = f"{self.base_url}/validator/api/merchantTransIDvalidationAPI.php"
        params = {
            'store_id': self.store_id,
            'store_passwd': self.store_password,
            'refund_refund_id': f"REF-{transaction_id[:10]}",
            'refund_tran_id': transaction_id,
            'refund_amount': str(amount),
            'format': 'json',
        }
        response = requests.get(url, params=params)
        data = response.json()
        
        if data.get('status') == 'SUCCESS':
            return PaymentResult(success=True, transaction_id=transaction_id, raw_data=data)
        return PaymentResult(success=False, message='Refund failed', raw_data=data)
```

### payments/services/factory.py

```python
from django.conf import settings
from .base import BasePaymentProvider
from .bkash import BkashPaymentProvider
from .sslcommerz import SSLCommerzProvider

class PaymentProviderFactory:
    """Factory for creating payment provider instances"""
    
    _providers = {
        'bkash': BkashPaymentProvider,
        'nagad': BkashPaymentProvider,  # Nagad uses similar API structure
        'rocket': BkashPaymentProvider,  # Rocket uses similar API structure
        'online_card': SSLCommerzProvider,
    }

    @classmethod
    def get_provider(cls, method: str) -> BasePaymentProvider:
        provider_class = cls._providers.get(method)
        if not provider_class:
            raise ValueError(f"Unknown payment method: {method}")
        return provider_class()
```

## Environment Configuration

### .env.example

```env
# Django
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database (PostgreSQL)
DB_NAME=tshirthub_bd
DB_USER=postgres
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432

# Site
SITE_URL=http://localhost:8000

# bKash Payment Gateway
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta
BKASH_APP_KEY=your-bkash-app-key
BKASH_APP_SECRET=your-bkash-app-secret
BKASH_USERNAME=your-bkash-username
BKASH_PASSWORD=your-bkash-password

# SSLCommerz
SSLCOMMERZ_STORE_ID=your-store-id
SSLCOMMERZ_STORE_PASSWORD=your-store-password
SSLCOMMERZ_MODE=sandbox

# Nagad (if using direct API)
NAGAD_MERCHANT_ID=your-nagad-merchant-id
NAGAD_MERCHANT_KEY=your-nagad-merchant-key

# Rocket (if using direct API)
ROCKET_MERCHANT_ID=your-rocket-merchant-id
ROCKET_API_KEY=your-rocket-api-key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Media/Static
MEDIA_ROOT=/path/to/media/
STATIC_ROOT=/path/to/static/
```

## Setup Instructions

### 1. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Create Django Project
```bash
django-admin startproject tshirthub_bd .
python manage.py startapp core
python manage.py startapp accounts
python manage.py startapp products
python manage.py startapp cart
python manage.py startapp orders
python manage.py startapp payments
python manage.py startapp shipping
python manage.py startapp coupons
```

### 4. Configure PostgreSQL
```bash
# Install PostgreSQL and create database
createdb tshirthub_bd

# Or using psql
psql -U postgres
CREATE DATABASE tshirthub_bd;
CREATE USER tshirthub_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE tshirthub_bd TO tshirthub_user;
```

### 5. Create .env file
```bash
cp .env.example .env
# Edit .env with your actual credentials
```

### 6. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Create Superuser
```bash
python manage.py createsuperuser
```

### 8. Load Sample Data
```bash
python manage.py loaddata fixtures/sample_data.json
# Or create a management command:
python manage.py seed_products
```

### 9. Configure Media/Static
```bash
mkdir -p media/products media/payment_proofs
mkdir -p static
```

### 10. Run Development Server
```bash
python manage.py runserver
```

## requirements.txt

```
Django>=4.2,<5.0
psycopg2-binary>=2.9
Pillow>=10.0
python-decouple>=3.8
django-cors-headers>=4.2
djangorestframework>=3.14
django-filter>=23.2
requests>=2.31
stripe>=6.0  # Optional
celery>=5.3  # Optional for async tasks
redis>=5.0   # Optional for caching
gunicorn>=21.2
whitenoise>=6.5
```

## Production Deployment

### Docker Setup
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN python manage.py collectstatic --noinput
EXPOSE 8000
CMD ["gunicorn", "tshirthub_bd.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name tshirthub.bd;
    
    location /static/ {
        alias /app/static/;
    }
    
    location /media/ {
        alias /app/media/;
    }
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Security Checklist

- [ ] DJANGO_SECRET_KEY is unique and not in version control
- [ ] DEBUG=False in production
- [ ] ALLOWED_HOSTS configured
- [ ] HTTPS enabled
- [ ] CSRF protection enabled (default in Django)
- [ ] Payment callbacks verified server-side
- [ ] No sensitive data in database (PINs, OTPs, card numbers)
- [ ] Database transactions used for order/payment operations
- [ ] Rate limiting on payment endpoints
- [ ] Webhook signatures verified
- [ ] SQL injection protection (Django ORM handles this)
