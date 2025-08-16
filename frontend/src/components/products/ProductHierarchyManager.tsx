// "use client";
// import React, { useState, useEffect, FormEvent, useRef } from "react";
// import {
//   FiPlus, FiEdit2, FiTrash2, FiChevronRight, FiChevronDown, FiSearch, FiX,
// } from "react-icons/fi";
// import { Button, Input, Alert } from "@/components/ui";
// import Modal from "@/components/ui/Modal";

// interface ProductType { id: string; name: string; description?: string; }
// interface Category { id: string; name: string; productTypeId: string; description?: string; }
// interface Subcategory { id: string; name: string; categoryId: string; description?: string; }
// interface ProductHierarchyManagerProps {
//   mode?: "manage" | "view";
//   onSelect?: (data: { productType: string; category: string; subcategory: string }) => void;
//   onSuccess?: (message: string) => void;
//   onCategoryChange?: (categories: Category[]) => void;
//   onClose?: () => void; 
// }

// export default function ProductHierarchyManager({
//   onSelect, onSuccess, onCategoryChange, mode = "view",
// }: ProductHierarchyManagerProps) {
//   const [searchText, setSearchText] = useState("");
//   const [productTypes, setProductTypes] = useState<ProductType[]>([]);
//   const [categories, setCategories] = useState<Record<string, Category[]>>({});
//   const [subcategories, setSubcategories] = useState<Record<string, Subcategory[]>>({});
//   const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});
//   const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
//   const [selectedType, setSelectedType] = useState<string | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
//   const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
//   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
//   const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
//   const [currentItem, setCurrentItem] = useState<ProductType | Category | Subcategory | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const addTypeButtonRef = useRef<HTMLButtonElement | null>(null);

//   const safeOnCategoryChange = (cats: Category[]) => setTimeout(() => onCategoryChange?.(cats), 0);
//   const safeOnSuccess = (msg: string) => setTimeout(() => { setSuccess(msg); onSuccess?.(msg); }, 0);

//   useEffect(() => { fetchProductTypes(); }, []);
//   useEffect(() => { if (isTypeModalOpen && !isEditing) { setName(''); setDescription(''); } }, [isTypeModalOpen, isEditing]);

//   const fetchProductTypes = () => {
//     setLoading(true); setError(null);
//     setTimeout(() => {
//       setProductTypes([
//         { id: "1", name: "Handloom", description: "Traditional handloom products" },
//         { id: "2", name: "Readymade", description: "Ready to wear garments" },
//       ]); setLoading(false);
//     }, 300);
//   };
//   const fetchCategories = (typeId: string) => {
//     setLoading(true); setError(null);
//     setTimeout(() => {
//       const data: Category[] = [
//         { id: "1", name: "Bedsheet", productTypeId: "1", description: "" },
//         { id: "2", name: "Runner", productTypeId: "1", description: "" },
//         { id: "3", name: "Suits", productTypeId: "1", description: "" },
//         { id: "4", name: "Shirts", productTypeId: "2", description: "" },
//       ].filter((c) => c.productTypeId === typeId);
//       setCategories((prev) => ({ ...prev, [typeId]: data }));
//       safeOnCategoryChange(data); setLoading(false);
//     }, 300);
//   };
//   const fetchSubcategories = (categoryId: string) => {
//     setLoading(true); setError(null);
//     setTimeout(() => {
//       const data: Subcategory[] = [
//         { id: "1", name: "Cotton", categoryId: "1", description: "" },
//         { id: "2", name: "Silk", categoryId: "1", description: "" },
//         { id: "3", name: "Linen", categoryId: "2", description: "" },
//         { id: "4", name: "Traditional", categoryId: "3", description: "" },
//         { id: "5", name: "Modern", categoryId: "3", description: "" },
//       ].filter((s) => s.categoryId === categoryId);
//       setSubcategories((prev) => ({ ...prev, [categoryId]: data }));
//       setLoading(false);
//     }, 300);
//   };
//   const toggleProductType = (id: string) => {
//     setExpandedTypes((prev) => {
//       const next = { ...prev, [id]: !prev[id] };
//       if (next[id]) fetchCategories(id);
//       return next;
//     });
//   };
//   const toggleCategory = (id: string) => {
//     setExpandedCategories((prev) => {
//       const next = { ...prev, [id]: !prev[id] };
//       if (next[id]) fetchSubcategories(id);
//       return next;
//     });
//   };
//   const handleEditType = (type: ProductType) => {
//     setCurrentItem(type);
//     setIsEditing(true);
//     setName(type.name ?? "");
//     setDescription(type.description ?? "");
//     setIsTypeModalOpen(true);
//   };
//   const handleEditCategory = (cat: Category) => {
//     setCurrentItem(cat);
//     setIsEditing(true);
//     setName(cat.name ?? "");
//     setDescription(cat.description ?? "");
//     setIsCategoryModalOpen(true);
//   };
//   const handleEditSubcategory = (sub: Subcategory) => {
//     setCurrentItem(sub);
//     setIsEditing(true);
//     setName(sub.name ?? "");
//     setDescription(sub.description ?? "");
//     setIsSubcategoryModalOpen(true);
//   };
//   const selectProductType = (id: string) => {
//     setSelectedType(id); setSelectedCategory(null); setSelectedSubcategory(null);
//     onSelect?.({ productType: id, category: "", subcategory: "" });
//   };
//   const selectCategory = (id: string) => {
//     setSelectedCategory(id); setSelectedSubcategory(null);
//     onSelect?.({ productType: selectedType || "", category: id, subcategory: "" });
//   };
//   const selectSubcategory = (id: string) => {
//     setSelectedSubcategory(id);
//     onSelect?.({ productType: selectedType || "", category: selectedCategory || "", subcategory: id });
//   };

