'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Separator } from '@/components/ui/Separator';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

const CartSummary = ({ cart = [], onUpdateQuantity, onRemoveItem, totals, className = '' }) => {
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {cart.length > 0 ? (
        <>
          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-start">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.sku}</div>
                    <div className="text-sm">{formatPrice(item.price)} each</div>
                  </div>
                  
                  <div className="flex flex-col items-end ml-4 space-y-2">
                    <div className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="mt-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{formatPrice(totals.tax)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(totals.total)}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium">Your cart is empty</h3>
          <p className="text-sm text-gray-500 mt-1">
            Add products to get started with your sale
          </p>
        </div>
      )}
    </div>
  );
};

export default CartSummary;