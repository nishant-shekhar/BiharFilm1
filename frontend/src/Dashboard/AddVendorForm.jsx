import React, { useState } from "react";
import {
  Upload,
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Package,
  Plus,
  Check,
  Trash2,
  Tag,
} from "lucide-react";
import api from "../Components/axios";
import { validateFile } from "../utils/fileValidation";
import AlertBox from "../Components/AlertBox";

import { useEffect } from "react";

const AddVendorForm = ({ onClose, initialData = null, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    vendorName: "",
    category: "",
    phoneNumber: "",
    email: "",
    address: "",
    website: "",
    products: [],
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [errors, setErrors] = useState({
    vendorName: "",
    category: "",
    phoneNumber: "",
    email: "",
    address: "",
    website: "",
  });

  // Populate form data in Edit Mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        vendorName: initialData.vendorName || "",
        category: initialData.category || "",
        phoneNumber: initialData.phoneNumber || "",
        email: initialData.email || "",
        address: initialData.address || "",
        website: initialData.website || "",
        products:
          initialData.products?.map((p) => ({
            id: p.id,
            name: p.name || p.productName || "", // Handle different key names if any
            type: p.type || p.productType || "",
            description: p.description || p.productDescription || "",
            price: p.price || p.productPrice || "",
            imagePreview: p.imageUrl || p.image || null,
            // existing image URL, no new file initially
          })) || [],
      });
      setLogoPreview(
        initialData.logoUrl ||
          initialData.image ||
          initialData.cloudinaryLink ||
          null
      );
    }
  }, [isEditMode, initialData]);

  // Alert State
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // Current Product State (now includes image)
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    type: "",
    description: "",
    price: "",
    imageFile: null,
    imagePreview: null,
  });

  const categories = [
    "Photography & Videography",
    "Catering Services",
    "Decorations & Lighting",
    "Music & Entertainment",
    "Transportation",
    "Venues & Locations",
    "Costumes & Makeup",
    "Equipment Rental",
    "Post-Production",
    "Other",
  ];

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "vendorName":
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          error = "Only text allowed (no numbers or special characters).";
        }
        break;
      case "phoneNumber":
        if (!/^\d*$/.test(value)) {
          error = "Only numbers allowed.";
        } else if (
          value.length > 0 &&
          value.length !== 10 &&
          value.length !== 12
        ) {
          error = "Phone number must be either 10 or 12 digits.";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          error = "Please enter a valid email address.";
        }
        break;
      case "website":
        if (value && !value.startsWith("https://")) {
          error = "Website URL must start with https://";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Limit phone number to 12 digits to prevent excessive input
    if (name === "phoneNumber" && value.length > 12) {
      return;
    }

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        setAlertState({
          isOpen: true,
          type: "error",
          title: "Validation Error",
          message: validation.error,
        });
        e.target.value = null;
        return;
      }

      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        setAlertState({
          isOpen: true,
          type: "error",
          title: "Validation Error",
          message: validation.error,
        });
        e.target.value = null;
        return;
      }

      setCurrentProduct((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const addProduct = () => {
    if (!currentProduct.name || !currentProduct.type || !currentProduct.price) {
      setAlertState({
        isOpen: true,
        type: "warning",
        title: "Missing Information",
        message: "Product name, type, and price are required.",
      });
      return;
    }

    if (!currentProduct.imageFile) {
      setAlertState({
        isOpen: true,
        type: "warning",
        title: "Missing Image",
        message: "Please upload an image for the product/service.",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { ...currentProduct }],
    }));

    // Reset product form
    setCurrentProduct({
      name: "",
      type: "",
      description: "",
      price: "",
      imageFile: null,
      imagePreview: null,
    });
    setShowProductForm(false);
  };

  const removeProduct = (index) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    // Check for existing live validation errors
    if (Object.values(errors).some((err) => err)) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "Please fix the errors in the form before submitting.",
      });
      return false;
    }

    if (!formData.vendorName.trim()) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Missing Field",
        message: "Please enter vendor name",
      });
      return false;
    }
    // Check constraints even if no live error (e.g. passed by copy paste without triggering change logic properly, though likely caught)
    if (!/^[a-zA-Z\s]*$/.test(formData.vendorName)) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Invalid Input",
        message: "Vendor name must contain only text.",
      });
      return false;
    }

    if (!formData.category) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Missing Field",
        message: "Please select a category",
      });
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Missing Field",
        message: "Please enter phone number",
      });
      return false;
    }
    if (
      formData.phoneNumber.length !== 10 &&
      formData.phoneNumber.length !== 12
    ) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Invalid Input",
        message: "Phone number must be either 10 or 12 digits.",
      });
      return false;
    }

    if (!formData.email.trim()) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Missing Field",
        message: "Please enter email address",
      });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Invalid Input",
        message: "Please enter a valid email address.",
      });
      return false;
    }

    if (!formData.address.trim()) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Missing Field",
        message: "Please enter address",
      });
      return false;
    }
    if (formData.website && !formData.website.startsWith("https://")) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Invalid Input",
        message: "Website URL must start with https://",
      });
      return false;
    }

    if (!logoFile && !isEditMode) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Missing Field",
        message: "Please upload a logo",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      // 1. Vendor Details
      submitData.append("image", logoFile);
      submitData.append("vendorName", formData.vendorName.trim());
      submitData.append("category", formData.category);
      submitData.append("phoneNumber", formData.phoneNumber.trim());
      submitData.append("email", formData.email.trim());
      submitData.append("address", formData.address.trim());
      if (formData.website) {
        submitData.append("website", formData.website.trim());
      }

      // 2. Products Data
      // Map products to the JSON structure expected by the controller
      const productsData = formData.products.map((product) => ({
        productName: product.name,
        productType: product.type,
        productDescription: product.description || "",
        productPrice: product.price,
      }));

      // Append products JSON string
      if (productsData.length > 0) {
        submitData.append("products", JSON.stringify(productsData));
      }

      // 3. Product Images
      // The controller matches productImages[i] to productsData[i].
      // Since validation ensures every product has an image, we can safely append sequentially.
      formData.products.forEach((product) => {
        if (product.imageFile) {
          submitData.append("productImages", product.imageFile);
        }
      });

      if (isEditMode) {
        // --- EDIT MODE ---

        // 1. Update Vendor Details
        const vendorResponse = await api.put(
          `/api/admin/vendor/updateVendor/${initialData.id}`,
          submitData
        );

        if (!vendorResponse.data.success) {
          throw new Error(
            vendorResponse.data.message || "Failed to update vendor"
          );
        }

        // 2. Update Products (only those with IDs)
        // We iterate through products and update them individually as per requirement
        const productUpdates = formData.products
          .filter((p) => p.id) // Only existing products
          .map(async (product) => {
            const productData = new FormData();
            productData.append("productName", product.name);
            productData.append("productType", product.type);
            productData.append("productDescription", product.description || "");
            productData.append("productPrice", product.price);
            if (product.imageFile) {
              productData.append("image", product.imageFile);
            }

            return api.put(
              `/api/admin/vendor/updateProduct/${product.id}`,
              productData
            );
          });

        await Promise.all(productUpdates);

        setAlertState({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Vendor details updated successfully!",
          onConfirm: () => {
            if (onClose) onClose();
          },
        });
      } else {
        // --- ADD MODE ---
        // Single API Call
        const response = await api.post(
          "/api/admin/vendor/addVendor",
          submitData
        );

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to create vendor");
        }

        setAlertState({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Vendor and products registered successfully!",
          onConfirm: () => {
            if (onClose) onClose();
          },
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Registration Failed",
        message:
          error.response?.data?.message ||
          error.message ||
          "An error occurred during registration.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-10 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transform scale-100 transition-all flex flex-col max-h-[90vh]">
          {/* Modal Header */}
          <div className="px-8 py-10 border-b border-gray-100 flex items-center justify-between bg-gray-50 flex-shrink-0">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {isEditMode ? "Edit Vendor Details" : "Add New Vendor"}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {isEditMode
                  ? "Update vendor information and products."
                  : "Enter the details to register a new vendor in the system."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="p-8 overflow-y-auto custom-scrollbar flex-grow">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo Upload Section */}
              <div className="flex items-start gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="relative group shrink-0">
                  {logoPreview ? (
                    <div className="w-24 h-24 rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg border border-dashed border-gray-300 flex items-center justify-center bg-white group-hover:border-[#891737] transition-colors">
                      <Upload className="w-8 h-8 text-gray-300 group-hover:text-[#891737]" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">
                    Company Logo{" "}
                    {!isEditMode && <span className="text-red-500">*</span>}
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Upload a professional logo. Supported formats: PNG, JPG. Max
                    size: 5MB.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium shadow-sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </label>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              {/* Basic Information */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Vendor Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Vendor Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="vendorName"
                        value={formData.vendorName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                          errors.vendorName
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded-lg text-sm focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all placeholder:text-gray-300`}
                        placeholder="e.g. Bihar Studio Pvt Ltd"
                      />
                    </div>
                    {errors.vendorName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.vendorName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all appearance-none"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                          errors.phoneNumber
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded-lg text-sm focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all placeholder:text-gray-300`}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                          errors.email ? "border-red-500" : "border-gray-200"
                        } rounded-lg text-sm focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all placeholder:text-gray-300`}
                        placeholder="vendor@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all placeholder:text-gray-300 resize-none"
                        placeholder="Complete physical address"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Website URL
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                          errors.website ? "border-red-500" : "border-gray-200"
                        } rounded-lg text-sm focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all placeholder:text-gray-300`}
                        placeholder="https://example.com"
                      />
                    </div>
                    {errors.website && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.website}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              {/* Products Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Services & Products
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowProductForm(true)}
                    className="inline-flex items-center px-3 py-1.5 bg-[#891737]/10 text-[#891737] rounded-lg hover:bg-[#891737]/20 transition-colors text-xs font-medium border border-[#891737]/20"
                  >
                    <Plus className="w-3 h-3 mr-1.5" />
                    Add Item
                  </button>
                </div>

                {/* Product List */}
                {formData.products.length > 0 && (
                  <div className="space-y-3 mb-5">
                    {formData.products.map((product, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-xl border border-gray-100 group hover:border-gray-200 transition-colors"
                      >
                        <div className="flex justify-between items-start gap-4">
                          {/* Product Image Thumbnail */}
                          <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 overflow-hidden shrink-0">
                            {product.imagePreview ? (
                              <img
                                src={product.imagePreview}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-1 flex-grow">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {product.name}
                              </h4>
                              <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-500 font-medium">
                                {product.type}
                              </span>
                            </div>
                            {product.description && (
                              <p className="text-xs text-gray-500 line-clamp-1">
                                {product.description}
                              </p>
                            )}
                            {product.price && (
                              <p className="text-xs font-medium text-[#891737]">
                                ₹{product.price}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Product Sub-Form */}
                {showProductForm && (
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="text-sm font-semibold text-gray-900">
                        New Item Details
                      </h5>
                      <button
                        onClick={() => setShowProductForm(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex gap-4 mb-4">
                      {/* Product Image Upload */}
                      <div className="shrink-0">
                        <input
                          type="file"
                          accept="image/*"
                          id="product-image"
                          onChange={handleProductImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="product-image"
                          className="block cursor-pointer"
                        >
                          <div
                            className={`w-20 h-20 rounded-lg border border-dashed flex items-center justify-center transition-colors ${
                              currentProduct.imagePreview
                                ? "border-gray-200"
                                : "border-gray-300 hover:border-[#891737]"
                            }`}
                          >
                            {currentProduct.imagePreview ? (
                              <img
                                src={currentProduct.imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="text-center">
                                <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                <span className="text-[10px] text-gray-500 block">
                                  Img
                                </span>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-grow">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Item Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={currentProduct.name}
                            onChange={handleProductChange}
                            placeholder="Service or Product Name"
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#891737] focus:border-[#891737] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Item Type *
                          </label>
                          <input
                            type="text"
                            name="type"
                            value={currentProduct.type}
                            onChange={handleProductChange}
                            placeholder="e.g. Service"
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#891737] focus:border-[#891737] outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={currentProduct.description}
                          onChange={handleProductChange}
                          rows={2}
                          placeholder="Brief description..."
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#891737] focus:border-[#891737] outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={currentProduct.price}
                          onChange={handleProductChange}
                          placeholder="0.00"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#891737] focus:border-[#891737] outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => setShowProductForm(false)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={addProduct}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 hover:bg-black rounded-lg transition-colors"
                      >
                        Add Item
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:border-gray-400 hover:shadow-sm transition-all text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#891737] text-white rounded-lg hover:bg-[#891737]/90 hover:shadow-lg hover:shadow-[#891737]/20 transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Register Vendor"}
              {!isSubmitting && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <AlertBox
          isOpen={alertState.isOpen}
          type={alertState.type}
          title={alertState.title}
          message={alertState.message}
          onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={alertState.onConfirm}
        />
      </div>
    </>
  );
};

export default AddVendorForm;
