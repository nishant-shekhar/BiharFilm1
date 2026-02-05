import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Logo1 from "../assets/Logo1.png";

const COMPANY_NAME = "BIHAR STATE FILM DEVELOPMENT & FINANCE CORPORATION";
const DEPT_NAME = "Department of Art & Culture, Govt. of Bihar";
const ADDRESS = "Morisson Building, Near Golghar, Patna-800001, Bihar, India";

/**
 * Adds the official header to the PDF page
 * @param {jsPDF} doc
 * @param {string} title - Document Title (e.g., "Annexure 1")
 */
const addHeader = (doc, title) => {
  const pageWidth = doc.internal.pageSize.width;

  try {
    doc.addImage(Logo1, "PNG", 15, 10, 20, 20);
  } catch (err) {
    console.error("Error adding logo:", err);
  }

  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(COMPANY_NAME, pageWidth / 2 + 10, 18, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(DEPT_NAME, pageWidth / 2 + 10, 24, { align: "center" });
  doc.text(ADDRESS, pageWidth / 2 + 10, 29, { align: "center" });

  doc.setLineWidth(0.5);
  doc.line(10, 35, pageWidth - 10, 35);

  doc.setFontSize(16);
  doc.setFont("times", "bold");
  doc.setTextColor(30, 64, 175);
  doc.text(title.toUpperCase(), pageWidth / 2, 48, { align: "center" });

  doc.setLineWidth(0.2);
  doc.setTextColor(0, 0, 0);
};

/**
 * Adds footer with Page Number
 */
const addFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("times", "italic");
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 10, {
      align: "right",
    });
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      20,
      pageHeight - 10,
      { align: "left" },
    );
  }
};

/**
 * Helper to generate key-value table
 */
const generateKeyValueTable = (doc, dataPairs, startY) => {
  autoTable(doc, {
    startY: startY,
    head: [],
    body: dataPairs,
    theme: "grid",
    styles: {
      font: "times",
      fontSize: 10,
      cellPadding: 3,
      valign: "middle",
      lineColor: [200, 200, 200],
    },
    columnStyles: {
      0: { fontStyle: "bold", fillColor: [249, 250, 251], cellWidth: 70 },
      1: { cellWidth: "auto" },
    },
    margin: { top: 10, left: 15, right: 15 },
  });
};

export const generateAnnexure1PDF = (data) => {
  const doc = new jsPDF();
  addHeader(doc, "Annexure 1: Project Details");

  const fields = [
    ["Project Title", data.titleOfProject],
    ["Project Type", data.typeOfProject],
    ["Language", data.language],
    ["Genre", data.genre],
    ["Duration", data.durationOfProject],
    ["Producer Name", data.producerName],
    ["Production House", data.productionHouse],
    ["Line Producer", data.lineProducerNameAndContact],
    ["Total Shooting Days", data.totalShootingDays],
    ["Days In Bihar", data.shootingDaysInBihar],
    ["Shooting Dates", data.shootingDatesInBihar],
    ["Proposed Locations", data.proposedShootingLocationInBihar],
    [
      "Approx Budget",
      data.approximateBudgetOfProject
        ? `INR ${data.approximateBudgetOfProject}`
        : "",
    ],
    [
      "Expenditure In Bihar",
      data.approximateExpenditureInBihar
        ? `INR ${data.approximateExpenditureInBihar}`
        : "",
    ],
    ["Est. Manpower (Bihar)", data.estimatedManpowerUtilizationBihar],
    ["Executive Producer", data.executiveProducerName],
    ["EP Designation", data.executiveProducerDesignation],
    ["EP Address", data.executiveProducerAddress],
    ["EP Email", data.executiveProducerEmail],
    ["EP Mobile", data.executiveProducerMobile],
    ["Director & Cast", data.directorAndMainCastNames],
    ["Synopsis", data.synopsis],
    ["Additional Details", data.details],
  ];

  generateKeyValueTable(doc, fields, 55);
  addFooter(doc);
  doc.save("Annexure_1_Project_Details.pdf");
};

