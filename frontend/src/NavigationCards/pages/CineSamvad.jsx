import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../Components/Navbar";
import { IoIosArrowBack } from "react-icons/io";
import "../../App.css";

const imageData = [
  {
    src: "https://film.bihar.gov.in/img/cs1/a12.jpeg",
    title: "Session A",
    description: "Interactive discussion on storytelling and visual language.",
  },
  {
    src: "https://film.bihar.gov.in/img/cs1/b12.jpeg",
    title: "Session B",
    description: "Exploring regional cinema's impact and scope in Bihar.",
  },
  {
    src: "https://film.bihar.gov.in/img/cs1/c12.jpeg",
    title: "Session C",
    description: "Panel talk with filmmakers and critics.",
  },
  {
    src: "https://film.bihar.gov.in/img/cs1/d12.jpeg",
    title: "Session D",
    description: "Youth participation in cinematic arts.",
  },
  {
    src: "https://film.bihar.gov.in/img/cs1/e12.jpeg",
    title: "Session E",
    description: "Understanding the cultural lens in film narratives.",
  },
  {
    src: "https://film.bihar.gov.in/img/cs1/f12.jpeg",
    title: "Session F",
    description: "Workshops on screenwriting and editing basics.",
  },
  {
    src: "https://film.bihar.gov.in/img/cs1/g12.jpeg",
    title: "Session G",
    description: "Short film screenings by local artists.",
  },
  {
    src: "https://film.bihar.gov.in/img/cs1/h12.jpeg",
    title: "Session H",
    description: "Behind-the-scenes of documentary production.",
  },
];

const CineSamvad = () => {
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
          src="/Filmclub.mp4"
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
          className="mb-12 flex flex-col items-center text-center"
        >
          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 great-vibes-regular drop-shadow-2xl">
            Cine-Samvad Sessions
          </h1>
          <p className="text-gray-300 text-sm max-w-4xl mx-auto leading-relaxed text-center">
            An initiative by the Corporation to facilitate interactive sessions
            where filmmakers, film students, and film enthusiasts meet to
            brainstorm ideas for development of the film industry in Bihar, the
            efforts to find solutions to the current problems along with the
            necessary changes and the need to find new ways to achieve the
            purpose of overall development of Bihar
          </p>
        </motion.div>

        {/* Grid of Sessions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {imageData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative h-[320px] rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-[#4f0419]/20 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Section */}
              <div className="relative h-[65%] overflow-hidden bg-[#190108] flex items-center justify-center">
                <h3 className="text-3xl sm:text-4xl md:text-5xl text-gray-500 great-vibes-regular transform -rotate-12 select-none">
                  CineSamvad
                </h3>
                <div className="absolute inset-0 bg-gradient-to-t from-[#190108] via-transparent to-transparent opacity-80" />
              </div>

              {/* Content Section */}
              <div className="absolute bottom-0 left-0 w-full h-[35%] p-5 flex flex-col justify-center bg-gradient-to-b from-[#190108]/90 to-[#190108]">
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#ff4d6d] transition-colors">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-400 line-clamp-2 group-hover:text-gray-200 transition-colors">
                  {item.description}
                </p>
                <div className="mt-3 w-12 h-0.5 bg-[#4f0419] rounded-full transition-all duration-500 group-hover:w-full opacity-50 group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CineSamvad;
