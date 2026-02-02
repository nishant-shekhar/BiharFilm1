import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Filmclub from "/Filmclub.mp4";
import Navbar from "../../Components/Navbar";
import { IoIosArrowBack } from "react-icons/io";
import "../../App.css";

const tabData = {
  "IFFI Film Festival": [
    {
      src: "",
      title: "IFFI Participation A",
      description: "Bihar's delegates at the International Film Festival of India.",
    },
    {
      src: "",
      title: "IFFI Awards",
      description: "Showcasing award-winning entries from Bihar.",
    },
    {
      src: "",
      title: "IFFI Awards",
      description: "Showcasing award-winning entries from Bihar.",
    },
  ],
  "Children Film Festival": [
    {
      src: "",
      title: "Child Artist Workshop",
      description: "Workshops designed for children on filmmaking basics.",
    },
    {
      src: "",
      title: "Young Talents",
      description: "Screenings of children's films made by school students.",
    },
    {
      src: "",
      title: "Young Talents",
      description: "Screenings of children's films made by school students.",
    },
  ],
  "Women Film Festival": [
    {
      src: "",
      title: "Women Directors",
      description: "Celebrating women behind the camera in Bihar.",
    },
    {
      src: "",
      title: "Voices of Women",
      description: "Films highlighting women-centric narratives.",
    },
    {
      src: "",
      title: "Voices of Women",
      description: "Films highlighting women-centric narratives.",
    },
  ],
};

const tabDescriptions = {
  "IFFI Film Festival": "The Bihar Film Nigam actively participates in the Film Bazaar during the International Film Festival of India (IFFI) organized by NFDC. The objective is to promote the Bihar Film Policy and position Bihar as an attractive and film-friendly destination for national and international filmmakers.",
  "Children Film Festival": "The Corporation organizes film screenings for students of government and private schools and colleges, highlighting the role and creativity of children in cinema. The festival encourages young minds to appreciate films as a medium of learning and expression.",
  "Women Film Festival": "Every year, on the occasion of International Women’s Day, the Corporation celebrates the South Asia Women Film Festival, showcasing films based on women’s empowerment and achievements. The event emphasizes women’s contributions to cinema and promotes gender equality through the lens of art.",
};

const Chatarpatar = () => {
  const [activeTab, setActiveTab] = useState("IFFI Film Festival");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#190108] text-white overflow-hidden">
      <Navbar />

      {/* Background Video with Overlay */}
      <div className="fixed inset-0 z-0">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={Filmclub}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-[#190108]/80 backdrop-blur-[2px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-24 sm:py-32">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 text-center sm:text-left"
        >
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-[#4f0419] hover:border-[#4f0419] transition-all duration-300 mb-8 backdrop-blur-sm"
          >
            <IoIosArrowBack className="text-lg text-gray-300 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Back to Film Club</span>
          </button>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 great-vibes-regular drop-shadow-2xl text-center">
            Film Festival
          </h1>
          <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed text-center min-h-[80px]">
            {tabDescriptions[activeTab]}
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12 flex-wrap gap-4"
        >
          {Object.keys(tabData).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full border text-sm sm:text-base font-medium transition-all duration-300 backdrop-blur-sm ${activeTab === tab
                ? "bg-[#4f0419] text-white border-[#4f0419] shadow-lg shadow-[#4f0419]/30 scale-105"
                : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="wait">
            {tabData[activeTab].map((item, index) => (
              <motion.div
                key={`${activeTab}-${index}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative h-[320px] rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-[#4f0419]/20 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image Section */}
                <div className="relative h-[65%] overflow-hidden bg-gray-900">
                  {item.src ? (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#190108]">
                      <span className="text-white/20 text-4xl font-bold great-vibes-regular">Film Festival</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#190108] via-transparent to-transparent opacity-80" />
                </div>

                {/* Content Section */}
                <div className="absolute bottom-0 left-0 w-full h-[35%] p-5 flex flex-col justify-center bg-gradient-to-b from-[#190108]/90 to-[#190108]">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ff4d6d] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 group-hover:text-gray-200 transition-colors">
                    {item.description}
                  </p>
                  <div className="mt-3 w-12 h-0.5 bg-[#4f0419] rounded-full transition-all duration-500 group-hover:w-full opacity-50 group-hover:opacity-100" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Chatarpatar;
