import React, { useEffect, useState, useMemo } from "react";
import api from "../Components/axios";
import {
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  Search,
  Filter,
  Clock,
  Download,
  X,
  Info,
  RefreshCcw,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import UniversalFormModal from "./UniversalFormModal";
import ApplicationDetailsModal from "./ApplicationDetailsModal";
import PartialGuideImg from "../../public/partial_forms_guide.png";

const computeLatestDepartments = (events) => {
  const latestByDept = {};
  for (const e of events) {
    if (e.officeType !== "DEPARTMENT") continue;
    if (!latestByDept[e.officeId] || e.id > latestByDept[e.officeId].id) {
      latestByDept[e.officeId] = e;
    }
  }
  return Object.values(latestByDept);
};

const computeOverallStatus = (rows, appStatus) => {
  const mainStatus = appStatus?.toUpperCase();

  // 1. If Master says Approved/Rejected/Final Approved, trust it.
  if (["APPROVED", "FINAL_APPROVED", "ACCEPTED"].includes(mainStatus)) {
    return "APPROVED";
  }
  if (mainStatus === "REJECTED") return "REJECTED";

  // 2. Check Department Details
  if (!rows || rows.length === 0) return "SUBMITTED";

  // If any department rejected, show REJECTED (even if master hasn't updated yet)
  if (rows.some((r) => r.status === "REJECTED")) return "REJECTED";

  // If master is not Approved/Rejected, then it is Processing
  return "FORWARDED";
};

const FilmmakerOverview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationData, setApplicationData] = useState([]);
  const [timelines, setTimelines] = useState({}); // Stores { application: {}, timeline: [] } per appId
  const [showModal, setShowModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [modalTab, setModalTab] = useState("basic");

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAppForDetails, setSelectedAppForDetails] = useState(null);
  const [detailedApplication, setDetailedApplication] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState(new Set());

  // 1. Fetch List of Applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setSelectedIds(new Set()); // Clear selection on refresh
      setTimelines({}); // Clear timelines to force re-fetch and show fresh data
      const appResponse = await api.get("/api/applications/my");
      if (appResponse.data.success) {
        const data = appResponse.data.data;
        setApplicationData(Array.isArray(data) ? data : [data]);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to load applications.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [navigate]);

  // 2. Fetch Timeline for each Application
  useEffect(() => {
    const fetchTimelines = async () => {
      if (!applicationData?.length) return;

      const newTimelines = {};
      await Promise.all(
        applicationData.map(async (app) => {
          const appId = app.applicationId || app.id || app._id;
          if (!appId) return;

          try {
            const res = await api.get(
              `/api/applicationTimeline/applications/${appId}/timeline`,
            );
            if (res.data.success) {
              newTimelines[appId] = res.data; // Store full response { application, timeline }
            }
          } catch (err) {
            console.error(`Failed to fetch timeline for app ${appId}`, err);
          }
        }),
      );
      setTimelines(newTimelines);
    };

    fetchTimelines();
  }, [applicationData]);

  // Helper: Status Badge Color
  const getBadgeColor = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-200";
      case "ACCEPTED":
        return "bg-green-100 text-green-700 border-green-200";

      case "SUBMITTED":
        return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      case "PROCESSING":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "FORWARDED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Helper: Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchApplicationDetails = async (appId) => {
    try {
      setLoadingDetails(true);
      setDetailedApplication(null);
      const res = await api.get(`/api/applications/my/${appId}`);
      if (res.data.success) {
        setDetailedApplication(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching detailed application:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // 3. Calculate Stats
  const stats = useMemo(() => {
    const counts = {
      total: applicationData.length,
      approved: 0,
      pending: 0,
      rejected: 0,
    };

    applicationData.forEach((appItem) => {
      const appId = appItem.applicationId || appItem.id || appItem._id;
      const timelineData = timelines[appId];
      const appDetails = timelineData?.application || appItem;
      const events = timelineData?.timeline || [];
      const departments = computeLatestDepartments(events);
      const overallStatus = computeOverallStatus(
        departments,
        appDetails.status,
      );

      if (overallStatus === "APPROVED") counts.approved++;
      else if (overallStatus === "REJECTED") counts.rejected++;
      else counts.pending++;
    });

    return counts;
  }, [applicationData, timelines]);

  // 4. Filter Applications
  const filteredApplications = useMemo(() => {
    if (activeTab === "ALL") return applicationData;

    return applicationData.filter((appItem) => {
      const appId = appItem.applicationId || appItem.id || appItem._id;
      const timelineData = timelines[appId];
      const appDetails = timelineData?.application || appItem;
      const events = timelineData?.timeline || [];
      const departments = computeLatestDepartments(events);
      const overallStatus = computeOverallStatus(
        departments,
        appDetails.status,
      );

      return overallStatus === activeTab;
    });
  }, [applicationData, timelines, activeTab]);

  // Selection Helpers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredApplications.length) {
      setSelectedIds(new Set());
    } else {
      const allIds = new Set(
        filteredApplications.map(
          (app) => app.applicationId || app.id || app._id,
        ),
      );
      setSelectedIds(allIds);
    }
  };

  const toggleSelectRow = (id, e) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  if (loading && applicationData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin text-rose-700">
          <Clock size={32} />
        </div>
        <p className="text-gray-500 mt-4 text-xs">Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 text-rose-700 rounded-lg border border-rose-200 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Shooting Permission Request
        </h2>

        {/* Legends */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-green-600" />
            <span>Approved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-blue-600" />
            <span>Processing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />
            <span>Pending</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Applications"
          value={stats.total}
          icon={<FileText size={20} />}
          colorClass="text-indigo-600"
          bgClass="bg-indigo-50/50"
          borderClass="hover:border-indigo-100"
        />
        <StatCard
          label="Approved"
          value={stats.approved}
          icon={<CheckCircle2 size={20} />}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50/50"
          borderClass="hover:border-emerald-100"
        />
        <StatCard
          label="Pending / Processing"
          value={stats.pending}
          icon={<Clock size={20} />}
          colorClass="text-amber-600"
          bgClass="bg-amber-50/50"
          borderClass="hover:border-amber-100"
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          icon={<XCircle size={20} />}
          colorClass="text-rose-600"
          bgClass="bg-rose-50/50"
          borderClass="hover:border-rose-100"
        />
      </div>

      {/* Filter Chips & Refresh */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center flex-wrap gap-2">
          {[
            { label: "All Applications", value: "ALL" },
            { label: "Pending", value: "FORWARDED" },
            { label: "Approved", value: "APPROVED" },
            { label: "Rejected", value: "REJECTED" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setSelectedIds(new Set());
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                activeTab === tab.value
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={fetchApplications}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all border border-gray-200 bg-white shadow-sm disabled:opacity-50"
          title="Refresh Table"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 text-center">
          <p className="text-gray-400 text-sm">
            No applications found in this category.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-10 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    checked={
                      filteredApplications.length > 0 &&
                      selectedIds.size === filteredApplications.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">
                  Application ID
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">
                  Last Updated
                </th>
                <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider text-xs">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">
                  Current Stage
                </th>
                <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider text-xs">
                  Letter
                </th>
                <th className="px-6 py-4 text-end font-medium text-gray-500 uppercase tracking-wider text-xs">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApplications.map((appItem) => {
                const appId =
                  appItem.applicationId || appItem.id || appItem._id;
                const timelineData = timelines[appId];

                const appDetails = timelineData?.application || appItem;
                const events = timelineData?.timeline || [];

                const departments = computeLatestDepartments(events);
                const overallStatus = computeOverallStatus(
                  departments,
                  appDetails.status,
                );

                const rejectedDept = departments.find(
                  (d) => d.status === "REJECTED",
                );

                return (
                  <React.Fragment key={appId}>
                    {/* MAIN ROW */}
                    <tr
                      className={`transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${
                        selectedIds.has(appId)
                          ? "bg-rose-50/30"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSelectedAppForDetails({
                          appItem,
                          appDetails,
                          departments,
                          overallStatus,
                        });
                        setModalTab("basic");
                        setIsDetailsModalOpen(true);
                        fetchApplicationDetails(appId);
                      }}
                    >
                      <td className="px-6 py-3 text-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                          checked={selectedIds.has(appId)}
                          onChange={(e) => toggleSelectRow(appId, e)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-6 py-3 font-semibold text-gray-700 text-sm">
                        {appDetails.applicationNumber}
                      </td>
                      <td className="px-6 py-3 text-gray-500 text-xs">
                        {formatDate(
                          appDetails.updatedAt || appDetails.createdAt,
                        )}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {(() => {
                          const forms = appItem.forms || appDetails.forms || {};
                          const progress =
                            appItem.progress || appDetails.progress || {};

                          const isAnnexure1Done =
                            progress.annexureOneCompleted ||
                            !!forms.annexureOne;
                          const isAnnexure2Done =
                            progress.nocFormCompleted || !!forms.nocForm;
                          const isUndertakingDone =
                            progress.undertakingUploaded || !!forms.undertaking;

                          // Check Annexure A using progress.annexureAFilledOrNot boolean flag
                          const isAnnexureADone =
                            progress.annexureAFilledOrNot === true;

                          const isDocumentsUploaded =
                            progress.nocDocumentsSubmitted === true;

                          const allDone =
                            isAnnexure1Done &&
                            isAnnexure2Done &&
                            isAnnexureADone &&
                            isUndertakingDone &&
                            isDocumentsUploaded;

                          if (allDone) {
                            return (
                              <div className="flex flex-col items-center gap-1.5">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full border text-[10px] font-medium uppercase tracking-wide inline-block ${getBadgeColor(
                                    appDetails.status,
                                  )}`}
                                >
                                  {appDetails.status || "SUBMITTED"}
                                </span>
                                {/* Existing progress bar logic for submitted apps */}
                                {[
                                  "PROCESSING",
                                  "FORWARDED",
                                  "REJECTED",
                                ].includes(appDetails.status?.toUpperCase()) &&
                                  departments.length > 0 && (
                                    <div className="w-24 group relative">
                                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
                                        {departments.map((dept, i) => {
                                          let color = "bg-gray-300";
                                          if (
                                            ["APPROVED", "ACCEPTED"].includes(
                                              dept.status,
                                            )
                                          )
                                            color = "bg-green-500";
                                          if (dept.status === "REJECTED")
                                            color = "bg-red-500";
                                          return (
                                            <div
                                              key={i}
                                              className={`h-full flex-1 ${color} border-r border-white last:border-0`}
                                            />
                                          );
                                        })}
                                      </div>
                                      <div className="text-[9px] text-gray-400 mt-0.5 font-medium">
                                        {
                                          departments.filter((d) =>
                                            ["APPROVED", "ACCEPTED"].includes(
                                              d.status,
                                            ),
                                          ).length
                                        }
                                        /{departments.length} Approved
                                      </div>
                                    </div>
                                  )}

                                {/* Comment Peeking */}
                                {(() => {
                                  const relevantDept =
                                    appDetails.status === "REJECTED"
                                      ? departments.find(
                                          (d) => d.status === "REJECTED",
                                        )
                                      : departments[0]; // Or latest updated

                                  if (relevantDept?.remarks) {
                                    return (
                                      <div className="absolute top-0 right-0 -mr-2 -mt-2 group/comment">
                                        <div className="bg-white p-1 rounded-full shadow-sm border border-gray-100 cursor-help">
                                          <MessageSquare
                                            size={10}
                                            className="text-gray-400"
                                          />
                                        </div>
                                        <div className="hidden group-hover/comment:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-[10px] p-2 rounded-lg shadow-xl z-50">
                                          <div className="font-semibold mb-0.5 text-gray-300">
                                            {relevantDept.officeName}:
                                          </div>
                                          "{relevantDept.remarks}"
                                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            );
                          } else {
                            // Detailed Breakdown
                            const statusList = [
                              { name: "Documents", done: isDocumentsUploaded },
                              { name: "Annexure 1", done: isAnnexure1Done },
                              { name: "Annexure 2", done: isAnnexure2Done },
                              { name: "Annexure A", done: isAnnexureADone },
                              { name: "Undertaking", done: isUndertakingDone },
                            ];

                            return (
                              <div className="flex flex-col gap-1 items-start w-full max-w-[140px] mx-auto">
                                {statusList.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1.5 w-full"
                                  >
                                    {item.done ? (
                                      <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded-full text-[9px] text-green-700 font-medium border border-green-100 w-full">
                                        <CheckCircle2
                                          size={10}
                                          strokeWidth={2.5}
                                        />
                                        <span className="truncate">
                                          {item.name}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded-full text-[9px] text-gray-500 font-medium border border-gray-200 w-full opacity-70">
                                        <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
                                        <span className="truncate">
                                          {item.name}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            );
                          }
                        })()}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          {(() => {
                            if (
                              timelineData?.application?.finalApproval
                                ?.completed &&
                              timelineData?.application?.finalApproval
                                ?.isApproved
                            ) {
                              return (
                                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                  <CheckCircle2 size={12} /> NOC Permission
                                  Granted
                                </span>
                              );
                            }

                            if (appDetails.status === "APPROVED")
                              return (
                                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                  <CheckCircle2 size={12} /> All Stages Cleared
                                </span>
                              );

                            // Find pending, approved, and rejected departments
                            const pendingDepts = departments.filter(
                              (d) =>
                                !["APPROVED", "ACCEPTED", "REJECTED"].includes(
                                  d.status,
                                ),
                            );
                            const approvedDepts = departments.filter((d) =>
                              ["APPROVED", "ACCEPTED"].includes(d.status),
                            );
                            const rejectedDepts = departments.filter(
                              (d) => d.status === "REJECTED",
                            );

                            if (
                              pendingDepts.length > 0 ||
                              approvedDepts.length > 0 ||
                              rejectedDepts.length > 0
                            ) {
                              return (
                                <div className="flex flex-col gap-1">
                                  {rejectedDepts.map((d, i) => (
                                    <span
                                      key={`rej-${i}`}
                                      className="text-xs text-red-600 font-medium border border-red-100 bg-red-50 px-2 py-0.5 rounded-md flex items-center gap-1"
                                    >
                                      <XCircle size={10} /> Rejected by{" "}
                                      {d.officeName}
                                    </span>
                                  ))}
                                  {approvedDepts.map((d, i) => (
                                    <span
                                      key={`app-${i}`}
                                      className="text-xs text-green-600 font-medium border border-green-100 bg-green-50 px-2 py-0.5 rounded-md flex items-center gap-1"
                                    >
                                      <CheckCircle2 size={10} /> {d.officeName}
                                    </span>
                                  ))}
                                  {pendingDepts.slice(0, 1).map((dept, i) => (
                                    <span
                                      key={`pend-${i}`}
                                      className="text-xs text-indigo-600 font-medium border border-indigo-100 bg-indigo-50 px-2 py-0.5 rounded-md"
                                    >
                                      Pending with {dept.officeName || "Dept"}
                                    </span>
                                  ))}
                                  {pendingDepts.length > 1 && (
                                    <span className="text-[10px] text-gray-400">
                                      +{pendingDepts.length - 1} more
                                    </span>
                                  )}
                                </div>
                              );
                            }
                            return (
                              <span className="text-xs text-gray-400">
                                Initial Review
                              </span>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        {appDetails.forwardedLetterUrl ? (
                          <a
                            href={appDetails.forwardedLetterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rose-600 font-bold text-xs hover:underline flex items-center justify-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileText size={14} />
                            VIEW NOC
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs font-semibold">
                            NA
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                            title="View Details"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppForDetails({
                                appItem,
                                appDetails,
                                departments,
                                overallStatus,
                              });
                              setModalTab("basic");
                              setIsDetailsModalOpen(true);
                              fetchApplicationDetails(appId);
                            }}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                            title="Download Application"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detailed Status Check & Information Section */}
      <div className="mt-8 overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <h4 className="text-[13px] font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
            <Info size={16} className="text-rose-600" />
            Application Processing Guide
          </h4>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Column 1: Understanding Status Types */}
          <div className="space-y-6">
            <h5 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">
              Status Codes Explained
            </h5>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="shrink-0 px-2.5 py-0.5 rounded-full border border-green-200 bg-green-100 text-green-700 text-[9px] font-bold h-fit mt-1">
                  APPROVED
                </span>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  Verified and cleared by the specific department. All
                  departments must approve for final NOC.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="shrink-0 px-2.5 py-0.5 rounded-full border border-green-200 bg-green-100 text-green-700 text-[9px] font-bold h-fit mt-1">
                  SUBMITTED
                </span>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  All forms (Annexure 1, 2, A, Undertaking) are properly filled
                  and submitted. Your application is now with the admin for
                  initial review.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="shrink-0 px-2.5 py-0.5 rounded-full border border-blue-200 bg-blue-100 text-blue-700 text-[9px] font-bold h-fit mt-1">
                  PENDING
                </span>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  Currently under review by the department's nodal officer. No
                  action required.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="shrink-0 px-2.5 py-0.5 rounded-full border border-red-200 bg-red-100 text-red-700 text-[9px] font-bold h-fit mt-1">
                  REJECTED
                </span>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  Rejected by a specific department. Check "Current Stage" or
                  details for the exact reason.
                </p>
              </div>

              {/* New Partial Information Section */}
              <div className="pt-4 border-t border-gray-50">
                <h6 className="text-[11px] font-bold text-gray-600 mb-2">
                  Partial Information (Action Required)
                </h6>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                  If a checklist appears in the status column as shown below, it
                  indicates that{" "}
                  <strong className="underline text-gray-700">
                    all required forms have not yet been completed
                  </strong>
                  . To successfully submit your application, you must fill out
                  all four forms: Annexure 1, Annexure 2, Annexure A, and the
                  Undertaking.
                </p>
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 inline-block">
                  <img
                    src={PartialGuideImg}
                    alt="Partial Status Example"
                    className="h-auto w-48 rounded shadow-sm opacity-90"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Dashboard Features & Support */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h5 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">
                New Timeline System
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-700">
                    <CheckCircle2 size={14} className="text-green-500" />{" "}
                    Multi-Dept Tracking
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Track approvals individually. See which departments have
                    cleared your request and which are pending.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-700">
                    <FileText size={14} className="text-blue-500" /> Documents
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Download forwarded letters or NOCs directly from the
                    timeline as soon as they are issued by a department.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 DETAILS MODAL - Refactored to separate component */}
      <ApplicationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        data={
          detailedApplication
            ? {
                ...detailedApplication,
                finalApproval:
                  timelines[
                    detailedApplication.applicationId ||
                      detailedApplication.id ||
                      detailedApplication._id
                  ]?.application?.finalApproval,
              }
            : null
        }
        loading={loadingDetails}
      />
    </div>
  );
};

const StatCard = ({ label, value, icon, colorClass, bgClass, borderClass }) => (
  <div
    className={`bg-white p-5 border border-gray-100 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group ${borderClass}`}
  >
    <div className="flex items-start justify-between">
      <div className="space-y-3">
        <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest">
          {label}
        </p>
        <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
          {value}
        </h3>
      </div>
      <div
        className={`p-3 rounded-xl transition-colors duration-300 ${bgClass} ${colorClass} group-hover:scale-110 transform`}
      >
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <div className="h-1 w-8 rounded-full bg-gray-100 group-hover:bg-current transition-colors duration-500 opacity-20"></div>
    </div>
  </div>
);

export default FilmmakerOverview;
