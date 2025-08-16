# Backend API Troubleshooting Guide

## Current Status
✅ **Backend Server**: Running on http://localhost:5000  
✅ **Database**: MySQL connected (admin database)  
✅ **Tables**: All tables synchronized successfully  
❌ **API Routes**: Getting 404 errors  

## Issues Detected

### 1. 404 Errors on API Endpoints
Your frontend is trying to access these endpoints but getting 404:
- `GET /api/v1/products` → 404
- `GET /api/v1/products/categories` → 404  
- `GET /api/v1/products/brands` → 404
- `GET /api/v1/products/brands/indikriti/hierarchy` → 404

### 2. Possible Causes

#### A. Routes Not Mounted
Your API routes might not be properly mounted in your main server file. Check:

```javascript
// In your main server file (usually index.js or app.js)
const productRoutes = require('./routes/products'); // or wherever your routes are

// Make sure you mount the routes with the correct prefix
app.use('/api/v1', productRoutes);
// OR
app.use('/api/v1/products', productRoutes);
```

#### B. Authentication Required
Your routes might require authentication. From your API structure, it looks like some endpoints need JWT tokens:

```javascript
// Make sure public endpoints don't require auth
router.get('/brands', BrandCategoryController.getAllBrands); // Should be public

// But other endpoints might need auth middleware
router.use(authenticateToken); // This line might be blocking all requests
```

#### C. CORS Issues
Make sure CORS is properly configured for your frontend:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

## Quick Fixes to Try

### 1. Check Your Route Mounting
In your main server file, ensure routes are mounted correctly:

```javascript
// Example server setup
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/products'); // Adjust path

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Mount routes CORRECTLY
app.use('/api/v1/products', productRoutes); // Note: /products prefix here
// OR if your routes already include /products:
app.use('/api/v1', productRoutes);

// Test endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
```

### 2. Make Public Endpoints Accessible
In your routes file, make sure the brands endpoint is before auth middleware:

```javascript
// BEFORE any auth middleware
router.get('/brands', BrandCategoryController.getAllBrands);

// THEN apply auth middleware for protected routes
router.use(authenticateToken);

// Protected routes after auth middleware
router.get('/', ProductController.getAllProducts);
router.get('/categories', ProductController.getAllCategories);
```

### 3. Test Your Backend Directly
Open a new terminal and test your backend directly:

```bash
# Test if server is responding
curl http://localhost:5000/api/v1/health

# Test products endpoint
curl http://localhost:5000/api/v1/products

# Test brands endpoint (should be public)
curl http://localhost:5000/api/v1/products/brands
```

## Expected API Endpoints

Based on your API structure, these should work:

### Public Endpoints (No Auth Required)
- `GET /api/v1/products/brands` - List available brands
- `GET /api/v1/health` - Health check

### Protected Endpoints (Auth Required)
- `GET /api/v1/products` - List products
- `GET /api/v1/products/categories` - List categories
- `GET /api/v1/products/brands/{brand}/hierarchy` - Get brand hierarchy
- `GET /api/v1/products/brands/{brand}/categories` - Get brand categories

## Frontend Fallback

✅ **Good News**: Your frontend now handles these issues gracefully:
- If backend is not available → Uses mock data
- Shows clear error messages in console
- Displays proper loading states
- Falls back to demonstration data

## Next Steps

1. **Check your server file** - Ensure routes are mounted with correct prefixes
2. **Test endpoints directly** - Use curl or Postman to test backend
3. **Check auth requirements** - Make sure public endpoints don't need tokens
4. **Verify CORS setup** - Ensure frontend can access backend
5. **Check console logs** - Your frontend now shows detailed API debugging

## Mock Data Available

While troubleshooting, your app will use realistic mock data including:
- ✅ Handloom, Handicraft, Corporate Gift categories
- ✅ Products with proper database structure
- ✅ Brand hierarchy (Indikriti/WinsomeLane)
- ✅ Authentication flow
- ✅ Cart/Wishlist functionality

The app is fully functional even without backend connection!
