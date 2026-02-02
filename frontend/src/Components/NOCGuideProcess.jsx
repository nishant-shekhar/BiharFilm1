import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe,
    UserPlus,
    LogIn,
    LayoutDashboard,
    FileText,
    Eye,
    Download,
    CheckCircle,
    ChevronRight,
    ChevronLeft,
    Play,
    ArrowRight,
    User,
    Film,
    Lock,
    Sparkles,
} from "lucide-react";
import Navbar from "./Navbar";
import ContactUs from "../NavigationCards/ContactUs";

const NOCGuideProcess = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [activeTab, setActiveTab] = useState("NOC Guide");

    const steps = [
        {
            id: 1,
            title: "Visit the Website",
            description: "Navigate to film.bihar.gov.in",
            icon: <Globe className="w-5 h-5" />,
            details: "Open your web browser and go to film.bihar.gov.in to begin your NOC application journey.",
            action: "Visit film.bihar.gov.in",
            screenshot: "https://res.cloudinary.com/dgra109xv/image/upload/v1764604316/visitTheWebsite_oy5dh0.png", // Your screenshot path
        },
        {
            id: 2,
            title: "Click Register",
            description: "Find and click the Register button",
            icon: <UserPlus className="w-5 h-5" />,
            details: "Look for the Register button prominently displayed on the navigation bar or landing page.",
            action: "Click 'Register'",
            screenshot: "https://res.cloudinary.com/dgra109xv/image/upload/v1764604312/clickRegister_rs6nup.png",
        },
        {
            id: 3,
            title: "Navigate to Signup",
            description: "Access the signup form",
            icon: <User className="w-5 h-5" />,
            details: "Click on the Signup option to proceed with creating your filmmaker account.",
            action: "Click 'Signup'",
            screenshot: "https://res.cloudinary.com/dgra109xv/image/upload/v1764604312/completeSignUpForm_crs2q4.png",
        },
        {
            id: 4,
            title: "Complete Signup Form",
            description: "Fill in your registration details",
            icon: <Film className="w-5 h-5" />,
            details: [
                "Choose Role: Select 'Filmmaker'",
                "Enter Full Name: Your complete legal name",
                "Email: Valid email address",
                "Password: Minimum 6 characters",
                "Confirm Password: Re-enter password",
            ],
            action: "Complete Signup",
            screenshot: "https://res.cloudinary.com/dgra109xv/image/upload/v1764604312/completeSignUpForm_crs2q4.png",
        },
        {
            id: 5,
            title: "Login Redirect",
            description: "Redirected to login page",
            icon: <LogIn className="w-5 h-5" />,
            details: "After successful registration, the system will redirect you to the login page.",
            action: "Proceed to Login",
            screenshot: "https://res.cloudinary.com/dgra109xv/image/upload/v1764604313/NavigateToSignup_xgtacu.png",
        },
        {
            id: 6,
            title: "Enter Credentials",
            description: "Login with your email and password",
            icon: <Lock className="w-5 h-5" />,
            details: "Enter your email address and password that you used during registration, then click Login.",
            action: "Login to Dashboard",
            screenshot: "https://res.cloudinary.com/dgra109xv/image/upload/v1764604313/EnterCredentials_pv9gdw.png",
        },
        {
            id: 7,
            title: "Access Dashboard",
            description: "Welcome to your dashboard",
            icon: <LayoutDashboard className="w-5 h-5" />,
            details: "You'll be redirected to your personal dashboard where you can manage all NOC applications.",
            action: "View Dashboard",
            screenshot: "https://res.cloudinary.com/dgra109xv/image/upload/v1764604309/AccessDashboard_tsvfce.png",
        },
        {
            id: 8,
            title: "Apply for NOC",
            description: "Click 'Apply NOC' from sidebar",
            icon: <FileText className="w-5 h-5" />,
            details: "Locate the 'Apply NOC' option in the left navigation menu and click to start.",
            action: "Start Application",
            screenshot: "https://res.cloudinary.com/dgra109xv/image/upload/v1764604313/ApplyforNOC_bdibha.png",
        },
        {
            id: 9,
            title: "Fill NOC Form",
            description: "Complete all required sections",
            icon: <CheckCircle className="w-5 h-5" />,
            details: [
                "Project Information",
                "Production House Details",
                "Applicant Details",
                "Creative & Cast Information",
                "Technical Specifications",
                "Legal & Branding",
                "Declaration",
                "Annexure A",
            ],
            action: "Fill Complete Form",
            screenshot: "https://res.cloudinary.com/dgra109xv/image/upload/v1764604312/FillNOCForm_uklwk2.png",
        },
        {
            id: 10,
            title: "View Overview",
            description: "Check submitted applications",
            icon: <Eye className="w-5 h-5" />,
            details: "After submission, click 'Overview' in the left sidebar to see all your NOC forms.",
            action: "View Applications",
            screenshot: "https://res.cloudinary.com/dgra109xv/image/upload/v1764604315/overview_kukm0t.png",
        },
        {
            id: 11,
            title: "Check Details",
            description: "View complete form details",
            icon: <Eye className="w-5 h-5" />,
            details: "Click the eye button to view comprehensive details, status, and progress report.",
            action: "View Full Details",
            screenshot: "https://res.cloudinary.com/dgra109xv/image/upload/v1764604310/CheckDetails_rmbzxo.png",
        },
        {
            id: 12,
            title: "Download PDF",
            description: "Download your NOC form",
            icon: <Download className="w-5 h-5" />,
            details: "After viewing your form details, download a PDF copy for your records.",
            action: "Download PDF",
            screenshot: "https://res.cloudinary.com/dgra109xv/image/upload/v1764604311/DownloadPDF_bnqfhv.png",
        },
    ];

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (index) => {
        setCurrentStep(index);
    };

    const progressPercentage = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Compact Hero */}
            <div
                className="relative bg-cover bg-center bg-no-repeat text-white py-16 px-6"
                style={{
                    backgroundImage: `linear-gradient(to right, #00000063), url('/nocFormGuide.png')`
                }}
            >
                <div className="max-w-6xl mx-auto text-center p-12
            ">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Navbar />
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            How to Apply for NOC Form
                        </h1>
                        <p className="text-white/90 text-sm">
                            Step-by-step guide for filmmakers in Bihar
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="max-w-6xl mx-auto px-6 mt-8 mb-8">
                <div className="flex items-center gap-4 border-b border-gray-200">
                    {[ "Operational Guideline"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 text-sm font-semibold relative transition-colors ${activeTab === tab
                                ? "text-[#891737]"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#891737]"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "NOC Guide" ? (
                    <motion.div
                        key="noc-guide"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Required Documents Section */}
                        <div className="max-w-6xl mx-auto px-6 relative z-10 mb-12">
                            <div className="bg-white rounded-xl  border border-gray-200 p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-[#891737]" />
                                    Required Documents
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        {
                                            title: "MIB Certificate",
                                            icon: <FileText className="w-6 h-6" />,
                                            desc: "In case of International Film, Web Series and TV Serials shooting - Enclose shoot Permission Certificate issued by the MIB (Ministry of Information & Broadcasting)",
                                            fullWidth: true
                                        },
                                        {
                                            title: "MEA Certificate",
                                            icon: <FileText className="w-6 h-6" />,
                                            desc: "In case of International Documentary, AV Commercial and Music Videos shooting - Enclose shoot Permission Certificate issued by the MEA (Ministry of External Affairs)",
                                            fullWidth: true
                                        },
                                        { title: "Signature", icon: <User className="w-6 h-6" />, desc: "Digital or Scanned" },
                                        { title: "Seal", icon: <CheckCircle className="w-6 h-6" />, desc: "Official Company Seal" },
                                    ].map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-[#891737]/30 hover:shadow-md transition-all ${item.fullWidth ? 'md:col-span-2' : ''}`}
                                        >
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#891737] shadow-sm flex-shrink-0">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>


                        {/* Main Content - Compact Layout */}
                        <div className="max-w-6xl mx-auto px-6 py-8">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {/* Compact Sidebar */}
                                <div className="lg:col-span-1">
                                    <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                            Steps
                                        </h3>
                                        <div className="space-y-1">
                                            {steps.map((step, index) => (
                                                <button
                                                    key={step.id}
                                                    onClick={() => goToStep(index)}
                                                    className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all duration-200 ${currentStep === index
                                                        ? "bg-[#891737] text-white"
                                                        : currentStep > index
                                                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                                        }`}
                                                >
                                                    <div
                                                        className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-bold ${currentStep === index
                                                            ? "bg-white/20"
                                                            : currentStep > index
                                                                ? "bg-green-200"
                                                                : "bg-gray-200"
                                                            }`}
                                                    >
                                                        {currentStep > index ? (
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                        ) : (
                                                            step.id
                                                        )}
                                                    </div>
                                                    <p className="text-xs font-medium truncate">
                                                        {step.title}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Main Step Content */}
                                <div className="lg:col-span-3">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentStep}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                                        >
                                            {/* Compact Header */}
                                            <div className="bg-gradient-to-r from-[#891737] to-[#a92b4e] p-5 text-white">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                                        {steps[currentStep].icon}
                                                    </div>
                                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                                                        {currentStep + 1}/{steps.length}
                                                    </span>
                                                </div>
                                                <h2 className="text-xl font-bold mb-1">
                                                    {steps[currentStep].title}
                                                </h2>
                                                <p className="text-white/90 text-sm">
                                                    {steps[currentStep].description}
                                                </p>
                                            </div>

                                            {/* Content Grid */}
                                            <div className="p-5">
                                                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                                                    {/* Bigger Screenshot - Left Side */}
                                                    <div className="md:col-span-3">
                                                        <motion.div
                                                            initial={{ scale: 0.95, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ delay: 0.1 }}
                                                            className="relative group"
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-br from-[#891737]/20 to-[#a92b4e]/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                                                            <div className="relative rounded-xl overflow-hidden border-2 border-gray-300 group-hover:border-[#891737] transition-all">
                                                                {steps[currentStep].screenshot ? (
                                                                    <img
                                                                        src={steps[currentStep].screenshot}
                                                                        alt={steps[currentStep].title}
                                                                        className="w-full h-full object-cover aspect-video"
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                            e.target.nextSibling.style.display = 'flex';
                                                                        }}
                                                                    />
                                                                ) : null}
                                                                {/* Fallback placeholder */}
                                                                <div
                                                                    className="bg-gradient-to-br from-gray-100 to-gray-200 aspect-video flex items-center justify-center"
                                                                    style={{ display: steps[currentStep].screenshot ? 'none' : 'flex' }}
                                                                >
                                                                    <div className="text-center">
                                                                        <div className="w-16 h-16 bg-white rounded-xl shadow-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                            {steps[currentStep].icon}
                                                                        </div>
                                                                        <p className="text-gray-600 font-medium text-sm">
                                                                            Screenshot
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {steps[currentStep].title}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>

                                                        {/* Action Button */}
                                                        <motion.button
                                                            initial={{ scale: 0.9, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ delay: 0.2 }}
                                                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#891737] to-[#a92b4e] text-white rounded-lg font-semibold group"
                                                        >
                                                            <span className="text-sm">{steps[currentStep].action}</span>

                                                        </motion.button>
                                                    </div>

                                                    {/* Compact Details - Right Side */}
                                                    <div className="md:col-span-2">
                                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 h-full">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <Sparkles className="w-4 h-4 text-[#891737]" />
                                                                <h3 className="text-sm font-bold text-gray-900">
                                                                    Instructions
                                                                </h3>
                                                            </div>
                                                            {Array.isArray(steps[currentStep].details) ? (
                                                                <ul className="space-y-2">
                                                                    {steps[currentStep].details.map((detail, idx) => (
                                                                        <motion.li
                                                                            key={idx}
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            transition={{ delay: idx * 0.05 }}
                                                                            className="flex items-start gap-2 text-gray-700"
                                                                        >
                                                                            <div className="w-5 h-5 bg-[#891737] rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                                <CheckCircle className="w-3 h-3 text-white" />
                                                                            </div>
                                                                            <span className="text-xs leading-relaxed">
                                                                                {detail}
                                                                            </span>
                                                                        </motion.li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <motion.p
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    className="text-xs text-gray-700 leading-relaxed"
                                                                >
                                                                    {steps[currentStep].details}
                                                                </motion.p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Compact Footer */}
                                            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                                <button
                                                    onClick={prevStep}
                                                    disabled={currentStep === 0}
                                                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                    Previous
                                                </button>

                                                {currentStep === steps.length - 1 ? (
                                                    <button className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Complete
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={nextStep}
                                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#891737] to-[#a92b4e] text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                                                    >
                                                        Next
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                   <motion.div
    key="operational-guideline"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="max-w-6xl mx-auto px-6 py-12"
  >
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-sm font-bold text-gray-600 mb-2">
        Operational Guidelines
      </h2>
      <p className="text-gray-400 text-xs max-w-xl mx-auto">
        Download the detailed operational guidelines and procedures for
        the NOC application process.
      </p>

      {/* Download Operational Guideline Button */}
      <button
        onClick={() => {
          const link = document.createElement("a");
          link.href = "/OpGuidelineFilms.pdf"; // keep file in public/ folder
          link.download = "Operational_Guidelines.pdf";
          link.click();
        }}
        className="mt-6 bg-[#4f0419] hover:bg-[#891737] text-white text-base sm:text-lg font-medium px-8 py-3 rounded-full shadow-xl transition-all duration-300 hover:shadow-[#a92b4e]/50 hover:scale-105 inline-flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Download Operational Guideline
      </button>
    </div>
  </motion.div>
                )}
            </AnimatePresence>
            <ContactUs />
        </div>
    );
};

export default NOCGuideProcess;