//   const closeTypeModal = () => {
//     setIsTypeModalOpen(false); setIsEditing(false); setCurrentItem(null); setName(''); setDescription('');
//     if (addTypeButtonRef.current) addTypeButtonRef.current.focus();
//   };
//   const handleTypeSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const form = new FormData(e.currentTarget);
//     const name = form.get("name") as string;
//     const description = form.get("description") as string;
//     if (isEditing && currentItem && "name" in currentItem && !("productTypeId" in currentItem)) {
//       setProductTypes((prev) => prev.map((pt) => (pt.id === currentItem.id ? { ...pt, name, description } : pt)));
//       safeOnSuccess("Product Type updated");
//     } else {
//       setProductTypes((prev) => [...prev, { id: Date.now().toString(), name, description }]);
//       safeOnSuccess("Product Type added");
//     }
//     closeTypeModal();
//   };
//   const handleCategorySubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!selectedType) return;
//     const form = new FormData(e.currentTarget);
//     const name = form.get("name") as string;
//     const description = form.get("description") as string;
//     setCategories((prev) => {
//       const list = prev[selectedType] || [];
//       const updated = isEditing && currentItem && "productTypeId" in currentItem
//         ? list.map((c) => c.id === currentItem.id ? { ...c, name, description } : c)
//         : [...list, { id: Date.now().toString(), name, description, productTypeId: selectedType }];
//       safeOnCategoryChange(updated);
//       safeOnSuccess(isEditing ? "Category updated" : "Category added");
//       return { ...prev, [selectedType]: updated };
//     });
//     setIsCategoryModalOpen(false); setIsEditing(false); setCurrentItem(null);
//   };
//   const handleSubcategorySubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!selectedCategory) return;
//     const form = new FormData(e.currentTarget);
//     const name = form.get("name") as string;
//     const description = form.get("description") as string;
//     setSubcategories((prev) => {
//       const list = prev[selectedCategory] || [];
//       const updated = isEditing && currentItem && "categoryId" in currentItem
//         ? list.map((s) => s.id === currentItem.id ? { ...s, name, description } : s)
//         : [...list, { id: Date.now().toString(), name, description, categoryId: selectedCategory }];
//       safeOnSuccess(isEditing ? "Subcategory updated" : "Subcategory added");
//       return { ...prev, [selectedCategory]: updated };
//     });
//     setIsSubcategoryModalOpen(false); setIsEditing(false); setCurrentItem(null);
//   };
//   const editProductType = (item: ProductType) => { setCurrentItem(item); setIsEditing(true); setIsTypeModalOpen(true); };
//   const editCategory = (item: Category) => { setCurrentItem(item); setIsEditing(true); setIsCategoryModalOpen(true); };
//   const editSubcategory = (item: Subcategory) => { setCurrentItem(item); setIsEditing(true); setIsSubcategoryModalOpen(true); };
//   const deleteProductType = (id: string) => { setProductTypes((prev) => prev.filter((pt) => pt.id !== id)); safeOnSuccess("Product Type deleted"); };
//   const deleteCategory = (cid: string) => {
//     setCategories((prev) => {
//       const copy = { ...prev };
//       for (const pt in copy) {
//         if (copy[pt].some((c) => c.id === cid)) {
//           copy[pt] = copy[pt].filter((c) => c.id !== cid); safeOnCategoryChange(copy[pt]); break;
//         }
//       }
//       return copy;
//     }); safeOnSuccess("Category deleted");
//   };
//   const deleteSubcategory = (sid: string) => {
//     setSubcategories((prev) => {
//       const copy = { ...prev };
//       for (const cat in copy) {
//         if (copy[cat].some((s) => s.id === sid)) {
//           copy[cat] = copy[cat].filter((s) => s.id !== sid); break;
//         }
//       }
//       return copy;
//     }); safeOnSuccess("Subcategory deleted");
//   };

//   if (loading && productTypes.length === 0) {
//     return <div className="p-6 text-center text-gray-600 font-medium">Loading…</div>;
//   }

//   return (
//     <div className="
//       w-full max-w-full sm:w-[32rem] md:w-[38rem] mx-auto
//       p-0 bg-transparent
//     ">
//       {error && <Alert variant="error">{error}</Alert>}
//       {success && <Alert variant="success">{success}</Alert>}

