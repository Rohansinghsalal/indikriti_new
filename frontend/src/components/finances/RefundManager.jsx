'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import RefundForm from './RefundForm';
import PaymentStatus from './PaymentStatus';

const RefundManager = ({ transaction, refunds = [], onRefundCreated }) => {
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showRefundDetails, setShowRefundDetails] = useState(false);
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(refunds.length / itemsPerPage);
  
  const paginatedRefunds = refunds.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleRefundClick = (refund) => {
    setSelectedRefund(refund);
    setShowRefundDetails(true);
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
  
  const calculateRefundableAmount = () => {
    if (!transaction) return 0;
    
    const totalRefunded = refunds.reduce((sum, refund) => {
      return sum + (refund.amount || 0);
    }, 0);
    
    return Math.max(0, transaction.amount - totalRefunded);
  };
  
  const handleRefundSubmit = (refundData) => {
    // In a real app, this would be an API call
    if (onRefundCreated) {
      onRefundCreated(refundData);
    }
    setShowRefundDialog(false);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Refund Management</h3>
            <Button 
              onClick={() => setShowRefundDialog(true)}
              disabled={calculateRefundableAmount() <= 0 || !transaction || transaction.status === 'refunded'}
            >
              Issue Refund
            </Button>
          </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">Original Amount</p>
                <p className="text-lg font-medium">
                  {transaction ? formatCurrency(transaction.amount) : 'N/A'}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">Total Refunded</p>
                <p className="text-lg font-medium">
                  {formatCurrency(refunds.reduce((sum, refund) => sum + refund.amount, 0))}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">Refundable Amount</p>
                <p className="text-lg font-medium">
                  {formatCurrency(calculateRefundableAmount())}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-3">Refund History</h4>
            {refunds.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                <p className="text-gray-500">No refunds have been issued for this transaction.</p>
              </div>
            ) : (
              <>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.Head>ID</Table.Head>
                      <Table.Head>Date</Table.Head>
                      <Table.Head>Amount</Table.Head>
                      <Table.Head>Status</Table.Head>
                      <Table.Head>Reason</Table.Head>
                      <Table.Head className="text-right">Actions</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {paginatedRefunds.map((refund) => (
                      <Table.Row key={refund.id}>
                        <Table.Cell className="font-medium">
                          {refund.id}
                        </Table.Cell>
                        <Table.Cell>
                          {formatDate(refund.date)}
                        </Table.Cell>
                        <Table.Cell>
                          {formatCurrency(refund.amount)}
                        </Table.Cell>
                        <Table.Cell>
                          <PaymentStatus status={refund.status} />
                        </Table.Cell>
                        <Table.Cell>
                          <span className="truncate block max-w-[150px]">
                            {refund.reason}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRefundClick(refund)}
                          >
                            View
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
                
                {totalPages > 1 && (
                  <div className="mt-4 flex justify-center">
                    <Pagination 
                      currentPage={currentPage} 
                      totalPages={totalPages} 
                      onPageChange={handlePageChange} 
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Card>
      
      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Refund</DialogTitle>
          </DialogHeader>
          <RefundForm 
            transaction={transaction} 
            maxAmount={calculateRefundableAmount()} 
            onSubmit={handleRefundSubmit} 
            onCancel={() => setShowRefundDialog(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Refund Details Dialog */}
      <Dialog open={showRefundDetails} onOpenChange={setShowRefundDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund Details</DialogTitle>
          </DialogHeader>
          
          {selectedRefund && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Refund ID</p>
                  <p className="font-medium">{selectedRefund.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(selectedRefund.date)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">{formatCurrency(selectedRefund.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <PaymentStatus status={selectedRefund.status} />
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">Reason</p>
                <p className="font-medium">{selectedRefund.reason}</p>
              </div>
              
              {selectedRefund.notes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="font-medium">{selectedRefund.notes}</p>
                </div>
              )}
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">Processed By</p>
                <p className="font-medium">{selectedRefund.processedBy || 'System'}</p>
              </div>
              
              {selectedRefund.paymentMethod && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Refunded To</p>
                  <p className="font-medium">{selectedRefund.paymentMethod}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RefundManager;