// App.js
import React, { useState, useEffect } from "react";
import DistrictAdminDashboard from "./DistrictAdminDashboard";
import api from "../Components/axios";

function MainDash() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user details from API (cookies automatically sent)
    const getUserDetails = async () => {
      try {
        const response = await api.get("/api/auth/profile");
        if (response.data.success) {
          const user = response.data.user;
          setUserDetails({
            districtId: user.districtId,
            districtName: user.districtName,
            name: user.name,
            email: user.email,
            role: user.role, // Standardized to match API
            id: user.id || user._id,
            avatar: user.avatar || "/api/placeholder/40/40",
          });
        } else {
          // If API returns success: false, treat as unauthenticated
          window.location.href = "/district-login";
        }
      } catch (error) {
        console.error("Error loading user details:", error);
        // If 401 Unauthorized, redirect to login
        if (error.response?.status === 401) {
          window.location.href = "/district-login";
        }
      } finally {
        setLoading(false);
      }
    };

    getUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Please log in to continue</p>
          <button
            onClick={() => (window.location.href = "/district-login")}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <DistrictAdminDashboard userDetails={userDetails} />;
}

export default MainDash;
