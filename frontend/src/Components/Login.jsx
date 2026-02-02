import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./axios"; // ✅ Use configured axios instance
import Bgpatter from "../assets/Bgpatter.svg";
import Adminsvgg from "../assets/adminsvgg.svg";
import { MdEmail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ Prevent default form submission
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    console.log("🔵 Login button clicked");

    try {
      console.log("📡 Sending login request...");

      // ✅ Use 'api' instance instead of axios - sends cookies automatically
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      console.log("✅ Login response:", res.data);

      if (res.data.success) {
        const user = res.data.user;

        console.log("🎉 Login successful, user role:", user.role);

        // ❌ REMOVE localStorage - we're using cookies now
        // localStorage.setItem("authToken", token);
        // localStorage.setItem("user", JSON.stringify(user));

        // Route mapping
        const roleRoutes = {
          filmmaker: "/dashboard-user",
          artist: "/dashboard-user",
          vendor: "/dashboard-user",
          admin: "/dashboard",
          district_admin: "/MainDash",
        };

        const targetRoute = roleRoutes[user.role] || "/";

        console.log("🔀 Navigating to:", targetRoute);

        // ✅ Use navigate instead of window.location for smoother transition
        setTimeout(() => {
          navigate(targetRoute, { replace: true });
        }, 100);
      } else {
        alert("Login failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);

      if (err.response) {
        if (err.response.status === 429) {
          alert("Too many login attempts. Please try again in 15 minutes.");
        } else if (
          err.response.status === 401 &&
          err.response.data?.message?.toLowerCase().includes("locked")
        ) {
          alert(err.response.data.message);
        } else {
          alert(err.response.data?.message || "Invalid credentials");
        }
      } else {
        alert("Network error or server unreachable");
      }

      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4 relative">
      {/* <button onClick={() => navigate('/')} className="absolute flex items-center gap-2 top-4 left-4 text-[10px] z-50 bg-[#a92b42] text-white px-4 py-2 rounded-full">
        <FaArrowLeftLong /> Back to Home
      </button> */}

      <img
        src="/Bgg.svg"
        alt="Background"
        className="fixed inset-0 w-full h-full object-cover opacity-60 z-[-1]"
      />

      <div className="flex max-w-5xl w-full h-[39rem] rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Left Graphic */}
        <div className="hidden w-1/2 bg-zinc-100 p-10 md:flex items-center justify-center">
          <img
            src={isAdmin ? Adminsvgg : Bgpatter}
            alt="Pattern"
            className="w-full h-auto transition-all duration-300"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14">
          <div className="flex flex-col items-center mb-6">
            {/* Logo */}
            <img
              src="/Logo1.png"
              alt="Startup Bihar Logo"
              className="w-32 mb-4"
            />

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Login in to your account
            </h2>

            {/* Two Toggle Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setIsAdmin(false)}
                className={`px-6 py-2 rounded-full border text-sm font-medium transition ${
                  !isAdmin
                    ? "border-[#a92b43] text-[#a92b43]"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setIsAdmin(true)}
                className={`px-6 py-2 rounded-full border text-sm font-medium transition ${
                  isAdmin
                    ? "border-[#a92b43] text-[#a92b43]"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* ✅ Form uses handleLogin with proper event handling */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                User ID
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 pl-10 text-sm text-gray-700 focus:border-[#a43f5c] focus:outline-none"
                  placeholder="example@gmail.com"
                  required
                  disabled={loading}
                />
                <span className="absolute text-lg left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <MdEmail />
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 pl-10 pr-10 text-sm text-gray-700 focus:border-[#a43f5c] focus:outline-none"
                  placeholder="********"
                  required
                  disabled={loading}
                  autocomplete="current-password"
                />
                <span className="absolute text-lg left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <IoIosLock />
                </span>
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {/* <div className="flex justify-end mt-1">
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#a92b43] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div> */}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mb-6 w-full rounded-full bg-[#a92b43] py-2 shadow-[0_4px_8px_#802d44] font-semibold text-white hover:bg-[#891737] active:scale-95 transition-transform duration-150 flex justify-center items-center ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#a92b43] hover:underline">
                Sign up
              </Link>
            </p>
            {/* <div className="mt-4 text-center">
              <Link
                to="/NOCguide"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#a92b43] font-medium hover:underline flex items-center justify-center gap-1"
              >
                Learn how to apply for NOC Form
                <span className="text-xs">↗</span>
              </Link>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
