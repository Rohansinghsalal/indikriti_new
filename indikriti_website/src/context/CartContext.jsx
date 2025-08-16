import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Analytics tracking removed for public website

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const savedWishlist = localStorage.getItem('wishlist');
      
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading cart/wishlist from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlistItems]);

  // Cart functions
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === product.id || item.product_id === product.product_id
      );

      if (existingItem) {
        // Update quantity if item already exists
        const updatedItems = prevItems.map(item =>
          (item.id === product.id || item.product_id === product.product_id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        
        // Analytics tracking removed
        
        return updatedItems;
      } else {
        // Add new item
        const newItem = {
          ...product,
          id: product.id || product.product_id,
          quantity,
          addedAt: new Date().toISOString(),
        };
        
        // Analytics tracking removed
        
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        item.id !== productId && item.product_id !== productId
      )
    );
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.id === productId || item.product_id === productId)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Wishlist functions
  const addToWishlist = (product) => {
    const productId = product.id || product.product_id;
    
    setWishlistItems(prevItems => {
      const exists = prevItems.some(item => 
        item.id === productId || item.product_id === productId
      );

      if (!exists) {
        const newItem = {
          ...product,
          id: productId,
          addedAt: new Date().toISOString(),
        };
        
        // Analytics tracking removed
        
        return [...prevItems, newItem];
      }
      
      return prevItems;
    });
  };

  const removeFromWishlist = (productId) => {
    const product = wishlistItems.find(item => 
      item.id === productId || item.product_id === productId
    );
    
    setWishlistItems(prevItems =>
      prevItems.filter(item => 
        item.id !== productId && item.product_id !== productId
      )
    );
    
    // Analytics tracking removed
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => 
      item.id === productId || item.product_id === productId
    );
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  // Utility functions
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price || item.discounted_price || 0);
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const moveToCart = (productId, quantity = 1) => {
    const wishlistItem = wishlistItems.find(item => 
      item.id === productId || item.product_id === productId
    );
    
    if (wishlistItem) {
      addToCart(wishlistItem, quantity);
      removeFromWishlist(productId);
    }
  };

  const moveToWishlist = (productId) => {
    const cartItem = cartItems.find(item => 
      item.id === productId || item.product_id === productId
    );
    
    if (cartItem) {
      addToWishlist(cartItem);
      removeFromCart(productId);
    }
  };

  const value = {
    // Cart
    cartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    
    // Wishlist
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
    
    // Utilities
    moveToCart,
    moveToWishlist,
    loading,
    setLoading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
