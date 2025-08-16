import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const AuthFlow = ({ onComplete, onClose }) => {
  const {
    authStep,
    register,
    resendOTP,
    goBack,
    isLoading
  } = useAuth();

  // Provide local setters mapping to global loading to avoid reference errors
  const setIsLoading = () => {};

  // Temporary: disable phone/OTP login and show email/password login instead
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [formData, setFormData] = useState({
    mobile: '',
    otp: '',
    fullName: '',
    email: '',
    referralCode: '',
    instagramId: ''
  });

  const [errors, setErrors] = useState({});
  const [showResendOTP, setShowResendOTP] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);

  // OTP Timer
  useEffect(() => {
    let timer;
    if (authStep === 'otp' && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setShowResendOTP(true);
    }
    return () => clearInterval(timer);
  }, [authStep, otpTimer]);

  // Reset timer when OTP step is entered
  useEffect(() => {
    if (authStep === 'otp') {
      setOtpTimer(30);
      setShowResendOTP(false);
    }
  }, [authStep]);

  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Email/password login handler
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    try {
      const { loginUser } = await import('../../services/api.js');
      const result = await loginUser(loginForm.email, loginForm.password);
      if (result?.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        onComplete?.();
      } else {
        setLoginError('Invalid email or password');
      }
    } catch (err) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleMobileSubmit = async (e) => {
    e.preventDefault();

    if (!validateMobile(formData.mobile)) {
      setErrors({ mobile: 'Please enter a valid 10-digit mobile number starting with 6-9' });
      return;
    }

    setErrors({});
    const result = await checkMobile(formData.mobile);

    if (!result.success) {
      setErrors({ mobile: result.error });
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    if (formData.otp.length < 4) {
      setErrors({ otp: 'Please enter a valid OTP (4-6 digits)' });
      return;
    }

    setErrors({});
    const result = await verifyOTPCode(formData.otp);

    if (result.success) {
      if (!result.isNewUser) {
        onComplete?.();
      }
    } else {
      setErrors({ otp: result.error });
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const result = await register({
      name: formData.fullName,
      email: formData.email,
      referralCode: formData.referralCode,
      instagramId: formData.instagramId
    });

    if (result.success) {
      onComplete?.();
    } else {
      setErrors({ general: result.error });
    }
  };

  const handleResendOTP = async () => {
    const result = await resendOTP();
    if (result.success) {
      setOtpTimer(30);
      setShowResendOTP(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md relative">
        {/* Close button - always visible */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 bg-white text-gray-700 hover:bg-gray-100 p-2 rounded-full shadow-md border"
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-white font-bold text-2xl">I</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Sign in to Indikriti</h1>
          <p className="text-blue-100">Use your email and password to continue</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20">
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                disabled={isLoading}
                required
              />
            </div>

            {loginError && (
              <p className="text-red-500 text-sm">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          {false && (
            <form onSubmit={handleOTPSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Verification Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 4-6 digit OTP"
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl font-mono tracking-widest transition-all ${
                    errors.otp ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-300'
                  }`}
                  value={formData.otp}
                  onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                  maxLength={6}
                  disabled={isLoading}
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.otp}
                  </p>
                )}

                {/* Timer and Resend */}
                <div className="text-center mt-4">
                  {!showResendOTP ? (
                    <p className="text-gray-500 text-sm">
                      Resend code in {otpTimer}s
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-blue-600 font-semibold hover:text-blue-700 transition-colors disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || formData.otp.length < 4}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify & Continue'
                )}
              </button>
            </form>
          )}

          {false && (
            <form onSubmit={handleRegistrationSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-300'
                  }`}
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  disabled={isLoading}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-300'
                  }`}
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter referral code"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
                  value={formData.referralCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, referralCode: e.target.value.toUpperCase() }))}
                  disabled={isLoading}
                />
                <p className="text-sm text-blue-600 mt-2 flex items-center">
                  <span className="mr-1">🎁</span>
                  Get ₹100 bonus with a valid referral code!
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Instagram ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="@your_instagram_handle"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
                  value={formData.instagramId}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagramId: e.target.value }))}
                  disabled={isLoading}
                />
              </div>

              {errors.general && (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.general}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create My Account'
                )}
              </button>
            </form>
          )}

          {/* Back Button */}
          {(authStep === 'otp' || authStep === 'register') && (
            <button
              onClick={goBack}
              disabled={isLoading}
              className="w-full mt-4 text-gray-600 font-medium hover:text-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Go Back
               </button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-blue-100 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default AuthFlow;
