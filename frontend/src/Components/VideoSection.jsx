// App.js
import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { motion } from "framer-motion";
import "../App.css";

const videoData = [
  {
    url: "/HeroVideos/BuddhaSamyak.webm", // Placeholder URL
    overlays: [
      {
        title: "The Director's Canvas",
        description: "Raw, authentic locations that breathe life into your narrative.",
        top: "35%",
        left: "25%",
      },
      {
        title: "Heritage Meets Horizon",
        description: "A blank slate of natural wonder for your next masterpiece.",
        top: "60%",
        left: "75%",
      },
    ],
  },
  {
    url: "/HeroVideos/Snow.webm",
    overlays: [
      {
        title: "Rolling Reels. Living Landscapes.",
        description: "From rivers to highways, Bihar opens up as one continuous tracking shot.",
        top: "25%",
        left: "10%",
      },
      {
        title: "Every Road Is a Storyboard",
        description: "Highways, village paths, misty mornings — your next scene is already waiting here.",
        top: "50%",
        left: "50%",
      },
    ],
  },
  {
    url: "/HeroVideos/beach.webm",
    overlays: [
      {
        title: "Where the River Writes the First Line",
        description: "Quiet banks, soft light, endless horizon — a natural set for your opening frame.",
        top: "30%",
        left: "20%",
      },
      {
        title: "River Rhythms of Bihar",
        description: "Crystal water, sand, and laughter — the kind of texture cameras love to linger on.",
        top: "55%",
        left: "70%",
      },
    ],
  },
  {
    url: "/HeroVideos/Snow_1.webm",
    overlays: [
      {
        title: "Rohtas in Reflection",
        description: "Still waters, rugged hills — a mirror for every mood from romance to rebellion.",
        top: "60%",
        left: "25%",
      },
      {
        title: "A Frame for Every Genre",
        description: "Thriller, drama, docu or dreamscape — this blue expanse bends to your story.",
        top: "30%",
        left: "82%",
      },
    ],
  },
  {
    url: "/HeroVideos/karamchat.webm",
    overlays: [
      {
        title: "Plateaus that Feel Like Sets",
        description: "Wind, rock, horizon — minimal, powerful, and made for wide-angle storytelling.",
        top: "45%",
        left: "30%",
      },
      {
        title: "Roots of Bihar. Scale of Cinema.",
        description: "Ancient plateaus and emerald ridges that turn every frame into a poster shot.",
        top: "75%",
        left: "60%",
      },
    ],
  },
  // New Video 1
  {
    url: "/vrvideos/VrvideoHQ6.mp4", // Placeholder URL
    overlays: [
      {
        title: "New Perspectives Unfold",
        description: "Fresh angles and unseen corners waiting to be captured.",
        top: "40%",
        left: "15%",
      },
      {
        title: "Cinematic Horizons",
        description: "Expand your visual vocabulary with these stunning vistas.",
        top: "65%",
        left: "65%",
      },
    ],
  },
  // New Video 2
  
];


function App() {
  const [mouseTargetOffset, setMouseTargetOffset] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [visibleTexts, setVisibleTexts] = useState([false, false]);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    const maxOffsetX = 50;
    const maxOffsetY = 25;
    setMouseTargetOffset({
      x: ((clientX / width) - 0.5) * maxOffsetX,
      y: ((clientY / height) - 0.5) * maxOffsetY,
    });
  };

  useEffect(() => {
    const animate = () => {
      setOffset((prev) => {
        const damping = 0.1;
        return {
          x: prev.x + (mouseTargetOffset.x - prev.x) * damping,
          y: prev.y + (mouseTargetOffset.y - prev.y) * damping,
        };
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, [mouseTargetOffset]);

  useEffect(() => {
    setVisibleTexts([false, false]);
    setTimeout(() => setVisibleTexts([true, false]), 1000);
    setTimeout(() => setVisibleTexts([true, true]), 5000);
  }, [currentVideoIndex]);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoData.length);
  };

  return (
    <motion.div className="min-h-screen flex flex-col bg-black scroll-hidden">
      <Navbar />
      <div className="flex-1 relative overflow-hidden" onMouseMove={handleMouseMove}>
        <div
          className="absolute w-[150vw] h-[150vh] md:w-[120vw] md:h-[120vh] -top-[10vh] -left-[10vw]"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        >
          <video
            key={currentVideoIndex}
            id="videoPlayer"
            className="absolute w-full h-full object-cover top-0 left-0 transition-opacity duration-700 opacity-100"
            src={videoData[currentVideoIndex].url}
            autoPlay
            muted
            onEnded={handleVideoEnd}
          />
          <video
            className="hidden"
            src={videoData[(currentVideoIndex + 1) % videoData.length].url}
            preload="auto"
          />
        </div>

        {videoData[currentVideoIndex].overlays.map((item, index) => (
          <div
            key={index}
            className={`absolute text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl transition-opacity duration-500 group z-10 max-w-[80%] md:max-w-[30%] text-center sm:text-left ${visibleTexts[index] ? "opacity-100" : "opacity-0"
              }`}
            style={{
              top: item.top,
              left: item.left,
              transform: `translate(${offset.x}px, ${offset.y}px)`,
              transition: "transform 0.2s ease-out",
            }}
          >
            {item.title}
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 p-2 bg-black/70 text-xs sm:text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-gray-300">
              {item.description}
            </div>
          </div>
        ))}

        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
          {videoData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideoIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentVideoIndex === index ? "bg-gray-900 scale-125" : "bg-gray-400"
                }`}
            ></button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default App;
