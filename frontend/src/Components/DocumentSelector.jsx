import React from "react";
import { FileText, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DocumentSelector = ({ documents }) => {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Documents</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(documents).map(([id, path]) => (
          <div
            key={id}
            className="bg-gray-800/60 rounded-xl p-5 border border-gray-700 hover:border-[#a92b4e] transition cursor-pointer group"
            onClick={() => navigate(`/document/${id}`)}
          >
            {/* Icon */}
            <div className="flex items-center justify-between mb-4">
              <FileText className="text-[#a92b4e] group-hover:text-white transition" size={28} />
              <Download size={20} className="text-gray-400 group-hover:text-white transition" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-white group-hover:text-[#a92b4e] transition capitalize">
              {id.replace(/-/g, " ")}
            </h2>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm mt-2">
              Click to view, flip pages, or download
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentSelector;
