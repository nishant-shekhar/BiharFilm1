import React, { useEffect } from "react";
import {
  FaTimesCircle,
  FaShareAlt,
  FaTimes,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaEye,
  FaDownload,
} from "react-icons/fa";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import NOCTimeline from "./NOCTimeline";

const UniversalFormModal = ({
  isOpen,
  onClose,
  selectedRow,
  userRole,
  onForward,
  onApprove,
  onReject,
  onView,
  showActions = true,
  customActions = null,
}) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !selectedRow) return null;

  // Define sections configuration
  // Define sections configuration based on new API structure
  const sections = [
    {
      title: "Filmmaker Profile",
      fields: [
        ["Name", "filmmaker.user.name"],
        ["Email", "filmmaker.user.email"],
        [
          "Production Company",
          "filmmaker.producerRegistration.productionCompanyName",
        ],
        ["Contact Number", "filmmaker.producerRegistration.contactNumber"],
        ["Producer Email", "filmmaker.producerRegistration.email"],
      ],
    },
    selectedRow.annexureOne
      ? {
          title: "Annexure 1 (Project Details)",
          fields: [
            ["Project Title", "annexureOne.titleOfProject"],
            ["Language", "annexureOne.language"],
            ["Genre", "annexureOne.genre"],
            ["Shooting Days", "annexureOne.totalShootingDays"],
            ["Director", "annexureOne.directorAndMainCast"], // Assuming mapped
            ["Synopsis", "annexureOne.synopsis"],
          ],
        }
      : null,
    selectedRow.nocForm
      ? {
          title: "NOC Form Details",
          fields: [
            ["Project Type", "nocForm.typeOfProject"],
            ["Locations Count", "nocForm.numberOfShootingLocations"],
            ["Drone Permission", "nocForm.dronePermissionRequired"],
            ["Police Security", "nocForm.policeOrSecurityRequirement"],
            ["Fire Scene", "nocForm.fireOrBlastingScene"],
          ],
        }
      : null,
    selectedRow.undertaking
      ? {
          title: "Undertaking",
          fields: [
            ["Example Doc", "undertaking.documentUrl"], // Will trigger URL renderer
          ],
        }
      : null,
    selectedRow.forwardedToDistricts?.length > 0 ||
    selectedRow.forwardedToDepartments?.length > 0
      ? {
          title: "Forwarding History",
          customRender: (row) => (
            <div className="space-y-4">
              {row.forwardedToDistricts?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Districts
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {row.forwardedToDistricts.map((d, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs border border-blue-100"
                      >
                        {d.districtName}{" "}
                        <span className="text-gray-400 ml-1 text-[10px]">
                          {new Date(d.forwardedAt).toLocaleDateString()}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {row.forwardedToDepartments?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Departments
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {row.forwardedToDepartments.map((d, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs border border-amber-100"
                      >
                        {d.departmentName}{" "}
                        <span className="text-gray-400 ml-1 text-[10px]">
                          {new Date(d.forwardedAt).toLocaleDateString()}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ),
        }
      : null,
  ].filter(Boolean);

  // Helper to access nested properties safely
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  // Helper to load image for PDF
  const loadImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = 15;

    // // Load logo
    // const logoImg = await loadImage('/Logo1.png');

    // // --- OFFICIAL HEADER (Like Government Document) ---

    // // Logo on left
    // if (logoImg) {
    //   doc.addImage(logoImg, 'PNG', margin, yPosition, 22, 22);
    // }

    // Main Title - Centered, Bold, Underlined
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    const mainTitle =
      "APPLICATION FORM FOR SEEKING PERMISSION TO SHOOT IN BIHAR";
    doc.text(mainTitle, pageWidth / 2, yPosition, { align: "center" });

    // Underline the title
    const titleWidth = doc.getTextWidth(mainTitle);
    doc.setLineWidth(0.5);
    doc.line(
      pageWidth / 2 - titleWidth / 2,
      yPosition + 1,
      pageWidth / 2 + titleWidth / 2,
      yPosition + 1,
    );

    yPosition += 10;

    // Organization Name - Centered, Bold
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(
      "BIHAR STATE FILM DEVELOPMENT & FINANCE CORPORATION LTD",
      pageWidth / 2,
      yPosition,
      { align: "center" },
    );

    yPosition += 6;

    // Address - Centered
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(
      "Morisson Building, Near Golghar, Patna - 800001, Bihar, India",
      pageWidth / 2,
      yPosition,
      { align: "center" },
    );

    yPosition += 8;

    // Decorative separator line
    doc.setDrawColor(137, 23, 55); // Brand color
    doc.setLineWidth(0.8);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, yPosition + 0.5, pageWidth - margin, yPosition + 0.5);

    yPosition += 6;

    // --- APPLICATION METADATA BOX ---
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 16, "FD");

    const applicationId = selectedRow.id
      ? `APPLICATION ID: NOC-${String(selectedRow.id).padStart(5, "0")}`
      : "DRAFT APPLICATION";
    const status = selectedRow.status
      ? selectedRow.status.toUpperCase().replace("_", " ")
      : "PENDING";
    const submittedDate = selectedRow.createdAt
      ? `SUBMITTED: ${new Date(selectedRow.createdAt).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          },
        )}`
      : "NOT SUBMITTED";

    // Left side - Application ID
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(applicationId, margin + 3, yPosition + 5);

    // Left side - Date
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(submittedDate, margin + 3, yPosition + 10);

    // Right side - Status badge
    doc.setFont("helvetica", "bold");
    doc.text("", pageWidth - margin - 35, yPosition + 5);

    // Status with color
    if (status === "APPROVED") doc.setTextColor(22, 163, 74);
    else if (status === "REJECTED") doc.setTextColor(220, 38, 38);
    else if (status === "FORWARDED") doc.setTextColor(137, 23, 55);
    else doc.setTextColor(217, 119, 6);

    doc.text(status, pageWidth - margin - 25, yPosition + 5, { align: "left" });

    // Production house name
    if (selectedRow.producerHouse) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(7.5);
      doc.text(
        `PRODUCTION HOUSE: ${selectedRow.producerHouse}`,
        margin + 3,
        yPosition + 14,
      );
    }

    yPosition += 20;

    // --- CONTENT SECTIONS ---
    sections.forEach((section) => {
      const validFields = section.fields.filter(([, key]) => {
        const value = getNestedValue(selectedRow, key);
        return value && value !== "" && value !== "N/A";
      });

      if (validFields.length === 0) return;

      // Check page break
      if (yPosition > pageHeight - 25) {
        doc.addPage();
        yPosition = 15;
      }

      // Section Title
      doc.setFillColor(137, 23, 55); // Brand maroon
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 6, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.text(section.title.toUpperCase(), margin + 2, yPosition + 4);

      yPosition += 6.5;

      // Prepare table data
      const tableData = validFields.map(([label, key]) => {
        let value = getNestedValue(selectedRow, key);

        if (
          typeof value === "string" &&
          (value.startsWith("http://") || value.startsWith("https://"))
        ) {
          value = "[View Document Online]";
        }

        if (typeof value === "boolean") {
          value = value ? "Yes" : "No";
        }

        return [label, String(value)];
      });

      // Render table
      autoTable(doc, {
        startY: yPosition,
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 7.5,
          cellPadding: 2.5,
          lineColor: [220, 220, 220],
          lineWidth: 0.2,
          textColor: [40, 40, 40],
          valign: "middle",
        },
        columnStyles: {
          0: {
            cellWidth: 48,
            fontStyle: "bold",
            fillColor: [248, 248, 248],
            textColor: [0, 0, 0],
          },
          1: {
            cellWidth: "auto",
            fontStyle: "normal",
            fillColor: [255, 255, 255],
          },
        },
        margin: { left: margin, right: margin },
      });

      yPosition = doc.lastAutoTable.finalY + 4;
    });

    // --- FOOTER ---
    const addFooter = () => {
      const footerY = pageHeight - 15;

      // Top line
      doc.setDrawColor(137, 23, 55);
      doc.setLineWidth(0.5);
      doc.line(margin, footerY, pageWidth - margin, footerY);

      // Footer content
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");

      const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
      const totalPages = doc.internal.getNumberOfPages();

      // Left
      doc.text("BSFDFC Portal - film.bihar.gov.in", margin, footerY + 4);

      // Center
      doc.setFont("helvetica", "bold");
      doc.text(
        "Department of Art & Culture, Bihar",
        pageWidth / 2,
        footerY + 4,
        {
          align: "center",
        },
      );

      // Right
      doc.setFont("helvetica", "normal");
      doc.text(
        `Page ${pageNum} of ${totalPages}`,
        pageWidth - margin,
        footerY + 4,
        { align: "right" },
      );

      // Bottom line - Date
      doc.setFontSize(6.5);
      doc.setTextColor(140, 140, 140);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        pageWidth / 2,
        footerY + 8,
        { align: "center" },
      );
    };

    // Add footer to all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter();
    }

    // Document metadata
    doc.setProperties({
      title: `BSFDFC NOC Application - ${selectedRow.id || "Draft"}`,
      subject: "Application Form for Film Shooting Permission in Bihar",
      author: "Bihar State Film Development & Finance Corporation Ltd.",
      keywords: "NOC, Film Shooting, Bihar, BSFDFC",
      creator: "BSFDFC Portal",
    });

    // Save PDF
    const fileName = `BSFDFC_NOC_Application_${selectedRow.id || "Draft"}.pdf`;
    doc.save(fileName);
  };

  // Icon mapping for file/URL fields
  const getIconForField = (key) => {
    const iconMap = {
      signature: { icon: "✍️", type: "file" },
      seal: { icon: "🏛️", type: "file" },
      mibCertificate: { icon: "📄", type: "certificate" },
      meaCertificate: { icon: "📋", type: "certificate" },
    };
    return iconMap[key];
  };

  // Check if value is a URL
  const isUrl = (value) => {
    if (typeof value !== "string") return false;
    return value.startsWith("http://") || value.startsWith("https://");
  };

  // Get role-specific actions
  const getRoleActions = () => {
    if (customActions) return customActions;

    switch (userRole) {
      case "admin":
        return (
          <>
            <button
              onClick={() => onForward && onForward(selectedRow)}
              className="bg-[#891737] hover:bg-[#6e1129] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <FaShareAlt className="text-sm" />
                <span>Forward</span>
              </div>
            </button>
            <button
              onClick={() => onReject && onReject(selectedRow)}
              className="bg-white hover:bg-gray-50 text-[#891737] border border-[#891737] hover:border-[#6e1129] px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <FaTimes className="text-sm" />
                <span>Reject</span>
              </div>
            </button>
          </>
        );

      case "district_admin":
        return (
          <>
            <button
              onClick={() => onApprove && onApprove(selectedRow)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-sm" />
                <span>Approve</span>
              </div>
            </button>
            <button
              onClick={() => onReject && onReject(selectedRow)}
              className="bg-[#4f0419] hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <span>Reject</span>
              </div>
            </button>
          </>
        );

      case "filmmaker":
        return (
          <button
            onClick={onClose}
            className="bg-[#891737] hover:bg-[#6e1129] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              <FaEye className="text-sm" />
              <span>Close</span>
            </div>
          </button>
        );

      default:
        return (
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Close
          </button>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-200 flex flex-col">
        {/* HEADER */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
              <img
                src="/Logo1.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Application #{selectedRow.id || "DRAFT"}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide border ${
                    (selectedRow.status || "").toLowerCase() === "approved"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : (selectedRow.status || "").toLowerCase() === "rejected"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  {selectedRow.status || "PENDING"}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(
                    selectedRow.createdAt || Date.now(),
                  ).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              title="Download PDF"
            >
              <FaDownload className="text-sm" />
            </button>

            {onView && (
              <button
                onClick={() => onView(selectedRow)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Open Externally"
              >
                <FaExternalLinkAlt className="text-sm" />
              </button>
            )}

            <div className="w-px h-6 bg-gray-200 mx-1"></div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* MAIN CONTENT */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-white">
            {sections.map((section, index) => {
              const validFields = (section.fields || []).filter(([, key]) => {
                const value = getNestedValue(selectedRow, key);
                return value && value !== "" && value !== "N/A";
              });

              if (validFields.length === 0 && !section.customRender)
                return null;

              return (
                <section key={index}>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                    {section.title}
                  </h3>

                  {section.customRender ? (
                    section.customRender(selectedRow)
                  ) : (
                    <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                      {validFields.map(([label, key], i) => {
                        const value = getNestedValue(selectedRow, key);
                        const isUrlValue = isUrl(value);

                        return (
                          <div key={i}>
                            <dt className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                              {label}
                            </dt>
                            <dd className="text-sm text-gray-900 font-medium break-words leading-relaxed">
                              {isUrlValue ? (
                                <a
                                  href={value}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#891737] hover:underline inline-flex items-center gap-1 group"
                                >
                                  View Document{" "}
                                  <FaExternalLinkAlt className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                              ) : (
                                value
                              )}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  )}
                </section>
              );
            })}
          </div>

          {/* SIDEBAR TIMELINE */}
          <div className="w-full lg:w-80 bg-gray-50/50 border-l border-gray-100 overflow-y-auto p-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
              Application Timeline
            </h3>
            <NOCTimeline nocForm={selectedRow} />
          </div>
        </div>

        {/* FOOTER */}
        {showActions && (
          <div className="border-t border-gray-100 bg-white">
            <div className="flex justify-center gap-3 py-4">
              {getRoleActions()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalFormModal;
