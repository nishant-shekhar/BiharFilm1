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

import api from "../Components/axios";
import NOCTimeline from "./NOCTimeline";

const UniversalFormModal = ({
  isOpen,
  onClose,
  selectedRow,
  userRole,
  onForward,
  onApprove,
  onReject,
  onFinalApprove,
  onView,
  showActions = true,
  customActions = null,
}) => {
  const [activeTab, setActiveTab] = React.useState("producerRegistration");
  const [data, setData] = React.useState(null);
  const [isEnriching, setIsEnriching] = React.useState(false);

  // Sync internal data state with selectedRow on open
  useEffect(() => {
    if (isOpen && selectedRow) {
      setData(selectedRow);
    } else if (!isOpen) {
      setData(null);
    }
  }, [isOpen, selectedRow]);

  // Enrichment Logic: Fetch full details if only a summary is provided
  useEffect(() => {
    const fetchFullDetails = async () => {
      // Logic for determining if enrichment is needed:
      // If we have selectedRow but don't have deep fields like annexureOne
      const needsEnrichment =
        isOpen &&
        selectedRow &&
        (selectedRow.applicationId || selectedRow.id) &&
        !selectedRow.annexureOne;

      if (!needsEnrichment) return;

      try {
        setIsEnriching(true);
        const targetId = selectedRow.applicationId || selectedRow.id;

        const roleParam =
          userRole === "district_admin" ? "?role=department_admin" : "";

        const response = await api.get(
          `/api/adminApplication/applications/${targetId}/details${roleParam}`,
        );

        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error("❌ Modal Enrichment Failed:", err);
      } finally {
        setIsEnriching(false);
      }
    };

    fetchFullDetails();
  }, [isOpen, selectedRow, userRole]);

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

  if (!isOpen || !data) return null;

  // Tab definitions
  const tabs = [
    { id: "producerRegistration", label: "Producer Registration Form" },
    { id: "annexureOne", label: "Annexure 1" },
    { id: "nocForm", label: "Annexure 2" },
    { id: "annexureA", label: "Annexure A" },
    { id: "documents", label: "Documents" },
    { id: "synopsis", label: "Synopsis" },
    { id: "undertaking", label: "Undertaking" },
  ];

  // Helper to access nested properties safely
  const getNestedValue = (obj, path) => {
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
          className="text-[#891737] hover:underline inline-flex items-center gap-1 font-bold"
        >
          View Document <FaExternalLinkAlt className="text-[10px]" />
        </a>
      );
    }
    return String(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderTable = (dataItem, fields) => {
    if (!dataItem)
      return (
        <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs bg-gray-50 border border-dashed border-gray-200 rounded-lg">
          Data not available in system
        </div>
      );

    return (
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-gray-200">
            {fields.map(([label, key], i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-widest w-1/3 border-r border-gray-200">
                  {label}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
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
        <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs bg-gray-50 border border-dashed border-gray-200 rounded-lg">
          No location records found
        </div>
      );

    return (
      <div className="space-y-6">
        {locations.map((loc, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Location Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-[#802d44] text-white rounded-lg flex items-center justify-center font-bold text-sm">
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
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase border border-blue-100">
                {loc.locationType}
              </span>
            </div>

            {/* Location Details Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Column 1: Timeline & Scene */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Timeline
                  </label>
                  <div className="text-xs font-medium text-gray-700 space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
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
              <div className="space-y-4 font-medium">
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
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Financials
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 border border-green-100 p-2 rounded-lg text-center">
                      <div className="text-[9px] text-green-600 font-bold uppercase">
                        Fee
                      </div>
                      <div className="text-sm font-bold text-green-800">
                        {loc.locationFee}
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 p-2 rounded-lg text-center">
                      <div className="text-[9px] text-amber-600 font-bold uppercase">
                        Deposit
                      </div>
                      <div className="text-sm font-bold text-amber-800">
                        {loc.securityDeposit}
                      </div>
                    </div>
                  </div>
                  {loc.paymentRef && (
                    <p className="text-[7px] text-gray-400 mt-2 font-bold uppercase">
                      Payment Reference Number:{" "}
                      <span className="font-bold text-[10px]">
                        {loc.paymentRef}
                      </span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Location Manager
                  </label>
                  <div className="text-xs text-gray-700 bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                    {loc.locationManager}
                  </div>
                </div>
              </div>
            </div>

            {/* Forest Specific (Conditional) */}
            {(loc.forestType || loc.forestDetails) && (
              <div className="px-6 py-4 bg-orange-50/50 border-t border-orange-100 grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[9px] font-bold text-orange-600 uppercase tracking-widest block mb-1">
                    Forest Type
                  </label>
                  <p className="text-xs text-gray-700 font-bold uppercase tracking-tight">
                    {loc.forestType}
                  </p>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-orange-600 uppercase tracking-widest block mb-1">
                    Forest Details
                  </label>
                  <p className="text-xs text-gray-700 italic">
                    {loc.forestDetails}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "producerRegistration":
        return renderTable(data.filmmaker?.producerRegistration, [
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
        ]);
      case "annexureOne":
        return renderTable(data.annexureOne, [
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
          ["Est. Manpower (Bihar)", "estimatedManpowerUtilizationBihar"],
          ["Executive Producer", "executiveProducerName"],
          ["EP Designation", "executiveProducerDesignation"],
          ["EP Address", "executiveProducerAddress"],
          ["EP Email", "executiveProducerEmail"],
          ["EP Mobile", "executiveProducerMobile"],
          ["Director & Cast", "directorAndMainCastNames"],
          ["Synopsis", "synopsis"],
          ["Additional Details", "details"],
        ]);
      case "nocForm":
        return renderTable(data.nocForm, [
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
        ]);
      case "annexureA":
        return renderAnnexureA(data.nocForm?.annexureA);
      case "undertaking":
        return renderTable(data.undertaking, [
          ["Document", "documentUrl"],
          ["Uploaded At", "uploadedAt"],
        ]);
      case "documents":
        // Helper to resolve NOC documents object, trying multiple paths
        const nocDocs =
          data.forms?.nocDocumentsAndSynopsis?.data ||
          data.forms?.nocDocumentsAndSynopsis ||
          data.nocDocumentsAndSynopsis?.data ||
          data.nocDocumentsAndSynopsis;

        return (
          <div className="space-y-6">
            {/* NOC Shooting Permission Documents */}
            {nocDocs && (
              <>
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  Shooting Permission Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    {
                      label: "Request Letter",
                      url: nocDocs.requestLetter,
                    },
                    {
                      label: "Registration Certificate",
                      url: nocDocs.registrationCertificate,
                    },
                    {
                      label: "Title Registration",
                      url: nocDocs.titleRegistration,
                    },
                  ].map(
                    (doc, i) =>
                      doc.url && (
                        <a
                          key={`noc-${i}`}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3.5 bg-white border border-gray-200/80 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                            <FaExternalLinkAlt
                              size={14}
                              className="text-blue-500"
                            />
                          </div>
                          <div className="overflow-hidden">
                            <h5 className="text-[12px] font-bold text-gray-700 truncate group-hover:text-gray-900">
                              {doc.label}
                            </h5>
                            <span className="text-[10px] text-blue-500 font-medium flex items-center gap-1 mt-0.5">
                              View Document <FaExternalLinkAlt size={7} />
                            </span>
                          </div>
                        </a>
                      ),
                  )}
                </div>
                {nocDocs.uploadedAt && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    Uploaded: {formatDate(nocDocs.uploadedAt)}
                    {nocDocs.updatedAt &&
                      nocDocs.updatedAt !== nocDocs.uploadedAt &&
                      ` · Updated: ${formatDate(nocDocs.updatedAt)}`}
                  </p>
                )}
              </>
            )}

            {/* Other Documents */}
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4 mt-8">
              Other Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                  url: data.filmmaker?.producerRegistration?.gstCertificate,
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
                {
                  label: "Request Letter",
                  url: data.forms?.requestLetter?.data?.documentUrl,
                },
                {
                  label: "Synopsis",
                  url:
                    data.forms?.nocDocumentsAndSynopsis?.data?.synopsis ||
                    data.forms?.nocDocumentsAndSynopsis?.synopsis ||
                    data.nocDocumentsAndSynopsis?.data?.synopsis ||
                    data.nocDocumentsAndSynopsis?.synopsis,
                },
                {
                  label: "Title Registration",
                  url:
                    data.forms?.nocDocumentsAndSynopsis?.data
                      ?.titleRegistration ||
                    data.forms?.nocDocumentsAndSynopsis?.titleRegistration ||
                    data.nocDocumentsAndSynopsis?.data?.titleRegistration ||
                    data.nocDocumentsAndSynopsis?.titleRegistration,
                },
                {
                  label: "Registration Certificate",
                  url:
                    data.forms?.nocDocumentsAndSynopsis?.data
                      ?.registrationCertificate ||
                    data.forms?.nocDocumentsAndSynopsis
                      ?.registrationCertificate ||
                    data.nocDocumentsAndSynopsis?.data
                      ?.registrationCertificate ||
                    data.nocDocumentsAndSynopsis?.registrationCertificate,
                },
              ].map(
                (doc, i) =>
                  doc.url && (
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3.5 bg-white border border-gray-200/80 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                        <FaExternalLinkAlt size={14} className="text-red-500" />
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="text-[12px] font-bold text-gray-700 truncate group-hover:text-gray-900">
                          {doc.label}
                        </h5>
                        <span className="text-[10px] text-blue-500 font-medium flex items-center gap-1 mt-0.5">
                          View PDF <FaExternalLinkAlt size={7} />
                        </span>
                      </div>
                    </a>
                  ),
              )}
            </div>
          </div>
        );
      case "synopsis":
        const synopsisData =
          data.forms?.nocDocumentsAndSynopsis?.data?.synopsis ||
          data.forms?.nocDocumentsAndSynopsis?.synopsis ||
          data.nocDocumentsAndSynopsis?.data?.synopsis ||
          data.nocDocumentsAndSynopsis?.synopsis;

        return (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              Synopsis
            </h3>
            {synopsisData ? (
              <div className="bg-white border border-gray-200/80 rounded-xl p-6">
                <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {synopsisData}
                </p>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 text-sm bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <FaExternalLinkAlt className="text-gray-300" size={16} />
                </div>
                No synopsis available
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
  };

  const getRoleActions = () => {
    if (customActions) return customActions;

    switch (userRole) {
      case "admin":
        if (
          (data.status || "").toLowerCase() === "approved" &&
          !data.finalApproval?.completed
        ) {
          return (
            <button
              onClick={() => onFinalApprove && onFinalApprove(data)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <FaCheckCircle size={14} />
              <span>Final Approve</span>
            </button>
          );
        }
        return (
          <button
            onClick={() => onForward && onForward(data)}
            className="bg-[#891737] hover:bg-[#6e1129] text-white px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
          >
            Forward Application
          </button>
        );

      case "district_admin":
        return (
          <>
            <button
              onClick={() => onApprove && onApprove(data)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
            >
              <div className="flex items-center gap-2">
                <FaCheckCircle size={14} />
                <span>Validate & Approve</span>
              </div>
            </button>
            <button
              onClick={() => onReject && onReject(data)}
              className="bg-[#802d44] hover:bg-red-900 text-white px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
            >
              <div className="flex items-center gap-2">
                <FaTimes size={14} />
                <span>Decline Application</span>
              </div>
            </button>
          </>
        );

      default:
        return (
          <button
            onClick={onClose}
            className="bg-gray-800 hover:bg-black text-white px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
          >
            Close Viewer
          </button>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden border border-gray-200 flex flex-col relative">
        {/* Enrichment Loading Overlay */}
        {isEnriching && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-50 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#891737] rounded-full animate-spin mb-4" />
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">
              Enriching Record Details...
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 border-r border-gray-100 pr-8">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                <img
                  src="/Logo1.png"
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5">
                  Application Record
                </h2>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                    {data.applicationNumber || "DRAFT"}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                      (data.status || "").toLowerCase() === "approved"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : (data.status || "").toLowerCase() === "rejected"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {data.status || "PENDING"}
                  </span>
                </div>
              </div>
            </div>

            {/* HEADER LEGEND */}
            <div className="hidden md:flex items-center gap-6">
              {[
                { label: "Submitted", color: "bg-purple-600" },
                { label: "Forwarded", color: "bg-blue-600" },
                { label: "Approved", color: "bg-green-600" },
                { label: "Rejected", color: "bg-red-600" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${item.color} shadow-sm shrink-0`}
                  ></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors uppercase tracking-widest"
            >
              <FaDownload size={12} /> PDF
            </button>
            <div className="w-px h-6 bg-gray-200"></div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="bg-gray-50/50 border-b border-gray-200 px-6 flex items-center gap-6 overflow-x-auto scrollbar-hide shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-[#802d44] text-[#802d44]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* MAIN CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-white lg:border-r lg:border-gray-100">
            {renderTabContent()}
          </div>

          {/* SIDEBAR TIMELINE */}
          <div className="w-full lg:w-96 bg-gray-50/30 overflow-y-auto">
            <NOCTimeline nocForm={data} />
          </div>
        </div>

        {/* FOOTER */}
        {showActions && (
          <div className="border-t border-gray-100 bg-white px-6 py-4 flex justify-end shrink-0">
            <div className="flex gap-4">{getRoleActions()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalFormModal;
