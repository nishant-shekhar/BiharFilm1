import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const cardsData = [
  { id: 1, image: "https://www.holidify.com/images/cmsuploads/compressed/fh_20190728235947.jpg", text: "Zurich" },
  { id: 2, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTZjdEExw66n_af1ky4RY3uJtm8SMjvPck-Q&s", text: "Geneva" },
  { id: 3, image: "https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/activities/m_Destinatoin_img_Gaya_2_l_535_800.jpg", text: "Interlaken" },
  { id: 4, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIv-xY01wh6yT9SiWpBo58jdxC7Y5d-R4_a1AaTushDMLTVvwQZpEs3H8iO2qurqv_ndc&usqp=CAU", text: "Lucerne" },
  { id: 5, image: "https://www.holidify.com/images/cmsuploads/compressed/fh_20190728235947.jpg", text: "Bern" },
  { id: 6, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTZjdEExw66n_af1ky4RY3uJtm8SMjvPck-Q&s", text: "Basel" },
  { id: 7, image: "https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/activities/m_Destinatoin_img_Gaya_2_l_535_800.jpg", text: "Lausanne" },
  { id: 8, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIv-xY01wh6yT9SiWpBo58jdxC7Y5d-R4_a1AaTushDMLTVvwQZpEs3H8iO2qurqv_ndc&usqp=CAU", text: "Zermatt" },
];

export default function SlidingCards() {
  const [current, setCurrent] = useState(0);
  const visibleCards = 3;
  const totalCards = cardsData.length;

  const handleNext = () => {
    if (current + visibleCards < totalCards) setCurrent(current + visibleCards);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - visibleCards);
  };

  return (
    <div className="relative flex flex-col bg-[#190108] items-center justify-center min-h-screen pb-28 px-16">
      {/* Arrows Above the Cards */}
      <div className="flex items-center justify-center space-x-8 mb-6">
        <button
          onClick={handlePrev}
          className={`bg-white/20 hover:bg-white/40 p-3 rounded-full z-10 transition-all ${
            current === 0 ? "opacity-30 cursor-not-allowed" : "opacity-100"
          }`}
          disabled={current === 0}
        >
          <ChevronLeft className="text-white w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className={`bg-white/20 hover:bg-white/40 p-3 rounded-full z-10 transition-all ${
            current + visibleCards >= totalCards ? "opacity-30 cursor-not-allowed" : "opacity-100"
          }`}
          disabled={current + visibleCards >= totalCards}
        >
          <ChevronRight className="text-white w-6 h-6" />
        </button>
      </div>

      {/* Card Container */}
      <div className="w-[85%] overflow-hidden px-4">
        <div
          className="flex transition-transform duration-500 space-x-8"
          style={{ transform: `translateX(-${current * (100 / visibleCards)}%)` }}
        >
          {cardsData.map((card, index) => {
            const position = index - current;
            let scale = 1;
            let opacity = 1;
            let zIndex = 1;

            if (position >= 0 && position < visibleCards) {
              scale = 1;
              opacity = 1;
              zIndex = 2;
            } else if (position === visibleCards) {
              scale = 0.85;
              opacity = 0.4;
              zIndex = 1;
            } else {
              opacity = 0;
            }

            return (
              <div
                key={card.id}
                className="relative flex-shrink-0 transition-all duration-500"
                style={{ width: "22rem", transform: `scale(${scale})`, opacity, zIndex }}
              >
                <div className="relative w-[22rem] h-[22rem] rounded-xl overflow-hidden shadow-lg group transition-transform duration-300 hover:scale-95">
                  <img
                    src={card.image}
                    alt={card.text}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-lg text-center font-semibold">
                    {card.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
