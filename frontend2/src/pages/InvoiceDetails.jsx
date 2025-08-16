import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiDownload, 
  FiPrinter, 
  FiEdit, 
  FiTrash2,
  FiFileText,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiXCircle
} from 'react-icons/fi';
import { Card, Button } from '../components/ui';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/invoices/${id}`);
      
      if (response.data.success) {
        setInvoice(response.data.data);
      } else {
        toast.error('Invoice not found');
        navigate('/invoices');
      }
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      toast.error('Error loading invoice details');
      navigate('/invoices');
    } finally {
      setLoading(false);
    }
  };

  const updateInvoiceStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const response = await api.put(`/invoices/${id}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        setInvoice(prev => ({ ...prev, status: newStatus }));
        toast.success(`Invoice status updated to ${newStatus}`);
      } else {
        toast.error('Failed to update invoice status');
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error('Error updating invoice status');
    } finally {
      setUpdating(false);
    }
  };

  const deleteInvoice = async () => {
    if (!window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return;
    }

    try {
      setUpdating(true);
      const response = await api.delete(`/invoices/${id}`);
      
      if (response.data.success) {
        toast.success('Invoice deleted successfully');
        navigate('/invoices');
      } else {
        toast.error('Failed to delete invoice');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Error deleting invoice');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'sent':
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      case 'overdue':
        return <FiAlertCircle className="w-5 h-5 text-red-500" />;
      case 'cancelled':
        return <FiXCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <FiFileText className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading invoice details...</span>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Invoice not found</h3>
        <p className="text-gray-600 mb-4">The invoice you're looking for doesn't exist.</p>
        <Link to="/invoices">
          <Button>Back to Invoices</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/invoices">
            <Button variant="outline" size="sm">
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Invoices
            </Button>
          </Link>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Invoice {invoice.invoice_number}
            </h1>
            <p className="text-gray-600">
              Created on {new Date(invoice.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <FiDownload className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          
          <Button variant="outline" size="sm">
            <FiPrinter className="w-4 h-4 mr-2" />
            Print
          </Button>

          {invoice.status !== 'paid' && (
            <Button
              onClick={deleteInvoice}
              disabled={updating}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <FiTrash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Info */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Invoice Information</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                  {getStatusIcon(invoice.status)}
                  <span className="ml-2 capitalize">{invoice.status}</span>
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Invoice Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invoice Number:</span>
                      <span className="font-medium">{invoice.invoice_number}</span>
                    </div>
                    {invoice.transaction_id && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-medium">{invoice.transaction_id}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created Date:</span>
                      <span className="font-medium">{new Date(invoice.created_at).toLocaleDateString()}</span>
                    </div>
                    {invoice.due_date && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Date:</span>
                        <span className="font-medium">{new Date(invoice.due_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {invoice.paid_date && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid Date:</span>
                        <span className="font-medium">{new Date(invoice.paid_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{invoice.customer_name || 'Walk-in Customer'}</span>
                    </div>
                    {invoice.customer_email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{invoice.customer_email}</span>
                      </div>
                    )}
                    {invoice.customer_phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{invoice.customer_phone}</span>
                      </div>
                    )}
                    {invoice.billing_address && (
                      <div>
                        <span className="text-gray-600">Address:</span>
                        <p className="font-medium mt-1">{invoice.billing_address}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Invoice Items */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items && invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.product_name}
                          </div>
                          {item.product_sku && (
                            <div className="text-sm text-gray-500">
                              SKU: {item.product_sku}
                            </div>
                          )}
                          {item.description && (
                            <div className="text-sm text-gray-500">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.unit_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(item.line_total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Invoice Summary */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Invoice Summary</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>

              {parseFloat(invoice.discount_amount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(invoice.discount_amount)}</span>
                </div>
              )}

              {parseFloat(invoice.tax_amount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">{formatCurrency(invoice.tax_amount)}</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(invoice.total_amount)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Status Actions */}
          {invoice.status !== 'paid' && (
            <Card>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Actions</h3>
              </div>

              <div className="p-6 space-y-3">
                {invoice.status === 'draft' && (
                  <Button
                    onClick={() => updateInvoiceStatus('sent')}
                    disabled={updating}
                    className="w-full"
                  >
                    Send Invoice
                  </Button>
                )}

                {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                  <Button
                    onClick={() => updateInvoiceStatus('paid')}
                    disabled={updating}
                    className="w-full"
                  >
                    Mark as Paid
                  </Button>
                )}

                <Button
                  onClick={() => updateInvoiceStatus('cancelled')}
                  disabled={updating}
                  variant="outline"
                  className="w-full"
                >
                  Cancel Invoice
                </Button>
              </div>
            </Card>
          )}

          {/* Transaction Info */}
          {invoice.transaction && (
            <Card>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Transaction Details</h3>
              </div>

              <div className="p-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction Number:</span>
                  <span className="font-medium">{invoice.transaction.transaction_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="font-medium capitalize">{invoice.transaction.payment_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cashier:</span>
                  <span className="font-medium">
                    {invoice.creator ? `${invoice.creator.first_name} ${invoice.creator.last_name}` : 'Unknown'}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Notes */}
          {(invoice.notes || invoice.terms) && (
            <Card>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
              </div>

              <div className="p-6 space-y-4">
                {invoice.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Notes:</h4>
                    <p className="text-sm text-gray-600">{invoice.notes}</p>
                  </div>
                )}

                {invoice.terms && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Terms:</h4>
                    <p className="text-sm text-gray-600">{invoice.terms}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
