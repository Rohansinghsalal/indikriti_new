'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { Alert } from '@/components/ui/Alert';

const RefundForm = ({ transaction, maxAmount, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: maxAmount,
    reason: '',
    notes: '',
    refundMethod: 'original_payment_method'
  });
  
  const [errors, setErrors] = useState({});
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (formData.amount > maxAmount) {
      newErrors.amount = `Amount cannot exceed ${maxAmount}`;
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    
    if (!formData.refundMethod) {
      newErrors.refundMethod = 'Refund method is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Generate a unique ID for the refund
      const refundId = `ref-${Date.now().toString(36)}`;
      
      // Create refund data
      const refundData = {
        id: refundId,
        transactionId: transaction.id,
        amount: parseFloat(formData.amount),
        reason: formData.reason,
        notes: formData.notes,
        refundMethod: formData.refundMethod,
        status: 'processing',
        date: new Date().toISOString(),
        processedBy: 'Admin User' // In a real app, this would be the current user
      };
      
      onSubmit(refundData);
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <Alert variant="info">
          <p>Transaction: {transaction?.id}</p>
          <p>Original Amount: {formatCurrency(transaction?.amount || 0)}</p>
          <p>Maximum Refundable: {formatCurrency(maxAmount)}</p>
        </Alert>
      </div>
      
      <div>
        <Label htmlFor="amount">
          Refund Amount <span className="text-red-500">*</span>
        </Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          max={maxAmount}
          value={formData.amount}
          onChange={handleInputChange}
          className={errors.amount ? 'border-red-500' : ''}
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="reason">
          Reason for Refund <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.reason} 
          onValueChange={(value) => handleSelectChange('reason', value)}
        >
          <SelectTrigger id="reason" className={errors.reason ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer_request">Customer Request</SelectItem>
            <SelectItem value="product_issue">Product Issue</SelectItem>
            <SelectItem value="shipping_delay">Shipping Delay</SelectItem>
            <SelectItem value="wrong_item">Wrong Item Received</SelectItem>
            <SelectItem value="damaged_item">Damaged Item</SelectItem>
            <SelectItem value="order_canceled">Order Canceled</SelectItem>
            <SelectItem value="duplicate_charge">Duplicate Charge</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.reason && (
          <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Enter any additional details about this refund"
          value={formData.notes}
          onChange={handleInputChange}
        />
      </div>
      
      <div>
        <Label htmlFor="refundMethod">
          Refund Method <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.refundMethod} 
          onValueChange={(value) => handleSelectChange('refundMethod', value)}
        >
          <SelectTrigger id="refundMethod" className={errors.refundMethod ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select refund method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="original_payment_method">Original Payment Method</SelectItem>
            <SelectItem value="store_credit">Store Credit</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
        {errors.refundMethod && (
          <p className="text-red-500 text-sm mt-1">{errors.refundMethod}</p>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Process Refund
        </Button>
      </div>
    </form>
  );
};

export default RefundForm;