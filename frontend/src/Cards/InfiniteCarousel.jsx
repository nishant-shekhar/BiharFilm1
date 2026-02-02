
import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";


const categories = {
  "Film Locations": [
    { id: 1, title: "Ghora Katora", img: "https://tourism.bihar.gov.in/content/dam/bihar-tourism/images/category_a/nalanda/ghora_katora/ghora-katora.jpg/jcr:content/renditions/cq5dam.web.1280.765.jpeg" },
    { id: 2, title: "Sabhyata Dwar ", img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/b4/c9/00/caption.jpg?w=300&h=300&s=1" },
    { id: 3, title: "Waterfall ", img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/a5/91/4c/amritdhara-water-fal.jpg?w=600&h=-1&s=1" },
    { id: 4, title: "Eco Park", img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/55/22/85/20171225-144241-largejpg.jpg?w=500&h=400&s=1" },
    { id: 5, title: "Buddha Smriti", img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/d4/7a/30/buddha-smriti-park.jpg?w=500&h=400&s=1" },
    { id: 6, title: "Glass Brige", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuzYVUcUsMBY8MLXd5wj87WyDZzM1SdtY4WA&s" },
    { id: 7, title: "Kakolat Waterfall", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAC2njZ5j8j4LGJqHITNWB9IvNodG-O2eu8A&s" },
    { id: 8, title: "Sabhyata Dwar", img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/b4/c9/00/caption.jpg?w=300&h=300&s=1" },
    { id: 9, title: "Glass Brige", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuzYVUcUsMBY8MLXd5wj87WyDZzM1SdtY4WA&s" },
  ],
  "Religious Places": [
    { id: 1, title: "Kundalpur", img: "https://tourism.bihar.gov.in/content/dam/bihar-tourism/images/category_a/nalanda/kundalpur/jainism_nalanda_a_kundalpur_pic_02.jpg/jcr:content/renditions/cq5dam.web.1280.765.jpeg" },
    { id: 2, title: "Mahabodhi ", img: "https://railrecipe.com/blog/wp-content/uploads/2021/03/Mahabodhi-Temple-Gaya.jpg" },
    { id: 3, title: "Jal Mandir", img: "https://www.livehindustan.com/lh-img/uploadimage/library/2022/12/07/16_9/16_9_6/pavapuri_1670422080.JPG" },
    { id: 4, title: "Mundeshwari Temple", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeT4f4L4OocgU4Qgn2syBCu7Rq6kOJjxzuoA&s" },
    { id: 5, title: "Pathar ki Masjid", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbMZ1pa8xEpWxEA1wJyF1996VHYuA-Re_Y9A&s" },
    { id: 6, title: "Jain temple", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTY4CbnTrXURhMWIMQjFlJntd3NtmtGY5KgFIv2-MQHPXKYgaCip1Nrtf1-AtjictH3pUKeQ&s" },
    { id: 7, title: "Shanti Stupa", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx7-AzOH1Rb9W7SBNNkoWFbkEj-FrF_G93Rw&s" },
    { id: 8, title: "Kundalpur", img: "https://tourism.bihar.gov.in/content/dam/bihar-tourism/images/category_a/nalanda/kundalpur/jainism_nalanda_a_kundalpur_pic_02.jpg/jcr:content/renditions/cq5dam.web.1280.765.jpeg" },
    { id: 9, title: "Mundeshwari", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeT4f4L4OocgU4Qgn2syBCu7Rq6kOJjxzuoA&s" },
  ],
  "Wildlife": [
    { id: 1, title: "Valmiki Resrve", img: "https://upload.wikimedia.org/wikipedia/commons/4/49/Panthera_tigris_tigris.jpg" },
    { id: 2, title: "Rajgir Zoo", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSycwVDj9L_mmjJARJYdqQjod6dI3DluF_MRA&s" },
    { id: 3, title: "Kaimur", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQffKZR1FJhlj1hWMNeHcLSP0HHCV6c5hFhdQ&s" },
    { id: 4, title: "Willife Century", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzJjjQ4DGdpYfAx7b3InqlZGMTh41dSHYLQ&s" },
    { id: 5, title: "Bision ", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq4vbA2wyAQsxfH0j1TqcwVNdtjWF6CG_jzA&s" },
    { id: 6, title: "Bhim bham Sanctuary", img: "https://www.mappls.com/place/3BOJDL_1686141367961_0.png" },
    { id: 7, title: "Patna Zoo", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSycwVDj9L_mmjJARJYdqQjod6dI3DluF_MRA&s" },
    { id: 8, title: "Wildlife ", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzJjjQ4DGdpYfAx7b3InqlZGMTh41dSHYLQ&s" },
    { id: 9, title: "Valmiki", img: "https://upload.wikimedia.org/wikipedia/commons/4/49/Panthera_tigris_tigris.jpg" },
  ],
  "Historical Monuments": [
    { id: 1, title: "Ashoka Pillar", img: "https://media.istockphoto.com/id/1365993607/photo/ashoka-pillar-at-vaishali-in-bihar-india.jpg?s=612x612&w=0&k=20&c=E1VlOJI-ch4LduZy1xGLIHkqZcN1KcZiTt6hPn3T228=" },
    { id: 2, title: "Gandikota", img: "https://media.istockphoto.com/id/1246416146/photo/the-great-canyon-in-gandikota.jpg?s=612x612&w=0&k=20&c=pJia2qMx-mfip4-gC8dF-ksE6IYiiQlBoFnSw3uKAy8=" },
    { id: 3, title: "Lord Buddha", img: "https://media.istockphoto.com/id/1224796464/photo/lord-buddha.jpg?s=612x612&w=0&k=20&c=A6iooJrZzSiICu6BqFGqv-hyoDqV-SAIOEFgpY2ANwQ=" },
    { id: 4, title: "Sujata Kuti", img: "https://media.istockphoto.com/id/1128850714/photo/sujata-kuti-stupa-bodh-style-india.jpg?s=612x612&w=0&k=20&c=oRFORgJIgCbxu_cT-lm0nhLwPw1FbSmQZwQMmjUoZdA=" },
    { id: 5, title: "Vaishali Stupa", img: "https://media.istockphoto.com/id/937177718/photo/vaishali-ancient-stupa-in-india.jpg?s=612x612&w=0&k=20&c=F7E_NTGWlcUQvs2LO_NuBFFxXLs2TWRE_k1mnDzkVdM=" },
    { id: 6, title: "Kesariya Stupa", img: "https://media.istockphoto.com/id/1128850736/photo/kesaria-stupa-champaran-district-of-bihar-india.jpg?s=612x612&w=0&k=20&c=7TV49EV6EiDZ6FJG9MD4xy11JA5WgRqHr8X5rEl0o3M=" },
    { id: 7, title: "Mahabodhi", img: "https://media.istockphoto.com/id/842997816/photo/mahabodhi-temple-bodhgaya.jpg?s=612x612&w=0&k=20&c=0_tRix2uyZG0V9DKmCGeEE0h2_Mn4pIAZyyVzP5UDGI=" },
    { id: 8, title: "Vaishali Stupa ", img: "https://media.istockphoto.com/id/937177718/photo/vaishali-ancient-stupa-in-india.jpg?s=612x612&w=0&k=20&c=F7E_NTGWlcUQvs2LO_NuBFFxXLs2TWRE_k1mnDzkVdM=" },
    { id: 9, title: "kesariya Stupa", img: "https://media.istockphoto.com/id/1128850736/photo/kesaria-stupa-champaran-district-of-bihar-india.jpg?s=612x612&w=0&k=20&c=7TV49EV6EiDZ6FJG9MD4xy11JA5WgRqHr8X5rEl0o3M=" },
  ],
};

const FilterableCarousel = () => {
  const [selectedCategory, setSelectedCategory] = useState("Film Locations");
  const [index, setIndex] = useState(0);

  const cards = categories[selectedCategory];
  const totalCards = cards.length;
  const itemsPerPage = 3;

  const nextSlide = () => {
    setIndex((prevIndex) => (prevIndex + itemsPerPage >= totalCards ? 0 : prevIndex + itemsPerPage));
  };

  const prevSlide = () => {
    setIndex((prevIndex) => (prevIndex - itemsPerPage < 0 ? totalCards - itemsPerPage : prevIndex - itemsPerPage));
  };

  return (
    <div className="w-full flex flex-col items-center justify-center bg-zinc-800 py-6">
      <h1 className="text-4xl font-bold mb-4 text-white">Top Shooting Locations</h1>


      <div className="flex space-x-4 mb-6">
        {Object.keys(categories).map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg text-lg ${selectedCategory === category
                ? "bg-[#4f0419] text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            onClick={() => {
              setSelectedCategory(category);
              setIndex(0);
            }}
          >
            {category}
          </button>
        ))}
      </div>




      <div className="overflow-hidden mt-4 w-[70%] relative bg-amber-700">
        <div className="flex gap-6 transition-transform duration-500 ease-in-out bg-zinc-400">
          {cards.slice(index, index + itemsPerPage).map((card) => (
            <div
              key={card.id}
              className="w-72 h-80 border-2 border-white rounded-2xl overflow-hidden bg-transparent transform transition-transform duration ease-in-out hover:scale-95 group"
            >

              <img
                src={card.img}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-[2000ms] ease-in-out group-hover:scale-110"
              />


              <div className="absolute bottom-0 left-0 w-full bg-black/30 backdrop-blur-3xl text-white text-center py-3 z-10">
                {card.title}
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="flex  mt-6 gap-4">
        <button onClick={prevSlide} className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-600">
          <IoIosArrowBack size={30} />
        </button>
        <button onClick={nextSlide} className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-600">
          <IoIosArrowForward size={30} />
        </button>
      </div>
    </div>
  );
};

export default FilterableCarousel;
