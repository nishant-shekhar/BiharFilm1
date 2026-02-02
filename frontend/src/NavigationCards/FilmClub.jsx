import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CiCoffeeCup } from "react-icons/ci";
import { RiFilmAiFill, RiMovie2Line } from "react-icons/ri";
import { IoIosArrowRoundForward } from "react-icons/io";
import "../App.css";

const FilmClubUI = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Coffee With Film",
      description:
        "Think critically to improve young people's imagination and creativity skills through cinematic discussions.",
      icon: <CiCoffeeCup className="text-white text-3xl" />,
      slug: "coffee-with-film",
    },
    {
      title: "Cine Samvad",
      description:
        "Explore engaging content and the vibrant film industry of Bihar through interactive sessions.",
      icon: <RiFilmAiFill className="text-white text-3xl" />,
      slug: "cine-samvad",
    },
    {
      title: "Cine Activites",
      description:
        "Engage in detailed movie discussions with presentations, embedded clips, and interactive worksheets.",
      icon: <RiMovie2Line className="text-white text-3xl" />,
      slug: "cineactivities",
    },
  ];

  return (
    <div
      id="FilmClubUI"
      className="relative w-full min-h-screen bg-[#190108] flex flex-col items-center justify-start md:justify-center px-4 py-20 md:py-8 overflow-y-auto md:overflow-hidden"
    >
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/Filmclub.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-[#190108]/70 backdrop-blur-[1px]" />
      </div>

      {/* Header Section - Compact */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center text-white max-w-3xl mb-8"
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl great-vibes-regular mb-3 text-white drop-shadow-2xl">
          FilmClub
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
          Discover, explore, and celebrate the art of cinema through immersive
          experiences and meaningful conversations.
        </p>
      </motion.div>

      {/* Cards Grid - Simplified */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl px-4">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{ y: -6 }}
            className="group relative cursor-pointer"
            onClick={() => navigate(`/filmclub/${card.slug}`)}
          >
            {/* Simple Card Container */}
            <div className="relative h-[320px] overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-all duration-300 group-hover:border-white/40 group-hover:shadow-2xl">
              {/* Card Content */}
              <div className="relative h-full p-6 flex flex-col justify-between z-10">
                {/* Icon and Number Section */}
                <div className="flex items-start justify-between">
                  {/* Simple Icon */}
                  <div className="w-12 h-12 bg-[#4f0419] flex items-center justify-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105">
                    {card.icon}
                  </div>

                  {/* Number Badge */}
                  <div className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
                    <span className="text-xs font-medium text-white/70">
                      0{index + 1}
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 mt-5 mb-4">
                  <h2 className="text-xl font-bold text-white mb-2.5">
                    {card.title}
                  </h2>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Simple CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-sm font-medium text-gray-300 transition-all duration-300 group-hover:text-white">
                    Explore Program
                  </span>

                  {/* Simple Arrow */}
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/20 transition-all duration-300 group-hover:bg-[#4f0419] group-hover:border-[#4f0419] group-hover:translate-x-1">
                    <IoIosArrowRoundForward className="text-xl text-white" />
                  </div>
                </div>
              </div>

              {/* Simple Shine Effect on Hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FilmClubUI;
