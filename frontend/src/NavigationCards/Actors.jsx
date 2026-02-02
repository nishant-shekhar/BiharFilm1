import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";
import "../App.css";

const people = [
  {
    id: 1,
    name: "Manoj Bajpayee",
    occupation: "Actor",
    dob: "23 April 1969",
    district: "West Champaran",
    img: "https://th-i.thgim.com/public/incoming/n3k61b/article68075789.ece/alternates/FREE_1200/MANOJ-SHHHH.jpg",
    description:
      "Renowned for powerful roles in independent and commercial films.",

    imdb: "https://www.imdb.com/name/nm0048075/?ref_=ext_shr_lnk",
  },
  // rest of your people array remains the same
  {
    id: 2,
    name: "Pankaj Tripathi",
    occupation: "Actor",
    dob: "5 September 1976",
    district: "Gopalganj",
    img: "https://media.assettype.com/freepressjournal/2022-01/bdc02614-b127-4db2-a440-2f44b9f5f284/Screenshot_2022_01_25_at_5_43_01_AM.png?width=1200",
    description: "Famous for his versatility and natural acting style.",

    imdb: "https://www.imdb.com/name/nm2690647/?ref_=ext_shr_lnk",
  },

  {
    id: 3,
    name: "Prakash Jha",
    occupation: "Producer & Actor",
    dob: "27 February 1952",
    district: "Bettiah, West Champaran",
    img: "https://m.media-amazon.com/images/M/MV5BMTc1NjMwNDE4Ml5BMl5BanBnXkFtZTgwODA1ODA0OTE@._V1_.jpg",
    description:
      "Renowned filmmaker known for his political and socio-political films.",

    imdb: "https://www.imdb.com/name/nm0422552/",
  },

  {
    id: 4,
    name: "Shatrughan Sinha",
    occupation: "Actor",
    dob: "15 July 1946",
    district: "Patna",
    img: "https://sm.mashable.com/mashable_in/seo/8/88864/88864_trrd.png",
    description: "Veteran actor and politician, iconic in 70s-80s cinema.",

    imdb: "https://www.imdb.com/name/nm0802374/?ref_=ext_shr_lnk",
  },

  {
    id: 5,
    name: "Sushant Singh Rajput",
    occupation: "Actor",
    dob: "21 January 1986",
    district: "Patna",
    img: "https://i.pinimg.com/736x/40/60/63/406063a5d7bf517313bf00ee5d6ab840.jpg",
    description: "Talented actor known for heartfelt performances.",

    imdb: "https://www.imdb.com/name/nm3818286/?ref_=ext_shr_lnk",
  },

  {
    id: 6,
    name: "Neha Sharma",
    occupation: "Actress",
    dob: "21 November 1987",
    district: "Bhagalpur",
    img: "https://akm-img-a-in.tosshub.com/aajtak/images/video/202403/6600096b7e220-will-neha-sharma-contest-elections-from-bihar-240722280-16x9.png",
    description: "Actress and model with presence in films and web series.",

    imdb: "https://www.imdb.com/name/nm2777281/?ref_=ext_shr_lnk",
  },

  {
    id: 7,
    name: "Nitu Chandra",
    occupation: "Actress",
    dob: "20 June 1984",
    district: "Patna",
    img: "https://www.filmibeat.com/wimg/desktop/2019/08/neetu-chandra_10.jpg",
    description:
      "Indian actress known for her roles in Hindi, Tamil, and Telugu cinema. ",

    imdb: "https://www.imdb.com/name/nm1911617/?ref_=ext_shr_lnk",
  },
  {
    id: 8,
    name: "Vinay Pathak",
    occupation: "Actor",
    dob: "27 July 1968",
    district: "Bhojpur, Bihar ",
    img: "https://akm-img-a-in.tosshub.com/indiatoday/images/story/201808/Vinay_Pathak-BAN-08052018.jpeg",
    description:
      "Actor known for comedy roles in Bheja Fry and Khosla Ka Ghosla. ",

    imdb: "https://www.imdb.com/name/nm0665555/?ref_=ext_shr_lnk",
  },

  {
    id: 9,
    name: "Imtiaz Ali",
    occupation: "Film Director & Writer",
    dob: "16 June 1971",
    district: "Jamshedpur (then Bihar)",
    img: "https://m.media-amazon.com/images/M/MV5BMTYwOTUwMTk3MF5BMl5BanBnXkFtZTgwMjA1NDEzMTE@._V1_.jpg",
    description:
      "Renowned Indian film director, producer, and writer known for his brilliant work",

    imdb: "https://www.imdb.com/name/nm1665004/",
  },

  {
    id: 10,
    name: "Sanjay Mishra",
    occupation: "Actor",
    dob: "6 October 1963",
    district: "Darbhangha",
    img: "https://i.pinimg.com/564x/33/cf/5a/33cf5a9baf45e25e6b8ce5adc89f8b54.jpg",
    description: "Celebrated for comic timing and strong character roles.",

    imdb: "https://www.imdb.com/name/nm0592799/?ref_=ext_shr_lnk",
  },
  {
    id: 11,
    name: "Arunabh Kumar",
    occupation: "Entrepreneur, Producer, Director, Actor",
    dob: "26 November 1982",
    district: "Muzaffarpur",
    img: "https://www.iwmbuzz.com/wp-content/uploads/2025/06/arunabh-kumar-shares-a-heartfelt-note-on-his-wedding-anniversary-15.jpg",
    description:
      "Founder of TVF, known for web series like 'Permanent Roommates' and 'Pitchers'.",

    imdb: "https://www.imdb.com/name/nm2837311/?ref_=ext_shr_lnk",
  },

  {
    id: 12,
    name: "Gurmeet Choudhary",
    occupation: "Actor",
    dob: "22 February 1984",
    district: "Bhagalpur",
    img: "https://www.gethucinema.com/tmdb/eCeElyYgPm1ZvV1NWlBeQbUCp8c.jpg",
    description: "TV and film actor popular for mythological and action roles.",

    imdb: "https://www.imdb.com/name/nm3073211/?ref_=ext_shr_lnk",
  },

  {
    id: 13,
    name: "Chandan Roy",
    occupation: "Actor",
    dob: "20 December 1995",
    district: "Mahnar (Vaishali district)",
    img: "https://assets.telegraphindia.com/telegraph/2024/May/1714709299_chandan-roy.jpg",
    description:
      "Known for his warm, authentic portrayal of Vikas Shukla in 'Panchayat'..",

    imdb: "https://www.imdb.com/name/nm10881552/",
  },
  {
    id: 14,
    name: "Ashok Pathak",
    occupation: "Actor",
    dob: "3 January 1985",
    district: "Darveshpur, near Siwan",
    img: "https://image.tmdb.org/t/p/w500/a60LOKJd2FTNxfLSo7QCQEyjZgO.jpg",
    description:
      "Bihari-born actor known for winning hearts as 'Binod' in Panchayat.",

    imdb: "https://www.imdb.com/name/nm5131331/",
  },
  {
    id: 15,
    name: "Chandan Tiwari",
    occupation: "Actor, Painter, Writer, Director",
    dob: "2 February 1970",
    district: "Saharsa",
    img: "https://m.media-amazon.com/images/M/MV5BMGE5ZWY1YzctYTA3Ni00MWU0LWE3OWUtZDY1MjBiNjUzYmFmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    description:
      "Actor, acclaimed for his grounded portrayal of MLA Chandu Singh in Panchayat",

    imdb: "https://www.imdb.com/name/nm13792834/?ref_=ext_shr_lnk",
  },
  {
    id: 16,
    name: "Durgesh Kumar",
    occupation: "Actor",
    dob: "21 October 1984",
    district: "Darbhanga, Bihar",
    img: "https://m.media-amazon.com/images/M/MV5BYzVmZTgyODctNDBiZC00YzM2LWExYzAtODQzYjBkMjI5NmY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",

    description: "Actor known for playing Bhushan in Panchayat .",

    imdb: "https://www.imdb.com/name/nm6294201/?ref_=ext_shr_lnk",
  },

  {
    id: 17,
    name: "Bulloo Kumar",
    occupation: "Actor",
    dob: "5 February 1986",
    district: "Nawada",
    img: "https://m.media-amazon.com/images/M/MV5BYmM2NTBiOGEtNmMzMC00ZTY3LTllOTAtZjVkNWJjM2U0ZTMwXkEyXkFqcGc@._V1_.jpg",
    description:
      "Actor from Bihar, known for his comical role as Madhav in  Panchayat.",

    imdb: "https://www.imdb.com/name/nm12872303/?ref_=ext_shr_lnk",
  },

  {
    id: 18,
    name: "Ustad Bismillah Khan",
    occupation: "Shehnai Maestro",
    dob: "21 March 1916",
    district: "Dumraon (Buxar)",
    img: "https://akm-img-a-in.tosshub.com/indiatoday/bismillah-khan-647_032116095003.jpg",
    description: "Legendary Shehnai player, Bharat Ratna awardee.",

    imdb: "https://www.imdb.com/name/nm0451190/?ref_=ext_shr_lnk",
  },
  {
    id: 19,
    name: "Sharda Sinha",
    occupation: "Folk Singer",
    dob: "1 October 1952",
    district: "Samastipur",
    img: "https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2024/11/India-Today_Sharda-Sinha-YIM6937-1-1-scaled.jpg?size=*:900",
    description: "Voice of Bihar's folk heritage, especially during Chhath.",

    imdb: "https://www.imdb.com/name/nm0788686/?ref_=ext_shr_lnk",
  },
  {
    id: 20,
    name: "Maithili Thakur",
    occupation: "Folk/Classic Singer",
    dob: "25 July 2000",
    district: "Madhubani",
    img: "https://c.saavncdn.com/artists/Maithili_Thakur_002_20230227072619_500x500.jpg",
    description: "Young prodigy promoting Indian classical and folk music.",

    imdb: "https://www.imdb.com/name/nm9859083/?ref_=ext_shr_lnk",
  },
  {
    id: 21,
    name: "Chandan Tiwari",
    occupation: "Folk Singer",
    dob: "15 August 1985",
    district: "Patna",
    img: "https://chandantiwari.in/wp-content/uploads/2024/11/PHOTO-2024-03-27-16-07-40-1.jpg",
    description: "Folk singer reviving Bhojpuri and regional traditions.",

    imdb: "https://www.imdb.com/name/nm13792834/?ref_=ext_shr_lnk",
  },
];

