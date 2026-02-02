import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "./axios.js";
import Lottie from "lottie-react";

const ProtectedRoute = ({ allowedRoles }) => {
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [animationData, setAnimationData] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    console.log("🔍 ProtectedRoute: useEffect triggered");

    if (hasFetched.current) {
      console.log("⚠️ Already fetched, skipping");
      return;
    }
    hasFetched.current = true;

    // Fetch animation data
    fetch("/Verification.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load animation:", err));

    const checkAuth = async () => {
      const startTime = Date.now();
      try {
        console.log("📡 Calling /api/auth/me...");
        const res = await api.get("/api/auth/me");
        console.log("✅ Auth response:", res.data);
        setUser(res.data.user);
      } catch (error) {
        console.error(
          "❌ Auth check failed:",
          error.response?.status,
          error.message
        );
        setUser(null);
      } finally {
        const elapsedTime = Date.now() - startTime;
        const minDuration = 2000; // 2.5 seconds
        const remainingTime = minDuration - elapsedTime;

        if (remainingTime > 0) {
          setTimeout(() => setIsLoading(false), remainingTime);
        } else {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
  }, []);

  console.log(
    "🎯 ProtectedRoute render - user:",
    user,
    "isLoading:",
    isLoading
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">
          <Lottie
            animationData={animationData}
            loop
            autoplay
            className="w-[200px] h-[200px] sm:w-[200px] sm:h-[200px] md:w-[200px] md:h-[200px] lg:w-[200px] lg:h-[200px] xl:w-[200px] xl:h-[200px] -mt-8 sm:-mt-12 md:-mt-16 drop-shadow-2xl"
          />
          <p className="text-gray-600 ">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("🚫 No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("🚫 Wrong role, redirecting home");
    return <Navigate to="/" replace />;
  }

  console.log("✅ User authorized, rendering Outlet");
  return <Outlet />;
};

export default ProtectedRoute;
