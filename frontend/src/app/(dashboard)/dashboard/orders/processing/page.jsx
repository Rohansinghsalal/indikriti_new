// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { FiArrowLeft, FiCheck, FiPackage, FiSearch } from "react-icons/fi";
// import OrderProcessing from "@/components/orders/OrderProcessing";
// import { OrderList } from "@/components/orders/OrderList";
// import { Button, Alert, Spinner, Input } from "@/components/ui";
// import { api } from "@/lib/api";

// export default function OrderProcessingPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get("id");

//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [processingOrder, setProcessingOrder] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//     itemsPerPage: 10,
//   });

//   // Fetch pending orders
//   useEffect(() => {
//     const fetchPendingOrders = async () => {
//       setLoading(true);
//       try {
//         // Construct query parameters
//         const queryParams = new URLSearchParams();
//         queryParams.append("page", pagination.currentPage);
//         queryParams.append("limit", pagination.itemsPerPage);
//         queryParams.append("status", "Pending,Processing"); // Only fetch orders that need processing

//         if (searchTerm) {
//           queryParams.append("search", searchTerm);
//         }

//         const response = await api.get(`/orders?${queryParams.toString()}`);

//         setOrders(response.data.orders);
//         setPagination({
//           currentPage: response.data.currentPage,
//           totalPages: response.data.totalPages,
//           totalItems: response.data.totalItems,
//           itemsPerPage: response.data.itemsPerPage,
//         });
//       } catch (err) {
//         console.error("Error fetching orders:", err);
//         setError("Failed to load orders. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPendingOrders();
//   }, [pagination.currentPage, pagination.itemsPerPage, searchTerm]);

//   // Fetch specific order if ID is provided in URL
//   useEffect(() => {
//     const fetchOrderById = async (id) => {
//       try {
//         const response = await api.get(`/orders/${id}`);
//         setSelectedOrder(response.data);
//       } catch (err) {
//         console.error("Error fetching order details:", err);
//         setError(`Failed to load order #${id}. Please try again later.`);
//       }
//     };

