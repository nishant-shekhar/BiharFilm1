import React, { useEffect, useState } from "react";
import api from "../Components/axios"; // ✅ Use configured api instance
import {
  Users,
  UserPlus,
  PlusCircle,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Film,
  X,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  AlertTriangle,
  Filter,
  RefreshCcw,
  Pencil,
  Search,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Award,
  PlayCircle,
  Image as ImageIcon,
  Globe,
  ChevronDown,
  Check,
  Trash2,
  Plus,
  FileText,
} from "lucide-react";
import AddArtistForm from "./AddArtistForm";
import { FaImdb } from "react-icons/fa";
import AlertBox from "../Components/AlertBox";
import DownloadExcel from "../Components/DownloadExcel";

const PREDEFINED_ROLES = [
  { value: "actor", label: "Actor / Actress" },
  { value: "singer", label: "Singer" },
  { value: "composer", label: "Composer" },
  { value: "musician", label: "Musician" },
  { value: "director", label: "Director" },
  { value: "producer", label: "Producer" },
  { value: "dancer", label: "Dancer" },
  { value: "stunt", label: "Stunt / Action Artist" },
  { value: "writer", label: "Writer / Script" },
  { value: "editor", label: "Editor" },
  { value: "cinematographer", label: "Cinematographer" },
];

const BIHAR_DISTRICTS = [
  "Araria",
  "Arwal",
  "Aurangabad",
  "Banka",
  "Begusarai",
  "Bhagalpur",
  "Bhojpur",
  "Buxar",
  "Darbhanga",
  "East Champaran",
  "Gaya",
  "Gopalganj",
  "Jamui",
  "Jehanabad",
  "Kaimur",
  "Katihar",
  "Khagaria",
  "Kishanganj",
  "Lakhisarai",
  "Madhepura",
  "Madhubani",
  "Munger",
  "Muzaffarpur",
  "Nalanda",
  "Nawada",
  "Patna",
  "Purnia",
  "Rohtas",
  "Saharsa",
  "Samastipur",
  "Saran",
  "Sheikhpura",
  "Sheohar",
  "Sitamarhi",
  "Siwan",
  "Supaul",
  "Vaishali",
  "West Champaran",
].map((d) => ({ value: d.toLowerCase(), label: d }));

