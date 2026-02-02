import React, { useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ChevronsRight } from "lucide-react";

// Use CDN worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Pages = React.forwardRef((props, ref) => {
  return (
    <div className="demoPage" ref={ref}>
      <div>{props.children}</div>
    </div>
  );
});

Pages.displayName = "Pages";

function Flipbook({ pdfFile, onBack }) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleDownload = () => {
    if (!pdfFile) return;
    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = pdfFile.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Build pages safely (no crash before numPages is known)
  const pagesArray = numPages ? Array.from({ length: numPages }, (_, i) => i + 1) : [1];

  return (
    <div className="min-h-[calc(100vh-96px)] flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 overflow-hidden relative px-4 pb-10 pt-6">
      {/* Top toolbar (Back + Download) */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-6">
       <div></div>

        <button
          onClick={handleDownload}
          className="text-white bg-[#a92b4e] px-5 py-2 rounded-md hover:bg-[#861838] transition flex items-center gap-2"
        >
          ⬇ Download PDF
        </button>
      </div>

      {/* Hint + Flipbook wrapper */}
      <div className="relative flex items-center justify-center w-full">
        {/* Hint bubble */}
        <div className="hidden md:block absolute left-0 -translate-x-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-white font-medium text-sm flex items-center gap-2">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent font-semibold">
              Click on book to flip pages
            </span>
            <span className="text-yellow-400 text-lg">
              <ChevronsRight />
            </span>
          </p>
        </div>

        {/* Flipbook */}
        <HTMLFlipBook
          width={600}
          height={780}
          showCover={true}
          maxShadowOpacity={0.5}
          drawShadow={true}
          className="z-20"
        >
          {pagesArray.map((pageNum, idx) => (
            <Pages key={idx} number={pageNum}>
              <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                <Page
                  pageNumber={pageNum}
                  width={600}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </Document>
            </Pages>
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
}

export default Flipbook;
