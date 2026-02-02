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
} from "lucide-react";
import AddArtistForm from "./AddArtistForm";
import { FaImdb } from "react-icons/fa";
import AlertBox from "../Components/AlertBox";

const Artist = ({ searchQuery }) => {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

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

  useEffect(() => {
    fetchArtists();
  }, []);

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
            artist.id === id ? { ...artist, ...updatedFields } : artist
          )
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
            artist.id === id ? { ...artist, ...updatedFields } : artist
          )
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

  const [filterType, setFilterType] = useState("all"); // 'all', 'verified', 'unverified'

  // Filter artists based on search query and status
  const filteredArtists = artists.filter((artist) => {
    // 1. Filter by status
    if (filterType === "verified" && !isVerified(artist)) return false;
    if (filterType === "unverified" && isVerified(artist)) return false;

    // 2. Filter by search query
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

  // Count new artists added today
  const today = new Date().toISOString().split("T")[0];
  const newArtistsCount = artists.filter(
    (artist) => artist.createdAt && artist.createdAt.split("T")[0] === today
  ).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Artists Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">Total Artists</p>
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

        {/* Add Artist Button Card */}
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[#891737] hover:bg-gray-50/50 transition-all text-left group"
        >
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-medium text-gray-500 group-hover:text-[#891737] transition-colors">
              Add New Artist
            </p>
            <div className="w-10 h-10 rounded-lg bg-[#891737] flex items-center justify-center group-hover:bg-[#891737]/90 transition-colors">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600">Register a new artist profile</p>
        </button>
      </div>

      {/* Artists Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Table Header with Filters */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Artists Directory
            </h2>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {filteredArtists.length}{" "}
              {filteredArtists.length === 1 ? "artist" : "artists"}
            </span>
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterType === "all"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("verified")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterType === "verified"
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Verified
            </button>
            <button
              onClick={() => setFilterType("unverified")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterType === "unverified"
                  ? "bg-white text-red-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Non-verified
            </button>
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
                    <td colSpan="7" className="px-5 py-12 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <AlertCircle className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">No artists found</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Try adjusting your search or add a new artist
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredArtists.map((artist, idx) => (
                    <tr
                      key={artist.id || idx}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedArtist(artist)}
                    >
                      <td className="px-5 py-3.5 text-xs font-medium text-gray-900">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              artist.image || "https://via.placeholder.com/40"
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
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
                            Pending
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

      {/* Artist Details Modal */}
      {selectedArtist && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Artist Profile
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Complete artist information
                </p>
              </div>
              <button
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                onClick={() => setSelectedArtist(null)}
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {/* Artist Header */}
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={selectedArtist.image || "https://via.placeholder.com/96"}
                  alt={selectedArtist.fullName}
                  className="w-24 h-24 rounded-lg object-cover border border-gray-100"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedArtist.fullName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-[#891737] font-medium">
                          {typeof selectedArtist.role === "object"
                            ? selectedArtist.role?.name
                            : selectedArtist.role}
                        </p>
                        {isVerified(selectedArtist) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-600 border border-green-100">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedArtist.imdbLink && (
                      <a
                        href={selectedArtist.imdbLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
                      >
                        <FaImdb size={20} className="text-gray-600" />
                      </a>
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
                        {selectedArtist.email}
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
                        {selectedArtist.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date of Birth</p>
                      <p className="text-xs text-gray-900">
                        {new Date(selectedArtist.dob).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-xs text-gray-900">
                        {typeof selectedArtist.district === "object"
                          ? selectedArtist.district?.name
                          : selectedArtist.district}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Film */}
              {selectedArtist.bestFilm && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center">
                      <Film className="w-4 h-4 text-[#891737]" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Best Film
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 pl-10">
                    {selectedArtist.bestFilm}
                  </p>
                </div>
              )}

              {/* Description */}
              {selectedArtist.description && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    About
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedArtist.description}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
              {isVerified(selectedArtist) ? (
                <button
                  onClick={() => handleUnverify(selectedArtist.id)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Unverify Artist
                </button>
              ) : (
                <button
                  onClick={() => handleVerify(selectedArtist.id)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Verify Artist
                </button>
              )}
              <button
                onClick={() => setSelectedArtist(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Artist Modal */}
      {showAddModal && <AddArtistForm onClose={() => setShowAddModal(false)} />}

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
