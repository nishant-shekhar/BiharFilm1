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
} from "lucide-react";

import api from "../Components/axios";
import { validateFile } from "../utils/fileValidation";

const VendorDashboard = () => {
  const [vendorId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);

  const [vendorData, setVendorData] = useState({
    id: null,
    vendorName: "",
    category: "",
    phoneNumber: "",
    email: "",
    address: "",
    website: "",
    logoUrl: "",
    products: [],
    joinDate: "2024-01-15",
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
  const [logoPreview, setLogoPreview] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);

  const [productFormData, setProductFormData] = useState({
    name: "",
    type: "",
    description: "",
    price: "",
    imageUrl: "",
    vendorId: vendorId,
  });

  const [profileFormData, setProfileFormData] = useState({
    vendorName: "",
    category: "",
    phoneNumber: "",
    email: "",
    address: "",
    website: "",
    logoUrl: "",
  });

  const recentInquiries = [
    {
      id: 1,
      customerName: "Raj Productions",
      productName: "Professional Camera Kit",
      message: "Need this for a 3-day shoot.",
      date: "2025-09-06",
      status: "pending",
    },
    {
      id: 2,
      customerName: "Mumbai Films",
      productName: "LED Lighting Setup",
      message: "Looking for bulk rental.",
      date: "2025-09-05",
      status: "responded",
    },
    {
      id: 3,
      customerName: "Creative Studios",
      productName: "Audio Equipment",
      message: "Available next week?",
      date: "2025-09-04",
      status: "pending",
    },
  ];

  useEffect(() => {
    fetchVendorProfile();
  }, [vendorId]);

  // Enhanced API call function with better error handling
  const makeApiCall = async (url, options = {}) => {
    try {
      console.log("Making API call to:", url);
      console.log("Request options:", options);

      // Use api instance
      const response = await api({
        url,
        method: options.method || "GET",
        data: options.body
          ? JSON.parse(options.body).data || JSON.parse(options.body)
          : undefined, // Handle wrapped or raw data
        ...options,
        // Headers are handled by api instance (cookies), specific content-type might be needed if not json
      });

      console.log("Response status:", response.status);

      // Axios throws on 4xx/5xx unless validateStatus is set, but assuming standard behavior:
      const data = response.data;
      console.log("API Success Response:", data);

      // Handle the wrapping structure if present in response
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error("API Call Error:", error);

      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";

      // Specific error handling
      if (error.message === "Network Error") {
        return {
          success: false,
          error:
            "Network connection failed. Please check:\n• Your internet connection\n• Backend server is running\n• Server URL is correct",
        };
      } else if (error.response && error.response.status === 404) {
        return {
          success: false,
          error:
            "API endpoint not found (404). Please check:\n• Backend server is running\n• API routes are configured correctly\n• URL spelling is correct",
        };
      } else {
        return {
          success: false,
          error: errorMsg,
        };
      }
    }
  };

  const fetchVendorProfile = async () => {
    setLoading(true);
    setError(null);

    const result = await makeApiCall(`/api/vendor/vendors/${vendorId}`);

    if (result.success) {
      setVendorData((prev) => ({
        ...prev,
        ...result.data,
        products: result.data.products || [],
      }));
      setStats((prev) => ({
        ...prev,
        totalProducts: result.data.products?.length || 0,
      }));
      setProfileFormData({
        vendorName: result.data.vendorName || "",
        category: result.data.category || "",
        phoneNumber: result.data.phoneNumber || "",
        email: result.data.email || "",
        address: result.data.address || "",
        website: result.data.website || "",
        logoUrl: result.data.logoUrl || "",
      });
    } else if (!result.error.includes("404")) {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setLogoPreview(base64String);
        setProfileFormData((prev) => ({ ...prev, logoUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setProductImagePreview(base64String);
        setProductFormData((prev) => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Enhanced Add Product with better error handling
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (
      !productFormData.name ||
      !productFormData.type ||
      !productFormData.description
    ) {
      alert("Please fill in all required fields (Name, Type, Description)");
      setIsSubmitting(false);
      return;
    }

    const requestData = {
      name: productFormData.name,
      type: productFormData.type,
      description: productFormData.description,
      price: productFormData.price ? parseFloat(productFormData.price) : null,
      imageUrl: productFormData.imageUrl,
      vendorId: Number(productFormData.vendorId),
    };

    console.log("Submitting product data:", requestData);

    const result = await makeApiCall("/api/vendor/addProduct", {
      method: "POST",
      body: JSON.stringify({ data: requestData }),
    });

    if (result.success) {
      await fetchVendorProfile();
      setProductFormData({
        name: "",
        type: "",
        description: "",
        price: "",
        imageUrl: "",
        vendorId: vendorId,
      });
      setProductImagePreview(null);
      setShowAddProductModal(false);
      alert("Product added successfully!");
    } else {
      alert(`Failed to add product:\n${result.error}`);
    }

    setIsSubmitting(false);
  };

  // Fixed Update Profile with correct API endpoints
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileUpdateLoading(true);

    // Validate required fields
    if (
      !profileFormData.vendorName ||
      !profileFormData.category ||
      !profileFormData.phoneNumber ||
      !profileFormData.email ||
      !profileFormData.address
    ) {
      alert("Please fill in all required fields");
      setProfileUpdateLoading(false);
      return;
    }

    let apiUrl, method, requestData;

    if (vendorData.id) {
      // Update existing vendor
      apiUrl = `/api/vendor/updateVendorById/${vendorData.id}`;
      method = "PUT";
      requestData = { data: profileFormData };
    } else {
      // Create new vendor - try different endpoint patterns
      // First try the original endpoint
      apiUrl = "/api/vendor/addVendor";
      method = "POST";
      requestData = {
        ...profileFormData,
        // Remove nested structure as it might be causing issues
        products: [],
      };
    }

    console.log("Profile API URL:", apiUrl);
    console.log("Profile request data:", requestData);

    let result = await makeApiCall(apiUrl, {
      method: method,
      body: JSON.stringify(requestData),
    });

    // If the first attempt fails with 404, try alternative endpoints
    if (!result.success && result.error.includes("404") && !vendorData.id) {
      console.log("Trying alternative endpoint...");

      // Try without /addVendor
      apiUrl = "/api/vendor";
      result = await makeApiCall(apiUrl, {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      // If still failing, try with different data structure
      if (!result.success && result.error.includes("404")) {
        console.log("Trying with data wrapper...");
        apiUrl = "/api/vendor";
        result = await makeApiCall(apiUrl, {
          method: "POST",
          body: JSON.stringify({ data: profileFormData }),
        });
      }
    }

    if (result.success) {
      await fetchVendorProfile();
      setLogoPreview(null);
      setShowEditProfileModal(false);
      alert("Profile updated successfully!");
    } else {
      alert(
        `Failed to update profile:\n${result.error}\n\nPossible solutions:\n• Check if backend server is running\n• Verify API endpoints are configured\n• Check server logs for errors`
      );
    }

    setProfileUpdateLoading(false);
  };

  // Test different API endpoints
  const testApiEndpoints = async () => {
    console.log("Testing API endpoints...");

    const endpoints = [
      "/api/vendor/vendors/1",
      "/api/vendor/addVendor",
      "/api/vendor",
      "/api/vendor/addProduct",
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Testing: ${endpoint}`);
        const response = await api({
          url: endpoint,
          method: endpoint.includes("add") ? "POST" : "GET",
          data: endpoint.includes("add") ? { test: "data" } : undefined,
        });

        console.log(`${endpoint}: ${response.status} ${response.statusText}`);
      } catch (error) {
        console.log(`${endpoint}: Error - ${error.message}`);
      }
    }

    alert("Check console for API endpoint test results");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-lg bg-white rounded-xl p-6 shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            API Connection Error
          </h2>
          <p className="text-gray-600 mb-4 whitespace-pre-line text-sm">
            {error}
          </p>
          <div className="space-y-2">
            <button
              onClick={fetchVendorProfile}
              className="w-full bg-[#a92b4e] hover:bg-[#891737] text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
            <button
              onClick={testApiEndpoints}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Test API Endpoints
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Enhanced Debug Panel */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">
            ⚠️ API Debug Information
          </h3>
          <div className="text-sm text-red-700 space-y-1">
            <p>
              <strong>Issue:</strong> HTTP 404 - API endpoint not found
            </p>
            <p>
              <strong>Backend URL:</strong> https://film.bihar.gov.in
            </p>
            <p>
              <strong>Expected Endpoints:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 text-xs">
              <li>POST /api/vendor/addVendor (for creating vendor)</li>
              <li>
                PUT /api/vendor/updateVendorById/{`{id}`} (for updating vendor)
              </li>
              <li>GET /api/vendor/vendors/{`{id}`} (for fetching vendor)</li>
              <li>POST /api/vendor/addProduct (for adding products)</li>
            </ul>
            <div className="flex gap-2 mt-2">
              <button
                onClick={testApiEndpoints}
                className="bg-red-500 hover:bg-[#4f0419] text-white px-3 py-1 rounded text-sm"
              >
                Test All Endpoints
              </button>
              <button
                onClick={() =>
                  window.open("https://film.bihar.gov.in", "_blank")
                }
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Check Backend
              </button>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#a92b4e] to-[#891737] flex items-center justify-center overflow-hidden">
                  {vendorData.logoUrl ? (
                    <img
                      src={vendorData.logoUrl}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {vendorData.vendorName || "Set up your profile"}
                </h1>
                <p className="text-gray-600">
                  {vendorData.category || "Select category"} • Member since{" "}
                  {new Date(vendorData.joinDate).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {vendorData.address || "Add address"}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {stats.averageRating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowEditProfileModal(true)}
              className="bg-[#a92b4e] hover:bg-[#891737] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              {vendorData.id ? "Edit Profile" : "Create Profile"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            {
              label: "Products",
              value: stats.totalProducts,
              icon: Package,
              color: "blue",
            },
            {
              label: "Views",
              value: stats.totalViews.toLocaleString(),
              icon: Eye,
              color: "green",
            },
            {
              label: "Inquiries",
              value: stats.totalInquiries,
              icon: MessageCircle,
              color: "purple",
            },
            {
              label: "Rating",
              value: stats.averageRating,
              icon: Star,
              color: "yellow",
            },
            {
              label: "Revenue",
              value: `₹${stats.monthlyRevenue / 1000}K`,
              icon: DollarSign,
              color: "red",
            },
            {
              label: "Bookings",
              value: stats.activeBookings,
              icon: Calendar,
              color: "orange",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 shadow-sm border"
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Recent Products
              </h2>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="bg-[#a92b4e] hover:bg-[#891737] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            <div className="space-y-3">
              {vendorData.products && vendorData.products.length > 0 ? (
                vendorData.products.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={product.imageUrl || "/api/placeholder/48/48"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">{product.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {product.price
                          ? `₹${product.price.toLocaleString()}`
                          : "Price not set"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    No products yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add your first product to get started
                  </p>
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="bg-[#a92b4e] hover:bg-[#891737] text-white px-4 py-2 rounded-lg"
                  >
                    Add Product
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Inquiries */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Recent Inquiries
              </h2>
              <button className="text-[#a92b4e] text-sm hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {inquiry.customerName}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        inquiry.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {inquiry.productName}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {inquiry.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {new Date(inquiry.date).toLocaleDateString()}
                    </span>
                    <button className="text-[#a92b4e] text-xs hover:underline">
                      Respond
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Plus,
                label: "Add Product",
                action: () => setShowAddProductModal(true),
              },
              { icon: BarChart3, label: "Analytics", action: () => {} },
              { icon: MessageCircle, label: "Inquiries", action: () => {} },
              {
                icon: Edit3,
                label: "Profile",
                action: () => setShowEditProfileModal(true),
              },
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-[#a92b4e] hover:bg-[#a92b4e]/5 transition-colors"
              >
                <div className="w-10 h-10 bg-[#a92b4e]/10 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[#a92b4e]" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Phone,
                label: "Phone",
                value: vendorData.phoneNumber || "Add phone",
                color: "blue",
              },
              {
                icon: Mail,
                label: "Email",
                value: vendorData.email || "Add email",
                color: "green",
              },
              {
                icon: Globe,
                label: "Website",
                value: vendorData.website || "Add website",
                color: "purple",
              },
              {
                icon: Building2,
                label: "Category",
                value: vendorData.category || "Select category",
                color: "orange",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div
                  className={`w-8 h-8 bg-${item.color}-100 rounded-lg flex items-center justify-center`}
                >
                  <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                </div>
                <div>
                  <p className="text-xs text-gray-600">{item.label}</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b bg-[#a92b4e] text-white rounded-t-xl">
              <h2 className="font-bold">Add New Product</h2>
              <button onClick={() => setShowAddProductModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-4 space-y-4">
              {/* Image Upload */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                    {productImagePreview ? (
                      <img
                        src={productImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#a92b4e] rounded-full flex items-center justify-center">
                    <Camera className="w-3 h-3 text-white" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={productFormData.name}
                    onChange={handleProductInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent"
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={productFormData.type}
                    onChange={handleProductInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="Cameras">Cameras</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Sound">Sound</option>
                    <option value="Props">Props</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={productFormData.description}
                  onChange={handleProductInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent resize-none"
                  placeholder="Product description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={productFormData.price}
                  onChange={handleProductInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#a92b4e] hover:bg-[#891737] text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b bg-[#a92b4e] text-white rounded-t-xl">
              <h2 className="font-bold">
                {vendorData.id ? "Edit Profile" : "Create Profile"}
              </h2>
              <button onClick={() => setShowEditProfileModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-4 space-y-4">
              {/* Logo Upload */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#a92b4e] to-[#891737] flex items-center justify-center overflow-hidden">
                    {logoPreview || profileFormData.logoUrl ? (
                      <img
                        src={logoPreview || profileFormData.logoUrl}
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
                    className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                    <Camera className="w-3 h-3 text-[#a92b4e]" />
                  </div>
                </div>
                <p className="text-sm font-medium mt-1">Upload Logo</p>
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
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={profileFormData.category}
                    onChange={handleProfileInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Photography & Videography">
                      Photography & Videography
                    </option>
                    <option value="Equipment Rental">Equipment Rental</option>
                    <option value="Production Services">
                      Production Services
                    </option>
                    <option value="Post Production">Post Production</option>
                    <option value="Other">Other</option>
                  </select>
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
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
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
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent"
                    placeholder="vendor@example.com"
                  />
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent resize-none"
                  placeholder="Complete address..."
                />
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent"
                  placeholder="https://example.com"
                />
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
                    : vendorData.id
                    ? "Update"
                    : "Create"}
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
