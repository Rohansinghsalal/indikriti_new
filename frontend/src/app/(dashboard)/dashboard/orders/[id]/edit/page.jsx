"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSave, FiArrowLeft, FiX } from "react-icons/fi";

import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";
import { Select } from '@/components/ui/Select';
import  Textarea from "@/components/ui/Textarea";
import { use } from "react";

import { OrderItems } from "@/components/orders/OrderItems";
import { ShippingInfo } from "@/components/orders/ShippingInfo";
import { api } from "@/lib/api";

export default function EditOrderPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  

  // Order status options
  const orderStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Refunded",
  ];

  // Payment statuses
  const paymentStatuses = ["Pending", "Paid", "Failed", "Refunded"];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        [name]: value,
      },
    }));
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        [name]: value,
      },
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...order.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // Recalculate item total
    if (field === "price" || field === "quantity") {
      updatedItems[index].total =
        parseFloat(updatedItems[index].price) *
        parseInt(updatedItems[index].quantity);
    }

    setOrder((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = order.items.filter((_, i) => i !== index);
    setOrder((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await api.put(`/orders/${id}`, order);
      setSuccess("Order updated successfully");

      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/orders/${id}`);
      }, 1500);
    } catch (err) {
      console.error("Error updating order:", err);
      setError("Failed to update order. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/orders/${id}`);
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <Alert variant="warning">Order not found</Alert>
        <div className="mt-4">
          <Button onClick={() => router.push("/orders")} variant="outline">
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div className="flex items-center space-x-4">
          <Button onClick={handleCancel} variant="ghost" size="sm">
            <FiArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Order #{order.orderNumber}
          </h1>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleCancel} variant="outline">
            <FiX className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSaveOrder} disabled={saving}>
            {saving ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <FiSave className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order Details */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Order Details</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="orderNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Order Number
                </label>
                <Input
                  id="orderNumber"
                  name="orderNumber"
                  value={order.orderNumber}
                  onChange={handleInputChange}
                  disabled
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company
                </label>
                <Input
                  id="company"
                  name="company"
                  value={order.company}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Order Status
                </label>
                <Select
                  items={orderStatuses.map((status) => ({
                    label: status,
                    value: status,
                  }))}
                  value={order.status}
                  onChange={(value) =>
                    setOrder((prev) => ({
                      ...prev,
                      status: value,
                    }))
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="paymentStatus"
                  className="block text-sm font-medium text-gray-700"
                >
                  Payment Status
                </label>
                <Select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={order.paymentStatus}
                  onChange={handleInputChange}
                >
                  {paymentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label
                  htmlFor="createdAt"
                  className="block text-sm font-medium text-gray-700"
                >
                  Order Date
                </label>
                <Input
                  id="createdAt"
                  name="createdAt"
                  type="date"
                  value={
                    order.createdAt
                      ? new Date(order.createdAt).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="total"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Amount
                </label>
                <Input
                  id="total"
                  name="total"
                  type="number"
                  step="0.01"
                  value={order.total}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Order Notes
              </label>
              <Textarea
                id="notes"
                name="notes"
                value={order.notes || ""}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Order Items</h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                   
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Input
                          value={item.name}
                          onChange={(e) =>
                            handleItemChange(index, "name", e.target.value)
                          }
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) =>
                            handleItemChange(index, "price", e.target.value)
                          }
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        ${item.total.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <FiX className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="w-64 rounded-md border border-gray-200 bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Subtotal:</span>
                  <span className="text-sm">
                    $
                    {(
                      order.items?.reduce((sum, item) => sum + item.total, 0) ??
                      0
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-sm font-medium">Tax:</span>
                  <span className="text-sm">
                    ${(order.tax || 0).toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-sm font-medium">Shipping:</span>
                  <span className="text-sm">
                    ${(order.shipping?.cost || 0).toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 border-t border-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">
                      ${(order.total ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer and Shipping */}
        <div className="lg:col-span-1">
          {/* Customer Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Customer Information</h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="customer.name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <Input
                  id="customer.name"
                  name="name"
                  value={order.customer?.name || ""}
                  onChange={handleCustomerChange}
                />
              </div>

              <div>
                <label
                  htmlFor="customer.email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="customer.email"
                  name="email"
                  type="email"
                  value={order.customer?.email || ""}
                  onChange={handleCustomerChange}
                />
              </div>

              <div>
                <label
                  htmlFor="customer.phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <Input
                  id="customer.phone"
                  name="phone"
                  value={order.customer?.phone || ""}
                  onChange={handleCustomerChange}
                />
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Shipping Information</h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="shipping.address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <Input
                  id="shipping.address"
                  name="address"
                  value={order.shipping?.address || ""}
                  onChange={handleShippingChange}
                />
              </div>

              <div>
                <label
                  htmlFor="shipping.city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <Input
                  id="shipping.city"
                  name="city"
                  value={order.shipping?.city || ""}
                  onChange={handleShippingChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="shipping.state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <Input
                    id="shipping.state"
                    name="state"
                    value={order.shipping?.state || ""}
                    onChange={handleShippingChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="shipping.zipCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Zip Code
                  </label>
                  <Input
                    id="shipping.zipCode"
                    name="zipCode"
                    value={order.shipping?.zipCode || ""}
                    onChange={handleShippingChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="shipping.country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <Input
                  id="shipping.country"
                  name="country"
                  value={order.shipping?.country || ""}
                  onChange={handleShippingChange}
                />
              </div>

              <div>
                <label
                  htmlFor="shipping.method"
                  className="block text-sm font-medium text-gray-700"
                >
                  Shipping Method
                </label>
                <Input
                  id="shipping.method"
                  name="method"
                  value={order.shipping?.method || ""}
                  onChange={handleShippingChange}
                />
              </div>

              <div>
                <label
                  htmlFor="shipping.trackingNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tracking Number
                </label>
                <Input
                  id="shipping.trackingNumber"
                  name="trackingNumber"
                  value={order.shipping?.trackingNumber || ""}
                  onChange={handleShippingChange}
                />
              </div>

              <div>
                <label
                  htmlFor="shipping.carrier"
                  className="block text-sm font-medium text-gray-700"
                >
                  Carrier
                </label>
                <Input
                  id="shipping.carrier"
                  name="carrier"
                  value={order.shipping?.carrier || ""}
                  onChange={handleShippingChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