const CarouselOfCelebs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [flippedCard, setFlippedCard] = useState(null); // Track which card is flipped for mobile
  const scrollRef = useRef(null);
  const total = people.length;

  useEffect(() => {
    const updateScreenSize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);

      // Reset to first item when switching between mobile/desktop
      if (mobile && currentIndex >= total) {
        setCurrentIndex(0);
      }

      // Reset flipped card when switching screen sizes
      setFlippedCard(null);
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, [currentIndex, total]);

  // Mobile navigation functions
  const nextSlide = () => {
    if (isMobile) {
      setCurrentIndex((prev) => (prev + 1) % total);
      setFlippedCard(null); // Reset flip when navigating
    } else {
      scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  const prevSlide = () => {
    if (isMobile) {
      setCurrentIndex((prev) => (prev - 1 + total) % total);
      setFlippedCard(null); // Reset flip when navigating
    } else {
      scrollRef.current?.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  // Handle card click for mobile flip functionality
  const handleCardClick = (cardId) => {
    if (isMobile) {
      setFlippedCard(flippedCard === cardId ? null : cardId);
    }
  };

  // Touch event handlers for mobile swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && isMobile) {
      nextSlide();
    }
    if (isRightSwipe && isMobile) {
      prevSlide();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center bg-[#190108] py-10 h-screen">
      <h2 className="text-white text-3xl sm:text-3xl md:text-4xl lg:text-5xl playwrite-mx-guides-regular mb-10 pt-10 pb-8 text-center px-4">
        Celebrities of Bihar
      </h2>

      <div className="relative mx-auto max-w-full px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Gradient overlays for desktop */}
        {!isMobile && (
          <>
            <div className="pointer-events-none absolute left-0 top-0 h-full w-8 sm:w-12 bg-gradient-to-r from-[#190108] to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 sm:w-12 bg-gradient-to-l from-[#190108] to-transparent z-10" />
          </>
        )}

        {/* Mobile View - Single Card */}
        {isMobile ? (
          <div
            className="flex justify-center items-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              key={currentIndex}
              className="w-[280px] h-96 flex-shrink-0 cursor-pointer"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleCardClick(people[currentIndex].id)}
            >
              <div className="w-full h-full perspective group">
                <div className="card-animated-border w-full h-full">
                  <div
                    className={`relative w-full h-full transition-transform duration-700 transform-style preserve-3d ${
                      flippedCard === people[currentIndex].id
                        ? "rotate-y-180"
                        : ""
                    }`}
                  >
                    {/* Front of card */}
                    <div className="absolute w-full h-full backface-hidden bg-white/40 backdrop-blur-3xl text-white rounded-2xl overflow-hidden">
                      <img
                        src={people[currentIndex].img}
                        alt={people[currentIndex].name}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent z-10" />
                      <div className="absolute bottom-3 left-3 z-20 text-sm">
                        <h3 className="font-semibold">
                          {people[currentIndex].name}
                        </h3>
                        <p>{people[currentIndex].occupation}</p>
                      </div>
                    </div>

                    {/* Back of card */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-[#0a1020] text-white rounded-2xl p-4 flex flex-col justify-start items-center text-left text-sm">
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                        <img
                          src={people[currentIndex].img}
                          alt={people[currentIndex].name}
                          className="w-[120px] h-[120px] rounded-full object-cover"
                        />
                      </div>
                      <div className="mt-36 w-full px-2">
                        <p className="mb-1 italic ">
                          {people[currentIndex].occupation}
                        </p>
                        <p className="mb-1">
                          Date of Birth: {people[currentIndex].dob}
                        </p>
                        <p className="mb-1">
                          District: {people[currentIndex].district}
                        </p>
                        <p className="mb-1">
                          {people[currentIndex].description}
                        </p>

                        <a
                          href={people[currentIndex].imdb}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
                            alt="IMDb"
                            className="w-16 h-auto mt-4"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Desktop View - Scrollable Cards */
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto overflow-y-hidden scroll-smooth pb-4 no-scrollbar px-8"
          >
            {people.map((person) => (
              <motion.div
                key={person.id}
                className="w-[240px] md:w-[280px] lg:w-[300px] xl:w-[320px] h-80 sm:h-96 flex-shrink-0"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="w-full h-full perspective group">
                  <div className="card-animated-border w-full h-full">
                    <div className="relative w-full h-full transition-transform duration-700 transform-style preserve-3d group-hover:rotate-y-180">
                      <div className="absolute w-full h-full backface-hidden bg-white/40 backdrop-blur-3xl text-white rounded-2xl overflow-hidden">
                        <img
                          src={person.img}
                          alt={person.name}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 bg-gradient-to-t from-black/70 to-transparent z-10" />
                        <div className="absolute bottom-3 left-3 z-20 text-xs sm:text-sm">
                          <h3 className="font-semibold">{person.name}</h3>
                          <p>{person.occupation}</p>
                        </div>
                      </div>

                      <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-[#190108] border border-white/10 text-white rounded-2xl overflow-hidden">
                        {/* Decorative background pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl"></div>
                        </div>

                        {/* Content wrapper */}
                        <div className="relative h-full flex flex-col p-6">
                          {/* Profile Image Section */}
                          <div className="flex justify-center mb-3">
                            <img
                              src={person.img}
                              alt={person.name}
                              className="w-24 h-24 rounded-full object-cover shadow-2xl"
                            />
                          </div>

                          {/* Occupation */}
                          <div className="text-center mb-3">
                            <span className="inline-block px-3 py-1 text-xs font-medium border border-white/20 text-white bg-[#190108]/50 rounded-full">
                              {person.occupation}
                            </span>
                          </div>

                          {/* Info Section - Compact Grid */}
                          <div className="flex-1 flex flex-col justify-center space-y-2 text-sm">
                            {/* Date of Birth */}
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-xs w-16">
                                DOB
                              </span>
                              <span className="text-white font-medium">
                                {person.dob}
                              </span>
                            </div>

                            {/* District */}
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-xs w-16">
                                District
                              </span>
                              <span className="text-white font-medium">
                                {person.district}
                              </span>
                            </div>

                            {/* Description */}
                            <div className="flex items-start gap-2">
                              <span className="text-gray-400 text-xs w-16 pt-0.5">
                                About
                              </span>
                              <p className="text-gray-200 text-xs leading-relaxed flex-1">
                                {person.description}
                              </p>
                            </div>
                          </div>

                          {/* IMDb Link */}
                          <div className="mt-3 pt-3">
                            <a
                              href={person.imdb}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 transition-all group"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <img
                                src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
                                alt="IMDb"
                                className="h-4 opacity-80 group-hover:opacity-100 transition-opacity"
                              />
                              <span className="text-xs text-yellow-200">
                                View Profile
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        <div className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 z-20">
          <button
            onClick={prevSlide}
            className="p-2 sm:p-3 bg-gray-800 text-white rounded-full hover:bg-gray-600 transition-colors duration-200"
          >
            <IoIosArrowBack size={isMobile ? 20 : 24} />
          </button>
        </div>

        <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 z-20">
          <button
            onClick={nextSlide}
            className="p-2 sm:p-3 bg-gray-800 text-white rounded-full hover:bg-gray-600 transition-colors duration-200"
          >
            <IoIosArrowForward size={isMobile ? 20 : 24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarouselOfCelebs;
