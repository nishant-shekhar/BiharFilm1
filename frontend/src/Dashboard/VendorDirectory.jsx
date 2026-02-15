import React, { useEffect, useState } from "react";
import api from "../Components/axios";
import {
  Building2,
  PlusCircle,
  Phone,
  Mail,
  MapPin,
  Globe,
  Package,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  LayoutGrid,
  LayoutList,
  Calendar,
  Tag,
  ShieldCheck,
  AlertTriangle,
  Filter,
  ArrowUpDown,
  RefreshCcw,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";
import AddVendorForm from "./AddVendorForm";
import DownloadExcel from "../Components/DownloadExcel";

const CATEGORIES = [
  "Photography & Videography",
  "Catering Services",
  "Decorations & Lighting",
  "Music & Entertainment",
  "Transportation",
  "Venues & Locations",
  "Costumes & Makeup",
  "Equipment Rental",
  "Post-Production",
  "Security",
  "Other",
];

const VendorDirectory = ({ searchQuery }) => {
  const [adminVendors, setAdminVendors] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [vendorToEdit, setVendorToEdit] = useState(null);

  const [activeTab, setActiveTab] = useState("directory");
  const [adminLoading, setAdminLoading] = useState(false);
  const [selectedVendorIds, setSelectedVendorIds] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const sourceList =
        activeTab === "admin" ? filteredAdminVendors : filteredVendors;
      const allIds = sourceList.map((v) => v.id);
      setSelectedVendorIds(allIds);
    } else {
      setSelectedVendorIds([]);
    }
  };

  const handleSelectVendor = (e, id) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedVendorIds((prev) => [...prev, id]);
    } else {
      setSelectedVendorIds((prev) =>
        prev.filter((vendorId) => vendorId !== id),
      );
    }
  };

  const fetchVendors = async () => {
    try {
      setLoading(true);
      console.log("Fetching public vendors...");
      const res = await api.get("/api/vendor/getvendors");
      console.log("Public vendors received:", res.data);
      setVendors(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminVendors = async () => {
    try {
      setAdminLoading(true);
      console.log("Fetching admin vendor registry...");
      const res = await api.get("/api/admin/vendor/allVendorsAdmin");
      console.log("Admin vendors received:", res.data);
      setAdminVendors(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch admin vendors:", err);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    setSelectedVendorIds([]);
    if (activeTab === "admin" && adminVendors.length === 0) {
      fetchAdminVendors();
    }
  }, [activeTab]);

  const filteredVendors = vendors.filter((vendor) => {
    const matchesCategory = selectedCategory
      ? vendor.category === selectedCategory
      : true;
    if (!searchQuery) return matchesCategory;
    const query = searchQuery.toLowerCase();

    const matchesStatus =
      selectedStatus === "all"
        ? true
        : selectedStatus === "verified"
          ? isVerified(vendor)
          : !isVerified(vendor);

    return (
      matchesCategory &&
      matchesStatus &&
      (vendor.vendorName?.toLowerCase().includes(query) ||
        vendor.category?.toLowerCase().includes(query) ||
        vendor.address?.toLowerCase().includes(query) ||
        vendor.email?.toLowerCase().includes(query))
    );
  });

  const filteredAdminVendors = adminVendors.filter((vendor) => {
    const matchesCategory = selectedCategory
      ? vendor.category === selectedCategory
      : true;
    if (!searchQuery) return matchesCategory;
    const query = searchQuery.toLowerCase();
    return (
      matchesCategory &&
      (vendor.vendorName?.toLowerCase().includes(query) ||
        vendor.category?.toLowerCase().includes(query) ||
        vendor.email?.toLowerCase().includes(query) ||
        vendor.phoneNumber?.includes(query))
    );
  });

  const isVerified = (v) => v.verified === true || v.verified === 1;
  const nonVerifiedVendors = filteredVendors.filter((v) => !isVerified(v));
  const verifiedVendors = filteredVendors.filter((v) => isVerified(v));

  const handleVerifyStatus = async (vendorId, currentVerifiedValue) => {
    const isCurrentlyVerified =
      currentVerifiedValue === 1 || currentVerifiedValue === true;
    const newStatus = !isCurrentlyVerified;

    const endpoint = newStatus
      ? `/api/vendor/${vendorId}/verify`
      : `/api/vendor/${vendorId}/unverify`;

    const previousVendors = [...vendors];
    const previousAdminVendors = [...adminVendors];

    // Optimistic update
    setVendors(
      vendors.map((v) =>
        v.id === vendorId ? { ...v, verified: newStatus } : v,
      ),
    );
    setAdminVendors(
      adminVendors.map((v) =>
        v.id === vendorId ? { ...v, verified: newStatus } : v,
      ),
    );

    if (selectedVendor && selectedVendor.id === vendorId) {
      setSelectedVendor((prev) => ({ ...prev, verified: newStatus ? 1 : 0 }));
    }

    try {
      console.log(`🔄 Updating vendor ${vendorId} status to ${newStatus}...`);
      await api.put(endpoint);
      console.log(`✅ Vendor ${vendorId} status updated to ${newStatus}`);
    } catch (err) {
      console.error("❌ Failed to update vendor:", err);
      // Rollback
      setVendors(previousVendors);
      setAdminVendors(previousAdminVendors);
      if (selectedVendor && selectedVendor.id === vendorId) {
        setSelectedVendor((prev) => ({
          ...prev,
          verified: currentVerifiedValue,
        }));
      }
      alert(
        "Failed to update verification status. Please make sure you have admin permissions.",
      );
    }
  };

  const handleEditVendor = () => {
    if (selectedVendorIds.length !== 1) return;
    const vendorId = selectedVendorIds[0];
    const sourceList = activeTab === "admin" ? adminVendors : vendors;
    const vendor = sourceList.find((v) => v.id === vendorId);
    if (vendor) {
      setVendorToEdit(vendor);
      setShowEditModal(true);
    }
  };

  const handleDeleteVendors = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedVendorIds.length} vendor(s)?`,
      )
    ) {
      return;
    }

    try {
      const deletePromises = selectedVendorIds.map((id) =>
        api.delete(`/api/admin/vendor/deleteVendor/${id}`),
      );

      await Promise.all(deletePromises);

      if (activeTab === "admin") {
        fetchAdminVendors();
      } else {
        fetchVendors();
      }
      setSelectedVendorIds([]);
    } catch (err) {
      console.error("Failed to delete vendors:", err);
      alert("Failed to delete some vendors. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("directory")}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "directory"
              ? "border-[#891737] text-[#891737]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Overview & Directory
        </button>
        <button
          onClick={() => setActiveTab("admin")}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "admin"
              ? "border-[#891737] text-[#891737]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Master Registry (Admin)
        </button>
      </div>

      {activeTab === "directory" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">
                  Total Vendors
                </p>
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-gray-900">
                {vendors.length}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Verified</p>
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-gray-900">
                {verifiedVendors.length}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">
                  Pending Review
                </p>
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-gray-900">
                {nonVerifiedVendors.length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className={`flex items-center gap-3 w-full sm:w-auto`}>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-3 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none appearance-none cursor-pointer min-w-[180px]"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <Filter className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <DownloadExcel
                data={filteredVendors}
                fileName="vendor_directory"
              />

              <button
                onClick={fetchVendors}
                className="p-2 text-sm font-medium hover:bg-gray-200 text-black bg-white border border-gray-100 rounded-lg transition-colors whitespace-nowrap"
                title="Refresh Table"
              >
                <RefreshCcw className="w-4 h-4 text-gray-600" />
              </button>

              <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button
                  onClick={() => setSelectedStatus("all")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    selectedStatus === "all"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedStatus("verified")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    selectedStatus === "verified"
                      ? "bg-white text-green-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Verified
                </button>
                <button
                  onClick={() => setSelectedStatus("pending")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    selectedStatus === "pending"
                      ? "bg-white text-amber-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Non Verified
                </button>
              </div>

              <div className="text-sm text-gray-500 ml-2 whitespace-nowrap">
                {filteredVendors.length} Found
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedVendorIds.length === 1 && (
                <button
                  onClick={handleEditVendor}
                  className="p-2 text-sm font-medium hover:bg-blue-50 text-blue-600 bg-white border border-blue-100 rounded-lg transition-colors"
                  title="Edit Vendor"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              {selectedVendorIds.length > 0 && (
                <button
                  onClick={handleDeleteVendors}
                  className="p-2 text-sm font-medium hover:bg-red-50 text-red-600 bg-white border border-red-100 rounded-lg transition-colors"
                  title="Delete Selected"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="space-y-3 animate-pulse max-w-md mx-auto">
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                <div className="h-3 bg-gray-100 rounded w-5/6"></div>
              </div>
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-[#891737] focus:ring-[#891737]"
                          checked={
                            filteredVendors.length > 0 &&
                            selectedVendorIds.length === filteredVendors.length
                          }
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        #
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Vendor
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Category
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Contact
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Location
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredVendors.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-5 py-12 text-center">
                          <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <AlertCircle className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500">
                            No vendors found
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredVendors.map((vendor, idx) => (
                        <tr
                          key={vendor.id}
                          className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                            selectedVendorIds.includes(vendor.id)
                              ? "bg-gray-50"
                              : ""
                          }`}
                          onClick={() => setSelectedVendor(vendor)}
                        >
                          <td
                            className="px-5 py-3.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-[#891737] focus:ring-[#891737]"
                              checked={selectedVendorIds.includes(vendor.id)}
                              onChange={(e) => handleSelectVendor(e, vendor.id)}
                            />
                          </td>
                          <td className="px-5 py-3.5 text-xs font-medium text-gray-900 whitespace-nowrap">
                            {idx + 1}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="relative flex-shrink-0">
                                <img
                                  src={
                                    vendor.logoUrl ||
                                    "https://via.placeholder.com/40"
                                  }
                                  alt={vendor.vendorName}
                                  className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                />
                                {isVerified(vendor) && (
                                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                    <CheckCircle className="w-2.5 h-2.5 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {vendor.vendorName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {vendor.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
                              {vendor.category}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                            {vendor.phoneNumber}
                          </td>
                          <td className="px-5 py-3.5">
                            <p
                              className="text-xs text-gray-600 truncate max-w-[200px]"
                              title={vendor.address}
                            >
                              {vendor.address}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            {isVerified(vendor) ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-100">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
                                <Clock className="w-3.5 h-3.5" />
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                            {vendor.createdAt
                              ? new Date(vendor.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        /* ADMIN VIEW */
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">
              Vendor Master Registry
            </h3>
            <div className="flex items-center gap-2">
              {/* Action Buttons */}
              {selectedVendorIds.length === 1 && (
                <button
                  onClick={handleEditVendor}
                  className="p-2 text-sm font-medium hover:bg-blue-50 text-blac bg-white border border-blue-100 rounded-lg transition-colors"
                  title="Edit Vendor"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              {selectedVendorIds.length > 0 && (
                <button
                  onClick={handleDeleteVendors}
                  className="p-2 text-sm font-medium hover:bg-red-50 text-red-600 bg-white border border-red-100 rounded-lg transition-colors"
                  title="Delete Selected"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="h-6 w-px bg-gray-300 mx-1"></div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-gray-200 text-black bg-white border border-gray-100 rounded-lg transition-colors whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                Add Vendor
              </button>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-3 pr-8 py-2 text-sm font-medium hover:bg-gray-200 text-black bg-white border border-gray-100 rounded-lg transition-colors whitespace-nowrap w-[180px]"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <Filter className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <DownloadExcel
                data={filteredAdminVendors}
                fileName="vendor_master_registry"
              />
              <button
                onClick={fetchAdminVendors}
                className="p-2 text-sm font-medium hover:bg-gray-200 text-black bg-white border border-gray-100 rounded-lg transition-colors whitespace-nowrap"
                title="Refresh Table"
              >
                <RefreshCcw className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {adminLoading ? (
            <div className="p-12 text-center">
              <div className="space-y-3 animate-pulse max-w-md mx-auto">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                <div className="h-4 bg-gray-100 rounded w-4/6"></div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-[#891737] focus:ring-[#891737]"
                          checked={
                            filteredAdminVendors.length > 0 &&
                            selectedVendorIds.length ===
                              filteredAdminVendors.length
                          }
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        #
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Vendor
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Category
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Contact
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Location
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAdminVendors.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-5 py-12 text-center">
                          <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <AlertCircle className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500">
                            No vendors found in registry
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredAdminVendors.map((vendor, idx) => (
                        <tr
                          key={vendor.id}
                          className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                            selectedVendorIds.includes(vendor.id)
                              ? "bg-gray-50"
                              : ""
                          }`}
                          onClick={() => setSelectedVendor(vendor)}
                        >
                          <td
                            className="px-5 py-3.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-[#891737] focus:ring-[#891737]"
                              checked={selectedVendorIds.includes(vendor.id)}
                              onChange={(e) => handleSelectVendor(e, vendor.id)}
                            />
                          </td>
                          <td className="px-5 py-3.5 text-xs font-medium text-gray-900 whitespace-nowrap">
                            {idx + 1}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="relative flex-shrink-0">
                                <img
                                  src={
                                    vendor.logoUrl ||
                                    vendor.image ||
                                    vendor.cloudinaryLink ||
                                    "/placeholder.png"
                                  }
                                  alt={vendor.vendorName}
                                  className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                  onError={(e) => {
                                    e.target.src = "/placeholder.png";
                                  }}
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                                  <ShieldCheck className="w-2.5 h-2.5 text-white" />
                                </div>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {vendor.vendorName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {vendor.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
                              {vendor.category}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                            {vendor.phoneNumber}
                          </td>
                          <td className="px-5 py-3.5">
                            <p
                              className="text-xs text-gray-600 truncate max-w-[200px]"
                              title={vendor.address}
                            >
                              {vendor.address}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Auto Verified
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                            {vendor.createdAt
                              ? new Date(vendor.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Vendor Details
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Complete vendor information
                </p>
              </div>
              <button
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                onClick={() => setSelectedVendor(null)}
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {/* Profile Section */}
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={
                    selectedVendor.logoUrl ||
                    selectedVendor.image ||
                    selectedVendor.cloudinaryLink ||
                    "/placeholder.png"
                  }
                  alt={selectedVendor.vendorName}
                  className="w-24 h-24 rounded-lg object-cover border border-gray-100"
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedVendor.vendorName}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {selectedVendor.category}
                      </p>
                    </div>
                    {activeTab === "directory" && (
                      <div>
                        {isVerified(selectedVendor) ? (
                          <button
                            onClick={() =>
                              handleVerifyStatus(
                                selectedVendor.id,
                                selectedVendor.verified,
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 border border-red-100 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Unverify Vendor
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleVerifyStatus(
                                selectedVendor.id,
                                selectedVendor.verified,
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-green-600 hover:bg-green-50 border border-green-100 transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verify Vendor
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-xs text-gray-900 truncate">
                        {selectedVendor.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-xs text-gray-900">
                        {selectedVendor.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-xs text-gray-900 line-clamp-2">
                        {selectedVendor.address}
                      </p>
                    </div>
                  </div>
                  {selectedVendor.website && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Website</p>
                        <a
                          href={selectedVendor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#891737] hover:text-[#891737]/80 truncate block"
                        >
                          {selectedVendor.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Products Section */}
              {selectedVendor.products &&
                selectedVendor.products.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center">
                        <Package className="w-4 h-4 text-gray-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        Products & Services
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {selectedVendor.products.map((product, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white rounded-lg border border-gray-100"
                        >
                          <div className="flex items-start gap-4">
                            {/* Product Image */}
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={
                                  product.imageUrl ||
                                  product.image ||
                                  product.cloudinaryLink ||
                                  product.productImage ||
                                  "/api/placeholder/64/64"
                                }
                                alt={product.name || product.productName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "/api/placeholder/64/64";
                                }}
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-medium text-gray-900 mb-1">
                                {product.name || product.productName}
                              </h5>
                              <span className="inline-block px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-xs font-medium">
                                {product.type || product.productType}
                              </span>
                              {(product.description ||
                                product.productDescription) && (
                                <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                  {product.description ||
                                    product.productDescription}
                                </p>
                              )}

                              {/* Product Link Button */}
                              {(product.linkProduct || product.productLink) && (
                                <a
                                  href={
                                    product.linkProduct || product.productLink
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-[#891737] hover:underline"
                                >
                                  View Product{" "}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>

                            {/* Price */}
                            {(product.price || product.productPrice) && (
                              <div className="text-right flex-shrink-0">
                                <p className="text-lg font-semibold text-gray-900">
                                  ₹{product.price || product.productPrice}
                                </p>
                                <p className="text-xs text-gray-500">
                                  per unit
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <div className="flex-1">
                <span className="text-xs text-gray-500">
                  Status:{" "}
                  {activeTab === "admin" ? (
                    <span className="text-blue-600 font-medium whitespace-nowrap">
                      Auto Verified
                    </span>
                  ) : isVerified(selectedVendor) ? (
                    <span className="text-green-600 font-medium">Verified</span>
                  ) : (
                    <span className="text-amber-600 font-medium">
                      Pending Review
                    </span>
                  )}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  Close
                </button>
                {activeTab === "directory" && (
                  <>
                    {isVerified(selectedVendor) ? (
                      <button
                        onClick={() =>
                          handleVerifyStatus(
                            selectedVendor.id,
                            selectedVendor.verified,
                          )
                        }
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Unverify Vendor
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleVerifyStatus(
                            selectedVendor.id,
                            selectedVendor.verified,
                          )
                        }
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Verify Vendor
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddVendorForm
          onClose={() => {
            setShowAddModal(false);
            if (activeTab === "admin") fetchAdminVendors();
            else fetchVendors();
          }}
        />
      )}

      {/* Edit Vendor Modal */}
      {showEditModal && (
        <AddVendorForm
          isEditMode={true}
          initialData={vendorToEdit}
          onClose={() => {
            setShowEditModal(false);
            setVendorToEdit(null);
            if (activeTab === "admin") fetchAdminVendors();
            else fetchVendors();
            setSelectedVendorIds([]); // Clear selection
          }}
        />
      )}
    </div>
  );
};

export default VendorDirectory;
