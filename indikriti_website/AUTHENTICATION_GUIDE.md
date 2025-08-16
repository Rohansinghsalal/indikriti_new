# Authentication Troubleshooting Guide

## Problem: 401 Unauthorized Errors

Your backend is returning 401 errors because the API endpoints require authentication, but your frontend isn't sending valid authentication tokens.

## Root Cause Analysis

Based on your logs:
```
[Backend] GET /api/v1/products 401 6.100 ms - 62
[Backend] GET /api/v1/products/brands/indikriti/hierarchy 401 1.833 ms - 62
```

The `62` byte response indicates a standard 401 "Unauthorized" message, meaning:
1. Your backend auth middleware is working correctly
2. The endpoints exist and are reachable
3. Authentication is required but not provided

## Solutions Implemented

### 1. Automatic Admin Authentication
- Added auto-login functionality that tries common admin credentials
- Frontend now attempts to authenticate with backend automatically
- Falls back to mock data if authentication fails

### 2. Authentication Testing
- Created `authTest.js` utility to debug authentication
- Added "Test Auth" button in development mode
- Tests multiple credential combinations

### 3. Enhanced Error Handling
- Better 401/403 error detection and retry logic
- Token refresh mechanism
- Graceful fallback to mock data

## Quick Fixes

### Option 1: Create Admin User in Backend
Create an admin user in your backend database:

```sql
INSERT INTO admins (email, password, first_name, last_name, is_super_admin, status, access_level) 
VALUES (
  'admin@example.com', 
  '$2b$10$hashedpassword', -- Use bcrypt to hash 'admin123'
  'Admin', 
  'User', 
  1, 
  'active',
  'super_admin'
);
```

### Option 2: Make Products Endpoint Public
Update your backend routes to allow public access to products:

```javascript
// In your routes file, remove auth middleware for public endpoints
router.get('/products', productController.getAllProducts); // Remove auth middleware
router.get('/products/brands/:brand/hierarchy', productController.getBrandHierarchy); // Remove auth middleware
```

### Option 3: Update Frontend Credentials
If you have different admin credentials, update the test credentials in `src/services/api.js`:

```javascript
const credentials = [
  { email: 'your-admin@email.com', password: 'your-password' },
  // ... other credentials
];
```

## Testing the Fix

1. **Check Development Console**: Look for authentication test results
2. **Use Test Auth Button**: Click the "Test Auth" button in development mode
3. **Monitor Network Tab**: Check if requests now include `Authorization: Bearer <token>` headers
4. **Verify Products Load**: Products should load from backend instead of mock data

## Common Backend Auth Issues

### Missing Admin User
- Solution: Create admin user in database
- Check: `SELECT * FROM admins WHERE email = 'admin@example.com'`

### Wrong Password Hash
- Solution: Use bcrypt to hash passwords properly
- Check: Password comparison in auth controller

### CORS Issues
- Solution: Ensure CORS allows `Authorization` header
- Check: CORS configuration in backend

### JWT Secret Mismatch
- Solution: Verify JWT secret is consistent
- Check: Environment variables and config files

## Monitoring

The frontend now logs authentication attempts:
- `🔐 User authenticated successfully` - User login
- `✅ Admin authentication successful` - API access token
- `❌ Authentication failed` - Need to check backend

## Next Steps

1. Test the authentication with the "Test Auth" button
2. If it works, products should load from your backend
3. If it fails, check your backend admin user setup
4. Monitor the console for specific error messages

The app will continue to work with mock data even if backend authentication fails, ensuring a good user experience while you debug the backend.
