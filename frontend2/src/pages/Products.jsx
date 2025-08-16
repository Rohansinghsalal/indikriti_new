import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/ui';
import { FiPlus } from 'react-icons/fi';
import ProductList from '../components/products/ProductList';
import ProductDetails from '../components/products/ProductDetails';
import ProductForm from '../components/products/ProductForm';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsProductFormOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Product deleted successfully');
        fetchProducts(); // Refresh the list
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    }
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      const url = selectedProduct
        ? `${API_BASE_URL}/products/${selectedProduct.id}`
        : `${API_BASE_URL}/products`;

      const method = selectedProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData // FormData with images
      });

      if (response.ok) {
        toast.success(selectedProduct ? 'Product updated successfully' : 'Product created successfully');
        setIsProductFormOpen(false);
        setSelectedProduct(null);
        fetchProducts(); // Refresh the list
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error saving product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product catalog
          </p>
        </div>
        <Button leftIcon={<FiPlus />} onClick={handleCreateProduct}>
          Add Product
        </Button>
      </div>

      {/* Product List Component */}
      <ProductList
        products={products}
        onView={handleViewProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Product Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Product Details"
        size="full"
      >
        {selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onClose={() => setIsDetailsModalOpen(false)}
          />
        )}
      </Modal>

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isProductFormOpen}
        onClose={() => {
          setIsProductFormOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />
    </div>
  );
};

export default Products;
