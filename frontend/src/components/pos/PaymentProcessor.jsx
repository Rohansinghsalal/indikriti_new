'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CardContent } from '@/components/ui/CardContent';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import Alert from '@/components/ui/Alert';
import { AlertDescription } from '@/components/ui/AlertDescription';
import { Separator } from '@/components/ui/Separator';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { AlertCircle, CreditCard, DollarSign, Wallet, Smartphone, Gift, Receipt, ArrowRight } from 'lucide-react';

// Import payment methods component
import PaymentMethods from './PaymentMethods';

const PaymentProcessor = ({ totals, onProcessPayment, isProcessing = false, isOffline = false }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cashAmount, setCashAmount] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const [giftCardCode, setGiftCardCode] = useState('');
  const [walletAmount, setWalletAmount] = useState('');
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Calculate change for cash payments
  const calculateChange = () => {
    if (!cashAmount || isNaN(parseFloat(cashAmount))) return 0;
    const change = parseFloat(cashAmount) - totals.total;
    return Math.max(0, change);
  };
  
  // Check if payment can be processed
  const canProcessPayment = () => {
    switch (paymentMethod) {
      case 'cash':
        return cashAmount && parseFloat(cashAmount) >= totals.total;
      case 'credit_card':
      case 'debit_card':
        return cardDetails.number && cardDetails.name && cardDetails.expiry && cardDetails.cvc;
      case 'gift_card':
        return giftCardCode.length >= 8;
      case 'mobile_payment':
        return true; // Mobile payment is handled externally
      case 'store_credit':
        return walletAmount && parseFloat(walletAmount) >= totals.total;
      default:
        return false;
    }
  };
  
  // Handle card details change
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle payment submission
  const handleSubmitPayment = () => {
    // Create payment details object based on method
    const paymentDetails = {
      method: paymentMethod,
      amount: totals.total
    };
    
    // Add method-specific details
    switch (paymentMethod) {
      case 'cash':
        paymentDetails.cashReceived = parseFloat(cashAmount);
        paymentDetails.change = calculateChange();
        break;
      case 'credit_card':
      case 'debit_card':
        paymentDetails.cardDetails = {
          ...cardDetails,
          number: `**** **** **** ${cardDetails.number.slice(-4)}` // Mask card number for security
        };
        break;
      case 'gift_card':
        paymentDetails.giftCardCode = giftCardCode;
        break;
      case 'store_credit':
        paymentDetails.walletAmount = parseFloat(walletAmount);
        break;
      default:
        break;
    }
    
    // Process payment
    onProcessPayment(paymentDetails);
  };
  
  // Quick cash amount buttons
  const quickCashAmounts = [totals.total, 20, 50, 100];
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Payment</h2>
        <p className="text-gray-500">Select a payment method to complete the transaction</p>
      </div>
      
      {isOffline && paymentMethod === 'credit_card' && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are currently offline. Credit card processing may not work. Consider using cash or store credit.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6 h-full">
              <Tabs defaultValue="credit_card" onValueChange={setPaymentMethod} className="h-full flex flex-col">
                <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-6">
                  <TabsTrigger value="credit_card">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Card
                  </TabsTrigger>
                  <TabsTrigger value="cash">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Cash
                  </TabsTrigger>
                  <TabsTrigger value="mobile_payment">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Mobile
                  </TabsTrigger>
                  <TabsTrigger value="gift_card">
                    <Gift className="h-4 w-4 mr-2" />
                    Gift Card
                  </TabsTrigger>
                  <TabsTrigger value="store_credit">
                    <Wallet className="h-4 w-4 mr-2" />
                    Store Credit
                  </TabsTrigger>
                </TabsList>
                
                <ScrollArea className="flex-1">
                  <TabsContent value="credit_card" className="m-0">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          name="number"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={handleCardChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input
                          id="card-name"
                          name="name"
                          placeholder="John Doe"
                          value={cardDetails.name}
                          onChange={handleCardChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="card-expiry">Expiry Date</Label>
                          <Input
                            id="card-expiry"
                            name="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={handleCardChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="card-cvc">CVC</Label>
                          <Input
                            id="card-cvc"
                            name="cvc"
                            placeholder="123"
                            value={cardDetails.cvc}
                            onChange={handleCardChange}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <PaymentMethods />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="cash" className="m-0">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="cash-amount">Cash Amount</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            id="cash-amount"
                            type="number"
                            min={totals.total}
                            step="0.01"
                            className="pl-8"
                            placeholder="0.00"
                            value={cashAmount}
                            onChange={(e) => setCashAmount(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {quickCashAmounts.map((amount, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => setCashAmount(amount.toFixed(2))}
                          >
                            {formatCurrency(amount)}
                          </Button>
                        ))}
                      </div>
                      
                      {cashAmount && !isNaN(parseFloat(cashAmount)) && (
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Total Due:</span>
                            <span>{formatCurrency(totals.total)}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Cash Received:</span>
                            <span>{formatCurrency(parseFloat(cashAmount) || 0)}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-medium">
                            <span>Change Due:</span>
                            <span>{formatCurrency(calculateChange())}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="mobile_payment" className="m-0">
                    <div className="text-center space-y-4">
                      <div className="bg-gray-100 p-8 rounded-md inline-block mx-auto">
                        <Receipt className="h-24 w-24 mx-auto text-gray-500" />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Mobile Payment</h3>
                        <p className="text-gray-500">
                          Show this screen to the customer and ask them to complete the payment on their mobile device.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-2">{formatCurrency(totals.total)}</div>
                          <div className="text-sm text-gray-500">Total Amount Due</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="gift_card" className="m-0">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="gift-card-code">Gift Card Code</Label>
                        <Input
                          id="gift-card-code"
                          placeholder="Enter gift card code"
                          value={giftCardCode}
                          onChange={(e) => setGiftCardCode(e.target.value)}
                        />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled={giftCardCode.length < 8}
                        onClick={() => {
                          // In a real app, this would verify the gift card balance
                          // For this demo, we'll just assume it's valid
                        }}
                      >
                        Check Balance
                      </Button>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Gift Card Balance:</span>
                          <span>{formatCurrency(giftCardCode.length >= 8 ? 100 : 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Total Due:</span>
                          <span>{formatCurrency(totals.total)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                          <span>Remaining Balance:</span>
                          <span>
                            {giftCardCode.length >= 8 
                              ? formatCurrency(Math.max(0, 100 - totals.total))
                              : formatCurrency(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="store_credit" className="m-0">
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Available Store Credit:</span>
                          <span>{formatCurrency(200)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Total Due:</span>
                          <span>{formatCurrency(totals.total)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="wallet-amount">Amount to Use</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            id="wallet-amount"
                            type="number"
                            min={0}
                            max={Math.min(200, totals.total)}
                            step="0.01"
                            className="pl-8"
                            placeholder="0.00"
                            value={walletAmount}
                            onChange={(e) => setWalletAmount(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setWalletAmount(Math.min(200, totals.total).toFixed(2))}
                      >
                        Use Maximum Available
                      </Button>
                      
                      {walletAmount && !isNaN(parseFloat(walletAmount)) && (
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Store Credit Used:</span>
                            <span>{formatCurrency(parseFloat(walletAmount) || 0)}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Remaining Store Credit:</span>
                            <span>{formatCurrency(Math.max(0, 200 - parseFloat(walletAmount)))}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-medium">
                            <span>Additional Payment Needed:</span>
                            <span>
                              {formatCurrency(Math.max(0, totals.total - parseFloat(walletAmount)))}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardContent className="p-6 h-full flex flex-col">
              <h3 className="font-medium mb-4">Order Summary</h3>
              
              <div className="space-y-2 flex-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatCurrency(totals.tax)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(totals.total)}</span>
                </div>
              </div>
              
              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={handleSubmitPayment}
                disabled={!canProcessPayment() || isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Complete Payment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessor;