import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../Components/Navbar";
import Footer from "../ContactUs";
import "../../App.css";

// Sample data (extend as needed)
const vrExperiences = [
  { id: 1, image: "/VrPictures/Glass_Bridge.jpg",link: "https://www.youtube.com/watch?v=i11IEYQWGBw&list=PLf8xXpSmtMYmxbZmyGGOXR_zNvuZt8Efc&index=7",  title: "Glass Bridge, Rajgir" },

  { id: 2, image: "/VrPictures/Pawapuri_Jalmandir.jpg", link: "https://www.youtube.com/watch?v=gGRXylek7Pc&list=PLf8xXpSmtMYmxbZmyGGOXR_zNvuZt8Efc&index=13", title: "Pawapuri Jalmandir, Nalanda" },

  { id: 3, image: "/VrPictures/Junglee_Safari.jpg", link: "https://www.youtube.com/watch?v=BjR83bnrGxw&list=PLf8xXpSmtMYmxbZmyGGOXR_zNvuZt8Efc&index=10", title: "Jungle Safari, Rajgir" },

  { id: 4, image: "/VrPictures/Ghora_Katora.jpg", link: "https://www.youtube.com/watch?v=pDidhvA7c1w&list=PLf8xXpSmtMYmxbZmyGGOXR_zNvuZt8Efc&index=6", title: "Ghora Katora, Rajgir" },

  { id: 5, image: "/VrPictures/Jarasandh_Smarak.jpg", link: "https://www.youtube.com/watch?v=1d_R7WVSeEI&list=PLf8xXpSmtMYmxbZmyGGOXR_zNvuZt8Efc&index=9", title: "Jarasangh Ka Akhada, Rajgir" },

  { id: 6, image: "/VrPictures/Hiuen_Tsang.jpg", link: "https://www.youtube.com/watch?v=Vk4xoPvqsPY&list=PLf8xXpSmtMYmxbZmyGGOXR_zNvuZt8Efc&index=8", title: "Hiuen Tsang Memorial Hall, Nalanda" },

  { id: 7, image: "/VrPictures/Sabhyata_Dwar.jpg", link: "https://www.youtube.com/watch?v=kvVaThc5wPU&list=PLf8xXpSmtMYmxbZmyGGOXR_zNvuZt8Efc&index=15", title: "Sabhyata Dwar, Patna" },

  { id: 8, image: "/VrPictures/Golghar.jpg", link: "https://www.youtube.com/watch?v=0_yqrRucwNQ&list=PLf8xXpSmtMYmxbZmyGGOXR_zNvuZt8Efc&index=1", title: "Golghar, Patna" },

  { id: 9, image: "/VrPictures/Buddha_Smriti.jpg", link: "https://www.youtube.com/watch?v=P_dkju9n5L4list=PLf8xXpSmtMYmxbZmyGGOXR_zNvuZt8Efc&index=2", title: "Buddha Smiriti Park, Patna" },

  { id: 10, image: "/VrPictures/Bapu_Tower.jpg", link: "https://www.youtube.com/watch?v=tsrKxzqEKMs&list=PLf8xXpSmtMYmxbZmyGGOXR_zNvuZt8Efc&index=3", title: "Bapu Tower, Patna" },

  { id: 11, image: "/VrPictures/Shantivan.jpg", link: "https://www.youtube.com/watch?v=ZNh2Lkjh0F4&list=PLf8xXpSmtMYmxbZmyGGOXR_zNvuZt8Efc&index=16", title: "Shantivan, Rajgir" },

  { id: 12, image: "/VrPictures/venu_van.jpeg", link: "https://www.youtube.com/watch?v=_zpjszA9rDU&list=PLf8xXpSmtMYmxbZmyGGOXR_zNvuZt8Efc&index=17", title: "Venuvan, Rajgir" },

  { id: 13, image: "/VrPictures/Ropeway.jpg", link: "https://www.youtube.com/watch?v=kvASST923iE&list=PLf8xXpSmtMYmxbZmyGGOXR_zNvuZt8Efc&index=14", title: "Ropeway, Rajgir" },

  { id: 14, image: "/VrPictures/Ancient_Nalanda.jpg", link: "https://www.youtube.com/watch?v=SLXsL2jeH0g&list=PLf8xXpSmtMYmxbZmyGGOXR_zNvuZt8Efc&index=11", title: "Ancient Nalanda University, Rajgir" },

  { id: 15, image: "/VrPictures/New_Nalanda.jpg", link: "https://www.youtube.com/watch?v=8SHH66U46Yg&list=PLf8xXpSmtMYmxbZmyGGOXR_zNvuZt8Efc&index=12", title: "New Nalanda University, Rajgir" },
      
];

const Vrpage = () => {
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
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://res.cloudinary.com/dgra109xv/video/upload/v1755760966/Vrpage_cj0a7w.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-[#190108]/80 backdrop-blur-[2px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-24 sm:py-32">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 great-vibes-regular drop-shadow-2xl">
            Explore Bihar in Virtual Reality
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Immerse yourself in the rich heritage and breathtaking landscapes of Bihar through our curated VR experiences.
          </p>
        </motion.div>

        {/* Grid of VR Experiences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-20">
          {vrExperiences.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative h-[320px] rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-[#4f0419]/20 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              onClick={() => window.open(item.link, "_blank")}
            >
              {/* Image Section */}
              <div className="relative h-[75%] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#190108] via-transparent to-transparent opacity-60" />

                {/* VR Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="absolute bottom-0 left-0 w-full h-[25%] px-5 flex items-center bg-[#190108]">
                <div className="w-full">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#ff4d6d] transition-colors truncate">
                    {item.title}
                  </h3>
                  <div className="mt-2 w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#4f0419] w-0 group-hover:w-full transition-all duration-500 ease-out" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Vrpage;
