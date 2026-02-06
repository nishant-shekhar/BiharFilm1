import { useEffect, useState } from "react";
import api from "../Components/axios"; // ✅ Use your configured axios instance
import { FaShareAlt, FaTimes } from "react-icons/fa";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Send,
  AlertCircle,
  Filter,
  X,
} from "lucide-react";
import UniversalFormModal from "./UniversalFormModal";

// --- DATA CONSTANTS (With IDs for API) ---
const BIHAR_DISTRICTS = [
  { name: "Araria", id: "BR01ARA" },
  { name: "Arwal", id: "BR02ARW" },
  { name: "Aurangabad", id: "BR03AUR" },
  { name: "Banka", id: "BR04BAN" },
  { name: "Begusarai", id: "BR05BEG" },
  { name: "Bhagalpur", id: "BR06BHA" },
  { name: "Bhojpur", id: "BR07BHO" },
  { name: "Buxar", id: "BR08BUX" },
  { name: "Darbhanga", id: "BR09DAR" },
  { name: "East Champaran", id: "BR10EAS" },
  { name: "Gaya", id: "BR11GAY" },
  { name: "Gopalganj", id: "BR12GOP" },
  { name: "Jamui", id: "BR13JAM" },
  { name: "Jehanabad", id: "BR14JEH" },
  { name: "Kaimur", id: "BR15KAI" },
  { name: "Katihar", id: "BR16KAT" },
  { name: "Khagaria", id: "BR17KHA" },
  { name: "Kishanganj", id: "BR18KIS" },
  { name: "Lakhisarai", id: "BR19LAK" },
  { name: "Madhepura", id: "BR20MAD" },
  { name: "Madhubani", id: "BR21MDB" },
  { name: "Munger", id: "BR22MUN" },
  { name: "Muzaffarpur", id: "BR23MUZ" },
  { name: "Nalanda", id: "BR24NAL" },
  { name: "Nawada", id: "BR25NAW" },
  { name: "Patna", id: "BR26PAT" },
  { name: "Purnia", id: "BR27PUR" },
  { name: "Rohtas", id: "BR28ROH" },
  { name: "Saharsa", id: "BR29SAH" },
  { name: "Samastipur", id: "BR30SAM" },
  { name: "Saran", id: "BR31SAR" },
  { name: "Sheikhpura", id: "BR32SHE" },
  { name: "Sheohar", id: "BR33SHR" },
  { name: "Sitamarhi", id: "BR34SIT" },
  { name: "Siwan", id: "BR35SIW" },
  { name: "Supaul", id: "BR36SUP" },
  { name: "Vaishali", id: "BR37VAI" },
  { name: "West Champaran", id: "BR38WES" },
];

const DEPARTMENTS = [
  { name: "Agriculture Department, Bihar", id: "DEP01AGR" },
  { name: "Animal and Fisheries Resources Department, Bihar", id: "DEP02AFR" },
  {
    name: "Backward Classes & Extremely Backward Classes Welfare Department, Bihar",
    id: "DEP03BCE",
  },
  { name: "Building Construction Department, Bihar", id: "DEP04BCD" },
  { name: "Cabinet Secretariat Department, Bihar", id: "DEP05CSD" },
  { name: "Co-operative Department, Bihar", id: "DEP06COD" },
  { name: "Commercial Taxes Department, Bihar", id: "DEP07CTD" },
  { name: "Disaster Management Department, Bihar", id: "DEP08DMD" },
  { name: "Education Department, Bihar", id: "DEP09EDU" },
  { name: "Higher Education Department, Bihar", id: "DEP10HED" },
  { name: "Energy Department, Bihar", id: "DEP11ENE" },
  {
    name: "Environment, Forest & Climate Change Department, Bihar",
    id: "DEP12EFC",
  },
  { name: "Finance Department, Bihar", id: "DEP13FIN" },
  { name: "Food & Consumer Protection Department, Bihar", id: "DEP14FCP" },
  { name: "General Administration Department (GAD), Bihar", id: "DEP15GAD" },
  { name: "Health & Family Welfare Department, Bihar", id: "DEP16HFW" },
  { name: "Home Department, Bihar", id: "DEP17HOM" },
  { name: "Industries Department, Bihar", id: "DEP18IND" },
  { name: "Information & Public Relations Department, Bihar", id: "DEP19IPR" },
  { name: "Information Technology Department, Bihar", id: "DEP20ITD" },
  {
    name: "Labour Resources (Employment & Training) Department, Bihar",
    id: "DEP21LRE",
  },
  { name: "Law Department, Bihar", id: "DEP22LAW" },
  { name: "Mines & Geology Department, Bihar", id: "DEP23MGD" },
  { name: "Minor Water Resources Department, Bihar", id: "DEP24MWR" },
  { name: "Water Resources / Irrigation Department, Bihar", id: "DEP25WRD" },
  { name: "Minority Welfare Department, Bihar", id: "DEP26MWD" },
  { name: "Panchayati Raj Department, Bihar", id: "DEP27PRD" },
  { name: "Parliamentary Affairs Department, Bihar", id: "DEP28PAD" },
  { name: "Planning & Development Department, Bihar", id: "DEP29PDD" },
  {
    name: "Public Health Engineering Department (Water Supply & Sanitation), Bihar",
    id: "DEP30PHE",
  },
  { name: "Revenue & Land Reforms Department, Bihar", id: "DEP31RLR" },
  {
    name: "Road Construction / Public Works Department, Bihar",
    id: "DEP32RCD",
  },
  { name: "Rural Development Department, Bihar", id: "DEP33RDD" },
  {
    name: "Science, Technology & Technical Education Department, Bihar",
    id: "DEP34STT",
  },
  { name: "Social Welfare Department, Bihar", id: "DEP35SWD" },
  { name: "Sports, Art, Culture & Youth Department, Bihar", id: "DEP36SAC" },
  { name: "Tourism Department, Bihar", id: "DEP37TOU" },
  { name: "Transport Department, Bihar", id: "DEP38TRA" },
  { name: "Urban Development & Housing Department, Bihar", id: "DEP39UDH" },
  { name: "Vigilance Department, Bihar", id: "DEP40VIG" },
  {
    name: "Prohibition, Excise & Registration Department, Bihar",
    id: "DEP41PER",
  },
  {
    name: "Scheduled Castes & Scheduled Tribes Welfare Department, Bihar",
    id: "DEP42SCS",
  },
  { name: "Women & Child Development Department, Bihar", id: "DEP43WCD" },
  { name: "Sugarcane Industries Department, Bihar", id: "DEP44SID" },
  {
    name: "Co-operative Development Department / Cooperative Department (alternate listing)",
    id: "DEP45CDD",
  },
  {
    name: "Attached Directorates, Boards & Undertakings (e.g., BIADA, BCECEB, BSRTC etc.)",
    id: "DEP46ADB",
  },
];

