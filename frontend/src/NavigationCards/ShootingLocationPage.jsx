import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { getDistance } from "geolib";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "../App.css"; // Import your CSS file for styles

import Navbar from "../Components/Navbar";

const categories = {
  "Hills & Caves": [
    {
      id: 1,
      title: "Barabar Hills",
      district: "Jehanabad",
      img: "/BarabarHills.jpeg",
      description:
        "Barabar Hills, located in the Jehanabad district of Bihar, are home to the oldest surviving rock-cut caves in India, dating back to the Mauryan period.",
      lat: 25.0076,
      lng: 85.0653,
    },
    {
      id: 2,
      title: "Gridhakut Hills",
      district: "Nalanda",
      img: "/GridhakutHills.jpg",
      description:
        "Gridhakut Hills, also known as Vulture Peak, is located near Rajgir in Bihar. It is a significant Buddhist pilgrimage site where Lord Buddha is said to have delivered many important sermons.",
      lat: 25.0172,
      lng: 85.4217,
    },
    {
      id: 3,
      title: "Grupa Hills Gaya",
      district: "Gaya",
      img: "/GrupaHillsGaya.png",
      description:
        "Grupa Hills (also known as Gurpa Hills) is a sacred Buddhist site located near Gaya in Bihar. .",
      lat: 24.9251,
      lng: 85.1522,
    },
    {
      id: 4,
      title: "Kaimur Hills",
      district: "Kaimur",
      img: "/kaimurhills.png",
      description:
        "Kaimur Hills are part of the Vindhya range in Bihar, known for its scenic landscapes, waterfalls, and wildlife.",
      lat: 24.6215,
      lng: 83.583,
    },
    {
      id: 5,
      title: "Kakolat Waterfall",
      district: "Nawada",
      img: "/kakolatfalls.jpg",
      description:
        "Kakolat Waterfall is a scenic spot in Nawada district, famous for its clear waters and natural setting. It’s a popular picnic and shooting destination.",
      lat: 24.7082,
      lng: 85.52,
    },
    {
      id: 6,
      title: "Telhar Kund Kaimur",
      district: "Kaimur",
      img: "/TelharKundKaimur.jpg",
      description:
        "Telhar Kund is a picturesque waterfall located in the Kaimur hills, surrounded by lush forests and rocky cliffs.",
      lat: 24.6467,
      lng: 83.4801,
    },
    {
      id: 7,
      title: "Tutla Bhawani Waterfall",
      district: "Rohtas",
      img: "/TutlaBhawaniWaterfall.png",
      description:
        "Tutla Bhawani Waterfall is a hidden gem in Rohtas, known for its serene environment and religious significance.",
      lat: 24.955,
      lng: 84.0583,
    },
    {
      id: 8,
      title: "Vishwa Shanti Stupa",
      district: "Nalanda",
      img: "/VishwaShantiStupa.png",
      description:
        "Vishwa Shanti Stupa in Rajgir is a symbol of world peace, perched on Ratnagiri Hill and accessible by a ropeway.",
      lat: 25.0305,
      lng: 85.4215,
    },
  ],
  "Monuments & Museums": [
    {
      id: 1,
      title: "Bihar Museum",
      district: "Patna",
      img: "/biharmuseum.jpeg",
      description:
        "Bihar Museum in Patna showcases Bihar’s rich cultural heritage with modern exhibits and galleries.",
      lat: 25.6071,
      lng: 85.1234,
    },
    {
      id: 2,
      title: "Dutch Building",
      district: "Patna",
      img: "/dutchBuilding.png",
      description:
        "The Dutch Building in Patna is a historic colonial-era structure, known for its architectural significance.",
      lat: 25.6102,
      lng: 85.1408,
    },
    {
      id: 3,
      title: "Gandhi Sangrahalay",
      district: "Patna",
      img: "/GandhiSangrahalaya.jpeg",
      description:
        "Gandhi Sangrahalaya is a museum in Patna dedicated to the life and ideals of Mahatma Gandhi.",
      lat: 25.6135,
      lng: 85.1413,
    },
    {
      id: 4,
      title: "Khuda Baksh Oriental Library",
      district: "Patna",
      img: "/KhudaBakhshOrientalLibrary.jpeg",
      description:
        "Khuda Bakhsh Oriental Library in Patna holds rare manuscripts and ancient texts, a treasure trove of history.",
      lat: 25.612,
      lng: 85.1418,
    },
    {
      id: 5,
      title: "Patna Museum",
      district: "Patna",
      img: "/PatnaMuseum.jpeg",
      description:
        "Patna Museum in Patna showcases Bihar’s rich cultural heritage with modern exhibits and galleries.",
      lat: 25.6071,
      lng: 85.1234,
    },
    {
      id: 6,
      title: "Planetarium Patna",
      district: "Patna",
      img: "/PlanetariumPatna.jpeg",
      description:
        "Patna Planetarium offers educational astronomy shows and exhibits for all ages.",
      lat: 25.6139,
      lng: 85.1442,
    },
  ],
  Nature: [
    {
      id: 1,
      title: "Valmiki Tiger Reserve",
      district: "West Champaran",
      img: "https://hindi.cdn.zeenews.com/hindi/sites/default/files/2024/03/09/2681300-valmiki-tiger-reserve.jpg?im=Resize=(1200,900)",
      description:
        "Valmiki Tiger Reserve is Bihar’s only tiger reserve, rich in wildlife including tigers, elephants, and deer.",
      lat: 27.4456,
      lng: 84.9206,
    },
    {
      id: 2,
      title: "Rajgir Zoo",
      district: "Nalanda",
      img: "https://images.bhaskarassets.com/web2images/521/2021/03/10/orig_4_1615322925.jpg",
      description:
        "Rajgir Zoo (Vishwa Shanti Van) offers a small but diverse collection of animals amid scenic surroundings near Rajgir.",
      lat: 25.0269,
      lng: 85.4204,
    },
    {
      id: 3,
      title: "Kaimur Wildlife",
      district: "Kaimur",
      img: "https://pbs.twimg.com/profile_images/1288390076041277440/pP_qpOz9_400x400.jpg",
      description:
        "Kaimur Wildlife Sanctuary is a forested region in the Kaimur range, known for rich biodiversity including leopards, sloth bears, and diverse flora.",
      lat: 24.6,
      lng: 83.6,
    },
    {
      id: 4,
      title: "Bhimband wildlife Sanctuary",
      district: "Munger",
      img: "/BhimbandWildlifeSanctuary.jpg",
      description:
        "Bhimbandh Wildlife Sanctuary in Munger is known for its hot springs, forests, and a variety of wildlife.",
      lat: 24.4535,
      lng: 86.3286,
    },
    {
      id: 5,
      title: "Patna Zoo",
      district: "Patna",
      img: "https://thebusinesscluster.net/wp-content/uploads/2024/03/image-235.png",
      description:
        "Patna Zoo houses a variety of animal species including tigers, lions, elephants, and offers educational exhibits in a park-like setting.",
      lat: 25.6122,
      lng: 85.125,
    },
  ],
  "Garden & Parks ": [
    {
      id: 1,
      title: "Buddha Smriti Park",
      district: "Patna",
      img: "/buddhaSmriti.png",
      description:
        "A serene urban park in Patna commemorating Buddha's teachings.",
      lat: 25.609,
      lng: 85.1376,
    },
    {
      id: 2,
      title: "Ghora Katora",
      district: "Nalanda",
      img: "/GhoraKatora.jpg",
      description:
        "A natural, horse‑shaped lake near Rajgir surrounded by hills and migratory birds.",
      lat: 25.0085,
      lng: 85.4201,
    },
    {
      id: 3,
      title: "Kanwar Lake Begusarai",
      district: "Begusarai",
      img: "/KanwarLakeBegusarai.jpg",
      description:
        "Asia’s largest freshwater oxbow lake and Bihar’s only Ramsar‑designated bird sanctuary.",
      lat: 25.630383,
      lng: 86.145172,
    },
    {
      id: 4,
      title: "Pandu Pokhar",
      district: "Nalanda",
      img: "/PanduPokhar.jpg",
      description:
        "A well-maintained urban recreational park in Rajgir, offering boating, kids play zones, and cultural shows.",
      lat: 25.02,
      lng: 85.42,
    },
    {
      id: 5,
      title: "Venuvan Nalanda",
      district: "Nalanda",
      img: "/VenuvanNalanda.webp",
      description:
        "The bamboo grove donated by King Bimbisara to Buddha in Rajgir, featuring a lake and sculpture.",
      lat: 25.03,
      lng: 85.416,
    },
  ],
  "Cultural Sites ": [
    {
      id: 1,
      title: "Ashok Pillar, Kolhua",
      district: "Vaishali",
      img: "/AshokanPillarKolhuaVaishali.webp",
      description:
        "The Ashokan pillar at Kolhua, Vaishali, is an ancient sandstone pillar topped with a lion capital, symbolizing Emperor Ashoka's embrace of Buddhism.",
      lat: 26.014,
      lng: 85.109,
    },
    {
      id: 2,
      title: "Cyclopean Wall, Rajgir",
      district: "Nalanda",
      img: "/CyclopeanWallRajgir.avif",
      description:
        "An ancient stone wall surrounding the city of Rajgir, believed to be over 2500 years old and built during the Mauryan era.",
      lat: 25.0216,
      lng: 85.4159,
    },
    {
      id: 3,
      title: "Ruins of Vikaramshila",
      district: "Bhagalpur",
      img: "/Ruins of Vikramshila.jpg",
      description:
        "The remains of Vikramshila University in Bhagalpur, one of the two most important centers of Buddhist learning in India during the Pala Empire.",
      lat: 25.253391,
      lng: 86.989059,
    },
    {
      id: 4,
      title: "Darbhanga House",
      district: "Patna",
      img: "/DarbhangaHouse.jpg",
      description:
        "A heritage building on the banks of the Ganga in Patna, built by the royal family of Darbhanga, known for its Indo-Saracenic architecture.",
      lat: 25.6214,
      lng: 85.1642,
    },
    {
      id: 5,
      title: "Kesariya Stupa",
      district: "East Champaran",
      img: "/KesariyaStupa.webp",
      description:
        "One of the largest Buddhist stupas in the world, located in East Champaran. It is believed to date back to the time of Buddha's last journey.",
      lat: 26.33414,
      lng: 84.85476,
    },
    {
      id: 6,
      title: "Kumhrar Park",
      district: "Patna",
      img: "/KumhrarPark.png",
      description:
        "An archaeological site in Patna showcasing the remains of ancient Pataliputra, including Mauryan pillared halls and artifacts.",
      lat: 25.5998,
      lng: 85.18493,
    },
    {
      id: 7,
      title: "Rohtasgarh Fort",
      district: "Rohtas",
      img: "/RohtasgarhFort.png",
      description:
        "A grand fort built on the Kaimur hills in Rohtas district, known for its strategic location, massive gates, and architectural ruins.",
      lat: 24.9474,
      lng: 84.0161,
    },
    {
      id: 8,
      title: "Raj Mahal Palace Darbhanga",
      district: "Darbhanga",
      img: "/RajMahalPalaceDarbhanga.jpg",
      description:
        "A royal palace built by the Darbhanga Raj family, reflecting the grandeur of Rajput-Mughal architecture in north Bihar.",
      lat: 26.153,
      lng: 85.9014,
    },
    {
      id: 9,
      title: "Sher Shah Suri Tomb",
      district: "Rohtas",
      img: "/SherShahSuriTomb.jpg",
      description:
        "A grand mausoleum of Sher Shah Suri located in Sasaram, built in Indo-Islamic style and surrounded by a large lake.",
      lat: 24.9435,
      lng: 84.0417,
    },
  ],
  "Government Institutions ": [
    {
      id: 1,
      title: "Martyr's memorial",
      district: "Patna",
      img: "/Martyr'smemorial.jpg",
      description:
        "A prominent landmark in Patna commemorating seven young freedom fighters who sacrificed their lives during the Quit India Movement.",
      lat: 25.6094,
      lng: 85.1233,
    },
    {
      id: 2,
      title: "Bihar Vidhan Sabha",
      district: "Patna",
      img: "/BiharVidhanSabha.jpg",
      description:
        "The legislative building of Bihar in Patna, known for its colonial architecture and political significance.",
      lat: 25.609,
      lng: 85.1376,
    },
    {
      id: 3,
      title: "Niyojan Bhavan",
      district: "Patna",
      img: "/NiyojanBhavan.webp",
      description:
        "A key government office in Patna, housing departments related to planning and development.",
      lat: 25.6155,
      lng: 85.1411,
    },
    {
      id: 4,
      title: "Old Secretariat",
      district: "Patna",
      img: "/OldSecretariat.png",
      description:
        "An iconic colonial-era administrative building in Patna, currently housing several state government offices.",
      lat: 25.6215,
      lng: 85.1411,
    },
    {
      id: 5,
      title: "Sardar Patel Bhawan",
      district: "Patna",
      img: "/SardarPatelBhawan.avif",
      description:
        "A government complex named after Sardar Vallabhbhai Patel, serving as an administrative hub in Patna.",
      lat: 25.6112,
      lng: 85.1377,
    },
    {
      id: 6,
      title: "Sultan palace",
      district: "Patna",
      img: "/SultanPalace.png",
      description:
        "A beautiful Indo-Saracenic style palace built in the early 20th century in Patna, originally the residence of Sir Sultan Ahmad.",
      lat: 25.6213,
      lng: 85.1306,
    },
  ],
};

