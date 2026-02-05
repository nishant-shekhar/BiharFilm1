import React from "react";
import { FaTimes, FaCheckCircle, FaEdit } from "react-icons/fa";
import Logo1 from "../assets/Logo1.png";

const UniversalPreviewModal = ({
  isOpen,
  onClose,
  onConfirm,
  data,
  title = "APPLICATION PREVIEW",
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  // Helper to format field names (camelCase to Title Case)
  const formatFieldName = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Helper to render value
  const renderValue = (value) => {
    if (value instanceof File) {
      return (
        <span className="text-blue-600 font-medium flex items-center gap-1">
          📄 {value.name}
        </span>
      );
    }
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (!value) return <span className="text-gray-400 italic">N/A</span>;
    if (typeof value === "object" && value.name) return value.name; // For stored file objects
    return String(value);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-['Times_New_Roman']">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-200">
        {/* HEADER - PDF STYLE */}
        <div className="bg-white p-6 border-b-2 border-gray-800 shrink-0">
          <div className="flex flex-col items-center text-center space-y-2">
            {/* Logo & Company Name */}
            <div className="flex items-center justify-center gap-4 mb-2">
              {/* Logo placement similar to PDF */}
              <img
                src={Logo1}
                alt="BSFDFC Logo"
                className="w-16 h-16 object-contain"
              />
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide font-serif">
              Bihar State Film Development & Finance Corporation
            </h1>

            <h2 className="text-sm md:text-base text-gray-700 font-serif">
              Department of Art & Culture, Govt. of Bihar
            </h2>

            <p className="text-xs md:text-sm text-gray-600 font-serif">
              Morisson Building, Near Golghar, Patna-800001, Bihar, India
            </p>
          </div>

          <div className="w-full h-px bg-gray-400 my-4"></div>

          <h3 className="text-lg md:text-xl font-bold text-[#1e40af] text-center uppercase tracking-wider font-serif underline decoration-1 underline-offset-4">
            {title}
          </h3>
        </div>

        {/* BODY - SCROLLABLE DATA */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/50">
          <div className="space-y-8 max-w-4xl mx-auto">
            {Object.entries(data).map(([sectionTitle, sectionData], index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-none border border-gray-300 shadow-[2px_2px_0px_rgba(0,0,0,0.05)]"
              >
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-[0.15em] mb-6 border-b border-gray-100 pb-2">
                  {formatFieldName(sectionTitle)}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {Object.entries(sectionData).map(([key, value]) => (
                    <div key={key} className="group">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#891737] transition-colors">
                        {formatFieldName(key)}
                      </label>
                      <div className="text-sm font-serif text-gray-900 border-b border-gray-100 pb-1 min-h-[24px]">
                        {renderValue(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Declaration Text similar to Undertaking */}
            <div className="mt-8 p-6 bg-[#fffbf0] border border-amber-100 text-xs text-justify font-serif leading-relaxed text-gray-700">
              <strong>Declaration:</strong> I hereby declare that the details
              furnished above are true and correct to the best of my knowledge
              and belief and I undertake the responsibility to inform about any
              changes therein, immediately. In case any of the above information
              is found to be false or untrue or misleading or misrepresenting, I
              am aware that I may be held liable for it.
            </div>
          </div>
        </div>

        {/* FOOTER - ACTIONS */}
        <div className="border-t border-gray-200 bg-white p-4 md:px-8 md:py-5 flex justify-between items-center shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2.5 text-gray-600 font-bold text-xs uppercase tracking-widest hover:text-[#891737] hover:bg-[#891737]/5 rounded-lg transition-all"
            disabled={isSubmitting}
          >
            <FaEdit className="text-sm" /> Edit Details
          </button>

          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#891737] hover:bg-[#70122d] text-white px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#891737]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FaCheckCircle className="text-sm" /> Confirm & Submit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversalPreviewModal;
