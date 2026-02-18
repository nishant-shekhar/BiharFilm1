import React, { useState, useEffect, useMemo } from "react";
import {
  Building2,
  Package,
  AlertCircle,
  CheckCircle,
  User,
  Edit3,
  Plus,
  X,
  Save,
  Loader,
  MapPin,
  Phone,
  Mail,
  Globe,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import AlertBox from "../Components/AlertBox";
import CategoryDropdown from "./CategoryDropdown";
import api from "../Components/axios";
import { validateFile } from "../utils/fileValidation";
import vendorCategories from "../utils/vendorCategories.json";

const VENDOR_CATEGORIES = [
  "Shooting Studios",
  "Sound Studios",
  "Editing Studios",
  "Animation & Graphics Studios",
  "Costume Suppliers",
  "Props Suppliers",
  "Food & Catering Suppliers",
  "Cine Equipment Suppliers",
  "Junior Artist Providers",
  "Spot Boy Providers",
  "Hotels & Hospitality Providers",
  "Vanity Van Providers",
  "Transport Providers",
  "Logistics Providers",
  "Travel Agents",
  "Generator Services",
  "Security Services",
  "Houses for shooting providers",
  "Choreography & Dancers",
  "Still Photography & BTS",
  "Lighting Equipment Suppliers",
  "Others",
];

const ITEMS_PER_PAGE = 5;

// ✅ Extract Categories Helper
const extractCategories = (data) => {
  if (!data) return [];

  if (Array.isArray(data.categories)) {
    return data.categories
      .map((c) => (typeof c === "object" ? c.category?.name : c))
      .filter(Boolean);
  }

  if (Array.isArray(data.category)) return data.category;

  if (typeof data.category === "string") {
    return data.category
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return [];
};
// ✅ Add these helpers near the top (after extractCategories)

const isVisibleOnHomepage = (product) =>
  product?.verified === true || product?.verified === 1;

// Optional: if backend later adds a dedicated flag for homepage display
// const isVisibleOnHomepage = (product) => product?.isHomepageVisible === true;


const VendorDashboard = () => {
  const [vendorId, setVendorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);

  const [vendorData, setVendorData] = useState({
    id: null,
    vendorName: "",
    category: [],
    phoneNumber: "",
    email: "",
    address: "",
    website: "",
    logoUrl: "",
    products: [],
    createdAt: new Date().toISOString(),
  });

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalViews: 1247,
    totalInquiries: 89,
    averageRating: 4.6,
    monthlyRevenue: 125000,
    activeBookings: 7,
  });

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [productImageFile, setProductImageFile] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);

  // ✅ IMPORTANT: subType is REQUIRED now
  const [productFormData, setProductFormData] = useState({
    name: "",
    type: "",
    subType: "",
    description: "",
    price: "",
    priceFrom: "",
    priceTo: "",
    link: "",
  });

  // ✅ Type/SubType restricted + “Other” text input
  const [showOtherType, setShowOtherType] = useState(false);
  const [showOtherSubType, setShowOtherSubType] = useState(false);

  const [profileFormData, setProfileFormData] = useState({
    vendorName: "",
    category: [],
    phoneNumber: "",
    email: "",
    address: "",
    website: "",
  });

  // ✅ Alert
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    confirmText: "OK",
    showCancel: false,
    onConfirm: null,
    autoClose: false,
  });

  // ✅ Validation errors
  const [errors, setErrors] = useState({
    vendorName: "",
    phoneNumber: "",
    email: "",
    address: "",
    website: "",
  });

  const API_BASE_URL = "/api/vendor";
  const API_BASE_URL_PRODUCTS = "/api/vendorproduct";

  // ✅ Alert helpers
  const showAlert = (config) => {
    setAlertConfig({
      isOpen: true,
      type: config.type || "info",
      title: config.title || "",
      message: config.message || "",
      confirmText: config.confirmText || "OK",
      cancelText: config.cancelText || "Cancel",
      showCancel: config.showCancel || false,
      onConfirm: config.onConfirm || null,
      autoClose: config.autoClose || false,
      duration: config.duration || 3000,
    });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // ✅ Validation Function
  const validateField = (name, value) => {
    let err = "";
    switch (name) {
      case "vendorName":
        if (value && !/^[a-zA-Z\s]*$/.test(value)) {
          err = "Only text allowed (no numbers or special characters).";
        }
        break;
      case "phoneNumber":
        if (value && !/^\d*$/.test(value)) {
          err = "Only numbers allowed.";
        } else if (
          value.length > 0 &&
          value.length !== 10 &&
          value.length !== 12
        ) {
          err = "Phone number must be either 10 or 12 digits.";
        }
        break;
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) err = "Please enter a valid email.";
        break;
      }
      case "website":
        if (value && !value.startsWith("https://")) {
          err = "Website URL must start with https://";
        }
        break;
      default:
        break;
    }
    return err;
  };

  // ✅ Fetch profile
  useEffect(() => {
    const fetchVendorProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`${API_BASE_URL}/myVendorProfile`, {
          validateStatus: () => true,
        });

        if (response.status >= 200 && response.status < 300) {
          const result = response.data;
          const categoryArray = extractCategories(result.data);

          setVendorData({
            ...result.data,
            category: categoryArray,
          });
          setVendorId(result.data.id);

          setStats((prev) => ({
            ...prev,
            totalProducts: result.data.products?.length || 0,
          }));

          setProfileFormData({
            vendorName: result.data.vendorName || "",
            category: categoryArray,
            phoneNumber: result.data.phoneNumber || "",
            email: result.data.email || "",
            address: result.data.address || "",
            website: result.data.website || "",
          });

          if (result.data.logoUrl) setLogoPreview(result.data.logoUrl);
        } else if (response.status === 404 || response.status === 403) {
          setVendorId(null);
          setError(null);
        } else if (response.status === 401) {
          setError("Session expired. Please login again.");
          showAlert({
            type: "error",
            title: "Session Expired",
            message: "Your session has expired. Please login again.",
            confirmText: "Login",
            onConfirm: () => {
              window.location.href = "/login";
            },
          });
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching vendor profile:", err);
        setError("Failed to load vendor profile. Please try again.");
        showAlert({
          type: "error",
          title: "Failed to Load Profile",
          message: "Unable to load your vendor profile. Please try again.",
          confirmText: "Retry",
          onConfirm: () => window.location.reload(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, []);

  // ✅ Create profile
  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setProfileUpdateLoading(true);

    try {
      if (Object.values(errors).some((x) => x)) {
        showAlert({
          type: "error",
          title: "Validation Error",
          message: "Please fix the errors in the form before submitting.",
        });
        return;
      }

      if (
        !profileFormData.vendorName ||
        profileFormData.category.length === 0 ||
        !profileFormData.phoneNumber ||
        !profileFormData.email ||
        !profileFormData.address
      ) {
        showAlert({
          type: "warning",
          title: "Missing Fields",
          message: "Please fill in all required fields",
        });
        return;
      }

      if (!logoFile) {
        showAlert({
          type: "warning",
          title: "Logo Required",
          message: "Please upload a logo for your vendor profile",
        });
        return;
      }

      const formData = new FormData();
      formData.append("vendorName", profileFormData.vendorName);
      formData.append("categories", profileFormData.category.join(", "));
      formData.append("phoneNumber", profileFormData.phoneNumber);
      formData.append("email", profileFormData.email);
      formData.append("address", profileFormData.address);
      formData.append("website", profileFormData.website || "");
      formData.append("logo", logoFile);

      const response = await api.post(`${API_BASE_URL}/addvendors`, formData, {
        validateStatus: () => true,
      });

      if (response.status >= 200 && response.status < 300) {
        const result = response.data;
        const categoryArray = extractCategories(result.data);

        setVendorId(result.data.id);
        setVendorData({ ...result.data, category: categoryArray });

        setProfileFormData({
          vendorName: result.data.vendorName || "",
          category: categoryArray,
          phoneNumber: result.data.phoneNumber || "",
          email: result.data.email || "",
          address: result.data.address || "",
          website: result.data.website || "",
        });

        setShowEditProfileModal(false);
        setLogoPreview(null);
        setLogoFile(null);

        showAlert({
          type: "success",
          title: "Profile Created!",
          message: "Your vendor profile has been created successfully. Now add your products!",
          autoClose: true,
          duration: 2500,
        });
      } else {
        throw new Error(response.data?.message || "Failed to create profile");
      }
    } catch (err) {
      console.error("Error creating profile:", err);
      showAlert({
        type: "error",
        title: "Creation Failed",
        message: `Failed to create profile: ${err.message}`,
      });
    } finally {
      setProfileUpdateLoading(false);
    }
  };

  // ✅ Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileUpdateLoading(true);

    try {
      if (Object.values(errors).some((x) => x)) {
        showAlert({
          type: "error",
          title: "Validation Error",
          message: "Please fix the errors in the form before submitting.",
        });
        return;
      }

      if (
        !profileFormData.vendorName ||
        profileFormData.category.length === 0 ||
        !profileFormData.phoneNumber ||
        !profileFormData.email ||
        !profileFormData.address
      ) {
        showAlert({
          type: "warning",
          title: "Missing Fields",
          message: "Please fill in all required fields",
        });
        return;
      }

      const formData = new FormData();
      formData.append("vendorName", profileFormData.vendorName);
      formData.append("categories", profileFormData.category.join(", "));
      formData.append("phoneNumber", profileFormData.phoneNumber);
      formData.append("email", profileFormData.email);
      formData.append("address", profileFormData.address);
      formData.append("website", profileFormData.website || "");
      if (logoFile) formData.append("logo", logoFile);

      const response = await api.put(`${API_BASE_URL}/vendors/${vendorId}`, formData, {
        validateStatus: () => true,
      });

      if (response.status >= 200 && response.status < 300) {
        const result = response.data;
        const categoryArray = extractCategories(result.data);

        setVendorData({ ...result.data, category: categoryArray });
        setProfileFormData({
          vendorName: result.data.vendorName || "",
          category: categoryArray,
          phoneNumber: result.data.phoneNumber || "",
          email: result.data.email || "",
          address: result.data.address || "",
          website: result.data.website || "",
        });

        setShowEditProfileModal(false);
        setLogoPreview(null);
        setLogoFile(null);

        showAlert({
          type: "success",
          title: "Profile Updated!",
          message: "Your profile has been updated successfully.",
          autoClose: true,
          duration: 2000,
        });
      } else if (response.status === 403) {
        showAlert({
          type: "error",
          title: "Unauthorized",
          message: "You cannot update this vendor profile.",
        });
      } else {
        throw new Error(response.data?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      showAlert({
        type: "error",
        title: "Update Failed",
        message: `Failed to update profile: ${err.message}`,
      });
    } finally {
      setProfileUpdateLoading(false);
    }
  };

  // ✅ Product input change
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ STRICT Type change logic
  const handleTypeChange = (e) => {
    const value = e.target.value;

    if (value === "Other") {
      setShowOtherType(true);
      setShowOtherSubType(true); // force subtype text box
      setProductFormData((prev) => ({ ...prev, type: "", subType: "" }));
      return;
    }

    setShowOtherType(false);
    setShowOtherSubType(false);
    setProductFormData((prev) => ({ ...prev, type: value, subType: "" }));
  };

  // ✅ STRICT SubType change logic
  const handleSubTypeChange = (e) => {
    const value = e.target.value;

    if (value === "Other") {
      setShowOtherSubType(true);
      setProductFormData((prev) => ({ ...prev, subType: "" }));
      return;
    }

    setShowOtherSubType(false);
    setProductFormData((prev) => ({ ...prev, subType: value }));
  };

  const validateProductForm = () => {
    if (!productFormData.name?.trim()) return "Product name is required.";
    if (!productFormData.type?.trim()) return "Type is required.";
    if (!productFormData.subType?.trim()) return "Sub-Type is required.";
    if (!productFormData.description?.trim()) return "Description is required.";
    return null;
  };

  // ✅ Add product (subType required)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!vendorId) {
        showAlert({
          type: "warning",
          title: "Profile Required",
          message: "Please create your vendor profile first",
        });
        return;
      }

      const vErr = validateProductForm();
      if (vErr) {
        showAlert({ type: "warning", title: "Missing Fields", message: vErr });
        return;
      }

      const formData = new FormData();
      formData.append("name", productFormData.name.trim());
      formData.append("type", productFormData.type.trim());
      formData.append("subType", productFormData.subType.trim());
      formData.append("description", productFormData.description.trim());

      if (productFormData.link && /^https:\/\/.+/.test(productFormData.link)) {
        formData.append("productLink", productFormData.link);
      }

      const priceString =
        productFormData.priceFrom && productFormData.priceTo
          ? `${productFormData.priceFrom}-${productFormData.priceTo}`
          : productFormData.price;

      formData.append("price", priceString || "");

      if (productImageFile) formData.append("image", productImageFile);

      const response = await api.post(
        `${API_BASE_URL_PRODUCTS}/vendors/${vendorId}/products`,
        formData,
        { validateStatus: () => true }
      );

      if (response.status >= 200 && response.status < 300) {
        await handleRefreshProducts();

        setProductFormData({
          name: "",
          type: "",
          subType: "",
          description: "",
          price: "",
          priceFrom: "",
          priceTo: "",
          link: "",
        });
        setProductImagePreview(null);
        setProductImageFile(null);
        setShowOtherType(false);
        setShowOtherSubType(false);
        setShowAddProductModal(false);

        showAlert({
          type: "success",
          title: "Product Added!",
          message: "Your product has been added successfully.",
          autoClose: true,
          duration: 2000,
        });
      } else if (response.status === 403) {
        showAlert({
          type: "error",
          title: "Unauthorized",
          message: "You cannot add products to this vendor.",
        });
      } else {
        throw new Error(response.data?.message || `Failed to add product: ${response.status}`);
      }
    } catch (err) {
      console.error("Error adding product:", err);
      showAlert({
        type: "error",
        title: "Failed to Add Product",
        message: `Failed to add product: ${err.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Refresh products
  const handleRefreshProducts = async () => {
    try {
      if (!vendorId) return;
      setIsRefreshing(true);

      const response = await api.get(`${API_BASE_URL}/myVendorProfile`, {
        validateStatus: () => true,
      });

      if (response.status >= 200 && response.status < 300) {
        const result = response.data;
        setVendorData((prev) => ({
          ...prev,
          products: result.data.products || [],
        }));
        setStats((prev) => ({
          ...prev,
          totalProducts: result.data.products?.length || 0,
        }));
      }
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // ✅ Edit click: detect custom type/subtype (Other)
  const handleEditClick = (product) => {
    setEditingProduct(product);

    const typeVal = (product.type || "").trim();
    const subVal = (product.subType || "").trim();

    const typeObj = vendorCategories.find((c) => c.name === typeVal);
    const isCustomType = !typeObj;

    setShowOtherType(isCustomType);

    if (isCustomType) {
      setShowOtherSubType(true);
    } else {
      const subtypeExists = typeObj.subcategories?.some((s) => s.name === subVal);
      setShowOtherSubType(!subtypeExists);
    }

    setProductFormData({
      name: product.name || "",
      type: typeVal,
      subType: subVal,
      description: product.description || "",
      price: product.price && !String(product.price).includes("-") ? product.price : "",
      priceFrom:
        product.price && String(product.price).includes("-")
          ? String(product.price).split("-")[0]
          : "",
      priceTo:
        product.price && String(product.price).includes("-")
          ? String(product.price).split("-")[1]
          : "",
      link: product.productLink || "",
    });

    setProductImagePreview(product.imageUrl || null);
    setProductImageFile(null);
    setShowAddProductModal(true);
  };

  // ✅ Update product (subType required)
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!editingProduct?.id) return;

      const vErr = validateProductForm();
      if (vErr) {
        showAlert({ type: "warning", title: "Missing Fields", message: vErr });
        return;
      }

      const formData = new FormData();
      formData.append("name", productFormData.name.trim());
      formData.append("type", productFormData.type.trim());
      formData.append("subType", productFormData.subType.trim());
      formData.append("description", productFormData.description.trim());

      if (productFormData.link && /^https:\/\/.+/.test(productFormData.link)) {
        formData.append("productLink", productFormData.link);
      }

      const priceString =
        productFormData.priceFrom && productFormData.priceTo
          ? `${productFormData.priceFrom}-${productFormData.priceTo}`
          : productFormData.price;

      formData.append("price", priceString || "");

      if (productImageFile) formData.append("image", productImageFile);

      const response = await api.put(
        `${API_BASE_URL_PRODUCTS}/updateproduct/${editingProduct.id}`,
        formData,
        { validateStatus: () => true }
      );

      if (response.status >= 200 && response.status < 300) {
        await handleRefreshProducts();

        setEditingProduct(null);
        setShowAddProductModal(false);
        setProductFormData({
          name: "",
          type: "",
          subType: "",
          description: "",
          price: "",
          priceFrom: "",
          priceTo: "",
          link: "",
        });
        setProductImagePreview(null);
        setProductImageFile(null);
        setShowOtherType(false);
        setShowOtherSubType(false);

        showAlert({
          type: "success",
          title: "Product Updated!",
          message: "Product details updated successfully.",
          autoClose: true,
          duration: 2000,
        });
      } else {
        throw new Error(response.data?.message || "Failed to update product");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      showAlert({
        type: "error",
        title: "Update Failed",
        message: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Delete product
  const handleDeleteProduct = async (productId) => {
    showAlert({
      type: "warning",
      title: "Delete Product?",
      message: "Are you sure you want to delete this product? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      showCancel: true,
      onConfirm: async () => {
        try {
          const response = await api.delete(`${API_BASE_URL_PRODUCTS}/products/${productId}`, {
            validateStatus: () => true,
          });

          if (response.status >= 200 && response.status < 300) {
            await handleRefreshProducts();
            showAlert({
              type: "success",
              title: "Product Deleted!",
              message: "Product has been deleted successfully.",
              autoClose: true,
              duration: 1800,
            });
          } else {
            throw new Error(response.data?.message || "Failed to delete product");
          }
        } catch (err) {
          console.error("Delete failed:", err);
          showAlert({
            type: "error",
            title: "Delete Failed",
            message: err.message,
          });
        }
      },
    });
  };

  // ✅ Logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      showAlert({ type: "warning", title: "Validation Error", message: validation.error });
      e.target.value = null;
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (event) => setLogoPreview(event.target.result);
    reader.readAsDataURL(file);
  };

  // ✅ Product image upload
  const handleProductImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, 1); // 1MB
    if (!validation.isValid) {
      showAlert({ type: "warning", title: "Validation Error", message: validation.error });
      e.target.value = null;
      return;
    }

    setProductImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => setProductImagePreview(event.target.result);
    reader.readAsDataURL(file);
  };

  // ✅ Profile input change
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber" && value.length > 12) return;

    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Pagination data
  const validProducts = useMemo(
    () => (Array.isArray(vendorData.products) ? vendorData.products : []),
    [vendorData.products]
  );

  const totalPages = Math.ceil(validProducts.length / ITEMS_PER_PAGE) || 1;

  const currentProducts = validProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  // ✅ Loading
  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#a92b4e] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Fetching your profile...</p>
        </div>
      </div>
    );
  }

  // ✅ Error with existing vendor
  if (error && vendorId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-lg bg-white rounded-xl p-6 shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#a92b4e] hover:bg-[#891737] text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ✅ No vendor profile -> show create
  if (!vendorId) {
    return (
      <>
        <AlertBox {...alertConfig} onClose={closeAlert} />

        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center max-w-lg bg-white rounded-xl p-6 shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Create Your Vendor Profile</h2>
            <p className="text-gray-600 mb-4">
              Set up your vendor profile to start showcasing your products!
            </p>
            <button
              onClick={() => setShowEditProfileModal(true)}
              className="bg-[#a92b4e] hover:bg-[#891737] text-white px-6 py-2 rounded-lg"
            >
              + Create Profile
            </button>
          </div>
        </div>

        {/* Create/Edit Profile Modal */}
        {showEditProfileModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#a92b4e] text-white rounded-t-xl">
                <h2 className="font-bold">{vendorId ? "Edit Profile" : "Create Profile"}</h2>
                <button onClick={() => setShowEditProfileModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={vendorId ? handleUpdateProfile : handleCreateProfile}
                className="p-4 space-y-4"
              >
                <div className="text-center">
                  <label className="cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#a92b4e] to-[#891737] flex items-center justify-center overflow-hidden mx-auto">
                      {logoPreview || vendorData.logoUrl ? (
                        <img
                          src={logoPreview || vendorData.logoUrl}
                          alt="Logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  <p className="text-sm font-medium mt-2">Click to upload logo</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor Name *
                    </label>
                    <input
                      type="text"
                      name="vendorName"
                      value={profileFormData.vendorName}
                      onChange={handleProfileInputChange}
                      required
                      className={`w-full px-3 py-2 border ${
                        errors.vendorName ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent`}
                    />
                    {errors.vendorName && (
                      <p className="text-xs text-red-500 mt-1">{errors.vendorName}</p>
                    )}
                  </div>

                  <div>
                    <CategoryDropdown
                      value={profileFormData.category}
                      onChange={(value) => setProfileFormData((prev) => ({ ...prev, category: value }))}
                      options={VENDOR_CATEGORIES}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profileFormData.phoneNumber}
                      onChange={handleProfileInputChange}
                      required
                      className={`w-full px-3 py-2 border ${
                        errors.phoneNumber ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent`}
                      placeholder="9876543210"
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={profileFormData.email}
                      onChange={handleProfileInputChange}
                      required
                      className={`w-full px-3 py-2 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent`}
                      placeholder="vendor@example.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <textarea
                    name="address"
                    value={profileFormData.address}
                    onChange={handleProfileInputChange}
                    required
                    rows={2}
                    className={`w-full px-3 py-2 border ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent resize-none`}
                    placeholder="Complete address..."
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={profileFormData.website}
                    onChange={handleProfileInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.website ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent`}
                    placeholder="https://example.com"
                  />
                  {errors.website && (
                    <p className="text-xs text-red-500 mt-1">{errors.website}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditProfileModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={profileUpdateLoading}
                    className="flex-1 bg-[#a92b4e] hover:bg-[#891737] text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {profileUpdateLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {profileUpdateLoading ? "Saving..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  // ✅ Main dashboard
  return (
    <div className="min-h-screen p-4">
      <AlertBox {...alertConfig} onClose={closeAlert} />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              {/* Profile Info */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Logo */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-50">
                    {vendorData.logoUrl ? (
                      <img
                        src={vendorData.logoUrl}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-7 h-7 text-gray-400" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-semibold text-gray-900 mb-2">
                    {vendorData.vendorName || "Complete your profile"}
                  </h1>

                  {/* Category chips */}
                  {vendorData.category && vendorData.category.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {vendorData.category.map((cat) => (
                        <span
                          key={cat}
                          className="bg-rose-50 text-rose-700 text-xs px-2.5 py-1 rounded-full whitespace-nowrap"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 mb-2">No category</p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>
                      Member since{" "}
                      {new Date(vendorData.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Location */}
                  {vendorData.address ? (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate">{vendorData.address}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Location not provided</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Profile Button */}
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#891737] hover:bg-[#891737]/90 rounded-lg transition-colors flex-shrink-0"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Products & Services</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {vendorData.products?.length || 0}{" "}
                    {vendorData.products?.length === 1 ? "item" : "items"}
                  </p>
                </div>

                <button
                  onClick={handleRefreshProducts}
                  disabled={isRefreshing}
                  className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                    isRefreshing
                      ? "animate-spin text-[#a92b4e]"
                      : "text-gray-400 hover:text-[#a92b4e]"
                  }`}
                  title="Refresh Products"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowOtherType(false);
                  setShowOtherSubType(false);
                  setProductFormData({
                    name: "",
                    type: "",
                    subType: "",
                    description: "",
                    price: "",
                    priceFrom: "",
                    priceTo: "",
                    link: "",
                  });
                  setProductImagePreview(null);
                  setProductImageFile(null);
                  setShowAddProductModal(true);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#891737] hover:bg-[#891737]/90 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            {/* Products list */}
            <div className="p-6">
              {currentProducts && currentProducts.length > 0 ? (
                <>
                  <div className="space-y-3 min-h-[300px]">
                    {currentProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:border-gray-200 hover:bg-gray-50/50 transition-all"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={product.imageUrl || "/api/placeholder/56/56"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
          

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 mb-0.5">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-1">
                            {product.type} • {product.subType}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {product.description}
                          </p>
              {/* Visible on Homepage indicator */}
  <div className="mt-2">
    {isVisibleOnHomepage(product) ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-green-50 text-green-700 border border-green-100">
        <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
        Visible on Homepage
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
        Under Review (Not Visible)
      </span>
    )}
  </div>
                          {product.productLink && (
                            <a
                              href={product.productLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View Link
                            </a>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {product.price ? `₹${String(product.price)}` : (
                              <span className="text-gray-400 font-normal">Not set</span>
                            )}
                          </p>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEditClick(product)}
                              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">No products yet</h3>
                  <p className="text-xs text-gray-500 mb-4 max-w-xs mx-auto">
                    Start building your catalog by adding your first product or service
                  </p>
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#891737] hover:bg-[#891737]/90 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Product
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Contact info */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Contact Information</h2>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-0.5">Phone</p>
                    {vendorData.phoneNumber ? (
                      <a
                        href={`tel:${vendorData.phoneNumber}`}
                        className="text-sm text-gray-900 hover:text-[#891737] transition-colors"
                      >
                        {vendorData.phoneNumber}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-400">Not provided</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-0.5">Email</p>
                    {vendorData.email ? (
                      <a
                        href={`mailto:${vendorData.email}`}
                        className="text-sm text-gray-900 hover:text-[#891737] transition-colors truncate block"
                      >
                        {vendorData.email}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-400">Not provided</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-0.5">Website</p>
                    {vendorData.website ? (
                      <a
                        href={
                          vendorData.website.startsWith("http")
                            ? vendorData.website
                            : `https://${vendorData.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-[#891737] hover:text-[#891737]/80 font-medium transition-colors"
                      >
                        View Website
                      </a>
                    ) : (
                      <p className="text-sm text-gray-400">Not provided</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Categories</p>
                    {vendorData.category && vendorData.category.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {vendorData.category.map((cat) => (
                          <span
                            key={cat}
                            className="bg-rose-50 text-rose-700 text-xs px-2.5 py-1 rounded-full whitespace-nowrap"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Not specified</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddProductModal && vendorId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingProduct ? "Update product details below" : "Fill in the product details below"}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowAddProductModal(false);
                  setEditingProduct(null);
                  setShowOtherType(false);
                  setShowOtherSubType(false);
                  setProductFormData({
                    name: "",
                    type: "",
                    subType: "",
                    description: "",
                    price: "",
                    priceFrom: "",
                    priceTo: "",
                    link: "",
                  });
                  setProductImagePreview(null);
                  setProductImageFile(null);
                }}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]"
            >
              <div className="space-y-4">
                {/* Image */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Product Image</label>
                  <label className="cursor-pointer block">
                    <div className="w-full h-32 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300 flex items-center justify-center overflow-hidden transition-colors">
                      {productImagePreview ? (
                        <img src={productImagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">Click to upload image</p>
                          <p className="text-xs text-gray-400 mt-0.5">Max 1MB</p>
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleProductImageUpload} className="hidden" />
                  </label>
                </div>

                {/* Name & Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={productFormData.name}
                      onChange={handleProductInputChange}
                      required
                      className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 transition-colors"
                      placeholder="Enter name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Type <span className="text-red-500">*</span>
                    </label>

                    {!showOtherType ? (
                      <select
                        value={productFormData.type}
                        onChange={handleTypeChange}
                        required
                        className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 transition-colors bg-white"
                      >
                        <option value="">Select Type</option>
                        {vendorCategories.map((cat, index) => (
                          <option key={index} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          name="type"
                          value={productFormData.type}
                          onChange={handleProductInputChange}
                          required
                          className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 transition-colors pr-8"
                          placeholder="Enter custom type"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setShowOtherType(false);
                            setShowOtherSubType(false);
                            setProductFormData((prev) => ({ ...prev, type: "", subType: "" }));
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          title="Back to list"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-Type (REQUIRED) */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Sub-Type <span className="text-red-500">*</span>
                  </label>

                  {!showOtherSubType && !showOtherType ? (
                    <select
                      value={productFormData.subType}
                      onChange={handleSubTypeChange}
                      required
                      disabled={!productFormData.type}
                      className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 transition-colors bg-white disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      <option value="">Select Sub-Type</option>
                      {vendorCategories
                        .find((c) => c.name === productFormData.type)
                        ?.subcategories?.map((sub, index) => (
                          <option key={index} value={sub.name}>
                            {sub.name}
                          </option>
                        ))}
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        name="subType"
                        value={productFormData.subType}
                        onChange={handleProductInputChange}
                        required
                        className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 transition-colors pr-8"
                        placeholder="Enter custom sub-type"
                      />
                      {!showOtherType && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowOtherSubType(false);
                            setProductFormData((prev) => ({ ...prev, subType: "" }));
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          title="Back to list"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={productFormData.description}
                    onChange={handleProductInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 transition-colors resize-none"
                    placeholder="Describe your product..."
                  />
                </div>

                {/* Price range */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Price Range (₹){" "}
                    <span className="text-gray-400 text-xs font-normal">Optional</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="priceFrom"
                      value={productFormData.priceFrom}
                      onChange={handleProductInputChange}
                      min="0"
                      className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 transition-colors"
                      placeholder="From"
                    />
                    <span className="text-gray-400 text-sm">to</span>
                    <input
                      type="number"
                      name="priceTo"
                      value={productFormData.priceTo}
                      onChange={handleProductInputChange}
                      min="0"
                      className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 transition-colors"
                      placeholder="To"
                    />
                  </div>
                </div>

                {/* Link */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Product Link{" "}
                    <span className="text-gray-400 text-xs font-normal">Optional</span>
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={productFormData.link}
                    onChange={handleProductInputChange}
                    className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 transition-colors"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddProductModal(false);
                    setEditingProduct(null);
                    setShowOtherType(false);
                    setShowOtherSubType(false);
                    setProductFormData({
                      name: "",
                      type: "",
                      subType: "",
                      description: "",
                      price: "",
                      priceFrom: "",
                      priceTo: "",
                      link: "",
                    });
                    setProductImagePreview(null);
                    setProductImageFile(null);
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#891737] hover:bg-[#891737]/90 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      {editingProduct ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      {editingProduct ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {editingProduct ? "Update Product" : "Add Product"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Edit Profile</h2>
                <p className="text-xs text-gray-500 mt-0.5">Update your vendor information</p>
              </div>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form
              onSubmit={handleUpdateProfile}
              className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]"
            >
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Profile Logo</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                      <div className="w-20 h-20 rounded-lg bg-gray-100 border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center overflow-hidden transition-colors">
                        {logoPreview || vendorData.logoUrl ? (
                          <img
                            src={logoPreview || vendorData.logoUrl}
                            alt="Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                    <div>
                      <button
                        type="button"
                        onClick={() => document.querySelector('input[type="file"]')?.click()}
                        className="text-sm font-medium text-[#891737] hover:text-[#891737]/80 transition-colors"
                      >
                        Change Logo
                      </button>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Vendor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="vendorName"
                      value={profileFormData.vendorName}
                      onChange={handleProfileInputChange}
                      required
                      className={`w-full px-3 py-2 text-sm text-gray-900 border ${
                        errors.vendorName ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:outline-none focus:border-gray-300 transition-colors`}
                    />
                    {errors.vendorName && <p className="text-xs text-red-500 mt-1">{errors.vendorName}</p>}
                  </div>

                  <div>
                    <CategoryDropdown
                      value={profileFormData.category}
                      onChange={(value) => setProfileFormData((prev) => ({ ...prev, category: value }))}
                      options={VENDOR_CATEGORIES}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profileFormData.phoneNumber}
                      onChange={handleProfileInputChange}
                      required
                      className={`w-full px-3 py-2 text-sm text-gray-900 border ${
                        errors.phoneNumber ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:outline-none focus:border-gray-300 transition-colors`}
                    />
                    {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileFormData.email}
                      onChange={handleProfileInputChange}
                      required
                      className={`w-full px-3 py-2 text-sm text-gray-900 border ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:outline-none focus:border-gray-300 transition-colors`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Business Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={profileFormData.address}
                    onChange={handleProfileInputChange}
                    required
                    rows={2}
                    className={`w-full px-3 py-2 text-sm text-gray-900 border ${
                      errors.address ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:border-gray-300 transition-colors resize-none`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Website <span className="text-gray-400 text-xs font-normal">Optional</span>
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={profileFormData.website}
                    onChange={handleProfileInputChange}
                    className={`w-full px-3 py-2 text-sm text-gray-900 border ${
                      errors.website ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:border-gray-300 transition-colors`}
                    placeholder="https://yourwebsite.com"
                  />
                  {errors.website && <p className="text-xs text-red-500 mt-1">{errors.website}</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={profileUpdateLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#891737] hover:bg-[#891737]/90 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  {profileUpdateLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
