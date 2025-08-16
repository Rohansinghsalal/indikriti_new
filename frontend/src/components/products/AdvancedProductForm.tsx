"use client";
import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Product } from "./Product";
import { FiUpload } from "react-icons/fi";
import { api } from "@/utils/api";
import {
  Brand,
  Category,
  Subcategory,
  ProductType
} from "@/types/product";

// Props for the AdvancedProductForm component
interface AdvancedProductFormProps {
  product: Product;
  onClose: () => void;
  onSave?: (product: Product) => void;
}

export default function AdvancedProductForm({
  product,
  onClose,
  onSave,
}: AdvancedProductFormProps) {
  // State to hold base64 image previews for upload and input ref for file dialog
  const [imagePreviews, setImagePreviews] = useState<string[]>(product.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for USPs (Unique Selling Propositions), initialized from product or with a blank
  const [usps, setUsps] = useState<string[]>(
    (product.usps && product.usps.length > 0) ? product.usps : [""]
  );

  // Brand-specific category state
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  // Selected values state
  const [selectedBrand, setSelectedBrand] = useState<string>(product.brand || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedProductType, setSelectedProductType] = useState<string>('');

  // Loading states
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [loadingProductTypes, setLoadingProductTypes] = useState(false);

  // Load brands on component mount
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const response = await api.brandCategories.getBrands();
        if (response.success) {
          setBrands(response.data);
        }
      } catch (error) {
        console.error('Error loading brands:', error);
      }
    };
    loadBrands();
  }, []);

  // Load categories when brand is selected
  useEffect(() => {
    if (selectedBrand) {
      const loadCategories = async () => {
        setLoadingCategories(true);
        try {
          const response = await api.brandCategories.getByBrand(selectedBrand);
          if (response.success) {
            setCategories(response.data);
          }
        } catch (error) {
          console.error('Error loading categories:', error);
        } finally {
          setLoadingCategories(false);
        }
      };
      loadCategories();

      // Reset dependent selections
      setSelectedCategory('');
      setSelectedSubcategory('');
      setSelectedProductType('');
      setSubcategories([]);
      setProductTypes([]);
    }
  }, [selectedBrand]);

  // Load subcategories when category is selected
  useEffect(() => {
    if (selectedBrand && selectedCategory) {
      const loadSubcategories = async () => {
        setLoadingSubcategories(true);
        try {
          const response = await api.enhanced4LevelHierarchy.getSubcategories(selectedBrand, parseInt(selectedCategory));
          if (response.success) {
            setSubcategories(response.data);
          }
        } catch (error) {
          console.error('Error loading subcategories:', error);
        } finally {
          setLoadingSubcategories(false);
        }
      };
      loadSubcategories();

      // Reset dependent selections
      setSelectedSubcategory('');
      setSelectedProductType('');
      setProductTypes([]);
    }
  }, [selectedBrand, selectedCategory]);

  // Load product types when subcategory is selected
  useEffect(() => {
    if (selectedBrand && selectedSubcategory) {
      const loadProductTypes = async () => {
        setLoadingProductTypes(true);
        try {
          const response = await api.enhanced4LevelHierarchy.getProductTypes(selectedBrand, parseInt(selectedSubcategory));
          if (response.success) {
            setProductTypes(response.data);
          }
        } catch (error) {
          console.error('Error loading product types:', error);
        } finally {
          setLoadingProductTypes(false);
        }
      };
      loadProductTypes();

      // Reset dependent selection
      setSelectedProductType('');
    }
  }, [selectedBrand, selectedSubcategory]);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<Product>({
    defaultValues: {
      ...product,
      productType: product.productType || "",
      productStyle: product.productStyle || "",
      discount: product.discount ?? 0,
      salePrice: product.salePrice ?? 0,
      specialDiscount: product.specialDiscount ?? 0,
      finalPrice: product.finalPrice ?? 0,
      referralBonus: product.referralBonus ?? 0,
      loyaltyBonus: product.loyaltyBonus ?? 0,
      hsn: product.hsn ?? "",
      gst: product.gst ?? 0,
      longDescription: product.longDescription ?? "",
      usps: (product.usps && product.usps.length > 0) ? product.usps : [""],
      images: product.images || [],
    }
  });

  // Sync USPs state with form whenever it changes
  useEffect(() => {
    setValue("usps", usps);
  }, [usps, setValue]);

  // Handle USP field changes
  const handleUSPChange = (idx: number, value: string) => {
    setUsps(arr => {
      const next = [...arr];
      next[idx] = value;
      return next;
    });
  };

  // Add a blank USP (up to 10 max)
  const addUSP = () => {
    if (usps.length < 10) setUsps([...usps, ""]);
  };

  // Remove a USP (if at least one remains)
  const removeUSP = (idx: number) => {
    if (usps.length <= 1) return;
    setUsps(arr => arr.filter((_, i) => i !== idx));
  };

  // Handle file input changes for uploading images
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    // Restrict to maximum of 3 images
    const filesToProcess = files.slice(0, 3 - imagePreviews.length);
    // Convert files to base64 for previews
    const filePreviews = await Promise.all(
      filesToProcess.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );
    // Add new previews and cap at 3 images
    const updatedPreviews = [...imagePreviews, ...filePreviews].slice(0, 3);
    setImagePreviews(updatedPreviews);
    setValue("images", updatedPreviews as any, { shouldValidate: true });
  };

  // Remove selected image at given index
  const handleRemoveImage = (idx: number) => {
    const updated = imagePreviews.filter((_, i) => i !== idx);
    setImagePreviews(updated);
    setValue("images", updated as any, { shouldValidate: true });
  };

  // Handle form submission: structure data and POST to API
  const onSubmit = async (values: Product) => {
    try {
      // Validate required brand-specific fields
      if (!selectedBrand) {
        alert('Please select a brand');
        return;
      }
      if (!selectedCategory) {
        alert('Please select a category');
        return;
      }
      if (!selectedSubcategory) {
        alert('Please select a subcategory');
        return;
      }
      if (!selectedProductType) {
        alert('Please select a product type');
        return;
      }

      const uspsSafe = values.usps || [];

      // Map frontend field names to backend expected field names
      const productData = {
        name: values.name,
        description: values.description,
        productType: values.productType,
        productStyle: values.productStyle,
        discount: values.discount,
        salePrice: values.salePrice,
        specialDiscount: values.specialDiscount,
        finalPrice: values.finalPrice,
        referralBonus: values.referralBonus,
        loyaltyBonus: values.loyaltyBonus,
        hsn: values.hsn,
        gst: values.gst,
        longDescription: values.longDescription,
        usp1: uspsSafe[0] || "",
        usp2: uspsSafe[1] || "",
        usp3: uspsSafe[2] || "",
        usps: uspsSafe,
        images: imagePreviews,

        // Required fields
        mrp: values.finalPrice || values.salePrice || 0,
        selling_price: values.salePrice || values.finalPrice || 0,
        stock_quantity: 0,
        batch_no: "",
        status: "active",

        // Brand-specific hierarchy fields (new format)
        brand: selectedBrand,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory,
        productTypeId: selectedProductType,

        // Legacy fields for backward compatibility
        category_id: selectedCategory,
        subcategory_id: selectedSubcategory,
        product_type_id: 1 // Default fallback
      };

      const response = await api.products.create(productData);

      console.log('API Response:', response);

      // Handle different response formats
      if (response.success || response.id || response.data) {
        console.log('Product created successfully:', response);
        const productData = response.data || response;
        onSave?.(productData);
        onClose();
        alert('Product created successfully!');
      } else {
        console.error('Failed to create product:', response);
        alert(`Failed to create product: ${response.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Error creating product:', error);

      // Handle different error formats
      let errorMessage = 'Failed to create product. Please check your connection and try again.';

      if (error.response?.data) {
        const errorData = error.response.data;
        errorMessage = errorData.message || errorData.error || errorMessage;

        if (errorData.details) {
          console.error('Error details:', errorData.details);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  // Render form fields
  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-gray-300"
    >
      {/* Form Header */}
      <div className="rounded-md bg-blue-100 p-5 mb-8">
        <h3 className="font-semibold text-blue-900 text-lg">Advanced Product Fields</h3>
        <p className="text-blue-800 text-base">
          Fill in advanced product details to better describe and promote your products.
        </p>
      </div>
      {/* Brand-specific category selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          {/* Brand Selection */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand *
          </label>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className={`!bg-white !text-gray-900 ${!selectedBrand ? '!border-red-400' : '!border-gray-400'}`}>
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!selectedBrand && (
            <p className="text-red-500 text-sm mt-1">Brand is required</p>
          )}
        </div>

        <div>
          {/* Category Selection */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            disabled={!selectedBrand || loadingCategories}
          >
            <SelectTrigger className={`!bg-white !text-gray-900 ${!selectedCategory && selectedBrand ? '!border-red-400' : '!border-gray-400'}`}>
              <SelectValue placeholder={loadingCategories ? "Loading..." : "Select category"} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!selectedCategory && selectedBrand && (
            <p className="text-red-500 text-sm mt-1">Category is required</p>
          )}
        </div>

        <div>
          {/* Subcategory Selection */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subcategory *
          </label>
          <Select
            value={selectedSubcategory}
            onValueChange={setSelectedSubcategory}
            disabled={!selectedCategory || loadingSubcategories}
          >
            <SelectTrigger className={`!bg-white !text-gray-900 ${!selectedSubcategory && selectedCategory ? '!border-red-400' : '!border-gray-400'}`}>
              <SelectValue placeholder={loadingSubcategories ? "Loading..." : "Select subcategory"} />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!selectedSubcategory && selectedCategory && (
            <p className="text-red-500 text-sm mt-1">Subcategory is required</p>
          )}
        </div>

        <div>
          {/* Product Type Selection */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Type *
          </label>
          <Select
            value={selectedProductType}
            onValueChange={setSelectedProductType}
            disabled={!selectedSubcategory || loadingProductTypes}
          >
            <SelectTrigger className={`!bg-white !text-gray-900 ${!selectedProductType && selectedSubcategory ? '!border-red-400' : '!border-gray-400'}`}>
              <SelectValue placeholder={loadingProductTypes ? "Loading..." : "Select product type"} />
            </SelectTrigger>
            <SelectContent>
              {productTypes.map((productType) => (
                <SelectItem key={productType.id} value={productType.id.toString()}>
                  {productType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!selectedProductType && selectedSubcategory && (
            <p className="text-red-500 text-sm mt-1">Product type is required</p>
          )}
        </div>
      </div>

      {/* Product fields in a responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {/* Product Type field - Required */}
          <Input
            label="Product Type Description"
            className="mb-2 !bg-white !border-gray-400 !text-gray-900"
            {...register("productType", { required: "Product type description is required" })}
            error={errors.productType?.message}
            placeholder="Enter product type description"
          />
        </div>
        <div>
          {/* Product Style field */}
          <Input
            label="Product Style"
            className="mb-2 !bg-white !border-gray-400 !text-gray-900"
            {...register("productStyle")}
            error={errors.productStyle?.message}
            placeholder="Enter product style"
          />
        </div>
        <div>
          {/* Discount */}
          <Input
            label="Discount"
            type="number"
            className="mb-2 !bg-white !border-gray-400 !text-gray-900"
            {...register("discount")}
            error={errors.discount?.message}
            placeholder="0"
          />
        </div>
        <div>
          {/* Sale Price */}
          <Input
            label="Sale Price"
            type="number"
            className="mb-2 !bg-white !border-gray-400 !text-gray-900"
            {...register("salePrice")}
            error={errors.salePrice?.message}
            placeholder="Sale price"
          />
        </div>
        <div>
          {/* Special Discount */}
          <Input
            label="Special Discount"
            type="number"
            className="mb-2 !bg-white !border-gray-400 !text-gray-900"
            {...register("specialDiscount")}
            error={errors.specialDiscount?.message}
            placeholder="0"
          />
        </div>
        <div>
          {/* Final Price */}
          <Input
            label="Final Price"
            type="number"
            className="mb-2 !bg-white !border-gray-400 !text-gray-900"
            {...register("finalPrice")}
            error={errors.finalPrice?.message}
            placeholder="0"
          />
        </div>
        <div>
          {/* Referral Bonus */}
          <Input
            label="Referral Bonus"
            type="number"
            className="mb-2 !bg-white !border-gray-400 !text-gray-900"
            {...register("referralBonus")}
            error={errors.referralBonus?.message}
            placeholder="0"
          />
        </div>
        <div>
          {/* Loyalty Bonus */}
          <Input
            label="Loyalty Bonus"
            type="number"
            className="mb-2 !bg-white !border-gray-400 !text-gray-900"
            {...register("loyaltyBonus")}
            error={errors.loyaltyBonus?.message}
            placeholder="0"
          />
        </div>

        {/* Dynamic USPs Section */}
        {usps.map((usp, idx) => (
          <div key={idx} className="flex items-center gap-2 w-full">
            <Input
              label={`Product USP ${idx + 1}`}
              value={usp}
              className="flex-1 !bg-white !border-gray-400 !text-gray-900"
              onChange={e => handleUSPChange(idx, e.target.value)}
              placeholder={`USP ${idx + 1}`}
            />
            {/* Show remove button if more than 1 USP */}
            {usps.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-5"
                onClick={() => removeUSP(idx)}
                aria-label="Remove this USP"
              >Remove</Button>
            )}
          </div>
        ))}
      </div>

      {/* Add more USP button */}
      {usps.length < 10 && (
        <div className="flex justify-center mt-3 mb-4">
          <Button
            type="button"
            onClick={addUSP}
            variant="outline"
            size="md"
            className="min-w-[170px]"
          >
            Add More USP
          </Button>
        </div>
      )}

      {/* Additional product fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          {/* HSN code */}
          <Input
            label="HSN"
            className="mb-2 !bg-white !border-gray-400 !text-gray-900"
            {...register("hsn")}
            error={errors.hsn?.message}
            placeholder="HSN"
          />
        </div>
        <div>
          {/* GST */}
          <Input
            label="GST"
            type="number"
            className="mb-2 !bg-white !border-gray-400 !text-gray-900"
            {...register("gst")}
            error={errors.gst?.message}
            placeholder="0"
          />
        </div>
        {/* Product Images Upload */}
        <div className="md:col-span-2 mt-2">
          <label className="block font-medium text-base mb-2 text-gray-800">
            Product Images <span className="text-red-600">*</span>
            <span className="ml-1 font-normal text-xs text-gray-600">
              (Up to 3 images, first image will be the main product image)
            </span>
          </label>
          {/* Image upload box */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:border-purple-400 transition ${imagePreviews.length >= 3 ? "opacity-60 pointer-events-none" : ""}`}
            onClick={() => imagePreviews.length < 3 && fileInputRef.current?.click()}
          >
            <FiUpload className="w-8 h-8 text-purple-500 mb-2" />
            <span className="text-gray-700 text-base font-medium">
              Click to upload images (PNG, JPG)
            </span>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/png, image/jpg, image/jpeg"
              multiple
              onChange={handleImageChange}
              disabled={imagePreviews.length >= 3}
            />
          </div>
          {/* Render previews of uploaded images */}
          {imagePreviews.length > 0 && (
            <div className="flex mt-4 gap-4">
              {imagePreviews.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Product ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded border border-gray-400"
                  />
                  {/* Remove button for each image */}
                  <button
                    type="button"
                    className="absolute -top-3 -right-3 bg-white rounded-full p-1 border border-red-200 shadow hover:bg-red-100"
                    onClick={() => handleRemoveImage(idx)}
                  >
                    <span className="text-red-600 font-bold text-lg">&times;</span>
                  </button>
                  {/* Label first image as Main */}
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Long Description */}
      <div className="mt-8">
        <label className="block text-base font-semibold text-gray-800 mb-2">
          Product Long Description
        </label>
        <textarea
          {...register("longDescription")}
          placeholder="Product long description"
          className="block w-full border border-gray-400 rounded px-3 py-2 bg-white text-gray-900 text-base"
          rows={4}
        />
        {/* Validation error */}
        {errors.longDescription && (
          <span className="text-red-600 text-sm">{errors.longDescription.message}</span>
        )}
      </div>
      {/* Form actions: Cancel and Save */}
      <div className="flex justify-end gap-3 mt-8">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Save Product
        </Button>
      </div>
    </form>
  );
}



//If you want to see what this advanceform sends data then below code will word.

// "use client";
// import React, { useRef, useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { Product } from "./Product";
// import { FiUpload } from "react-icons/fi";

// interface AdvancedProductFormProps {
//   product: Product;
//   onClose: () => void;
//   onSave?: (product: Product) => void;
// }

// export default function AdvancedProductForm({
//   product,
//   onClose,
//   onSave,
// }: AdvancedProductFormProps) {
//   // Product Images state and logic
//   const [imagePreviews, setImagePreviews] = useState<string[]>(product.images || []);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // USPs state: always at least one (USP 1) visible
//   const [usps, setUsps] = useState<string[]>(
//     (product.usps && product.usps.length > 0) ? product.usps : [""]
//   );

//   const [lastSubmitted, setLastSubmitted] = useState<Product | null>(null); // <-- Add this for debug display

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors, isSubmitting }
//   } = useForm<Product>({
//     defaultValues: {
//       ...product,
//       productType: product.productType || "",
//       productStyle: product.productStyle || "",
//       discount: product.discount ?? 0,
//       salePrice: product.salePrice ?? 0,
//       specialDiscount: product.specialDiscount ?? 0,
//       finalPrice: product.finalPrice ?? 0,
//       referralBonus: product.referralBonus ?? 0,
//       loyaltyBonus: product.loyaltyBonus ?? 0,
//       hsn: product.hsn ?? "",
//       gst: product.gst ?? 0,
//       longDescription: product.longDescription ?? "",
//       usps: (product.usps && product.usps.length > 0) ? product.usps : [""],
//       images: product.images || [],
//     }
//   });

//   // Sync dynamic usps state to the form
//   useEffect(() => {
//     setValue("usps", usps);
//   }, [usps, setValue]);

//   // USP dynamic handlers
//   const handleUSPChange = (idx: number, value: string) => {
//     setUsps(arr => {
//       const next = [...arr];
//       next[idx] = value;
//       return next;
//     });
//   };
//   const addUSP = () => {
//     if (usps.length < 10) setUsps([...usps, ""]);
//   };
//   const removeUSP = (idx: number) => {
//     if (usps.length <= 1) return;
//     setUsps(arr => arr.filter((_, i) => i !== idx));
//   };

//   // Images upload
//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     if (!files.length) return;
//     const filesToProcess = files.slice(0, 3 - imagePreviews.length);
//     const filePreviews = await Promise.all(
//       filesToProcess.map(file => {
//         return new Promise<string>((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = () => resolve(reader.result as string);
//           reader.onerror = reject;
//           reader.readAsDataURL(file);
//         });
//       })
//     );
//     const updatedPreviews = [...imagePreviews, ...filePreviews].slice(0, 3);
//     setImagePreviews(updatedPreviews);
//     setValue("images", updatedPreviews as any, { shouldValidate: true });
//   };

//   const handleRemoveImage = (idx: number) => {
//     const updated = imagePreviews.filter((_, i) => i !== idx);
//     setImagePreviews(updated);
//     setValue("images", updated as any, { shouldValidate: true });
//   };

//   // Submission
//   const onSubmit = async (values: Product) => {
//     const uspsSafe = values.usps || [];
//     const finalValues: Product = {
//       ...values,
//       usp1: uspsSafe[0] || "",
//       usp2: uspsSafe[1] || "",
//       usp3: uspsSafe[2] || "",
//       usps: uspsSafe,
//       images: imagePreviews,
//     };
//     setLastSubmitted(finalValues); // <-- store for display, before await
//     try {
//       await fetch("/api/products/update", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(finalValues),
//       });
//     } catch (err) {
//       // Optionally handle error
//     }
//     onSave?.(finalValues);
//     // onClose();
//     // Do not close modal immediately so you can see the values. Comment back in for production.
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="rounded-md bg-blue-50 p-4 mb-6">
//           <h3 className="font-medium text-blue-800">Advanced Product Fields</h3>
//           <p className="text-blue-700 text-sm">
//             Fill in advanced product details to better describe and promote your products.
//           </p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <Input
//               label="Product Type"
//               {...register("productType", { required: "Product type is required" })}
//               error={errors.productType?.message}
//               placeholder="Enter product type"
//             />
//           </div>
//           <div>
//             <Input
//               label="Product Style"
//               {...register("productStyle")}
//               error={errors.productStyle?.message}
//               placeholder="Enter product style"
//             />
//           </div>
//           <div>
//             <Input
//               label="Discount"
//               type="number"
//               {...register("discount")}
//               error={errors.discount?.message}
//               placeholder="0"
//             />
//           </div>
//           <div>
//             <Input
//               label="Sale Price"
//               type="number"
//               {...register("salePrice")}
//               error={errors.salePrice?.message}
//               placeholder="Sale price"
//             />
//           </div>
//           <div>
//             <Input
//               label="Special Discount"
//               type="number"
//               {...register("specialDiscount")}
//               error={errors.specialDiscount?.message}
//               placeholder="0"
//             />
//           </div>
//           <div>
//             <Input
//               label="Final Price"
//               type="number"
//               {...register("finalPrice")}
//               error={errors.finalPrice?.message}
//               placeholder="0"
//             />
//           </div>
//           <div>
//             <Input
//               label="Referral Bonus"
//               type="number"
//               {...register("referralBonus")}
//               error={errors.referralBonus?.message}
//               placeholder="0"
//             />
//           </div>
//           <div>
//             <Input
//               label="Loyalty Bonus"
//               type="number"
//               {...register("loyaltyBonus")}
//               error={errors.loyaltyBonus?.message}
//               placeholder="0"
//             />
//           </div>

//           {/* Dynamic USPs */}
//           {usps.map((usp, idx) => (
//             <div key={idx} className="flex items-center gap-2">
//               <Input
//                 label={`Product USP ${idx + 1}`}
//                 value={usp}
//                 onChange={e => handleUSPChange(idx, e.target.value)}
//                 placeholder={`USP ${idx + 1}`}
//               />
//               {usps.length > 1 && (
//                 <Button
//                   type="button"
//                   size="sm"
//                   variant="outline"
//                   className="mt-5"
//                   onClick={() => removeUSP(idx)}
//                   aria-label="Remove this USP"
//                 >Remove</Button>
//               )}
//             </div>
//           ))}
//         </div>

//         {usps.length < 10 && (
//           <div className="flex justify-center mt-2 mb-2">
//             <Button
//               type="button"
//               onClick={addUSP}
//               variant="outline"
//               size="md"
//               className="min-w-[170px]"
//             >
//               Add More USP
//             </Button>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//           <div>
//             <Input
//               label="HSN"
//               {...register("hsn")}
//               error={errors.hsn?.message}
//               placeholder="HSN"
//             />
//           </div>
//           <div>
//             <Input
//               label="GST"
//               type="number"
//               {...register("gst")}
//               error={errors.gst?.message}
//               placeholder="0"
//             />
//           </div>
//           <div className="md:col-span-2 mt-2">
//             <label className="block font-medium text-sm mb-2">
//               Product Images <span className="text-red-600">*</span>
//               <span className="ml-1 font-normal text-xs text-gray-500">
//                 (Up to 3 images, first image will be the main product image)
//               </span>
//             </label>
//             <div
//               className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition ${
//                 imagePreviews.length >= 3 ? "opacity-60 pointer-events-none" : ""
//               }`}
//               onClick={() => imagePreviews.length < 3 && fileInputRef.current?.click()}
//             >
//               <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
//               <span className="text-gray-500 text-sm">
//                 Click to upload images (PNG, JPG)
//               </span>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 className="hidden"
//                 accept="image/png, image/jpg, image/jpeg"
//                 multiple
//                 onChange={handleImageChange}
//                 disabled={imagePreviews.length >= 3}
//               />
//             </div>
//             {/* Previews */}
//             {imagePreviews.length > 0 && (
//               <div className="flex mt-3 gap-3">
//                 {imagePreviews.map((url, idx) => (
//                   <div key={idx} className="relative group">
//                     <img
//                       src={url}
//                       alt={`Product ${idx + 1}`}
//                       className="w-20 h-20 object-cover rounded border"
//                     />
//                     <button
//                       type="button"
//                       className="absolute -top-2 -right-2 bg-white rounded-full p-1 border shadow hover:bg-red-100"
//                       onClick={() => handleRemoveImage(idx)}
//                     >
//                       <span className="text-red-600 font-bold">&times;</span>
//                     </button>
//                     {idx === 0 && (
//                       <span className="absolute bottom-1 left-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded">
//                         Main
//                       </span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="mt-6">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Product Long Description
//           </label>
//           <textarea
//             {...register("longDescription")}
//             placeholder="Product long description"
//             className="block w-full border border-gray-300 rounded px-3 py-1"
//             rows={3}
//           />
//           {errors.longDescription && (
//             <span className="text-red-600 text-xs">{errors.longDescription.message}</span>
//           )}
//         </div>
//         <div className="flex justify-end gap-2 mt-6">
//           <Button type="button" variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button type="submit" variant="primary" isLoading={isSubmitting}>
//             Save Product
//           </Button>
//         </div>
//       </form>

//       {/* DEBUG: Show last submitted values below the form */}
//       {lastSubmitted && (
//         <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
//           <h4 className="font-semibold text-yellow-900 mb-2">Last submitted values</h4>
//           <pre className="text-xs text-yellow-900 overflow-x-auto">
//             {JSON.stringify(lastSubmitted, null, 2)}
//           </pre>
//         </div>
//       )}
//     </>
//   );
// }
