import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import ContactUs from "../NavigationCards/ContactUs";

const filmsData = [
  {
    s_no: 1,
    image: "/1.jpg",
    name_of_film: "Sanghatiya",
    details: {
      production_house: "Ugratara Films",
      project: "Feature Film",
      language: "Bhojpuri",
    },
  },
  {
    s_no: 2,
    image: "/2.jpg",
    name_of_film: "The Long Journey Home",
    details: {
      production_house: "Avarts Limited (Mauritius)",
      project: "Entertainment Film",
      language: "English and Bhojpuri",
    },
  },
  {
    s_no: 3,
    image: "/3.jpg",
    name_of_film: "Bihar Ka Jalwa",
    details: {
      production_house: "Prabuddh Entertainment",
      project: "Documentary Film",
      language: "Hindi",
    },
  },
  {
    s_no: 4,
    image: "/4.jpg",
    name_of_film: "Suhagin Ke Senur",
    details: {
      production_house: "Cinema Window",
      project: "Feature Film",
      language: "Bhojpuri",
    },
  },
  {
    s_no: 5,
    image: "/5.jpg",
    name_of_film: "Life Leela",
    details: {
      production_house: "Aim Apex International",
      project: "Web Series",
      language: "Hindi",
    },
  },
  {
    s_no: 6,
    image: "/6.jpg",
    name_of_film: "Jingi Bitavani Tohre Pyar Mein",
    details: {
      production_house: "Purab Talkies",
      project: "Feature Film",
      language: "Bhojpuri",
    },
  },
  {
    s_no: 7,
    image: "/7.jpg",
    name_of_film: "Ghar Ka Bantwara",
    details: {
      production_house: "Vishwamurti Films Production",
      project: "Feature Film",
      language: "Bhojpuri",
    },
  },
  {
    s_no: 8,
    image: "/8.jpg",
    name_of_film: "Naari",
    details: {
      production_house: "Vishwamurti Films Production",
      project: "Feature Film",
      language: "Bhojpuri",
    },
  },
  {
    s_no: 9,
    image: "/9.jpg",
    name_of_film: "Rajni Ki Baraat",
    details: {
      production_house: "Epiphany Entertainment",
      project: "Feature Film",
      language: "Hindi",
    },
  },
  {
    s_no: 10,
    image: "/10.jpg",
    name_of_film: "Oh My Dog",
    details: {
      production_house: "Jar Pictures",
      project: "Feature Film",
      language: "Hindi",
    },
  },
  {
    s_no: 11,
    image: "/11.jpg",
    name_of_film: "Tiya",
    details: {
      production_house: "Strike Films Pvt. Ltd.",
      project: "Feature Film",
      language: "Hindi",
    },
  },
  {
    s_no: 12,
    image: "/12.jpg",
    name_of_film: "Sugni",
    details: {
      production_house: "Johnson Suraj Films International",
      project: "Feature Film",
      language: "Magahi",
    },
  },
  {
    s_no: 13,
    image: "/13.jpg",
    name_of_film: "Chhath",
    details: {
      production_house: "Champaran Talkies Pvt. Ltd.",
      project: "Feature Film",
      language: "Bhojpuri",
    },
  },
  {
    s_no: 14,
    image: "/14.jpg",
    name_of_film: "Pen-Brush",
    details: {
      production_house: "Daivarya Media and Entertainment Pvt. Ltd.",
      project: "Feature Film",
      language: "Hindi",
    },
  },
  {
    s_no: 15,
    image: "/15.jpg",
    name_of_film: "Bihaan",
    details: {
      production_house: "Insight India",
      project: "Feature Film",
      language: "Hindi",
    },
  },
  {
    s_no: 16,
    image: "/16.jpg",
    name_of_film: "Anmol Ghadi",
    details: {
      production_house: "Samakhi Entertainment Pvt. Ltd.",
      project: "Feature Film",
      language: "Bhojpuri",
    },
  },
  {
    s_no: 17,
    image: "/17.jpg",
    name_of_film: "Vrihaspati Vrat Katha",
    details: {
      production_house: "Abhya Aradhya Films",
      project: "Feature Film",
      language: "Bhojpuri",
    },
  },
  {
    s_no: 18,
    image: "/18.jpg",
    name_of_film: "Beti Banal Bijeta",
    details: {
      production_house: "First Take Creation",
      project: "Feature Film",
      language: "Bhojpuri",
    },
  },
  {
    s_no: 19,
    image: "/19.jpg",
    name_of_film: "Bihari Bhauji",
    details: {
      production_house: "Shriman Mishra Film Production",
      project: "Feature Film",
      language: "Bhojpuri",
    },
  },
  {
    s_no: 20,
    image: "/20.jpg",
    name_of_film: "Akhand Bhedam",
    details: {
      production_house: "R.S.Y. Films Pvt. Ltd.",
      project: "Feature Film",
      language: "Bhojpuri",
    },
  },
  {
    s_no: 21,
    image: "/21.jpg",
    name_of_film: "Ambe Hai Meri Maa",
    details: {
      production_house: "Yashi Films Pvt. Ltd.",
      project: "Feature Film",
      language: "Bhojpuri",
    },
  },
  {
    s_no: 22,
    image: "/22.jpg",
    name_of_film: "Bantwara",
    details: {
      production_house: "Shri Ganeshay Namah Entertainment",
      project: "Feature Film",
      language: "Hindi",
    },
  },
  {
    s_no: 23,
    image: "/23.jpg",
    name_of_film: "Jai Maiya Sharda Bhavani",
    details: {
      production_house: "People Tree Production House",
      project: "Feature Film",
      language: "Bhojpuri",
    },
  },
  {
    s_no: 24,
    image: "/24.jpg",
    name_of_film: "Zindagi Ek Prem Katha",
    details: {
      production_house: "Parashar Entertainment",
      project: "Feature Film",
      language: "Bhojpuri",
    },
  },
  {
    s_no: 25,
    image: "/25.jpg",
    name_of_film: "Jai Maiya Thawe Wali",
    details: {
      production_house: "Prabuddh Entertainment",
      project: "Feature Film",
      language: "Hindi",
    },
  },
  {
    s_no: 26,
    image: "/26.jpg",
    name_of_film: "Magadh Putra",
    details: {
      production_house: "Gunjan Singh Entertainment",
      project: "Feature Film",
      language: "Hindi, Bhojpuri",
    },
  },
  {
    s_no: 27,
    image: "/27.jpg",
    name_of_film: "Echo of Absent",
    details: {
      production_house: "Caterina Entertainment and Sports Pvt. Ltd.",
      project: "Feature Film",
      language: "Hindi",
    },
  },
  {
    s_no: 28,
    image: "/28.jpg",
    name_of_film: "Aakhiri Lesson",
    details: {
      production_house: "Caterina Entertainment and Sports Pvt. Ltd.",
      project: "Feature Film",
      language: "Hindi",
    },
  },
  {
    s_no: 29,
    image: "/29.jpg",
    name_of_film: "Champaran Satyagrah",
    details: {
      production_house: "Yuvraj Media and Entertainment",
      project: "Feature Film",
      language: "Hindi",
    },
  },
  {
    s_no: 30,
    image: "/30.jpg",
    name_of_film: "Jai Pashupati Nath",
    details: {
      production_house: "Yuvraj Media and Entertainment",
      project: "Feature Film",
      language: "Bhojpuri",
    },
  },
];

