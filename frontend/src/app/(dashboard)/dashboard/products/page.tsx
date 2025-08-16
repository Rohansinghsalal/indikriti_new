"use client";

import React, { useState } from "react";
import { FiPlus, FiLayers, FiEye, FiX } from "react-icons/fi";
import { Button } from "@/components/ui";
import Modal from "@/components/ui/Modal";
import EnhancedProductForm from "@/components/products/EnhancedProductForm";
import ProductList from "@/components/products/ProductList";
import ProductHierarchyManager from "@/components/products/ProductHierarchyManager";
import ProductDetails from "@/components/products/ProductDetails";
import { Product } from "@/components/products/Product";

export default function ProductsDashboardPage() {
  // ===== STATE MANAGEMENT =====
  
  // Products array - stores all products in local state
  const [products, setProducts] = useState<Product[]>([]);
  
  // Currently selected product for editing/viewing
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Modal visibility states
  const [isFormOpen, setIsFormOpen] = useState(false);        // Add/Edit form modal
  const [isHierarchyOpen, setIsHierarchyOpen] = useState(false); // Category management modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);   // Product details modal
  
  // Form submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ===== HELPER FUNCTIONS =====

  const safeToBase64 = (item: File | Blob | string): Promise<string> => {
    if (typeof item === "string") {
      // Already a URL or data-URL – no conversion needed
      // This prevents the "parameter 1 is not of type 'Blob'" error
      return Promise.resolve(item);
    }
    
    if (item instanceof File || item instanceof Blob) {
      // Only use FileReader for actual File/Blob objects
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(item);
      });
    }
    
    // Fallback for unexpected types
    return Promise.reject(new Error("Unsupported image type"));
  };

  // ===== EVENT HANDLERS =====

  const handleAddOrUpdateProduct = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      // ===== SAFE IMAGE PROCESSING =====
      
      // Get all image entries from FormData
      // Note: DO NOT cast to File[] as this causes the error!
      // formData.getAll() can return mixed types (File objects and strings)
      const freshFiles = formData.getAll("images");          // New uploads (File objects)
      const preservedUrls = formData.getAll("existingImages"); // Existing images (string URLs)
      
      // Combine all image inputs - this array may contain both File objects and strings
      const allImageInputs = [...freshFiles, ...preservedUrls];
      
      // Convert all images safely using our helper function
      // This prevents the FileReader error by checking types before conversion
      const images: string[] = await Promise.all(
        allImageInputs.map(safeToBase64)
      );

      // ===== BUILD PRODUCT OBJECT =====
      
      // Extract all form fields and create product object
      // Handle both creation (new ID) and update (existing ID) scenarios
      const now = new Date().toISOString();
      const newProduct: Product = {
        // ID handling: use existing ID for updates, generate new for creates
        id: selectedProduct?.id || Date.now().toString(),
        
        // Basic product information
        productId: (formData.get("productId") as string) || "",
        sku: (formData.get("sku") as string) || "",
        name: (formData.get("name") as string) || "",
        description: (formData.get("description") as string) || "",
        
        // Pricing fields
        mrp: Number(formData.get("mrp")) || 0,
        sellingPrice: Number(formData.get("sellingPrice")) || 0,
        price: Number(formData.get("price")) || Number(formData.get("sellingPrice")) || 0,
        salePrice: formData.get("salePrice") ? Number(formData.get("salePrice")) : undefined,
        finalPrice: formData.get("finalPrice") ? Number(formData.get("finalPrice")) : undefined,
        
        // Inventory
        stockQuantity: Number(formData.get("stockQuantity")) || 0,
        batchNo: (formData.get("batchNo") as string) || "",
        
        // Categorization
        productType: (formData.get("productType") as string) || "",
        productStyle: (formData.get("productStyle") as string) || "",
        category: (formData.get("category") as string) || "",
        subcategory: (formData.get("subcategory") as string) || "",
        brand: (formData.get("brand") as string) || "",
        
        // Status
        status: (formData.get("status") as "active" | "inactive" | "draft") || "draft",
        
        // Images - processed safely above
        images,
        image: images.length > 0 ? images[0] : "", // Main image is first in array
        
        // Timestamps
        createdAt: selectedProduct?.createdAt || now,
        updatedAt: now,
        
        // ===== ADVANCED FIELDS =====
        
        // Discounts and bonuses
        discount: formData.get("discount") ? Number(formData.get("discount")) : undefined,
        specialDiscount: formData.get("specialDiscount") ? Number(formData.get("specialDiscount")) : undefined,
        referralBonus: formData.get("referralBonus") ? Number(formData.get("referralBonus")) : undefined,
        loyaltyBonus: formData.get("loyaltyBonus") ? Number(formData.get("loyaltyBonus")) : undefined,
        
        // Extended description
        longDescription: (formData.get("longDescription") as string) || "",
        
        // USPs (Unique Selling Points)
        usp1: (formData.get("usp1") as string) || "",
        usp2: (formData.get("usp2") as string) || "",
        usp3: (formData.get("usp3") as string) || "",
        
        // Tax information
        hsn: (formData.get("hsn") as string) || "",
        gst: formData.get("gst") ? Number(formData.get("gst")) : undefined
      };

      // ===== UPDATE STATE =====
      
      // Update products array - either update existing or add new
      setProducts((prev) => {
        const existingIndex = prev.findIndex((p) => p.id === newProduct.id);
        
        if (existingIndex !== -1) {
          // Update existing product
          const updated = [...prev];
          updated[existingIndex] = newProduct;
          return updated;
        } else {
          // Add new product
          return [...prev, newProduct];
        }
      });

      // ===== CLEANUP UI STATE =====
      
      // Close form and reset selection
      setSelectedProduct(null);
      setIsFormOpen(false);
      
    } catch (err) {
      // Comprehensive error logging
      console.error("Error submitting product:", err);
      
      // In a production app, you might want to show a user-friendly error message
      // alert("Failed to save product. Please try again.");
      
    } finally {
      // Always reset loading state
      setIsSubmitting(false);
    }
  };

  /**
   * Handles product deletion
   * 
   * @param id - Product ID to delete
   */
  const handleDelete = (id: string) => {
    // Remove product from state
    setProducts((prev) => prev.filter((p) => p.id !== id));
    
    // If we were viewing/editing the deleted product, clear selection
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
      setIsFormOpen(false);
      setIsDetailsOpen(false);
    }
  };

  /**
   * Handles product editing
   * Opens the form modal with selected product data
   * 
   * @param product - Product to edit
   */
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
    // Close other modals if open
    setIsDetailsOpen(false);
  };

  /**
   * Handles product viewing
   * Opens the details modal for the selected product
   * 
   * @param product - Product to view
   */
  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
    // Close other modals if open
    setIsFormOpen(false);
  };

  /**
   * Handles adding a new product
   * Opens form modal with no pre-selected data
   */
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
    setIsDetailsOpen(false);
  };

  /**
   * Closes all modals and resets state
   */
  const closeAllModals = () => {
    setIsFormOpen(false);
    setIsDetailsOpen(false);
    setIsHierarchyOpen(false);
    setSelectedProduct(null);
  };

  // ===== RENDER =====
  
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ===== HEADER SECTION ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product inventory ({products.length} products)
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsHierarchyOpen(true)}
            className="flex items-center"
          >
            <FiLayers className="mr-2" />
            Manage Categories
          </Button>
          
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center"
            onClick={handleAddProduct}
          >
            <FiPlus className="mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* ===== PRODUCT LIST SECTION ===== */}
      <div className="bg-white rounded-lg shadow p-4">
        {products.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FiLayers className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first product.</p>
            <Button
              onClick={handleAddProduct}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <FiPlus className="mr-2" />
              Add Your First Product
            </Button>
          </div>
        ) : (
          // Product list
          <ProductList
            products={products}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onView={handleView}
          />
        )}
      </div>

      {/* ===== MODALS ===== */}

      {/* Modal: Add / Edit Product Form */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedProduct(null);
        }}
        title={selectedProduct ? "Edit Product" : "Add New Product"}
        size="xl"
      >
        <EnhancedProductForm
          initialData={selectedProduct ?? undefined}
          onSubmit={handleAddOrUpdateProduct}
          isSubmitting={isSubmitting}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedProduct(null);
          }}
        />
      </Modal>

      {/* Modal: Product Details View */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedProduct(null);
        }}
        title="Product Details"
        size="xl"
      >
        {selectedProduct && (
          <ProductDetails 
            product={selectedProduct}
            onEdit={() => handleEdit(selectedProduct)}
            onClose={() => {
              setIsDetailsOpen(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </Modal>

      {/* Modal: Product Hierarchy Management */}
      <Modal
        isOpen={isHierarchyOpen}
        onClose={() => setIsHierarchyOpen(false)}
        title="Manage Product Hierarchy"
        size="lg"
      >
        <ProductHierarchyManager 
          mode="manage"
          onClose={() => setIsHierarchyOpen(false)}
        />
      </Modal>
    </div>
  );
}
