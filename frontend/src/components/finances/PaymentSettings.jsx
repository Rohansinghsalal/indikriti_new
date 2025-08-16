'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { CreditCard, DollarSign, Wallet, ChevronsUpDown, AlertCircle, CheckCircle2 } from 'lucide-react';

// Mock payment gateway data
const mockPaymentGateways = [
  {
    id: 'stripe',
    name: 'Stripe',
    enabled: true,
    testMode: true,
    supportedCards: ['visa', 'mastercard', 'amex', 'discover'],
    credentials: {
      publishableKey: 'pk_test_51HdgH2CuJME...',
      secretKey: 'sk_test_51HdgH2CuJME...'
    },
    settings: {
      statementDescriptor: 'My Store',
      captureMethod: 'automatic',
      paymentMethods: ['card', 'apple_pay', 'google_pay']
    }
  },
  {
    id: 'paypal',
    name: 'PayPal',
    enabled: true,
    testMode: true,
    credentials: {
      clientId: 'AeJIH18Qh4...',
      clientSecret: 'ELS8gQJ7T...',
    },
    settings: {
      landingPage: 'login',
      brandName: 'My Store',
      allowBillingAgreements: true
    }
  },
  {
    id: 'square',
    name: 'Square',
    enabled: false,
    testMode: true,
    credentials: {
      accessToken: '',
      applicationId: ''
    },
    settings: {
      locationId: '',
      allowTipping: true
    }
  }
];

// Mock currency settings
const mockCurrencySettings = {
  primaryCurrency: 'USD',
  availableCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'],
  autoConvert: true,
  updateRatesDaily: true,
  markupPercentage: 2,
  roundingMethod: 'up',
  decimalPlaces: 2,
  thousandsSeparator: ',',
  decimalSeparator: '.'
};

// Mock tax settings
const mockTaxSettings = {
  automaticTax: true,
  taxProvider: 'internal',
  defaultTaxRate: 7.5,
  pricesIncludeTax: false,
  taxByLocation: true,
  taxClasses: [
    { id: 'standard', name: 'Standard', rate: 7.5 },
    { id: 'reduced', name: 'Reduced', rate: 3.5 },
    { id: 'zero', name: 'Zero Rate', rate: 0 }
  ],
  taxExemptionEnabled: true
};

