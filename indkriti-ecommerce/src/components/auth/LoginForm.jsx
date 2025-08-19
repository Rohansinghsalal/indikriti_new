import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../common/Forms/FormField';
import Button from '../common/UI/Button';
import FormError from '../common/Forms/FormError';
import SocialLogin from './SocialLogin';

const LoginForm = ({
  onSuccess,
  redirectTo = '/',
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      
      // Mock successful login
      const mockUser = {
        id: '123',
        name: 'John Doe',
        email: formData.email,
        token: 'mock-jwt-token'
      };
      
      // Store user data in localStorage or context
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(mockUser);
      }
      
      // Redirect user
      navigate(redirectTo);
    } catch (error) {
      console.error('Login error:', error);
      setFormError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-form ${className}`} {...props}>
      <h2 className="login-form-title">Sign In</h2>
      
      {formError && (
        <FormError message={formError} />
      )}
      
      <form onSubmit={handleSubmit} className="login-form-container">
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
          placeholder="Enter your password"
          error={errors.password}
          required
        />
        
        <div className="login-form-options">
          <FormField
            type="checkbox"
            name="rememberMe"
            label="Remember me"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          
          <Link to="/forgot-password" className="login-form-forgot-link">
            Forgot password?
          </Link>
        </div>
        
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          isLoading={isLoading}
          disabled={isLoading}
        >
          Sign In
        </Button>
      </form>
      
      <div className="login-form-divider">
        <span>OR</span>
      </div>
      
      <SocialLogin />
      
      <div className="login-form-signup">
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="login-form-signup-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;