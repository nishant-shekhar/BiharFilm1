import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiMapPin,
  FiArrowLeft,
  FiGlobe,
  FiPhone,
  FiMail,
  FiShoppingBag,
  FiPackage,
  FiExternalLink,
  FiTag,
} from "react-icons/fi";
import api from "../Components/axios";

const Map = () => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [focusedVendor, setFocusedVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://bsfdfcbackend.onrender.com";

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get("/api/admin/vendor/allVendors");
        if (response.data.success) {
          setVendors(response.data.data);
          // console.log("Vendors Data:", response.data.data); // Debugging
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    if (path.startsWith("http")) return path;
    // Handle relative paths - remove leading slash if present to avoid double slash
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${BASE_URL}/${cleanPath}`;
  };

  const filtered = vendors.filter(
    (v) =>
      v.vendorName && v.vendorName.toLowerCase().includes(search.toLowerCase())
  );

  const getParsedProducts = (vendor) => {
    try {
      if (typeof vendor.products === "string") {
        return JSON.parse(vendor.products);
      }
      return vendor.products || [];
    } catch (e) {
      console.error("Error parsing products", e);
      return [];
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto h-[85vh] flex rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-xl font-sans text-gray-900">
      {/* Sidebar Navigation */}
      <div
        className={`${
          focusedVendor ? "hidden lg:flex lg:w-80" : "w-full lg:w-80 flex"
        } bg-white border-r border-gray-100 flex-col transition-all duration-300`}
      >
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">
            Vendor Registry
          </h2>
          <p className="text-xs text-gray-400 mb-5 font-medium">
            BSFDFC • Approved Suppliers
          </p>

          <div className="relative group">
            <FiSearch className="absolute left-3 top-3 text-gray-400 text-sm group-focus-within:text-[#891737] transition-colors" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#891737] focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 space-y-3">
              <div className="w-6 h-6 border-2 border-[#891737] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-400">Loading Registry...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 px-6">
              <p className="text-sm text-gray-400">No vendors found.</p>
            </div>
          ) : (
            filtered.map((vendor, i) => (
              <button
                key={vendor.id || i}
                onClick={() => setFocusedVendor(vendor)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 border border-transparent ${
                  focusedVendor?.id === vendor.id
                    ? "bg-[#891737] text-white shadow-md shadow-[#891737]/20"
                    : "hover:bg-gray-50 hover:border-gray-100 text-gray-700"
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={getImageUrl(
                      vendor.image || vendor.logoUrl || vendor.logo
                    )}
                    alt={vendor.vendorName}
                    className={`w-10 h-10 rounded-full object-cover border-2 ${
                      focusedVendor?.id === vendor.id
                        ? "border-white"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-sm font-semibold truncate ${
                      focusedVendor?.id === vendor.id
                        ? "text-white"
                        : "text-gray-900 group-hover:text-black"
                    }`}
                  >
                    {vendor.vendorName}
                  </h4>
                  <p
                    className={`text-[11px] truncate uppercase tracking-wider font-medium ${
                      focusedVendor?.id === vendor.id
                        ? "text-white/80"
                        : "text-gray-400"
                    }`}
                  >
                    {vendor.category || "Service Provider"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <p className="text-[10px] text-center text-gray-400 font-medium">
            {filtered.length} VENDORS LISTED
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
        {!focusedVendor ? (
          // Empty State / Welcome Screen
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 relative z-10">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-gray-100">
              <FiShoppingBag className="text-3xl text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Select a Vendor
            </h3>
            <p className="text-gray-500 max-w-sm leading-relaxed text-sm">
              Choose a vendor from the registry to view their services,
              products, contact information, and pricing details.
            </p>
          </div>
        ) : (
          // Detailed Vendor View
          <div className="flex-1 flex flex-col h-full relative z-10">
            {/* Header / Breadcrumb for Mobile */}
            <div className="lg:hidden p-4 border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-20">
              <button
                onClick={() => setFocusedVendor(null)}
                className="flex items-center text-sm text-gray-500 hover:text-gray-900 font-medium"
              >
                <FiArrowLeft className="mr-2" /> Back to Registry
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 pb-20">
              <div className="max-w-4xl mx-auto space-y-12">
                {/* Vendor Header */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="group relative shrink-0 mx-auto md:mx-0">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden shadow-xl border border-gray-200 relative z-10 bg-white">
                      <img
                        src={getImageUrl(
                          focusedVendor.image ||
                            focusedVendor.logoUrl ||
                            focusedVendor.logo
                        )}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={focusedVendor.vendorName}
                      />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-5">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                        {focusedVendor.vendorName}
                      </h1>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span className="px-3 py-1 bg-[#891737] text-white text-xs font-bold uppercase tracking-wider rounded shadow-md shadow-[#891737]/20">
                          {focusedVendor.category || "General Vendor"}
                        </span>
                        {focusedVendor.website && (
                          <a
                            href={focusedVendor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-500 text-sm font-medium bg-gray-50 px-3 py-1 rounded border border-gray-200 hover:text-[#891737] hover:border-[#891737]/30 transition-colors"
                          >
                            <FiGlobe className="mr-1.5 text-gray-400" />
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto md:mx-0">
                      <div className="bg-gray-50 rounded-lg p-3 flex items-center space-x-3 border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#891737] shadow-sm">
                          <FiMail className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                            Email
                          </p>
                          <p className="text-sm text-gray-900 font-medium truncate">
                            {focusedVendor.email || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 flex items-center space-x-3 border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#891737] shadow-sm">
                          <FiPhone className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                            Phone
                          </p>
                          <p className="text-sm text-gray-900 font-medium truncate">
                            {focusedVendor.phoneNumber || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {focusedVendor.address && (
                      <div className="text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto md:mx-0 bg-white p-0 border-t border-gray-100 pt-4 mt-2">
                        <span className="text-gray-900 font-semibold mr-1">
                          Address:
                        </span>{" "}
                        {focusedVendor.address}
                      </div>
                    )}
                  </div>
                </div>

                {/* Products & Services Section */}
                <div className="space-y-6 pt-6 border-t border-gray-100">
                  <div className="flex items-end justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FiPackage className="text-[#891737]" />
                      Products & Services
                    </h3>
                    <span className="text-sm text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100">
                      {getParsedProducts(focusedVendor).length} Items
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getParsedProducts(focusedVendor).length > 0 ? (
                      getParsedProducts(focusedVendor).map((product, index) => (
                        <div
                          key={index}
                          className="group relative bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#891737]/30 rounded-xl p-5 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col h-full"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#891737] transition-colors">
                              {product.productName || product.name}
                            </h4>
                            {product.productPrice && (
                              <span className="px-2 py-1 rounded text-xs font-bold bg-[#891737]/10 text-[#891737]">
                                ₹{product.productPrice}
                              </span>
                            )}
                          </div>

                          {/* Product Image */}
                          <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden border border-gray-100 relative">
                            <img
                              src={getImageUrl(
                                (focusedVendor.productImage &&
                                  focusedVendor.productImage[index]) ||
                                  product.productImage ||
                                  product.image
                              )}
                              alt={
                                product.productName || product.name || "Product"
                              }
                              className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                            />
                            {!(
                              focusedVendor.productImage &&
                              focusedVendor.productImage[index]
                            ) &&
                              !product.productImage &&
                              !product.image && (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                  <FiPackage className="text-2xl" />
                                </div>
                              )}
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                              {product.productType || "Product"}
                            </span>
                          </div>

                          {product.productDescription && (
                            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-3 flex-grow">
                              {product.productDescription}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <FiPackage className="text-4xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium">
                          No specific products listed.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default Map;
