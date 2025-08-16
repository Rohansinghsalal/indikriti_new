'use client';

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MoreHorizontal, Edit, Trash2, Copy, Power } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';

const DiscountCard = ({ discount, onEdit, onDelete, onToggleStatus }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDiscountValue = () => {
    if (discount.type === 'percentage') {
      return `${discount.value}%`;
    } else {
      return formatCurrency(discount.value);
    }
  };

  const getApplicableToText = () => {
    switch (discount.applicableTo) {
      case 'all_products':
        return 'All Products';
      case 'selected_products':
        return 'Selected Products';
      case 'selected_categories':
        return 'Selected Categories';
      case 'shipping':
        return 'Shipping Only';
      default:
        return 'All Products';
    }
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(discount.code);
    // In a real app, you would show a toast notification here
    alert(`Discount code ${discount.code} copied to clipboard`);
  };

  const isExpired = new Date(discount.endDate) < new Date();
  const displayStatus = isExpired && discount.status !== 'expired' ? 'expired' : discount.status;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{discount.code}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{discount.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyCodeToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleStatus}>
                <Power className="mr-2 h-4 w-4" />
                {displayStatus === 'active' ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Discount</span>
            <span className="text-lg font-bold">{getDiscountValue()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Status</span>
            <Badge className={getStatusColor(displayStatus)}>
              {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Valid Period</span>
            <span className="text-sm">
              {formatDate(discount.startDate)} - {formatDate(discount.endDate)}
            </span>
          </div>
          
          {discount.minPurchase > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Min. Purchase</span>
              <span className="text-sm">{formatCurrency(discount.minPurchase)}</span>
            </div>
          )}
          
          {discount.maxDiscount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Max. Discount</span>
              <span className="text-sm">{formatCurrency(discount.maxDiscount)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Applies To</span>
            <span className="text-sm">{getApplicableToText()}</span>
          </div>
          
          {discount.usageLimit > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Usage Limit</span>
              <span className="text-sm">{discount.usageLimit} per customer</span>
            </div>
          )}
          
          {discount.usageCount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Times Used</span>
              <span className="text-sm">{discount.usageCount}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full flex justify-between">
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button 
            variant={displayStatus === 'active' ? 'outline' : 'default'} 
            size="sm" 
            onClick={onToggleStatus}
          >
            {displayStatus === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DiscountCard;