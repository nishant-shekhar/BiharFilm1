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

// Departments Data
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

const DepartmentManager = ({ searchQuery = "" }) => {
  const [departments, setDepartments] = useState([]);
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
        // Filter by department_admin role
        const departmentAdmins = allUsers.filter(
          (u) => u.role === "department_admin",
        );
        setDepartments(departmentAdmins);
      }
    } catch (err) {
      console.error("Failed to fetch department admins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "department_admin",
    departmentName: "",
    departmentId: "",
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
  const totalDepartments = DEPARTMENTS.length;
  const totalDepartmentsCreated = departments.length;

  // Filter departments based on search query
  const filteredDepartments = departments.filter(
    (department) =>
      department.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.departmentName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      department.departmentId
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
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
    if (selectedUsers.length === filteredDepartments.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredDepartments.map((user) => user.id));
    }
  };

  const handleDepartmentChange = (e) => {
    const selectedName = e.target.value;
    const selectedDepartment = DEPARTMENTS.find((d) => d.name === selectedName);
    // Strict Auto-Assignment: departmentId is derived strictly from the list
    const newDepartmentId = selectedDepartment ? selectedDepartment.id : "";

    setFormData({
      ...formData,
      departmentName: selectedName,
      departmentId: newDepartmentId,
    });
  };

  const handleAddDepartment = async () => {
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

    // Strict check for Department pairing
    const isValidDepartment = DEPARTMENTS.some(
      (d) =>
        d.name === formData.departmentName && d.id === formData.departmentId,
    );

    if (!isValidDepartment) {
      showAlert({
        type: "error",
        title: "Validation Error",
        message: "Invalid Department Name or ID combination.",
      });
      return;
    }

    if (
      formData.name &&
      formData.email &&
      formData.password &&
      formData.departmentName &&
      formData.departmentId
    ) {
      try {
        console.log("📤 Creating department admin...", formData);

        const response = await api.post("/api/auth/create-admin", formData);

        if (response.status === 201 || response.status === 200) {
          fetchUsers();
          setFormData({
            name: "",
            email: "",
            password: "",
            role: "department_admin",
            departmentName: "",
            departmentId: "",
          });
          setShowAddModal(false);
          showAlert({
            type: "success",
            title: "Success",
            message: "Department Admin created successfully!",
          });
        }
      } catch (error) {
        console.error("❌ Error creating department admin:", error);
        showAlert({
          type: "error",
          title: "Error",
          message:
            error.response?.data?.message ||
            "Failed to create Department Admin. Please try again.",
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

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setFormData({
      ...department,
      password: "",
    });
    setShowAddModal(true);
  };

  const handleUpdateDepartment = async () => {
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
          `/api/auth/update-admin-password/${editingDepartment.id}`,
          { password: formData.password },
        );
      }

      fetchUsers();
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "department_admin",
        departmentName: "",
        departmentId: "",
      });
      setEditingDepartment(null);
      setShowAddModal(false);
      showAlert({
        type: "success",
        title: "Success",
        message: "Department updated successfully!",
      });
    } catch (error) {
      console.error("❌ Error updating department:", error);
      showAlert({
        type: "error",
        title: "Update Failed",
        message: "Failed to update department.",
      });
    }
  };

  const deleteUserAPI = async (id) => {
    await api.delete(`/api/auth/delete-admin/${id}`);
    return id;
  };

  const handleDeleteDepartment = (id) => {
    showAlert({
      type: "warning",
      title: "Confirm Delete",
      message:
        "Are you sure you want to delete this department admin? This cannot be undone.",
      showCancel: true,
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          await deleteUserAPI(id);
          setDepartments((prev) => prev.filter((d) => d.id !== id));
          setSelectedUsers((prev) => prev.filter((uid) => uid !== id));
          showAlert({
            type: "success",
            title: "Deleted",
            message: "Department Admin deleted successfully!",
          });
        } catch (error) {
          console.error("❌ Error deleting department:", error);
          showAlert({
            type: "error",
            title: "Delete Failed",
            message: "Failed to delete Department Admin.",
          });
        }
      },
    });
  };

  const handleBulkDelete = () => {
    showAlert({
      type: "warning",
      title: "Confirm Bulk Delete",
      message: `Are you sure you want to delete ${selectedUsers.length} selected department admins? This action cannot be undone.`,
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
            message: "Selected department admins deleted successfully.",
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
            title="Total Departments"
            value={totalDepartments}
            icon={<Users className="h-5 w-5" />}
            color="text-[#891737]"
            bgColor="bg-[#891737]/10"
          />
          <MetricCard
            title="Admins Created"
            value={totalDepartmentsCreated}
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
            Department Directory
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
                setEditingDepartment(null);
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  role: "department_admin",
                  departmentName: "",
                  departmentId: "",
                });
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-[#891737] text-white rounded-lg text-sm font-medium hover:bg-[#891737]/90 transition-colors flex items-center gap-2 shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Add Department Admin
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
                      filteredDepartments.length > 0 &&
                      selectedUsers.length === filteredDepartments.length
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
                  Department Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Department ID
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
              ) : filteredDepartments.length > 0 ? (
                filteredDepartments.map((department) => (
                  <tr
                    key={department.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      selectedUsers.includes(department.id) ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 accent-[#891737] focus:ring-[#891737]"
                        checked={selectedUsers.includes(department.id)}
                        onChange={() => toggleSelectUser(department.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {department.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {department.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {showPasswords[department.id]
                            ? department.password || "••••••••"
                            : "••••••••"}
                        </span>
                        <button
                          onClick={() =>
                            togglePasswordVisibility(department.id)
                          }
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title={
                            showPasswords[department.id]
                              ? "Hide password"
                              : "Show password"
                          }
                        ></button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {department.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {department.departmentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {department.departmentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditDepartment(department)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(department.id)}
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
                    No departments found
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
                  {editingDepartment
                    ? "Update Administrator"
                    : "New Department Administrator"}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {editingDepartment
                    ? "Modify access credentials for this department."
                    : "Create access credentials for a new department."}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingDepartment(null);
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "department_admin",
                    departmentName: "",
                    departmentId: "",
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
                        Department Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          value={formData.departmentName}
                          onChange={handleDepartmentChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all appearance-none"
                        >
                          <option value="">Select Department</option>
                          {DEPARTMENTS.map((dist) => (
                            <option key={dist.id} value={dist.name}>
                              {dist.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Department ID <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-400 font-normal ml-1">
                          (Auto-assigned)
                        </span>
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.departmentId}
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
                          placeholder="e.g. department.admin@bihar.gov.in"
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
                          type="text"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all placeholder:text-gray-300 font-mono"
                          placeholder="Enter a strong password"
                        />
                        {formData.password && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {isPasswordStrong ? (
                              <MdCheckCircle className="text-green-500 text-lg" />
                            ) : (
                              <div className="text-xs text-orange-500 font-medium px-2 py-0.5 bg-orange-50 rounded">
                                Weak
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Password Strength Indicators */}
                      <div className="mt-3 grid grid-cols-2 gap-2">
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
                          text="One special character"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 w-full"></div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingDepartment(null);
                    }}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={
                      editingDepartment
                        ? handleUpdateDepartment
                        : handleAddDepartment
                    }
                    className="px-5 py-2.5 bg-[#891737] text-white font-medium rounded-lg hover:bg-[#891737]/90 transition-colors text-sm shadow-sm flex items-center gap-2"
                  >
                    {editingDepartment ? (
                      <>
                        <Check className="w-4 h-4" />
                        Update Administrator
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Create Administrator
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification/Confirmation Alert */}
      <AlertBox
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        showCancel={alertConfig.showCancel}
        onConfirm={() => {
          if (alertConfig.onConfirm) {
            alertConfig.onConfirm();
          }
          closeAlert();
        }}
        onCancel={closeAlert}
      />
    </>
  );
};

// Sub-component for rendering metric cards
const MetricCard = ({ title, value, icon, color, bgColor }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
    <div>
      <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
    <div className={`p-3 rounded-lg ${bgColor} ${color}`}>{icon}</div>
  </div>
);

export default DepartmentManager;
