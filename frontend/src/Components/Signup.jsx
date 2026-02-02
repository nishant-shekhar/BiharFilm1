import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Signupimg from "../assets/Signupimg.svg";
import Adminsvgg from "../assets/adminsvgg.svg";
import Logo from "/Logo1.png";
import { MdEmail, MdCheckCircle, MdCancel } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import { FaUser, FaEye, FaEyeSlash, FaInfoCircle } from "react-icons/fa"; // Added FaInfoCircle
import { IoClose } from "react-icons/io5"; // Added IoClose for modal
import api from "./axios"; // ✅ Import api instance
import AlertBox from "./AlertBox"; // Import AlertBox

const SignupPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false); // State for info popup

  // AlertBox State
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onClose: () => setAlertState((prev) => ({ ...prev, isOpen: false })),
  });

  // Controlled Inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation State
  const [emailValid, setEmailValid] = useState(null); // null = not checked, true/false
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });
  const [passwordsMatch, setPasswordsMatch] = useState(null);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    setPasswordCriteria({
      length: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[@$!%*?&]/.test(pwd),
    });
  }, [formData.password]);

  // Real-time Password Match
  useEffect(() => {
    if (formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordsMatch(null);
    }
  }, [formData.password, formData.confirmPassword]);

  const isPasswordStrong = Object.values(passwordCriteria).every(Boolean);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Final Validation Check
    if (!formData.name.trim()) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Missing Name",
        message: "Please enter your name.",
        onClose: () => setAlertState((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    if (!selectedRole) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Role Required",
        message: "Please select a role before signing up.",
        onClose: () => setAlertState((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    if (!emailValid) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Invalid Email",
        message: "Please enter a valid email address.",
        onClose: () => setAlertState((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    if (!isPasswordStrong) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Weak Password",
        message: "Password does not meet all security requirements.",
        onClose: () => setAlertState((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    if (!passwordsMatch) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Password Mismatch",
        message: "Passwords do not match!",
        onClose: () => setAlertState((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    try {
      setLoading(true);
      console.log("📤 Signing up user...");

      // ✅ Use api instance - cookies will be set automatically
      const res = await api.post("/api/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: selectedRole,
      });

      console.log("✅ Signup successful:", res.data);

      setAlertState({
        isOpen: true,
        type: "success",
        title: "Account Created Successfully",
        message:
          "Your account has been created. Please proceed to your dashboard.",
        confirmText: "Go to Your Account",
        onConfirm: () => {
          setAlertState((prev) => ({ ...prev, isOpen: false }));
          // Navigate based on role
          if (selectedRole.toLowerCase() === "vendor") {
            navigate("/vendor-dashboard");
          } else {
            navigate("/dashboard-user");
          }
        },
        onClose: () => setAlertState((prev) => ({ ...prev, isOpen: false })),
      });
    } catch (error) {
      console.error("❌ Signup failed:", error);
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Signup Failed",
        message:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        onClose: () => setAlertState((prev) => ({ ...prev, isOpen: false })),
      });
    } finally {
      setLoading(false);
    }
  };

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
      {fulfilled ? <MdCheckCircle className="text-xs" /> : null}
      {text}
    </span>
  );

  return (
    <div className="flex h-screen w-full items-center justify-center px-4 relative">
      <img
        src="/Bgg.svg"
        alt="Background"
        className="fixed inset-0 w-full h-full object-cover opacity-60 z-[-1]"
      />

      <div className="flex max-w-5xl w-full h-auto md:h-[85vh] md:max-h-[800px] lg:max-h-[900px] rounded-3xl bg-white shadow-2xl overflow-hidden transition-all duration-300">
        {/* Left Graphic */}
        {/* Left Graphic */}
        <div className="hidden w-1/2 bg-zinc-100 relative md:flex items-center justify-center overflow-hidden">
          <img
            src="signup.png"
            alt="Signup"
            className="w-full h-full object-cover absolute inset-0"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 relative flex flex-col">
          {/* Sticky Header (Logo + Title + Help) */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100 px-6 md:px-8 lg:px-12 pt-6 pb-4">
            {/* Top Right Help Button */}
            <button
              onClick={() => setShowInfoPopup(true)}
              className="absolute top-6 right-6 p-2 text-gray-500 hover:text-[#a92b43] bg-gray-100 hover:bg-[#a92b43]/10 rounded-full transition-all duration-300"
              title="Registration Information"
              type="button"
            >
              <FaInfoCircle size={18} />
            </button>

            {/* Logo */}
            <div className="flex justify-center">
              <img src={Logo} alt="Logo" className="w-24 object-contain" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-4 text-center tracking-tight">
              Create your account
            </h2>
          </div>

          {/* Scrollable Form Area (starts from I AM) */}
          <div className="flex-1 overflow-y-auto px-6 md:px-8 lg:px-12 py-6">
            <form onSubmit={handleSignup} className="space-y-5">
              {/* Role Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    I am a
                  </label>

                  {/* ✅ i marker near I AM */}
                  <button
                    type="button"
                    onClick={() => setShowInfoPopup(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#a92b43] bg-gray-100 hover:bg-[#a92b43]/10 border border-gray-200 px-2.5 py-1 rounded-full transition-all"
                    title="See role guidelines"
                  >
                    <span className="w-4 h-4 inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-[10px] font-bold">
                      i
                    </span>
                    Info
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Producer", value: "filmmaker" },
                    { label: "Vendor", value: "vendor" },
                    { label: "Performer", value: "artist" },
                  ].map((roleOption) => (
                    <button
                      key={roleOption.value}
                      type="button"
                      onClick={() => setSelectedRole(roleOption.value)}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                        selectedRole === roleOption.value
                          ? "border-[#a92b43] bg-[#a92b43] text-white shadow-md transform scale-[1.02]"
                          : "border-gray-200 text-gray-600 hover:border-[#a92b43]/50 hover:bg-gray-50"
                      }`}
                    >
                      {roleOption.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50/30 px-4 py-3 pl-11 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#a92b43] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#a92b43]/10 transition-all duration-200"
                    placeholder="e.g. Abhishek Anand"
                    required
                  />
                  <span className="absolute text-lg left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaUser />
                  </span>
                </div>
              </div>

              {/* Email Field with Validation */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-lg border bg-gray-50/30 px-4 py-3 pl-11 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-4 transition-all duration-200 ${
                      emailValid === false
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : emailValid === true
                          ? "border-green-500 focus:border-green-500 focus:ring-green-100"
                          : "border-gray-200 focus:border-[#a92b43] focus:ring-[#a92b43]/10"
                    }`}
                    placeholder="name@example.com"
                    required
                  />
                  <span className="absolute text-lg left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <MdEmail />
                  </span>
                  {emailValid === true && (
                    <span className="absolute text-lg right-3.5 top-1/2 -translate-y-1/2 text-green-500">
                      <MdCheckCircle />
                    </span>
                  )}
                  {emailValid === false && (
                    <span
                      className="absolute text-lg right-3.5 top-1/2 -translate-y-1/2 text-red-500"
                      title="Invalid email format"
                    >
                      <MdCancel />
                    </span>
                  )}
                </div>
                {emailValid === false && (
                  <p className="text-xs text-red-500 mt-1.5 ml-1">
                    Please enter a valid email address.
                  </p>
                )}
              </div>

              {/* Password Field with Toggle & Strength Checklist */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    Password
                  </label>
                </div>
                <div className="relative mb-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50/30 px-4 py-3 pl-11 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#a92b43] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#a92b43]/10 transition-all duration-200"
                    placeholder="Create a strong password"
                    required
                    autoComplete="new-password"
                  />
                  <span className="absolute text-lg left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <IoIosLock />
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Enhanced Password Strength UI */}
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
                        strengthCount,
                      )}`}
                      style={{ width: `${(strengthCount / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Confirm Password Field with Toggle & Match Indicator */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full rounded-lg border bg-gray-50/30 px-4 py-3 pl-11 pr-10 text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-4 transition-all duration-200 ${
                      passwordsMatch === false
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : passwordsMatch === true
                          ? "border-green-500 focus:border-green-500 focus:ring-green-100"
                          : "border-gray-200 focus:border-[#a92b43] focus:ring-[#a92b43]/10"
                    }`}
                    placeholder="Repeat your password"
                    required
                    autoComplete="new-password"
                  />
                  <span className="absolute text-lg left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <IoIosLock />
                  </span>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {passwordsMatch === true && (
                      <MdCheckCircle className="text-green-500 text-lg" />
                    )}
                    {passwordsMatch === false && (
                      <MdCancel className="text-red-500 text-lg" />
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                {passwordsMatch === false && (
                  <p className="text-xs text-red-500 mt-1.5 ml-1">
                    Passwords do not match.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-full bg-[#a92b43] py-3.5 font-bold text-white shadow-lg shadow-[#a92b43]/30 hover:bg-[#891737] hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex justify-center items-center mt-8 text-sm uppercase tracking-wide ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#a92b43] font-medium hover:underline"
                >
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      {/* Registration Info Modal */}
      {showInfoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden animate-fadeIn scale-100 transition-all border border-gray-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-white">
              <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                  Registration Guidelines
                </h3>
                <p className="text-sm text-gray-500 mt-1 max-w-2xl">
                  Please review the role definitions below to ensure you select
                  the correct account type. Using separate email addresses is
                  mandatory for multiple accounts.
                </p>
              </div>
              <button
                onClick={() => setShowInfoPopup(false)}
                className="text-gray-400 hover:text-white bg-gray-50 hover:bg-[#a92b43] p-2 rounded-full transition-all duration-200"
              >
                <IoClose size={20} />
              </button>
            </div>

            {/* Modal Content - Clean Horizontal Grid */}
            <div className="p-8 overflow-y-auto bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                {/* Producer Column */}
                <div className="md:pr-4">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-l-4 border-[#a92b43] pl-3">
                    Producer
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    For individuals or production houses intending to{" "}
                    <strong>produce films in Bihar</strong>. This account type
                    allows you to apply for official shooting permissions, and
                    access government grants.
                  </p>
                  <div className="text-xs font-semibold text-gray-900 mb-2">
                    Key Functionalities
                  </div>
                  <ul className="text-xs text-gray-500 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1 h-1 rounded-full bg-gray-400"></span>{" "}
                      Shooting Permit Applications
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1 h-1 rounded-full bg-gray-400"></span>{" "}
                      Subsidy Management
                    </li>
                  </ul>
                </div>

                {/* Vendor Column */}
                <div className="md:px-4">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-l-4 border-[#a92b43] pl-3">
                    Vendor
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    For businesses and service providers catering to the film
                    industry. Register here to list your services and get
                    discovered by production teams.
                  </p>
                  <div className="text-xs font-semibold text-gray-900 mb-2">
                    Eligible Categories
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                    {[
                      "Studios",
                      "Editing",
                      "Animation",
                      "Costumes",
                      "Props",
                      "Catering",
                      "Equipment",
                      "Hospitality",
                      "Transport",
                      "Security",
                      "Logistics",
                      "Travel",
                    ].map((item, i) => (
                      <span key={i} className="text-xs text-gray-500 truncate">
                        • {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performer Column */}
                <div className="md:pl-4">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-l-4 border-[#a92b43] pl-3">
                    Performer
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    For artists, technicians, and creative professionals. Create
                    a portfolio to showcase your work to filmmakers and
                    recruiters.
                  </p>
                  <div className="text-xs font-semibold text-gray-900 mb-3">
                    Roles & Specializations
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Acting",
                      "Directing",
                      "Cinematography",
                      "Music",
                      "Dance",
                      "Writing",
                      "Sound Design",
                      "Editing",
                      "Art Direction",
                      "Makeup/Hair",
                      "Costume Design",
                      "VFX",
                    ].map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-gray-50 text-gray-600 text-[11px] font-medium rounded border border-gray-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Minimal */}
            <div className="px-8 py-5 border-t border-gray-50 bg-white flex justify-end">
              <button
                onClick={() => setShowInfoPopup(false)}
                className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-6 py-2 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Alert Box */}
      <AlertBox
        isOpen={alertState.isOpen}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        onClose={alertState.onClose}
        autoClose={alertState.autoClose}
        duration={alertState.duration}
        confirmText={alertState.confirmText}
        onConfirm={alertState.onConfirm}
      />
    </div>
  );
};

export default SignupPage;
