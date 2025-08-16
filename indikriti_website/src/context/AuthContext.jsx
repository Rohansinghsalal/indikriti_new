import { createContext, useContext, useState, useEffect } from 'react';
import {
  checkMobileNumber,
  sendOTP,
  verifyOTP,
  registerUser,
  getWalletBalance
} from '../services/enhancedApi.js';
import { loginUser } from '../services/api.js';
import { useAnalytics } from '../hooks/useAnalytics.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authStep, setAuthStep] = useState('phone'); // phone, otp, register, logged-in
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpId, setOtpId] = useState(null);
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  
  const { trackUserLogin, trackUserRegistration } = useAnalytics();

  useEffect(() => {
    // Check for stored auth token and validate
    const checkAuthStatus = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setAuthStep('logged-in');
          
          // Load wallet data
          if (parsedUser.id) {
            loadWalletData(parsedUser.id);
          }
        } catch (error) {
          console.error('Auth state recovery failed:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setAuthStep('phone');
        }
      } else {
        setAuthStep('phone');
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const loadWalletData = async (userId) => {
    try {
      const walletData = await getWalletBalance(userId);
      setWallet(walletData);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    }
  };

  // Step 1: Check mobile number
  const checkMobile = async (mobile) => {
    try {
      setIsLoading(true);
      setMobileNumber(mobile);
      
      const result = await checkMobileNumber(mobile);
      
      if (result.exists) {
        // User exists, send OTP for login
        const otpResult = await sendOTP(mobile);
        if (otpResult.success) {
          setOtpId(otpResult.otpId);
          setAuthStep('otp');
          return { success: true, userExists: true };
        } else {
          throw new Error('Failed to send OTP');
        }
      } else {
        // New user, send OTP for registration
        const otpResult = await sendOTP(mobile);
        if (otpResult.success) {
          setOtpId(otpResult.otpId);
          setAuthStep('otp');
          return { success: true, userExists: false };
        } else {
          throw new Error('Failed to send OTP');
        }
      }
    } catch (error) {
      console.error('Mobile check error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const verifyOTPCode = async (otp) => {
    try {
      setIsLoading(true);
      
      const result = await verifyOTP(mobileNumber, otp, otpId);
      
      if (result.success) {
        if (result.user) {
          // Existing user login
          setUser(result.user);
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('token', result.token);
          setAuthStep('logged-in');
          
          // Track login
          trackUserLogin({
            id: result.user.id,
            method: 'phone'
          });
          
          // Load wallet data
          if (result.user.id) {
            loadWalletData(result.user.id);
          }
          
          return { success: true, isNewUser: false };
        } else {
          // New user, proceed to registration
          setAuthStep('register');
          return { success: true, isNewUser: true };
        }
      } else {
        return { success: false, error: result.message || 'Invalid OTP' };
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Register new user
  const register = async (userData) => {
    try {
      setIsLoading(true);
      
      const registrationData = {
        mobileNumber,
        ...userData
      };
      
      const result = await registerUser(registrationData);
      
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        setAuthStep('logged-in');
        
        // Track registration
        trackUserRegistration({
          id: result.user.id,
          method: 'phone',
          referralCode: userData.referralCode
        });
        
        // Load wallet data
        if (result.user.id) {
          loadWalletData(result.user.id);
        }
        
        return { success: true };
      } else {
        return { success: false, error: result.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setWallet({ balance: 0, transactions: [] });
    setAuthStep('phone');
    setMobileNumber('');
    setOtpId(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Resend OTP
  const resendOTP = async () => {
    try {
      setIsLoading(true);
      const result = await sendOTP(mobileNumber);
      if (result.success) {
        setOtpId(result.otpId);
        return { success: true };
      } else {
        return { success: false, error: 'Failed to resend OTP' };
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to previous step
  const goBack = () => {
    if (authStep === 'otp') {
      setAuthStep('phone');
      setMobileNumber('');
      setOtpId(null);
    } else if (authStep === 'register') {
      setAuthStep('otp');
    }
  };

  // Update wallet balance (after redemption, etc.)
  const updateWalletBalance = (newBalance) => {
    setWallet(prev => ({
      ...prev,
      balance: newBalance
    }));
    
    // Update user object as well
    if (user) {
      const updatedUser = { ...user, wallet: newBalance };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Refresh wallet data
  const refreshWalletData = async () => {
    if (user?.id) {
      await loadWalletData(user.id);
    }
  };

  const value = {
    // Auth state
    user,
    isLoading,
    authStep,
    mobileNumber,
    
    // Auth actions
    checkMobile,
    verifyOTPCode,
    register,
    logout,
    resendOTP,
    goBack,
    
    // Wallet
    wallet,
    updateWalletBalance,
    refreshWalletData,
    
    // Utilities
    isAuthenticated: authStep === 'logged-in' && !!user,
    isNewUser: authStep === 'register',
    needsOTP: authStep === 'otp',
    needsPhone: authStep === 'phone',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
