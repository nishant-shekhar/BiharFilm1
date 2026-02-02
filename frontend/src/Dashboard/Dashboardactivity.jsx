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
const DISTRICTS_LIST = [
  { id: 1, name: "Araria" },
  { id: 2, name: "Arwal" },
  { id: 3, name: "Aurangabad" },
  { id: 4, name: "Banka" },
  { id: 5, name: "Begusarai" },
  { id: 6, name: "Bhagalpur" },
  { id: 7, name: "Bhojpur" },
  { id: 8, name: "Buxar" },
  { id: 9, name: "Darbhanga" },
  { id: 10, name: "East Champaran" },
  { id: 11, name: "Gaya" },
  { id: 12, name: "Gopalganj" },
  { id: 13, name: "Jamui" },
  { id: 14, name: "Jehanabad" },
  { id: 15, name: "Kaimur" },
  { id: 16, name: "Katihar" },
  { id: 17, name: "Khagaria" },
  { id: 18, name: "Kishanganj" },
  { id: 19, name: "Lakhisarai" },
  { id: 20, name: "Madhepura" },
  { id: 21, name: "Madhubani" },
  { id: 22, name: "Munger" },
  { id: 23, name: "Muzaffarpur" },
  { id: 24, name: "Nalanda" },
  { id: 25, name: "Nawada" },
  { id: 26, name: "Patna" },
  { id: 27, name: "Purnia" },
  { id: 28, name: "Rohtas" },
  { id: 29, name: "Saharsa" },
  { id: 30, name: "Samastipur" },
  { id: 31, name: "Saran" },
  { id: 32, name: "Sheikhpura" },
  { id: 33, name: "Sheohar" },
  { id: 34, name: "Sitamarhi" },
  { id: 35, name: "Siwan" },
  { id: 36, name: "Supaul" },
  { id: 37, name: "Vaishali" },
  { id: 38, name: "West Champaran" },
];

const DEPARTMENTS_LIST = [
  {
    category: "Administration",
    depts: [
      { id: 101, name: "Cabinet Secretariat" },
      { id: 102, name: "Department of Law" },
      { id: 103, name: "Home" },
      { id: 104, name: "Information and Public Relations Department" },
    ],
  },
  {
    category: "Finance",
    depts: [
      { id: 201, name: "Commercial Taxes" },
      { id: 202, name: "Finance" },
      { id: 203, name: "Transport" },
    ],
  },
  {
    category: "Human Resource",
    depts: [
      { id: 301, name: "Education" },
      { id: 302, name: "Health" },
    ],
  },
  {
    category: "Infrastructure",
    depts: [
      { id: 401, name: "Building Construction" },
      { id: 402, name: "Road Construction" },
      { id: 403, name: "Rural Works" },
    ],
  },
  {
    category: "Agriculture & Allied",
    depts: [
      { id: 501, name: "Agriculture" },
      { id: 502, name: "Animal & Fisheries Resources" },
      { id: 503, name: "Environment & Forest" },
    ],
  },
  {
    category: "Art, Culture & Tourism",
    depts: [
      { id: 601, name: "Tourism" },
      { id: 602, name: "Youth & Art Culture" },
    ],
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
    const deptId = parseInt(e.target.value);
    if (!deptId) return;

    let foundDept = null;
    DEPARTMENTS_LIST.forEach((group) => {
      const match = group.depts.find((d) => d.id === deptId);
      if (match) foundDept = match;
    });

    if (foundDept && !selectedDepartments.some((d) => d.id === foundDept.id)) {
      setSelectedDepartments([...selectedDepartments, foundDept]);
    }
    e.target.value = "";
  };

  const handleAddDistrict = (e) => {
    const distId = parseInt(e.target.value);
    if (!distId) return;

    const foundDist = DISTRICTS_LIST.find((d) => d.id === distId);
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

  // --- FILTERING LOGIC ---
  const filteredCases = cases.filter((item) => {
    let matchesSearch = true;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      matchesSearch =
        item.applicationNumber?.toLowerCase().includes(query) ||
        item.filmmaker?.name?.toLowerCase().includes(query) ||
        item.status?.toLowerCase().includes(query) ||
        item.filmmaker?.email?.toLowerCase().includes(query);
    }

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
        `/api/adminApplication/applications/${selectedRow.id}/forward`,
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
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">All</option>
              <option value="submitted">New</option>
              <option value="forwarded">Forwarded</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
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
                  {["Application No", "Producer", "Date", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCases.map((row) => {
                  const status = getStatusInfo(row.status);
                  return (
                    <tr
                      key={row.id}
                      onClick={() => handleRowClick(row)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-5 py-3.5 font-mono text-xs font-medium">
                        {row.applicationNumber}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-900">
                        {row.filmmaker?.name}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">
                        {new Date(row.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
                        >
                          {status.label}
                        </span>
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
                    {DEPARTMENTS_LIST.map((group) => (
                      <optgroup key={group.category} label={group.category}>
                        {group.depts.map((d) => (
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
                      </optgroup>
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
                    {DISTRICTS_LIST.map((d) => (
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
                {isForwarding ? (
                  "Forwarding..."
                ) : (
                  <>
                    Forward <FaShareAlt />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboardactivity;
