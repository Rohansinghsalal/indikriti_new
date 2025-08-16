// 'use client';

// import React, { useState } from 'react';
// import { FiPlus, FiLayers } from 'react-icons/fi';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { Button } from '@/components/ui';
// import ProductList from '@/components/products/ProductList';
// import api from '@/utils/api';

// export default function ProductsPage() {
//   const router = useRouter();
//   const [refreshKey, setRefreshKey] = useState(0);
  
//   const handleProductDelete = async (id: string) => {
//     try {
//       const response = await api.products.delete(id);
      
//       if (response.success) {
//         // Refresh the product list
//         setRefreshKey(prev => prev + 1);
//       } else {
//         console.error('Failed to delete product:', response.message);
//       }
//     } catch (error) {
//       console.error('Failed to delete product:', error);
//     }
//   };
  
//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-3">
//           <Link href="/dashboard/products/categories">
//             <Button variant="outline" className="w-full sm:w-auto">
//               <FiLayers className="mr-2" />
//               Manage Categories
//             </Button>
//           </Link>
//           <Link href="/dashboard/products/create">
//             <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">
//               <FiPlus className="mr-2" />
//               Add Product
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Products List */}
//       <div className="bg-white rounded-lg shadow">
//         <ProductList 
//           key={refreshKey}
//           onDelete={handleProductDelete} 
//         />
//       </div>
//     </div>
//   );
// }



'use client';

import React, { useState } from 'react';
import { FiPlus, FiLayers, FiEye } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';
import ProductList from '@/components/products/ProductList';
import EnhancedProductForm from '@/components/products/EnhancedProductForm';
import BrandCategoryManager from '@/components/products/BrandCategoryManager';
import Modal from '@/components/ui/Modal';
import ProductDetails from '@/components/products/ProductDetails'; 
import api from '@/utils/api';

export default function ProductsPage() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHierarchyOpen, setIsHierarchyOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProductDelete = async (id: string) => {
    try {
      const response = await api.products.delete(id);
      if (response.success) setRefreshKey(prev => prev + 1);
      else console.error('Delete failed:', response.message);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await api.products.create(formData);
      if (response.success) {
        setRefreshKey(prev => prev + 1);
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error('Failed to submit product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={() => setIsHierarchyOpen(true)}>
            <FiLayers className="mr-2" />
            Manage Categories
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => {
              setSelectedProduct(null);
              setIsFormOpen(true);
            }}
          >
            <FiPlus className="mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-lg shadow">
        <ProductList
          key={refreshKey}
          onDelete={handleProductDelete}
          onView={handleViewProduct}
          onEdit={(product) => {
            setSelectedProduct(product);
            setIsFormOpen(true);
          }}
        />
      </div>

      {/* Modal: Add/Edit Product */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Product Form" size="xl">
        <EnhancedProductForm
          initialData={selectedProduct}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Modal: View Product Details */}
      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Product Details" size="xl">
        {selectedProduct && <ProductDetails product={selectedProduct} />}
      </Modal>

      {/* Modal: Brand Category Manager */}
      <Modal isOpen={isHierarchyOpen} onClose={() => setIsHierarchyOpen(false)} title="Manage Brand Categories" size="xl">
        <BrandCategoryManager onClose={() => setIsHierarchyOpen(false)} />
      </Modal>
    </div>
  );
}

