import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiShield,
  FiArrowLeft,
  FiPhone,
  FiMail,
  FiMapPin,
  FiGlobe,
  FiAward,
} from "react-icons/fi";
import api from "../Components/axios";

const Security = () => {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [focusedProvider, setFocusedProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use the full URL as per original component, but wrapped in try-catch
  const FETCH_URL =
    "https://bsfdfcbackend.onrender.com/api/vendor/securityvendors";

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch(FETCH_URL);
        const data = await response.json();
        if (data.success) {
          setProviders(data.data);
        }
      } catch (error) {
        console.error("Error fetching security providers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const filtered = providers.filter(
    (p) =>
      p.vendorName && p.vendorName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full max-w-7xl mx-auto h-[85vh] flex rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-xl font-sans text-gray-900">
      {/* Sidebar Navigation */}
      <div
        className={`${
          focusedProvider ? "hidden lg:flex lg:w-80" : "w-full lg:w-80 flex"
        } bg-white border-r border-gray-100 flex-col transition-all duration-300`}
      >
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">
            Local Technicians
          </h2>
          <p className="text-xs text-gray-400 mb-5 font-medium">
            BSFDFC • Verified Providers
          </p>

          <div className="relative group">
            <FiSearch className="absolute left-3 top-3 text-gray-400 text-sm group-focus-within:text-[#891737] transition-colors" />
            <input
              type="text"
              placeholder="Search providers..."
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
              <p className="text-xs text-gray-400">Loading Providers...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 px-6">
              <p className="text-sm text-gray-400">
                No security providers found.
              </p>
            </div>
          ) : (
            filtered.map((provider, i) => (
              <button
                key={provider.id || i}
                onClick={() => setFocusedProvider(provider)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 border border-transparent ${
                  focusedProvider?.id === provider.id
                    ? "bg-[#891737] text-white shadow-md shadow-[#891737]/20"
                    : "hover:bg-gray-50 hover:border-gray-100 text-gray-700"
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={provider.logoUrl || "https://via.placeholder.com/150"}
                    alt={provider.vendorName}
                    className={`w-10 h-10 rounded-full object-cover border-2 ${
                      focusedProvider?.id === provider.id
                        ? "border-white"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-sm font-semibold truncate ${
                      focusedProvider?.id === provider.id
                        ? "text-white"
                        : "text-gray-900 group-hover:text-black"
                    }`}
                  >
                    {provider.vendorName}
                  </h4>
                  <p
                    className={`text-[11px] truncate uppercase tracking-wider font-medium ${
                      focusedProvider?.id === provider.id
                        ? "text-white/80"
                        : "text-gray-400"
                    }`}
                  >
                    {provider.category || "Security"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <p className="text-[10px] text-center text-gray-400 font-medium">
            {filtered.length} PROVIDERS LISTED
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
        {!focusedProvider ? (
          // Empty State / Welcome Screen
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 relative z-10">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-gray-100">
              <FiShield className="text-3xl text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Select a Provider
            </h3>
            <p className="text-gray-500 max-w-sm leading-relaxed text-sm">
              Choose a security provider from the list to view their contact
              details, address, and available services.
            </p>
          </div>
        ) : (
          // Detailed Provider View
          <div className="flex-1 flex flex-col h-full relative z-10">
            {/* Header / Breadcrumb for Mobile */}
            <div className="lg:hidden p-4 border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-20">
              <button
                onClick={() => setFocusedProvider(null)}
                className="flex items-center text-sm text-gray-500 hover:text-gray-900 font-medium"
              >
                <FiArrowLeft className="mr-2" /> Back to List
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 pb-20">
              <div className="max-w-4xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="group relative shrink-0 mx-auto md:mx-0">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden shadow-xl border border-gray-200 relative z-10 bg-white">
                      <img
                        src={
                          focusedProvider.logoUrl ||
                          "https://via.placeholder.com/150"
                        }
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={focusedProvider.vendorName}
                      />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-5">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                        {focusedProvider.vendorName}
                      </h1>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span className="px-3 py-1 bg-[#891737] text-white text-xs font-bold uppercase tracking-wider rounded shadow-md shadow-[#891737]/20">
                          {focusedProvider.category || "Security Provider"}
                        </span>
                        {focusedProvider.website && (
                          <a
                            href={focusedProvider.website}
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
                            {focusedProvider.email || "N/A"}
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
                            {focusedProvider.phoneNumber || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {focusedProvider.address && (
                      <div className="text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto md:mx-0 bg-white p-0 border-t border-gray-100 pt-4 mt-2">
                        <span className="text-gray-900 font-semibold mr-1">
                          Address:
                        </span>{" "}
                        {focusedProvider.address}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Info / Placeholder for more details */}
                <div className="space-y-6 pt-6 border-t border-gray-100">
                  <div className="flex items-end justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FiShield className="text-[#891737]" />
                      About & Services
                    </h3>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200/60">
                    <p className="text-gray-600 leading-relaxed">
                      {focusedProvider.description ||
                        "No detailed description available for this security provider. Please contact them directly using the information above for specific service inquiries."}
                    </p>
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

export default Security;
