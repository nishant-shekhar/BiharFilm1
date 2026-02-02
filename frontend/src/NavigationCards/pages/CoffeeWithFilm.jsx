import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Filmclub from "/Filmclub.mp4";
import Navbar from "../../Components/Navbar";
import { IoIosArrowBack } from "react-icons/io";
import "../../App.css";

const sessions = [
  {
    title: "12 May 2023 (Azad Vartaman ka ek din & Dharti ke bhagwan)",
    url: "https://deshkiupasana.com/wp-content/uploads/2023/05/3-7.jpg",
  },
  // {
  //   title: "07 October 2022 (Womeniya Rhythm of change)",
  //   url: "https://scontent.fccu19-1.fna.fbcdn.net/v/t39.30808-6/481675854_9334464953258667_4474150743020995038_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=BjXYQztWv0cQ7kNvwG2al3h&_nc_oc=Adnkh9-lrjXCvaortlFs5zquRaETWI-7vAslH2omW4xWr9nlh6AFeeSwIEeZ2LiG-wk&_nc_zt=23&_nc_ht=scontent.fccu19-1.fna&_nc_gid=wq4g6nkiZI1sPswRzkpRTw&oh=00_AfMlxeyu1GBHqqjTyUcnx9BklLHD7wgrhDDetCS4Yb5XZg&oe=6865769E",
  // },
  {
    title: "07 September 2022 (Sumi)",
    url: "https://akamaividz2.zee5.com/image/upload/w_480,h_270,c_scale,f_webp,q_auto:eco/resources/0-1-6z5213766/list/000002372ab2b04fd67b424491e7c3e40b5042d0.jpg",
  },
  {
    title: "07 July 2022 (Peepli Live)",
    url: "https://ksboxoffice.com/wp-content/uploads/2020/11/21672-1024x575.jpg",
  },
  {
    title: "07 June 2022 (Manjhi - The Mountain Man)",
    url: "https://i0.wp.com/nasheman.in/wp-content/uploads/2015/09/Manjhi-the-Mountain.jpg",
  },
  {
    title: "27 January 2017 (Road To Sangam)",
    url: "https://m.media-amazon.com/images/S/pv-target-images/b4b6762d6161f87de6a3d3f0773bf2d0b99e9ad7b1e8442d9f2d1ef6ee1289eb._SX1080_FMjpg_.jpg",
  },
  {
    title: "27 August 2016 (Nil Battey Sannata)",
    url: "https://www.colouryellow.com/wp-content/uploads/2021/11/6-sheeter_Nil-battey-sannata-merged-1.jpg",
  },
  {
    title: "29 July 2016 (Antardwand)",
    url: "https://m.media-amazon.com/images/S/pv-target-images/3eefa43c3505b739aeb844f038a46fcb49ecd9a2753ac401f02128b9f6aa59a1.jpg",
  },
  {
    title: "24 June 2016 (Dulha)",
    url: "https://upload.wikimedia.org/wikipedia/commons/6/60/Indian_bride-groom_%288925311033%29.jpg",
  },
  {
    title: "27 May 2016 (Handover)",
    url: "https://m.media-amazon.com/images/M/MV5BZjllN2VhNTYtM2YyYS00MzA1LTk4NTYtM2YxZmI3Nzc1OTY4XkEyXkFqcGc@._V1_.jpg",
  },
];

const CoffeeWithFilm = () => {
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
          className="mb-12 flex flex-col items-center text-center"
        >
          {/* Back Button
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-[#4f0419] hover:border-[#4f0419] transition-all duration-300 mb-8 backdrop-blur-sm"
          >
            <IoIosArrowBack className="text-lg text-gray-300 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              Back to Film Club
            </span>
          </button> */}

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 great-vibes-regular drop-shadow-2xl">
            Coffee with Film
          </h1>
          <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed text-center">
            A unique interactive platform where film producers and directors
            from Bihar showcase their films and share their filmmaking journeys.
            The audience gets an opportunity to interact with the filmmakers,
            gain insights into the creative process, and understand the
            challenges faced during film production.
          </p>
        </motion.div>

        {/* Grid of Sessions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sessions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative h-[320px] rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-[#4f0419]/20 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Section */}
              <div className="relative h-[65%] overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#190108] via-transparent to-transparent opacity-80" />

                {/* Date Badge (extracted from title if possible, or just a generic icon) */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                </div>
              </div>

              {/* Content Section */}
              <div className="absolute bottom-0 left-0 w-full h-[35%] p-5 flex flex-col justify-center bg-gradient-to-b from-[#190108]/90 to-[#190108]">
                <h2 className="text-base font-medium text-white/90 leading-snug line-clamp-2 group-hover:text-white transition-colors">
                  {item.title}
                </h2>
                <div className="mt-3 w-12 h-0.5 bg-[#4f0419] rounded-full transition-all duration-500 group-hover:w-full opacity-50 group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoffeeWithFilm;
