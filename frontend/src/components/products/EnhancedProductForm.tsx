// "use client";

// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { FiUpload, FiX, FiSave, FiInfo } from "react-icons/fi";
// import { Button, Input, Alert } from "@/components/ui";
// import ProductHierarchyManager from "./ProductHierarchyManager";
// import api from "@/utils/api";
// import { Product } from "./Product";

// interface EnhancedProductFormProps {
//   initialData?: Product;
//   onSubmit: (data: FormData) => void;
//   isSubmitting: boolean;
//   brandOptions?: { id: string; name: string }[];
// }

// export default function EnhancedProductForm({
//   initialData,
//   onSubmit,
//   isSubmitting,
//   brandOptions = [
//     { id: "indikriti", name: "Indikriti" },
//     { id: "winsomeLane", name: "Winsome Lane" },
//   ],
// }: EnhancedProductFormProps) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//     watch,
//   } = useForm<Product>({
//     defaultValues: initialData || {
//       productId: "",
//       sku: "",
//       name: "",
//       description: "",
//       mrp: 0,
//       sellingPrice: 0,
//       stockQuantity: 0,
//       batchNo: "",
//       productType: "",
//       category: "",
//       subcategory: "",
//       brand: "",
//       status: "draft",
//     },
//   });

//   const [selectedImages, setSelectedImages] = useState<File[]>([]);
//   const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
//   const [hasExistingImages, setHasExistingImages] = useState(false);
//   const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   // Watch the brand field to potentially filter product types
//   const selectedBrand = watch("brand");

//   useEffect(() => {
//     // Reset form when initialData changes
//     if (initialData) {
//       reset(initialData);

//       // If editing an existing product, it may have images
//       if (initialData.id) {
//         setHasExistingImages(true);
//         // In a real app, you would fetch existing images here
//         // For now, we'll use placeholders
//         setExistingImageUrls([
//           "/assets/images/placeholder.jpg",
//           "/assets/images/placeholder.jpg",
//         ]);
//       }
//     }
//   }, [initialData, reset]);

//   const handleHierarchySelect = (data: {
//     productType: string;
//     category: string;
//     subcategory: string;
//   }) => {
//     setValue("productType", data.productType);
//     setValue("category", data.category);
//     setValue("subcategory", data.subcategory);
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     const newFiles = Array.from(files);

//     if (newFiles.length > 3) {
//       setError("Maximum 3 images allowed");
//       return;
//     }

//     setSelectedImages(newFiles);

//     // Generate preview URLs
//     const newImageUrls: string[] = [];

//     newFiles.forEach((file) => {
//       const url = URL.createObjectURL(file);
//       newImageUrls.push(url);
//     });

//     setImagePreviewUrls(newImageUrls);
//     setError(null);
//   };

//   const removeImage = (index: number) => {
//     setSelectedImages((prev) => {
//       const newFiles = [...prev];
//       newFiles.splice(index, 1);
//       return newFiles;
//     });

//     setImagePreviewUrls((prev) => {
//       const newUrls = [...prev];
//       URL.revokeObjectURL(newUrls[index]);
//       newUrls.splice(index, 1);
//       return newUrls;
//     });
//   };

//   const removeExistingImage = (index: number) => {
//     setExistingImageUrls((prev) => {
//       const newUrls = [...prev];
//       newUrls.splice(index, 1);
//       return newUrls;
//     });
//   };

//   const handleFormSubmit = (data: Product) => {
    
//     if (selectedImages.length === 0 && !hasExistingImages) {
//       setError("At least one product image is required");
//       return;
//     }

//     const formData = new FormData();

//     // Add product data to FormData
//     Object.entries(data).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         formData.append(key, value.toString());
//       }
//     });

//     // Add images to FormData
//     selectedImages.forEach((image, index) => {
//       formData.append(`images`, image);
//     });

//     // Add existing image URLs if needed
//     existingImageUrls.forEach((url, index) => {
//       formData.append(`existingImages`, url);
//     });

//     onSubmit(formData);
    
//   };

//   return (
//     <form
//       onSubmit={handleSubmit((data) => {
        
//         handleFormSubmit(data);
//       })}
//       className="space-y-6"
//     >
//       {error && <Alert variant="error">{error}</Alert>}

