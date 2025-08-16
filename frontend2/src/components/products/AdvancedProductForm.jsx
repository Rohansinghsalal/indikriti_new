import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { FiUpload, FiX } from "react-icons/fi";

export default function AdvancedProductForm({
  product,
  onClose,
  onSave,
}) {
  const [imagePreviews, setImagePreviews] = useState(product.images || []);
  const [usps, setUsps] = useState(
    (product.usps && product.usps.length > 0) ? product.usps : [""]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: product.name || '',
      description: product.description || '',
      longDescription: product.longDescription || '',
      mrp: product.mrp || 0,
      sellingPrice: product.sellingPrice || 0,
      discount: product.discount || 0,
      specialDiscount: product.specialDiscount || 0,
      finalPrice: product.finalPrice || 0,
      stockQuantity: product.stockQuantity || 0,
      sku: product.sku || '',
      batchNo: product.batchNo || '',
      brand: product.brand || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      productType: product.productType || '',
      status: product.status || 'active',
      referralBonus: product.referralBonus || 0,
      loyaltyBonus: product.loyaltyBonus || 0,
      hsn: product.hsn || '',
      gst: product.gst || 0,
      productStyle: product.productStyle || '',
    }
  });

  // Handle USP changes
  const handleUspChange = (index, value) => {
    const newUsps = [...usps];
    newUsps[index] = value;
    setUsps(newUsps);
  };

  const addUsp = () => {
    setUsps([...usps, ""]);
  };

  const removeUsp = (index) => {
    const newUsps = usps.filter((_, i) => i !== index);
    setUsps(newUsps);
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    const updatedProduct = {
      ...product,
      ...data,
      usps: usps.filter(usp => usp.trim() !== ''),
      images: imagePreviews,
    };
    
    if (onSave) {
      onSave(updatedProduct);
    }
    onClose();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Product Name"
            {...register("name", { required: "Product name is required" })}
            error={errors.name?.message}
          />
          <Input
            label="SKU"
            {...register("sku", { required: "SKU is required" })}
            error={errors.sku?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Brand"
            {...register("brand")}
          />
          <Input
            label="Category"
            {...register("category")}
          />
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="MRP"
            type="number"
            step="0.01"
            {...register("mrp", { required: "MRP is required" })}
            error={errors.mrp?.message}
          />
          <Input
            label="Selling Price"
            type="number"
            step="0.01"
            {...register("sellingPrice", { required: "Selling price is required" })}
            error={errors.sellingPrice?.message}
          />
          <Input
            label="Stock Quantity"
            type="number"
            {...register("stockQuantity", { required: "Stock quantity is required" })}
            error={errors.stockQuantity?.message}
          />
        </div>

        {/* Descriptions */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Long Description
            </label>
            <textarea
              {...register("longDescription")}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* USPs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unique Selling Points
          </label>
          {usps.map((usp, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={usp}
                onChange={(e) => handleUspChange(index, e.target.value)}
                placeholder={`USP ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {usps.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeUsp(index)}
                >
                  <FiX />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addUsp}>
            Add USP
          </Button>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {imagePreviews.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md border"
                />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  className="absolute top-1 right-1"
                  onClick={() => removeImage(index)}
                >
                  <FiX />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiUpload className="mr-2" />
              Upload Images
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Product
          </Button>
        </div>
      </form>
    </div>
  );
}
