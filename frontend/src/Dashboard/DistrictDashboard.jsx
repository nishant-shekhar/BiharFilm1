import React from "react";
import "../App.css";
import Logo1 from "../assets/Logo1.png";
import Adminmam from "../assets/adminmam.svg";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import api from "../Components/axios";
import {
  FiSettings,
  FiTrash,
  FiShare2,
  FiClock,
  FiHeart,
} from "react-icons/fi";
import { MdSpaceDashboard } from "react-icons/md";

const DistrictDashboard = ({
  districtName = "Patna",
  activityOne = "Forwarded NOCs",
  activityTwo = "Under Review",
}) => {
  const navigate = useNavigate();

  const cases = [
    {
      ProjectId: 1,
      Type: "Shooting",
      Duration: "Two Months",
      Registration: "5213",
      Representative: "Mittal Kumar",
      Email: "Mittal@gmail.com",
      Start: "2023-10-15",
      End: "2023-12-15",
    },
  ];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
    localStorage.removeItem("authToken");
    alert("You have been logged out.");
    navigate("/district-login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col py-6 justify-between">
        <div>
          <div className="px-6 pb-2 border-b border-gray-200 ">
            <img src={Logo1} alt="Logo" className="h-16" />
          </div>
          <nav className="px-4 pt-6 space-y-1 text-sm font-semibold text-gray-700">
            <SidebarItem icon={<MdSpaceDashboard />} label="Overview" active />
            <SidebarItem icon={<FiClock />} label="Recent" />
            <SidebarItem icon={<FiShare2 />} label="Shared" />
            <SidebarItem icon={<FiHeart />} label="Favorites" />
          </nav>
        </div>
        <div className="px-4 pb-6 space-y-2">
          <SidebarItem icon={<FiSettings />} label="Settings" />
          <SidebarItem icon={<FiTrash />} label="Deleted" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto relative">
        {/* Top Bar */}
        <div className="fixed top-0 left-64 right-0 z-20 flex justify-between items-center px-8 py-6 bg-gray-50">
          <div>
            <h1 className="text-xl font-semibold">Overview</h1>
            <p className="text-sm text-gray-400">{today}</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 rounded-md border border-gray-300 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-[#a92b43]"
            />
            <img
              src={Adminmam}
              className="w-10 h-10 rounded-full border"
              alt="Admin"
            />
            <button
              className="group flex items-center justify-start w-9 h-9 bg-[#e7000b] rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-full active:translate-x-1 active:translate-y-1"
              onClick={handleLogout}
            >
              <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                </svg>
              </div>
              <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                Logout
              </div>
            </button>
          </div>
        </div>

        {/* Main Section */}
        <div className="mt-24 space-y-10">
          <header>
            <h2 className="text-3xl font-bold text-gray-800">
              {districtName} District Dashboard
            </h2>
            <p className="text-sm text-gray-500">
              Welcome back! Here's the latest NOC data for {districtName}{" "}
              district.
            </p>
          </header>

          {/* District Activities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#fff9db] border border-yellow-300 p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-yellow-800">
                {activityOne}
              </h4>
              <p className="text-sm mt-2 text-yellow-700">
                NOCs that have been forwarded for approval.
              </p>
            </div>
            <div className="bg-[#f3e8ff] border border-purple-300 p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-purple-800">
                {activityTwo}
              </h4>
              <p className="text-sm mt-2 text-purple-700">
                Currently under review by officials.
              </p>
            </div>
          </div>

          {/* Applied NOCs Table */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Applied NOCs</h3>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
              <table className="w-full min-w-[700px] text-sm text-gray-800">
                <thead>
                  <tr className="bg-gray-50 text-left uppercase text-gray-500 tracking-wider">
                    <th className="py-3 px-6">Project ID</th>
                    <th className="py-3 px-6">Type</th>
                    <th className="py-3 px-6">Duration</th>
                    <th className="py-3 px-6">Representative</th>
                    <th className="py-3 px-6">Start</th>
                    <th className="py-3 px-6">End</th>
                    <th className="py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((item) => (
                    <tr
                      key={item.ProjectId}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="py-2 px-6">{item.ProjectId}</td>
                      <td className="py-2 px-6">{item.Type}</td>
                      <td className="py-2 px-6">{item.Duration}</td>
                      <td className="py-2 px-6">{item.Representative}</td>
                      <td className="py-2 px-6">{item.Start}</td>
                      <td className="py-2 px-6">{item.End}</td>
                      <td className="py-2 px-6 flex gap-2">
                        <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                          Accept
                        </button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-[#4f0419]">
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active }) => (
  <a
    href="#"
    className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
      active ? "bg-pink-100 text-[#a92b43]" : "hover:bg-gray-100 text-gray-700"
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </a>
);

export default DistrictDashboard;
