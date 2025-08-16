'use client';

import React, { useState } from 'react';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import PaymentStatus from './PaymentStatus';

const TransactionList = ({ transactions = [], isLoading = false, onPageChange, totalPages = 1, currentPage = 1 }) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case 'payment':
        return 'Payment';
      case 'refund':
        return 'Refund';
      case 'payout':
        return 'Payout';
      case 'transfer':
        return 'Transfer';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'payment':
        return 'bg-green-100 text-green-800';
      case 'refund':
        return 'bg-amber-100 text-amber-800';
      case 'payout':
        return 'bg-blue-100 text-blue-800';
      case 'transfer':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head 
              className="cursor-pointer" 
              onClick={() => handleSort('id')}
            >
              ID
              {sortField === 'id' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </Table.Head>
            <Table.Head 
              className="cursor-pointer" 
              onClick={() => handleSort('date')}
            >
              Date
              {sortField === 'date' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </Table.Head>
            <Table.Head>Type</Table.Head>
            <Table.Head 
              className="cursor-pointer" 
              onClick={() => handleSort('amount')}
            >
              Amount
              {sortField === 'amount' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Customer</Table.Head>
            <Table.Head className="text-right">Actions</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <Table.Row>
              <Table.Cell colSpan={7} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              </Table.Cell>
            </Table.Row>
          ) : transactions.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={7} className="text-center py-8">
                No transactions found
              </Table.Cell>
            </Table.Row>
          ) : (
            transactions.map((transaction) => (
              <Table.Row key={transaction.id}>
                <Table.Cell className="font-medium">
                  {transaction.id}
                </Table.Cell>
                <Table.Cell>
                  {formatDate(transaction.date)}
                </Table.Cell>
                <Table.Cell>
                  <Badge className={getTransactionTypeColor(transaction.type)}>
                    {getTransactionTypeLabel(transaction.type)}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {formatCurrency(transaction.amount)}
                </Table.Cell>
                <Table.Cell>
                  <PaymentStatus status={transaction.status} />
                </Table.Cell>
                <Table.Cell>
                  {transaction.customer ? transaction.customer.name : 'N/A'}
                </Table.Cell>
                <Table.Cell className="text-right">
                  <Link href={`/financial/transactions/${transaction.id}`}>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
      
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={onPageChange} 
          />
        </div>
      )}
    </div>
  );
};

export default TransactionList;