import React, { useState } from "react";
import {
  FaTimes,
  FaExternalLinkAlt,
  FaDownload,
  FaFilePdf,
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaChevronDown,
} from "react-icons/fa";
import {
  generateAnnexure1PDF,
  generateAnnexure2PDF,
  generateAnnexureAPDF,
  generateUndertakingPDF,
} from "../utils/pdfGenerator";
import Logo1 from "../assets/Logo1.png";

const ApplicationDetailsModal = ({
  isOpen,
  onClose,
  data, // detailedApplication
  loading,
}) => {
  const [activeTab, setActiveTab] = useState("producerRegistration");
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  if (!isOpen) return null;

  // Tabs structure
  const tabs = [
    { id: "producerRegistration", label: "Producer Registration" },
    { id: "annexureOne", label: "Annexure 1 (Project)" },
    { id: "nocForm", label: "Annexure 2 (NOC)" },
    { id: "annexureA", label: "Location Details" },
    { id: "documents", label: "Documents" },
    { id: "timeline", label: "Timeline & Status" },
  ];

  // Helper to access nested properties safely
  const getNestedValue = (obj, path) => {
    if (!obj) return null;
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const renderDataValue = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (
      typeof value === "string" &&
      (value.startsWith("http://") || value.startsWith("https://"))
    ) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
        >
          View Document <FaExternalLinkAlt className="text-[10px]" />
        </a>
      );
    }
    return String(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderTable = (dataItem, fields) => {
    if (!dataItem)
      return (
        <div className="py-8 text-center text-gray-400 font-medium uppercase tracking-widest text-xs bg-gray-50 border border-dashed border-gray-200 rounded-lg">
          Data not available
        </div>
      );

    return (
      <div className="overflow-hidden border border-gray-200 rounded-lg bg-white">
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-gray-100">
            {fields.map(([label, key], i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3 border-r border-gray-100">
                  {label}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium break-words">
                  {renderDataValue(
                    getNestedValue(dataItem, key) ?? dataItem[key],
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAnnexureA = (locations) => {
    if (!locations || locations.length === 0)
      return (
        <div className="py-8 text-center text-gray-400 font-medium uppercase tracking-widest text-xs bg-gray-50 border border-dashed border-gray-200 rounded-lg">
          No location records found
        </div>
      );

    return (
      <div className="space-y-4">
        {locations.map((loc, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
          >
            {/* Location Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-xs">
                  {i + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    {loc.location}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {loc.landmark}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase border border-blue-100">
                {loc.locationType}
              </span>
            </div>

            {/* Location Details Grid */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Column 1: Timeline & Scene */}
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Timeline
                  </label>
                  <div className="text-xs font-medium text-gray-700 space-y-1 bg-gray-50 p-2 rounded border border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Start:</span>
                      <span>
                        {new Date(loc.startDateTime).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">End:</span>
                      <span>{new Date(loc.endDateTime).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Scene Details
                  </label>
                  <p className="text-xs text-gray-700 leading-relaxed italic">
                    {loc.sceneDetails || "No scene details provided"}
                  </p>
                </div>
              </div>

              {/* Column 2: Crew & Logistics */}
              <div className="space-y-3 font-medium">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Crew & Manpower
                  </label>
                  <div className="text-xs text-gray-700">
                    <span className="font-bold">{loc.personCount}</span> People
                    Involved
                    <p className="text-gray-500 mt-1 text-[11px]">
                      {loc.crewInvolvement}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Permission Details
                  </label>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {loc.permissionDetails || "N/A"}
                  </p>
                </div>
              </div>

              {/* Column 3: Financials & Manager */}
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Financials
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 border border-green-100 p-2 rounded text-center">
                      <div className="text-[9px] text-green-600 font-bold uppercase">
                        Fee
                      </div>
                      <div className="text-xs font-bold text-green-800">
                        {loc.locationFee}
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 p-2 rounded text-center">
                      <div className="text-[9px] text-amber-600 font-bold uppercase">
                        Deposit
                      </div>
                      <div className="text-xs font-bold text-amber-800">
                        {loc.securityDeposit}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Location Manager
                  </label>
                  <div className="text-xs text-gray-700 bg-blue-50/50 p-2 rounded border border-blue-100/50">
                    {loc.locationManager}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getBadgeColor = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
      case "ACCEPTED":
        return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      case "PROCESSING":
      case "FORWARDED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Download Handler
  const handleDownload = (type) => {
    setShowDownloadMenu(false);
    if (!data) return;

    switch (type) {
      case "annexure1":
        if (data.forms?.annexureOne?.data) {
          generateAnnexure1PDF(data.forms.annexureOne.data);
        } else {
          // Fallback or Alert
          window.open(data.forms?.annexureOne?.documentUrl || "#", "_blank");
        }
        break;
      case "annexure2":
        if (data.forms?.nocForm?.data) {
          generateAnnexure2PDF(data.forms.nocForm.data);
        } else {
          window.open(data.forms?.nocForm?.documentUrl || "#", "_blank");
        }
        break;
      case "annexureA":
        if (data.forms?.nocForm?.data?.annexureA?.length > 0) {
          generateAnnexureAPDF(data.forms.nocForm.data.annexureA);
        } else {
          // Fallback
        }
        break;
      case "undertaking":
        if (data.forms?.undertaking?.data) {
          generateUndertakingPDF(data.forms.undertaking.data);
        } else {
          window.open(
            data.forms?.undertaking?.data?.documentUrl || "#",
            "_blank",
          );
        }
        break;
      default:
        break;
    }
  };

  // ... (Rest of code)

  // Download Options Configuration
  const downloadOptions = data
    ? [
        {
          label: "Annexure 1 (Project)",
          action: () => handleDownload("annexure1"),
          show: true,
          hasData: !!data.forms?.annexureOne?.data,
        },
        {
          label: "Annexure 2 (NOC)",
          action: () => handleDownload("annexure2"),
          show: true,
          hasData: !!data.forms?.nocForm?.data,
        },
        {
          label: `Annexure A (${data.forms?.nocForm?.data?.annexureA?.length || 0})`,
          action: () => handleDownload("annexureA"),
          show: true,
          hasData: data.forms?.nocForm?.data?.annexureA?.length > 0,
        },
        {
          label: "Undertaking",
          action: () => handleDownload("undertaking"),
          show: true,
          hasData: !!data.forms?.undertaking?.data,
        },
      ]
    : [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-6xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="mr-2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <FaArrowLeft size={16} />
            </button>

            {/* 🔹 LOGO */}
            <img
              src={Logo1}
              alt="Bihar Film"
              className="h-10 w-auto object-contain"
            />

            <div className="pl-2 border-l border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">
                Application Details
              </h2>
              {data && (
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600 border border-gray-200">
                    #{data.applicationNumber}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getBadgeColor(data.status)}`}
                  >
                    {data.status}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 🔹 DOWNLOAD DROPDOWN */}
            {data && (
              <div className="relative">
                <button
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="flex items-center gap-2 px-4  py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-xs font-bold uppercase tracking-wide "
                >
                  <FaDownload size={14} />
                  Download
                  <FaChevronDown
                    size={10}
                    className={`transition-transform duration-200 ${showDownloadMenu ? "rotate-180" : ""}`}
                  />
                </button>

                {showDownloadMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDownloadMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="py-1">
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Select Document
                        </div>
                        {downloadOptions.map(
                          (opt, idx) =>
                            opt.show && (
                              <button
                                key={idx}
                                onClick={opt.action}
                                disabled={!opt.hasData}
                                className={`w-full flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0 transition-colors text-left ${
                                  opt.hasData
                                    ? "hover:bg-blue-50 cursor-pointer"
                                    : "opacity-60 cursor-not-allowed bg-gray-50"
                                }`}
                              >
                                <span
                                  className={`text-xs font-semibold ${opt.hasData ? "text-gray-700" : "text-gray-400"}`}
                                >
                                  {opt.label}
                                </span>
                                {opt.hasData ? (
                                  <FaDownload
                                    size={10}
                                    className="text-blue-400"
                                  />
                                ) : (
                                  <span className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                    No Data
                                  </span>
                                )}
                              </button>
                            ),
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center">
            <div className="animate-spin text-blue-600 mb-2">
              <FaClock size={24} />
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Fetching complete application data...
            </p>
          </div>
        )}

        {!data && !loading && (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            No data available.
          </div>
        )}

        {/* HORIZONTAL TABS */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 flex overflow-x-auto scrollbar-hide shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wide border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        {data && (
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
              {activeTab === "producerRegistration" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b pb-2 mb-4">
                    Producer Registration Details
                  </h3>
                  {renderTable(data.filmmaker?.producerRegistration, [
                    ["Company Name", "productionCompanyName"],
                    ["Company Type", "companyType"],
                    ["Authorized Rep", "authorizedRepresentative"],
                    ["Full Address", "fullAddress"],
                    ["Pin Code", "pinCode"],
                    ["State", "state"],
                    ["Country", "country"],
                    ["Email", "email"],
                    ["Contact", "contactNumber"],
                    ["CIN/Reg No", "companyIdentificationNumber"],
                    ["CIN Document", "companyIdentificationDocument"],
                    ["PAN", "pan"],
                    ["PAN Document", "panDocument"],
                    ["GST No", "gstRegistrationNumber"],
                    ["GST Certificate", "gstCertificate"],
                    ["LP Company Name", "lineProducerCompanyName"],
                    ["LP Company Type", "lineProducerCompanyType"],
                    ["LP Name", "lineProducerName"],
                    ["LP PAN", "lineProducerPan"],
                    ["LP Address", "lineProducerAddress"],
                    ["LP Pin Code", "lineProducerPinCode"],
                    ["LP State", "lineProducerState"],
                    ["LP Email", "lineProducerEmail"],
                    ["LP Mobile", "lineProducerMobile"],
                  ])}
                </div>
              )}

              {activeTab === "annexureOne" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b pb-2 mb-4">
                    Annexure 1 (Project Details)
                  </h3>
                  {renderTable(data.forms?.annexureOne?.data, [
                    ["Project Title", "titleOfProject"],
                    ["Project Type", "typeOfProject"],
                    ["Language", "language"],
                    ["Genre", "genre"],
                    ["Duration", "durationOfProject"],
                    ["Producer Name", "producerName"],
                    ["Production House", "productionHouse"],
                    ["Line Producer", "lineProducerNameAndContact"],
                    ["Total Shooting Days", "totalShootingDays"],
                    ["Days In Bihar", "shootingDaysInBihar"],
                    ["Shooting Dates", "shootingDatesInBihar"],
                    ["Proposed Locations", "proposedShootingLocationInBihar"],
                    ["Approx Budget", "approximateBudgetOfProject"],
                    ["Expenditure In Bihar", "approximateExpenditureInBihar"],
                    [
                      "Est. Manpower (Bihar)",
                      "estimatedManpowerUtilizationBihar",
                    ],
                    ["Executive Producer", "executiveProducerName"],
                    ["EP Designation", "executiveProducerDesignation"],
                    ["EP Address", "executiveProducerAddress"],
                    ["EP Email", "executiveProducerEmail"],
                    ["EP Mobile", "executiveProducerMobile"],
                    ["Director & Cast", "directorAndMainCastNames"],
                    ["Synopsis", "synopsis"],
                    ["Additional Details", "details"],
                  ])}
                </div>
              )}

              {activeTab === "nocForm" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b pb-2 mb-4">
                    Annexure 2 (NOC Application)
                  </h3>
                  {renderTable(data.forms?.nocForm?.data, [
                    ["Project Title", "title"],
                    ["Project Type", "typeOfProject"],
                    ["Language", "language"],
                    ["Genre", "genre"],
                    ["Duration", "duration"],
                    ["Director & Main Cast", "directorAndMainCast"],
                    ["Synopsis", "synopsis"],
                    ["Brief Synopsis", "briefSynopsis"],
                    ["Production House", "producerHouse"],
                    ["Production House Address", "productionHouseAddress"],
                    ["Production House Email", "emailOfProductionHouse"],
                    ["Production House Contact", "contactOfProductionHouse"],
                    ["PH Constitution", "productionHouseConstitution"],
                    ["Registration Number", "registrationNumber"],
                    ["Line Producer Details", "lineProducerDetails"],
                    ["Authorized Representative", "representativeName"],
                    ["Applicant Name", "authorizedApplicantName"],
                    ["Applicant Designation", "designationOfApplicant"],
                    ["Applicant Address", "addressOfApplicant"],
                    ["Applicant Contact", "contactOfApplicant"],
                    ["Applicant Email", "emailOfApplicant"],
                    ["Main Artists at Location", "mainArtistsAtLocation"],
                    ["Shooting Locations Count", "numberOfShootingLocations"],
                    ["Drone Permission", "dronePermissionRequired"],
                    ["Animal in Shooting", "animalPartOfShooting"],
                    ["Fire/Blasting Scene", "fireOrBlastingScene"],
                    ["Temporary Structures", "temporaryStructureCreation"],
                    ["Police/Security Req", "policeOrSecurityRequirement"],
                    ["Site Contact Details", "siteContactPersonDetails"],
                    ["Branding/Asset Use", "inFilmBrandingOrAssetUse"],
                    ["Other Particulars", "otherParticulars"],
                    ["Other Details", "otherDetails"],
                    ["MIB Certificate", "mibCertificate"],
                    ["MEA Certificate", "meaCertificate"],
                    ["Official Seal", "seal"],
                    ["Signature", "signature"],
                  ])}
                </div>
              )}

              {activeTab === "annexureA" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b pb-2 mb-4">
                    Annexure A (Locations)
                  </h3>
                  {renderAnnexureA(data.forms?.nocForm?.data?.annexureA)}
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b pb-2 mb-4">
                    Uploaded Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        label: "Company ID",
                        url: data.filmmaker?.producerRegistration
                          ?.companyIdentificationDocument,
                      },
                      {
                        label: "PAN Card",
                        url: data.filmmaker?.producerRegistration?.panDocument,
                      },
                      {
                        label: "GST Certificate",
                        url: data.filmmaker?.producerRegistration
                          ?.gstCertificate,
                      },
                      {
                        label: "MIB Certificate",
                        url: data.forms?.nocForm?.data?.mibCertificate,
                      },
                      {
                        label: "MEA Certificate",
                        url: data.forms?.nocForm?.data?.meaCertificate,
                      },
                      {
                        label: "Undertaking",
                        url: data.forms?.undertaking?.data?.documentUrl,
                      },
                    ].map(
                      (doc, i) =>
                        doc.url && (
                          <a
                            key={i}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all group"
                          >
                            <div className="p-2 bg-red-50 text-red-500 rounded shadow-sm group-hover:text-red-600">
                              <FaFilePdf size={18} />
                            </div>
                            <div className="ml-3 overflow-hidden">
                              <h5 className="text-xs font-bold text-gray-700 truncate group-hover:text-blue-700">
                                {doc.label}
                              </h5>
                              <span className="text-[10px] text-blue-500 font-medium flex items-center gap-1 mt-0.5">
                                View PDF <FaExternalLinkAlt size={8} />
                              </span>
                            </div>
                          </a>
                        ),
                    )}

                    {/* If no docs found */}
                    {!data.filmmaker?.producerRegistration
                      ?.companyIdentificationDocument &&
                      !data.forms?.nocForm?.data?.mibCertificate && (
                        <div className="col-span-full py-8 text-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                          No documents found.
                        </div>
                      )}
                  </div>
                </div>
              )}

              {activeTab === "timeline" && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b pb-2 mb-4">
                    Application History
                  </h3>

                  {/* 🔹 RICH STATUS SUMMARY (Synced with Table) */}
                  {(() => {
                    const events = data.timeline || [];

                    // Filter Latest Department Events (Same logic as Table)
                    const deptMap = {};
                    events.forEach((ev) => {
                      if (ev.officeType !== "DEPARTMENT") return;
                      if (
                        !deptMap[ev.officeId] ||
                        ev.id > deptMap[ev.officeId].id
                      ) {
                        deptMap[ev.officeId] = ev;
                      }
                    });
                    const departments = Object.values(deptMap);

                    return (
                      <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 mb-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
                        {/* 1. Progress Bar */}
                        {departments.length > 0 && (
                          <div className="flex-1 w-full space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              Overall Progress
                            </label>
                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
                              {data.status === "APPROVED" ? (
                                // 🔹 Force Full Green if Approved
                                <div className="h-full w-full bg-green-500" />
                              ) : (
                                departments.map((dept, i) => {
                                  let color = "bg-gray-300";
                                  if (
                                    ["APPROVED", "ACCEPTED"].includes(
                                      dept.status,
                                    )
                                  )
                                    color = "bg-green-500";
                                  if (dept.status === "REJECTED")
                                    color = "bg-red-500";
                                  return (
                                    <div
                                      key={i}
                                      className={`h-full flex-1 ${color} border-r border-white/50 last:border-0`}
                                    />
                                  );
                                })
                              )}
                            </div>
                            <div className="flex justify-between text-[11px] font-medium text-gray-600">
                              <span>
                                {data.status === "APPROVED"
                                  ? departments.length
                                  : departments.filter((d) =>
                                      ["APPROVED", "ACCEPTED"].includes(
                                        d.status,
                                      ),
                                    ).length}{" "}
                                Approved
                              </span>
                              <span>
                                {departments.length} Total Departments
                              </span>
                            </div>
                          </div>
                        )}

                        {/* 2. Current Stage */}
                        <div className="flex-1 w-full space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Current Stage
                          </label>
                          <div className="flex items-center gap-2">
                            {(() => {
                              if (data.status === "APPROVED")
                                return (
                                  <div className="text-green-600 font-bold text-sm flex items-center gap-1">
                                    <FaCheckCircle /> All Stages Cleared
                                  </div>
                                );

                              const pendingDepts = departments.filter(
                                (d) =>
                                  ![
                                    "APPROVED",
                                    "ACCEPTED",
                                    "REJECTED",
                                  ].includes(d.status),
                              );
                              const approvedDepts = departments.filter((d) =>
                                ["APPROVED", "ACCEPTED"].includes(d.status),
                              );
                              const rejectedDepts = departments.filter(
                                (d) => d.status === "REJECTED",
                              );

                              if (
                                pendingDepts.length > 0 ||
                                approvedDepts.length > 0 ||
                                rejectedDepts.length > 0
                              ) {
                                return (
                                  <div className="flex flex-wrap gap-2">
                                    {rejectedDepts.map((d, i) => (
                                      <span
                                        key={`rej-${i}`}
                                        className="bg-white border border-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold shadow-sm flex items-center gap-1"
                                      >
                                        <FaTimes size={10} /> Rejected by{" "}
                                        {d.officeName}
                                      </span>
                                    ))}
                                    {approvedDepts.map((d, i) => (
                                      <span
                                        key={`app-${i}`}
                                        className="bg-white border border-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold shadow-sm flex items-center gap-1"
                                      >
                                        <FaCheckCircle size={10} />{" "}
                                        {d.officeName}
                                      </span>
                                    ))}
                                    {pendingDepts.map((d, i) => (
                                      <span
                                        key={`pend-${i}`}
                                        className="bg-white border border-indigo-100 text-indigo-600 px-2 py-1 rounded text-xs font-semibold shadow-sm"
                                      >
                                        Pending with {d.officeName}
                                      </span>
                                    ))}
                                  </div>
                                );
                              }
                              return (
                                <span className="text-gray-500 text-sm italic">
                                  Initial Review / Processing
                                </span>
                              );
                            })()}
                          </div>
                        </div>

                        {/* 3. Last Updated */}
                        <div className="space-y-2 text-right">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                            Last Updated
                          </label>
                          <div className="text-sm font-bold text-gray-700">
                            {formatDate(data.updatedAt || data.createdAt)}
                          </div>
                          <div className="text-[10px] text-gray-400 italic">
                            Application ID: {data.applicationNumber}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm bg-white">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">
                            Department
                          </th>
                          <th className="px-6 py-3 text-center font-semibold text-gray-500 uppercase tracking-wider">
                            Document
                          </th>
                          <th className="px-6 py-3 text-center font-semibold text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-center font-semibold text-gray-500 uppercase tracking-wider">
                            Forwarded
                          </th>
                          <th className="px-6 py-3 text-center font-semibold text-gray-500 uppercase tracking-wider">
                            Decided
                          </th>
                          <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">
                            Remarks
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {(() => {
                          // Calculate latest status for departments from timeline
                          const events = data.timeline || [];
                          const deptMap = {};

                          events.forEach((ev) => {
                            // 🔹 FILTER OUT 'DISTRICT' TYPE
                            if (ev.officeType === "DISTRICT") return;

                            if (!deptMap[ev.officeId]) {
                              deptMap[ev.officeId] = ev;
                            } else {
                              if (ev.id > deptMap[ev.officeId].id) {
                                deptMap[ev.officeId] = ev;
                              }
                            }
                          });

                          const deptRows = Object.values(deptMap);

                          // 🔹 CHECK SUCCESS CONDITION
                          // Condition: Must have Final Approval from Admin
                          const isFinalApproved =
                            data.finalApproval?.isApproved &&
                            data.finalApproval?.status === "APPROVED";

                          console.log("isFinalApproved", isFinalApproved);

                          // Check if all departments approved/accepted (for intermediate status)
                          const allDepartmentsCleared =
                            deptRows.length > 0 &&
                            deptRows.every((r) =>
                              ["ACCEPTED", "APPROVED"].includes(
                                r.status?.toUpperCase(),
                              ),
                            );

                          // 🔹 INJECT FINAL APPROVAL ROW
                          if (isFinalApproved) {
                            deptRows.push({
                              id: "final-approval-row",
                              officeName:
                                "Bihar State Film Development and Finance Corporation",
                              status: "APPROVED",
                              documentUrl: data.finalApproval.documentUrl,
                              forwardedAt: data.finalApproval.createdAt, // Approximate
                              decidedAt: data.finalApproval.approvedAt,
                              remarks: "Final Shooting Permission Granted",
                            });
                          }

                          if (deptRows.length === 0) {
                            return (
                              <tr>
                                <td
                                  colSpan="6"
                                  className="px-6 py-8 text-center text-gray-400"
                                >
                                  No timeline history available yet.
                                </td>
                              </tr>
                            );
                          }

                          return (
                            <>
                              {/* 🔹 FINAL SUCCESS BANNER */}
                              {isFinalApproved && (
                                <tr>
                                  <td colSpan="6" className="px-0 py-0">
                                    <div className="bg-green-50 border-b border-green-100 p-4 text-center">
                                      <div className="inline-flex items-center gap-2 text-green-700 font-bold text-sm uppercase tracking-wide">
                                        <FaCheckCircle size={16} />
                                        NOC Permission is Granted
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}

                              {/* 🔹 WAITING FOR FINAL APPROVAL BANNER */}
                              {!isFinalApproved && allDepartmentsCleared && (
                                <tr>
                                  <td colSpan="6" className="px-0 py-0">
                                    <div className="bg-blue-50 border-b border-blue-100 p-4 text-center">
                                      <div className="inline-flex items-center gap-2 text-blue-700 font-bold text-sm uppercase tracking-wide">
                                        <FaClock size={16} />
                                        Awaiting Final Approval
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}

                              {deptRows
                                .sort((a, b) => {
                                  if (a.status === "REJECTED") return -1;
                                  if (b.status === "REJECTED") return 1;
                                  return 0;
                                })
                                .map((row) => (
                                  <tr
                                    key={row.id}
                                    className="hover:bg-gray-50 transition-colors"
                                  >
                                    <td className="px-6 py-3 font-medium text-gray-700">
                                      {row.officeName}
                                    </td>

                                    <td className="px-6 py-3 text-center">
                                      {/* Check for documentUrl or similar in row (timeline event) */}
                                      {row.documentUrl ||
                                      row.forwardedLetterUrl ? (
                                        <a
                                          href={
                                            row.documentUrl ||
                                            row.forwardedLetterUrl
                                          }
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-blue-600 hover:text-blue-800 p-1.5 bg-blue-50 rounded-full inline-flex items-center justify-center transition-colors"
                                          title="View Document"
                                        >
                                          <FaFilePdf size={12} />
                                        </a>
                                      ) : (
                                        <span className="text-gray-300">-</span>
                                      )}
                                    </td>

                                    <td className="px-6 py-3 text-center">
                                      <span
                                        className={`px-2 py-1 rounded border text-[10px] uppercase font-semibold ${getBadgeColor(
                                          row.status,
                                        )}`}
                                      >
                                        {row.status}
                                      </span>
                                    </td>

                                    <td className="px-6 py-3 text-gray-500 text-center">
                                      {formatDate(row.forwardedAt)}
                                    </td>

                                    <td className="px-6 py-3 text-gray-500 text-center whitespace-nowrap">
                                      {row.decidedAt
                                        ? formatDate(row.decidedAt)
                                        : "-"}
                                    </td>

                                    <td
                                      className="px-6 py-3 text-gray-500 max-w-xs truncate"
                                      title={row.remarks}
                                    >
                                      {row.remarks || "-"}
                                    </td>
                                  </tr>
                                ))}
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;
