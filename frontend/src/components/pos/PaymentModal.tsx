'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import { Badge } from '@/components/ui/Badge';
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Plus, 
  Trash2,
  Receipt,
  Calculator
} from 'lucide-react';
import { api } from '@/utils/api';
import { toast } from 'sonner';

interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  type: 'cash' | 'card' | 'digital' | 'bank_transfer' | 'other';
  requires_reference: boolean;
}

interface Payment {
  id: string;
  payment_method_id: number;
  payment_method_name: string;
  amount: number;
  reference_number?: string;
}

interface PaymentModalProps {
  total: number;
  onPayment: (paymentData: any) => void;
  onClose: () => void;
  isProcessing: boolean;
}

export default function PaymentModal({ total, onPayment, onClose, isProcessing }: PaymentModalProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>(total.toString());
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [printReceipt, setPrintReceipt] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await api.pos.getPaymentMethods();
      if (response.success) {
        setPaymentMethods(response.data || []);
        // Auto-select cash as default
        const cashMethod = response.data.find((method: PaymentMethod) => method.code === 'CASH');
        if (cashMethod) {
          setSelectedMethodId(cashMethod.id);
        }
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to fetch payment methods');
    } finally {
      setLoading(false);
    }
  };

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = total - totalPaid;
  const changeAmount = totalPaid > total ? totalPaid - total : 0;

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'digital':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const addPayment = () => {
    if (!selectedMethodId || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error('Please select a payment method and enter a valid amount');
      return;
    }

    const selectedMethod = paymentMethods.find(method => method.id === selectedMethodId);
    if (!selectedMethod) {
      toast.error('Invalid payment method selected');
      return;
    }

    if (selectedMethod.requires_reference && !referenceNumber.trim()) {
      toast.error('Reference number is required for this payment method');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount > remainingAmount && payments.length > 0) {
      toast.error('Payment amount cannot exceed remaining amount');
      return;
    }

    const newPayment: Payment = {
      id: Date.now().toString(),
      payment_method_id: selectedMethodId,
      payment_method_name: selectedMethod.name,
      amount,
      reference_number: selectedMethod.requires_reference ? referenceNumber : undefined
    };

    setPayments([...payments, newPayment]);
    
    // Reset form
    setPaymentAmount(Math.max(0, remainingAmount - amount).toString());
    setReferenceNumber('');
    
    // Auto-select cash for next payment if there's remaining amount
    const cashMethod = paymentMethods.find(method => method.code === 'CASH');
    if (cashMethod && remainingAmount - amount > 0) {
      setSelectedMethodId(cashMethod.id);
    }
  };

  const removePayment = (paymentId: string) => {
    setPayments(payments.filter(payment => payment.id !== paymentId));
  };

  const handleQuickAmount = (percentage: number) => {
    const amount = (total * percentage / 100).toFixed(2);
    setPaymentAmount(amount);
  };

  const handleExactAmount = () => {
    setPaymentAmount(remainingAmount.toString());
  };

  const handleProcessPayment = () => {
    if (payments.length === 0) {
      toast.error('Please add at least one payment');
      return;
    }

    if (remainingAmount > 0.01) {
      toast.error('Payment is incomplete. Please add more payments to cover the full amount.');
      return;
    }

    const paymentData = {
      payments: payments.map(payment => ({
        payment_method_id: payment.payment_method_id,
        amount: payment.amount,
        reference_number: payment.reference_number
      })),
      notes,
      printReceipt
    };

    onPayment(paymentData);
  };

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Process Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Amount Paid:</span>
                  <span>₹{totalPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Remaining:</span>
                  <span>₹{remainingAmount.toFixed(2)}</span>
                </div>
                {changeAmount > 0 && (
                  <div className="flex justify-between text-blue-600 font-medium">
                    <span>Change Due:</span>
                    <span>₹{changeAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment Method Selection */}
              <div>
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {paymentMethods.map((method) => (
                    <Button
                      key={method.id}
                      variant={selectedMethodId === method.id ? 'primary' : 'outline'}
                      className="justify-start"
                      onClick={() => setSelectedMethodId(method.id)}
                    >
                      {getPaymentMethodIcon(method.type)}
                      <span className="ml-2 text-sm">{method.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <Label>Amount</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleExactAmount}
                    disabled={remainingAmount <= 0}
                  >
                    Exact
                  </Button>
                </div>
                <div className="flex space-x-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAmount(25)}
                  >
                    25%
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAmount(50)}
                  >
                    50%
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAmount(75)}
                  >
                    75%
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAmount(100)}
                  >
                    100%
                  </Button>
                </div>
              </div>

              {/* Reference Number */}
              {selectedMethodId && paymentMethods.find(m => m.id === selectedMethodId)?.requires_reference && (
                <div>
                  <Label>Reference Number *</Label>
                  <Input
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Transaction reference number"
                    className="mt-2"
                  />
                </div>
              )}

              <Button onClick={addPayment} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            </CardContent>
          </Card>

          {/* Added Payments */}
          {payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payments Added</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getPaymentMethodIcon(
                          paymentMethods.find(m => m.id === payment.payment_method_id)?.type || 'cash'
                        )}
                        <div>
                          <p className="font-medium">{payment.payment_method_name}</p>
                          {payment.reference_number && (
                            <p className="text-sm text-gray-500">Ref: {payment.reference_number}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">₹{payment.amount.toFixed(2)}</span>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => removePayment(payment.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes and Options */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes for this transaction..."
                  className="mt-2"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="print-receipt"
                  checked={printReceipt}
                  onCheckedChange={setPrintReceipt}
                />
                <Label htmlFor="print-receipt" className="flex items-center">
                  <Receipt className="h-4 w-4 mr-1" />
                  Print Receipt
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProcessPayment}
              disabled={isProcessing || payments.length === 0 || remainingAmount > 0.01}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? 'Processing...' : 'Complete Payment'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
