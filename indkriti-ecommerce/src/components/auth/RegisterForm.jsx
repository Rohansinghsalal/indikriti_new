import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../common/Forms/FormField';
import Button from '../common/UI/Button';
import FormError from '../common/Forms/FormError';
import SocialLogin from './SocialLogin';

const RegisterForm = ({
  onSuccess,
  redirectTo = '/verify-otp',
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setFormError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const mockUser = {
        id: '123',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        needsVerification: true
      };
      
      // Store registration data temporarily
      sessionStorage.setItem('pendingRegistration', JSON.stringify(mockUser));
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(mockUser);
      }
      
      // Redirect to OTP verification
      navigate(redirectTo, { 
        state: { email: formData.email } 
      });
    } catch (error) {
      console.error('Registration error:', error);
      setFormError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`register-form ${className}`} {...props}>
      <h2 className="register-form-title">Create Account</h2>
      
      {formError && (
        <FormError message={formError} />
      )}
      
      <form onSubmit={handleSubmit} className="register-form-container">
        <div className="register-form-name-row">
          <FormField
            type="text"
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            error={errors.firstName}
            required
          />
          
          <FormField
            type="text"
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            error={errors.lastName}
            required
          />
        </div>
        
        <FormField
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={errors.email}
          required
        />
        
        <FormField
          type="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          error={errors.password}
          helperText="Password must be at least 8 characters and include uppercase, lowercase, and numbers"
          required
        />
        
        <FormField
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
          required
        />
        
        <FormField
          type="checkbox"
          name="agreeTerms"
          label={<>
            I agree to the <Link to="/terms" className="register-form-terms-link">Terms of Service</Link> and <Link to="/privacy" className="register-form-privacy-link">Privacy Policy</Link>
          </>}
          checked={formData.agreeTerms}
          onChange={handleChange}
          error={errors.agreeTerms}
        />
        
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          isLoading={isLoading}
          disabled={isLoading}
        >
          Create Account
        </Button>
      </form>
      
      <div className="register-form-divider">
        <span>OR</span>
      </div>
      
      <SocialLogin />
      
      <div className="register-form-login">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="register-form-login-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;