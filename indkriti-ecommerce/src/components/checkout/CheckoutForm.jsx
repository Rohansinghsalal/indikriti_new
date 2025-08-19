import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * CheckoutForm component for collecting customer information during checkout
 */
const CheckoutForm = ({
  onSubmit,
  initialValues = {},
  showShippingAddress = true,
  showBillingAddress = true,
  allowDifferentBillingAddress = true,
  requirePhone = true,
  requireEmail = true,
  submitButtonText = 'Continue to Payment',
  loading = false,
}) => {
  // Default form values
  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    shippingAddress: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
    },
    billingAddress: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
    },
    useSameAddressForBilling: true,
    ...initialValues,
  };

  // Form state
  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields (shipping and billing address)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  // Handle field blur for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    validateField(name, formData[name]);
  };

  // Validate a single field
  const validateField = (name, value) => {
    let error = '';
    
    // Basic validation rules
    if (name === 'firstName' && !value.trim()) {
      error = 'First name is required';
    } else if (name === 'lastName' && !value.trim()) {
      error = 'Last name is required';
    } else if (name === 'email' && requireEmail) {
      if (!value.trim()) {
        error = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(value)) {
        error = 'Please enter a valid email address';
      }
    } else if (name === 'phone' && requirePhone) {
      if (!value.trim()) {
        error = 'Phone number is required';
      } else if (!/^[\d\s\-+()]+$/.test(value)) {
        error = 'Please enter a valid phone number';
      }
    }
    
    // Update errors state
    setErrors({
      ...errors,
      [name]: error,
    });
    
    return error === '';
  };

  // Validate address fields
  const validateAddress = (addressType) => {
    const address = formData[addressType];
    const newErrors = { ...errors };
    let isValid = true;
    
    // Required address fields
    if (!address.address1.trim()) {
      newErrors[`${addressType}.address1`] = 'Address is required';
      isValid = false;
    }
    
    if (!address.city.trim()) {
      newErrors[`${addressType}.city`] = 'City is required';
      isValid = false;
    }
    
    if (!address.state.trim()) {
      newErrors[`${addressType}.state`] = 'State is required';
      isValid = false;
    }
    
    if (!address.postalCode.trim()) {
      newErrors[`${addressType}.postalCode`] = 'Postal code is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Validate all form fields
  const validateForm = () => {
    let isValid = true;
    
    // Validate personal info
    if (!validateField('firstName', formData.firstName)) isValid = false;
    if (!validateField('lastName', formData.lastName)) isValid = false;
    if (requireEmail && !validateField('email', formData.email)) isValid = false;
    if (requirePhone && !validateField('phone', formData.phone)) isValid = false;
    
    // Validate shipping address if shown
    if (showShippingAddress && !validateAddress('shippingAddress')) isValid = false;
    
    // Validate billing address if shown and different from shipping
    if (showBillingAddress && !formData.useSameAddressForBilling && !validateAddress('billingAddress')) {
      isValid = false;
    }
    
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    const allFields = ['firstName', 'lastName', 'email', 'phone'];
    const touchedFields = allFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(touchedFields);
    
    // Validate form
    if (validateForm()) {
      // If using same address for billing, copy shipping address
      const submissionData = { ...formData };
      if (formData.useSameAddressForBilling) {
        submissionData.billingAddress = { ...formData.shippingAddress };
      }
      
      // Submit form data
      onSubmit(submissionData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              disabled={loading}
              required
            />
            {errors.firstName && touched.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          
          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              disabled={loading}
              required
            />
            {errors.lastName && touched.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
          
          {/* Email */}
          {requireEmail && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                disabled={loading}
                required
              />
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          )}
          
          {/* Phone */}
          {requirePhone && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                disabled={loading}
                required
              />
              {errors.phone && touched.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Shipping Address */}
      {showShippingAddress && (
        <div>
          <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
          <div className="space-y-4">
            {/* Address Line 1 */}
            <div>
              <label htmlFor="shippingAddress.address1" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1 *
              </label>
              <input
                type="text"
                id="shippingAddress.address1"
                name="shippingAddress.address1"
                value={formData.shippingAddress.address1}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors['shippingAddress.address1'] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                disabled={loading}
                required
              />
              {errors['shippingAddress.address1'] && (
                <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.address1']}</p>
              )}
            </div>
            
            {/* Address Line 2 */}
            <div>
              <label htmlFor="shippingAddress.address2" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                id="shippingAddress.address2"
                name="shippingAddress.address2"
                value={formData.shippingAddress.address2}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            
            {/* City, State, Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="shippingAddress.city" className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="shippingAddress.city"
                  name="shippingAddress.city"
                  value={formData.shippingAddress.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors['shippingAddress.city'] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  disabled={loading}
                  required
                />
                {errors['shippingAddress.city'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.city']}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="shippingAddress.state" className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province *
                </label>
                <input
                  type="text"
                  id="shippingAddress.state"
                  name="shippingAddress.state"
                  value={formData.shippingAddress.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors['shippingAddress.state'] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  disabled={loading}
                  required
                />
                {errors['shippingAddress.state'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.state']}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="shippingAddress.postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  id="shippingAddress.postalCode"
                  name="shippingAddress.postalCode"
                  value={formData.shippingAddress.postalCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors['shippingAddress.postalCode'] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  disabled={loading}
                  required
                />
                {errors['shippingAddress.postalCode'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.postalCode']}</p>
                )}
              </div>
            </div>
            
            {/* Country */}
            <div>
              <label htmlFor="shippingAddress.country" className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                id="shippingAddress.country"
                name="shippingAddress.country"
                value={formData.shippingAddress.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                required
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
                {/* Add more countries as needed */}
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Billing Address */}
      {showBillingAddress && (
        <div>
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-medium">Billing Address</h3>
            {allowDifferentBillingAddress && (
              <div className="ml-auto flex items-center">
                <input
                  type="checkbox"
                  id="useSameAddressForBilling"
                  name="useSameAddressForBilling"
                  checked={formData.useSameAddressForBilling}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="useSameAddressForBilling" className="ml-2 text-sm text-gray-700">
                  Same as shipping address
                </label>
              </div>
            )}
          </div>
          
          {/* Show billing address form if not using same as shipping */}
          {!formData.useSameAddressForBilling && (
            <div className="space-y-4">
              {/* Address Line 1 */}
              <div>
                <label htmlFor="billingAddress.address1" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  id="billingAddress.address1"
                  name="billingAddress.address1"
                  value={formData.billingAddress.address1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors['billingAddress.address1'] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  disabled={loading}
                  required
                />
                {errors['billingAddress.address1'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['billingAddress.address1']}</p>
                )}
              </div>
              
              {/* Address Line 2 */}
              <div>
                <label htmlFor="billingAddress.address2" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  id="billingAddress.address2"
                  name="billingAddress.address2"
                  value={formData.billingAddress.address2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
              
              {/* City, State, Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="billingAddress.city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="billingAddress.city"
                    name="billingAddress.city"
                    value={formData.billingAddress.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors['billingAddress.city'] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    disabled={loading}
                    required
                  />
                  {errors['billingAddress.city'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['billingAddress.city']}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="billingAddress.state" className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    id="billingAddress.state"
                    name="billingAddress.state"
                    value={formData.billingAddress.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors['billingAddress.state'] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    disabled={loading}
                    required
                  />
                  {errors['billingAddress.state'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['billingAddress.state']}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="billingAddress.postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="billingAddress.postalCode"
                    name="billingAddress.postalCode"
                    value={formData.billingAddress.postalCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors['billingAddress.postalCode'] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    disabled={loading}
                    required
                  />
                  {errors['billingAddress.postalCode'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['billingAddress.postalCode']}</p>
                  )}
                </div>
              </div>
              
              {/* Country */}
              <div>
                <label htmlFor="billingAddress.country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <select
                  id="billingAddress.country"
                  name="billingAddress.country"
                  value={formData.billingAddress.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  required
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  {/* Add more countries as needed */}
                </select>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : submitButtonText}
        </button>
      </div>
    </form>
  );
};

CheckoutForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  showShippingAddress: PropTypes.bool,
  showBillingAddress: PropTypes.bool,
  allowDifferentBillingAddress: PropTypes.bool,
  requirePhone: PropTypes.bool,
  requireEmail: PropTypes.bool,
  submitButtonText: PropTypes.string,
  loading: PropTypes.bool,
};

export default CheckoutForm;