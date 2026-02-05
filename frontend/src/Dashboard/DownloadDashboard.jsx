// src/Dashboard/DownloadDashboard.jsx
import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import logo from "/Logo1.png"; // from public folder

const DownloadDashboard = ({ selectedRow }) => {
  const handleDownload = () => {
    if (!selectedRow) {
      alert("No row selected");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let currentY = 20;

    // === HEADER SECTION ===
    // Header Border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.8);
    doc.rect(10, 10, pageWidth - 20, 70);

    // Government of Bihar Header
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 128); // Navy blue
    doc.text("GOVERNMENT OF BIHAR", pageWidth/2, 18, { align: "center" });

    // Department name
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("Department of Art & Culture", pageWidth/2, 25, { align: "center" });

    // Logo (positioned left)
    try {
      doc.addImage(logo, "PNG", 15, 30, 25, 25);
    } catch (error) {
      console.log("Logo not found, continuing without logo");
    }

    // Organization Name (main title)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(128, 0, 0); // Maroon
    doc.text("Bihar State Film Development & Finance Corporation", pageWidth/2, 38, { align: "center" });
    doc.text("(BSFDFC)", pageWidth/2, 46, { align: "center" });

    // Address
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("Patna, Bihar - 800001", pageWidth/2, 54, { align: "center" });

    // Document type
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 128);
    doc.text("NO OBJECTION CERTIFICATE (NOC) - APPLICATION DETAILS", pageWidth/2, 68, { align: "center" });

    currentY = 90;

    // === DOCUMENT INFO BOX ===
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(10, currentY, pageWidth - 20, 25, 2, 2, 'FD');

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);

    // Document details in header box
    const docDate = new Date().toLocaleDateString('en-IN');
    const docTime = new Date().toLocaleTimeString('en-IN');
    
    doc.text(`Document Generated: ${docDate} at ${docTime}`, 15, currentY + 8);
    doc.text(`Application ID: ${selectedRow.id || 'N/A'}`, 15, currentY + 16);
    doc.text(`Reference No: NOC/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`, pageWidth - 15, currentY + 8, { align: "right" });
    doc.text(`Status: ${selectedRow.status || 'Under Review'}`, pageWidth - 15, currentY + 16, { align: "right" });

    currentY += 35;

    // === APPLICANT INFORMATION SECTION ===
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(128, 0, 0);
    doc.text("APPLICANT INFORMATION", 15, currentY);

    currentY += 5;

    // Underline for section
    doc.setDrawColor(128, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(15, currentY, 60, currentY);

    currentY += 10;

    // Personal details section
    const personalFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    const personalData = personalFields
      .filter(field => selectedRow[field])
      .map(field => [
        field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1'),
        selectedRow[field] || 'N/A'
      ]);

    if (personalData.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [['Personal Details', 'Information']],
        body: personalData,
        styles: { 
          fontSize: 10, 
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.1
        },
        headStyles: { 
          fillColor: [128, 0, 0],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 11
        },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold', fillColor: [250, 250, 250] },
          1: { cellWidth: 120 }
        },
        margin: { left: 15, right: 15 },
        didDrawPage: function (data) {
          currentY = data.cursor.y;
        }
      });
    }

    currentY += 15;

    // === PROJECT/APPLICATION DETAILS ===
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(128, 0, 0);
    doc.text("PROJECT/APPLICATION DETAILS", 15, currentY);

    currentY += 5;
    doc.line(15, currentY, 85, currentY);
    currentY += 10;

    // Project details
    const excludeFields = ['id', 'name', 'email', 'phone', 'address', 'city', 'state', 'pincode', 'createdAt', 'updatedAt'];
    const projectData = Object.entries(selectedRow)
      .filter(([key]) => !excludeFields.includes(key))
      .map(([key, value]) => [
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        value || 'N/A'
      ]);

    if (projectData.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [['Project Details', 'Information']],
        body: projectData,
        styles: { 
          fontSize: 10, 
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.1
        },
        headStyles: { 
          fillColor: [0, 0, 128],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 11
        },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold', fillColor: [248, 248, 255] },
          1: { cellWidth: 120 }
        },
        margin: { left: 15, right: 15 },
        didDrawPage: function (data) {
          currentY = data.cursor.y;
        }
      });
    }

    // === FOOTER SECTION ===
    const footerY = pageHeight - 40;

    // Footer border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(15, footerY, pageWidth - 15, footerY);

    // Official note
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("This is a computer-generated document and does not require a physical signature.", 15, footerY + 8);

    // Generation info
    doc.setFont("helvetica", "normal");
    doc.text(`Generated by: Film Bihar Dashboard System`, 15, footerY + 16);
    doc.text(`Print Date: ${new Date().toLocaleDateString('en-IN')} | Print Time: ${new Date().toLocaleTimeString('en-IN')}`, 15, footerY + 24);

    // Official seal placeholder (right side)
    doc.setDrawColor(128, 0, 0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - 80, footerY + 5, 65, 25, 2, 2, 'S');
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(128, 0, 0);
    doc.text("BSFDFC", pageWidth - 47, footerY + 15, { align: "center" });
    doc.text("OFFICIAL DOCUMENT", pageWidth - 47, footerY + 22, { align: "center" });

    // Page numbering
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(`Page 1 of 1`, pageWidth/2, pageHeight - 5, { align: "center" });

    // === WATERMARK ===
    doc.setGState(new doc.GState({opacity: 0.1}));
    doc.setFontSize(50);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(128, 0, 0);
    
    // Rotate and add watermark
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({opacity: 0.05}));
    const watermarkText = "BSFDFC";
    doc.text(watermarkText, pageWidth/2, pageHeight/2, {
      angle: 45,
      align: 'center'
    });
    doc.restoreGraphicsState();

    // Save the file
    const fileName = `NOC_Application_${selectedRow.id || new Date().getTime()}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="inline-flex items-center">
      <button
        onClick={handleDownload}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-800 to-red-900 text-white font-semibold rounded-lg hover:from-red-900 hover:to-red-950 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
        Download Official PDF
      </button>
    </div>
  );
};

export default DownloadDashboard;
