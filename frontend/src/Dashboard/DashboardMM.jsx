import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Logo1 from "/src/assets/Logo1.png";
import {
  MdSpaceDashboard,
  MdPalette,
  MdStore,
  MdNotifications,
  MdDescription,
  MdLocationOn,
  MdPeople,
  MdWork,
} from "react-icons/md"; // Keeping these as fallback or unused, but primarily switching to lucide
// Actually, let's just stick to Lucide for the sidebars as requested.
import {
  LayoutDashboard,
  Palette,
  Store,
  Bell,
  FileText,
  MapPin,
  Users,
  Briefcase,
  Search,
  LogOut,
  X,
  Menu,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Dashboardactivity from "./Dashboardactivity";
import Artist from "./Artist";
import VendorDirectory from "./VendorDirectory";
import NotificationMain from "./NotificationMain";
import { IoIosLogOut } from "react-icons/io";
import TenderMain from "../Dashboard/TenderMain";
import DistrictPassword from "./DistrictManager";
import DepartmentManager from "./DepartmentManager";
import UserManager from "./UserManager";
// import FilmClubAdmin from "./FilmClubAdmin";
import AlertBox from "../Components/AlertBox";
import { motion } from "framer-motion";

import api from "../Components/axios";

const Dashboard = () => {
  console.log("🏠 Dashboard component rendered");

  useEffect(() => {
    console.log("🏠 Dashboard mounted - I'm alive!");

    return () => {
      console.log("💀 Dashboard UNMOUNTING - WHO KILLED ME?!");
      console.trace();
    };
  }, []);

  const [activeSection, setActiveSection] = useState("Overview");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [nocStats, setNocStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    showAlert({
      type: "warning",
      title: "Logout Confirmation",
      message: "Are you sure you want to logout?",
      confirmText: "Yes, Logout",
      cancelText: "Cancel",
      showCancel: true,
      onConfirm: async () => {
        try {
          await api.post("/api/auth/logout");
        } catch (error) {
          console.error("Logout API call failed:", error);
        }

        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userData");
        localStorage.removeItem("nocApplications");

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
      },
    });
  };

  useEffect(() => {
    const fetchNocStats = async () => {
      try {
        const { data } = await api.get("/api/adminApplication/allApplications");

        const applications = data.data || [];

        const stats = {
          total: applications.length,
          approved: applications.filter(
            (app) => app.status?.toUpperCase() === "APPROVED",
          ).length,
          pending: applications.filter(
            (app) =>
              app.status?.toUpperCase() === "SUBMITTED" ||
              app.status?.toUpperCase() === "FORWARDED",
          ).length,
          rejected: applications.filter(
            (app) => app.status?.toUpperCase() === "REJECTED",
          ).length,
        };

        setNocStats(stats);
      } catch (error) {
        console.error("Failed to fetch NOC stats:", error);
      }
    };

    fetchNocStats();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "Overview":
        return (
          <>
            {/* Metrics Overview Section */}
            <section className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Applications"
                  value={nocStats.total}
                  icon={<FileText className="h-5 w-5" />}
                  color="text-gray-600"
                  bgColor="bg-gray-50"
                />
                <MetricCard
                  title="Approved"
                  value={nocStats.approved}
                  icon={<CheckCircle className="h-5 w-5" />}
                  color="text-green-600"
                  bgColor="bg-green-50"
                />
                <MetricCard
                  title="Pending"
                  value={nocStats.pending}
                  icon={<Clock className="h-5 w-5" />}
                  color="text-amber-600"
                  bgColor="bg-amber-50"
                />
                <MetricCard
                  title="Rejected"
                  value={nocStats.rejected}
                  icon={<XCircle className="h-5 w-5" />}
                  color="text-red-600"
                  bgColor="bg-red-50"
                />
              </div>
            </section>

            {/* Activity section */}
            <Dashboardactivity searchQuery={searchQuery} />
          </>
        );
      case "Artist":
        return <Artist searchQuery={searchQuery} />;
      case "Vendor Directory":
        return <VendorDirectory searchQuery={searchQuery} />;
      case "Notifications":
        return <NotificationMain searchQuery={searchQuery} />;
      case "Tender":
        return <TenderMain searchQuery={searchQuery} />;
      case "District Manager":
        return <DistrictPassword searchQuery={searchQuery} />;
      case "User Manager":
        return <UserManager searchQuery={searchQuery} />;

      case "Department Manager":
        return <DepartmentManager searchQuery={searchQuery} />;
      // case "Film Club":
      //   return <FilmClubAdmin searchQuery={searchQuery} />;
      case "Deleted":
        return (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-lg mb-4">
              <span className="text-3xl">🚧</span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Under Construction
            </h3>
            <p className="text-sm text-gray-600">
              The <strong>{activeSection}</strong> section is currently being
              developed.
            </p>
          </div>
        );
      default:
        return <p>Invalid section selected</p>;
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-800 overflow-hidden">
      <AlertBox {...alertConfig} onClose={closeAlert} />
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white
        flex flex-col
        border-r border-gray-100
        shadow-xl lg:shadow-none
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo Section */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={Logo1} alt="Logo" className="h-10 w-auto" />
              <span className="text-[9px] font-bold text-gray-700 leading-tight uppercase max-w-[120px]">
                BIHAR STATE FILM DEVELOPMENT & FINANCE CO. LTD
              </span>
            </div>
            <button
              className="lg:hidden w-8 h-8 text-xs rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto">
          <ul className="space-y-1">
            {[
              { label: "Overview", icon: LayoutDashboard },
              { label: "Artist", icon: Palette },
              { label: "Vendor Directory", icon: Store },
              { label: "Notifications", icon: Bell },
              { label: "Tender", icon: FileText },
              { label: "District Manager", icon: MapPin },
              { label: "User Manager", icon: Users },
              { label: "Department Manager", icon: Briefcase },
            ].map((item, idx) => {
              const isActive = activeSection === item.label;
              return (
                <li key={idx}>
                  <button
                    className={`w-full px-4 py-2 flex items-center justify-between text-[13px] font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? "text-rose-600 bg-rose-50/80"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/60"
                    }`}
                    onClick={() => {
                      setActiveSection(item.label);
                      setSidebarOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <item.icon
                        size={18}
                        strokeWidth={1.5}
                        className={isActive ? "text-rose-600" : "text-gray-500"}
                      />
                      <span className="truncate whitespace-nowrap">
                        {item.label}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Help Section */}
        <div className="p-4 mt-auto">
          <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
            <p className="text-[11px] font-semibold text-gray-500 mb-1">
              Need help?
            </p>
            <a
              href="mailto:biharfilmnigam@gmail.com"
              className="text-[11px] font-medium text-rose-600 hover:rose-700 transition-colors block mb-4"
            >
              biharfilmnigam@gmail.com
            </a>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-gray-500 hover:text-rose-600 transition-colors text-xs font-medium px-1"
            >
              <IoIosLogOut size={16} />
              <span>Logout from session</span>
            </button>
          </div>

          <div className="mt-4 px-1 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 font-bold text-xs">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-gray-900 truncate">
                Admin User
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                admin@bsfdfc.com
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>

              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {activeSection}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <motion.div
                className="hidden md:flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg transition-colors"
                initial={{ width: 220 }}
                whileHover={{ width: 300, borderColor: "#d1d5db" }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  width: isSearchFocused ? 400 : 220,
                  borderColor: isSearchFocused ? "#891737" : "#e5e7eb",
                  boxShadow: isSearchFocused
                    ? "0 4px 12px rgba(0,0,0,0.1)"
                    : "none",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <Search
                  className={`w-4 h-4 ${
                    isSearchFocused ? "text-[#891737]" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder={
                    isSearchFocused
                      ? "Search vendors, artists, locations..."
                      : "Search..."
                  }
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-gray-900 placeholder-gray-400 placeholder:text-[10px]"
                />
              </motion.div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-[#891737] text-white rounded-lg text-sm font-medium hover:bg-[#891737]/90 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg focus-within:border-gray-300">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm flex-1 text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 lg:py-8">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

const MetricCard = ({ title, value, icon, color, bgColor }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-colors">
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

export default Dashboard;