//     if (orderId) {
//       fetchOrderById(orderId);
//     }
//   }, [orderId]);

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     setPagination((prev) => ({
//       ...prev,
//       currentPage: newPage,
//     }));
//   };

//   // Handle search
//   const handleSearch = (term) => {
//     setSearchTerm(term);
//     setPagination((prev) => ({
//       ...prev,
//       currentPage: 1, // Reset to first page on new search
//     }));
//   };

//   // Handle order selection
//   const handleSelectOrder = async (id) => {
//     try {
//       const response = await api.get(`/orders/${id}`);
//       setSelectedOrder(response.data);
//       // Update URL without full page reload
//       router.push(`/orders/processing?id=${id}`, { scroll: false });
//     } catch (err) {
//       console.error("Error fetching order details:", err);
//       setError(`Failed to load order #${id}. Please try again later.`);
//     }
//   };

//   // Handle order processing
//   const handleProcessOrder = async (updatedOrder) => {
//     setProcessingOrder(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       await api.put(`/orders/${updatedOrder.id}`, updatedOrder);
//       setSuccess(
//         `Order #${updatedOrder.orderNumber} has been processed successfully`
//       );

//       // Update the order in the list
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order.id === updatedOrder.id ? updatedOrder : order
//         )
//       );

//       // Clear the selected order after a delay
//       setTimeout(() => {
//         setSelectedOrder(null);
//         setSuccess(null);
//         // Remove the id from URL
//         router.push("/orders/processing", { scroll: false });
//         // Refresh the orders list
//         handlePageChange(pagination.currentPage);
//       }, 2000);
//     } catch (err) {
//       console.error("Error processing order:", err);
//       setError("Failed to process order. Please try again.");
//     } finally {
//       setProcessingOrder(false);
//     }
//   };

//   const handleBackToOrders = () => {
//     router.push("/orders");
//   };

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
//         <div className="flex items-center space-x-4">
//           <Button onClick={handleBackToOrders} variant="ghost" size="sm">
//             <FiArrowLeft className="h-4 w-4" />
//           </Button>
//           <h1 className="text-2xl font-bold text-gray-900">Order Processing</h1>
//         </div>

//         <div className="relative w-full max-w-xs">
//           <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//             <FiSearch className="h-5 w-5 text-gray-400" />
//           </div>
//           <Input
//             type="text"
//             placeholder="Search orders..."
//             className="pl-10"
//             value={searchTerm}
//             onChange={(e) => handleSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {error && (
//         <Alert variant="error" onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       {success && (
//         <Alert variant="success" onClose={() => setSuccess(null)}>
//           {success}
//         </Alert>
//       )}

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         {/* Orders List */}
//         <div className="lg:col-span-1">
//           <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
//             <div className="border-b border-gray-200 p-4">
//               <h2 className="text-lg font-medium">Orders to Process</h2>
//               <p className="text-sm text-gray-500">
//                 {pagination.totalItems} orders pending processing
//               </p>
//             </div>

//             {loading ? (
//               <div className="flex h-64 items-center justify-center">
//                 <Spinner size="lg" />
//               </div>
//             ) : orders.length === 0 ? (
//               <div className="flex h-64 flex-col items-center justify-center p-4 text-center">
//                 <div className="mb-4 rounded-full bg-gray-100 p-4">
//                   <FiPackage className="h-8 w-8 text-gray-400" />
//                 </div>
//                 <h3 className="mb-2 text-lg font-medium">
//                   No Orders to Process
//                 </h3>
//                 <p className="text-gray-500">
//                   All orders have been processed or no orders match your search
//                   criteria.
//                 </p>
//               </div>
//             ) : (
//               <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
//                 <ul className="divide-y divide-gray-200">
//                   {orders.map((order) => (
//                     <li
//                       key={order.id}
//                       className={`cursor-pointer p-4 hover:bg-gray-50 ${
//                         selectedOrder?.id === order.id ? "bg-blue-50" : ""
//                       }`}
//                       onClick={() => handleSelectOrder(order.id)}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="font-medium">
//                             Order #{order.orderNumber}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             {order.customer?.name}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-medium">
//                             ${order.total.toFixed(2)}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             {new Date(order.createdAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="mt-2 flex items-center justify-between">
//                         <span
//                           className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                             order.status === "Pending"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : order.status === "Processing"
//                               ? "bg-blue-100 text-blue-800"
//                               : "bg-gray-100 text-gray-800"
//                           }`}
//                         >
//                           {order.status}
//                         </span>
//                         <span
//                           className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                             order.paymentStatus === "Paid"
//                               ? "bg-green-100 text-green-800"
//                               : order.paymentStatus === "Pending"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : order.paymentStatus === "Failed"
//                               ? "bg-red-100 text-red-800"
//                               : "bg-gray-100 text-gray-800"
//                           }`}
//                         >
//                           {order.paymentStatus}
//                         </span>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Pagination */}
//             {!loading && orders.length > 0 && (
//               <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
//                 <div className="flex flex-1 justify-between sm:hidden">
//                   <Button
//                     onClick={() => handlePageChange(pagination.currentPage - 1)}
//                     disabled={pagination.currentPage === 1}
//                     variant="outline"
//                     size="sm"
//                   >
//                     Previous
//                   </Button>
//                   <Button
//                     onClick={() => handlePageChange(pagination.currentPage + 1)}
//                     disabled={pagination.currentPage === pagination.totalPages}
//                     variant="outline"
//                     size="sm"
//                   >
//                     Next
//                   </Button>
//                 </div>
//                 <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//                   <div>
//                     <p className="text-sm text-gray-700">
//                       Showing{" "}
//                       <span className="font-medium">
//                         {(pagination.currentPage - 1) *
//                           pagination.itemsPerPage +
//                           1}
//                       </span>{" "}
//                       to{" "}
//                       <span className="font-medium">
//                         {Math.min(
//                           pagination.currentPage * pagination.itemsPerPage,
//                           pagination.totalItems
//                         )}
//                       </span>{" "}
//                       of{" "}
//                       <span className="font-medium">
//                         {pagination.totalItems}
//                       </span>{" "}
//                       results
//                     </p>
//                   </div>
//                   <div>
//                     <nav
//                       className="isolate inline-flex -space-x-px rounded-md shadow-sm"
//                       aria-label="Pagination"
//                     >
//                       <Button
//                         onClick={() =>
//                           handlePageChange(pagination.currentPage - 1)
//                         }
//                         disabled={pagination.currentPage === 1}
//                         variant="outline"
//                         size="sm"
//                       >
//                         Previous
//                       </Button>
//                       {Array.from(
//                         { length: pagination.totalPages },
//                         (_, i) => i + 1
//                       ).map((page) => (
//                         <Button
//                           key={page}
//                           onClick={() => handlePageChange(page)}
//                           variant={
//                             pagination.currentPage === page
//                               ? "default"
//                               : "outline"
//                           }
//                           size="sm"
//                         >
//                           {page}
//                         </Button>
//                       ))}
//                       <Button
//                         onClick={() =>
//                           handlePageChange(pagination.currentPage + 1)
//                         }
//                         disabled={
//                           pagination.currentPage === pagination.totalPages
//                         }
//                         variant="outline"
//                         size="sm"
//                       >
//                         Next
//                       </Button>
//                     </nav>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Order Processing Panel */}
//         <div className="lg:col-span-2">
//           {selectedOrder ? (
//             <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
//               <OrderProcessing
//                 order={selectedOrder}
//                 onProcessOrder={handleProcessOrder}
//                 processing={processingOrder}
//               />
//             </div>
//           ) : (
//             <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
//               <div className="mb-4 rounded-full bg-gray-100 p-4">
//                 <FiCheck className="h-8 w-8 text-gray-400" />
//               </div>
//               <h3 className="mb-2 text-lg font-medium">
//                 Select an Order to Process
//               </h3>
//               <p className="mb-6 max-w-md text-gray-500">
//                 Choose an order from the list on the left to begin processing.
//                 You can update order status, add tracking information, and
//                 manage payment status.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiCheck, FiPackage, FiSearch } from "react-icons/fi";
import OrderProcessing from "@/components/orders/OrderProcessing";
import { Button, Alert, Spinner, Input } from "@/components/ui";
import Tooltip from "@/components/ui/Tooltip";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function OrderProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  useEffect(() => {
    const fetchPendingOrders = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", pagination.currentPage);
        queryParams.append("limit", pagination.itemsPerPage);
        queryParams.append("status", "Pending,Processing");
        if (searchTerm) {
          queryParams.append("search", searchTerm);
        }

        const response = await api.get(`/orders?${queryParams.toString()}`);
        setOrders(response.data.orders || []);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItems,
          itemsPerPage: response.data.itemsPerPage,
        });
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingOrders();
  }, [pagination.currentPage, pagination.itemsPerPage, searchTerm]);

  useEffect(() => {
    const fetchOrderById = async (id) => {
      try {
        const response = await api.get(`/orders/${id}`);
        setSelectedOrder(response.data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(`Failed to load order #${id}. Please try again later.`);
      }
    };

    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  const handleSearchSubmit = () => {
    setSearchTerm(searchInput);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSelectOrder = async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      console.log("Selected order:", response.data); // ✅ Add this for debug
      setSelectedOrder(response.data);
      router.push(`/orders/processing?id=${id}`, { scroll: false });
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError(`Failed to load order #${id}. Please try again later.`);
    }
  };

  const handleProcessOrder = async (updatedOrder) => {
    const confirmMessage = `Are you sure you want to process order #${updatedOrder.orderNumber}?`;
    if (!confirm(confirmMessage)) return;

    setProcessingOrder(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.put(
        `/orders/${updatedOrder.id}`,
        updatedOrder
      );

      toast.success(
        `Order #${updatedOrder.orderNumber} processed successfully.`
      );

      // Optionally re-fetch the order to get latest updates
      const refreshed = await api.get(`/orders/${updatedOrder.id}`);
      setSelectedOrder(refreshed.data);

      // Update order in list
      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.id ? refreshed.data : order
        )
      );

      // Optional: navigate back after short delay
      setTimeout(() => {
        setSelectedOrder(null);
        setSuccess(null);
        router.push("/orders/processing", { scroll: false });
        handlePageChange(pagination.currentPage);
      }, 1000);
    } catch (err) {
      console.error("Error processing order:", err);
      toast.error("Failed to process order.");
    } finally {
      setProcessingOrder(false);
    }
  };

  const handleUpdateStatus = async (orderId, status, paymentStatus) => {
    try {
      const response = await api.put(`/orders/${orderId}`, {
        status,
        paymentStatus,
      });
      toast.success("Order status updated.");
      return response.status === 200;
    } catch (err) {
      toast.error("Failed to update order status.");
      return false;
    }
  };

  const handleShipOrder = async (orderId, trackingInfo) => {
    try {
      const response = await api.post(`/orders/${orderId}/ship`, trackingInfo);
      toast.success("Order marked as shipped.");
      return response.status === 200;
    } catch (err) {
      toast.error("Failed to mark order as shipped.");
      return false;
    }
  };

  const handleBackToOrders = () => {
    router.push("/orders");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div className="flex items-center space-x-4">
          <Button onClick={handleBackToOrders} variant="ghost" size="sm">
            <FiArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Order Processing</h1>
        </div>

        <div className="flex w-full max-w-md items-center space-x-2">
          <Tooltip
            content="Enter keywords like Order # or customer name"
            placement="bottom"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search orders..."
                className="pl-10"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </Tooltip>
          <Button onClick={handleSearchSubmit} className="shrink-0">
            Search
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
        {/* Orders List */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-medium">Orders to Process</h2>
              <p className="text-sm text-gray-500">
                {pagination.totalItems} orders pending
              </p>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : orders.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center p-4 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-4">
                  <FiPackage className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium">
                  No Orders to Process
                </h3>
                <p className="text-gray-500">
                  All orders are processed or none match your criteria.
                </p>
              </div>
            ) : (
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                <ul className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <li
                      key={order.id}
                      className={`cursor-pointer p-4 hover:bg-gray-50 ${
                        selectedOrder?.id === order.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleSelectOrder(order.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            Order #{order.orderNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.customer?.name || "Guest"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            $
                            {typeof order.total === "number"
                              ? order.total.toFixed(2)
                              : "0.00"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            order.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-800"
                              : order.paymentStatus === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.paymentStatus === "Failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!loading && orders.length > 0 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.currentPage - 1) * pagination.itemsPerPage +
                        1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.currentPage * pagination.itemsPerPage,
                        pagination.totalItems
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{pagination.totalItems}</span>{" "}
                    results
                  </p>
                  <div>
                    <nav
                      className="inline-flex space-x-1"
                      aria-label="Pagination"
                    >
                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <Button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          variant={
                            pagination.currentPage === page
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                        >
                          {page}
                        </Button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Processing Panel */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <OrderProcessing
              order={selectedOrder}
              onStatusUpdate={handleUpdateStatus}
              onShipOrder={handleShipOrder}
            />
          ) : (
            <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <FiCheck className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium">
                Select an Order to Process
              </h3>
              <p className="mb-6 max-w-md text-gray-500">
                Choose an order from the list on the left to begin processing.
                You can update order status, add tracking information, and
                manage payment status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
