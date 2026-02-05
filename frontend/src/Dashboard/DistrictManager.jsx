import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Search,
  Eye,
  EyeOff,
  X,
  Check,
  Building,
  Hash,
  Mail,
  Lock,
  User,
} from "lucide-react";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import api from "../Components/axios";
import AlertBox from "../Components/AlertBox";

// Bihar Districts Data
// Bihar Districts Data
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

const DistrictPassword = ({ searchQuery = "" }) => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);

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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/auth/all-users");
      if (res.data.success) {
        const allUsers = res.data.users || [];
        // Filter by district_admin role
        const districtAdmins = allUsers.filter(
          (u) => u.role === "district_admin",
        );
        setDistricts(districtAdmins);
      }
    } catch (err) {
      console.error("Failed to fetch district admins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "district_admin",
    districtName: "",
    districtId: "",
  });

  // Validation State
  const [emailValid, setEmailValid] = useState(null);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  // Real-time Email Validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email) {
      setEmailValid(emailRegex.test(formData.email));
    } else {
      setEmailValid(null);
    }
  }, [formData.email]);

  // Real-time Password Strength Validation
  useEffect(() => {
    const pwd = formData.password;
    if (pwd) {
      setPasswordCriteria({
        length: pwd.length >= 8,
        upper: /[A-Z]/.test(pwd),
        lower: /[a-z]/.test(pwd),
        number: /\d/.test(pwd),
        special: /[@$!%*?&]/.test(pwd),
      });
    } else {
      // Reset if empty
      setPasswordCriteria({
        length: false,
        upper: false,
        lower: false,
        number: false,
        special: false,
      });
    }
  }, [formData.password]);

  const isPasswordStrong = Object.values(passwordCriteria).every(Boolean);

  const StrengthItem = ({ fulfilled, text }) => (
    <li
      className={`flex items-center gap-2 text-xs ${
        fulfilled ? "text-green-600" : "text-gray-500"
      }`}
    >
      {fulfilled ? (
        <MdCheckCircle className="text-green-500" />
      ) : (
        <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />
      )}
      {text}
    </li>
  );

  // Stats
  const totalDistricts = BIHAR_DISTRICTS.length;
  const totalDistrictsCreated = districts.length;

  // Filter districts based on search query
  const filteredDistricts = districts.filter(
    (district) =>
      district.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      district.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      district.districtName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      district.districtId?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const togglePasswordVisibility = (id) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredDistricts.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredDistricts.map((user) => user.id));
    }
  };

  const handleDistrictChange = (e) => {
    const selectedName = e.target.value;
    const selectedDistrict = BIHAR_DISTRICTS.find(
      (d) => d.name === selectedName,
    );
    // Strict Auto-Assignment: districtId is derived strictly from the list
    const newDistrictId = selectedDistrict ? selectedDistrict.id : "";

    setFormData({
      ...formData,
      districtName: selectedName,
      districtId: newDistrictId,
    });
  };

  // handleDistrictIdChange removed to enforce strict mapping

  const handleAddDistrict = async () => {
    // Validation Checks
    if (!formData.name.trim()) {
      showAlert({
        type: "warning",
        title: "Validation Error",
        message: "Full Name is required.",
      });
      return;
    }

    if (!emailValid) {
      showAlert({
        type: "warning",
        title: "Validation Error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (!isPasswordStrong) {
      showAlert({
        type: "warning",
        title: "Validation Error",
        message: "Password does not meet security requirements.",
      });
      return;
    }

    if (
      formData.name &&
      formData.email &&
      formData.password &&
      formData.districtName &&
      formData.districtId
    ) {
      try {
        console.log("📤 Creating district admin...");

        const response = await api.post("/api/auth/create-admin", formData);

        if (response.status === 201 || response.status === 200) {
          fetchUsers();
          setFormData({
            name: "",
            email: "",
            password: "",
            role: "district_admin",
            districtName: "",
            districtId: "",
          });
          setShowAddModal(false);
          showAlert({
            type: "success",
            title: "Success",
            message: "District Admin created successfully!",
          });
        }
      } catch (error) {
        console.error("❌ Error creating district admin:", error);
        showAlert({
          type: "error",
          title: "Error",
          message:
            error.response?.data?.message ||
            "Failed to create District Admin. Please try again.",
        });
      }
    } else {
      showAlert({
        type: "warning",
        title: "Validation Error",
        message: "Please fill in all required fields.",
      });
    }
  };

  const handleEditDistrict = (district) => {
    setEditingDistrict(district);
    setFormData({
      ...district,
      password: "",
    });
    setShowAddModal(true);
  };

  const handleUpdateDistrict = async () => {
    try {
      if (formData.password && formData.password !== "******") {
        if (!isPasswordStrong) {
          showAlert({
            type: "warning",
            title: "Validation Error",
            message: "Password does not meet security requirements.",
          });
          return;
        }

        await api.post(
          `/api/auth/update-admin-password/${editingDistrict.id}`,
          { password: formData.password },
        );
      }

      fetchUsers();
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "district_admin",
        districtName: "",
        districtId: "",
      });
      setEditingDistrict(null);
      setShowAddModal(false);
      showAlert({
        type: "success",
        title: "Success",
        message: "District updated successfully!",
      });
    } catch (error) {
      console.error("❌ Error updating district:", error);
      showAlert({
        type: "error",
        title: "Update Failed",
        message: "Failed to update district.",
      });
    }
  };

  const deleteUserAPI = async (id) => {
    await api.delete(`/api/auth/delete-admin/${id}`);
    return id;
  };

  const handleDeleteDistrict = (id) => {
    showAlert({
      type: "warning",
      title: "Confirm Delete",
      message:
        "Are you sure you want to delete this district admin? This cannot be undone.",
      showCancel: true,
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          await deleteUserAPI(id);
          setDistricts((prev) => prev.filter((d) => d.id !== id));
          setSelectedUsers((prev) => prev.filter((uid) => uid !== id));
          showAlert({
            type: "success",
            title: "Deleted",
            message: "District Admin deleted successfully!",
          });
        } catch (error) {
          console.error("❌ Error deleting district:", error);
          showAlert({
            type: "error",
            title: "Delete Failed",
            message: "Failed to delete District Admin.",
          });
        }
      },
    });
  };

  const handleBulkDelete = () => {
    showAlert({
      type: "warning",
      title: "Confirm Bulk Delete",
      message: `Are you sure you want to delete ${selectedUsers.length} selected district admins? This action cannot be undone.`,
      showCancel: true,
      confirmText: `Delete ${selectedUsers.length} Admins`,
      onConfirm: async () => {
        try {
          await Promise.all(selectedUsers.map((id) => deleteUserAPI(id)));

          fetchUsers();
          setSelectedUsers([]);

          showAlert({
            type: "success",
            title: "Deleted",
            message: "Selected district admins deleted successfully.",
          });
        } catch (error) {
          console.error("Bulk delete error:", error);
          showAlert({
            type: "error",
            title: "Delete Failed",
            message: "Some admins could not be deleted.",
          });
          fetchUsers();
        }
      },
    });
  };

  return (
    <>
      {/* Metrics Cards */}
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MetricCard
            title="Total Districts"
            value={totalDistricts}
            icon={<Users className="h-5 w-5" />}
            color="text-[#891737]"
            bgColor="bg-[#891737]/10"
          />
          <MetricCard
            title="Admins Created"
            value={totalDistrictsCreated}
            icon={<UserPlus className="h-5 w-5" />}
            color="text-[#891737]"
            bgColor="bg-[#891737]/10"
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            District Directory
          </h2>

          <div className="flex gap-2">
            {selectedUsers.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected ({selectedUsers.length})
              </button>
            )}

            <button
              onClick={() => {
                setEditingDistrict(null);
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  role: "district_admin",
                  districtName: "",
                  districtId: "",
                });
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-[#891737] text-white rounded-lg text-sm font-medium hover:bg-[#891737]/90 transition-colors flex items-center gap-2 shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Add District Admin
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 w-8">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 accent-[#891737] focus:ring-[#891737]"
                    checked={
                      filteredDistricts.length > 0 &&
                      selectedUsers.length === filteredDistricts.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Password
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  District Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  District ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredDistricts.length > 0 ? (
                filteredDistricts.map((district) => (
                  <tr
                    key={district.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      selectedUsers.includes(district.id) ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 accent-[#891737] focus:ring-[#891737]"
                        checked={selectedUsers.includes(district.id)}
                        onChange={() => toggleSelectUser(district.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {district.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {district.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {showPasswords[district.id]
                            ? district.password || "••••••••"
                            : "••••••••"}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(district.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title={
                            showPasswords[district.id]
                              ? "Hide password"
                              : "Show password"
                          }
                        ></button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {district.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {district.districtName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {district.districtId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditDistrict(district)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDistrict(district.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No districts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Improved Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 md:p-10 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden transform scale-100 transition-all max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingDistrict
                    ? "Update Administrator"
                    : "New District Administrator"}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {editingDistrict
                    ? "Modify access credentials for this district."
                    : "Create access credentials for a new district."}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingDistrict(null);
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "district_admin",
                    districtName: "",
                    districtId: "",
                  });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                {/* Section: Jurisdiction */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Jurisdiction Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        District Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          value={formData.districtName}
                          onChange={handleDistrictChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all appearance-none"
                        >
                          <option value="">Select District</option>
                          {BIHAR_DISTRICTS.map((dist) => (
                            <option key={dist.id} value={dist.name}>
                              {dist.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        District ID <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-400 font-normal ml-1">
                          (Auto-assigned)
                        </span>
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.districtId}
                          readOnly
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 w-full"></div>

                {/* Section: Personal Info */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Administrator Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => {
                            // Only allow letters and spaces
                            if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
                              setFormData({
                                ...formData,
                                name: e.target.value,
                              });
                            }
                          }}
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                          placeholder="e.g. Rahul Kumar"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className={`w-full pl-10 pr-10 py-2.5 bg-white border ${
                            emailValid === false
                              ? "border-red-500 focus:ring-red-200"
                              : emailValid === true
                                ? "border-green-500 focus:ring-green-200"
                                : "border-gray-200 focus:ring-[#891737]"
                          } rounded-lg text-sm focus:ring-2 focus:border-transparent outline-none transition-all placeholder:text-gray-300`}
                          placeholder="e.g. district.admin@bihar.gov.in"
                        />
                        {emailValid === true && (
                          <span className="absolute text-lg right-3 top-1/2 -translate-y-1/2 text-green-500">
                            <MdCheckCircle />
                          </span>
                        )}
                        {emailValid === false && (
                          <span
                            className="absolute text-lg right-3 top-1/2 -translate-y-1/2 text-red-500"
                            title="Invalid email format"
                          >
                            <MdCancel />
                          </span>
                        )}
                      </div>
                      {emailValid === false && (
                        <p className="text-xs text-red-500 mt-1">
                          Please enter a valid email address.
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                          placeholder={
                            editingDistrict
                              ? "Leave blank to keep current password"
                              : "Create a secure password"
                          }
                          autoComplete="new-password"
                        />
                      </div>

                      {/* Password Strength Checklist */}
                      <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          Password must contain:
                        </p>
                        <ul className="grid grid-cols-1 gap-1">
                          <StrengthItem
                            fulfilled={passwordCriteria.length}
                            text="At least 8 characters"
                          />
                          <StrengthItem
                            fulfilled={passwordCriteria.upper}
                            text="One uppercase letter"
                          />
                          <StrengthItem
                            fulfilled={passwordCriteria.lower}
                            text="One lowercase letter"
                          />
                          <StrengthItem
                            fulfilled={passwordCriteria.number}
                            text="One number"
                          />
                          <StrengthItem
                            fulfilled={passwordCriteria.special}
                            text="One special character (@$!%*?&)"
                          />
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingDistrict(null);
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "district_admin",
                    districtName: "",
                    districtId: "",
                  });
                }}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:border-gray-400 hover:shadow-sm transition-all text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={
                  editingDistrict ? handleUpdateDistrict : handleAddDistrict
                }
                className="px-6 py-2.5 bg-[#891737] text-white rounded-lg hover:bg-[#891737]/90 hover:shadow-lg hover:shadow-[#891737]/20 transition-all text-sm font-medium flex items-center gap-2"
              >
                {editingDistrict ? "Save Changes" : "Create Administrator"}
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Box */}
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
    </>
  );
};

const MetricCard = ({ title, value, icon, color, bgColor }) => {
  return (
    <div className="bg-gray-100 rounded-2xl p-6 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div
          className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
      </div>

      <div>
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default DistrictPassword;
