/**
 * Token Management Utility
 * Handles automatic token refresh and expiration management
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface TokenData {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private isRefreshing = false;

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
  setTokens(token: string, refreshToken: string) {
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
  private getTokenExpiration(token: string): number | null {
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
  private scheduleTokenRefresh(token: string) {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const expiresAt = this.getTokenExpiration(token);
    if (!expiresAt) return;

    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    
    // Refresh token 5 minutes before expiration (or immediately if already expired)
    const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000);
    
    console.log(`🕐 Token expires at: ${new Date(expiresAt).toLocaleString()}`);
    console.log(`🔄 Scheduled token refresh in: ${Math.round(refreshTime / 1000 / 60)} minutes`);

    this.refreshTimer = setTimeout(() => {
      this.refreshToken();
    }, refreshTime);
  }

  /**
   * Refresh the access token using refresh token
   */
  private async refreshToken(): Promise<boolean> {
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
  isTokenExpiringSoon(token?: string): boolean {
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
  getValidToken(): string | null {
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
  async forceRefresh(): Promise<boolean> {
    return this.refreshToken();
  }
}

// Create singleton instance
const tokenManager = new TokenManager();

export default tokenManager;
