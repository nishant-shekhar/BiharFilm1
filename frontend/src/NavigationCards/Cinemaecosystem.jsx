import React, { useState, useEffect, useRef } from "react";
import Longcards from "../Cards/Longcards";
import { IoIosArrowRoundForward } from "react-icons/io";
import { motion } from "framer-motion";
import ProductionAssets from "../Cards/ProductionAssets";
import LocalArtist from "../Cards/LocalArtist";
import LocalTechnicians from "../Cards/LocalTechnicians";
import { useLocation } from "react-router-dom";
import "../App.css";

function Cinemaecosystem() {
  const [activePopup, setActivePopup] = useState(null);
  const location = useLocation();
  const hasProcessedStateRef = useRef(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (activePopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [activePopup]);

  // Handle popup from route state (from navbar navigation)
  useEffect(() => {
    const openPopup = location && location.state && location.state.openPopup;
    if (openPopup && !hasProcessedStateRef.current) {
      // wait briefly so any scrolling triggered by the Home component can finish
      const timer = setTimeout(() => {
        setActivePopup(openPopup);
      }, 300);

      hasProcessedStateRef.current = true;

      // Clear the navigation state so it doesn't persist on refresh
      try {
        window.history.replaceState(null, document.title, window.location.pathname);
      } catch (e) {}

      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleCardClick = (popupType) => {
    setActivePopup(popupType);
  };

  const handleClose = () => {
    setActivePopup(null);
    hasProcessedStateRef.current = false;
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      id="Cinemaecosystem"
      className="relative pt-12 bg-[#190108] overflow-hidden px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 pb-18"
    >
      {/* ===== Doodle Background Layer (FIXED) ===== */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5 bg-center bg-contain bg-no-repeat"
        style={{
          backgroundImage: `url(${"/doodles.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(1.5px)",
          maskImage:
            "radial-gradient(circle at center, black 45%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 45%, transparent 100%)",
        }}
      />

      {/* ===== Heading and Description ===== */}
      <div className="text-center text-white max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-7xl tapestry-regular mb-4">
          Cinema Ecosystem
        </h2>
        <p className="text-base md:text-lg text-gray-300">
          Explore the vibrant ecosystem that supports filmmaking from props and
          production assets to local artists and technician. Each element plays
          a crucial role in shaping authentic cinematic experiences.
        </p>
      </div>

      {/* ===== Cards Section ===== */}
      <motion.div
        initial={{ opacity: 0.8, scale: 0.95 }}
        whileInView={{
          opacity: 1,
          scale: 1,
          transition: {
            duration: 1.5,
            ease: "easeInOut",
            type: "tween",
          },
        }}
        exit={{
          opacity: 0,
          y: 20,
          transition: {
            duration: 0.8,
            ease: "easeInOut",
            type: "tween",
          },
        }}
        viewport={{ amount: 0.3 }}
        className="
          flex
          flex-col items-stretch
          md:flex-row md:justify-center md:items-stretch
          gap-6 sm:gap-8 lg:gap-10
          pt-10 pb-14
          md:mx-auto md:max-w-6xl xl:max-w-7xl
        "
      >
        {/* Each card: full-width on mobile, 1/3 on md+ */}
        <div className="w-full md:basis-1/3 md:max-w-[32%]">
          <Longcards
            imageUrl="/vendor2.png"
            title="Production Assets"
            description="Access a comprehensive inventory of props and production equipment tailored for diverse cinematic requirements."
            onClick={() => handleCardClick("map")}
          />
        </div>

        <div className="w-full md:basis-1/3 md:max-w-[32%]">
          <Longcards
            imageUrl="/localArtist.png"
            title="Local Artists"
            description="Connect with a pool of talented local actors, singers, music and dance artists to bring authentic regional flavour to your productions."
            onClick={() => handleCardClick("localArtist")}
          />
        </div>

        <div className="w-full md:basis-1/3 md:max-w-[32%]">
          <Longcards
            imageUrl="/securityEcosystem.png"
            title="Local Technicians & Manpower"
            description="Ensure a secure filming environment with professional safety services and on-location security management."
            onClick={() => handleCardClick("security")}
          />
        </div>
      </motion.div>

      {/* ===== Modal Popup ===== */}
      {activePopup && (
        <div
          className="fixed inset-0 bg-black/60  flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="relative bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Content */}
            <div
              className="h-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {activePopup === "map" && (
                <ProductionAssets onClose={handleClose} />
              )}
              {activePopup === "localArtist" && (
                <LocalArtist onClose={handleClose} />
              )}
              {activePopup === "security" && (
                <LocalTechnicians onClose={handleClose} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cinemaecosystem;
