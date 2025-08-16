# Indikriti E-Commerce Implementation Guide

## 🎯 Overview

This is a complete redesign of the Indikriti e-commerce platform with separate desktop and mobile experiences, comprehensive authentication, wallet system, analytics, and full API integration.

## 🏗️ Architecture

### Responsive Design System
- **Desktop (≥1024px)**: Full-featured layout with horizontal navigation
- **Tablet (768px-1023px)**: Condensed desktop layout
- **Mobile (<768px)**: Mobile-first design with sticky bottom navigation

### Key Components Structure

```
src/
├── components/
│   ├── desktop/           # Desktop-specific components
│   │   └── DesktopHeader.jsx
│   ├── mobile/            # Mobile-specific components
│   │   ├── MobileHeader.jsx
│   │   └── MobileNavbar.jsx
│   ├── auth/              # Authentication flow
│   │   └── AuthFlow.jsx
│   ├── sales/             # Sales and discounts
│   │   └── SalesSection.jsx
│   ├── checkout/          # Checkout components
│   │   └── WalletRedemption.jsx
│   ├── Layout.jsx         # Main responsive layout wrapper
│   └── ProductCard.jsx    # Enhanced product card with analytics
├── context/               # State management
│   ├── AuthContext.jsx    # Phone-based authentication
│   └── CartContext.jsx    # Cart & wishlist with analytics
├── hooks/                 # Custom hooks
│   ├── useResponsive.js   # Device detection
│   └── useAnalytics.js    # Event tracking
├── services/              # API layer
│   ├── enhancedApi.js     # Main API service
│   ├── api.js             # Legacy API (maintained for compatibility)
│   └── mockData.js        # Sample data
└── pages/
    └── Home.jsx           # Enhanced home page
```

## 🔐 Authentication System

### Phone Number Based Authentication

1. **Step 1: Phone Number Input**
   - Validates Indian mobile numbers (10 digits, starts with 6-9)
   - Checks if user exists in database

2. **Step 2: OTP Verification**
   - Sends OTP to mobile number
   - 30-second resend timer
   - Accepts 4-6 digit OTP codes

3. **Step 3: Registration (New Users)**
   - Full name (required)
   - Email ID (required)
   - Referral code (optional - adds ₹100 bonus)
   - Instagram ID (optional)

### API Endpoints
```javascript
// Check if mobile number exists
POST /api/v1/auth/check-mobile
{ "mobileNumber": "9876543210" }

// Send OTP
POST /api/v1/auth/send-otp
{ "mobileNumber": "9876543210" }

// Verify OTP
POST /api/v1/auth/verify-otp
{ "mobileNumber": "9876543210", "otp": "1234", "otpId": "otp_id" }

// Register new user
POST /api/v1/auth/register
{
  "mobileNumber": "9876543210",
  "name": "User Name",
  "email": "user@email.com",
  "referralCode": "REF123",
  "instagramId": "@username"
}
```

## 🛒 Cart & Wishlist System

### Features
- **Add to Cart**: With quantity management
- **Wishlist**: Save for later functionality
- **Analytics Tracking**: Every action is tracked
- **Local Storage**: Persistence across sessions
- **Move Between Lists**: Cart ↔ Wishlist

### Analytics Events
```javascript
// Tracked events
trackAddToCart(product, quantity)
trackAddToWishlist(product)
trackRemoveFromWishlist(product)
trackViewProduct(product)
trackPurchase(orderData)
trackSearch(query, results)
```

## 💰 Wallet System

### Features
- **Balance Display**: Shows current wallet balance
- **Transaction History**: Track credits/debits
- **Checkout Redemption**: Use wallet money at checkout
- **Referral Bonus**: ₹100 for referral signups
- **Welcome Bonus**: ₹100 on registration

### Wallet API
```javascript
// Get wallet balance
GET /api/v1/wallet/{userId}

// Redeem wallet amount
POST /api/v1/wallet/redeem
{
  "userId": "user_id",
  "amount": 150,
  "orderId": "order_id"
}
```

## 🏷️ Sales & Discounts

### Types of Sales
1. **Flash Sales**: Limited time offers with countdown
2. **Deal Banners**: Special promotional deals
3. **Discounted Products**: Products with reduced prices

