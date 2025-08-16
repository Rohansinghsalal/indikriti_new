"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { FiEdit, FiTruck, FiArrowLeft, FiPrinter } from "react-icons/fi";
import OrderDetails from "@/components/orders/OrderDetails";
import OrderStatus from "@/components/orders/OrderStatus";
import { Button, Alert, Spinner } from "@/components/ui";
import { api } from "@/lib/api";

export default function OrderDetailsPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleEditOrder = () => {
    router.push(`/orders/${id}/edit`);
  };

  const handleTrackOrder = () => {
    router.push(`/dashboard/orders/${id}/tracking`);
  };

  const handleProcessOrder = () => {
    router.push(`/dashboard/orders/processing?id=${id}`);
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const handleBackToOrders = () => {
    router.push("/orders");
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="error">{error}</Alert>
        <div className="mt-4">
          <Button onClick={handleBackToOrders} variant="outline">
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <Alert variant="warning">Order not found</Alert>
        <div className="mt-4">
          <Button onClick={handleBackToOrders} variant="outline">
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
          <Button onClick={handleBackToOrders} variant="ghost" size="sm">
            <FiArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <OrderStatus status={order.status} size="lg" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handlePrintOrder} variant="outline">
            <FiPrinter className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleTrackOrder} variant="outline">
            <FiTruck className="mr-2 h-4 w-4" />
            Track
          </Button>
          <Button onClick={handleProcessOrder} variant="outline">
            Process
          </Button>
          <Button onClick={handleEditOrder}>
            <FiEdit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="print:shadow-none rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <OrderDetails order={order} />
      </div>
    </div>
  );
}
