import React, { useEffect, useState } from "react";
import api from "../Components/axios";
import {
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  Search,
  Filter,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import UniversalFormModal from "./UniversalFormModal";

const FilmmakerOverview = ({ nocList: propNocList = [] }) => {
  const [nocList, setNocList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [applicationData, setApplicationData] = useState([]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const navigate = useNavigate();

  // Fetch NOCs and Producer Registrations
  // States for Producer Registration
  const [producerRegistration, setProducerRegistration] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Application Details
        try {
          const appResponse = await api.get("/api/applications/my");
          console.log("✅ RAW Application Response:", appResponse);

          if (appResponse.data.success) {
            const data = appResponse.data.data;
            if (Array.isArray(data)) {
              setApplicationData(data);
            } else if (data && typeof data === "object") {
              setApplicationData([data]);
            }
          } else {
            console.error("API returned success: false", appResponse.data);
          }
        } catch (appErr) {
          console.error(
            "❌ CRITICAL: Could not fetch application details:",
            appErr,
          );
        }

        // First get the user ID from auth endpoint
        let userId = null;
        try {
          const authResponse = await api.get("/api/auth/me");
          if (authResponse.data.success && authResponse.data.user) {
            userId = authResponse.data.user._id || authResponse.data.user.id;
            console.log("✅ User ID fetched:", userId);
          }
        } catch (authErr) {
          console.error("❌ Error fetching user ID:", authErr);
          // If we can't get the user, we can't get the registration
        }

        if (userId) {
          const prodResponse = await api.get(
            `/api/producer-registration/getProducerRegistrationFormById/${userId}`,
          );
          console.log("✅ Producer Registration fetched:", prodResponse.data);

          if (prodResponse.data.success && prodResponse.data.data) {
            setProducerRegistration(prodResponse.data.data);
          } else {
            setProducerRegistration(null);
          }
        }
      } catch (err) {
        console.error("❌ Error fetching data:", err);

        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          setTimeout(() => navigate("/login"), 2000);
        } else if (err.response?.status === 403) {
          setError("You don't have permission to view this data.");
        } else if (err.response?.status === 404) {
          // Ignore 404 for individual endpoints if one fails but other succeeds,
          // but here we are fetching both. Let's assume empty if 404.
          // Ideally handle separately, but for now this is fine.
        } else {
          setError(
            err.response?.data?.message ||
              "Failed to fetch data. Please try again later.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Fetch Timelines for all applications
  const [timelines, setTimelines] = useState({});

  useEffect(() => {
    const fetchTimelines = async () => {
      if (!applicationData || applicationData.length === 0) return;

      const newTimelines = {};
      await Promise.all(
        applicationData.map(async (app) => {
          // Use fallback ID strategy to ensure we get a valid ID
          const appId = app.applicationId || app.id || app._id;
          if (!appId) return;

          console.log(`🚀 Fetching timeline for App ID: ${appId}`);

          try {
            // GET /api/applications/:id/timeline
            const res = await api.get(`/api/applications/${appId}/timeline`);

            console.log(`✅ API Response for App ${appId}:`, res.data);

            // Based on User's JSON: { success: true, timeline: [...] }
            // We'll support both res.data.timeline or res.data.data just in case, but prioritize the user's structure.
            if (res.data.success) {
              const timelineData = res.data.timeline || res.data.data || [];
              newTimelines[appId] = Array.isArray(timelineData)
                ? timelineData
                : [];
            } else {
              console.warn(
                `⚠️ API success false or missing data for App ${appId}`,
              );
            }
          } catch (err) {
            console.error(`❌ Failed to fetch timeline for app ${appId}`, err);
          }
        }),
      );
      setTimelines(newTimelines);
    };

    fetchTimelines();
  }, [applicationData]);

  // Filter logic
  const filteredNocList = nocList.filter((noc) => {
    const matchesSearch =
      noc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      noc.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      noc.typeOfProject?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || noc.status === statusFilter;
    const matchesType =
      typeFilter === "all" || noc.typeOfProject === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate statistics
  const total = applicationData.length;
  const approved = applicationData.filter(
    (app) => app.status?.toLowerCase() === "approved",
  ).length;

  // Get Latest Application Number
  const latestApp =
    applicationData.length > 0
      ? [...applicationData].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )[0]
      : null;
  const latestApplicationNumber = latestApp
    ? latestApp.applicationNumber || latestApp.id || "N/A"
    : "N/A";

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "under_review":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "submitted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "forwarded":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Get status display name
  const getStatusDisplayName = (status) => {
    switch (status?.toLowerCase()) {
      case "under_review":
        return "Under Review";
      case "submitted":
        return "Submitted";
      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();
    }
  };

  // Format Step Label (e.g. ANNEXURE_ONE_SUBMITTED -> Annexure 1 Submitted)
  const formatStepLabel = (stepRaw) => {
    if (!stepRaw) return "Unknown Step";

    // Handle known complex patterns first
    if (stepRaw.includes("FORWARDED_TO_DISTRICT")) {
      return stepRaw.replace("FORWARDED_TO_DISTRICT", "Forwarded to District");
    }
    if (stepRaw.includes("FORWARDED_TO_DEPARTMENT")) {
      return stepRaw.replace(
        "FORWARDED_TO_DEPARTMENT",
        "Forwarded to Department",
      );
    }

    // General Case: Replace underscores with spaces and Title Case
    let label = stepRaw.replace(/_/g, " ").toLowerCase();
    // Specific fixes for better look
    label = label.replace("annexure one", "Annexure 1");
    label = label.replace("annexure two", "Annexure 2");
    label = label.replace("noc form", "NOC Form");

    // Title Case
    return label.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleRowClick = (noc) => {
    setSelectedForm(noc);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedForm(null);
  };

  // Get unique project types for filter
  const projectTypes = [
    ...new Set(applicationData.map((noc) => noc.typeOfProject).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 rounded-lg">
        <div className="flex flex-row gap-2">
          <div className="animate-pulse bg-gray-300 w-14 h-14 rounded-lg"></div>
          <div className="flex flex-col gap-2">
            <div className="animate-pulse bg-gray-300 w-28 h-5 rounded-lg"></div>
            <div className="animate-pulse bg-gray-300 w-36 h-3 rounded-lg"></div>
            <div className="animate-pulse bg-gray-300 w-36 h-2 rounded-lg"></div>
          </div>
        </div>

        <p className="text-gray-600 font-medium pt-10">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-700">Overview</h2>
            <p className="text-gray-500 text-xs mt-1">
              Track your NOC applications and registrations
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Applied */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Total Applications
            </p>
            <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center">
              <FileText className="text-gray-600" size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{total}</h3>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Approved
            </p>
            <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-green-700">{approved}</h3>
        </div>

        {/* Application Number */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Application Number
            </p>
            <div className="w-8 h-8 rounded bg-purple-50 flex items-center justify-center">
              <FileText className="text-purple-600" size={16} />
            </div>
          </div>
          <h3
            className="text-lg font-bold text-purple-700 truncate"
            title={latestApplicationNumber}
          >
            {latestApplicationNumber}
          </h3>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Application History
        </h3>

        {applicationData.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
            <div className="mb-3 flex justify-center">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <FileText className="text-gray-400" size={24} />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-1">
              No Applications Found
            </h3>
            <p className="text-gray-400 max-w-sm mx-auto text-xs">
              Start a new application from the sidebar to see your progress
              here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {applicationData.map((app) => {
              // Use fallback ID strategy
              const appId = app.applicationId || app.id || app._id;

              const timeline = timelines[appId] || [];

              // Sort by date (Newest first)
              const sortedTimeline = [...timeline].sort((a, b) => {
                if (!a.at) return 1;
                if (!b.at) return -1;
                return new Date(b.at) - new Date(a.at);
              });

              return (
                <div
                  key={appId}
                  className="bg-white rounded-lg border border-gray-200 p-5 transition-colors"
                >
                  {/* Card Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-[#891737]" size={18} />
                        {app.projectTitle || "Untitled Project"}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                        <span className="font-mono bg-gray-50 px-2 py-0.5 rounded text-gray-600 border border-gray-200">
                          {app.applicationNumber || app.id}
                        </span>
                        <span>•</span>
                        <span>Started: {formatDate(app.createdAt)}</span>
                      </p>
                    </div>
                    <div className="mt-3 md:mt-0 flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold border ${getStatusColor(
                          app.status,
                        )}`}
                      >
                        {getStatusDisplayName(app.status)}
                      </span>
                      <button
                        onClick={() => handleRowClick(app)}
                        className="text-gray-400 hover:text-[#891737] transition-colors p-1.5 hover:bg-gray-50 rounded-md"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Vertical Timeline */}
                  <div className="relative pl-2 md:pl-4">
                    {/* Vertical Line */}
                    <div className="absolute top-0 bottom-0 left-[21px] md:left-[29px] w-px bg-gray-200"></div>

                    {sortedTimeline.length > 0 ? (
                      <div className="space-y-6">
                        {sortedTimeline.map((event, idx) => (
                          <div
                            key={idx}
                            className="relative flex items-start group"
                          >
                            {/* Icon Bubble */}
                            <div
                              className={`relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white flex items-center justify-center flex-shrink-0 bg-white`}
                            >
                              <div
                                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border ${
                                  idx === 0
                                    ? "bg-[#891737] border-[#891737] text-white"
                                    : "bg-gray-50 border-gray-200 text-gray-400"
                                } transition-colors duration-300`}
                              >
                                {idx === 0 ? (
                                  <Clock size={16} />
                                ) : (
                                  <CheckCircle2 size={16} />
                                )}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="ml-5 md:ml-6 mt-0.5 flex-1">
                              <div className="flex flex-col md:flex-row justify-between md:items-start gap-1">
                                <h5
                                  className={`text-sm font-semibold ${idx === 0 ? "text-gray-800" : "text-gray-600"}`}
                                >
                                  {formatStepLabel(event.step)}
                                </h5>
                                {event.at && (
                                  <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1 whitespace-nowrap bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                    <Clock size={10} />
                                    {new Date(event.at).toLocaleString(
                                      "en-IN",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      },
                                    )}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                {event.step?.toLowerCase().includes("forwarded")
                                  ? "Forwarded to concerned department."
                                  : "Completed."}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 pl-12 text-gray-400 text-xs italic flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
                          <Search size={14} />
                        </div>
                        <p>No timeline history available yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmmakerOverview;