//       {/* Card-style box for controls and list */}
//       <div className="bg-white rounded-xl shadow-md p-3 sm:p-6 flex flex-col gap-6 mt-4">
//         {/* Add + Search */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-stretch gap-3">
//           {mode === "manage" && (
//             <button
//               ref={addTypeButtonRef}
//               type="button"
//               onClick={() => {
//                 setCurrentItem(null);
//                 setIsEditing(false);
//                 setIsTypeModalOpen(true);
//               }}
//               className="
//                 bg-indigo-600 hover:bg-indigo-700
//                 text-white font-semibold
//                 px-5 py-2 rounded-full
//                 shadow-lg hover:shadow-xl
//                 transition w-full sm:w-auto
//                 flex items-center gap-2
//                 text-base
//                 mb-2 sm:mb-0
//               "
//             >
//               <FiPlus className="mr-2" /> Add Product Type
//             </button>
//           )}
//           <div className="relative w-full sm:w-64">
//             <input
//               type="text"
//               placeholder="Search types, categories…"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               className="
//                 w-full pl-10 pr-10 py-2
//                 border border-gray-200 rounded-full
//                 focus:outline-none focus:ring-2 focus:ring-indigo-400
//                 bg-gray-50
//                 transition text-base
//               "
//             />
//             <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             {searchText && (
//               <button
//                 onClick={() => setSearchText("")}
//                 className="
//                   absolute right-3 top-1/2 transform -translate-y-1/2
//                   text-gray-400 hover:text-gray-600
//                   transition
//                 "
//               >
//                 <FiX />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Hierarchy List */}
//         <ul className="divide-y divide-gray-200">
//           {productTypes
//             .filter((pt) => pt.name.toLowerCase().includes(searchText.toLowerCase()))
//             .map((pt) => (
//               <li
//                 key={pt.id}
//                 className="
//                   py-4 px-2 sm:px-4
//                   hover:bg-gray-50 rounded-lg
//                   transition
//                   w-full
//                   max-w-full
//                   overflow-x-auto
//                 "
//               >
//                 <div className="flex items-center justify-between w-full">
//                   <div className="flex items-center space-x-3 text-lg min-w-0">
//                     <button
//                       onClick={() => toggleProductType(pt.id)}
//                       className="text-gray-600 hover:text-gray-800 transition flex-shrink-0"
//                     >
//                       {expandedTypes[pt.id] ? (
//                         <FiChevronDown size={20} />
//                       ) : (
//                         <FiChevronRight size={20} />
//                       )}
//                     </button>
//                     <span
//                       onClick={() => selectProductType(pt.id)}
//                       className={`cursor-pointer truncate max-w-[60vw] sm:max-w-[16rem] ${
//                         selectedType === pt.id ? "font-bold text-indigo-600" : "text-gray-800 font-semibold"
//                       }`}
//                       title={pt.name}
//                     >
//                       {pt.name}
//                     </span>
//                   </div>
//                   {mode === "manage" && (
//                     <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
//                       <button
//                         onClick={() => editProductType(pt)}
//                         className="
//                           p-2 rounded-full
//                           bg-blue-100 text-blue-500
//                           hover:bg-blue-200 hover:text-blue-600
//                           transition
//                         "
//                       >
//                         <FiEdit2 />
//                       </button>
//                       <button
//                         onClick={() => deleteProductType(pt.id)}
//                         className="
//                           p-2 rounded-full
//                           bg-red-100 text-red-500
//                           hover:bg-red-200 hover:text-red-600
//                           transition
//                         "
//                       >
//                         <FiTrash2 />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setSelectedType(pt.id);
//                           setCurrentItem(null);
//                           setIsEditing(false);
//                           setIsCategoryModalOpen(true);
//                         }}
//                         className="
//                           p-2 rounded-full
//                           bg-indigo-100 text-indigo-600
//                           hover:bg-indigo-200 hover:text-indigo-700
//                           transition
//                         "
//                       >
//                         <FiPlus />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//                 {/* Categories */}
//                 {expandedTypes[pt.id] && (
//                   <ul className="mt-3 pl-8 divide-y divide-gray-100">
//                     {(categories[pt.id] || []).length === 0 ? (
//                       <li className="py-2 text-gray-500">No categories</li>
//                     ) : (
//                       (categories[pt.id] || [])
//                         .filter((cat) =>
//                           cat.name.toLowerCase().includes(searchText.toLowerCase())
//                         )
//                         .map((cat) => (
//                           <li
//                             key={cat.id}
//                             className="py-2 px-2 sm:px-3 hover:bg-gray-50 rounded-lg transition"
//                           >
//                             <div className="flex items-center justify-between w-full">
//                               <div className="flex items-center space-x-3 min-w-0">
//                                 <button
//                                   onClick={() => toggleCategory(cat.id)}
//                                   className="text-gray-500 hover:text-gray-700 transition flex-shrink-0"
//                                 >
//                                   {expandedCategories[cat.id] ? (
//                                     <FiChevronDown />
//                                   ) : (
//                                     <FiChevronRight />
//                                   )}
//                                 </button>
//                                 <span
//                                   onClick={() => selectCategory(cat.id)}
//                                   className={`cursor-pointer truncate max-w-[54vw] sm:max-w-[12rem] ${
//                                     selectedCategory === cat.id
//                                       ? "font-semibold text-indigo-600"
//                                       : "text-gray-800 font-medium"
//                                   }`}
//                                   title={cat.name}
//                                 >
//                                   {cat.name}
//                                 </span>
//                               </div>
//                               {mode === "manage" && (
//                                 <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
//                                   <button
//                                     onClick={() => editCategory(cat)}
//                                     className="
//                                       p-2 rounded-full
//                                       bg-blue-100 text-blue-500
//                                       hover:bg-blue-200 hover:text-blue-600
//                                       transition
//                                     "
//                                   >
//                                     <FiEdit2 />
//                                   </button>
//                                   <button
//                                     onClick={() => deleteCategory(cat.id)}
//                                     className="
//                                       p-2 rounded-full
//                                       bg-red-100 text-red-500
//                                       hover:bg-red-200 hover:text-red-600
//                                       transition
//                                     "
//                                   >
//                                     <FiTrash2 />
//                                   </button>
//                                   <button
//                                     onClick={() => {
//                                       setSelectedCategory(cat.id);
//                                       setCurrentItem(null);
//                                       setIsEditing(false);
//                                       setIsSubcategoryModalOpen(true);
//                                     }}
//                                     className="
//                                       p-2 rounded-full
//                                       bg-indigo-100 text-indigo-600
//                                       hover:bg-indigo-200 hover:text-indigo-700
//                                       transition
//                                     "
//                                   >
//                                     <FiPlus />
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                             {/* Subcategories */}
//                             {expandedCategories[cat.id] && (
//                               <ul className="mt-2 pl-8">
//                                 {(subcategories[cat.id] || []).length === 0 ? (
//                                   <li className="py-1 text-gray-500">No subcategories</li>
//                                 ) : (
//                                   (subcategories[cat.id] || [])
//                                     .filter((sub) =>
//                                       sub.name
//                                         .toLowerCase()
//                                         .includes(searchText.toLowerCase())
//                                     )
//                                     .map((sub) => (
//                                       <li
//                                         key={sub.id}
//                                         className="py-1 px-2 sm:px-3 hover:bg-gray-50 rounded-lg transition flex items-center justify-between w-full"
//                                       >
//                                         <span
//                                           onClick={() => selectSubcategory(sub.id)}
//                                           className={`cursor-pointer truncate max-w-[48vw] sm:max-w-[10rem] ${
//                                             selectedSubcategory === sub.id
//                                               ? "font-medium text-indigo-600"
//                                               : "text-gray-700 font-medium"
//                                           }`}
//                                           title={sub.name}
//                                         >
//                                           {sub.name}
//                                         </span>
//                                         {mode === "manage" && (
//                                           <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
//                                             <button
//                                               onClick={() => editSubcategory(sub)}
//                                               className="
//                                                 p-1 rounded-full
//                                                 bg-blue-100 text-blue-500
//                                                 hover:bg-blue-200 hover:text-blue-600
//                                                 transition
//                                               "
//                                             >
//                                               <FiEdit2 size={16} />
//                                             </button>
//                                             <button
//                                               onClick={() => deleteSubcategory(sub.id)}
//                                               className="
//                                                 p-1 rounded-full
//                                                 bg-red-100 text-red-500
//                                                 hover:bg-red-200 hover:text-red-600
//                                                 transition
//                                               "
//                                             >
//                                               <FiTrash2 size={16} />
//                                             </button>
//                                           </div>
//                                         )}
//                                       </li>
//                                     ))
//                                 )}
//                               </ul>
//                             )}
//                           </li>
//                         ))
//                     )}
//                   </ul>
//                 )}
//               </li>
//             ))}
//         </ul>
//       </div>

