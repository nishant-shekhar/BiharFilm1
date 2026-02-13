import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiUser,
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFilm,
  FiExternalLink,
  FiAward,
  FiPackage,
  FiShield,
} from "react-icons/fi";
import api from "../Components/axios";

const Security = () => {
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [focusedArtist, setFocusedArtist] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // overview, portfolio, experience
  const [loading, setLoading] = useState(true);

  // Existing URL from Security.jsx
  const VISITING_URL = "https://film.bihar.gov.in/api/vendor/securityvendors";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch from both endpoints: Existing Security Vendors + New Verified Artists
        const [securityRes, verifiedArtistsRes] = await Promise.all([
          fetch(VISITING_URL).then((res) => res.json()),
          api.get("/api/artist/verifiedartists"),
        ]);

        let combinedData = [];

        // Process Security Vendors (Existing API)
        if (securityRes.success && Array.isArray(securityRes.data)) {
          const securityProviders = securityRes.data.map((vendor) => ({
            ...vendor,
            id: vendor.id || `sec_${Math.random()}`,
            fullName: vendor.vendorName, // Map to fullName for UI
            professions: vendor.category ? [{ name: vendor.category }] : [], // Map category for UI
            image: vendor.logoUrl || vendor.image, // Map logo for UI
            isSecurityProvider: true,
          }));
          combinedData = [...securityProviders];
        }

        // Process Verified Artists (New API)
        if (verifiedArtistsRes.data.success) {
          const verifiedData = verifiedArtistsRes.data.data.map((artist) => ({
            ...artist,
            emailId: artist.emailId || artist.email,
            isVerifiedSource: true,
          }));

          // Merge: Add verified artists if ID doesn't exist (though IDs likely distinct)
          const existingIds = new Set(combinedData.map((a) => a.id));
          verifiedData.forEach((vArtist) => {
            if (!existingIds.has(vArtist.id)) {
              combinedData.push(vArtist);
            }
          });
        }

        setArtists(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getParsedExperiences = (artist) => {
    try {
      let exps = [];
      if (typeof artist.experiences === "string") {
        exps = JSON.parse(artist.experiences);
      } else {
        exps = artist.experiences || [];
      }

      return exps.map((e) => ({
        ...e,
        role: e.role || e.roleInFilm,
      }));
    } catch (e) {
      return [];
    }
  };

  const getPrimaryRole = (artist) => {
    if (artist.isSecurityProvider && artist.category) {
      return artist.category;
    }
    if (
      artist.professions &&
      Array.isArray(artist.professions) &&
      artist.professions.length > 0
    ) {
      return artist.professions.map((p) => p.name || p).join(", ");
    }
    if (
      artist.specializations &&
      Array.isArray(artist.specializations) &&
      artist.specializations.length > 0
    ) {
      return artist.specializations.map((s) => s.name || s).join(", ");
    }
    const experiences = getParsedExperiences(artist);
    if (experiences.length > 0) {
      return experiences[0].role || experiences[0].roleInFilm || "Artist";
    }
    return "Security Profile";
  };

  // Whitelist of valid Technician roles
  const TECHNICIAN_ROLES = [
    "Story Writer",
    "Screenplay Writer",
    "Dialogue Writer",
    "Voice Over Writer",
    "Director of Photography (DOP)",
    "Camera Assistant",
    "Lighting Assistant",
    "Light Man",
    "Sound Designer",
    "Sound Recordist",
    "Effects & Foley Artist",
    "Sound Mixing Master (RR)",
    "Editor",
    "Editing Assistant",
    "Production Designer",
    "Art Director",
    "Art Director Assistant",
    "Costume Designer",
    "Dress Man",
    "Make Up Man",
    "Make Up Assistant",
    "Hair Stylist",
    "Wig Maker",
    "DI Colourist",
  ];

  const filtered = artists.filter((a) => {
    // 1. Whitelist Check: Must have at least one Technician role
    const hasTechnicianRole = (role) => {
      if (!role) return false;
      const roleName = typeof role === "string" ? role : role.name;
      return TECHNICIAN_ROLES.some(
        (tech) => tech.toLowerCase() === roleName.toLowerCase(),
      );
    };

    const isTechnician =
      (a.professions && a.professions.some(hasTechnicianRole)) ||
      (a.specializations && a.specializations.some(hasTechnicianRole)) ||
      getParsedExperiences(a).some(
        (exp) =>
          hasTechnicianRole(exp.role) || hasTechnicianRole(exp.roleInFilm),
      );

    if (!isTechnician) return false;

    // 2. Local Search
    const matchesSearch =
      a.fullName && a.fullName.toLowerCase().includes(search.toLowerCase());

    if (selectedCategory === "All") return matchesSearch;

    // 3. Category Chip Filter
    const matchesSelectedCategory = (role) => {
      if (!role) return false;
      const roleName = typeof role === "string" ? role : role.name;
      return (
        roleName && roleName.toLowerCase() === selectedCategory.toLowerCase()
      );
    };

    const matchesCategory =
      (a.professions && a.professions.some(matchesSelectedCategory)) ||
      (a.specializations && a.specializations.some(matchesSelectedCategory)) ||
      getParsedExperiences(a).some(
        (exp) =>
          matchesSelectedCategory(exp.role) ||
          matchesSelectedCategory(exp.roleInFilm),
      );

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto min-h-[42rem] max-h-[50rem] flex rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-xl font-sans text-gray-900">
      {/* Sidebar Navigation */}
      <div
        className={`${
          focusedArtist ? "hidden lg:flex lg:w-80" : "w-full lg:w-80 flex"
        } bg-white border-r border-gray-100 flex-col transition-all duration-300`}
      >
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">
            Local Technicians
          </h2>
          <p className="text-xs text-gray-400 mb-5 font-medium">
            BSFDFC • Official Registry
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

          {/* Filter Chips */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["All", ...TECHNICIAN_ROLES].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#891737] text-white border-[#891737] shadow-sm"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 space-y-3">
              <div className="w-6 h-6 border-2 border-[#891737] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-400">Loading Directory...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 px-6">
              <p className="text-sm text-gray-400">No providers found.</p>
            </div>
          ) : (
            filtered.map((artist, i) => (
              <button
                key={artist.id || i}
                onClick={() => setFocusedArtist(artist)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 border border-transparent ${
                  focusedArtist?.id === artist.id
                    ? "bg-[#891737] text-white shadow-md shadow-[#891737]/20"
                    : "hover:bg-gray-50 hover:border-gray-100 text-gray-700"
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={artist.image || "https://via.placeholder.com/150"}
                    alt={artist.fullName}
                    className={`w-10 h-10 rounded-full object-cover border-2 ${
                      focusedArtist?.id === artist.id
                        ? "border-white"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-sm font-semibold truncate ${
                      focusedArtist?.id === artist.id
                        ? "text-white"
                        : "text-gray-900 group-hover:text-black"
                    }`}
                  >
                    {artist.fullName}
                  </h4>
                  <p
                    className={`text-[11px] truncate uppercase tracking-wider font-medium ${
                      focusedArtist?.id === artist.id
                        ? "text-white/80"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  >
                    {getPrimaryRole(artist)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
        {!focusedArtist ? (
          // Empty State / Welcome Screen
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 relative z-10 bg-gray-50/30">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-gray-100">
              <FiShield className="text-2xl text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Select a Provider
            </h3>
            <p className="text-gray-400 max-w-xs leading-relaxed text-sm">
              Choose a profile from the directory to view their complete details
              and services.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full relative z-10 bg-white">
            {/* Header / Breadcrumb for Mobile */}
            <div className="lg:hidden p-4 border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-20">
              <button
                onClick={() => setFocusedArtist(null)}
                className="flex items-center text-sm text-gray-500 hover:text-gray-900 font-medium"
              >
                <FiArrowLeft className="mr-2" /> Back to Directory
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-8 lg:p-12 max-w-4xl mx-auto space-y-10">
                {/* Simplified Profile Header */}
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left pb-8 border-b border-gray-100">
                  <div className="shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white">
                      <img
                        src={
                          focusedArtist.image ||
                          "https://via.placeholder.com/150"
                        }
                        className="w-full h-full object-cover"
                        alt={focusedArtist.fullName}
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-1">
                        {focusedArtist.fullName}
                      </h1>
                      <p className="text-[#891737] text-xs font-bold uppercase tracking-[0.2em]">
                        {getPrimaryRole(focusedArtist)}
                      </p>
                    </div>
                    {focusedArtist.district && (
                      <div className="inline-flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <FiMapPin className="mr-2" />
                        {focusedArtist.district}
                      </div>
                    )}

                    {/* Communication Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-50 text-left">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FiMail className="text-[#891737]" />
                          <span className="font-bold text-[10px] uppercase tracking-wider text-gray-400">
                            Email
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate pl-6">
                          {focusedArtist.emailId ||
                            focusedArtist.email ||
                            "N/A"}
                        </span>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FiPhone className="text-[#891737]" />
                          <span className="font-bold text-[10px] uppercase tracking-wider text-gray-400">
                            Phone
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate pl-6">
                          {focusedArtist.isVerifiedSource
                            ? focusedArtist.showPhonePublic
                              ? focusedArtist.phoneNumber
                              : "Protected"
                            : focusedArtist.phoneNumber || "N/A"}
                        </span>
                      </div>

                      {focusedArtist.address && (
                        <div className="flex flex-col space-y-1 sm:col-span-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FiMapPin className="text-[#891737]" />
                            <span className="font-bold text-[10px] uppercase tracking-wider text-gray-400">
                              Address
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 leading-relaxed pl-6">
                            {focusedArtist.address}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center space-x-8 border-b border-gray-100 overflow-x-auto no-scrollbar">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "portfolio", label: "Portfolio" },
                    { id: "social", label: "Social Media" },
                    { id: "videos", label: "Videos" },
                    { id: "biodata", label: "Bio Data" },
                    { id: "experience", label: "Experience" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                        activeTab === tab.id
                          ? "text-[#891737]"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#891737] rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[20rem]">
                  {activeTab === "overview" && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                      {/* Bio */}
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                          Professional Brief
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                          {focusedArtist.description ||
                            "No detailed description available for this profile. content."}
                        </p>
                      </div>

                      {/* Expertise Tags */}
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                          Core Expertise
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {focusedArtist.professions?.map((p, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded border border-gray-200"
                            >
                              {p.name || p}
                            </span>
                          ))}
                          {focusedArtist.specializations?.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-[#891737]/5 text-[#891737] text-[10px] font-bold uppercase tracking-wider rounded border border-[#891737]/10"
                            >
                              {s.name || s}
                            </span>
                          ))}
                          {!focusedArtist.professions?.length &&
                            !focusedArtist.specializations?.length && (
                              <span className="text-xs text-gray-400 italic">
                                General Service
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "social" && (
                    <div className="animate-in fade-in duration-500">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {focusedArtist.imdbLink && (
                            <a
                              href={focusedArtist.imdbLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center p-4 bg-white border border-gray-100 rounded-xl hover:border-[#f5c518] hover:shadow-md transition-all"
                            >
                              <div className="w-12 h-12 bg-[#f5c518]/10 rounded-lg flex items-center justify-center text-[#f5c518] group-hover:bg-[#f5c518] group-hover:text-black transition-colors">
                                <FiFilm className="text-xl" />
                              </div>
                              <div className="ml-4">
                                <h4 className="text-sm font-bold text-gray-900">
                                  IMDb Profile
                                </h4>
                                <p className="text-xs text-gray-400">
                                  View Credits
                                </p>
                              </div>
                              <FiExternalLink className="ml-auto text-gray-300 group-hover:text-gray-900" />
                            </a>
                          )}
                          {/* ... other social links identical to LocalArtist ... */}

                          {focusedArtist.facebook && (
                            <a
                              href={focusedArtist.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center p-4 bg-white border border-gray-100 rounded-xl hover:border-[#1877f2] hover:shadow-md transition-all"
                            >
                              <div className="w-12 h-12 bg-[#1877f2]/10 rounded-lg flex items-center justify-center text-[#1877f2] group-hover:bg-[#1877f2] group-hover:text-white transition-colors">
                                <FiExternalLink className="text-xl" />
                              </div>
                              <div className="ml-4">
                                <h4 className="text-sm font-bold text-gray-900">
                                  Facebook
                                </h4>
                                <p className="text-xs text-gray-400">
                                  Social Profile
                                </p>
                              </div>
                              <FiExternalLink className="ml-auto text-gray-300 group-hover:text-gray-900" />
                            </a>
                          )}

                          {/* Add other social logic if needed, keeping it brief for replacement */}
                        </div>

                        {!focusedArtist.imdbLink &&
                          !focusedArtist.linkedIn &&
                          !focusedArtist.instagram &&
                          !focusedArtist.facebook &&
                          !focusedArtist.twitter && (
                            <div className="text-center py-20 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                              <FiUser className="text-4xl text-gray-200 mx-auto mb-4" />
                              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                No Social Links
                              </h4>
                              <p className="text-xs text-gray-400 mt-2 px-6">
                                No social media profiles connected.
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {activeTab === "videos" && (
                    <div className="animate-in fade-in duration-500">
                      {focusedArtist.videos &&
                      focusedArtist.videos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {focusedArtist.videos.map((vid, idx) => (
                            <div
                              key={idx}
                              className="aspect-video bg-black rounded-xl overflow-hidden relative group"
                            >
                              <iframe
                                src={
                                  vid.url
                                    ? vid.url.replace("watch?v=", "embed/")
                                    : ""
                                }
                                title={`Video ${idx}`}
                                className="w-full h-full"
                                allowFullScreen
                              ></iframe>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-20 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                          <FiFilm className="text-4xl text-gray-200 mx-auto mb-4" />
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                            No Video Content
                          </h4>
                          <p className="text-xs text-gray-400 mt-2 px-6">
                            Video reels and showreels will appear here once
                            added.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "biodata" && (
                    <div className="animate-in fade-in duration-500">
                      <div className="max-w-2xl mx-auto">
                        {focusedArtist.bestFilm ? (
                          <div className="p-8 bg-white border border-gray-200 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                              <FiExternalLink className="text-4xl" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              Download Bio Data / CV
                            </h3>
                            <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
                              Access the official verified bio-data document for{" "}
                              {focusedArtist.fullName}.
                            </p>
                            <a
                              href={focusedArtist.bestFilm}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-3 px-8 py-4 bg-[#891737] text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-[#72132d] transition-colors shadow-lg shadow-[#891737]/20"
                            >
                              View Document <FiExternalLink />
                            </a>
                          </div>
                        ) : (
                          <div className="text-center py-20 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                            <FiExternalLink className="text-4xl text-gray-200 mx-auto mb-4" />
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                              Bio Data Unavailable
                            </h4>
                            <p className="text-xs text-gray-400 mt-2 px-6">
                              No official Bio Data document is currently linked
                              to this profile.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "portfolio" && (
                    <div className="animate-in fade-in duration-500">
                      {focusedArtist.images &&
                      focusedArtist.images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                          {focusedArtist.images.map((img, idx) => (
                            <div
                              key={idx}
                              className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group cursor-pointer relative shadow-sm"
                            >
                              <img
                                src={img.url}
                                alt={`Work ${idx}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/400";
                                }}
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <FiExternalLink className="text-white text-xl" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-20 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                          <FiPackage className="text-4xl text-gray-200 mx-auto mb-4" />
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                            No Visual Assets Found
                          </h4>
                          <p className="text-xs text-gray-400 mt-2 px-6">
                            The gallery for this profile is currently being
                            updated.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "experience" && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      {getParsedExperiences(focusedArtist).length > 0 ? (
                        getParsedExperiences(focusedArtist).map(
                          (exp, index) => (
                            <div
                              key={index}
                              className="group bg-white border border-gray-100 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1"
                            >
                              <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                <div className="space-y-3">
                                  <div>
                                    <h4 className="text-base font-black text-gray-900 leading-tight mb-1">
                                      {exp.filmTitle}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-black text-[#891737] uppercase tracking-wider">
                                        {exp.role}
                                      </span>
                                      {exp.durationFrom && (
                                        <span className="text-[10px] text-gray-400 font-bold">
                                          •{" "}
                                          {new Date(
                                            exp.durationFrom,
                                          ).getFullYear()}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {exp.awards && (
                                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest rounded border border-amber-100">
                                      <FiAward className="w-3 h-3" />{" "}
                                      {exp.awards}
                                    </div>
                                  )}
                                </div>

                                {(exp.imdbLink || exp.link) && (
                                  <a
                                    href={exp.imdbLink || exp.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#891737] transition-all shadow-lg shadow-gray-200"
                                  >
                                    {exp.imdbLink ? "IMDb" : "View Project"}{" "}
                                    <FiExternalLink />
                                  </a>
                                )}
                              </div>
                              {exp.description && (
                                <p className="mt-4 text-xs text-gray-500 leading-relaxed border-t border-gray-50 pt-4 italic">
                                  "{exp.description}"
                                </p>
                              )}
                            </div>
                          ),
                        )
                      ) : (
                        <div className="text-center py-20 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                          <FiAward className="text-4xl text-gray-200 mx-auto mb-4" />
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                            Filmography Pending
                          </h4>
                          <p className="text-xs text-gray-400 mt-2 px-6">
                            Official production credits will appear once
                            verified by the department.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Disclaimer */}
                <div className="pt-8 pb-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                    <p className="text-[10px] leading-relaxed text-gray-400 font-medium text-center italic">
                      <span className="font-bold text-gray-500 uppercase tracking-widest not-italic mr-1">
                        Disclaimer:
                      </span>
                      The information and data displayed on this portal are
                      provided solely by the respective individuals/applicants
                      and have not been independently verified by the
                      Department. The Department makes no representations or
                      warranties regarding the accuracy, completeness, or
                      reliability of the submitted information and shall not be
                      held responsible or liable for any errors, omissions, or
                      claims arising from its use.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
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
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Security;