//       <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
//         <div className="flex items-start">
//           <FiInfo className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
//           <div>
//             <h4 className="font-medium text-blue-800">Product Hierarchy</h4>
//             <p className="text-sm text-blue-600 mt-1">
//               Select the product type, category, and subcategory for this
//               product.
//             </p>
//           </div>
//         </div>

//         <div className="mt-3">
//           <ProductHierarchyManager
//             onSelect={handleHierarchySelect}
//             mode="view"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <Input
//             label="Product ID"
//             {...register("productId", {
//               required: "Product ID is required",
//             })}
//             error={errors.productId?.message}
//             placeholder="Enter product ID"
//           />
//         </div>

//         <div>
//           <Input
//             label="SKU Number"
//             {...register("sku", { required: "SKU is required" })}
//             error={errors.sku?.message}
//             placeholder="Enter product SKU"
//           />
//         </div>

//         <div>
//           <Input
//             label="Product Name"
//             {...register("name", { required: "Product name is required" })}
//             error={errors.name?.message}
//             placeholder="Enter product name"
//           />
//         </div>

//         <div>
//           <Input
//             label="Batch Number"
//             {...register("batchNo")}
//             error={errors.batchNo?.message}
//             placeholder="Enter batch number (optional)"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Brand
//           </label>
//           <select
//             {...register("brand", { required: "Brand is required" })}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="">Select Brand</option>
//             {brandOptions.map((brand) => (
//               <option key={brand.id} value={brand.id}>
//                 {brand.name}
//               </option>
//             ))}
//           </select>
//           {errors.brand && (
//             <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Status
//           </label>
//           <select
//             {...register("status")}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="draft">Draft</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//         </div>

//         <div>
//           <Input
//             type="number"
//             label="MRP (₹)"
//             {...register("mrp", {
//               required: "MRP is required",
//               min: { value: 0, message: "MRP must be greater than 0" },
//             })}
//             error={errors.mrp?.message}
//             placeholder="0.00"
//           />
//         </div>

//         <div>
//           <Input
//             type="number"
//             label="Selling Price (₹)"
//             {...register("sellingPrice")}
//             placeholder="0.00"
//           />
//         </div>

//         <div>
//           <Input
//             type="number"
//             label="Stock Quantity"
//             {...register("stockQuantity", {
//               required: "Stock quantity is required",
//               min: { value: 0, message: "Stock quantity must be 0 or greater" },
//             })}
//             error={errors.stockQuantity?.message}
//             placeholder="0"
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Description
//         </label>
//         <textarea
//           {...register("description")}
//           rows={4}
//           className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           placeholder="Enter product description (optional)"
//         ></textarea>
//         {errors.description && (
//           <p className="mt-1 text-sm text-red-600">
//             {errors.description.message}
//           </p>
//         )}
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Product Images <span className="text-red-500">*</span>
//           <span className="text-sm text-gray-500 ml-1">
//             (Up to 3 images, first image will be the main product image)
//           </span>
//         </label>

//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//           <input
//             type="file"
//             id="product-images"
//             className="hidden"
//             multiple
//             accept="image/*"
//             onChange={handleImageChange}
//           />
//           <label
//             htmlFor="product-images"
//             className="cursor-pointer flex flex-col items-center justify-center"
//           >
//             <FiUpload className="h-12 w-12 text-gray-400" />
//             <span className="mt-2 text-sm text-gray-500">
//               Click to upload images (PNG, JPG)
//             </span>
//           </label>
//         </div>

//         {/* Image previews */}
//         {(imagePreviewUrls.length > 0 || existingImageUrls.length > 0) && (
//           <div className="mt-4">
//             <h4 className="text-sm font-medium text-gray-700 mb-2">
//               Uploaded Images
//             </h4>
//             <div className="grid grid-cols-3 gap-4">
//               {imagePreviewUrls.map((url, index) => (
//                 <div key={`new-${index}`} className="relative">
//                   <img
//                     src={url}
//                     alt={`Preview ${index + 1}`}
//                     className="h-24 w-24 object-cover rounded-md"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(index)}
//                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
//                   >
//                     <FiX className="h-4 w-4" />
//                   </button>
//                 </div>
//               ))}

