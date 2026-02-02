import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FaImdb } from "react-icons/fa";


const UpdateSocialLinks = ({ isOpen, onClose, onUpdate }) => {
  const [links, setLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    imdb: "",
  });

  const handleChange = (e) => {
    setLinks({ ...links, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onUpdate(links);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Popup Form */}
          <motion.div
            className="fixed inset-0 flex justify-center items-center z-50"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { type: "spring", bounce: 0.1, duration: 0.2 } }}
            exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6">
              <h2 className="text-xl font-bold text-center text-gray-800">Update Social Links</h2>

              <div className="space-y-4">
                {/* Social Inputs */}
                <InputField
                  icon={<FaFacebookF className="" />}
                  name="facebook"
                  placeholder="Facebook URL"
                  value={links.facebook}
                  onChange={handleChange}
                />
                <InputField
                  icon={<FaInstagram />}
                  name="instagram"
                  placeholder="Instagram URL"
                  value={links.instagram}
                  onChange={handleChange}
                />
                <InputField
                  icon={<FaTwitter />}
                  name="twitter"
                  placeholder="Twitter URL"
                  value={links.twitter}
                  onChange={handleChange}
                />
                <InputField
                  icon={<FaLinkedinIn />}
                  name="linkedin"
                  placeholder="LinkedIn URL"
                  value={links.linkedin}
                  onChange={handleChange}
                />
                <InputField
                  icon={<FaImdb />}
                  name="imdb"
                  placeholder="LinkedIn URL"
                  value={links.imdb}
                  onChange={handleChange}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 rounded-lg bg-black text-white hover:bg-black/80 transition"
                >
                  Update
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Reusable Input Field
const InputField = ({ icon, name, placeholder, value, onChange }) => (
  <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:border-indigo-500 transition">
    <span className="text-gray-500 mr-3">{icon}</span>
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full outline-none text-sm text-black"
    />
  </div>
);

export default UpdateSocialLinks;