const Location = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Hills & Caves");
  const [mainImage, setMainImage] = useState(categories[selectedCategory][0]);
  const [thumbnails, setThumbnails] = useState(
    categories[selectedCategory].slice(1),
  );

  const MapUpdater = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      if (map && lat && lng) {
        map.setView([lat, lng], map.getZoom(), {
          animate: true,
          duration: 1,
        });
      }
    }, [lat, lng, map]);
    return null;
  };

  // ✅ Update when category changes (with safety check)
  useEffect(() => {
    if (
      categories[selectedCategory] &&
      categories[selectedCategory].length > 0
    ) {
      setMainImage(categories[selectedCategory][0]);
      setThumbnails(categories[selectedCategory].slice(1));
    }
  }, [selectedCategory]);

  // ✅ Fix handleImageClick
  const handleImageClick = (clickedImg, idx) => {
    if (!thumbnails.length) return;
    const currentMain = mainImage;
    const updatedThumbs = [...thumbnails];
    const thumbIndex = idx % thumbnails.length;
    updatedThumbs[thumbIndex] = currentMain;

    setMainImage(clickedImg);
    setThumbnails(updatedThumbs);
  };

  const patnaAirportCoords = { latitude: 25.5941, longitude: 85.0877 };
  let distanceFromPatna = null;

  if (mainImage && mainImage.lat && mainImage.lng) {
    const locationCoords = {
      latitude: mainImage.lat,
      longitude: mainImage.lng,
    };
    distanceFromPatna = getDistance(patnaAirportCoords, locationCoords) / 1000;
  }

  return (
    <motion.div
      className="w-full min-h-screen flex flex-col items-center bg-[#190108] pt-24 px-4 sm:px-8 md:px-12 lg:px-16 pb-20"
      id="Shooting-location"
    >
      <Navbar />

      {/* Explore Section */}
      <div className="bg-[#190108] w-full pt-10 px-2 sm:px-6 lg:px-10">
        {/* Title */}
        <h2 className="text-white text-4xl sm:text-6xl carter-one-regular text-center mb-12">
          Explore Locations
        </h2>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 pb-10">
          {Object.keys(categories).map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg text-sm sm:text-base transition duration-300 ${
                selectedCategory === category
                  ? "bg-[#4f0419] text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-16">
          <motion.div
            key={mainImage.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full h-[25rem] rounded-2xl border-4 border-[#a92b4e] shadow-xl overflow-hidden"
          >
            <img
              src={mainImage.img}
              alt={mainImage.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="px-2 md:px-6">
            <h3 className="text-[#a92b4e] text-3xl font-semibold mb-4">
              {mainImage.title}, {mainImage.district}
            </h3>
            <p className="text-white text-base leading-relaxed text-justify">
              {mainImage.description ||
                "No description available for this location."}
            </p>
            <p className="text-white">
              <strong>Distance from Patna Airport:</strong>{" "}
              {distanceFromPatna ? `${distanceFromPatna.toFixed(2)} km` : "N/A"}
            </p>

            <div className="mt-6 w-full max-w-md h-48 rounded-xl overflow-hidden shadow-lg">
              <MapContainer
                center={[mainImage.lat, mainImage.lng]}
                zoom={9}
                className="w-full h-full -z-[-10]"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[mainImage.lat, mainImage.lng]}>
                  <Popup>
                    {mainImage.title}, {mainImage.district}
                  </Popup>
                </Marker>
                <Polyline
                  positions={[
                    [25.5941, 85.0877], // Patna Airport
                    [mainImage.lat, mainImage.lng],
                  ]}
                  color="#a92b4e"
                />
                <MapUpdater lat={mainImage.lat} lng={mainImage.lng} />
              </MapContainer>
            </div>
          </div>
        </div>

        <div className="overflow-hidden group px-4 mt-4">
          <div className="flex w-max space-x-4 animate-scrollImages group-hover:pause-scroll">
            {[...thumbnails, ...thumbnails].map((item, index) => (
              <motion.div
                key={`${item.title}-${index}`}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer rounded-xl overflow-hidden shadow-md border border-gray-600 w-60 h-36"
                onClick={() => handleImageClick(item, index)}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Location;