const ShootingInBihar = () => {
  const [mainImage, setMainImage] = useState(filmsData[0]);
  const [thumbnails, setThumbnails] = useState(filmsData.slice(1));

  const handleImageClick = (clickedImg, idx) => {
    if (!thumbnails.length) return;
    const currentMain = mainImage;
    const updatedThumbs = [...thumbnails];
    // Replace the clicked thumbnail with the current main image
    const thumbIndex = idx % thumbnails.length;
    updatedThumbs[thumbIndex] = currentMain;

    setMainImage(clickedImg);
    setThumbnails(updatedThumbs);
  };

  return (
    <div>
      <motion.div
        className="w-full min-h-screen flex flex-col items-center bg-[#190108] pt-24 px-4 sm:px-8 md:px-12 lg:px-16 pb-20"
        id="Shooting-in-bihar"
      >
        <Navbar />

        {/* Explore Section */}
        <div className="bg-[#190108] w-full pt-10 px-2 sm:px-6 lg:px-10">
          {/* Title */}
          <h2 className="text-white text-4xl sm:text-6xl carter-one-regular text-center mb-12">
            Shooting in Bihar
          </h2>

          {mainImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-16">
              {/* Left Column: Image */}
              <motion.div
                key={mainImage.name_of_film}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full h-[25rem] rounded-2xl border-4 border-[#a92b4e] shadow-xl overflow-hidden"
              >
                <img
                  src={mainImage.image}
                  alt={mainImage.name_of_film}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Right Column: Details */}
              <div className="px-2 md:px-6">
                <h3 className="text-[#a92b4e] text-3xl font-semibold mb-4">
                  {mainImage.name_of_film}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <span className="text-[#a92b4e] font-bold min-w-[140px]">
                      Production House:
                    </span>
                    <span className="text-gray-200">
                      {mainImage.details.production_house}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#a92b4e] font-bold min-w-[140px]">
                      Project Type:
                    </span>
                    <span className="text-gray-200">
                      {mainImage.details.project}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#a92b4e] font-bold min-w-[140px]">
                      Language:
                    </span>
                    <span className="text-gray-200">
                      {mainImage.details.language}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Thumbnails */}
          {thumbnails.length > 0 && (
            <div className="overflow-hidden group px-4 mt-4">
              <div className="flex w-max space-x-4 animate-scrollImages group-hover:pause-scroll">
                {[...thumbnails, ...thumbnails].map((item, index) => (
                  <motion.div
                    speed={2}
                    duration={20}
                    key={`${item.name_of_film}-${index}`}
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer rounded-xl overflow-hidden shadow-md border border-gray-600 w-60 h-36 flex-shrink-0"
                    onClick={() => handleImageClick(item, index)}
                  >
                    <img
                      src={item.image}
                      alt={item.name_of_film}
                      className="w-full h-full object-cover"
                    />
                    <div className="hidden">{item.name_of_film}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
      <ContactUs />
    </div>
  );
};

export default ShootingInBihar;
