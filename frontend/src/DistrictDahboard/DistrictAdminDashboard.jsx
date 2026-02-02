import { useEffect, useState } from "react";
import axios from "axios";
import api from "../Components/axios";
import {
  User,
  MapPin,
  Badge,
  Calendar,
  LogOut,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  ChevronDown,
  AlertCircle,
  Loader2,
} from "lucide-react";
import UniversalFormModal from "../Dashboard/UniversalFormModal";

function DistrictAdminDashboard() {
  const [forwardedForms, setForwardedForms] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [formsLoading, setFormsLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [formsError, setFormsError] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionRemarks, setActionRemarks] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    // Ensure token has proper Bearer prefix
    const bearerToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    return {
      Authorization: bearerToken,
      "Content-Type": "application/json",
    };
  };

  // Helper function to validate token before making requests
  const validateToken = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      showNotification(
        "error",
        "Authentication token not found. Please login again."
      );
      setTimeout(() => {
        window.location.href = "/district-login";
      }, 2000);
      return false;
    }

    // Check if user has district_admin role
    if (currentUser && currentUser.role !== "district_admin") {
      showNotification(
        "error",
        "Access denied. District admin privileges required."
      );
      return false;
    }

    return true;
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength = 25) => {
    if (!text) return "N/A";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout API failed:", error);
    }
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  // Show notification helper
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 5000);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest("#userDropdown") &&
        !event.target.closest("#avatarButton")
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
          setProfileError("Please login to view data.");
          window.location.href = "/district-login";
          return;
        }

        // Ensure proper Bearer token format
        const bearerToken = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;

        const userResponse = await axios.get(
          "https://bsfdfcbackend.onrender.com/api/auth/profile",
          {
            headers: {
              Authorization: bearerToken,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (!userResponse.data.success) {
          throw new Error("Failed to fetch user profile");
        }

        const user = userResponse.data.user;
        setCurrentUser(user);
        setProfileError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          setProfileError("Session expired. Please login again.");
          localStorage.removeItem("authToken");
          window.location.href = "/district-login";
        } else {
          setProfileError("Failed to load profile.");
        }
        console.error("Failed to fetch user profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchForwardedForms = async () => {
      if (!currentUser || profileError) {
        return;
      }

      try {
        setFormsLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
          setFormsError("Authentication required.");
          return;
        }

        const districtId = currentUser.districtId;

        if (!districtId) {
          setFormsError("No district assigned to your account.");
          return;
        }

        const formsResponse = await axios.get(
          `https://bsfdfcbackend.onrender.com/api/noc/district/${districtId}/forms`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setForwardedForms(formsResponse.data.data || []);
        setFormsError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          setFormsError("Session expired. Please login again.");
          localStorage.removeItem("authToken");
          window.location.href = "/district-login";
        } else if (err.response?.status === 403) {
          setFormsError(
            "Access denied. You don't have permission to view forms for this district."
          );
        } else {
          setFormsError(
            "Failed to load forwarded forms. Please try refreshing the page."
          );
        }
        console.error("Failed to fetch forwarded forms:", err);
      } finally {
        setFormsLoading(false);
      }
    };

    fetchForwardedForms();
  }, [currentUser, profileError]);

  // Update the handleApprove function
  const handleApprove = async (formId) => {
    if (!validateToken()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authToken");

      console.log("Attempting to approve with:", {
        formId,
        userId: currentUser.id,
        userName: currentUser.name,
        role: currentUser.role,
        districtName: currentUser.districtName,
        hasDistrictId: !!currentUser.districtId,
      });

      const response = await axios.put(
        `https://bsfdfcbackend.onrender.com/api/noc/districtAction/${formId}`,
        {
          action: "approve",
          remarks: "Approved by district admin",
          // Remove districtId and districtAdminId if backend doesn't need them
          // The backend should get this info from the JWT token
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        showNotification("success", "Application approved successfully!");
        setShowConfirmModal(false);
        setSelectedForm(null);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showNotification(
          "error",
          response.data.message || "Failed to approve form."
        );
      }
    } catch (error) {
      console.error("Error approving form:", error);
      console.error("Full error response:", error.response?.data);

      let errorMessage = "Failed to approve form. ";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage =
            "Authentication failed: " +
            (error.response.data?.message || "Please login again");
        } else if (error.response.status === 403) {
          errorMessage =
            "Access denied: " +
            (error.response.data?.message || "Insufficient permissions");
        } else {
          errorMessage +=
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
        }
      } else {
        errorMessage += error.message;
      }

      showNotification("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the handleReject function
  const handleReject = async (formId) => {
    if (!actionRemarks.trim()) {
      showNotification("error", "Please provide remarks for rejection.");
      return;
    }

    if (actionRemarks.trim().length < 10) {
      showNotification("error", "Remarks must be at least 10 characters long.");
      return;
    }

    if (!validateToken()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authToken");

      console.log("Attempting to reject with:", {
        formId,
        userId: currentUser.id,
        userName: currentUser.name,
        role: currentUser.role,
        districtName: currentUser.districtName,
        remarksLength: actionRemarks.length,
      });

      const response = await axios.put(
        `https://bsfdfcbackend.onrender.com/api/noc/districtAction/${formId}`,
        {
          action: "reject",
          remarks: actionRemarks,
          // Remove districtId and districtAdminId if backend doesn't need them
          // The backend should get this info from the JWT token
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        showNotification("success", "Application rejected successfully!");
        setShowRejectModal(false);
        setActionRemarks("");
        setSelectedForm(null);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showNotification(
          "error",
          response.data.message || "Failed to reject form."
        );
      }
    } catch (error) {
      console.error("Error rejecting form:", error);
      console.error("Full error response:", error.response?.data);

      let errorMessage = "Failed to reject form. ";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage =
            "Authentication failed: " +
            (error.response.data?.message || "Please login again");
        } else if (error.response.status === 403) {
          errorMessage =
            "Access denied: " +
            (error.response.data?.message || "Insufficient permissions");
        } else {
          errorMessage +=
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
        }
      } else {
        errorMessage += error.message;
      }

      showNotification("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const retryFetchForms = () => {
    if (currentUser) {
      setFormsError(null);
      setForwardedForms([]);
      setCurrentUser({ ...currentUser });
    }
  };

  const openApproveModal = (e, form) => {
    e.stopPropagation();
    setSelectedForm(form);
    setShowConfirmModal(true);
  };

  const openRejectModal = (e, form) => {
    e.stopPropagation();
    setSelectedForm(form);
    setActionRemarks("");
    setShowRejectModal(true);
  };

  const handleRowClick = (form) => {
    setSelectedForm(form);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedForm(null);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedForm(null);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setActionRemarks("");
    setSelectedForm(null);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#802d44]" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (profileError && !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-center font-medium">{profileError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-md rounded-lg shadow-lg p-4 flex items-center gap-3 animate-slide-in ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          )}
          <p
            className={`text-sm font-medium ${
              notification.type === "success"
                ? "text-green-800"
                : "text-red-800"
            }`}
          >
            {notification.message}
          </p>
          <button
            onClick={() =>
              setNotification({ show: false, type: "", message: "" })
            }
            className="ml-auto"
          >
            <XCircle
              className={`h-4 w-4 ${
                notification.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center">
                  <img src="/Logo1.png" alt="BSFDFC" className="h-8" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Bihar State Film Development and Finance Corporation
                  </h1>
                  <p className="text-xs text-gray-400">
                    District Application Management Dashboard
                  </p>
                </div>
              </div>
            </div>

            {currentUser && (
              <div className="relative flex items-center space-x-4">
                <div className="text-right text-xs text-gray-500">
                  <p className="font-medium">
                    {new Date().toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="relative">
                  <button
                    id="avatarButton"
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-expanded={showDropdown}
                  >
                    <div className="w-10 h-10 bg-[#802d44] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg uppercase">
                        {currentUser.districtName
                          ? currentUser.districtName.charAt(0)
                          : "D"}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-500 transition-transform ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showDropdown && (
                    <div
                      id="userDropdown"
                      className="absolute right-0 top-full mt-2 w-56 bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <div className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">{currentUser.name}</div>
                        <div className="truncate text-gray-500">
                          {currentUser.role?.replace("_", " ").toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {currentUser.email || "No email provided"}
                        </div>
                      </div>

                      <ul className="py-2 text-sm text-gray-700">
                        <li>
                          <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 transition-colors">
                            <User className="h-4 w-4 mr-3 text-gray-500" />
                            Dashboard
                          </button>
                        </li>
                        <li>
                          <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 transition-colors">
                            <Badge className="h-4 w-4 mr-3 text-gray-500" />
                            District ID: {currentUser.districtId}
                          </button>
                        </li>
                        <li>
                          <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 transition-colors">
                            <MapPin className="h-4 w-4 mr-3 text-gray-500 whitespace-nowrap" />
                            {currentUser.districtName || "N/A"}
                          </button>
                        </li>
                      </ul>

                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3 text-gray-500" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            NOC Application Management
          </h2>
          <div className="flex items-center text-sm text-gray-400 mb-4">
            <span>Showing {forwardedForms.length} applications </span>
            {currentUser?.districtName && (
              <>
                <span className="mx-1">for</span>
                <span className="font-medium text-gray-500">
                  {currentUser.districtName} District
                </span>
              </>
            )}
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                Select Status
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                <Calendar className="h-4 w-4 mr-2" />
                Select Date Range
              </button>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 text-sm focus:ring-2 focus:ring-[#802d44] focus:border-[#802d44]"
                />
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
              </div>
              <button className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                Reset Filters
              </button>
              <button className="flex items-center px-4 py-2 bg-[#802d44] text-white rounded-lg text-sm hover:bg-[#6b2438] transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Download Excel
              </button>
            </div>
          </div>
        </div>

        {/* Forms Section */}
        <div className="bg-white border border-gray-200 rounded-lg">
          {formsLoading && (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#802d44]" />
              <p className="text-gray-500">Loading applications...</p>
            </div>
          )}

          {formsError && !formsLoading && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <div className="text-red-600 mb-4">{formsError}</div>
                <button
                  onClick={retryFetchForms}
                  className="flex items-center mx-auto px-4 py-2 bg-[#4f0419] text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Loading
                </button>
              </div>
            </div>
          )}

          {!formsLoading && !formsError && forwardedForms.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No applications found for your district.
              </p>
            </div>
          )}

          {!formsLoading && !formsError && forwardedForms.length > 0 && (
            <div className="overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      SR. NO
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      APPLICANT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      PROJECT TITLE
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      LOCATION
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      SUBMITTED DATE
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      PENDING DAYS
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      STATUS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {forwardedForms.map((form, index) => {
                    const forwardedDate = form.forwardedAt
                      ? new Date(form.forwardedAt)
                      : new Date();
                    const pendingDays = Math.floor(
                      (new Date() - forwardedDate) / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <tr
                        key={form.id}
                        onClick={() => handleRowClick(form)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {truncateText(form.producerHouse, 25)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs" title={form.title}>
                            {truncateText(form.title, 30)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-[200px]" title={form.location}>
                            {truncateText(form.location, 25)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {forwardedDate.toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              pendingDays > 30
                                ? "bg-red-100 text-red-800"
                                : pendingDays > 15
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {pendingDays} days
                          </span>
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {form.status === "forwarded" ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => openApproveModal(e, form)}
                                className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Accept
                              </button>
                              <button
                                onClick={(e) => openRejectModal(e, form)}
                                className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                form.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {form.status === "approved" && (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              )}
                              {form.status === "rejected" && (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {form.status.charAt(0).toUpperCase() +
                                form.status.slice(1)}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Universal Form Modal */}
      <UniversalFormModal
        isOpen={showModal}
        onClose={closeModal}
        selectedRow={selectedForm}
        userRole="district_admin"
        onApprove={(form) => {
          setSelectedForm(form);
          setShowModal(false);
          setShowConfirmModal(true);
        }}
        onReject={(form) => {
          setSelectedForm(form);
          setShowModal(false);
          setShowRejectModal(true);
        }}
        showActions={true}
      />

      {/* Confirm Approval Modal */}
      {showConfirmModal && selectedForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Approve Application?
              </h3>

              <p className="text-sm text-gray-600 text-center mb-4">
                Are you sure you want to approve this NOC application?
              </p>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Application ID:</span> NOC-
                  {selectedForm.id}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Title:</span>{" "}
                  {selectedForm.title}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Applicant:</span>{" "}
                  {selectedForm.producerHouse}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeConfirmModal}
                  className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApprove(selectedForm.id)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Confirm Approval
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  Reject Application
                </h3>
                <button
                  onClick={closeRejectModal}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  disabled={isSubmitting}
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Application ID:</span> NOC-
                  {selectedForm.id}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Title:</span>{" "}
                  {selectedForm.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Applicant:</span>{" "}
                  {selectedForm.producerHouse}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 font-normal ml-2">
                    (Minimum 10 characters)
                  </span>
                </label>
                <textarea
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  rows="4"
                  placeholder="Please provide detailed reason for rejecting this application..."
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {actionRemarks.length} characters
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeRejectModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedForm.id)}
                  disabled={isSubmitting || actionRemarks.trim().length < 10}
                  className="px-4 py-2 bg-[#4f0419] text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      Confirm Rejection
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default DistrictAdminDashboard;
