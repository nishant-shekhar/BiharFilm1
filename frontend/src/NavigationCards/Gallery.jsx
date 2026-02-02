import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Navbar from "../Components/Navbar";
import ContactUs from "./ContactUs";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryItems = [
    {
      type: "image",
      src: "/gallery/biharFilmCityMeeting.jpeg",
      span: "col-span-1 md:col-span-2 row-span-2",
    },
    {
      type: "image",
      src: "/gallery/WhatsApp Image 2025-12-12 at 17.01.59.jpeg",
      span: "col-span-1 md:col-span-1 row-span-1",
    },
    {
      type: "image",
      src: "/gallery/WhatsApp Image 2025-12-12 at 17.02.01.jpeg",
      span: "col-span-1 md:col-span-1 row-span-1",
    },
    {
      type: "image",
      src: "/gallery/rubymam.jpeg",
      span: "col-span-1 md:col-span-1 row-span-2",
    },
    {
      type: "image",
      src: "/gallery/rubymam2.jpeg",
      span: "col-span-1 md:col-span-2 row-span-1",
    },
    {
      type: "image",
      src: "/gallery/WhatsApp Image 2025-12-12 at 17.02.07.jpeg",
      span: "col-span-1 md:col-span-1 row-span-1",
    },
    {
      type: "image",
      src: "/gallery/WhatsApp Image 2025-12-12 at 17.02.09.jpeg",
      span: "col-span-1 md:col-span-2 row-span-2",
    },
    {
      type: "image",
      src: "/gallery/WhatsApp Image 2025-12-12 at 17.02.10.jpeg",
      span: "col-span-1 md:col-span-1 row-span-1",
    },
    {
      type: "image",
      src: "/gallery/WhatsApp Image 2025-12-12 at 17.02.12.jpeg",
      span: "col-span-1 md:col-span-1 row-span-1",
    },
    {
      type: "image",
      src: "/gallery/WhatsApp Image 2025-12-12 at 17.02.13.jpeg",
      span: "col-span-1 md:col-span-2 row-span-1",
    },
    {
      type: "image",
      src: "/gallery/WhatsApp Image 2025-12-12 at 17.02.04.jpeg",
      span: "col-span-1 md:col-span-1 row-span-2",
    },
    {
      type: "image",
      src: "/gallery/WhatsApp Image 2025-12-12 at 17.02.15.jpeg",
      span: "col-span-1 md:col-span-2 row-span-2",
    },
    {
      type: "image",
      src: "/gallery/WhatsApp Image 2025-12-12 at 17.02.17.jpeg",
      span: "col-span-1 md:col-span-1 row-span-1",
    },
    {
      type: "image",
      src: "/gallery/WhatsApp Image 2025-12-12 at 17.02.15.jpeg",
      span: "col-span-1 md:col-span-1 row-span-1",
    },
  ];

  return (
    <div className="min-h-screen bg-[#19050c] font-sans">
      <Navbar />

      {/* Header */}
      <div className="pt-32 pb-16 px-4 text-center border-b border-white/10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 flex flex-col items-center text-center text-white max-w-3xl mx-auto mb-8"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl great-vibes-regular mb-3 text-white drop-shadow-2xl">
            Gallery
          </h1>

          <p className="text-xs text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
            Explore the vibrant world of Bihar's cinema through our curated
            collection
          </p>
        </motion.div>
      </div>

      {/* Perfect Bento Grid - FIXED */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-20 lg:px-20 py-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 auto-rows-[240px] gap-6 md:grid-flow-row-dense"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {galleryItems.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                show: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  },
                },
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
              className={`relative group rounded-3xl overflow-hidden ${item.span} cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300`}
              onClick={() => setSelectedImage(item)}
            >
              {/* Media Content */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#891737]/20 to-transparent z-0"></div>

              {item.type === "video" ? (
                <video
                  src={item.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <img
                  src={item.src}
                  alt="Gallery Image"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-3 py-1 bg-[#891737] text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {item.type}
                  </span>
                </div>
              </div>

              {/* Subtle Border */}
              <div className="absolute inset-0 border border-white/5 group-hover:border-white/20 rounded-3xl pointer-events-none transition-colors duration-300"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl w-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors bg-white/10 rounded-full hover:bg-white/20"
                onClick={() => setSelectedImage(null)}
              >
                <X size={24} />
              </button>

              {selectedImage.type === "video" ? (
                <video
                  src={selectedImage.src}
                  controls
                  autoPlay
                  className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
                />
              ) : (
                <img
                  src={selectedImage.src}
                  alt="Gallery Preview"
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactUs />
    </div>
  );
};

export default Gallery;
