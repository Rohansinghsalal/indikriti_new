import React, { useState } from 'react';
import OrderList from '../components/orders/OrderList';
import Modal from '../components/ui/Modal';
import { Card } from '../components/ui';
import toast from 'react-hot-toast';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Mock orders data
  const orders = [
    {
      id: 'ORD-001',
      customer: 'John Smith',
      items: 3,
      total: 2999.99,
      status: 'pending',
      date: '2023-12-01T10:00:00Z'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Doe',
      items: 2,
      total: 4799.98,
      status: 'processing',
      date: '2023-12-01T09:30:00Z'
    },
    {
      id: 'ORD-003',
      customer: 'Bob Johnson',
      items: 1,
      total: 799.99,
      status: 'shipped',
      date: '2023-11-30T15:20:00Z'
    },
    {
      id: 'ORD-004',
      customer: 'Alice Brown',
      items: 4,
      total: 1999.96,
      status: 'delivered',
      date: '2023-11-29T14:10:00Z'
    },
    {
      id: 'ORD-005',
      customer: 'Charlie Davis',
      items: 1,
      total: 599.99,
      status: 'cancelled',
      date: '2023-11-28T11:45:00Z'
    }
  ];

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    console.log('Update order status:', orderId, 'to:', newStatus);
    // TODO: Implement status update functionality
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <OrderList
        orders={orders}
        onViewOrder={handleViewOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Order Details Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">#{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{selectedOrder.customer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Items</p>
                <p className="font-medium">{selectedOrder.items}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-medium">₹{selectedOrder.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  selectedOrder.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                  selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {new Date(selectedOrder.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Order Items (Mock) */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
              <div className="border rounded-lg">
                <div className="p-3 border-b">
                  <div className="flex justify-between">
                    <span>Cotton Bedsheet</span>
                    <span>₹1999.99</span>
                  </div>
                  <div className="text-sm text-gray-500">Quantity: 1</div>
                </div>
                <div className="p-3 border-b">
                  <div className="flex justify-between">
                    <span>Silk Suit</span>
                    <span>₹999.99</span>
                  </div>
                  <div className="text-sm text-gray-500">Quantity: 1</div>
                </div>
                <div className="p-3 bg-gray-50">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
