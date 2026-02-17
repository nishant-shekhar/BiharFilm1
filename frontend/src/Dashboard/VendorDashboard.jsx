import React, { useState, useEffect } from "react";
import {
  Building2,
  Package,
  Star,
  Eye,
  MessageCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Edit3,
  Plus,
  BarChart3,
  X,
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  User,
  Camera,
  Image as ImageIcon,
  DollarSign,
  RefreshCw, // ✅ Added Refresh icon
  ChevronLeft, // ✅ Added ChevronLeft
  ChevronRight, // ✅ Added ChevronRight
  ExternalLink,
} from "lucide-react";
import AlertBox from "../Components/AlertBox";
import CategoryDropdown from "./CategoryDropdown";
import api from "../Components/axios";
import { validateFile } from "../utils/fileValidation";

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
  // Added from OLD list (missing)
  "Choreography & Dancers",
  "Still Photography & BTS",
  "Lighting Equipment Suppliers",
  "Others",
];

const ITEMS_PER_PAGE = 5; // ✅ Pagination Limit

// ✅ Extract Categories Helper
const extractCategories = (data) => {
  if (!data) return [];

  // Check for 'categories' array of objects (new structure)
  if (Array.isArray(data.categories)) {
    return data.categories
      .map((c) => (typeof c === "object" ? c.category?.name : c))
      .filter(Boolean);
  }

  // Check for 'category' array of strings (old structure)
  if (Array.isArray(data.category)) {
    return data.category;
  }

  // Check for 'category' comma-separated string (old structure)
  if (typeof data.category === "string") {
    return data.category.split(", ").filter((c) => c);
  }

  return [];
};

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

  // ✅ Edit Product State
  const [editingProduct, setEditingProduct] = useState(null);

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);

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

  const [profileFormData, setProfileFormData] = useState({
    vendorName: "",
    category: [],
    phoneNumber: "",
    email: "",
    address: "",
    website: "",
  });

  // ✅ Alert state
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

  // ✅ Validation Error State
  const [errors, setErrors] = useState({
    vendorName: "",
    phoneNumber: "",
    email: "",
    address: "",
    website: "",
  });

  const API_BASE_URL = "/api/vendor";
  const API_BASE_URL_PRODUCTS = "/api/vendorproduct";
  const token = localStorage.getItem("authToken");

  // ✅ Alert helper function
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
    setAlertConfig({ ...alertConfig, isOpen: false });
  };

  // ✅ Validation Function
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

  useEffect(() => {
    const fetchVendorProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("📡 Fetching vendor profile by userId...");

        const response = await api.get(`${API_BASE_URL}/myVendorProfile`, {
          validateStatus: () => true,
        });

        if (response.status >= 200 && response.status < 300) {
          const result = response.data;
          console.log("✅ Vendor profile fetched:", result.data);

          // Use helper to extract categories consistently
          const categoryArray = extractCategories(result.data);

          // Set vendorData with converted category
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

          if (result.data.logoUrl) {
            setLogoPreview(result.data.logoUrl);
          }
        } else if (response.status === 404 || response.status === 403) {
          console.log(
            "❌ No vendor profile found (or not authorized as vendor) - showing profile creation",
          );
          setVendorId(null);
          setError(null);
        } else if (response.status === 401) {
          setError("Session expired. Please login again.");
          // No need to remove local storage token as we are using cookies
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
          onConfirm: () => {
            window.location.reload();
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, []); // Removed token dependency

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setProfileUpdateLoading(true);

    try {
      // Check for validation errors
      if (Object.values(errors).some((err) => err)) {
        showAlert({
          type: "error",
          title: "Validation Error",
          message: "Please fix the errors in the form before submitting.",
          confirmText: "OK",
        });
        setProfileUpdateLoading(false);
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
          confirmText: "OK",
        });
        setProfileUpdateLoading(false);
        return;
      }

      if (!logoFile) {
        showAlert({
          type: "warning",
          title: "Logo Required",
          message: "Please upload a logo for your vendor profile",
          confirmText: "OK",
        });
        setProfileUpdateLoading(false);
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

      console.log("📤 Creating new vendor...");

      const response = await api.post(`${API_BASE_URL}/addvendors`, formData, {
        validateStatus: () => true,
      });

      if (response.status >= 200 && response.status < 300) {
        const result = response.data;
        console.log("✅ Vendor created:", result.data);

        setVendorId(result.data.id);

        const categoryArray = extractCategories(result.data);

        setVendorData({
          ...result.data,
          category: categoryArray,
        });
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
          message:
            "Your vendor profile has been created successfully. Now add your products!",
          confirmText: "Great!",
          autoClose: true,
          duration: 3000,
        });
      } else {
        const errorData = response.data;
        throw new Error(errorData.message || "Failed to create profile");
      }
    } catch (err) {
      console.error("Error creating profile:", err);
      showAlert({
        type: "error",
        title: "Creation Failed",
        message: `Failed to create profile: ${err.message}`,
        confirmText: "OK",
      });
    } finally {
      setProfileUpdateLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileUpdateLoading(true);

    try {
      // Check for validation errors
      if (Object.values(errors).some((err) => err)) {
        showAlert({
          type: "error",
          title: "Validation Error",
          message: "Please fix the errors in the form before submitting.",
          confirmText: "OK",
        });
        setProfileUpdateLoading(false);
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
          confirmText: "OK",
        });
        setProfileUpdateLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("vendorName", profileFormData.vendorName);
      formData.append("categories", profileFormData.category.join(", "));
      formData.append("phoneNumber", profileFormData.phoneNumber);
      formData.append("email", profileFormData.email);
      formData.append("address", profileFormData.address);
      formData.append("website", profileFormData.website || "");

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      console.log("📤 Updating vendor profile...");

      const response = await api.put(
        `${API_BASE_URL}/vendors/${vendorId}`,
        formData,
        {
          validateStatus: () => true,
        },
      );

      if (response.status >= 200 && response.status < 300) {
        const result = response.data;
        console.log("✅ Vendor updated:", result.data);

        const categoryArray = extractCategories(result.data);

        // Update vendorData with converted category array
        setVendorData({
          ...result.data,
          category: categoryArray,
        });
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
          confirmText: "Great!",
          autoClose: true,
          duration: 3000,
        });
      } else if (response.status === 403) {
        showAlert({
          type: "error",
          title: "Unauthorized",
          message: "You cannot update this vendor profile.",
          confirmText: "OK",
        });
      } else {
        const errorData = response.data;
        throw new Error(errorData.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      showAlert({
        type: "error",
        title: "Update Failed",
        message: `Failed to update profile: ${err.message}`,
        confirmText: "OK",
      });
    } finally {
      setProfileUpdateLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (
        !productFormData.name ||
        !productFormData.type ||
        !productFormData.description
      ) {
        showAlert({
          type: "warning",
          title: "Missing Fields",
          message:
            "Please fill in all required fields (Name, Type, Description)",
          confirmText: "OK",
        });
        setIsSubmitting(false);
        return;
      }

      if (!vendorId) {
        showAlert({
          type: "warning",
          title: "Profile Required",
          message: "Please create your vendor profile first",
          confirmText: "OK",
        });
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", productFormData.name);
      formData.append("type", productFormData.type);
      formData.append("subType", productFormData.subType);
      formData.append("description", productFormData.description);
      if (productFormData.link && /^https:\/\/.+/.test(productFormData.link)) {
        formData.append("productLink", productFormData.link);
      }
      const priceString =
        productFormData.priceFrom && productFormData.priceTo
          ? `${productFormData.priceFrom}-${productFormData.priceTo}`
          : productFormData.price;

      formData.append("price", priceString);

      if (productImageFile) {
        formData.append("image", productImageFile);
      }

      console.log("📤 Adding product to vendor:", vendorId);

      const response = await api.post(
        `${API_BASE_URL_PRODUCTS}/vendors/${vendorId}/products`,
        formData,
        {
          validateStatus: () => true,
        },
      );

      if (response.status >= 200 && response.status < 300) {
        const result = response.data;
        console.log("✅ Product added:", result.data);

        const refreshResponse = await api.get(
          `${API_BASE_URL}/myVendorProfile`,
          {
            validateStatus: () => true,
          },
        );

        if (refreshResponse.status >= 200 && refreshResponse.status < 300) {
          const refreshResult = refreshResponse.data;
          setVendorData({
            ...refreshResult.data,
            category: extractCategories(refreshResult.data),
          });
          setStats((prev) => ({
            ...prev,
            totalProducts: refreshResult.data.products?.length || 0,
          }));
        }

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
        setShowAddProductModal(false);

        showAlert({
          type: "success",
          title: "Product Added!",
          message: "Your product has been added successfully.",
          confirmText: "Great!",
          autoClose: true,
          duration: 3000,
        });
      } else if (response.status === 403) {
        showAlert({
          type: "error",
          title: "Unauthorized",
          message: "You cannot add products to this vendor.",
          confirmText: "OK",
        });
      } else {
        const errorData = response.data;
        console.error("Error response:", errorData);
        throw new Error(
          errorData?.message || `Failed to add product: ${response.status}`,
        );
      }
    } catch (err) {
      console.error("Error adding product:", err);
      showAlert({
        type: "error",
        title: "Failed to Add Product",
        message: `Failed to add product: ${err.message}`,
        confirmText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    showAlert({
      type: "warning",
      title: "Delete Product?",
      message:
        "Are you sure you want to delete this product? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      showCancel: true,
      onConfirm: async () => {
        try {
          const response = await api.delete(
            `${API_BASE_URL_PRODUCTS}/products/${productId}`,
          );

          if (response.status >= 200 && response.status < 300) {
            console.log("✅ Product deleted");

            const refreshResponse = await api.get(
              `${API_BASE_URL}/myVendorProfile`,
              {
                validateStatus: () => true,
              },
            );

            if (refreshResponse.status >= 200 && refreshResponse.status < 300) {
              const refreshResult = refreshResponse.data;
              setVendorData({
                ...refreshResult.data,
                category: extractCategories(refreshResult.data),
              });
              setStats((prev) => ({
                ...prev,
                totalProducts: refreshResult.data.products?.length || 0,
              }));
            }

            showAlert({
              type: "success",
              title: "Product Deleted!",
              message: "Product has been deleted successfully.",
              confirmText: "OK",
              autoClose: true,
              duration: 3000,
            });
          } else if (response.status === 403) {
            showAlert({
              type: "error",
              title: "Unauthorized",
              message: "You cannot delete this product.",
              confirmText: "OK",
            });
          } else {
            throw new Error("Failed to delete product");
          }
        } catch (err) {
          console.error("Error deleting product:", err);
          showAlert({
            type: "error",
            title: "Delete Failed",
            message: `Failed to delete product: ${err.message}`,
            confirmText: "OK",
          });
        }
      },
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        showAlert({
          type: "warning",
          title: "Validation Error",
          message: validation.error,
          confirmText: "OK",
        });
        e.target.value = null;
        return;
      }

      setLogoFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // enforce 1MB max for product images
      const validation = validateFile(file, 1);
      if (!validation.isValid) {
        showAlert({
          type: "warning",
          title: "Validation Error",
          message: validation.error,
          confirmText: "OK",
        });
        e.target.value = null;
        return;
      }

      setProductImageFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setProductImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Pagination Logic
  const validProducts = Array.isArray(vendorData.products)
    ? vendorData.products
    : [];
  const totalPages = Math.ceil(validProducts.length / ITEMS_PER_PAGE);

  const currentProducts = validProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // ✅ Refresh Products
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
        showAlert({
          type: "success",
          title: "Refreshed",
          message: "Product list updated",
          autoClose: true,
          duration: 1500,
        });
      }
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // ✅ Edit Product Handler - Opens Modal
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      type: product.type,
      subType: product.subType || "",
      description: product.description,
      price: product.price || "",
      priceFrom: (product.price || "").toString().split("-")[0] || "",
      priceTo: (product.price || "").toString().split("-")[1] || "",
      link: product.productLink || product.link || "",
    });
    setProductImagePreview(product.imageUrl);
    setShowAddProductModal(true);
  };

  // ✅ Update Product API Call
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", productFormData.name);
      formData.append("type", productFormData.type);
      if (productFormData.subType) {
        formData.append("subType", productFormData.subType);
      }
      formData.append("description", productFormData.description);
      if (productFormData.link && /^https:\/\/.+/.test(productFormData.link)) {
        formData.append("productLink", productFormData.link);
      }
      const priceString =
        productFormData.priceFrom && productFormData.priceTo
          ? `${productFormData.priceFrom}-${productFormData.priceTo}`
          : productFormData.price;

      formData.append("price", priceString);

      if (productImageFile) {
        formData.append("image", productImageFile);
      }

      console.log("📤 Updating product:", editingProduct.id);

      const response = await api.put(
        `${API_BASE_URL_PRODUCTS}/updateproduct/${editingProduct.id}`,
        formData,
        { validateStatus: () => true },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("✅ Product updated");

        // Refresh list
        await handleRefreshProducts();

        // Close modal & reset
        setShowAddProductModal(false);
        setEditingProduct(null);
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
        confirmText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileInputChange = (e) => {
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

    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getStatColorClasses = (color) => {
    const colorMap = {
      blue: { bg: "bg-blue-100", text: "text-blue-600" },
      green: { bg: "bg-green-100", text: "text-green-600" },
      purple: { bg: "bg-purple-100", text: "text-purple-600" },
      yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
      red: { bg: "bg-red-100", text: "text-red-600" },
      orange: { bg: "bg-orange-100", text: "text-orange-600" },
    };
    return colorMap[color] || { bg: "bg-gray-100", text: "text-gray-600" };
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#a92b4e] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Loading Dashboard
          </h2>
          <p className="text-gray-600">Fetching your profile...</p>
        </div>
      </div>
    );
  }

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
  if (!vendorId) {
    return (
      <>
        <AlertBox {...alertConfig} onClose={closeAlert} />

        {/* Main screen */}
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center max-w-lg bg-white rounded-xl p-6 shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Create Your Vendor Profile
            </h2>
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

        {/* ✅ ADD MODAL HERE - Inside the same return block */}
        {showEditProfileModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#a92b4e] text-white rounded-t-xl">
                <h2 className="font-bold">
                  {vendorId ? "Edit Profile" : "Create Profile"}
                </h2>
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
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm font-medium mt-2">
                    Click to upload logo
                  </p>
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
                      <p className="text-xs text-red-500 mt-1">
                        {errors.vendorName}
                      </p>
                    )}
                  </div>
                  <div>
                    <CategoryDropdown
                      value={profileFormData.category}
                      onChange={(value) =>
                        setProfileFormData((prev) => ({
                          ...prev,
                          category: value,
                        }))
                      }
                      options={VENDOR_CATEGORIES}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profileFormData.phoneNumber}
                      onChange={handleProfileInputChange}
                      required
                      className={`w-full px-3 py-2 border ${
                        errors.phoneNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent`}
                      placeholder="+91 9876543210"
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
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
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
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
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
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
                    <p className="text-xs text-red-500 mt-1">
                      {errors.website}
                    </p>
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
                    {profileUpdateLoading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {profileUpdateLoading
                      ? "Saving..."
                      : vendorId
                        ? "Update"
                        : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen  p-4">
      {/* ✅ Custom Alert Component */}
      <AlertBox {...alertConfig} onClose={closeAlert} />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              {/* Profile Info */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Logo/Avatar */}
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
                  {vendorId && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-semibold text-gray-900 mb-2">
                    {vendorData.vendorName || "Complete your profile"}
                  </h1>

                  {/* Categories as Chips */}
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
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>
                      Member since{" "}
                      {new Date(vendorData.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          year: "numeric",
                        },
                      )}
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

              {/* Edit Button */}
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#891737] hover:bg-[#891737]/90 rounded-lg transition-colors flex-shrink-0"
              >
                <Edit3 className="w-4 h-4" />
                {vendorId ? "Edit Profile" : "Create Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Products & Services
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {vendorData.products?.length || 0}{" "}
                    {vendorData.products?.length === 1 ? "item" : "items"}
                  </p>
                </div>
                {/* ✅ Refresh Button */}
                {vendorId && (
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
                )}
              </div>

              {vendorId && (
                <button
                  onClick={() => {
                    setEditingProduct(null);
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
                    setShowAddProductModal(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#891737] hover:bg-[#891737]/90 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              )}
            </div>

            {/* Products List */}
            <div className="p-6">
              {currentProducts && currentProducts.length > 0 ? (
                <>
                  <div className="space-y-3 min-h-[300px]">
                    {" "}
                    {/* Min height to prevent layout shift */}
                    {currentProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:border-gray-200 hover:bg-gray-50/50 transition-all"
                      >
                        {/* Product Image */}
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={product.imageUrl || "/api/placeholder/56/56"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 mb-0.5">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-1">
                            {product.type}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {product.description}
                          </p>

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

                        {/* Price & Actions */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {product.price ? (
                              `₹${product.price.toLocaleString()}`
                            ) : (
                              <span className="text-gray-400 font-normal">
                                Not set
                              </span>
                            )}
                          </p>
                          {vendorId && (
                            <div className="flex items-center gap-3">
                              {/* ✅ Edit Button */}
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
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ✅ Pagination Controls */}
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
                /* Empty State */
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    No products yet
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 max-w-xs mx-auto">
                    {vendorId
                      ? "Start building your catalog by adding your first product or service"
                      : "Create your vendor profile to add products"}
                  </p>
                  {vendorId && (
                    <button
                      onClick={() => setShowAddProductModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#891737] hover:bg-[#891737]/90 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add First Product
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">
                Contact Information
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-0.5">
                      Phone
                    </p>
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

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-0.5">
                      Email
                    </p>
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

                {/* Website */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-0.5">
                      Website
                    </p>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    ) : (
                      <p className="text-sm text-gray-400">Not provided</p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">
                      Categories
                    </p>
                    {vendorData.category && vendorData.category.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(vendorData.category)
                          ? vendorData.category
                          : vendorData.category.split(", ")
                        ).map((cat) => (
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
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingProduct
                    ? "Update product details below"
                    : "Fill in the product details below"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddProductModal(false);
                  setEditingProduct(null);
                  setProductFormData({
                    name: "",
                    type: "",
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

            {/* Form */}
            <form
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]"
            >
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  <label className="cursor-pointer block">
                    <div className="w-full h-32 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300 flex items-center justify-center overflow-hidden transition-colors">
                      {productImagePreview ? (
                        <img
                          src={productImagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">
                            Click to upload image
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Max 5MB
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                    />
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
                    <input
                      type="text"
                      name="type"
                      value={productFormData.type}
                      onChange={handleProductInputChange}
                      required
                      className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 transition-colors"
                      placeholder="Enter specific type (e.g. Sony A7III, Red Dragon)"
                    />
                  </div>
                </div>

                {/* Sub-Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Sub-Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subType"
                    value={productFormData.subType}
                    onChange={handleProductInputChange}
                    required
                    className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 transition-colors"
                    placeholder="Enter sub-category or specific variant"
                  />
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

                {/* Price Range */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Price Range (₹){" "}
                    <span className="text-gray-400 text-xs font-normal">
                      Optional
                    </span>
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

                {/* Product Link */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Product Link{" "}
                    <span className="text-gray-400 text-xs font-normal">
                      Optional
                    </span>
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

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddProductModal(false);
                    setEditingProduct(null);
                    setProductFormData({
                      name: "",
                      type: "",
                      description: "",
                      price: "",
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
                      {editingProduct ? (
                        <Save className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      {editingProduct ? "Update Product" : "Add Product"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal (Added to Main View) */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {vendorId ? "Edit Profile" : "Create Profile"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {vendorId
                    ? "Update your vendor information"
                    : "Set up your vendor profile"}
                </p>
              </div>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={vendorId ? handleUpdateProfile : handleCreateProfile}
              className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]"
            >
              <div className="space-y-5">
                {/* Logo Upload */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Profile Logo
                  </label>
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
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          document.querySelector('input[type="file"]').click()
                        }
                        className="text-sm font-medium text-[#891737] hover:text-[#891737]/80 transition-colors"
                      >
                        {logoPreview || vendorData.logoUrl
                          ? "Change Logo"
                          : "Upload Logo"}
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vendor Name & Category */}
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
                      placeholder="Enter vendor name"
                    />
                    {errors.vendorName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.vendorName}
                      </p>
                    )}
                  </div>
                  <div>
                    <CategoryDropdown
                      value={profileFormData.category}
                      onChange={(value) =>
                        setProfileFormData((prev) => ({
                          ...prev,
                          category: value,
                        }))
                      }
                      options={VENDOR_CATEGORIES}
                      required
                    />
                  </div>
                </div>

                {/* Phone & Email */}
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
                        errors.phoneNumber
                          ? "border-red-500"
                          : "border-gray-200"
                      } rounded-lg focus:outline-none focus:border-gray-300 transition-colors`}
                      placeholder="+91 9876543210"
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.phoneNumber}
                      </p>
                    )}
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
                      placeholder="vendor@example.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
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
                    placeholder="Complete business address..."
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Website */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Website{" "}
                    <span className="text-gray-400 text-xs font-normal">
                      Optional
                    </span>
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
                  {errors.website && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.website}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
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
                      {vendorId ? "Update Profile" : "Create Profile"}
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