function Dashboardactivity({ searchQuery }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Multi-select states
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  const [isForwarding, setIsForwarding] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // --- HELPER: Add/Remove Logic ---
  const handleAddDepartment = (e) => {
    const deptId = e.target.value; // ID is now string, e.g., "DEP01AGR"
    if (!deptId) return;

    const foundDept = DEPARTMENTS.find((d) => d.id === deptId);

    if (foundDept && !selectedDepartments.some((d) => d.id === foundDept.id)) {
      setSelectedDepartments([...selectedDepartments, foundDept]);
    }
    e.target.value = "";
  };

  const handleAddDistrict = (e) => {
    const distId = e.target.value; // ID is now string, e.g., "BR01ARA"
    if (!distId) return;

    const foundDist = BIHAR_DISTRICTS.find((d) => d.id === distId);
    if (foundDist && !selectedDistricts.some((d) => d.id === foundDist.id)) {
      setSelectedDistricts([...selectedDistricts, foundDist]);
    }
    e.target.value = "";
  };

  const removeDepartment = (id) => {
    setSelectedDepartments(selectedDepartments.filter((d) => d.id !== id));
  };

  const removeDistrict = (id) => {
    setSelectedDistricts(selectedDistricts.filter((d) => d.id !== id));
  };

  // --- FILTERING & SORTING LOGIC ---
  const filteredCases = cases
    .filter((item) => {
      // 1. Search Query (Application No, Producer, Email, Title)
      let matchesSearch = true;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        matchesSearch =
          item.applicationNumber?.toLowerCase().includes(query) ||
          item.filmmaker?.name?.toLowerCase().includes(query) ||
          item.filmmaker?.email?.toLowerCase().includes(query) ||
          item.annexureOne?.titleOfProject?.toLowerCase().includes(query) ||
          item.nocForm?.title?.toLowerCase().includes(query);
      }

      // 2. Status Filter
      let matchesStatus = true;
      if (statusFilter !== "all") {
        const status = item.status?.toLowerCase();
        switch (statusFilter) {
          case "submitted":
            matchesStatus = status === "submitted";
            break;
          case "forwarded":
            matchesStatus = status === "forwarded";
            break;
          case "pending":
            matchesStatus = status === "submitted" || status === "forwarded";
            break;
          case "approved":
            matchesStatus = status === "approved";
            break;
          case "rejected":
            matchesStatus = status === "rejected";
            break;
          default:
            matchesStatus = true;
        }
      }

      // 3. Date Filter
      let matchesDate = true;
      if (item.createdAt) {
        const caseDate = new Date(item.createdAt);
        if (dateFromFilter && caseDate < new Date(dateFromFilter))
          matchesDate = false;
        if (dateToFilter) {
          const toDate = new Date(dateToFilter);
          toDate.setHours(23, 59, 59, 999);
          if (caseDate > toDate) matchesDate = false;
        }
      } else if (dateFromFilter || dateToFilter) matchesDate = false;

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      // 4. PRIORITY SORTING: Pending (Submitted/Forwarded) first, then others
      const getPriority = (status) => {
        const s = status?.toLowerCase();
        if (s === "submitted") return 1;
        if (s === "forwarded") return 2;
        return 3;
      };

      const priorityA = getPriority(a.status);
      const priorityB = getPriority(b.status);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // Within same priority, newest first
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "forwarded":
        return {
          label: "Forwarded",
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Send className="h-3 w-3" />,
        };
      case "submitted":
        return {
          label: "New",
          color: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <AlertCircle className="h-3 w-3" />,
        };
      case "approved":
        return {
          label: "Approved",
          color: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle className="h-3 w-3" />,
        };
      case "rejected":
        return {
          label: "Rejected",
          color: "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle className="h-3 w-3" />,
        };
      case "finalapproved":
      case "final_approved":
        return {
          label: "Final Approved",
          color: "bg-teal-50 text-teal-700 border-teal-200",
          icon: <CheckCircle className="h-3 w-3" />,
        };
      default:
        return {
          label: status || "Unknown",
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: <AlertCircle className="h-3 w-3" />,
        };
    }
  };

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/adminApplication/allApplications");
        setCases(response.data.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch NOC forms:", err);
        setError("Unable to load applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRowClick = async (caseDetail) => {
    try {
      const response = await api.get(
        `/api/adminApplication/applications/${caseDetail.id}/details`,
      );
      if (response.data.success) {
        setSelectedRow(response.data.data);
        setShowModal(true);
      }
    } catch (error) {
      alert("Error loading details");
    }
  };

  const handleForwardClick = () => {
    setSelectedDepartments([]);
    setSelectedDistricts([]);
    setShowForwardModal(true);
  };

  const handleReject = async (formData) => {
    const remarks = prompt("Please provide remarks for rejection:");
    if (!remarks) return;

    try {
      const response = await api.put(`/api/noc/reject/${formData.id}`, {
        remarks,
      });
      if (response.data.success) {
        alert("Form rejected!");
        setShowModal(false);
        window.location.reload();
      }
    } catch (error) {
      alert("Error rejecting form.");
    }
  };

  // ✅ FIXED: Handle Forward with Correct API Structure
  const handleConfirmForward = async () => {
    if (!selectedRow) return;

    if (selectedDepartments.length === 0 && selectedDistricts.length === 0) {
      alert("Please select at least one Department or District.");
      return;
    }

    setIsForwarding(true);

    try {
      const payload = {
        districts: selectedDistricts.map((d) => ({
          districtId: d.id,
          districtName: d.name,
        })),
        departments: selectedDepartments.map((d) => ({
          departmentId: d.id,
          departmentName: d.name,
        })),
      };

      console.log("📤 Forwarding Payload:", payload);

      // ⚠️ IMPORTANT: Sending to the exact URL from your docs
      const response = await api.post(
        `/api/permissionRequest/applications/${selectedRow.id}/forward`,
        payload,
      );

      if (response.data.success) {
        alert("✅ Application forwarded successfully!");
        setShowForwardModal(false);
        setShowModal(false);
        window.location.reload();
      } else {
        alert(`Failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Forwarding failed:", error);

      // Detailed Error Handling
      if (error.response?.status === 404) {
        alert(
          "Error 404: The server could not find the Forwarding URL. Please check your Backend routes.",
        );
      } else {
        alert(
          error.response?.data?.message || "Server error while forwarding.",
        );
      }
    } finally {
      setIsForwarding(false);
    }
  };

  const handleFinalApprove = async (formData) => {
    if (
      !window.confirm(
        "Are you sure you want to GRANT FINAL APPROVAL for this application?",
      )
    )
      return;

    try {
      const response = await api.post(
        `/api/adminApplication/applications/${formData.id}/final-approve`,
      );

      if (response.data.success) {
        alert("✅ Final Approval Given! User has been notified.");
        setShowModal(false);
        window.location.reload();
      } else {
        alert(`Failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Final Approval failed:", error);
      alert(
        error.response?.data?.message || "Server error during final approval.",
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            NOC Applications
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {filteredCases.length} applications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Filter size={16} /> Filters
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#891737] rounded-lg hover:bg-[#891737]/90"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-700">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="submitted">New/Submitted</option>
              <option value="forwarded">Forwarded</option>
              <option value="pending">Total Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="finalApproved">Final Approved</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* Table UI */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[
                    "Application No",
                    "Project Title",
                    "Type",
                    "Producer",
                    "Date",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 italic">
                {filteredCases.map((row) => {
                  const status = getStatusInfo(row.status);
                  const projectTitle =
                    row.annexureOne?.titleOfProject ||
                    row.nocForm?.title ||
                    "N/A";
                  const projectType =
                    row.annexureOne?.typeOfProject ||
                    row.nocForm?.typeOfProject ||
                    "N/A";

                  return (
                    <tr
                      key={row.id}
                      onClick={() => handleRowClick(row)}
                      className="hover:bg-gray-50/50 cursor-pointer transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-[11px] font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded border border-gray-100 group-hover:border-[#891737]/20 group-hover:text-[#891737] transition-all">
                          {row.applicationNumber}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs font-bold text-gray-900 line-clamp-1 truncate max-w-[200px]">
                          {projectTitle}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                          {projectType}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs font-medium text-gray-700">
                          {row.filmmaker?.name}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-gray-400">
                        {new Date(row.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${status.color}`}
                        >
                          {status.icon}
                          {status.label}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Universal Modal */}
      <UniversalFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedRow={selectedRow}
        userRole="admin"
        onForward={handleForwardClick}
        onReject={handleReject}
        onFinalApprove={handleFinalApprove}
        showActions={true}
      />

      {/* Forwarding Modal */}
      {showForwardModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Forward Application
                </h2>
                <p className="text-xs text-gray-500">
                  Select multiple recipients below
                </p>
              </div>
              <button
                onClick={() => setShowForwardModal(false)}
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-6 overflow-y-auto">
              {/* Departments */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Select Departments
                </label>
                <div className="relative">
                  <select
                    onChange={handleAddDepartment}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#891737] outline-none"
                  >
                    <option value="">-- Add a Department --</option>
                    {DEPARTMENTS.map((d) => (
                      <option
                        key={d.id}
                        value={d.id}
                        disabled={selectedDepartments.some(
                          (sel) => sel.id === d.id,
                        )}
                      >
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 min-h-[30px]">
                  {selectedDepartments.length === 0 && (
                    <span className="text-xs text-gray-400 italic">
                      No departments selected
                    </span>
                  )}
                  {selectedDepartments.map((dept) => (
                    <span
                      key={dept.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100"
                    >
                      {dept.name}
                      <button
                        onClick={() => removeDepartment(dept.id)}
                        className="hover:text-blue-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Districts */}
              <div className="border-t pt-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Select Districts
                </label>
                <div className="relative">
                  <select
                    onChange={handleAddDistrict}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#891737] outline-none"
                  >
                    <option value="">-- Add a District --</option>
                    {BIHAR_DISTRICTS.map((d) => (
                      <option
                        key={d.id}
                        value={d.id}
                        disabled={selectedDistricts.some(
                          (sel) => sel.id === d.id,
                        )}
                      >
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 min-h-[30px]">
                  {selectedDistricts.length === 0 && (
                    <span className="text-xs text-gray-400 italic">
                      No districts selected
                    </span>
                  )}
                  {selectedDistricts.map((dist) => (
                    <span
                      key={dist.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100"
                    >
                      {dist.name}
                      <button
                        onClick={() => removeDistrict(dist.id)}
                        className="hover:text-green-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3">
              <button
                onClick={() => setShowForwardModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmForward}
                disabled={
                  isForwarding ||
                  (selectedDepartments.length === 0 &&
                    selectedDistricts.length === 0)
                }
                className="px-6 py-2 text-sm font-medium text-white bg-[#891737] hover:bg-[#6e1129] rounded-lg disabled:opacity-50 flex items-center gap-2"
              >
                {isForwarding ? "Forwarding..." : <>Forward</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboardactivity;
