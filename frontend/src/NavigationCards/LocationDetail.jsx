import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { getDistance } from "geolib";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});





const categories = {
  "Hills & Caves": [
    {
      id: 1,
      title: "Barabar Hills",
      img: "https://film.bihar.gov.in/assets/Hills%20and%20Caves/Barabar%20Hills%20000.jpg",
      description: "Barabar Hills, located in the Jehanabad district of Bihar, are home to the oldest surviving rock-cut caves in India, dating back to the Mauryan period.",
      lat: 25.0076,
      lng: 85.0653,
      
    },
    {
      id: 2,
      title: "Gridhakut Hills",
      img: "https://film.bihar.gov.in/assets/Hills%20and%20Caves/Gridhakut%20Hill3%20000.jpg",
      description: "Gridhakut Hills, also known as Vulture Peak, is located near Rajgir in Bihar. It is a significant Buddhist pilgrimage site where Lord Buddha is said to have delivered many important sermons.",
      lat: 25.0172,
      lng: 85.4217
    },
    {
      id: 3,
      title: "Grupa Hills Gaya",
      img: "https://film.bihar.gov.in/assets/Hills%20and%20Caves/Gurpa%20Hill%20Gaya%20000.jpg",
      description: "Grupa Hills (also known as Gurpa Hills) is a sacred Buddhist site located near Gaya in Bihar. .",
      lat: 24.9251,
      lng: 85.1522
    },
    {
      id: 4,
      title: "Kaimur Hills",
      img: "https://film.bihar.gov.in/assets/Hills%20and%20Caves/kaimur%20hills1%20000.jpg",
     description: "Kaimur Hills are part of the Vindhya range in Bihar, known for scenic landscapes, waterfalls, and wildlife.",
     lat: 24.6215,
     lng: 83.5830
    },
    {
      id: 5,
      title: "Kakolat Waterfall",
      img: "https://film.bihar.gov.in/assets/Hills%20and%20Caves/Kakolat%20Waterfalls%20000.jpg",
      description: "Kakolat Waterfall is a scenic spot in Nawada district, famous for its clear waters and natural setting. It’s a popular picnic and shooting destination.",
      lat: 24.7082,
      lng: 85.5200
    },
    {
      id: 6,
      title: "Telhar Kund Kaimur",
      img: "https://film.bihar.gov.in/assets/Hills%20and%20Caves/Telhar%20Kund%20Kaimur%20000.jpg",
      description: "Telhar Kund is a picturesque waterfall located in the Kaimur hills, surrounded by lush forests and rocky cliffs.",
  lat: 24.6467,
  lng: 83.4801
    },
    {
      id: 7,
      title: "Tutla Bhawani Waterfall",
      img: "https://film.bihar.gov.in/assets/Hills%20and%20Caves/tutla%20bhawani%20waterfall.jpeg",
       description: "Tutla Bhawani Waterfall is a hidden gem in Rohtas, known for its serene environment and religious significance.",
  lat: 24.9550,
  lng: 84.0583
    },
    {
  id: 8,
  title: "Vishwa Shanti Stupa",
  img: "https://film.bihar.gov.in/assets/Hills%20and%20Caves/Vishwa%20Stanti%20Stupa%20Rajgir%20000.jpg",
  description: "Vishwa Shanti Stupa in Rajgir is a symbol of world peace, perched on Ratnagiri Hill and accessible by a ropeway.",
  lat: 25.0305,
  lng: 85.4215
},

    
  ],

   "Monuments & Museums": [
    {
      id: 1,
      title: "Bihar Museum",
      img: "https://film.bihar.gov.in/assets/Markets%20and%20Buildings/Bihar%20Museum1%20000.jpg",
      description: "Bihar Museum in Patna showcases Bihar’s rich cultural heritage with modern exhibits and galleries.",
  lat: 25.6071,
  lng: 85.1234
    },
    {
      id: 2,
      title: "Dutch Building",
      img: "https://film.bihar.gov.in/assets/Markets%20and%20Buildings/dutch%20building%20000.jpg",
    description: "The Dutch Building in Patna is a historic colonial-era structure, known for its architectural significance.",
  lat: 25.6102,
  lng: 85.1408
    },
    {
      id: 3,
      title: "Gandhi Sangrahalay",
      img: "https://film.bihar.gov.in/assets/Markets%20and%20Buildings/Gandhi%20Sangrahalaya%20000.jpg",
      description: "Gandhi Sangrahalaya is a museum in Patna dedicated to the life and ideals of Mahatma Gandhi.",
  lat: 25.6135,
  lng: 85.1413
    },
    {
      id: 4,
      title: "Khuda baksh Oriental Library",
      img: "https://film.bihar.gov.in/assets/Markets%20and%20Buildings/khuda%20baksh%20oriental%20library%200000.jpg",
       description: "Khuda Bakhsh Oriental Library in Patna holds rare manuscripts and ancient texts, a treasure trove of history.",
  lat: 25.6120,
  lng: 85.1418
    },
    {
      id: 5,
      title: "Patna Museum",
      img: "https://film.bihar.gov.in/assets/Markets%20and%20Buildings/patna%20museum%20000.jpg",
       description: "Patna Museum in Patna showcases Bihar’s rich cultural heritage with modern exhibits and galleries.",
  lat: 25.6071,
  lng: 85.1234
    },
    {
      id: 6,
      title: "Planetarium Patna",
      img: "https://film.bihar.gov.in/assets/Markets%20and%20Buildings/planetarium%20patna%20000.jpg",
       description: "Patna Planetarium offers educational astronomy shows and exhibits for all ages.",
  lat: 25.6139,
  lng: 85.1442
    },
   
    
  ],

  "Nature":
   [
    {
      id: 1,
      title: "Valmiki Tiger Reserve",
      img: "https://hindi.cdn.zeenews.com/hindi/sites/default/files/2024/03/09/2681300-valmiki-tiger-reserve.jpg?im=Resize=(1200,900)",
       description: "Valmiki Tiger Reserve is Bihar’s only tiger reserve, rich in wildlife including tigers, elephants, and deer.",
  lat: 27.4456,
  lng: 84.9206
    },
    {
      id: 2,
      title: "Rajgir Zoo",
      img: "https://images.bhaskarassets.com/web2images/521/2021/03/10/orig_4_1615322925.jpg",
      description: "Rajgir Zoo (Vishwa Shanti Van) offers a small but diverse collection of animals amid scenic surroundings near Rajgir.",
  lat: 25.0269,
  lng: 85.4204
    },
    {
      id: 3,
      title: "Kaimur Wildlife",
      img: "https://pbs.twimg.com/profile_images/1288390076041277440/pP_qpOz9_400x400.jpg",
      description: "Rajgir Zoo (Vishwa Shanti Van) offers a small but diverse collection of animals amid scenic   surroundings near Rajgir.",
      lat: 25.0269,
      lng: 85.4204    },
    
   
    {
      id: 4,
      title: "Bhimband wildlife Sanctuary",
      img: "https://film.bihar.gov.in/assets/Forest%20and%20wildlife/Bhimband%20Sanctuary%20000.jpg",
      description: "Bhimbandh Wildlife Sanctuary in Munger is known for its hot springs, forests, and a variety of wildlife.",
  lat: 24.4535,
  lng: 86.3286
    },
    {
      id: 5,
      title: "Patna Zoo",
      img: "https://thebusinesscluster.net/wp-content/uploads/2024/03/image-235.png",
     description: "Patna Zoo houses a variety of animal species including tigers, lions, elephants, and offers educational exhibits in a park-like setting.",
  lat: 25.6122,
  lng: 85.1250
    },    
  ],
  
 

};