//       {/* MODALS */}
//       <Modal
//         isOpen={isTypeModalOpen}
//         onClose={closeTypeModal}
//         title={isEditing ? "Edit Type" : "Add Type"}
//       >
//         <form onSubmit={handleTypeSubmit} className="space-y-4">
//           <label className="block">
//             <span className="block mb-1 font-semibold text-gray-800">
//               Name<span className="text-red-500">*</span>
//             </span>
//             <input
//               autoFocus
//               type="text"
//               name="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               maxLength={60}
//               className="w-full px-4 py-2 text-base text-gray-900 bg-white border-2 border-indigo-400 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner placeholder-gray-400 transition"
//               placeholder="Enter product type name"
//             />
//           </label>
//           <label className="block">
//             <span className="block mb-1 font-semibold text-gray-800">
//               Description
//             </span>
//             <textarea
//               name="description"
//               rows={3}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full px-4 py-2 text-base text-gray-900 bg-white border-2 border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-inner placeholder-gray-400 transition resize-none"
//               placeholder="Description"
//             />
//           </label>
//           <div className="flex justify-end space-x-2">
//             <Button type="button" variant="outline" onClick={closeTypeModal}>
//               Cancel
//             </Button>
//             <Button type="submit">{isEditing ? "Update" : "Save"}</Button>
//           </div>
//         </form>
//       </Modal>

