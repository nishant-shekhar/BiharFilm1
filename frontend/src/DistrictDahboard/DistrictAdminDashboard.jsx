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
import AlertBox from "../Components/AlertBox";

function DistrictAdminDashboard({ userDetails }) {
  const [forwardedForms, setForwardedForms] = useState([]);
  const [profileLoading, setProfileLoading] = useState(!userDetails);
  const [formsLoading, setFormsLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [formsError, setFormsError] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionType, setDecisionType] = useState("approve"); // 'approve' or 'reject'
  const [decisionRemarks, setDecisionRemarks] = useState("");
  const [decisionFile, setDecisionFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(userDetails || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // Helper function to validate token before making requests
  // Kept for logic flow but now relies on currentUser set via API
  const validateAuth = () => {
    if (!currentUser) {
      showNotification("error", "User not authenticated. Please login.");
      setTimeout(() => {
        window.location.href = "/district-login";
      }, 2000);
      return false;
    }

    if (!["district_admin", "department_admin"].includes(currentUser.role)) {
      showNotification("error", "Access denied. Admin privileges required.");
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
    window.location.href = "/district-login";
  };

  // Show notification helper using AlertBox
  const showNotification = (type, message, title = "System Notification") => {
    setAlertConfig({
      isOpen: true,
      type,
      title,
      message,
    });
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
    if (userDetails) {
      setCurrentUser(userDetails);
      setProfileLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        // Using api instance which includes cookies automatically
        const userResponse = await api.get("/api/auth/profile");

        if (!userResponse.data.success) {
          throw new Error("Failed to fetch user profile");
        }

        const user = userResponse.data.user;
        setCurrentUser(user);
        setProfileError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          setProfileError("Session expired. Please login again.");
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
  }, [userDetails]);

  useEffect(() => {
    const fetchForwardedForms = async () => {
      if (!currentUser || profileError) {
        return;
      }

      try {
        setFormsLoading(true);
        let endpoint = "";

        if (currentUser.role === "department_admin") {
          endpoint = "/api/department/applications";
        } else if (currentUser.role === "district_admin") {
          endpoint = "/api/district/applications";
        } else {
          setFormsError("Invalid user role for this dashboard.");
          return;
        }

        const formsResponse = await api.get(endpoint);
        let formsData = formsResponse.data.data || [];

        // Normalize data for department_admin role
        if (currentUser.role === "department_admin") {
          formsData = formsData.map((item) => {
            const app = item.application || {};
            return {
              ...app,
              // Map dashboard specific fields from high-detail nested objects
              producerHouse:
                app.filmmaker?.producerRegistration?.productionCompanyName ||
                "N/A",
              title:
                app.annexureOne?.titleOfProject ||
                app.nocForm?.title ||
                "Untitled Project",
              location: app.nocForm?.annexureA?.[0]?.location || "N/A",
              // Use the actual application ID for consistency
              id: app.id,
              // Keep original department-specific timing/status if needed
              forwardedAt: item.forwardedAt || app.createdAt,
              status:
                item.permissionStatus?.toLowerCase() ||
                app.status?.toLowerCase(),
            };
          });
        }

        setForwardedForms(formsData);
        setFormsError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          setFormsError("Session expired. Please login again.");
          window.location.href = "/district-login";
        } else if (err.response?.status === 403) {
          setFormsError(
            "Access denied. You don't have permission to view forms.",
          );
        } else {
          setFormsError(
            "Failed to load applications. Please try refreshing the page.",
          );
        }
        console.error("Failed to fetch forms:", err);
      } finally {
        setFormsLoading(false);
      }
    };

    fetchForwardedForms();
  }, [currentUser, profileError]);

  // NEW Unified Decision Handler for Department Admins
  const handleDecisionSubmit = async (e) => {
    e.preventDefault();

    if (decisionType === "reject" && !decisionRemarks.trim()) {
      showNotification(
        "error",
        "Remarks are mandatory for rejection.",
        "Action Required",
      );
      return;
    }

    if (!validateAuth()) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append(
        "decision",
        decisionType === "approve" ? "ACCEPTED" : "REJECTED",
      );
      formData.append("remarks", decisionRemarks.trim());
      if (decisionFile) {
        formData.append("forwardedLetterFile", decisionFile);
      }

      const response = await api.post(
        `/api/department/applications/${selectedForm.id}/decision`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.data.success) {
        showNotification(
          "success",
          `Application has been successfully ${decisionType === "approve" ? "approved" : "rejected"}.`,
          "Success",
        );
        closeDecisionModal();
        closeModal();
        // Refresh cases count
        setTimeout(() => window.location.reload(), 2000);
      } else {
        showNotification(
          "error",
          response.data.message || "Failed to process decision.",
          "Error",
        );
      }
    } catch (error) {
      console.error("❌ Decision Submission Error:", error);
      showNotification(
        "error",
        error.response?.data?.message ||
          "Network error while processing decision.",
        "System Error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDecisionModal = (type, form) => {
    setDecisionType(type);
    setSelectedForm(form);
    setDecisionRemarks("");
    setDecisionFile(null);
    setShowDecisionModal(true);
  };

  const closeDecisionModal = () => {
    setShowDecisionModal(false);
    setDecisionRemarks("");
    setDecisionFile(null);
  };

  const handleRowClick = (form) => {
    setSelectedForm(form);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
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
      {/* Notification Toast - Removed as we are using AlertBox now */}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Branding */}
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
              <div className="hidden sm:flex w-10 h-10 bg-gray-50 rounded-lg items-center justify-center border border-gray-200 flex-shrink-0">
                <img
                  src="/Logo1.png"
                  alt="BSFDFC"
                  className="h-7 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight truncate leading-tight">
                  BSFDFC Dashboard
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-widest">
                  {currentUser.role?.replace("_", " ")}
                </p>
              </div>
            </div>

            {/* Actions & User */}
            {currentUser && (
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="hidden md:flex flex-col text-right border-r border-gray-100 pr-4">
                  <span className="text-xs font-bold text-gray-900 mb-0.5">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {currentUser.role?.replace("_", " ")}
                  </span>
                </div>

                <div className="relative">
                  <button
                    id="avatarButton"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-200"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#802d44] rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {currentUser.name?.[0]?.toUpperCase() || "D"}
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform duration-200 ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showDropdown && (
                    <div
                      id="userDropdown"
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg border border-gray-200 z-50 overflow-hidden"
                    >
                      <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Authenticated Account
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {currentUser.email}
                        </p>
                      </div>

                      <div className="p-1">
                        <div className="flex items-center gap-3 px-4 py-3 text-xs text-gray-500 font-bold uppercase tracking-widest">
                          <MapPin size={12} className="text-[#802d44]" />{" "}
                          {currentUser.departmentName || "N/A"}
                        </div>
                        <div className="border-t border-gray-100 mt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-600 uppercase tracking-widest hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={14} /> Sign Out System
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Applications Overview
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Welcome back. System shows{" "}
              {forwardedForms?.filter((f) => f.status === "forwarded")
                ?.length || 0}{" "}
              files awaiting action.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">
            <Calendar size={14} className="text-[#802d44]" />
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            })}
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            {
              label: "Total",
              count: forwardedForms.length,
              icon: FileText,
              color: "blue",
              bg: "bg-blue-50",
              text: "text-blue-600",
            },
            {
              label: "Pending",
              count: forwardedForms.filter((f) => f.status === "forwarded")
                .length,
              icon: Clock,
              color: "orange",
              bg: "bg-orange-50",
              text: "text-orange-600",
            },
            {
              label: "Approved",
              count: forwardedForms.filter((f) => f.status === "approved")
                .length,
              icon: CheckCircle,
              color: "green",
              bg: "bg-green-50",
              text: "text-green-600",
            },
            {
              label: "Rejected",
              count: forwardedForms.filter((f) => f.status === "rejected")
                .length,
              icon: XCircle,
              color: "red",
              bg: "bg-red-50",
              text: "text-red-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`${stat.bg} ${stat.text} p-2 rounded-lg`}>
                  <stat.icon size={18} className="sm:w-5 sm:h-5" />
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Live Status
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">
                  {stat.count}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-2 sm:p-3 mb-8">
          <div className="flex flex-col xl:flex-row justify-between gap-4">
            {/* Search - Primary Action */}
            <div className="flex-1 relative group max-w-2xl px-2 pt-2 xl:pt-0">
              <Search
                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#802d44] transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Search projects, filmmakers, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:border-[#802d44]/50 transition-all outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Filters & Tools */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-2 pb-2 xl:pb-0">
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
                  <Filter size={14} className="text-[#802d44]" />
                  <span>Status Filter</span>
                  <ChevronDown size={12} className="text-gray-400" />
                </button>
              </div>

              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
                  <Calendar size={14} className="text-[#802d44]" />
                  <span>Time Period</span>
                  <ChevronDown size={12} className="text-gray-400" />
                </button>
              </div>

              <div className="h-6 w-[1px] bg-gray-100 mx-1 hidden sm:block"></div>

              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2.5 text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
              >
                Reset
              </button>

              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#802d44] text-white rounded-lg text-xs font-bold hover:bg-[#6b2438] transition-all ml-auto xl:ml-0 uppercase tracking-widest">
                <Download size={14} />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Forms Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {formsLoading ? (
            <div className="flex flex-col items-center justify-center py-24 sm:py-32">
              <div className="w-12 h-12 border-2 border-gray-100 border-t-[#802d44] rounded-full animate-spin"></div>
              <p className="mt-6 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                Loading System Records...
              </p>
            </div>
          ) : formsError ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-lg flex items-center justify-center mb-6">
                <AlertCircle className="text-red-500" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Database Connection Error
              </h3>
              <p className="text-sm text-gray-400 mb-8 font-medium">
                {formsError}
              </p>
              <button
                onClick={retryFetchForms}
                className="flex items-center gap-2 px-8 py-2.5 bg-[#802d44] text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#6b2438] transition-all"
              >
                <RefreshCw size={14} /> Reconnect
              </button>
            </div>
          ) : forwardedForms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-200">
                <FileText size={40} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                No Applications Found
              </h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Current queue is empty
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Application ID
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Applicant / Producer
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Project Details
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Submitted
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Pending From
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {forwardedForms.map((form, index) => {
                      const forwardedDate = form.forwardedAt
                        ? new Date(form.forwardedAt)
                        : new Date();
                      const pendingDays = Math.floor(
                        (new Date() - forwardedDate) / (1000 * 60 * 60 * 24),
                      );

                      return (
                        <tr
                          key={form.id || index}
                          onClick={() => handleRowClick(form)}
                          className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="text-[11px] font-bold text-gray-400">
                              {form.applicationNumber || "NA"}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-gray-900 leading-tight">
                                  {truncateText(form.producerHouse, 25)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col max-w-xs">
                              <span
                                className="text-sm font-semibold text-gray-700 leading-tight truncate"
                                title={form.title}
                              >
                                {form.title}
                              </span>
                              <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                                <MapPin size={10} />
                                <span className="text-[10px] font-bold uppercase tracking-widest truncate">
                                  {truncateText(form.location, 20)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="text-xs font-bold text-gray-600">
                              {forwardedDate.toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                                pendingDays > 30
                                  ? "bg-red-50 text-red-600 border-red-100"
                                  : pendingDays > 15
                                    ? "bg-orange-50 text-orange-600 border-orange-100"
                                    : "bg-green-50 text-green-600 border-green-100"
                              }`}
                            >
                              <Clock size={10} />
                              {pendingDays} Days
                            </div>
                          </td>
                          {/* <td
                            className="px-6 py-5 whitespace-nowrap text-right"
                            onClick={(e) => e.stopPropagation()}
                           >
                            {form.status === "forwarded" ? (
                              <button
                                onClick={() => handleApprove(form.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border bg-green-50 text-green-700 border-green-100"
                              >
                                <CheckCircle size={10} />
                                Approve
                              </button>
                            ) : (
                              <div
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                                  form.status === "approved"
                                    ? "bg-green-50 text-green-700 border-green-100"
                                    : "bg-red-50 text-red-700 border-red-100"
                                }`}
                              >
                                {form.status === "approved" ? (
                                  <CheckCircle size={10} />
                                ) : (
                                  <XCircle size={10} />
                                )}
                                {form.status}
                              </div>
                            )}
                          </td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View Fallback */}
              <div className="md:hidden divide-y divide-gray-100">
                {forwardedForms.map((form, index) => {
                  const forwardedDate = form.forwardedAt
                    ? new Date(form.forwardedAt)
                    : new Date();
                  const pendingDays = Math.floor(
                    (new Date() - forwardedDate) / (1000 * 60 * 60 * 24),
                  );

                  return (
                    <div
                      key={form.id || index}
                      onClick={() => handleRowClick(form)}
                      className="p-4 active:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 font-bold text-xs">
                            {form.producerHouse?.[0] || "A"}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">
                              {truncateText(form.producerHouse, 20)}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                              #FL-{String(index + 1).padStart(4, "0")}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-lg text-[9px] font-bold tracking-widest uppercase border ${
                            pendingDays > 15
                              ? "bg-red-50 text-red-600 border-red-100"
                              : "bg-green-50 text-green-600 border-green-100"
                          }`}
                        >
                          Pending From {pendingDays}d
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 line-clamp-1">
                          {form.title}
                        </p>
                      </div>

                      <div
                        className="flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {form.status === "forwarded" ? (
                          <div className="flex gap-2 w-full">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDecisionModal("approve", form);
                              }}
                              className="flex-1 border border-green-200 text-green-600 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest active:bg-green-600 active:text-white transition-all"
                            >
                              Approve
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDecisionModal("reject", form);
                              }}
                              className="flex-1 border border-red-200 text-red-600 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest active:bg-red-600 active:text-white transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div
                            className={`w-full text-center py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest border ${
                              form.status === "approved"
                                ? "bg-green-50 text-green-600 border-green-100"
                                : "bg-red-50 text-red-600 border-red-100"
                            }`}
                          >
                            {form.status}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Universal Form Modal */}
      <UniversalFormModal
        isOpen={showModal}
        onClose={closeModal}
        selectedRow={selectedForm}
        userRole="district_admin"
        onApprove={(form) => {
          openDecisionModal("approve", form);
        }}
        onReject={(form) => {
          openDecisionModal("reject", form);
        }}
        showActions={true}
      />

      {/* Unified Decision Modal (Approve/Reject) */}
      {showDecisionModal && selectedForm && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200 transition-all backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden transform animate-in zoom-in-95 duration-200">
            <form onSubmit={handleDecisionSubmit}>
              {/* Header */}
              <div
                className={`px-6 py-5 border-b flex items-center justify-between ${
                  decisionType === "approve"
                    ? "bg-green-50/50 border-green-100"
                    : "bg-red-50/50 border-red-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                      decisionType === "approve"
                        ? "bg-green-100 border-green-200 text-green-600"
                        : "bg-red-100 border-red-200 text-red-600"
                    }`}
                  >
                    {decisionType === "approve" ? (
                      <CheckCircle size={20} />
                    ) : (
                      <AlertCircle size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {decisionType === "approve"
                        ? "Approve Application"
                        : "Reject Application"}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {selectedForm.applicationNumber || "Notice of Change"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeDecisionModal}
                  className="text-gray-400 hover:text-gray-900 transition-colors p-1"
                >
                  <XCircle size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Application Details Summary */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Producer House
                    </span>
                    <span className="text-xs font-bold text-gray-900 truncate block">
                      {selectedForm.producerHouse}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Project Title
                    </span>
                    <span className="text-xs font-bold text-gray-700 truncate block">
                      {selectedForm.title}
                    </span>
                  </div>
                </div>

                {/* Remarks Field */}
                <div>
                  <label className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                    <span>
                      Remarks{" "}
                      {decisionType === "reject" ? "(Required)" : "(Optional)"}
                    </span>
                    {decisionRemarks.length > 0 && (
                      <span
                        className={
                          decisionType === "reject" &&
                          decisionRemarks.length < 5
                            ? "text-red-500"
                            : "text-green-600 animate-pulse"
                        }
                      >
                        {decisionRemarks.length} chars
                      </span>
                    )}
                  </label>
                  <textarea
                    value={decisionRemarks}
                    onChange={(e) => setDecisionRemarks(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#802d44]/10 focus:border-[#802d44] transition-all outline-none placeholder:text-gray-300 resize-none"
                    rows="4"
                    placeholder={
                      decisionType === "approve"
                        ? "Enter any approval notes (optional)..."
                        : "Explain the reason for rejection (required)..."
                    }
                    required={decisionType === "reject"}
                  />
                </div>

                {/* File Upload (Optional Forwarded Letter) */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Forwarded Letter / Official Order (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => setDecisionFile(e.target.files[0])}
                      className="hidden"
                      id="decision-file"
                    />
                    <label
                      htmlFor="decision-file"
                      className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 border-dashed rounded-lg cursor-pointer hover:border-[#802d44] hover:bg-[#802d44]/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#802d44] transition-colors">
                          <Download size={16} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700">
                          {decisionFile
                            ? decisionFile.name
                            : "Upload Scan/PDF (Max 5MB)"}
                        </span>
                      </div>
                      {decisionFile ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <FileText size={16} className="text-gray-300" />
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
                <button
                  type="button"
                  onClick={closeDecisionModal}
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-100 transition-all font-bold text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-[2] py-2.5 rounded-lg text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 ${
                    decisionType === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-[#802d44] hover:bg-[#6b2438]"
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      {decisionType === "approve"
                        ? "Finalize Approval"
                        : "Finalize Rejection"}
                      {decisionType === "approve" ? (
                        <Download size={14} />
                      ) : (
                        <AlertCircle size={14} />
                      )}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Alerts System */}
      <AlertBox
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </div>
  );
}

export default DistrictAdminDashboard;