//               {existingImageUrls.map((url, index) => (
//                 <div key={`existing-${index}`} className="relative">
//                   <img
//                     src={url}
//                     alt={`Existing ${index + 1}`}
//                     className="h-24 w-24 object-cover rounded-md"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeExistingImage(index)}
//                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
//                   >
//                     <FiX className="h-4 w-4" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="flex justify-end space-x-3">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => window.history.back()}
//         >
//           Cancel
//         </Button>

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
//         >
//           <FiSave className="mr-2 inline" />
//           {initialData?.id ? "Update Product" : "Save Product"}
//         </button>
//       </div>
//     </form>
//   );
// }



"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiUpload, FiX, FiSave, FiInfo } from "react-icons/fi";
import { Button, Input, Alert } from "@/components/ui";
import ProductHierarchyManager from "./ProductHierarchyManager";
import api from "@/utils/api";
import { Product } from "./Product";

interface EnhancedProductFormProps {
  initialData?: Product;
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
  brandOptions?: { id: string; name: string }[];
  onClose?: () => void;
}

// --- Helpers for localStorage management ---

function getLocalProducts() {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("productFormData");
    return data ? JSON.parse(data) : [];
  }
  return [];
}

function saveLocalProducts(products: any[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("productFormData", JSON.stringify(products));
  }
}

const PLACEHOLDER_IMAGE = "https://placehold.co/150x150.jpg";

