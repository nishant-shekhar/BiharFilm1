import React, { useState, useEffect } from "react";
import {
  Users,
  Film,
  Store,
  Palette,
  Edit2,
  Trash2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import api from "../Components/axios";
import AlertBox from "../Components/AlertBox";

const UserManager = ({ searchQuery = "" }) => {
  const [activeTab, setActiveTab] = useState("Filmmaker");
  const [filmmakers, setFilmmakers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [artists, setArtists] = useState([]);
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

        // Filter by role
        setFilmmakers(allUsers.filter((u) => u.role === "filmmaker"));
        setVendors(allUsers.filter((u) => u.role === "vendor"));
        setArtists(allUsers.filter((u) => u.role === "artist"));
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset selection when tab changes
  useEffect(() => {
    setSelectedUsers([]);
  }, [activeTab]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
  });

  // Password Validation State
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

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

  // Helper to get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "Filmmaker":
        return {
          data: filmmakers,
          setter: setFilmmakers,
          icon: <Film className="w-5 h-5" />,
          color: "text-[#891737]",
        };
      case "Vendor":
        return {
          data: vendors,
          setter: setVendors,
          icon: <Store className="w-5 h-5" />,
          color: "text-[#891737]",
        };
      case "Artist":
        return {
          data: artists,
          setter: setArtists,
          icon: <Palette className="w-5 h-5" />,
          color: "text-[#891737]",
        };
      default:
        return {
          data: [],
          setter: () => {},
          icon: <Users className="w-5 h-5" />,
          color: "text-gray-600",
        };
    }
  };

  const {
    data: currentUsers,
    setter: setCurrentSetter,
    icon: currentIcon,
    color: currentColor,
  } = getCurrentData();

  // Stats
  const totalUsers = currentUsers.length;

  // Filter users based on search query
  const filteredUsers = currentUsers.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle selection for a single user
  const toggleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      password: "", // Only password is editable
    });
    setShowPassword(false);
    setShowAddModal(true);
  };

  const handleUpdatePassword = async () => {
    if (!formData.password) {
      showAlert({
        type: "warning",
        title: "Validation Error",
        message: "Please enter a new password.",
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

    try {
      console.log("📤 Updating user password...");

      // Send both keys to handle potential backend naming mismatch
      await api.put(`/api/auth/change-user-password/${editingUser.id}`, {
        password: formData.password,
        newPassword: formData.password,
      });

      showAlert({
        type: "success",
        title: "Success",
        message: "Password updated successfully!",
      });

      fetchUsers();
      setShowAddModal(false);
      setEditingUser(null);
      setFormData({ password: "" });
    } catch (error) {
      console.error("❌ Error updating password:", error);
      showAlert({
        type: "error",
        title: "Update Failed",
        message: error.response?.data?.message || "Failed to update password.",
      });
    }
  };

  const deleteUserAPI = async (id) => {
    await api.delete(`/api/auth/delete-user/${id}`);
    return id; // Return ID on success
  };

  // Handle single delete
  const handleDeleteUser = (id) => {
    showAlert({
      type: "warning",
      title: "Confirm Delete",
      message: `Are you sure you want to delete this ${activeTab}? This action cannot be undone.`,
      showCancel: true,
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          await deleteUserAPI(id);
          const updatedList = currentUsers.filter((u) => u.id !== id);
          setCurrentSetter(updatedList);
          // Remove from selected if present
          setSelectedUsers((prev) => prev.filter((uid) => uid !== id));
          showAlert({
            type: "success",
            title: "Deleted",
            message: `${activeTab} deleted successfully.`,
          });
        } catch (error) {
          showAlert({
            type: "error",
            title: "Delete Failed",
            message: "Failed to delete user.",
          });
        }
      },
    });
  };

  // Handle Bulk Delete
  const handleBulkDelete = () => {
    showAlert({
      type: "warning",
      title: "Confirm Bulk Delete",
      message: `Are you sure you want to delete ${selectedUsers.length} selected ${activeTab}s? This action cannot be undone.`,
      showCancel: true,
      confirmText: `Delete ${selectedUsers.length} Users`,
      onConfirm: async () => {
        try {
          // Execute all deletes
          await Promise.all(selectedUsers.map((id) => deleteUserAPI(id)));

          // Update local state by removing all deleted IDs
          const updatedList = currentUsers.filter(
            (u) => !selectedUsers.includes(u.id)
          );
          setCurrentSetter(updatedList);

          setSelectedUsers([]); // Clear selection
          showAlert({
            type: "success",
            title: "Deleted",
            message: "Selected users deleted successfully.",
          });
        } catch (error) {
          console.error("Bulk delete error:", error);
          showAlert({
            type: "error",
            title: "Delete Failed",
            message: "Some users could not be deleted.",
          });
          // Re-fetch to ensure sync state
          fetchUsers();
        }
      },
    });
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6 w-fit">
        {["Filmmaker", "Vendor", "Artist"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
                            w-32 rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                            ${
                              activeTab === tab
                                ? "bg-white text-[#891737] shadow"
                                : "text-gray-600 hover:bg-white/[0.12] hover:text-[#891737]"
                            }
                        `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Metrics Cards */}
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MetricCard
            title={`Total ${activeTab}s`}
            value={totalUsers}
            icon={currentIcon}
            color={currentColor}
          />
          <InstructionCard
            title="Password Management"
            description="Admins can securely update user passwords. Click the edit icon in any row to set a new password. All changes are encrypted."
            icon={
              <div className="text-[#891737]">
                <Edit2 className="w-5 h-5" />
              </div>
            }
            color="bg-red-50"
          />
        </div>
      </section>

      {/* User List Section */}
      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeTab} Directory
          </h2>

          {/* Bulk Delete Button */}
          {selectedUsers.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected ({selectedUsers.length})
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 w-8">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 accent-[#891737] focus:ring-[#891737]"
                    checked={
                      filteredUsers.length > 0 &&
                      selectedUsers.length === filteredUsers.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Last Login
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Updated At
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Password
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
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
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      selectedUsers.includes(user.id) ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 accent-[#891737] focus:ring-[#891737]"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                      {formatDate(user.updatedAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-[10px]">Hidden</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1.5 text-[#891737] hover:text-white hover:bg-[#891737] rounded-lg transition-colors"
                          title="Change Password"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 text-[#891737] hover:text-white hover:bg-[#891737] rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
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
                    No {activeTab.toLowerCase()}s found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Password Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Update Password
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingUser(null);
                  setFormData({ password: "" });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                  <p className="text-sm text-gray-600">
                    Updating password for:{" "}
                    <span className="font-semibold text-gray-900">
                      {editingUser?.name}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {editingUser?.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#891737] focus:border-transparent pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
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

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingUser(null);
                  setFormData({ password: "" });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePassword}
                className="px-6 py-2 bg-[#891737] text-white rounded-lg hover:bg-[#891737]/90 transition-colors text-sm font-medium"
              >
                Update Password
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

const MetricCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-gray-100 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}
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

const InstructionCard = ({ title, description, icon, color }) => {
  return (
    <div className="bg-gray-100 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default UserManager;
