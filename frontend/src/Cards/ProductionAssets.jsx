import React, { useState, useEffect, useMemo } from "react";
import {
  FiSearch,
  FiMapPin,
  FiArrowLeft,
  FiGlobe,
  FiPhone,
  FiMail,
  FiShoppingBag,
  FiPackage,
  FiChevronDown,
  FiX,
  FiCalendar,
  FiClock,
  FiExternalLink,
  FiTag,
  FiInfo,
} from "react-icons/fi";
import api from "../Components/axios";

const Disclaimer = () => (
  <div className="pt-8 pb-4">
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
      <p className="text-[10px] leading-relaxed text-gray-400 font-medium text-center italic">
        <span className="font-bold text-gray-500 uppercase tracking-widest not-italic mr-1">
          Disclaimer:
        </span>
        The information and data displayed on this portal are provided solely by
        the respective individuals/applicants and have not been independently
        verified by the Department. The Department makes no representations or
        warranties regarding the accuracy, completeness, or reliability of the
        submitted information and shall not be held responsible or liable for
        any errors, omissions, or claims arising from its use.
      </p>
    </div>
  </div>
);

const ProductionAssets = ({ onClose }) => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [focusedVendor, setFocusedVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://film.bihar.gov.in";

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const [allResponse, verifiedResponse] = await Promise.all([
          api.get("/api/admin/vendor/allVendors"),
          api.get("/api/vendor/verifiedvendors"),
        ]);

        let combinedVendors = [];
        const seenIds = new Set();

        // Process verified vendors first (priority)
        if (verifiedResponse.data.success) {
          const verifiedData = verifiedResponse.data.data.map((v) => ({
            ...v,
            category: v.categories
              ? v.categories.map((c) => c.category.name).join(", ")
              : v.category,
            verified: true, // Ensure verified flag is set
          }));

          verifiedData.forEach((v) => {
            combinedVendors.push(v);
            seenIds.add(v.id);
          });
        }

        // Process all vendors, adding only those not already added
        if (allResponse.data.success) {
          allResponse.data.data.forEach((v) => {
            if (!seenIds.has(v.id)) {
              combinedVendors.push(v);
              seenIds.add(v.id);
            }
          });
        }

        setVendors(combinedVendors);
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
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${BASE_URL}/${cleanPath}`;
  };

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

  const categories = ["All", ...VENDOR_CATEGORIES];

  const filtered = vendors.filter((v) => {
    const matchesSearch =
      v.vendorName && v.vendorName.toLowerCase().includes(search.toLowerCase());

    if (selectedCategory === "All") return matchesSearch;

    const matchesCategory =
      v.category &&
      v.category
        .toLowerCase()
        .split(",")
        .map((c) => c.trim())
        .includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full min-h-screen bg-[#FDFCFD] flex relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#891737]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#891737]/3 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Global Close Button - Always Visible */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[60] p-2 bg-white/90 backdrop-blur-md rounded-full text-gray-400 hover:text-[#891737] hover:bg-[#891737]/5 transition-all shadow-sm border border-gray-100/50"
        title="Close Registry"
      >
        <FiX className="w-5 h-5" />
      </button>

      {/* LEFT SIDEBAR - Fixed Width */}
      <div className="w-72 border-r border-gray-100 bg-white/50 backdrop-blur-xl h-screen sticky top-0 flex flex-col z-40 hidden lg:flex">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-100/50">
          {/* Search Bar */}
          <div className="relative group w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#891737] transition-colors w-4 h-4" />
            <input
              type="text"
              placeholder="Search vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full placeholder:text-gray-400 pl-9 pr-3 py-2 text-xs rounded-lg bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#891737] focus:ring-2 focus:ring-[#891737]/5 transition-all outline-none"
            />
          </div>
        </div>

        {/* Categories List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-3 space-y-0.5 custom-scrollbar">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
            Categories
          </h3>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setFocusedVendor(null);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-between group ${
                selectedCategory === cat
                  ? "bg-[#891737] text-white shadow-sm"
                  : "text-gray-600 hover:bg-white hover:shadow-sm"
              }`}
            >
              <span>{cat === "All" ? "All Vendors" : cat}</span>
              {selectedCategory === cat && (
                <div className="w-1 h-1 rounded-full bg-white"></div>
              )}
            </button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-100/50 text-center">
          <p className="text-[10px] text-gray-400">
            {filtered.length} Vendors Found
          </p>
        </div>
      </div>

      {/* RIGHT CONTENT AREA - Scrollable */}
      <div className="flex-1 h-screen overflow-y-auto relative z-10 w-full">
        {/* Mobile Header - Visible only on small screens */}
        <div className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-gray-500">
              Vendor Registry
            </h2>
            <span className="text-xs text-gray-500">
              {filtered.length} vendors
            </span>
          </div>

          <div className="flex gap-2">
            <div className="relative group flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-100 focus:border-[#891737] focus:ring-2 focus:ring-[#891737]/10 outline-none"
              />
            </div>
            {/* Mobile Category Dropdown */}
            <div className="relative w-40">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setFocusedVendor(null);
                }}
                className="w-full appearance-none bg-gray-50 border border-gray-100 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:border-[#891737] font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Vendors" : cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <FiChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-full">
          {!focusedVendor ? (
            // GRID VIEW
            <>
              {/* TOP HEADER */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-700 tracking-tight leading-none mb-2">
                    Vendor Registry
                  </h2>
                  <p className="text-xs text-gray-400">
                    Production Service Providers
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-right pr-10 md:pr-0">
                  <p className="text-xs font-bold text-[#891737] uppercase tracking-wide">
                    {selectedCategory === "All"
                      ? "All Categories"
                      : selectedCategory}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {filtered.length} Result
                    {filtered.length !== 1 ? "s" : ""} Found
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                  <div className="w-12 h-12 border-[3px] border-[#891737]/10 border-t-[#891737] rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Loading Registry...
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500 bg-white/50 rounded-3xl border border-gray-100/50">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                    <FiShoppingBag className="text-2xl text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    No vendors found
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    Try adjusting your search or category filter.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filtered.map((vendor, i) => {
                    const firstProduct = getParsedProducts(vendor)[0];
                    const displayImage =
                      (vendor.productImage && vendor.productImage[0]) ||
                      firstProduct?.productImage ||
                      firstProduct?.imageUrl ||
                      firstProduct?.image ||
                      vendor.image ||
                      vendor.logoUrl ||
                      vendor.logo;

                    return (
                      <div
                        key={vendor.id || i}
                        onClick={() => setFocusedVendor(vendor)}
                        className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#891737]/20"
                      >
                        {/* Aspect Ratio Box */}
                        <div className="aspect-[3/4] overflow-hidden relative bg-gray-100">
                          <img
                            src={getImageUrl(displayImage)}
                            alt={vendor.vendorName}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>

                          {/* Content */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                            {firstProduct?.productName && (
                              <span className="inline-block text-[9px] font-bold text-[#891737] bg-white px-2 py-0.5 rounded-full mb-1.5 shadow-sm uppercase tracking-wider">
                                {firstProduct.productName}
                              </span>
                            )}
                            <h3 className="text-sm md:text-base font-bold text-white mb-0.5 leading-tight truncate">
                              {vendor.vendorName}
                            </h3>
                            <p className="text-[10px] md:text-xs text-gray-300 font-medium uppercase tracking-wide truncate">
                              {vendor.category || "Service Provider"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <Disclaimer />
            </>
          ) : (
            // DETAIL VENDOR VIEW
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Back Helper */}
              <button
                onClick={() => setFocusedVendor(null)}
                className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#891737] transition-colors group px-4 py-2 rounded-lg hover:bg-white/80 border border-transparent hover:border-gray-100"
              >
                <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Registry
              </button>

              <div className="space-y-8">
                {/* 1. HEADER (Simplified) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {focusedVendor.vendorName}
                    </h1>
                  </div>
                </div>

                {/* 2. PRODUCTS & SERVICES (Primary) */}
                <div>
                  <div className="flex items-end justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      Products & Services
                    </h3>
                  </div>

                  <div className="flex flex-col gap-4">
                    {getParsedProducts(focusedVendor).length > 0 ? (
                      getParsedProducts(focusedVendor).map((product, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:border-gray-300 transition-all duration-200 flex flex-col md:flex-row shadow-sm hover:shadow-md"
                        >
                          {/* Left: Product Image */}
                          <div className="w-full md:w-64 h-48 md:h-auto bg-gray-50 relative shrink-0 border-b md:border-b-0 md:border-r border-gray-100">
                            <img
                              src={getImageUrl(
                                (focusedVendor.productImage &&
                                  focusedVendor.productImage[index]) ||
                                  product.productImage ||
                                  product.imageUrl ||
                                  product.image,
                              )}
                              alt={
                                product.productName || product.name || "Product"
                              }
                              className="w-full h-full object-cover"
                            />
                            {!(
                              focusedVendor.productImage &&
                              focusedVendor.productImage[index]
                            ) &&
                              !product.productImage &&
                              !product.imageUrl &&
                              !product.image && (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                  <FiPackage className="text-3xl" />
                                </div>
                              )}
                          </div>

                          {/* Right: Content */}
                          <div className="p-5 flex flex-col flex-grow">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                              <div className="space-y-1">
                                <h4 className="text-lg font-bold text-gray-900 leading-tight">
                                  {product.productName || product.name}
                                </h4>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <span className="font-semibold text-gray-700">
                                      Type:
                                    </span>
                                    {product.productType ||
                                      product.type ||
                                      "N/A"}
                                  </span>
                                  {(product.productSubType ||
                                    product.subType) && (
                                    <span className="flex items-center gap-1">
                                      <span className="font-semibold text-gray-700">
                                        Category:
                                      </span>
                                      {product.productSubType ||
                                        product.subType}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="text-left md:text-right shrink-0">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                                  Price
                                </div>
                                <div className="text-lg font-bold text-[#891737]">
                                  ₹
                                  {product.productPrice ||
                                    product.price ||
                                    "On Request"}
                                </div>
                              </div>
                            </div>

                            <div className="mb-4 flex-grow">
                              <p className="text-sm text-gray-600 leading-relaxed">
                                <span className="font-semibold text-gray-900 block mb-1 text-xs uppercase tracking-wide">
                                  Description
                                </span>
                                {product.productDescription ||
                                  product.description ||
                                  "No description provided."}
                                {product.productDescription ||
                                  product.description ||
                                  "No description provided."}
                              </p>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                              <div className="flex gap-4 text-gray-500 w-full sm:w-auto">
                                {product.createdAt && (
                                  <div>
                                    <span className="font-semibold text-gray-700">
                                      Added:
                                    </span>{" "}
                                    {new Date(
                                      product.createdAt,
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </div>
                                )}
                                {product.updatedAt && (
                                  <div>
                                    <span className="font-semibold text-gray-700">
                                      Updated:
                                    </span>{" "}
                                    {new Date(
                                      product.updatedAt,
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </div>
                                )}
                              </div>

                              {(product.productLink || product.link) && (
                                <a
                                  href={product.productLink || product.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 transition-colors"
                                >
                                  View Details{" "}
                                  <FiExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <FiPackage className="text-3xl text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 font-medium text-sm">
                          No products listed provided for this vendor.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. VENDOR PROFILE (Simplified) */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Branding/Logo */}
                    <div className="shrink-0 flex flex-col items-center gap-3">
                      <div className="w-20 h-20 rounded-lg bg-gray-50 border border-gray-100 p-0.5 overflow-hidden">
                        <img
                          src={getImageUrl(
                            focusedVendor.image ||
                              focusedVendor.logoUrl ||
                              focusedVendor.logo,
                          )}
                          alt={focusedVendor.vendorName}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    </div>

                    {/* Information Grid */}
                    <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                          Email Address
                        </label>
                        <a
                          href={`mailto:${focusedVendor.email}`}
                          className="text-sm font-medium text-gray-900 hover:text-[#891737] transition-colors break-all"
                        >
                          {focusedVendor.email || "N/A"}
                        </a>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                          Phone Number
                        </label>
                        <a
                          href={`tel:${focusedVendor.phoneNumber}`}
                          className="text-sm font-medium text-gray-900 hover:text-[#891737] transition-colors"
                        >
                          {focusedVendor.phoneNumber || "N/A"}
                        </a>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                          Categories
                        </label>
                        <p className="text-sm font-medium text-gray-900">
                          {focusedVendor.category || "General Vendor"}
                        </p>
                      </div>

                      {focusedVendor.website && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                            Official Website
                          </label>
                          <a
                            href={focusedVendor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-[#891737] hover:underline flex items-center gap-1.5"
                          >
                            Visit Website <FiExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {focusedVendor.address && (
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                            Location Address
                          </label>
                          <p className="text-sm font-medium text-gray-900 leading-relaxed">
                            {focusedVendor.address}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Disclaimer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionAssets;