### API Structure
```javascript
// Sales data endpoint
GET /api/v1/sales-discounts
{
  "flashSales": [...products],
  "discountedProducts": [...products],
  "deals": [
    {
      "id": 1,
      "title": "Flash Sale",
      "description": "Up to 50% off",
      "discount": 50,
      "expiresAt": "2024-12-31T23:59:59Z",
      "products": [...products]
    }
  ]
}
```

## 📱 Mobile Navigation

### Sticky Bottom Navigation
- **Home**: Main page
- **Search**: Product search
- **Wishlist**: Saved items (with badge)
- **Cart**: Shopping cart (with badge)
- **Profile**: User account or login

### Auto-Hide on Scroll
- Hides when scrolling down
- Shows when scrolling up
- Smooth animations

## 🖥️ Desktop Layout

### Header Components
1. **Top Bar**: Contact info, shipping info, wallet balance
2. **Main Header**: Logo, search, user menu, cart/wishlist
3. **Navigation**: Category links, promotions

### Features
- **Advanced Search**: Dropdown with product suggestions
- **User Menu**: Profile, orders, wallet, logout
- **Category Navigation**: Quick access to product categories

## 📊 Analytics System

### Event Tracking
All user interactions are tracked and stored locally:

```javascript
// Example analytics data
{
  "id": "event_id",
  "name": "add_to_cart",
  "data": {
    "product_id": "123",
    "product_name": "Handloom Bedsheet",
    "price": 1200,
    "quantity": 1
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "sessionId": "session_123",
  "userId": "user_456"
}
```

### Tracked Events
- Page views
- Product views
- Add to cart/wishlist
- Search queries
- User registration/login
- Purchase completion

## 🔧 API Integration

### Environment Detection
The app automatically detects the environment:

- **Local Development**: Connects to `localhost:5000`
- **Cloud/Production**: Uses `VITE_API_URL` or falls back to mock data
- **Mock Data Mode**: When no backend is available

### Error Handling
- Graceful fallback to mock data
- Retry mechanisms for failed requests
- User-friendly error messages

## 🎨 Design Features

### Mobile-First Design
- Touch-friendly buttons and controls
- Optimized image sizes
- Swipe gestures support
- Fast loading animations

### Desktop Enhancements
- Hover effects and transitions
- Advanced search with autocomplete
- Multi-column layouts
- Rich product displays

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
# Optional: Set backend URL
echo "VITE_API_URL=https://your-backend.com/api/v1" > .env
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Backend Integration
The app works with or without a backend:

**With Backend**: Set `VITE_API_URL` and implement the API endpoints
**Without Backend**: Uses comprehensive mock data automatically

## 📋 Backend API Requirements

### Authentication Endpoints
- `POST /api/v1/auth/check-mobile`
- `POST /api/v1/auth/send-otp`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/register`

### Product Endpoints
- `GET /api/v1/products?brand=indikriti`
- `GET /api/v1/products/brands/indikriti/hierarchy`
- `GET /api/v1/sales-discounts`

### User Endpoints
- `GET /api/v1/wallet/{userId}`
- `POST /api/v1/wallet/redeem`
- `POST /api/v1/orders`

## 🎯 Key Features Implemented

✅ **Responsive Design**: Separate desktop/mobile layouts  
✅ **Phone Authentication**: OTP-based login system  
✅ **Wallet Integration**: Balance, redemption, transactions  
✅ **Cart & Wishlist**: Full functionality with analytics  
✅ **Sales System**: Flash sales, deals, discounts  
✅ **Analytics Tracking**: Comprehensive event tracking  
✅ **API Integration**: Backend + fallback to mock data  
✅ **Mobile Navigation**: Sticky bottom navbar  
✅ **Search Functionality**: Advanced search with suggestions  
✅ **Error Handling**: Graceful degradation  

## 🔮 Future Enhancements

- **Push Notifications**: For sales and order updates
- **Social Login**: Google, Facebook integration
- **Advanced Filters**: Price, rating, location filters
- **Reviews System**: User product reviews
- **Recommendation Engine**: ML-based product suggestions
- **Multi-language Support**: Hindi, regional languages
- **Offline Mode**: PWA capabilities
- **Payment Integration**: Razorpay, UPI, wallet payments

## 📞 Support

For implementation questions or backend integration help:
- Check the `AUTHENTICATION_GUIDE.md` for auth troubleshooting
- Review console logs for API connectivity issues
- Use the "Test Auth" button in development mode
- Monitor the analytics data in localStorage

The application is designed to work seamlessly with or without a backend, providing a complete e-commerce experience in both scenarios.
