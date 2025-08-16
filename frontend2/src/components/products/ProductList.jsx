import React, { useState } from "react";
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiGrid,
  FiList,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import Modal from "../ui/Modal";
import AdvancedProductForm from "./AdvancedProductForm";

export default function ProductList({
  products = [],
  onDelete,
  onEdit,
  onView,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    status: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
  });

  // AdvancedForm related state
  const [isAdvancedFormOpen, setIsAdvancedFormOpen] = useState(false);
  const [productForAdvancedForm, setProductForAdvancedForm] = useState(null);

  // Delete handlers
  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete);
      setProductToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  // AdvancedForm handlers
  const handleOpenAdvancedForm = (product) => {
    setProductForAdvancedForm(product);
    setIsAdvancedFormOpen(true);
  };
  
  const handleCloseAdvancedForm = () => {
    setIsAdvancedFormOpen(false);
    setProductForAdvancedForm(null);
  };

  // Search & Filter handlers
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleFilterChange = (e) => {
    const { name, value, type } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  const applyFilters = () => setIsFilterModalOpen(false);

  const resetFilters = () => {
    setFilters({
      category: "",
      brand: "",
      status: "",
      minPrice: "",
      maxPrice: "",
      inStock: false,
    });
  };

  const filteredProducts = (products ?? []).filter((p) => {
    const name = p.name?.toLowerCase() || "";
    const sku = p.sku?.toLowerCase() || "";
    const category = p.category?.toLowerCase() || "";
    const brand = p.brand?.toLowerCase() || "";

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      sku.includes(searchTerm.toLowerCase()) ||
      category.includes(searchTerm.toLowerCase()) ||
      brand.includes(searchTerm.toLowerCase());

    const matchesFilters =
      (!filters.category || p.category === filters.category) &&
      (!filters.brand || p.brand === filters.brand) &&
      (!filters.status || p.status === filters.status) &&
      (!filters.minPrice ||
        (!isNaN(Number(filters.minPrice)) && p.sellingPrice >= parseFloat(filters.minPrice))) &&
      (!filters.maxPrice ||
        (!isNaN(Number(filters.maxPrice)) && p.sellingPrice <= parseFloat(filters.maxPrice))) &&
      (!filters.inStock || p.stockQuantity > 0);

    return matchesSearch && matchesFilters;
  });

  return (
    // Responsive container fixes mobile overflow
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 space-y-8">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 text-base text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button onClick={() => setIsFilterModalOpen(true)}>
            <FiFilter className="mr-2" /> Filter
          </Button>
          <Button onClick={() => setViewMode("grid")}>
            <FiGrid />
          </Button>
          <Button onClick={() => setViewMode("list")}>
            <FiList />
          </Button>
        </div>
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-6 text-center shadow rounded text-gray-900 text-base">
          No products found.
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded shadow-sm p-4 sm:p-6 space-y-4 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-800">SKU: {product.sku}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    product.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-base">
                <span className="line-through text-gray-500">
                  ₹{product.mrp?.toFixed(2) || '0.00'}
                </span>
                <span className="font-extrabold text-green-800">
                  ₹{product.sellingPrice?.toFixed(2) || product.price?.toFixed(2) || '0.00'}
                </span>
                <span className="text-gray-700">— {product.category}</span>
              </div>
              {/* Actions */}
              <div className="flex flex-wrap justify-end gap-2 pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(product)}
                  aria-label="View Product"
                  className="min-w-0"
                >
                  <FiEye className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleOpenAdvancedForm(product)}
                  className="min-w-0 font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow"
                >
                  <span className="inline-flex items-center gap-1">
                    <FiGrid className="w-4 h-4" />
                    Advanced Form
                  </span>
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onEdit(product)}
                  aria-label="Edit Product"
                  className="min-w-0"
                >
                  <FiEdit className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDeleteClick(product.id)}
                  aria-label="Delete Product"
                  className="min-w-0"
                >
                  <FiTrash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
      >
        <div className="p-4">
          <p className="text-gray-900 text-base">
            Are you sure you want to delete this product?
          </p>
          <div className="mt-4 flex justify-end space-x-2">
            <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} className="bg-red-600 text-white">
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Products"
      >
        <div className="p-4 space-y-4">
          <Input
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            placeholder="Category"
            className="text-base text-gray-900"
          />
          <Input
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
            placeholder="Brand"
            className="text-base text-gray-900"
          />
          <Input
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            placeholder="Status"
            className="text-base text-gray-900"
          />
          <Input
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min Price"
            type="number"
            className="text-base text-gray-900"
          />
          <Input
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max Price"
            type="number"
            className="text-base text-gray-900"
          />
          <label className="flex items-center space-x-2 text-base text-gray-900">
            <input
              type="checkbox"
              name="inStock"
              checked={filters.inStock}
              onChange={handleFilterChange}
            />
            <span>In Stock Only</span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={resetFilters}>Reset</Button>
            <Button onClick={applyFilters} className="bg-indigo-600 text-white">
              Apply
            </Button>
          </div>
        </div>
      </Modal>

      {/* Advanced Product Form Modal */}
      <Modal
        isOpen={isAdvancedFormOpen}
        onClose={handleCloseAdvancedForm}
        title="Advanced Product Form"
      >
        {productForAdvancedForm && (
          <AdvancedProductForm
            product={productForAdvancedForm}
            onClose={handleCloseAdvancedForm}
          />
        )}
      </Modal>
    </div>
  );
}
