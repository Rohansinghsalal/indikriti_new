'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PaymentSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    currency: 'USD',
    currencyPosition: 'left',
    thousandSeparator: ',',
    decimalSeparator: '.',
    numberOfDecimals: 2,
    taxCalculation: 'inclusive',
    defaultTaxRate: 10
  });

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'credit_card',
      name: 'Credit Card',
      enabled: true,
      description: 'Pay securely using your credit card.',
      processingFee: 2.9,
      processingFeeType: 'percentage',
      additionalFee: 0.30,
      additionalFeeType: 'fixed'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      enabled: true,
      description: 'Pay via PayPal; you can pay with your credit card if you don\'t have a PayPal account.',
      processingFee: 3.5,
      processingFeeType: 'percentage',
      additionalFee: 0,
      additionalFeeType: 'fixed'
    },
    {
      id: 'bank_transfer',
      name: 'Direct Bank Transfer',
      enabled: false,
      description: 'Make your payment directly into our bank account. Please use your Order ID as the payment reference.',
      processingFee: 0,
      processingFeeType: 'percentage',
      additionalFee: 0,
      additionalFeeType: 'fixed'
    },
    {
      id: 'cash_on_delivery',
      name: 'Cash on Delivery',
      enabled: false,
      description: 'Pay with cash upon delivery.',
      processingFee: 0,
      processingFeeType: 'percentage',
      additionalFee: 5,
      additionalFeeType: 'fixed'
    }
  ]);

  // Invoice settings state
  const [invoiceSettings, setInvoiceSettings] = useState({
    companyName: 'Your Company Name',
    companyAddress: '123 Business Street, City, Country',
    companyPhone: '+1 (555) 123-4567',
    companyEmail: 'billing@yourcompany.com',
    companyTaxId: 'TAX-ID-12345',
    invoicePrefix: 'INV-',
    invoiceFooterText: 'Thank you for your business!',
    autoGenerateInvoice: true,
    sendInvoiceEmail: true
  });

  // Refund settings state
  const [refundSettings, setRefundSettings] = useState({
    refundPeriod: 30,
    allowPartialRefunds: true,
    requireReason: true,
    requireApproval: true,
    automaticRefundForCancellations: false,
    refundToOriginalPaymentMethod: true,
    refundPolicy: 'We offer a 30-day money-back guarantee for most products. Refunds will be processed to the original payment method.'
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleGeneralSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePaymentMethodToggle = (id) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === id ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  const handlePaymentMethodChange = (id, field, value) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === id ? { ...method, [field]: value } : method
      )
    );
  };

  const handleInvoiceSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInvoiceSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRefundSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRefundSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSuccessMessage('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payment Settings</h1>
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
            {successMessage}
          </div>
        )}
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'general' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('general')}
        >
          General
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'payment_methods' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('payment_methods')}
        >
          Payment Methods
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'invoices' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('invoices')}
        >
          Invoices
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'refunds' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('refunds')}
        >
          Refunds
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* General Settings */}
        {activeTab === 'general' && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">General Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={generalSettings.currency}
                  onChange={handleGeneralSettingsChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="JPY">Japanese Yen (JPY)</option>
                  <option value="CAD">Canadian Dollar (CAD)</option>
                  <option value="AUD">Australian Dollar (AUD)</option>
                  <option value="INR">Indian Rupee (INR)</option>
                </select>
              </div>

              <div>
                <label htmlFor="currencyPosition" className="block text-sm font-medium text-gray-700 mb-1">
                  Currency Position
                </label>
                <select
                  id="currencyPosition"
                  name="currencyPosition"
                  value={generalSettings.currencyPosition}
                  onChange={handleGeneralSettingsChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="left">Left ($99.99)</option>
                  <option value="right">Right (99.99$)</option>
                  <option value="left_space">Left with space ($ 99.99)</option>
                  <option value="right_space">Right with space (99.99 $)</option>
                </select>
              </div>

              <div>
                <label htmlFor="thousandSeparator" className="block text-sm font-medium text-gray-700 mb-1">
                  Thousand Separator
                </label>
                <input
                  type="text"
                  id="thousandSeparator"
                  name="thousandSeparator"
                  value={generalSettings.thousandSeparator}
                  onChange={handleGeneralSettingsChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  maxLength="1"
                />
              </div>

              <div>
                <label htmlFor="decimalSeparator" className="block text-sm font-medium text-gray-700 mb-1">
                  Decimal Separator
                </label>
                <input
                  type="text"
                  id="decimalSeparator"
                  name="decimalSeparator"
                  value={generalSettings.decimalSeparator}
                  onChange={handleGeneralSettingsChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  maxLength="1"
                />
              </div>

              <div>
                <label htmlFor="numberOfDecimals" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Decimals
                </label>
                <input
                  type="number"
                  id="numberOfDecimals"
                  name="numberOfDecimals"
                  value={generalSettings.numberOfDecimals}
                  onChange={handleGeneralSettingsChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min="0"
                  max="4"
                />
              </div>

              <div>
                <label htmlFor="taxCalculation" className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Calculation
                </label>
                <select
                  id="taxCalculation"
                  name="taxCalculation"
                  value={generalSettings.taxCalculation}
                  onChange={handleGeneralSettingsChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="inclusive">Inclusive of tax</option>
                  <option value="exclusive">Exclusive of tax</option>
                </select>
              </div>

              <div>
                <label htmlFor="defaultTaxRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Tax Rate (%)
                </label>
                <input
                  type="number"
                  id="defaultTaxRate"
                  name="defaultTaxRate"
                  value={generalSettings.defaultTaxRate}
                  onChange={handleGeneralSettingsChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Payment Methods */}
        {activeTab === 'payment_methods' && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
            
            <div className="space-y-6">
              {paymentMethods.map((method) => (
                <div key={method.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`enable-${method.id}`}
                        checked={method.enabled}
                        onChange={() => handlePaymentMethodToggle(method.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`enable-${method.id}`} className="ml-2 block text-lg font-medium text-gray-900">
                        {method.name}
                      </label>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${method.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {method.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  {method.enabled && (
                    <div className="space-y-4 mt-4 pl-6 border-l-2 border-gray-200">
                      <div>
                        <label htmlFor={`description-${method.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id={`description-${method.id}`}
                          value={method.description}
                          onChange={(e) => handlePaymentMethodChange(method.id, 'description', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          rows="2"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`processingFee-${method.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Processing Fee
                          </label>
                          <div className="flex">
                            <input
                              type="number"
                              id={`processingFee-${method.id}`}
                              value={method.processingFee}
                              onChange={(e) => handlePaymentMethodChange(method.id, 'processingFee', parseFloat(e.target.value))}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              min="0"
                              step="0.01"
                            />
                            <select
                              value={method.processingFeeType}
                              onChange={(e) => handlePaymentMethodChange(method.id, 'processingFeeType', e.target.value)}
                              className="block px-3 py-2 border border-gray-300 border-l-0 rounded-r-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="percentage">%</option>
                              <option value="fixed">Fixed</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label htmlFor={`additionalFee-${method.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Fee
                          </label>
                          <div className="flex">
                            <input
                              type="number"
                              id={`additionalFee-${method.id}`}
                              value={method.additionalFee}
                              onChange={(e) => handlePaymentMethodChange(method.id, 'additionalFee', parseFloat(e.target.value))}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              min="0"
                              step="0.01"
                            />
                            <select
                              value={method.additionalFeeType}
                              onChange={(e) => handlePaymentMethodChange(method.id, 'additionalFeeType', e.target.value)}
                              className="block px-3 py-2 border border-gray-300 border-l-0 rounded-r-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="fixed">Fixed</option>
                              <option value="percentage">%</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {method.id === 'credit_card' && (
                        <div className="mt-4">
                          <Button variant="outline" size="sm">
                            Configure Payment Gateway
                          </Button>
                        </div>
                      )}

                      {method.id === 'paypal' && (
                        <div className="mt-4">
                          <Button variant="outline" size="sm">
                            Connect PayPal Account
                          </Button>
                        </div>
                      )}

                      {method.id === 'bank_transfer' && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Bank Account Details
                            </label>
                            <textarea
                              value="Bank Name: Your Bank\nAccount Name: Your Company\nAccount Number: 123456789\nRouting Number: 987654321\nSwift Code: ABCDEF12"
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              rows="5"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-4">
                <Button variant="outline">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Custom Payment Method
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Invoice Settings */}
        {activeTab === 'invoices' && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Invoice Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={invoiceSettings.companyName}
                  onChange={handleInvoiceSettingsChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="companyTaxId" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Tax ID / VAT Number
                </label>
                <input
                  type="text"
                  id="companyTaxId"
                  name="companyTaxId"
                  value={invoiceSettings.companyTaxId}
                  onChange={handleInvoiceSettingsChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Address
                </label>
                <textarea
                  id="companyAddress"
                  name="companyAddress"
                  value={invoiceSettings.companyAddress}
                  onChange={handleInvoiceSettingsChange}
                  rows="2"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Phone
                </label>
                <input
                  type="text"
                  id="companyPhone"
                  name="companyPhone"
                  value={invoiceSettings.companyPhone}
                  onChange={handleInvoiceSettingsChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Email
                </label>
                <input
                  type="email"
                  id="companyEmail"
                  name="companyEmail"
                  value={invoiceSettings.companyEmail}
                  onChange={handleInvoiceSettingsChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="invoicePrefix" className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number Prefix
                </label>
                <input
                  type="text"
                  id="invoicePrefix"
                  name="invoicePrefix"
                  value={invoiceSettings.invoicePrefix}
                  onChange={handleInvoiceSettingsChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="invoiceFooterText" className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Footer Text
                </label>
                <textarea
                  id="invoiceFooterText"
                  name="invoiceFooterText"
                  value={invoiceSettings.invoiceFooterText}
                  onChange={handleInvoiceSettingsChange}
                  rows="2"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="autoGenerateInvoice"
                  name="autoGenerateInvoice"
                  type="checkbox"
                  checked={invoiceSettings.autoGenerateInvoice}
                  onChange={handleInvoiceSettingsChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoGenerateInvoice" className="ml-2 block text-sm text-gray-900">
                  Automatically generate invoice for new orders
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="sendInvoiceEmail"
                  name="sendInvoiceEmail"
                  type="checkbox"
                  checked={invoiceSettings.sendInvoiceEmail}
                  onChange={handleInvoiceSettingsChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sendInvoiceEmail" className="ml-2 block text-sm text-gray-900">
                  Send invoice via email
                </label>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Preview Invoice Template
              </Button>
            </div>
          </Card>
        )}

        {/* Refund Settings */}
        {activeTab === 'refunds' && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Refund Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="refundPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Period (days)
                </label>
                <input
                  type="number"
                  id="refundPeriod"
                  name="refundPeriod"
                  value={refundSettings.refundPeriod}
                  onChange={handleRefundSettingsChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min="0"
                />
                <p className="mt-1 text-xs text-gray-500">Maximum number of days after purchase that a customer can request a refund. Set to 0 for no refunds.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="allowPartialRefunds"
                    name="allowPartialRefunds"
                    type="checkbox"
                    checked={refundSettings.allowPartialRefunds}
                    onChange={handleRefundSettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowPartialRefunds" className="ml-2 block text-sm text-gray-900">
                    Allow partial refunds
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="requireReason"
                    name="requireReason"
                    type="checkbox"
                    checked={refundSettings.requireReason}
                    onChange={handleRefundSettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireReason" className="ml-2 block text-sm text-gray-900">
                    Require reason for refund
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="requireApproval"
                    name="requireApproval"
                    type="checkbox"
                    checked={refundSettings.requireApproval}
                    onChange={handleRefundSettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireApproval" className="ml-2 block text-sm text-gray-900">
                    Require admin approval for refunds
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="automaticRefundForCancellations"
                    name="automaticRefundForCancellations"
                    type="checkbox"
                    checked={refundSettings.automaticRefundForCancellations}
                    onChange={handleRefundSettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="automaticRefundForCancellations" className="ml-2 block text-sm text-gray-900">
                    Automatic refund for order cancellations
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="refundToOriginalPaymentMethod"
                    name="refundToOriginalPaymentMethod"
                    type="checkbox"
                    checked={refundSettings.refundToOriginalPaymentMethod}
                    onChange={handleRefundSettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="refundToOriginalPaymentMethod" className="ml-2 block text-sm text-gray-900">
                    Refund to original payment method only
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="refundPolicy" className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Policy
                </label>
                <textarea
                  id="refundPolicy"
                  name="refundPolicy"
                  value={refundSettings.refundPolicy}
                  onChange={handleRefundSettingsChange}
                  rows="4"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">This policy will be displayed to customers during the checkout process and on the refund request page.</p>
              </div>
            </div>
          </Card>
        )}

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}