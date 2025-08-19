import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../common/UI/Button';
import FormError from '../common/Forms/FormError';

const OTPVerification = ({
  onSuccess,
  redirectTo = '/',
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [formError, setFormError] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Get email from location state or session storage
    const emailFromState = location.state?.email;
    const pendingRegistration = sessionStorage.getItem('pendingRegistration');
    
    if (emailFromState) {
      setEmail(emailFromState);
    } else if (pendingRegistration) {
      try {
        const data = JSON.parse(pendingRegistration);
        if (data.email) {
          setEmail(data.email);
        }
      } catch (error) {
        console.error('Error parsing pendingRegistration:', error);
      }
    }
    
    // Focus on first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    
    // Start countdown timer
    startTimer();
    
    return () => {
      // Clear timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [location]);

  const timerRef = useRef(null);

  const startTimer = () => {
    setTimer(60);
    setCanResend(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleChange = (e, index) => {
    const { value } = e.target;
    
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Only take the first character
    setOtp(newOtp);
    
    // Clear form error when user types
    if (formError) setFormError('');
    
    // Auto-focus next input if value is entered
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      
      // Focus on last input
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const isOtpComplete = () => {
    return otp.every(digit => digit !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isOtpComplete()) {
      setFormError('Please enter the complete verification code');
      return;
    }
    
    setIsLoading(true);
    setFormError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, check if OTP is '123456'
      const enteredOtp = otp.join('');
      if (enteredOtp !== '123456') {
        throw new Error('Invalid verification code');
      }
      
      // Get pending registration data
      const pendingRegistration = sessionStorage.getItem('pendingRegistration');
      if (pendingRegistration) {
        try {
          const userData = JSON.parse(pendingRegistration);
          
          // Create verified user
          const verifiedUser = {
            ...userData,
            verified: true,
            token: 'mock-jwt-token'
          };
          
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(verifiedUser));
          
          // Clear pending registration
          sessionStorage.removeItem('pendingRegistration');
        } catch (error) {
          console.error('Error processing registration data:', error);
        }
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect user
      navigate(redirectTo);
    } catch (error) {
      console.error('OTP verification error:', error);
      setFormError(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setIsResending(true);
    setFormError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Restart timer
      startTimer();
    } catch (error) {
      console.error('Resend OTP error:', error);
      setFormError('Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={`otp-verification ${className}`} {...props}>
      <h2 className="otp-verification-title">Verify Your Email</h2>
      <p className="otp-verification-description">
        {email ? (
          <>We've sent a verification code to <strong>{email}</strong>.</>
        ) : (
          <>We've sent a verification code to your email.</>
        )}
      </p>
      
      {formError && (
        <FormError message={formError} />
      )}
      
      <form onSubmit={handleSubmit} className="otp-verification-container">
        <div className="otp-verification-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              ref={(el) => (inputRefs.current[index] = el)}
              className="otp-verification-input"
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="otp-verification-timer">
          {canResend ? (
            <button 
              type="button" 
              className="otp-verification-resend" 
              onClick={handleResendOtp}
              disabled={isResending}
            >
              {isResending ? 'Resending...' : 'Resend Code'}
            </button>
          ) : (
            <p>Resend code in {timer} seconds</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          isLoading={isLoading}
          disabled={isLoading || !isOtpComplete()}
        >
          Verify
        </Button>
      </form>
      
      <div className="otp-verification-help">
        <p>
          Didn't receive the code? Check your spam folder or{' '}
          <button 
            type="button" 
            className="otp-verification-help-link"
            onClick={handleResendOtp}
            disabled={!canResend || isResending}
          >
            request a new one
          </button>
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;