//       <Modal
//         isOpen={isCategoryModalOpen}
//         onClose={() => {
//           setIsCategoryModalOpen(false);
//           setIsEditing(false);
//           setCurrentItem(null);
//           setName('');
//           setDescription('');
//         }}
//         title={isEditing ? "Edit Category" : "Add Category"}
//       >
//         <form onSubmit={handleCategorySubmit} className="space-y-4">
//           <Input
//             label="Name"
//             name="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//           <textarea
//             name="description"
//             rows={3}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             placeholder="Description"
//           />
//           <div className="flex justify-end space-x-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => {
//                 setIsCategoryModalOpen(false);
//                 setIsEditing(false);
//                 setCurrentItem(null);
//                 setName('');
//                 setDescription('');
//               }}
//             >
//               Cancel
//             </Button>
//             <Button type="submit">{isEditing ? "Update" : "Save"}</Button>
//           </div>
//         </form>
//       </Modal>

//       <Modal
//         isOpen={isSubcategoryModalOpen}
//         onClose={() => {
//           setIsSubcategoryModalOpen(false);
//           setIsEditing(false);
//           setCurrentItem(null);
//           setName('');
//           setDescription('');
//         }}
//         title={isEditing ? "Edit Subcategory" : "Add Subcategory"}
//       >
//         <form onSubmit={handleSubcategorySubmit} className="space-y-4">
//           <Input
//             label="Name"
//             name="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//           <textarea
//             name="description"
//             rows={3}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             placeholder="Description"
//           />
//           <div className="flex justify-end space-x-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => {
//                 setIsSubcategoryModalOpen(false);
//                 setIsEditing(false);
//                 setCurrentItem(null);
//                 setName('');
//                 setDescription('');
//               }}
//             >
//               Cancel
//             </Button>
//             <Button type="submit">{isEditing ? "Update" : "Save"}</Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// }

// ProductHierarchyManager.tsx
"use client";

import React, { useState, useEffect, FormEvent, useRef } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronRight,
  FiChevronDown,
  FiSearch,
  FiX,
  FiTag,
  FiList,
  FiFolder,
} from "react-icons/fi";
import { Button, Input, Alert } from "@/components/ui";
import Modal from "@/components/ui/Modal";

interface ProductType {
  id: string;
  name: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  productTypeId: string;
  description?: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
}

interface ProductHierarchyManagerProps {
  mode?: "manage" | "view";
  onSelect?: (data: {
    productType: string;
    category: string;
    subcategory: string;
  }) => void;
  onSuccess?: (message: string) => void;
  onCategoryChange?: (categories: Category[]) => void;
  onClose?: () => void;
}

