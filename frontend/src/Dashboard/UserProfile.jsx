import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Lock,
  Save,
  X,
  Clock,
  Edit3,
  CheckCircle,
  TriangleAlert,
  Eye,
  EyeOff,
} from "lucide-react";
import { validateFile } from "../utils/fileValidation";
import AlertBox from "../Components/AlertBox";
import api from "../Components/axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    lastUpdated: "2025-11-28T10:30:00",
  });

  const navigate = useNavigate();
  const [user, setUser] = useState({});

  // Fetch user data from API (Cookie-based auth)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me");
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
          // Initialize profile data
          setProfileData((prev) => ({
            ...prev,
            name: res.data.user.name || prev.name,
            email: res.data.user.email || prev.email,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Optional: Redirect to login if 401
      }
    };
    fetchUser();
  }, []);

  // Initialize profile data from user state (if already present)
  useEffect(() => {
    if (user && user.name) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    lastChanged: "2025-10-15T14:20:00",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

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

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    const pwd = passwordData.newPassword;
    setPasswordCriteria({
      length: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[@$!%*?&]/.test(pwd),
    });
  }, [passwordData.newPassword]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [tempProfileData, setTempProfileData] = useState(profileData);

  const getStrengthColor = (count) => {
    if (count === 0) return "bg-gray-200";
    if (count <= 2) return "bg-red-500";
    if (count <= 4) return "bg-orange-500";
    return "bg-green-500";
  };

  const strengthCount = Object.values(passwordCriteria).filter(Boolean).length;

  const StrengthChip = ({ fulfilled, text }) => (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border flex items-center gap-1 transition-colors ${
        fulfilled
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-gray-50 text-gray-500 border-gray-200"
      }`}
    >
      {fulfilled ? <CheckCircle size={10} /> : null}
      {text}
    </span>
  );

  // Format timestamp
  const formatDateTime = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Save profile changes
  const handleSaveProfile = () => {
    setProfileData({
      ...tempProfileData,
      lastUpdated: new Date().toISOString(),
    });
    setIsEditingProfile(false);
    // Add API call here
  };

  // Cancel profile edit
  const handleCancelProfile = () => {
    setTempProfileData(profileData);
    setIsEditingProfile(false);
  };

  // Save password changes
  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showAlert({
        type: "warning",
        title: "Validation Error",
        message: "Passwords do not match!",
      });
      return;
    }
    // Password Validation regex
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(passwordData.newPassword)) {
      showAlert({
        type: "warning",
        title: "Weak Password",
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      });
      return;
    }

    try {
      const response = await api.put(
        `/api/auth/update-user-password-self/${user.id}`,
        {
          password: passwordData.newPassword,
          newPassword: passwordData.newPassword, // Sending both to match potential backend expectation
        }
      );

      if (response.data.success) {
        showAlert({
          type: "success",
          title: "Success",
          message: "Password updated successfully!",
        });

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          lastChanged: new Date().toISOString(),
        });
        setIsEditingPassword(false);
      }
    } catch (error) {
      console.error("Password update error:", error);
      showAlert({
        type: "error",
        title: "Update Failed",
        message: error.response?.data?.message || "Failed to update password.",
      });
    }
  };

  // Cancel password edit
  const handleCancelPassword = () => {
    setPasswordData({
      ...passwordData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditingPassword(false);
  };

  // Handle Account Deletion
  const handleDeleteAccount = () => {
    showAlert({
      type: "warning",
      title: "Delete Account?",
      message:
        "Are you sure you want to permanently delete your account? This action cannot be undone.",
      showCancel: true,
      confirmText: "Yes, Delete My Account",
      onConfirm: async () => {
        try {
          await api.delete(`/api/auth/delete-user-self/${user.id}`);

          showAlert({
            type: "success",
            title: "Account Deleted",
            message:
              "Your account has been successfully deleted. Redirecting...",
            onConfirm: () => navigate("/login"),
          });

          setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
          console.error("Account deletion error:", error);
          showAlert({
            type: "error",
            title: "Deletion Failed",
            message:
              error.response?.data?.message || "Failed to delete account.",
          });
        }
      },
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Account Settings
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your personal information and security preferences.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl  overflow-hidden max-w-3xl mx-auto">
          {/* Personal Information Section */}

          {/* Security Section */}
          <div className="p-6 md:p-8 bg-gray-50/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#891737]">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Security
                  </h3>
                  <p className="text-xs text-gray-500">
                    Manage your password and security settings.
                  </p>
                </div>
              </div>
            </div>

            {!isEditingPassword ? (
              <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Password</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last changed: {formatDateTime(passwordData.lastChanged)}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className="text-sm font-medium text-[#891737] hover:bg-[#891737]/5 px-4 py-2 rounded-lg border border-[#891737]/20 transition-colors"
                >
                  Change Password
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-6 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#891737] focus:ring-1 focus:ring-[#891737] pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPasswords.current ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#891737] focus:ring-1 focus:ring-[#891737] pr-10"
                        placeholder="Min 8 chars"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPasswords.new ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#891737] focus:ring-1 focus:ring-[#891737] pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-600">
                        Password must contain:
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <StrengthChip
                        fulfilled={passwordCriteria.length}
                        text="8+ Chars"
                      />
                      <StrengthChip
                        fulfilled={passwordCriteria.upper}
                        text="Upper"
                      />
                      <StrengthChip
                        fulfilled={passwordCriteria.lower}
                        text="Lower"
                      />
                      <StrengthChip
                        fulfilled={passwordCriteria.number}
                        text="Number"
                      />
                      <StrengthChip
                        fulfilled={passwordCriteria.special}
                        text="Special"
                      />
                    </div>

                    {/* Strength Bar */}
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthColor(
                          strengthCount
                        )}`}
                        style={{ width: `${(strengthCount / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCancelPassword}
                      className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSavePassword}
                      className="px-4 py-2 text-xs font-medium text-white bg-[#891737] hover:bg-[#891737]/90 rounded-lg transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Danger Zone */}
          <div className="p-6 md:p-8 bg-red-50/50 border-t border-red-100">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100/50 rounded-lg text-red-600 mt-1">
                <TriangleAlert size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  Danger Zone
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Permanently delete your account and all associated data.
                </p>

                <div className="bg-white border border-red-100 rounded-lg p-4 mb-4">
                  <ul className="list-disc list-inside text-xs text-red-600 space-y-1 font-medium">
                    <li>
                      Account deletion is permanent and cannot be reversed.
                    </li>
                    <li className="whitespace-nowrap">
                      Once the account is deleted, all associated work, data,
                      and saved progress will be permanently removed.
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm flex items-center gap-2"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertBox {...alertConfig} onClose={closeAlert} />
    </>
  );
};

export default UserProfile;