export default function EnhancedProductForm({
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
  brandOptions = [
    { id: "indikriti", name: "Indikriti" },
    { id: "winsomeLane", name: "Winsome Lane" },
  ],
}: EnhancedProductFormProps) {
  // --- Form initialization with react-hook-form ---
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<Product>({
    defaultValues: initialData || {
      productId: "",
      sku: "",
      name: "",
      description: "",
      mrp: 0,
      sellingPrice: 0,
      stockQuantity: 0,
      batchNo: "",
      productType: "",
      category: "",
      subcategory: "",
      brand: "",
      status: "draft",
    },
  });

  // --- State for images and UI feedback ---
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [hasExistingImages, setHasExistingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedBrand = watch("brand");

  useEffect(() => {
    if (initialData) {
      reset(initialData);

      if (initialData.id && initialData.images && Array.isArray(initialData.images)) {
        setHasExistingImages(true);

        const urls: string[] = [];
        initialData.images.forEach((img: any) => {
          if (typeof img === "string" && img.trim() !== "") {
            urls.push(img);
          }
        });
        setExistingImageUrls(urls.length ? urls : [PLACEHOLDER_IMAGE]);
      } else {
        setHasExistingImages(false);
        setExistingImageUrls([]);
      }
    }
  }, [initialData, reset]);

  const handleHierarchySelect = (data: {
    productType: string;
    category: string;
    subcategory: string;
  }) => {
    setValue("productType", data.productType);
    setValue("category", data.category);
    setValue("subcategory", data.subcategory);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    if (newFiles.length > 3) {
      setError("Maximum 3 images allowed");
      return;
    }
    setSelectedImages(newFiles);

    const newImageUrls: string[] = [];
    newFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      newImageUrls.push(url);
    });

    setImagePreviewUrls(newImageUrls);
    setError(null);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });

    setImagePreviewUrls((prev) => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]);
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImageUrls((prev) => {
      const newUrls = [...prev];
      newUrls.splice(index, 1);
      if (newUrls.length === 0) return [PLACEHOLDER_IMAGE];
      return newUrls;
    });
  };

  const handleFormSubmit = (data: Product) => {
    if (selectedImages.length === 0 && (!hasExistingImages || existingImageUrls.length === 0)) {
      setError("At least one product image is required");
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    selectedImages.forEach((image) => {
      formData.append(`images`, image);
    });
    existingImageUrls.forEach((url) => {
      formData.append(`existingImages`, url);
    });

    let products = getLocalProducts();
    const localProduct = {
      ...data,
      id: initialData?.id || Date.now().toString(),
      images: [...imagePreviewUrls, ...existingImageUrls],
      updatedAt: new Date().toISOString(),
    };

    const idx = products.findIndex((item: any) => item.id === localProduct.id);
    if (idx >= 0) {
      products[idx] = localProduct;
    } else {
      products.push(localProduct);
    }
    saveLocalProducts(products);

    onSubmit(formData);
  };

  // MAIN FORM
  return (
    <form
      onSubmit={handleSubmit((data) => {
        handleFormSubmit(data);
      })}
      className="space-y-6"
    >
      {error && <Alert variant="error">{error}</Alert>}

      {/* Product Hierarchy Selection */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <div className="flex items-start">
          <FiInfo className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800">Product Hierarchy</h4>
            <p className="text-sm text-blue-700 mt-1">
              Select the product type, category, and subcategory for this
              product.
            </p>
          </div>
        </div>
        <div className="mt-3">
          <ProductHierarchyManager
            onSelect={handleHierarchySelect}
            mode="view"
          />
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Product ID"
            {...register("productId", {
              required: "Product ID is required",
            })}
            error={errors.productId?.message}
            placeholder="Enter product ID"
            className="text-gray-900"
          />
        </div>
        <div>
          <Input
            label="SKU Number"
            {...register("sku", { required: "SKU is required" })}
            error={errors.sku?.message}
            placeholder="Enter product SKU"
            className="text-gray-900"
          />
        </div>
        <div>
          <Input
            label="Product Name"
            {...register("name", { required: "Product name is required" })}
            error={errors.name?.message}
            placeholder="Enter product name"
            className="text-gray-900"
          />
        </div>
        <div>
          <Input
            label="Batch Number"
            {...register("batchNo")}
            error={errors.batchNo?.message}
            placeholder="Enter batch number (optional)"
            className="text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Brand
          </label>
          <select
            {...register("brand", { required: "Brand is required" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          >
            <option value="">Select Brand</option>
            {brandOptions.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors.brand && (
            <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Status
          </label>
          <select
            {...register("status")}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <Input
            type="number"
            label="MRP (₹)"
            {...register("mrp", {
              required: "MRP is required",
              min: { value: 0, message: "MRP must be greater than 0" },
            })}
            error={errors.mrp?.message}
            placeholder="0.00"
            className="text-gray-900"
          />
        </div>
        <div>
          <Input
            type="number"
            label="Selling Price (₹)"
            {...register("sellingPrice")}
            placeholder="0.00"
            className="text-gray-900"
          />
        </div>
        <div>
          <Input
            type="number"
            label="Stock Quantity"
            {...register("stockQuantity", {
              required: "Stock quantity is required",
              min: { value: 0, message: "Stock quantity must be 0 or greater" },
            })}
            error={errors.stockQuantity?.message}
            placeholder="0"
            className="text-gray-900"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          placeholder="Enter product description (optional)"
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Product Images */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Product Images <span className="text-red-500">*</span>
          <span className="text-sm text-gray-500 ml-1">
            (Up to 3 images, first image will be the main product image)
          </span>
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            id="product-images"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="product-images"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <FiUpload className="h-12 w-12 text-gray-400" />
            <span className="mt-2 text-sm text-gray-700">
              Click to upload images (PNG, JPG)
            </span>
          </label>
        </div>

        {(imagePreviewUrls.length > 0 || existingImageUrls.length > 0) && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-800 mb-2">
              Uploaded Images
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {imagePreviewUrls.map((url, index) => (
                <div key={`new-${index}`} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow focus:outline-none focus:ring-2 focus:ring-red-200 transition"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {existingImageUrls.map((url, index) => (
                <div key={`existing-${index}`} className="relative">
                  <img
                    src={url || PLACEHOLDER_IMAGE}
                    alt={`Existing ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow focus:outline-none focus:ring-2 focus:ring-red-200 transition"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-3 mt-4">
        <Button
          type="button"
          variant="outline"
          className="border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-700 focus:ring-indigo-200 focus:ring-2 shadow-sm transition px-4 py-2 rounded-lg font-medium flex items-center"
          onClick={() => {
            if (onClose) onClose();
            else reset();
          }}
        >
          <FiX className="mr-2 -ml-1" />
          Cancel
        </Button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition flex items-center disabled:opacity-50"
        >
          <FiSave className="mr-2" />
          {initialData?.id ? "Update Product" : "Save Product"}
        </button>
      </div>
    </form>
  );
}
