import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Flipbook from "../Components/Flipbook";
import Navbar from "../Components/Navbar";
import DocumentSelector from "../Components/DocumentSelector";

const PDFViewerPage = () => {
  const { docId } = useParams();
  const navigate = useNavigate();

  const documents = {

    "bihar-baiskop": "/BiharBaiskop.png",
    "goa-film-brochure": "/GoaFilmBrochure.png",
    "promotion-policy": "/PromotionPolicy.png",
    "film-policy": "/filmPolicy.pdf",
    "op-guidelines": "/OpGuidelineFilms.pdf",
  };

  // If no docId → Show list of documents UI
  if (!docId) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="pt-24">
          <DocumentSelector documents={documents} />
        </div>
      </div>
    );
  }

  const fileUrl = documents[docId];

  if (!fileUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Document Not Found</h1>
          <button
            onClick={() => navigate("/document")}
            className="bg-[#a92b4e] px-6 py-2 rounded-lg hover:bg-[#891737] transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isPdf = fileUrl.toLowerCase().endsWith(".pdf");

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Give some space below fixed navbar */}
      <div className="pt-24">
        {isPdf ? (
          <Flipbook
            pdfFile={fileUrl}
          />
        ) : (
          <div className="min-h-[calc(100vh-96px)] flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 overflow-hidden relative px-4 pb-10 pt-6">
            {/* Top toolbar (Back + Download) */}
            <div className="w-full max-w-5xl flex items-center justify-between mb-6">
              <button
                onClick={() => navigate("/")}
                className="text-white bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700 transition flex items-center gap-2"
              >
                ← Back
              </button>

              <button
                onClick={handleDownload}
                className="text-white bg-[#a92b4e] px-5 py-2 rounded-md hover:bg-[#861838] transition flex items-center gap-2"
              >
                ⬇ Download Image
              </button>
            </div>

            {/* Image Viewer */}
            <div className="relative flex items-center justify-center w-full h-full overflow-auto">
              <img
                src={fileUrl}
                alt="Document"
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewerPage;
