'use client';

import React from 'react';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderItemsProps {
  items?: OrderItem[]; // Made optional to prevent runtime crash
  formatCurrency: (amount: number) => string;
}

export default function OrderItems({ items = [], formatCurrency }: OrderItemsProps) {
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500">
        No order items found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Product
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Price
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Quantity
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                    <div className="text-xs text-gray-500">ID: {item.productId}</div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                {formatCurrency(item.price)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                {item.quantity}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-900">
                {formatCurrency(item.total)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan={3} className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-900">
              Total:
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-gray-900">
              {formatCurrency(calculateTotal())}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