export const generateAnnexure2PDF = (data) => {
  const doc = new jsPDF();
  addHeader(doc, "Annexure 2: NOC Application");

  const fields = [
    ["Project Title", data.title],
    ["Project Type", data.typeOfProject],
    ["Language", data.language],
    ["Genre", data.genre],
    ["Duration", data.duration],
    ["Director & Main Cast", data.directorAndMainCast],
    ["Brief Synopsis", data.briefSynopsis],
    ["Production House", data.producerHouse],
    ["Address", data.productionHouseAddress],
    ["Email", data.emailOfProductionHouse],
    ["Contact", data.contactOfProductionHouse],
    ["Constitution", data.productionHouseConstitution],
    ["Registration No", data.registrationNumber],
    ["Line Producer", data.lineProducerDetails],
    ["Auth. Representative", data.representativeName],
    ["Applicant Name", data.authorizedApplicantName],
    ["Designation", data.designationOfApplicant],
    ["Applicant Address", data.addressOfApplicant],
    ["Applicant Contact", data.contactOfApplicant],
    ["Applicant Email", data.emailOfApplicant],
    ["Description of Scenes", data.briefSynopsis], // Often redundant but kept for structure
    ["No. of Locations", data.numberOfShootingLocations],
    ["Drone Permission", data.dronePermissionRequired ? "Yes" : "No"],
    ["Animals Used", data.animalPartOfShooting ? "Yes" : "No"],
    ["Fire/Blasting", data.fireOrBlastingScene ? "Yes" : "No"],
    ["Temporary Structures", data.temporaryStructureCreation ? "Yes" : "No"],
    ["Police/Security", data.policeOrSecurityRequirement ? "Yes" : "No"],
    ["Site Contact Details", data.siteContactPersonDetails],
    ["Branding/Asset Use", data.inFilmBrandingOrAssetUse],
    ["Other Particulars", data.otherParticulars],
  ];

  generateKeyValueTable(doc, fields, 55);
  addFooter(doc);
  doc.save("Annexure_2_NOC_Application.pdf");
};

export const generateAnnexureAPDF = (locations) => {
  const doc = new jsPDF("l", "mm", "a4"); // Landscape for table
  addHeader(doc, "Annexure A: Location Details");

  // Filter & Format Data for Table
  const tableData = locations.map((loc, i) => [
    i + 1,
    loc.location,
    loc.locationType,
    `${new Date(loc.startDateTime).toLocaleDateString()}\n${new Date(loc.startDateTime).toLocaleTimeString()}`,
    `${new Date(loc.endDateTime).toLocaleDateString()}\n${new Date(loc.endDateTime).toLocaleTimeString()}`,
    loc.sceneDetails || "-",
    loc.personCount || "0",
    loc.locationManager || "-",
    loc.permissionDetails || "-",
  ]);

  autoTable(doc, {
    startY: 55,
    head: [
      [
        "#",
        "Location",
        "Type",
        "Start Time",
        "End Time",
        "Scene Info",
        "Crew",
        "Manager",
        "Permissions",
      ],
    ],
    body: tableData,
    theme: "grid",
    styles: {
      font: "times",
      fontSize: 9,
      cellPadding: 2,
      lineColor: [200, 200, 200],
    },
    headStyles: {
      fillColor: [30, 64, 175], // Blue header
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 10 },
      5: { cellWidth: 50 }, // Scene Info wider
    },
    margin: { top: 10, left: 10, right: 10 },
  });

  addFooter(doc);
  doc.save("Annexure_A_Locations.pdf");
};

export const generateUndertakingPDF = (data) => {
  const doc = new jsPDF();
  addHeader(doc, "Undertaking / Declaration");

  doc.setFont("times", "normal");
  doc.setFontSize(11);

  const content = `
  I, ${data.authorizedPersonName || "[Name]"}, in the capacity of ${data.designation || "[Designation]"}  at ${data.productionHouse || "[Production House]"}, having its registered office at ${data.address || "[Address]"}, do hereby solemnly affirm and declare as under:

  1. That the details provided in the Common Application Form (CAF) and Annexures are true and correct to the best of my knowledge and belief.
  
  2. That we shall abide by all the rules, regulations, and guidelines issued by the Bihar State Film Development & Finance Corporation and the Government of Bihar regarding film shooting in the state.

  3. That we shall not engage in any activity that is detrimental to the public order, decency, or morality, or that defames the State or the Nation.

  4. That we shall ensure the safety and security of all crew members and the general public during the shooting.

  5. That we shall be liable for any damage caused to public or private property during the course of our shooting activities.

  Date: ${new Date().toLocaleDateString()}
  Place: ${data.place || "Bihar"}
  `;

  const splitText = doc.splitTextToSize(content, 180);
  doc.text(splitText, 15, 60);

  // Signatures
  doc.text("__________________________", 140, 200);
  doc.text("Signature of Applicant", 140, 205);
  doc.setFont("times", "bold");
  doc.text(data.authorizedPersonName || "", 140, 210);

  addFooter(doc);
  doc.save("Undertaking.pdf");
};