export default function ProductHierarchyManager({
  onSelect,
  onSuccess,
  onCategoryChange,
  mode = "view",
}: ProductHierarchyManagerProps) {
  const [searchText, setSearchText] = useState("");
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<Record<string, Category[]>>({});
  const [subcategories, setSubcategories] = useState<Record<string, Subcategory[]>>({});
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ProductType | Category | Subcategory | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const addTypeButtonRef = useRef<HTMLButtonElement | null>(null);

  const safeOnCategoryChange = (cats: Category[]) =>
    setTimeout(() => onCategoryChange?.(cats), 0);
  const safeOnSuccess = (msg: string) =>
    setTimeout(() => {
      setSuccess(msg);
      onSuccess?.(msg);
    }, 0);

  useEffect(() => {
    fetchProductTypes();
  }, []);

  useEffect(() => {
    if (isTypeModalOpen && !isEditing) {
      setName("");
      setDescription("");
    }
  }, [isTypeModalOpen, isEditing]);

  const fetchProductTypes = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setProductTypes([
        { id: "1", name: "Handloom", description: "Traditional handloom products" },
        { id: "2", name: "Readymade", description: "Ready to wear garments" },
      ]);
      setLoading(false);
    }, 300);
  };

  const fetchCategories = (typeId: string) => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const data: Category[] = [
        { id: "1", name: "Bedsheet", productTypeId: "1", description: "" },
        { id: "2", name: "Runner", productTypeId: "1", description: "" },
        { id: "3", name: "Suits", productTypeId: "1", description: "" },
        { id: "4", name: "Shirts", productTypeId: "2", description: "" },
      ].filter((c) => c.productTypeId === typeId);
      setCategories((prev) => ({ ...prev, [typeId]: data }));
      safeOnCategoryChange(data);
      setLoading(false);
    }, 300);
  };

  const fetchSubcategories = (categoryId: string) => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const data: Subcategory[] = [
        { id: "1", name: "Cotton", categoryId: "1", description: "" },
        { id: "2", name: "Silk", categoryId: "1", description: "" },
        { id: "3", name: "Linen", categoryId: "2", description: "" },
        { id: "4", name: "Traditional", categoryId: "3", description: "" },
        { id: "5", name: "Modern", categoryId: "3", description: "" },
      ].filter((s) => s.categoryId === categoryId);
      setSubcategories((prev) => ({ ...prev, [categoryId]: data }));
      setLoading(false);
    }, 300);
  };

  const toggleProductType = (id: string) => {
    setExpandedTypes((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) fetchCategories(id);
      return next;
    });
  };

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) fetchSubcategories(id);
      return next;
    });
  };

  const handleEditType = (type: ProductType) => {
    setCurrentItem(type);
    setIsEditing(true);
    setName(type.name ?? "");
    setDescription(type.description ?? "");
    setIsTypeModalOpen(true);
  };

  const handleEditCategory = (cat: Category) => {
    setCurrentItem(cat);
    setIsEditing(true);
    setName(cat.name ?? "");
    setDescription(cat.description ?? "");
    setIsCategoryModalOpen(true);
  };

  const handleEditSubcategory = (sub: Subcategory) => {
    setCurrentItem(sub);
    setIsEditing(true);
    setName(sub.name ?? "");
    setDescription(sub.description ?? "");
    setIsSubcategoryModalOpen(true);
  };

  const selectProductType = (id: string) => {
    setSelectedType(id);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    onSelect?.({ productType: id, category: "", subcategory: "" });
  };

  const selectCategory = (id: string) => {
    setSelectedCategory(id);
    setSelectedSubcategory(null);
    onSelect?.({
      productType: selectedType || "",
      category: id,
      subcategory: "",
    });
  };

  const selectSubcategory = (id: string) => {
    setSelectedSubcategory(id);
    onSelect?.({
      productType: selectedType || "",
      category: selectedCategory || "",
      subcategory: id,
    });
  };

  const closeTypeModal = () => {
    setIsTypeModalOpen(false);
    setIsEditing(false);
    setCurrentItem(null);
    setName("");
    setDescription("");
    if (addTypeButtonRef.current) addTypeButtonRef.current.focus();
  };

  const handleTypeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const description = form.get("description") as string;
    if (
      isEditing &&
      currentItem &&
      "name" in currentItem &&
      !("productTypeId" in currentItem)
    ) {
      setProductTypes((prev) =>
        prev.map((pt) =>
          pt.id === currentItem.id ? { ...pt, name, description } : pt
        )
      );
      safeOnSuccess("Product Type updated");
    } else {
      setProductTypes((prev) => [
        ...prev,
        { id: Date.now().toString(), name, description },
      ]);
      safeOnSuccess("Product Type added");
    }
    closeTypeModal();
  };

  const handleCategorySubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedType) return;
    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const description = form.get("description") as string;
    setCategories((prev) => {
      const list = prev[selectedType] || [];
      const updated =
        isEditing && currentItem && "productTypeId" in currentItem
          ? list.map((c) =>
              c.id === currentItem.id ? { ...c, name, description } : c
            )
          : [
              ...list,
              {
                id: Date.now().toString(),
                name,
                description,
                productTypeId: selectedType,
              },
            ];
      safeOnCategoryChange(updated);
      safeOnSuccess(isEditing ? "Category updated" : "Category added");
      return { ...prev, [selectedType]: updated };
    });
    setIsCategoryModalOpen(false);
    setIsEditing(false);
    setCurrentItem(null);
  };

  const handleSubcategorySubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCategory) return;
    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const description = form.get("description") as string;
    setSubcategories((prev) => {
      const list = prev[selectedCategory] || [];
      const updated =
        isEditing && currentItem && "categoryId" in currentItem
          ? list.map((s) =>
              s.id === currentItem.id ? { ...s, name, description } : s
            )
          : [
              ...list,
              {
                id: Date.now().toString(),
                name,
                description,
                categoryId: selectedCategory,
              },
            ];
      safeOnSuccess(isEditing ? "Subcategory updated" : "Subcategory added");
      return { ...prev, [selectedCategory]: updated };
    });
    setIsSubcategoryModalOpen(false);
    setIsEditing(false);
    setCurrentItem(null);
  };

  const deleteProductType = (id: string) => {
    setProductTypes((prev) => prev.filter((pt) => pt.id !== id));
    safeOnSuccess("Product Type deleted");
  };

  const deleteCategory = (cid: string) => {
    setCategories((prev) => {
      const copy = { ...prev };
      for (const pt in copy) {
        if (copy[pt].some((c) => c.id === cid)) {
          copy[pt] = copy[pt].filter((c) => c.id !== cid);
          safeOnCategoryChange(copy[pt]);
          break;
        }
      }
      return copy;
    });
    safeOnSuccess("Category deleted");
  };

  const deleteSubcategory = (sid: string) => {
    setSubcategories((prev) => {
      const copy = { ...prev };
      for (const cat in copy) {
        if (copy[cat].some((s) => s.id === sid)) {
          copy[cat] = copy[cat].filter((s) => s.id !== sid);
          break;
        }
      }
      return copy;
    });
    safeOnSuccess("Subcategory deleted");
  };

  if (loading && productTypes.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600 font-medium">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full sm:max-w-2xl lg:max-w-4xl mx-auto bg-transparent">
      {/* Alert Messages with improved styling */}
      {error && (
        <Alert variant="error" className="mb-6 shadow-lg border-l-4 border-red-500">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mb-6 shadow-lg border-l-4 border-green-500">
          {success}
        </Alert>
      )}

      {/* Main Container with enhanced design */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <FiFolder className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Product Categories</h1>
                <p className="text-indigo-100 text-sm mt-1">
                  Organize your products with hierarchical categories
                </p>
              </div>
            </div>

            {mode === "manage" && (
              <button
                type="button"
                ref={addTypeButtonRef}
                onClick={() => {
                  setCurrentItem(null);
                  setIsEditing(false);
                  setIsTypeModalOpen(true);
                }}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 border border-white/20 hover:border-white/40 group"
              >
                <FiPlus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline">Add Product Type</span>
                <span className="sm:hidden">Add Type</span>
              </button>
            )}
          </div>

          {/* Enhanced Search Bar */}
          <div className="mt-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-white/60" />
              </div>
              <input
                type="text"
                placeholder="Search categories and subcategories..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all duration-300"
              />
              {searchText && (
                <button
                  type="button"
                  onClick={() => setSearchText("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors duration-200"
                >
                  <FiX className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Hierarchy Tree with improved styling */}
          <div className="space-y-2">
            {productTypes
              .filter((pt) =>
                pt.name.toLowerCase().includes(searchText.toLowerCase())
              )
              .map((pt) => (
                <div
                  key={pt.id}
                  className="group border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-300 hover:shadow-md transition-all duration-300 bg-gray-50/50 hover:bg-indigo-50/30"
                >
                  {/* Product Type Level */}
                  <div className="flex items-center justify-between p-4 bg-white group-hover:bg-indigo-50/50 transition-colors duration-300">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleProductType(pt.id)}
                        className="flex-shrink-0 p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 transition-all duration-200 group"
                      >
                        {expandedTypes[pt.id] ? (
                          <FiChevronDown className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-200" />
                        ) : (
                          <FiChevronRight className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-200" />
                        )}
                      </button>
                      
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 p-2 bg-indigo-100 rounded-lg">
                          <FiTag className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => selectProductType(pt.id)}
                            className={`text-left font-semibold text-lg truncate block w-full hover:text-indigo-600 transition-colors duration-200 ${
                              selectedType === pt.id
                                ? "text-indigo-700"
                                : "text-gray-800"
                            }`}
                            title={pt.name}
                          >
                            {pt.name}
                          </button>
                          {pt.description && (
                            <p className="text-sm text-gray-500 mt-1 truncate">
                              {pt.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {mode === "manage" && (
                      <div className="flex items-center space-x-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          type="button"
                          onClick={() => handleEditType(pt)}
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 transition-all duration-200 hover:scale-105"
                          title="Edit product type"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProductType(pt.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-all duration-200 hover:scale-105"
                          title="Delete product type"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedType(pt.id);
                            setCurrentItem(null);
                            setIsEditing(false);
                            setIsCategoryModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700 transition-all duration-200 hover:scale-105"
                          title="Add category"
                        >
                          <FiPlus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Categories Level */}
                  {expandedTypes[pt.id] && (
                    <div className="border-t border-gray-200 bg-gray-50/30">
                      {(categories[pt.id] || []).length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <FiList className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">No categories available</p>
                          <p className="text-gray-400 text-sm mt-1">
                            Add your first category to get started
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {categories[pt.id]
                            .filter((cat) =>
                              cat.name.toLowerCase().includes(searchText.toLowerCase())
                            )
                            .map((cat) => (
                              <div key={cat.id} className="group/category">
                                {/* Category Item */}
                                <div className="flex items-center justify-between p-4 pl-16 hover:bg-white/60 transition-colors duration-200">
                                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                                    <button
                                      type="button"
                                      onClick={() => toggleCategory(cat.id)}
                                      className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 transition-all duration-200"
                                    >
                                      {expandedCategories[cat.id] ? (
                                        <FiChevronDown className="h-4 w-4" />
                                      ) : (
                                        <FiChevronRight className="h-4 w-4" />
                                      )}
                                    </button>
                                    
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                      <div className="flex-shrink-0 w-3 h-3 bg-indigo-300 rounded-full"></div>
                                      <button
                                        onClick={() => selectCategory(cat.id)}
                                        className={`text-left font-medium truncate block flex-1 hover:text-indigo-600 transition-colors duration-200 ${
                                          selectedCategory === cat.id
                                            ? "text-indigo-600"
                                            : "text-gray-700"
                                        }`}
                                        title={cat.name}
                                      >
                                        {cat.name}
                                      </button>
                                    </div>
                                  </div>

                                  {mode === "manage" && (
                                    <div className="flex items-center space-x-2 flex-shrink-0 opacity-0 group-hover/category:opacity-100 transition-opacity duration-300">
                                      <button
                                        type="button"
                                        onClick={() => handleEditCategory(cat)}
                                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 transition-all duration-200 hover:scale-105"
                                        title="Edit category"
                                      >
                                        <FiEdit2 className="h-3 w-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => deleteCategory(cat.id)}
                                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-all duration-200 hover:scale-105"
                                        title="Delete category"
                                      >
                                        <FiTrash2 className="h-3 w-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedCategory(cat.id);
                                          setCurrentItem(null);
                                          setIsEditing(false);
                                          setIsSubcategoryModalOpen(true);
                                        }}
                                        className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700 transition-all duration-200 hover:scale-105"
                                        title="Add subcategory"
                                      >
                                        <FiPlus className="h-3 w-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Subcategories Level */}
                                {expandedCategories[cat.id] && (
                                  <div className="bg-white/40">
                                    {(subcategories[cat.id] || []).length === 0 ? (
                                      <div className="px-4 py-6 pl-20 text-center">
                                        <p className="text-gray-500 text-sm">No subcategories available</p>
                                      </div>
                                    ) : (
                                      <div className="divide-y divide-gray-50">
                                        {subcategories[cat.id]
                                          .filter((sub) =>
                                            sub.name
                                              .toLowerCase()
                                              .includes(searchText.toLowerCase())
                                          )
                                          .map((sub) => (
                                            <div
                                              key={sub.id}
                                              className="group/subcategory flex items-center justify-between p-3 pl-24 hover:bg-white/80 transition-colors duration-200"
                                            >
                                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full"></div>
                                                <button
                                                  onClick={() => selectSubcategory(sub.id)}
                                                  className={`text-left text-sm truncate block flex-1 hover:text-indigo-600 transition-colors duration-200 ${
                                                    selectedSubcategory === sub.id
                                                      ? "text-indigo-600 font-medium"
                                                      : "text-gray-600"
                                                  }`}
                                                  title={sub.name}
                                                >
                                                  {sub.name}
                                                </button>
                                              </div>

                                              {mode === "manage" && (
                                                <div className="flex items-center space-x-1 flex-shrink-0 opacity-0 group-hover/subcategory:opacity-100 transition-opacity duration-300">
                                                  <button
                                                    type="button"
                                                    onClick={() => handleEditSubcategory(sub)}
                                                    className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 transition-all duration-200 hover:scale-105"
                                                    title="Edit subcategory"
                                                  >
                                                    <FiEdit2 className="h-3 w-3" />
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() => deleteSubcategory(sub.id)}
                                                    className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-all duration-200 hover:scale-105"
                                                    title="Delete subcategory"
                                                  >
                                                    <FiTrash2 className="h-3 w-3" />
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Enhanced Modals */}
      <Modal
        isOpen={isTypeModalOpen}
        onClose={closeTypeModal}
        title={isEditing ? "Edit Product Type" : "Add Product Type"}
      >
        <form onSubmit={handleTypeSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={60}
              className="w-full px-4 py-3 text-base text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
              placeholder="Enter product type name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 text-base text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm resize-none"
              placeholder="Add a description (optional)"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={closeTypeModal}
              className="px-6 py-2.5 rounded-xl font-medium"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="px-6 py-2.5 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700"
            >
              {isEditing ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setIsEditing(false);
          setCurrentItem(null);
          setName('');
          setDescription('');
        }}
        title={isEditing ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleCategorySubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={60}
              className="w-full px-4 py-3 text-base text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
              placeholder="Enter category name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 text-base text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm resize-none"
              placeholder="Add a description (optional)"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCategoryModalOpen(false);
                setIsEditing(false);
                setCurrentItem(null);
                setName('');
                setDescription('');
              }}
              className="px-6 py-2.5 rounded-xl font-medium"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="px-6 py-2.5 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700"
            >
              {isEditing ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isSubcategoryModalOpen}
        onClose={() => {
          setIsSubcategoryModalOpen(false);
          setIsEditing(false);
          setCurrentItem(null);
          setName('');
          setDescription('');
        }}
        title={isEditing ? "Edit Subcategory" : "Add Subcategory"}
      >
        <form onSubmit={handleSubcategorySubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={60}
              className="w-full px-4 py-3 text-base text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
              placeholder="Enter subcategory name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 text-base text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm resize-none"
              placeholder="Add a description (optional)"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsSubcategoryModalOpen(false);
                setIsEditing(false);
                setCurrentItem(null);
                setName('');
                setDescription('');
              }}
              className="px-6 py-2.5 rounded-xl font-medium"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="px-6 py-2.5 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700"
            >
              {isEditing ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
