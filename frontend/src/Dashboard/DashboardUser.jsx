import React, { useEffect, useState } from "react";
import "../App.css";
import Logo1 from "/src/assets/Logo1.png";
import UserAvatar from "/src/assets/UserAvtar.svg";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import ProducerRegistration from "./ProducerRegistration";
import Annexure1 from "./Annexure1";
import ApplyNOCForm from "./Annexure2";
import AnnexureA from "./AnnexureA";
import UndertakingForm from "./UndertakingForm";
import ArtistRegistrationForm from "./AddArtistForm";

import ArtistProfile from "./ArtistProfile";
import FilmmakerOverview from "./FilmmakerOverview";
import VendorDashboard from "./VendorDashboard";
import UserProfile from "./UserProfile";
import AlertBox from "../Components/AlertBox";
import {
  Lock,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  FileText,
} from "lucide-react";
import api from "../Components/axios"; // ✅ Using api instance

const UserDashboard = () => {
  console.log("User Dashboard rendered");
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [producerRegistrationStatus, setProducerRegistrationStatus] =
    useState(false);
  const [activeSection, setActiveSection] = useState("Overview");
  const [nocList, setNocList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [nocExpanded, setNocExpanded] = useState(false);
  const [isCreatingNOC, setIsCreatingNOC] = useState(false); // Loading state for NOC creation

  // Alert state
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    confirmText: "OK",
    showCancel: false,
    onConfirm: null,
    autoClose: false,
  });

  // Alert helper function
  const showAlert = (config) => {
    setAlertConfig({
      isOpen: true,
      type: config.type || "info",
      title: config.title || "",
      message: config.message || "",
      confirmText: config.confirmText || "OK",
      cancelText: config.cancelText || "Cancel",
      showCancel: config.showCancel || false,
      onConfirm: config.onConfirm || null,
      autoClose: config.autoClose || false,
      duration: config.duration || 3000,
    });
  };

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, isOpen: false });
  };

  const fetchUserProfile = async () => {
    try {
      console.log("📡 Fetching user profile...");

      // ✅ Use /api/auth/me to verify authentication
      const authResponse = await api.get("/api/auth/me");

      console.log("✅ Auth response:", authResponse.data);

      if (!authResponse.data.success || !authResponse.data.user) {
        throw new Error("Not authenticated");
      }

      const authenticatedUser = authResponse.data.user;

      // Set user data from auth response
      setUserId(authenticatedUser.id);
      setUserEmail(authenticatedUser.email);
      setUserRole(authenticatedUser.role?.toLowerCase());

      // Fetch detailed profile data based on role
      try {
        let profileResponse;
        const role = authenticatedUser.role?.toLowerCase();

        if (role === "filmmaker") {
          // Fetch Filmmaker Profile (Best effort)
          try {
            profileResponse = await api.get(
              "/api/filmmakerProfile/filmmakerProfile",
            );
          } catch (pError) {
            console.warn("Could not fetch filmmaker profile:", pError);
            // Continue execution to check registration status
          }

          // 🌟 STEP 1 - CHECK PRODUCER REGISTRATION (Critical for Access)
          try {
            const userIdToUse = authenticatedUser.id || authenticatedUser._id;
            const prodRegResponse = await api.get(
              `/api/producer-registration/getProducerRegistrationFormById/${userIdToUse}`,
            );

            if (prodRegResponse.data.success && prodRegResponse.data.data) {
              console.log(
                "✅ Producer Registration Found - Unlocking Dashboard",
              );
              setProducerRegistrationStatus(true);

              // 🌟 STEP 2 - FETCH APPLICATIONS (With Progress)
              try {
                const appsResponse = await api.get("/api/applications/my");
                if (appsResponse.data.success) {
                  const appsData = appsResponse.data.data;
                  const appsList = Array.isArray(appsData)
                    ? appsData
                    : [appsData];

                  // 🌟 STEP 3 - Fetch Deep Details for Latest App (for Annexure A check)
                  if (appsList.length > 0) {
                    const latestApp = appsList[0];
                    try {
                      try {
                        // Using specific endpoint to check Annexure A status
                        console.log(
                          "Checking Annexure A for App ID:",
                          latestApp.id,
                        );
                        const annexRes = await api.get(
                          `/api/annexureA/applications/${latestApp.id}/annexure-a`,
                        );
                        if (annexRes.data.success && annexRes.data.data) {
                          console.log(
                            "✅ Annexure A Data Found:",
                            annexRes.data.data,
                          );
                          // Mark as filled if data exists
                          // We attach it to the app object for the sidebar check
                          appsList[0] = {
                            ...latestApp,
                            annexureAData: annexRes.data.data,
                            isAnnexureAFilled: true,
                          };
                        }
                      } catch (detailErr) {
                        console.warn(
                          "Annexure A not filled or error:",
                          detailErr,
                        );
                        // Ensure we don't false positive if 404
                      }
                    } catch (detailErr) {
                      console.warn(
                        "Could not fetch detailed NOC form:",
                        detailErr,
                      );
                    }
                  }

                  setNocList(appsList);
                }
              } catch (appFetchError) {
                console.warn("Could not fetch applications:", appFetchError);
              }
            } else {
              console.log(
                "⚠️ No Producer Registration Found - Locking Dashboard",
              );
              setProducerRegistrationStatus(false);
              setActiveSection("Producer Registration Form");
              // Only show alert if we are effectively locked out of intended destination?
              // Or just let the UI lock state handle it.
              showAlert({
                type: "info",
                title: "Welcome!",
                message:
                  "Please complete your Producer Registration to proceed.",
                confirmText: "Start Registration",
              });
            }
          } catch (err) {
            console.warn("Could not fetch producer registration:", err);
            setProducerRegistrationStatus(false);
            setActiveSection("Producer Registration Form");

            // Only alert on 404 (Not Found) which implies valid user but no reg
            if (err.response?.status === 404) {
              showAlert({
                type: "info",
                title: "Welcome!",
                message:
                  "Please complete your Producer Registration to proceed.",
                confirmText: "Start Registration",
              });
            }
          }
        } else if (role === "vendor") {
          // Vendors load their profile in VendorDashboard, but we might want basic info here
          // For now, let's skip fetching filmmakerProfile for vendors to avoid 403
          // Or fetch myVendorProfile to populate user name if needed
          try {
            profileResponse = await api.get("/api/vendor/myVendorProfile", {
              validateStatus: () => true,
            });
          } catch (e) {
            // ignore if not found
          }
        } else {
          // For artists or others, handle accordingly or skip
        }

        if (
          profileResponse &&
          profileResponse.status >= 200 &&
          profileResponse.status < 300
        ) {
          console.log("✅ Profile response:", profileResponse.data);
          const data = profileResponse.data.data || {};

          // Handle Filmmaker specific data
          if (role === "filmmaker") {
            const { user, nocForms } = data;
            if (user) {
              const { id, name, email } = user;
              if (name) setUserName(name);
              if (id) setUserId(id);
              if (email) setUserEmail(email);
            }
            // We rely on the specific API call for producer registration status now

            if (nocForms && Array.isArray(nocForms)) {
              setNocList(nocForms);
            }
          } else if (role === "vendor") {
            // Handle vendor specific data if needed for common state
            if (data.vendorName) setUserName(data.vendorName);
            if (data.id) setUserId(data.id);
          }
        } else {
          // If profile not found or specific profile endpoint not called
          // Fallback to auth data which is already set
        }
      } catch (profileError) {
        console.warn(
          "⚠️ Profile fetch failed or skipped, using basic auth data:",
          profileError,
        );
        // Use basic auth data as fallback
        setUserName(authenticatedUser.email);
      }
    } catch (error) {
      console.error("❌ Authentication failed:", error);

      showAlert({
        type: "error",
        title: "Authentication Required",
        message: "Please login to access your dashboard.",
        confirmText: "Login",
        onConfirm: () => {
          navigate("/login", { replace: true });
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);

  const handleLogout = async () => {
    showAlert({
      type: "warning",
      title: "Logout Confirmation",
      message: "Are you sure you want to logout?",
      confirmText: "Yes, Logout",
      cancelText: "Cancel",
      showCancel: true,
      onConfirm: async () => {
        try {
          // ✅ Call logout endpoint to clear cookie
          await api.post("/api/auth/logout");

          console.log("✅ Logged out successfully");

          showAlert({
            type: "success",
            title: "Logged Out",
            message: "You have been successfully logged out.",
            confirmText: "OK",
            autoClose: true,
            duration: 2000,
            onConfirm: () => {
              navigate("/login", { replace: true });
            },
          });

          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 2000);
        } catch (error) {
          console.error("❌ Logout error:", error);
          // Even if logout fails, redirect to login
          navigate("/login", { replace: true });
        }
      },
    });
  };

  const handleSubmitNOC = (newNOC) => {
    const updatedNOC = { ...newNOC, status: "Submitted" };
    const updated = [...nocList, updatedNOC];
    setNocList(updated);
    setActiveSection("Overview");

    showAlert({
      type: "success",
      title: "NOC Submitted!",
      message: "Your NOC application has been submitted successfully.",
      confirmText: "Great!",
      autoClose: true,
      duration: 3000,
    });
  };

  const handleArtistClick = () => {
    setActiveSection("Artist Registration");
  };

  const sidebarItems = {
    filmmaker: ["Overview", "Producer Registration Form", "Profile"],
    artist: ["Overview", "Profile"],
    vendor: ["Overview", "Profile"],
  };

  const renderSection = () => {
    // Force redirect logic if in render (safety net)
    if (
      userRole === "filmmaker" &&
      !producerRegistrationStatus &&
      activeSection !== "Producer Registration Form" &&
      !loading
    ) {
      // Ideally we handle this in useEffect, but this prevents rendering other components if state is out of sync
      // return <ProducerRegistration />; // Or just return placeholder while useEffect switches
      setActiveSection("Producer Registration Form");
      return null; // Render nothing for a moment while state updates
    }

    console.log(
      "Rendering Section - Active:",
      activeSection,
      "Role:",
      userRole,
    );

    // Get the active (latest) application to pass to forms
    const activeApplication = nocList.length > 0 ? nocList[0] : null;

    if (activeSection === "Overview") {
      if (userRole === "filmmaker") {
        return <FilmmakerOverview nocList={nocList} />;
      } else if (userRole === "artist") {
        return <ArtistProfile />;
      } else if (userRole === "vendor") {
        return <VendorDashboard />;
      }
    }
    if (activeSection === "Annexure 2") {
      // Pass activeApplication to Annexure 2 as well
      return (
        <ApplyNOCForm
          onSubmit={() => {
            handleSubmitNOC();
            fetchUserProfile(); // Trigger refresh
          }}
          activeApplication={activeApplication}
        />
      );
    }
    if (activeSection === "Profile") {
      return <UserProfile />;
    }

    if (activeSection === "Annexure 1") {
      return <Annexure1 activeApplication={activeApplication} />;
    }

    if (activeSection === "Annexure A") {
      return (
        <AnnexureA
          activeApplication={activeApplication}
          refreshData={fetchUserProfile}
        />
      );
    }

    if (activeSection === "Undertaking") {
      return (
        <UndertakingForm
          activeApplication={activeApplication}
          refreshData={fetchUserProfile}
        />
      );
    }

    if (activeSection === "Producer Registration Form") {
      return (
        <ProducerRegistration onSuccess={() => setActiveSection("Overview")} />
      );
    }
    if (activeSection === "Artist Registration") {
      return <ArtistRegistrationForm />;
    }

    return (
      <div className="p-4">
        <p className="text-red-500 font-bold">Invalid section</p>
        <p className="text-sm text-gray-500">Active Section: {activeSection}</p>
        <p className="text-sm text-gray-500">User Role: {userRole}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a92b43] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white font-sans">
      {/* Alert Component */}
      <AlertBox {...alertConfig} onClose={closeAlert} />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Enterprise Clean Design */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 transform md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <img src={Logo1} alt="Logo" className="h-14" />
          <button
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {/* Standard Items */}
            {(sidebarItems[userRole] || []).map((item, idx) => {
              // LOCKING LOGIC REMOVED - using filtered list + conditional dropdown
              return (
                <li key={idx}>
                  <button
                    className={`w-full px-4 py-2.5 flex items-center justify-between text-sm font-medium rounded-lg transition-all duration-200 ${
                      item === activeSection
                        ? "text-[#891737] bg-[#891737]/5 border border-[#891737]/10"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      if (item === "Artist Registration") {
                        handleArtistClick();
                      } else {
                        setActiveSection(item);
                      }
                      setIsSidebarOpen(false);
                    }}
                  >
                    <span>{item}</span>
                  </button>
                </li>
              );
            })}

            {/* Filmmaker Specific NOC Menu */}
            {userRole === "filmmaker" && producerRegistrationStatus && (
              <li>
                <button
                  disabled={isCreatingNOC}
                  className={`w-full px-4 py-2.5 flex items-center justify-between text-sm font-medium rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 ${isCreatingNOC ? "opacity-70 cursor-wait" : ""}`}
                  onClick={async () => {
                    if (isCreatingNOC) return;

                    // Toggle OFF if already expanded
                    if (nocExpanded) {
                      setNocExpanded(false);
                      return;
                    }

                    // Get latest application
                    const latestApp = nocList.length > 0 ? nocList[0] : null;

                    // Logic: Create NEW only if NO application exists.
                    // If an application exists (even if submitted/rejected), we do NOT create a new one automatically.
                    // The user must wait or use a specific "New Application" flow if we ever add one.
                    // For now, STRICT LOCK: One active/submitted app at a time.

                    if (!latestApp) {
                      try {
                        setIsCreatingNOC(true);
                        const response = await api.post("/api/applications");
                        if (response.data.success) {
                          console.log(
                            "✅ New Application created:",
                            response.data.data,
                          );
                          setNocList([response.data.data, ...nocList]);
                          setNocExpanded(true);
                          setActiveSection("Annexure 1");
                        }
                      } catch (error) {
                        console.error("❌ Error creating application:", error);
                        if (error.response && error.response.status === 409) {
                          // Already active one exists (backend safeguard)
                          setNocExpanded(true);
                        } else {
                          showAlert({
                            type: "error",
                            title: "Error",
                            message:
                              "Failed to start application. Please try again.",
                          });
                        }
                      } finally {
                        setIsCreatingNOC(false);
                      }
                    } else {
                      // Active application exists - just open menu
                      setNocExpanded(true);
                    }
                  }}
                >
                  <span className="flex items-center gap-2">
                    {isCreatingNOC ? (
                      <svg
                        className="animate-spin h-4 w-4 text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      "NOC Forms"
                    )}
                  </span>
                  {nocExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {/* Sub Menu */}
                {nocExpanded && (
                  <ul className="mt-1 space-y-1 pl-4 border-l-2 border-gray-100 ml-4">
                    {[
                      { name: "Annexure 1", key: "annexureOneCompleted" },
                      { name: "Annexure 2", key: "nocFormCompleted" }, // "Annexure 2" corresponds to nocFormCompleted
                      { name: "Annexure A", key: "annexureOneCompleted" }, // Simplification: checking Annexure 1 for now or specific
                      { name: "Undertaking", key: "undertakingUploaded" },
                    ].map((subItem) => {
                      // Determine completion status
                      const latestApp = nocList[0];
                      const progress = latestApp?.progress || {};

                      // Mapping exact keys
                      let isCompleted = false;
                      if (subItem.name === "Annexure 1")
                        isCompleted = progress.annexureOneCompleted;
                      if (subItem.name === "Annexure 2")
                        isCompleted = progress.nocFormCompleted;
                      if (subItem.name === "Annexure A") {
                        // Check explicit flag from the new API call
                        isCompleted = !!latestApp.isAnnexureAFilled;
                      }
                      // Wait, if 2 is done, A might still be pending.
                      // Let's rely on Checkmark Logic:
                      // If the user can PROCEED to next step, does that mean this one is locked?
                      // User said: "until approval not come do not give user to again fills"

                      // REFINED COMPLETION LOGIC based on available keys:
                      if (subItem.name === "Annexure 1")
                        isCompleted = progress.annexureOneCompleted;
                      if (subItem.name === "Annexure 2")
                        isCompleted = progress.nocFormCompleted;
                      // We don't have a specific `annexureACompleted` key in the log shown in Step 886.
                      // We only saw `annexureOneCompleted` and `nocFormCompleted`.
                      // However, user said "Annexure A submitted" is a precondition for Undertaking.
                      // So maybe we don't lock Annexure A yet? Or we check if Undertaking is possible?
                      // For now, let's lock what we know.
                      if (subItem.name === "Undertaking")
                        isCompleted = progress.undertakingUploaded;

                      // Lock click if completed (unless Rejected? User said "until approval not come")
                      const isLocked =
                        isCompleted && latestApp.status !== "REJECTED"; // Allow edit if rejected? User said "until approval not come... do not give". implies strict lock.

                      return (
                        <li key={subItem.name}>
                          <button
                            className={`w-full px-4 py-2 flex items-center justify-between text-sm font-medium rounded-lg transition-all duration-200 ${
                              activeSection === subItem.name
                                ? "text-[#891737] bg-[#891737]/5"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                            onClick={() => {
                              if (isLocked) {
                                showAlert({
                                  type: "success",
                                  title: "Form Submitted",
                                  message:
                                    "You have successfully filled this form. Please wait for approval.",
                                  confirmText: "Understood",
                                });
                              } else {
                                setActiveSection(subItem.name);
                                setIsSidebarOpen(false);
                              }
                            }}
                          >
                            <span>{subItem.name}</span>
                            {isCompleted && (
                              <span className="text-green-600 bg-green-50 rounded-full p-0.5">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            )}
          </ul>
        </nav>

        {/* User Info Section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={UserAvatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-100 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-[#891737] rounded-lg hover:bg-[#891737]/90 transition-all duration-200 flex items-center justify-center"
          >
            <IoIosLogOut className="mr-2 text-base" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Topbar - Clean Design */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {activeSection}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
            <img
              src={UserAvatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-100 object-cover"
            />
          </div>
        </div>

        {/* Dynamic Section Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