const LocationDetail = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const numericId = parseInt(id, 10);


  const categoryList = categories[category];
  if (!categoryList) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h2 className="text-2xl font-bold">Category not found.</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }



  const item = categoryList.find((c) => c.id === numericId);
  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h2 className="text-2xl font-bold">Location not found.</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const patnaCoords = { latitude: 25.611, longitude: 85.144 };
  const locationCoords = { latitude: item.lat, longitude: item.lng };
  const distanceFromPatna = (getDistance(patnaCoords, locationCoords) / 1000).toFixed(2);

  return (
    <div className="h-screen overflow-hidden bg-[#190108] text-white flex flex-col items-center px-4 py-8 md:px-16">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-6 px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 flex items-center gap-2"
      >
        ← Back
      </button>

      {/* Grid Layout: Image | Content */}
      <div className="max-w-6xl w-full bg-gray-900 rounded-2xl overflow-hidden shadow-lg grid md:grid-cols-2 flex-grow">
        {/* Image Side */}
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-cover"
        />

        {/* Content Side with internal scroll if needed */}
        <div className="p-6 flex flex-col justify-between overflow-y-auto max-h-screen">
          <div>
            <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
            <p className="text-base leading-relaxed mb-4">
              {item.description || "No description available for this location."}
            </p>
            <div className="mb-4">
              <p><strong>Distance from Patna:</strong> {distanceFromPatna} km</p>
              <p className="mt-2">
                <strong>How to Reach:</strong>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li><strong>Train:</strong> Take a train to Rajgir Railway Station. From there, hire a taxi (approx. 6 km).</li>
                  <li><strong>Bus:</strong> Buses are available from Patna to Rajgir. Use local transport to reach the location.</li>
                  <li><strong>Air:</strong> Nearest airport is in Patna. Take a cab/bus to Rajgir (~95 km).</li>
                </ul>
              </p>
            </div>
          </div>

          {/* Map */}
          {item.lat && item.lng && (
            <div className="h-64 w-full rounded-lg overflow-hidden mt-4">
              <MapContainer
                center={[item.lat, item.lng]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[item.lat, item.lng]}>
                  <Popup>{item.title}</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );


};

export default LocationDetail;