// Custom Dropdown Component
const FilterDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  icon: Icon,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all hover:border-gray-300 min-w-[160px] text-left"
      >
        {Icon && <Icon className="w-4 h-4 text-gray-400 shrink-0" />}
        <span
          className={`truncate flex-1 ${
            !value ? "text-gray-500" : "text-gray-900 font-medium"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-2 border-b border-gray-50">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border-none rounded-md focus:ring-1 focus:ring-[#891737] outline-none"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
            <button
              onClick={() => {
                onChange("");
                setIsOpen(false);
                setSearch("");
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-gray-50 ${
                !value
                  ? "text-[#891737] bg-[#891737]/5 font-medium"
                  : "text-gray-600"
              }`}
            >
              {placeholder}
              {!value && <Check className="w-3.5 h-3.5" />}
            </button>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-gray-50 ${
                    value === opt.value
                      ? "text-[#891737] bg-[#891737]/5 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {opt.label}
                  {value === opt.value && <Check className="w-3.5 h-3.5" />}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-xs text-gray-400">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Artist = ({ searchQuery }) => {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [artistToEdit, setArtistToEdit] = useState(null);

  const [activeTab, setActiveTab] = useState("directory");
  const [adminArtists, setAdminArtists] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Function to extract video thumbnail from URL
  const getVideoThumbnail = (url) => {
    if (!url) return null;

    try {
      // YouTube
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const youtubeMatch = url.match(youtubeRegex);
      if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }

      // Vimeo
      const vimeoRegex = /(?:vimeo\.com\/)(?:.*#|.*\/videos\/|.*\/|channels\/.*\/|groups\/.*\/videos\/|album\/.*\/video\/|video\/)?([0-9]+)(?:$|\/|\?)/;
      const vimeoMatch = url.match(vimeoRegex);
      if (vimeoMatch) {
        const videoId = vimeoMatch[1];
        return `https://vumbnail.com/${videoId}.jpg`;
      }

      // For other video platforms or direct video files, return a default thumbnail
      return null;
    } catch (error) {
      console.error('Error extracting video thumbnail:', error);
      return null;
    }
  };
  const [selectedArtistIds, setSelectedArtistIds] = useState([]);

  // Check if artist is verified (handles boolean true, 1 "1")
  const isVerified = (artist) =>
    artist.isVerified === true ||
    artist.isVerified === 1 ||
    artist.status === 1 ||
    artist.verified === true ||
    artist.verified === 1;

  const fetchArtists = async () => {
    try {
      console.log("📊 Fetching artists...");

      // ✅ Use 'api' instead of 'axios' - automatically sends cookies
      const res = await api.get("/api/artist/getAllArtists");

      console.log("✅ Artists received:", res.data);
      setArtists(res.data.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch artists:", err);
      // ❌ DO NOT redirect - just log the error
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminArtists = async () => {
    try {
      setAdminLoading(true);
      console.log("📊 Fetching admin artist registry...");
      const res = await api.get("/api/admin/artist/allArtists");
      console.log("✅ Admin artists received:", res.data);
      setAdminArtists(res.data.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch admin artists:", err);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    setSelectedArtistIds([]);
    if (activeTab === "admin" && adminArtists.length === 0) {
      fetchAdminArtists();
    }
  }, [activeTab]);

  // Join date calculation
  // const today = ... (removed duplicate)

  // Alert State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    confirmText: "OK",
    cancelText: "Cancel",
    showCancel: false,
    onConfirm: null,
  });

  const showAlert = (config) => {
    setAlertConfig({
      isOpen: true,
      confirmText: "OK",
      cancelText: "Cancel",
      showCancel: false,
      onConfirm: null,
      ...config,
    });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const verifyArtistAPI = async (id) => {
    try {
      const res = await api.put(`/api/artist/${id}/verify`);

      if (res.status === 200) {
        // Update artists list - set multiple fields to ensure compatibility
        const updatedFields = {
          isVerified: true,
          verified: true,
          status: 1,
        };

        setArtists(
          artists.map((artist) =>
            artist.id === id ? { ...artist, ...updatedFields } : artist,
          ),
        );
        // Update selected artist if open
        if (selectedArtist && selectedArtist.id === id) {
          setSelectedArtist({ ...selectedArtist, ...updatedFields });
        }
        showAlert({
          type: "success",
          title: "Success",
          message: "Artist verified successfully!",
        });
      }
    } catch (err) {
      console.error("Failed to verify artist:", err);
      showAlert({
        type: "error",
        title: "Error",
        message: `Failed to verify artist: ${
          err.response?.data?.message || err.message
        }`,
      });
    }
  };

  const unverifyArtistAPI = async (id) => {
    try {
      const res = await api.put(`/api/artist/${id}/unverify`);

      if (res.status === 200) {
        // Update artists list
        const updatedFields = {
          isVerified: false,
          verified: false,
          status: 0,
        };

        setArtists(
          artists.map((artist) =>
            artist.id === id ? { ...artist, ...updatedFields } : artist,
          ),
        );
        // Update selected artist if open
        if (selectedArtist && selectedArtist.id === id) {
          setSelectedArtist({
            ...selectedArtist,
            ...updatedFields,
          });
        }
        showAlert({
          type: "success",
          title: "Success",
          message: "Artist unverified successfully!",
        });
      }
    } catch (err) {
      console.error("Failed to unverify artist:", err);
      showAlert({
        type: "error",
        title: "Error",
        message: `Failed to unverify artist: ${
          err.response?.data?.message || err.message
        }`,
      });
    }
  };

  const handleVerify = (id) => {
    showAlert({
      type: "warning",
      title: "Confirm Verification",
      message: "Are you sure you want to verify this artist?",
      showCancel: true,
      confirmText: "Verify",
      onConfirm: () => verifyArtistAPI(id),
    });
  };

  const handleUnverify = (id) => {
    showAlert({
      type: "warning",
      title: "Confirm Unverification",
      message: "Are you sure you want to unverify this artist?",
      showCancel: true,
      confirmText: "Unverify",
      onConfirm: () => unverifyArtistAPI(id),
    });
  };

  // Filter artists based on search query and status
  const filteredArtists = artists.filter((artist) => {
    // 1. Filter by status
    const statusMatch =
      selectedStatus === "all"
        ? true
        : selectedStatus === "verified"
          ? isVerified(artist)
          : !isVerified(artist);

    if (!statusMatch) return false;

    // 2. Filter by role
    if (selectedRole) {
      const artistRole =
        typeof artist.role === "object"
          ? artist.role?.name?.toLowerCase()
          : artist.role?.toLowerCase();
      if (artistRole !== selectedRole.toLowerCase()) return false;
    }

    // 3. Filter by district
    if (selectedDistrict) {
      const artistDistrict =
        typeof artist.district === "object"
          ? artist.district?.name?.toLowerCase()
          : artist.district?.toLowerCase();
      if (artistDistrict !== selectedDistrict.toLowerCase()) return false;
    }

    // 4. Filter by search query
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();

    const roleStr =
      typeof artist.role === "object"
        ? artist.role?.name || ""
        : artist.role || "";
    const districtStr =
      typeof artist.district === "object"
        ? artist.district?.name || ""
        : artist.district || "";

    return (
      artist.fullName?.toLowerCase().includes(query) ||
      roleStr.toLowerCase().includes(query) ||
      districtStr.toLowerCase().includes(query) ||
      artist.email?.toLowerCase().includes(query)
    );
  });

  const filteredAdminArtists = adminArtists.filter((artist) => {
    // 1. Filter by role
    if (selectedRole) {
      const artistRole =
        typeof artist.role === "object"
          ? artist.role?.name?.toLowerCase()
          : artist.role?.toLowerCase();
      if (artistRole !== selectedRole.toLowerCase()) return false;
    }

    // 2. Filter by district
    if (selectedDistrict) {
      const artistDistrict =
        typeof artist.district === "object"
          ? artist.district?.name?.toLowerCase()
          : artist.district?.toLowerCase();
      if (artistDistrict !== selectedDistrict.toLowerCase()) return false;
    }

    // 3. Filter by search query
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();

    const roleStr =
      typeof artist.role === "object"
        ? artist.role?.name || ""
        : artist.role || "";
    const districtStr =
      typeof artist.district === "object"
        ? artist.district?.name || ""
        : artist.district || "";

    return (
      artist.fullName?.toLowerCase().includes(query) ||
      roleStr.toLowerCase().includes(query) ||
      districtStr.toLowerCase().includes(query) ||
      artist.email?.toLowerCase().includes(query) ||
      artist.phoneNumber?.includes(query)
    );
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const sourceList =
        activeTab === "admin" ? filteredAdminArtists : filteredArtists;
      const allIds = sourceList.map((a) => a.id);
      setSelectedArtistIds(allIds);
    } else {
      setSelectedArtistIds([]);
    }
  };

  const handleSelectArtist = (e, id) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedArtistIds((prev) => [...prev, id]);
    } else {
      setSelectedArtistIds((prev) =>
        prev.filter((artistId) => artistId !== id),
      );
    }
  };

  const handleDeleteArtists = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedArtistIds.length} artist(s)?`,
      )
    ) {
      return;
    }

    try {
      const deletePromises = selectedArtistIds.map((id) =>
        api.delete(`/api/admin/artist/deleteArtist/${id}`),
      );

      await Promise.all(deletePromises);

      if (activeTab === "admin") {
        fetchAdminArtists();
      } else {
        fetchArtists();
      }
      setSelectedArtistIds([]);
      showAlert({
        type: "success",
        title: "Deleted",
        message: "Artist(s) deleted successfully!",
      });
    } catch (err) {
      console.error("Failed to delete artists:", err);
      showAlert({
        type: "error",
        title: "Error",
        message: "Failed to delete some artists. Please try again.",
      });
    }
  };

  const handleEditArtist = () => {
    if (selectedArtistIds.length !== 1) return;
    const artistId = selectedArtistIds[0];
    const sourceList = activeTab === "admin" ? adminArtists : artists;
    const artist = sourceList.find((a) => a.id === artistId);
    if (artist) {
      setArtistToEdit(artist);
      setShowEditModal(true);
    }
  };

  // Count new artists added today
  const today = new Date().toISOString().split("T")[0];
  const newArtistsCount = artists.filter(
    (artist) => artist.createdAt && artist.createdAt.split("T")[0] === today,
  ).length;

  return (
    <div className="space-y-6">
      {/* Tabs */}
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Artists Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">
                  Total Artists
                </p>
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-gray-900">
                {artists.length}
              </p>
            </div>

            {/* New Artists Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">New Today</p>
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-gray-900">
                {newArtistsCount}
              </p>
            </div>

            {/* Verified Artists Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Verified</p>
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-gray-900">
                {artists.filter(isVerified).length}
              </p>
            </div>
          </div>

          {/* Artists Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Artists Filter Bar */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <FilterDropdown
                  options={PREDEFINED_ROLES}
                  value={selectedRole}
                  onChange={setSelectedRole}
                  placeholder="All Roles"
                  icon={Filter}
                />

                <FilterDropdown
                  options={BIHAR_DISTRICTS}
                  value={selectedDistrict}
                  onChange={setSelectedDistrict}
                  placeholder="All Districts"
                  icon={MapPin}
                />

                <DownloadExcel
                  data={filteredArtists}
                  fileName="artist_directory"
                  buttonLabel="Export"
                />

                <button
                  onClick={fetchArtists}
                  className="p-2 text-sm font-medium hover:bg-gray-100 text-gray-600 bg-white border border-gray-200 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCcw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
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
                    onClick={() => setSelectedStatus("unverified")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      selectedStatus === "unverified"
                        ? "bg-white text-red-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Un-Verified
                  </button>
                </div>

                <div className="text-sm text-gray-500 ml-auto lg:ml-2 whitespace-nowrap">
                  {filteredArtists.length} Found
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedArtistIds.length > 0 && (
                  <button
                    onClick={handleDeleteArtists}
                    className="px-4 py-2 text-sm font-medium hover:bg-red-50 text-red-600 bg-white border border-red-100 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedArtistIds.length})
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="p-6">
                <div className="space-y-3 animate-pulse">
                  <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-5 py-3 text-left">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-[#891737] focus:ring-[#891737]"
                          checked={
                            filteredArtists.length > 0 &&
                            selectedArtistIds.length === filteredArtists.length
                          }
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Artist
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredArtists.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-5 py-12 text-center">
                          <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <AlertCircle className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500">
                            No artists found
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Try adjusting your search or add a new artist
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredArtists.map((artist, idx) => (
                        <tr
                          key={artist.id || idx}
                          className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                            selectedArtistIds.includes(artist.id)
                              ? "bg-gray-50"
                              : ""
                          }`}
                          onClick={() => setSelectedArtist(artist)}
                        >
                          <td
                            className="px-5 py-3.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-[#891737] focus:ring-[#891737]"
                              checked={selectedArtistIds.includes(artist.id)}
                              onChange={(e) => handleSelectArtist(e, artist.id)}
                            />
                          </td>
                          <td className="px-5 py-3.5 text-xs font-medium text-gray-900">
                            {idx + 1}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  artist.image ||
                                  "https://via.placeholder.com/40"
                                }
                                alt={artist.fullName}
                                className="w-10 h-10 rounded-full object-cover border border-gray-100"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {artist.fullName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {artist.gender || "Artist"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                              {typeof artist.role === "object"
                                ? artist.role?.name
                                : artist.role}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex flex-col text-xs text-gray-600">
                              <span>{artist.email}</span>
                              <span className="text-gray-400">
                                {artist.phoneNumber}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-600">
                            {typeof artist.district === "object"
                              ? artist.district?.name
                              : artist.district}
                          </td>
                          <td className="px-5 py-3.5">
                            {isVerified(artist) ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-100">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Un-Verified
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                            {artist.createdAt
                              ? new Date(artist.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* ADMIN VIEW */
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <h3 className="text-base font-semibold text-gray-900 mr-2 whitespace-nowrap">
                Master Registry
              </h3>

              <FilterDropdown
                options={PREDEFINED_ROLES}
                value={selectedRole}
                onChange={setSelectedRole}
                placeholder="All Roles"
                icon={Filter}
              />

              <FilterDropdown
                options={BIHAR_DISTRICTS}
                value={selectedDistrict}
                onChange={setSelectedDistrict}
                placeholder="All Districts"
                icon={MapPin}
              />

              <button
                onClick={fetchAdminArtists}
                className="p-2 text-sm font-medium hover:bg-gray-100 text-gray-600 bg-white border border-gray-200 rounded-lg transition-colors"
                title="Refresh Registry"
              >
                <RefreshCcw
                  className={`w-4 h-4 ${adminLoading ? "animate-spin" : ""}`}
                />
              </button>

              <div className="text-sm text-gray-500 ml-auto lg:ml-2 whitespace-nowrap">
                {filteredAdminArtists.length} Found
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedArtistIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDeleteArtists}
                    className="p-2 text-sm font-medium hover:bg-red-50 text-red-600 bg-white border border-red-100 rounded-lg transition-colors"
                    title="Delete Selected"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {selectedArtistIds.length === 1 && (
                    <button
                      onClick={handleEditArtist}
                      className="p-2 text-sm font-medium hover:bg-blue-50 text-blue-600 bg-white border border-blue-100 rounded-lg transition-colors"
                      title="Edit Selected"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
              <div className="h-6 w-px bg-gray-200 mx-1 hidden lg:block"></div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#891737] hover:bg-[#891737]/90 rounded-lg transition-colors whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                Add Artist
              </button>
            </div>
          </div>

          {adminLoading ? (
            <div className="p-12 text-center">
              <div className="space-y-3 animate-pulse max-w-md mx-auto">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-5 py-3 text-left">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-[#891737] focus:ring-[#891737]"
                          checked={
                            filteredAdminArtists.length > 0 &&
                            selectedArtistIds.length ===
                              filteredAdminArtists.length
                          }
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Artist
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAdminArtists.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-5 py-12 text-center">
                          <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <AlertCircle className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500">
                            No artists found in registry
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredAdminArtists.map((artist, idx) => (
                        <tr
                          key={artist.id || idx}
                          className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                            selectedArtistIds.includes(artist.id)
                              ? "bg-gray-50"
                              : ""
                          }`}
                          onClick={() => setSelectedArtist(artist)}
                        >
                          <td
                            className="px-5 py-3.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-[#891737] focus:ring-[#891737]"
                              checked={selectedArtistIds.includes(artist.id)}
                              onChange={(e) => handleSelectArtist(e, artist.id)}
                            />
                          </td>
                          <td className="px-5 py-3.5 text-xs font-medium text-gray-900">
                            {idx + 1}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  artist.image ||
                                  "https://via.placeholder.com/40"
                                }
                                alt={artist.fullName}
                                className="w-10 h-10 rounded-full object-cover border border-gray-100"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {artist.fullName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {artist.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
                              {typeof artist.role === "object"
                                ? artist.role?.name
                                : artist.role}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-600">
                            {artist.phoneNumber}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-600">
                            {typeof artist.district === "object"
                              ? artist.district?.name
                              : artist.district}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Registry
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                            {artist.createdAt
                              ? new Date(artist.createdAt).toLocaleDateString()
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

      {/* Artist Details Modal */}
      {selectedArtist && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl flex flex-col max-h-[90vh] border border-gray-100">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  Artist Profile
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">
                    ID: {selectedArtist.id}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-xs text-gray-500">
                    Member since{" "}
                    {new Date(selectedArtist.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
              <button
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-all text-gray-400 hover:text-gray-600"
                onClick={() => setSelectedArtist(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-0 border-t border-gray-50">
              {/* Hero Banner Area */}
              <div className="relative">
                <div className="h-32 w-full overflow-hidden rounded-t-2xl">
                  <img
                    src="/newBannerArtist.jpg"
                    alt="Artist Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="absolute -bottom-12 left-8 rounded-2xl shadow-sm z-10 transition-transform hover:scale-105">
                  <img
                    src={
                      selectedArtist.image || "https://via.placeholder.com/96"
                    }
                    alt={selectedArtist.fullName}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                </div>
              </div>

              <div className="pt-16 px-8 pb-8 space-y-8">
                {/* Basic Info & Socials */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedArtist.fullName}
                      </h3>
                      {isVerified(selectedArtist) && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-100 uppercase tracking-wider">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <span className="font-medium text-[#891737]">
                        {typeof selectedArtist.role === "object"
                          ? selectedArtist.role?.name
                          : selectedArtist.role}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span>{selectedArtist.gender || "Artist"}</span>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center gap-3">
                    {[
                      {
                        icon: FaImdb,
                        url: selectedArtist.imdbLink,
                        color: "hover:text-[#F5C518]",
                      },
                      {
                        icon: Instagram,
                        url: selectedArtist.instagram,
                        color: "hover:text-[#E4405F]",
                      },
                      {
                        icon: Facebook,
                        url: selectedArtist.facebook,
                        color: "hover:text-[#1877F2]",
                      },
                      {
                        icon: Twitter,
                        url: selectedArtist.twitter,
                        color: "hover:text-[#1DA1F2]",
                      },
                      {
                        icon: Linkedin,
                        url: selectedArtist.linkedIn,
                        color: "hover:text-[#0A66C2]",
                      },
                    ].map(
                      (social, i) =>
                        social.url && (
                          <a
                            key={i}
                            href={social.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`text-gray-400 transition-all ${social.color} hover:scale-110`}
                          >
                            <social.icon size={20} />
                          </a>
                        ),
                    )}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 p-6 bg-gray-50/30 rounded-2xl">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Email
                    </p>
                    <p className="text-sm font-medium text-gray-900 break-all">
                      {selectedArtist.email || selectedArtist.emailId}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Phone
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedArtist.phoneNumber}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Location
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {typeof selectedArtist.district === "object"
                        ? selectedArtist.district?.name
                        : selectedArtist.district}
                      , Bihar
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Age
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedArtist.dob ? (
                        <>
                          {(() => {
                            const birthDate = new Date(selectedArtist.dob);
                            const today = new Date();
                            let age =
                              today.getFullYear() - birthDate.getFullYear();
                            const m = today.getMonth() - birthDate.getMonth();
                            if (
                              m < 0 ||
                              (m === 0 && today.getDate() < birthDate.getDate())
                            ) {
                              age--;
                            }
                            return age;
                          })()}{" "}
                          Years
                        </>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {(selectedArtist.description || selectedArtist.bestFilm) && (
                  <div className="space-y-4">
                    {selectedArtist.description && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <div className="w-1 h-3 rounded-full bg-[#891737]"></div>
                          Professional Summary
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-gray-100 pl-4 py-1">
                          "{selectedArtist.description}"
                        </p>
                      </div>
                    )}
                    {selectedArtist.bestFilm && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Bio Data
                        </h4>
                        <a
                          href={selectedArtist.bestFilm}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-[#891737] rounded-xl border border-gray-100 transition-all group shadow-sm"
                        >
                          <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-semibold">
                            View Bio Document
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Expertise Badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {selectedArtist.professions?.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Professions
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedArtist.professions.map((p, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold"
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedArtist.specializations?.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Specializations
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedArtist.specializations.map((s, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-[#891737]/5 text-[#891737] rounded-lg text-xs font-semibold"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Experience Timeline */}
                {selectedArtist.experiences?.length > 0 && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Work Experience
                    </h4>
                    <div className="space-y-6 border-l border-gray-100 ml-2">
                      {selectedArtist.experiences.map((exp, i) => (
                        <div key={i} className="relative pl-8 group">
                          <div className="absolute left-0 top-1.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-white bg-gray-300 group-hover:bg-[#891737] transition-colors"></div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-4">
                              <h5 className="text-sm font-bold text-gray-900 group-hover:text-[#891737] transition-colors">
                                {exp.filmTitle}
                              </h5>
                              <span className="text-[10px] font-bold text-gray-400">
                                {exp.durationFrom
                                  ? new Date(exp.durationFrom).getFullYear()
                                  : ""}{" "}
                                -{" "}
                                {exp.durationTo
                                  ? new Date(exp.durationTo).getFullYear()
                                  : "Present"}
                              </span>
                            </div>
                            <p className="text-xs text-[#891737]/70 font-semibold uppercase tracking-wide">
                              {exp.roleInFilm}
                            </p>
                            <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                              {exp.description}
                            </p>
                            {exp.awards && (
                              <div className="pt-1 flex items-center gap-1.5 text-[10px] font-bold text-amber-600">
                                {exp.awards}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Media Gallery */}
                {(selectedArtist.images?.length > 0 ||
                  selectedArtist.videos?.length > 0) && (
                  <div className="space-y-8 pt-4 border-t border-gray-50">
                    {selectedArtist.images?.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Photo Gallery
                        </h4>
                        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                          {selectedArtist.images.map((img, i) => (
                            <div
                              key={i}
                              className="shrink-0 w-44 h-44 rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
                            >
                              <img
                                src={img.url}
                                alt={`Gallery ${i}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedArtist.videos?.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Video Portfolio
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedArtist.videos.map((vid, i) => {
                            const thumbnail = getVideoThumbnail(vid.url);
                            return (
                              <a
                                key={i}
                                href={vid.url}
                                target="_blank"
                                rel="noreferrer"
                                className="group block overflow-hidden rounded-xl border border-gray-100 hover:border-[#891737]/30 transition-all hover:shadow-md"
                              >
                                <div className="relative aspect-video bg-gray-100">
                                  {thumbnail ? (
                                    <img
                                      src={thumbnail}
                                      alt={`Video ${i + 1} thumbnail`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        // Fallback to default thumbnail if image fails to load
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5IDE4QzQuOSAxOCA0IDE3LjEgNCAxNlY0QzQgMi45IDQuOSAyIDYgMkg5QzEwLjEgMiAxMSAyLjkgMTEgNFY2SDR2MTBjMCAuNTUuMiAxIC41IDEuNWwxIDFoN2wxLTEgVjYuNVoiIGZpbGw9IiM5Q0E0QUYiLz4KPC9zdmc+';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                      <PlayCircle className="w-12 h-12 text-gray-400" />
                                    </div>
                                  )}
                                  {/* Play overlay */}
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
                                  </div>
                                </div>
                                <div className="p-3 bg-white">
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Video {i + 1}
                                  </p>
                                  <p className="text-sm font-medium text-gray-700 truncate mt-1">
                                    {vid.title || 'Untitled Video'}
                                  </p>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-gray-100 flex items-center gap-4 bg-white shrink-0">
              {isVerified(selectedArtist) ? (
                <button
                  onClick={() => handleUnverify(selectedArtist.id)}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-red-600 border border-red-200 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center"
                >
                  Unverify Artist
                </button>
              ) : (
                <button
                  onClick={() => handleVerify(selectedArtist.id)}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#891737] hover:bg-[#70122d] rounded-xl transition-all flex items-center justify-center"
                >
                  Verify Artist Profile
                </button>
              )}
              <div className="w-px h-8 bg-gray-100"></div>
              <button
                onClick={() => setSelectedArtist(null)}
                className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Artist Modal */}
      {showAddModal && (
        <AddArtistForm
          onClose={() => {
            setShowAddModal(false);
            if (activeTab === "admin") fetchAdminArtists();
            else fetchArtists();
          }}
        />
      )}

      {showEditModal && (
        <AddArtistForm
          isEditMode={true}
          initialData={artistToEdit}
          onClose={() => {
            setShowEditModal(false);
            setArtistToEdit(null);
            if (activeTab === "admin") fetchAdminArtists();
            else fetchArtists();
            setSelectedArtistIds([]);
          }}
        />
      )}

      {/* Custom Alert Box */}
      <AlertBox
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        showCancel={alertConfig.showCancel}
        onConfirm={alertConfig.onConfirm}
      />
    </div>
  );
};

export default Artist;
