/**
 * Token Management Utility
 * Handles automatic token refresh and expiration management
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

class TokenManager {
  constructor() {
    this.refreshTimer = null;
    this.isRefreshing = false;
  }

  /**
   * Initialize token manager and start automatic refresh
   */
  init() {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('token');
    if (token) {
      this.scheduleTokenRefresh(token);
    }
  }

  /**
   * Set tokens and schedule automatic refresh
   */
  setTokens(token, refreshToken) {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    
    this.scheduleTokenRefresh(token);
  }

  /**
   * Clear tokens and cancel refresh timer
   */
  clearTokens() {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Get token expiration time from JWT
   */
  getTokenExpiration(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
      console.error('Failed to parse token:', error);
      return null;
    }
  }

  /**
   * Schedule automatic token refresh before expiration
   */
  scheduleTokenRefresh(token) {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const expiresAt = this.getTokenExpiration(token);
    if (!expiresAt) {
      console.warn('⚠️ Could not parse token expiration, skipping refresh schedule');
      return;
    }

    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;

    // If token is already expired or expires in less than 1 minute, refresh immediately
    if (timeUntilExpiry <= 60 * 1000) {
      console.log('⚡ Token expired or expiring soon, refreshing immediately');
      this.refreshToken();
      return;
    }

    // Refresh token 5 minutes before expiration (minimum 1 minute, maximum 24 hours)
    const refreshTime = Math.max(
      60 * 1000, // Minimum 1 minute
      Math.min(
        timeUntilExpiry - 5 * 60 * 1000, // 5 minutes before expiry
        24 * 60 * 60 * 1000 // Maximum 24 hours
      )
    );

    const refreshTimeMinutes = Math.round(refreshTime / 1000 / 60);
    const expiryTimeMinutes = Math.round(timeUntilExpiry / 1000 / 60);

    console.log(`🕐 Token expires at: ${new Date(expiresAt).toLocaleString()}`);
    console.log(`⏰ Token expires in: ${expiryTimeMinutes} minutes`);
    console.log(`🔄 Scheduled token refresh in: ${refreshTimeMinutes} minutes`);

    this.refreshTimer = setTimeout(() => {
      this.refreshToken();
    }, refreshTime);
  }

  /**
   * Refresh the access token using refresh token
   */
  async refreshToken() {
    if (this.isRefreshing) return false;
    if (typeof window === 'undefined') return false;

    this.isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('🔄 Proactively refreshing token...');
      
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken
      });

      const newToken = response.data?.token;
      if (!newToken) {
        throw new Error('No token returned from refresh');
      }

      localStorage.setItem('token', newToken);
      console.log('✅ Token refreshed proactively');

      // Schedule next refresh
      this.scheduleTokenRefresh(newToken);
      
      return true;

    } catch (error) {
      console.error('❌ Proactive token refresh failed:', error);
      
      // Clear tokens and redirect to login
      this.clearTokens();
      window.location.href = '/login';
      
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Check if token is expired or will expire soon
   */
  isTokenExpiringSoon(token) {
    if (typeof window === 'undefined') return false;
    
    const currentToken = token || localStorage.getItem('token');
    if (!currentToken) return true;

    const expiresAt = this.getTokenExpiration(currentToken);
    if (!expiresAt) return true;

    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    
    // Consider token as expiring soon if less than 10 minutes remaining
    return timeUntilExpiry < 10 * 60 * 1000;
  }

  /**
   * Get current token if valid
   */
  getValidToken() {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem('token');
    if (!token) return null;

    if (this.isTokenExpiringSoon(token)) {
      // Token is expiring soon, trigger refresh
      this.refreshToken();
      return token; // Return current token while refresh is in progress
    }

    return token;
  }

  /**
   * Force refresh token now
   */
  async forceRefresh() {
    return this.refreshToken();
  }
}

// Create singleton instance
const tokenManager = new TokenManager();

export default tokenManager;