const PaymentSettings = () => {
  const [paymentGateways, setPaymentGateways] = useState(mockPaymentGateways);
  const [currencySettings, setCurrencySettings] = useState(mockCurrencySettings);
  const [taxSettings, setTaxSettings] = useState(mockTaxSettings);
  const [activeTab, setActiveTab] = useState('payment-gateways');
  const [activeGateway, setActiveGateway] = useState(paymentGateways[0].id);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleGatewayToggle = (gatewayId, enabled) => {
    const updatedGateways = paymentGateways.map(gateway => {
      if (gateway.id === gatewayId) {
        return { ...gateway, enabled };
      }
      return gateway;
    });
    setPaymentGateways(updatedGateways);
  };
  
  const handleTestModeToggle = (gatewayId, testMode) => {
    const updatedGateways = paymentGateways.map(gateway => {
      if (gateway.id === gatewayId) {
        return { ...gateway, testMode };
      }
      return gateway;
    });
    setPaymentGateways(updatedGateways);
  };
  
  const handleGatewayCredentialChange = (gatewayId, field, value) => {
    const updatedGateways = paymentGateways.map(gateway => {
      if (gateway.id === gatewayId) {
        return { 
          ...gateway, 
          credentials: {
            ...gateway.credentials,
            [field]: value
          }
        };
      }
      return gateway;
    });
    setPaymentGateways(updatedGateways);
  };
  
  const handleGatewaySettingChange = (gatewayId, field, value) => {
    const updatedGateways = paymentGateways.map(gateway => {
      if (gateway.id === gatewayId) {
        return { 
          ...gateway, 
          settings: {
            ...gateway.settings,
            [field]: value
          }
        };
      }
      return gateway;
    });
    setPaymentGateways(updatedGateways);
  };
  
  const handleCurrencySettingChange = (field, value) => {
    setCurrencySettings({
      ...currencySettings,
      [field]: value
    });
  };
  
  const handleTaxSettingChange = (field, value) => {
    setTaxSettings({
      ...taxSettings,
      [field]: value
    });
  };
  
  const handleTaxClassChange = (taxClassId, field, value) => {
    const updatedTaxClasses = taxSettings.taxClasses.map(taxClass => {
      if (taxClass.id === taxClassId) {
        return { ...taxClass, [field]: value };
      }
      return taxClass;
    });
    
    setTaxSettings({
      ...taxSettings,
      taxClasses: updatedTaxClasses
    });
  };
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  const getActiveGateway = () => {
    return paymentGateways.find(gateway => gateway.id === activeGateway);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment Settings</h2>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
      
      {saveSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            Your payment settings have been saved successfully.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="payment-gateways" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="payment-gateways">
            <CreditCard className="mr-2 h-4 w-4" />
            Payment Gateways
          </TabsTrigger>
          <TabsTrigger value="currency">
            <DollarSign className="mr-2 h-4 w-4" />
            Currency
          </TabsTrigger>
          <TabsTrigger value="tax">
            <Wallet className="mr-2 h-4 w-4" />
            Tax
          </TabsTrigger>
        </TabsList>
        
        {/* Payment Gateways Tab */}
        <TabsContent value="payment-gateways" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 space-y-4">
              {paymentGateways.map(gateway => (
                <Card 
                  key={gateway.id} 
                  className={`cursor-pointer ${activeGateway === gateway.id ? 'border-primary' : ''}`}
                  onClick={() => setActiveGateway(gateway.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{gateway.name}</CardTitle>
                      <Switch 
                        checked={gateway.enabled} 
                        onCheckedChange={(checked) => handleGatewayToggle(gateway.id, checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm">
                      <span className={`w-2 h-2 rounded-full mr-2 ${gateway.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      <span>{gateway.enabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="md:col-span-3">
              {getActiveGateway() && (
                <Card>
                  <CardHeader>
                    <CardTitle>{getActiveGateway().name} Settings</CardTitle>
                    <CardDescription>
                      Configure your {getActiveGateway().name} payment gateway settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`${activeGateway}-enabled`}>Enable {getActiveGateway().name}</Label>
                        <Switch 
                          id={`${activeGateway}-enabled`}
                          checked={getActiveGateway().enabled} 
                          onCheckedChange={(checked) => handleGatewayToggle(activeGateway, checked)}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`${activeGateway}-test-mode`}>Test Mode</Label>
                        <Switch 
                          id={`${activeGateway}-test-mode`}
                          checked={getActiveGateway().testMode} 
                          onCheckedChange={(checked) => handleTestModeToggle(activeGateway, checked)}
                        />
                      </div>
                    </div>
                    
                    {getActiveGateway().testMode && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Test Mode Active</AlertTitle>
                        <AlertDescription>
                          {getActiveGateway().name} is in test mode. No real transactions will be processed.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">API Credentials</h3>
                      
                      {/* Stripe Credentials */}
                      {activeGateway === 'stripe' && (
                        <>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label htmlFor="stripe-publishable-key">Publishable Key</Label>
                              <Input 
                                id="stripe-publishable-key"
                                value={getActiveGateway().credentials.publishableKey}
                                onChange={(e) => handleGatewayCredentialChange(activeGateway, 'publishableKey', e.target.value)}
                                placeholder="pk_test_..."
                              />
                            </div>
                            <div>
                              <Label htmlFor="stripe-secret-key">Secret Key</Label>
                              <Input 
                                id="stripe-secret-key"
                                type="password"
                                value={getActiveGateway().credentials.secretKey}
                                onChange={(e) => handleGatewayCredentialChange(activeGateway, 'secretKey', e.target.value)}
                                placeholder="sk_test_..."
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Additional Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="stripe-statement-descriptor">Statement Descriptor</Label>
                                <Input 
                                  id="stripe-statement-descriptor"
                                  value={getActiveGateway().settings.statementDescriptor}
                                  onChange={(e) => handleGatewaySettingChange(activeGateway, 'statementDescriptor', e.target.value)}
                                  placeholder="Your business name"
                                  maxLength={22}
                                />
                                <p className="text-xs text-gray-500 mt-1">Max 22 characters</p>
                              </div>
                              <div>
                                <Label htmlFor="stripe-capture-method">Capture Method</Label>
                                <Select 
                                  value={getActiveGateway().settings.captureMethod}
                                  onValueChange={(value) => handleGatewaySettingChange(activeGateway, 'captureMethod', value)}
                                >
                                  <SelectTrigger id="stripe-capture-method">
                                    <SelectValue placeholder="Select capture method" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="automatic">Automatic</SelectItem>
                                    <SelectItem value="manual">Manual</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* PayPal Credentials */}
                      {activeGateway === 'paypal' && (
                        <>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label htmlFor="paypal-client-id">Client ID</Label>
                              <Input 
                                id="paypal-client-id"
                                value={getActiveGateway().credentials.clientId}
                                onChange={(e) => handleGatewayCredentialChange(activeGateway, 'clientId', e.target.value)}
                                placeholder="Client ID"
                              />
                            </div>
                            <div>
                              <Label htmlFor="paypal-client-secret">Client Secret</Label>
                              <Input 
                                id="paypal-client-secret"
                                type="password"
                                value={getActiveGateway().credentials.clientSecret}
                                onChange={(e) => handleGatewayCredentialChange(activeGateway, 'clientSecret', e.target.value)}
                                placeholder="Client Secret"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Additional Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="paypal-landing-page">Landing Page</Label>
                                <Select 
                                  value={getActiveGateway().settings.landingPage}
                                  onValueChange={(value) => handleGatewaySettingChange(activeGateway, 'landingPage', value)}
                                >
                                  <SelectTrigger id="paypal-landing-page">
                                    <SelectValue placeholder="Select landing page" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="login">Login</SelectItem>
                                    <SelectItem value="billing">Billing</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="paypal-brand-name">Brand Name</Label>
                                <Input 
                                  id="paypal-brand-name"
                                  value={getActiveGateway().settings.brandName}
                                  onChange={(e) => handleGatewaySettingChange(activeGateway, 'brandName', e.target.value)}
                                  placeholder="Your business name"
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="paypal-billing-agreements"
                                checked={getActiveGateway().settings.allowBillingAgreements} 
                                onCheckedChange={(checked) => handleGatewaySettingChange(activeGateway, 'allowBillingAgreements', checked)}
                              />
                              <Label htmlFor="paypal-billing-agreements">Allow Billing Agreements (Subscriptions)</Label>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* Square Credentials */}
                      {activeGateway === 'square' && (
                        <>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label htmlFor="square-access-token">Access Token</Label>
                              <Input 
                                id="square-access-token"
                                type="password"
                                value={getActiveGateway().credentials.accessToken}
                                onChange={(e) => handleGatewayCredentialChange(activeGateway, 'accessToken', e.target.value)}
                                placeholder="Access Token"
                              />
                            </div>
                            <div>
                              <Label htmlFor="square-application-id">Application ID</Label>
                              <Input 
                                id="square-application-id"
                                value={getActiveGateway().credentials.applicationId}
                                onChange={(e) => handleGatewayCredentialChange(activeGateway, 'applicationId', e.target.value)}
                                placeholder="Application ID"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Additional Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="square-location-id">Location ID</Label>
                                <Input 
                                  id="square-location-id"
                                  value={getActiveGateway().settings.locationId}
                                  onChange={(e) => handleGatewaySettingChange(activeGateway, 'locationId', e.target.value)}
                                  placeholder="Location ID"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  id="square-allow-tipping"
                                  checked={getActiveGateway().settings.allowTipping} 
                                  onCheckedChange={(checked) => handleGatewaySettingChange(activeGateway, 'allowTipping', checked)}
                                />
                                <Label htmlFor="square-allow-tipping">Allow Tipping</Label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSaveSettings} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Currency Tab */}
        <TabsContent value="currency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Currency Settings</CardTitle>
              <CardDescription>
                Configure your store's currency settings and display options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="primary-currency">Primary Currency</Label>
                  <Select 
                    value={currencySettings.primaryCurrency}
                    onValueChange={(value) => handleCurrencySettingChange('primaryCurrency', value)}
                  >
                    <SelectTrigger id="primary-currency">
                      <SelectValue placeholder="Select primary currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencySettings.availableCurrencies.map(currency => (
                        <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="auto-convert"
                      checked={currencySettings.autoConvert} 
                      onCheckedChange={(checked) => handleCurrencySettingChange('autoConvert', checked)}
                    />
                    <Label htmlFor="auto-convert">Auto-convert prices to customer's local currency</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="update-rates-daily"
                      checked={currencySettings.updateRatesDaily} 
                      onCheckedChange={(checked) => handleCurrencySettingChange('updateRatesDaily', checked)}
                    />
                    <Label htmlFor="update-rates-daily">Update exchange rates daily</Label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="markup-percentage">Currency Conversion Markup (%)</Label>
                  <Input 
                    id="markup-percentage"
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={currencySettings.markupPercentage}
                    onChange={(e) => handleCurrencySettingChange('markupPercentage', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Add a percentage markup to converted prices</p>
                </div>
                
                <div>
                  <Label htmlFor="rounding-method">Price Rounding Method</Label>
                  <Select 
                    value={currencySettings.roundingMethod}
                    onValueChange={(value) => handleCurrencySettingChange('roundingMethod', value)}
                  >
                    <SelectTrigger id="rounding-method">
                      <SelectValue placeholder="Select rounding method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="up">Round Up</SelectItem>
                      <SelectItem value="down">Round Down</SelectItem>
                      <SelectItem value="nearest">Round to Nearest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="decimal-places">Decimal Places</Label>
                  <Select 
                    value={currencySettings.decimalPlaces.toString()}
                    onValueChange={(value) => handleCurrencySettingChange('decimalPlaces', parseInt(value))}
                  >
                    <SelectTrigger id="decimal-places">
                      <SelectValue placeholder="Select decimal places" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="thousands-separator">Thousands Separator</Label>
                  <Select 
                    value={currencySettings.thousandsSeparator}
                    onValueChange={(value) => handleCurrencySettingChange('thousandsSeparator', value)}
                  >
                    <SelectTrigger id="thousands-separator">
                      <SelectValue placeholder="Select separator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=",">Comma (,)</SelectItem>
                      <SelectItem value=".">Period (.)</SelectItem>
                      <SelectItem value=" ">Space</SelectItem>
                      <SelectItem value="">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="decimal-separator">Decimal Separator</Label>
                  <Select 
                    value={currencySettings.decimalSeparator}
                    onValueChange={(value) => handleCurrencySettingChange('decimalSeparator', value)}
                  >
                    <SelectTrigger id="decimal-separator">
                      <SelectValue placeholder="Select separator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=".">Period (.)</SelectItem>
                      <SelectItem value=",">Comma (,)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Tax Tab */}
        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>
                Configure your store's tax calculation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="automatic-tax"
                    checked={taxSettings.automaticTax} 
                    onCheckedChange={(checked) => handleTaxSettingChange('automaticTax', checked)}
                  />
                  <Label htmlFor="automatic-tax">Enable Automatic Tax Calculation</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="prices-include-tax"
                    checked={taxSettings.pricesIncludeTax} 
                    onCheckedChange={(checked) => handleTaxSettingChange('pricesIncludeTax', checked)}
                  />
                  <Label htmlFor="prices-include-tax">Prices Include Tax</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="tax-provider">Tax Provider</Label>
                  <Select 
                    value={taxSettings.taxProvider}
                    onValueChange={(value) => handleTaxSettingChange('taxProvider', value)}
                  >
                    <SelectTrigger id="tax-provider">
                      <SelectValue placeholder="Select tax provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Internal (Basic)</SelectItem>
                      <SelectItem value="avalara">Avalara</SelectItem>
                      <SelectItem value="taxjar">TaxJar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="default-tax-rate">Default Tax Rate (%)</Label>
                  <Input 
                    id="default-tax-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxSettings.defaultTaxRate}
                    onChange={(e) => handleTaxSettingChange('defaultTaxRate', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="tax-by-location"
                  checked={taxSettings.taxByLocation} 
                  onCheckedChange={(checked) => handleTaxSettingChange('taxByLocation', checked)}
                />
                <Label htmlFor="tax-by-location">Calculate tax based on customer location</Label>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Tax Classes</h3>
                  <Button variant="outline" size="sm">
                    Add Tax Class
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {taxSettings.taxClasses.map(taxClass => (
                    <div key={taxClass.id} className="flex items-center space-x-4">
                      <Input 
                        value={taxClass.name}
                        onChange={(e) => handleTaxClassChange(taxClass.id, 'name', e.target.value)}
                        className="flex-1"
                      />
                      <div className="relative w-24">
                        <Input 
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={taxClass.rate}
                          onChange={(e) => handleTaxClassChange(taxClass.id, 'rate', parseFloat(e.target.value))}
                        />
                        <span className="absolute right-3 top-2.5">%</span>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="tax-exemption"
                  checked={taxSettings.taxExemptionEnabled} 
                  onCheckedChange={(checked) => handleTaxSettingChange('taxExemptionEnabled', checked)}
                />
                <Label htmlFor="tax-exemption">Enable tax exemption for eligible customers</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentSettings;