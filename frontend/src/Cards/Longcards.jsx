import React from "react";
import { IoIosArrowRoundForward } from 'react-icons/io';

function CardWithText({ imageUrl, title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group relative w-[22rem] h-[28rem] cursor-pointer"
    >
      {/* Main Card Container */}
      <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a0509] to-[#0d0305] shadow-xl transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-[#4f0419]/20 group-hover:-translate-y-2">

        {/* Accent Border Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4f0419]/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

        {/* Border */}
        <div className="absolute inset-0 rounded-2xl border border-[#3a0d1a]/50 group-hover:border-[#4f0419]/60 transition-colors duration-500" />

        {/* Image Section - 55% Height */}
        <div className="relative h-[55%] overflow-hidden">
          {/* Image with Zoom & Brightness Effect */}
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
          />

          {/* Gradient Overlay for Better Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a0509]/90" />

          {/* Glassmorphism Badge (Optional - for categories/tags) */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <span className="text-xs font-medium text-white">Explore</span>
          </div>
        </div>

        {/* Content Section - 45% Height */}
        <div className="relative h-[45%] p-6 flex flex-col justify-between">
          {/* Text Content */}
          <div className="space-y-3">
            {/* Title with Gradient */}
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent transition-all duration-300 group-hover:from-[#f5e6ea] group-hover:to-white">
              {title}
            </h2>

            {/* Description with Improved Readability */}
            <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 transition-colors duration-300 group-hover:text-gray-300">
              {description}
            </p>
          </div>

          {/* Call-to-Action Section */}
          <div className="flex items-center justify-between mt-4">
            {/* CTA Text */}
            <span className="text-sm font-medium text-[#4f0419] opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
              Learn More
            </span>

            {/* Arrow Icon with Animation */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#4f0419]/10 border border-[#4f0419]/30 transition-all duration-500 group-hover:bg-[#4f0419] group-hover:border-[#4f0419] group-hover:translate-x-1">
              <IoIosArrowRoundForward className="text-2xl text-[#4f0419] transition-colors duration-500 group-hover:text-white" />
            </div>
          </div>

          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#4f0419] to-transparent w-0 transition-all duration-500 group-hover:w-full rounded-bl-2xl" />
        </div>

        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

export default CardWithText;
