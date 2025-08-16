"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  MoreVertical,
} from "lucide-react";
import api from "@/utils/api";
import { useAuthContext } from "@/context/AuthContext";
import { Button, Alert } from "@/components/ui";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shippingAddress?: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  company: string;
}

export default function OrdersPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<string[]>([]);

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Order statuses
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
    fetchOrders();
  }, [currentPage, selectedStatus, selectedCompany]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: selectedStatus || undefined,
        company: selectedCompany || undefined,
        search: searchTerm || undefined,
      };

      const response = await api.orders.getAll(params);
      if (response.success && response.data) {
        setOrders(response.data.orders);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));

        // Extract unique companies
        const uniqueCompanies = [
          ...new Set(response.data.orders.map((o: Order) => o.company)),
        ] as string[];
        setCompanies(uniqueCompanies);
      } else {
        setError(response.message || "Failed to fetch orders");
      }
    } catch (err) {
      setError("An error occurred while fetching orders");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleViewOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsViewModalOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsEditModalOpen(true);
    setSubmitError(null);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!currentOrder) return;

    setCurrentOrder({
      ...currentOrder,
      status: e.target.value,
    });
  };

  const handlePaymentStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (!currentOrder) return;

    setCurrentOrder({
      ...currentOrder,
      paymentStatus: e.target.value,
    });
  };

  const handleUpdateOrder = async () => {
    if (!currentOrder) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await api.orders.update(currentOrder.id, {
        status: currentOrder.status,
        paymentStatus: currentOrder.paymentStatus,
      });

      if (response.success) {
        await fetchOrders();
        setIsEditModalOpen(false);
      } else {
        setSubmitError(response.message || "Failed to update order");
      }
    } catch (err) {
      setSubmitError("An error occurred while updating the order");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleOrderSelection = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkOperations = () => {
    if (selectedOrders.length === 0) {
      setError("Please select at least one order");
      return;
    }

    const ids = selectedOrders.join(",");
    router.push(`/orders/bulk-operations?ids=${ids}`);
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (
      !dateString || // null, undefined, empty
      typeof dateString !== "string" ||
      dateString.trim() === "" ||
      dateString === "0000-00-00 00:00:00" // MySQL-style invalid date
    ) {
      return "N/A";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.warn("Invalid date string passed to formatDate:", dateString);
      return "Invalid Date";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status?: string | null): string => {
    // Force a string: undefined/null → ''
    const key = (status ?? "").toLowerCase();

    switch (key) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  function handleClose(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
      </div>

      {error && (
        <Alert type="error" onClose={handleClose}>
          Something went wrong
        </Alert>
      )}

      {/* Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
        <form onSubmit={handleSearch} className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search orders by order number or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div className="flex space-x-4">
          <div className="w-40">
            <select
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {orderStatuses.map((status, index) => (
                <option key={`${status}-${index}`} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="w-40">
            <select
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">All Companies</option>
              {companies.map((company, index) => (
                <option key={`${company}-${index}`} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <p className="text-gray-500">No orders found</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedOrders(
                        e.target.checked ? orders.map((order) => order.id) : []
                      )
                    }
                    checked={
                      selectedOrders.length > 0 &&
                      selectedOrders.length === orders.length
                    }
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Order
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Payment
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  {/* ✅ INSERT THIS NEW LINE BELOW */}
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                    />
                  </td>

                  {/* ⬇️ Move the existing Order Number cell down */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-indigo-600">
                      #{order.orderNumber}
                    </div>
                    <div className="text-xs text-gray-500">{order.company}</div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.customerName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatDate(order?.createdAt)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        onClick={() => handleEditOrder(order)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, orders.length)}
                  </span>{" "}
                  of <span className="font-medium">{orders.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                        currentPage === i + 1
                          ? "z-10 border-indigo-500 bg-indigo-50 text-indigo-600"
                          : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Order #${currentOrder?.orderNumber || ""}`}
        size="lg"
      >
        {currentOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Customer Information
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-900">
                    {currentOrder.customerName}
                  </p>
                  <p className="text-sm text-gray-900">
                    {currentOrder.customerEmail}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Order Details
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-900">
                    Date: {formatDate(currentOrder?.createdAt)}
                  </p>

                  <p className="text-sm text-gray-900">
                    Status:
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold ${getStatusColor(
                        currentOrder.status || ""
                      )}`}
                    >
                      {currentOrder.status || "N/A"}
                    </span>
                  </p>

                  <p className="text-sm text-gray-900">
                    Payment:
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold ${getStatusColor(
                        currentOrder.paymentStatus || ""
                      )}`}
                    >
                      {currentOrder.paymentStatus || "N/A"}
                    </span>
                  </p>

                  <p className="text-sm text-gray-900">
                    Method: {currentOrder.paymentMethod}
                  </p>
                </div>
              </div>

              {currentOrder.shippingAddress && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Shipping Address
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-900">
                      {currentOrder.shippingAddress.address}
                    </p>
                    <p className="text-sm text-gray-900">
                      {currentOrder.shippingAddress.city},{" "}
                      {currentOrder.shippingAddress.state}{" "}
                      {currentOrder.shippingAddress.postalCode}
                    </p>
                    <p className="text-sm text-gray-900">
                      {currentOrder.shippingAddress.country}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Order Items</h3>
              <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {currentOrder.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="text-sm text-gray-900">
                            {item.productName}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(item.price)}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <div className="text-sm text-gray-900">
                            {item.quantity}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.total)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td
                        colSpan={3}
                        className="whitespace-nowrap px-4 py-3 text-right"
                      >
                        <div className="text-sm font-medium text-gray-900">
                          Total:
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(currentOrder.total)}
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="button" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Order Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Update Order #${currentOrder?.orderNumber || ""}`}
      >
        {submitError && (
          <Alert type="error" onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        {currentOrder && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="orderStatus"
                className="block text-sm font-medium text-gray-700"
              >
                Order Status
              </label>
              <select
                id="orderStatus"
                value={currentOrder.status}
                onChange={handleStatusChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="paymentStatus"
                className="block text-sm font-medium text-gray-700"
              >
                Payment Status
              </label>
              <select
                id="paymentStatus"
                value={currentOrder.paymentStatus}
                onChange={handlePaymentStatusChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpdateOrder}
                isLoading={isSubmitting}
              >
                Update Order
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
