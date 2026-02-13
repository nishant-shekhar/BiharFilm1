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

const ApplicationDetailsModal = ({ isOpen, onClose, data, loading }) => {
  const [activeTab, setActiveTab] = useState("producerRegistration");
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  if (!isOpen) return null;

  const tabs = [
    { id: "producerRegistration", label: "Producer" },
    { id: "annexureOne", label: "Annexure 1" },
    { id: "nocForm", label: "Annexure 2" },
    { id: "annexureA", label: "Annexure A" },
    { id: "documents", label: "Documents" },
    { id: "synopsis", label: "Synopsis" },
    { id: "timeline", label: "Timeline" },
  ];

  const getNestedValue = (obj, path) => {
    if (!obj) return null;
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const renderDataValue = (value) => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean")
      return (
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded ${value ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
        >
          {value ? "Yes" : "No"}
        </span>
      );
    if (
      typeof value === "string" &&
      (value.startsWith("http://") || value.startsWith("https://"))
    ) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-semibold bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-100 transition-colors"
        >
          View Document <FaExternalLinkAlt className="text-[9px]" />
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

  // ─────────── Data Table Renderer ───────────
  const renderTable = (dataItem, fields) => {
    if (!dataItem)
      return (
        <div className="py-12 text-center text-gray-400 text-sm bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <FaFilePdf className="text-gray-300" size={16} />
          </div>
          Data not available
        </div>
      );

    return (
      <div className="overflow-hidden border border-gray-200/80 rounded-xl bg-white">
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-gray-100">
            {fields.map(([label, key], i) => (
              <tr
                key={i}
                className="group hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-5 py-3 bg-gray-50/30 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[35%] border-r border-gray-100">
                  {label}
                </td>
                <td className="px-5 py-3 text-[13px] text-gray-800 break-words">
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

  // ─────────── Annexure A (Locations) ───────────
  const renderAnnexureA = (locations) => {
    if (!locations || locations.length === 0)
      return (
        <div className="py-12 text-center text-gray-400 text-sm bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
          No location records found
        </div>
      );

    return (
      <div className="space-y-4">
        {locations.map((loc, i) => (
          <div
            key={i}
            className="border border-gray-200/80 rounded-xl overflow-hidden bg-white hover:shadow-sm transition-shadow"
          >
            {/* Location Header */}
            <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                  {i + 1}
                </span>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900">
                    {loc.location}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    {loc.landmark}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold uppercase border border-blue-100">
                {loc.locationType}
              </span>
            </div>

            {/* Location Details Grid */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Column 1: Timeline & Scene */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Timeline
                  </label>
                  <div className="text-[11px] font-medium text-gray-700 space-y-1.5 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Start</span>
                      <span className="font-semibold">
                        {new Date(loc.startDateTime).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">End</span>
                      <span className="font-semibold">
                        {new Date(loc.endDateTime).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Scene Details
                  </label>
                  <p className="text-[12px] text-gray-600 leading-relaxed">
                    {loc.sceneDetails || "No scene details provided"}
                  </p>
                </div>
              </div>

              {/* Column 2: Crew & Logistics */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Crew & Manpower
                  </label>
                  <div className="text-[12px] text-gray-700">
                    <span className="text-lg font-bold text-gray-900">
                      {loc.personCount}
                    </span>
                    <span className="text-gray-400 ml-1">people</span>
                    <p className="text-gray-500 mt-1 text-[11px] leading-relaxed">
                      {loc.crewInvolvement}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Permission Details
                  </label>
                  <p className="text-[12px] text-gray-600 leading-relaxed">
                    {loc.permissionDetails || "—"}
                  </p>
                </div>
              </div>

              {/* Column 3: Financials & Manager */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Financials
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg text-center">
                      <div className="text-[9px] text-emerald-600 font-bold uppercase">
                        Fee
                      </div>
                      <div className="text-sm font-bold text-emerald-800 mt-0.5">
                        {loc.locationFee}
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-lg text-center">
                      <div className="text-[9px] text-amber-600 font-bold uppercase">
                        Deposit
                      </div>
                      <div className="text-sm font-bold text-amber-800 mt-0.5">
                        {loc.securityDeposit}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Location Manager
                  </label>
                  <div className="text-[12px] text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 font-medium">
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

  // ─────────── Badge ───────────
  const getBadgeConfig = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
      case "ACCEPTED":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          dot: "bg-emerald-500",
        };
      case "REJECTED":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          dot: "bg-red-500",
        };
      case "PROCESSING":
      case "FORWARDED":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          dot: "bg-blue-500",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          border: "border-gray-200",
          dot: "bg-gray-400",
        };
    }
  };

  // ─────────── Download Handler ───────────
  const handleDownload = (type) => {
    setShowDownloadMenu(false);
    if (!data) return;

    switch (type) {
      case "annexure1":
        if (data.forms?.annexureOne?.data) {
          generateAnnexure1PDF(data.forms.annexureOne.data);
        } else {
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

  const statusBadge = data ? getBadgeConfig(data.status) : null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-6xl h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* ═══════════ HEADER ═══════════ */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <FaArrowLeft size={13} />
            </button>

            <img
              src={Logo1}
              alt="Bihar Film"
              className="h-9 w-auto object-contain"
            />

            <div className="pl-3 border-l border-gray-200">
              <h2 className="text-sm font-bold text-gray-900">
                Application Details
              </h2>
              {data && (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    {data.applicationNumber}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider ${statusBadge?.bg} ${statusBadge?.text} ${statusBadge?.border}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${statusBadge?.dot}`}
                    />
                    {data.status}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Dropdown */}
            {data && (
              <div className="relative">
                <button
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-[11px] font-bold uppercase tracking-wide"
                >
                  <FaDownload size={11} />
                  Download
                  <FaChevronDown
                    size={8}
                    className={`transition-transform duration-200 ${showDownloadMenu ? "rotate-180" : ""}`}
                  />
                </button>

                {showDownloadMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDownloadMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                      <div className="px-3.5 py-2 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Select Document
                      </div>
                      {downloadOptions.map(
                        (opt, idx) =>
                          opt.show && (
                            <button
                              key={idx}
                              onClick={opt.action}
                              disabled={!opt.hasData}
                              className={`w-full flex items-center justify-between px-3.5 py-2.5 border-b border-gray-50 last:border-0 transition-colors text-left ${
                                opt.hasData
                                  ? "hover:bg-gray-50 cursor-pointer"
                                  : "opacity-50 cursor-not-allowed"
                              }`}
                            >
                              <span
                                className={`text-[11px] font-semibold ${opt.hasData ? "text-gray-700" : "text-gray-400"}`}
                              >
                                {opt.label}
                              </span>
                              {opt.hasData ? (
                                <FaDownload
                                  size={9}
                                  className="text-gray-400"
                                />
                              ) : (
                                <span className="text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                  No Data
                                </span>
                              )}
                            </button>
                          ),
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <FaTimes size={14} />
            </button>
          </div>
        </div>

        {/* ═══════════ LOADING ═══════════ */}
        {loading && (
          <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
              <FaClock size={20} className="text-gray-400 animate-spin" />
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Loading application data...
            </p>
          </div>
        )}

        {!data && !loading && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 text-sm">No data available.</p>
          </div>
        )}

        {/* ═══════════ TABS ═══════════ */}
        <div className="bg-white border-b border-gray-200 px-5 flex overflow-x-auto scrollbar-hide shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-[11px] font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══════════ CONTENT ═══════════ */}
        {data && (
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
            <div className="max-w-5xl mx-auto">
              {/* ──── Producer Registration ──── */}
              {activeTab === "producerRegistration" && (
                <div className="space-y-4">
                  <SectionHeader title="Producer Registration Details" />
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

              {/* ──── Annexure 1 ──── */}
              {activeTab === "annexureOne" && (
                <div className="space-y-4">
                  <SectionHeader title="Annexure 1 — Project Details" />
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

              {/* ──── Annexure 2 ──── */}
              {activeTab === "nocForm" && (
                <div className="space-y-4">
                  <SectionHeader title="Annexure 2 — NOC Application" />
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

              {/* ──── Annexure A (Locations) ──── */}
              {activeTab === "annexureA" && (
                <div className="space-y-4">
                  <SectionHeader title="Annexure A — Shooting Locations" />
                  {renderAnnexureA(data.forms?.nocForm?.data?.annexureA)}
                </div>
              )}

              {/* ──── Documents ──── */}
              {activeTab === "documents" && (
                <div className="space-y-6">
                  {/* NOC Shooting Permission Documents */}
                  {data.forms?.nocDocumentsAndSynopsis?.data && (
                    <>
                      <SectionHeader title="Shooting Permission Documents" />
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          {
                            label: "Request Letter",
                            url: data.forms.nocDocumentsAndSynopsis.data
                              .requestLetter,
                          },
                          {
                            label: "Registration Certificate",
                            url: data.forms.nocDocumentsAndSynopsis.data
                              .registrationCertificate,
                          },
                          {
                            label: "Title Registration",
                            url: data.forms.nocDocumentsAndSynopsis.data
                              .titleRegistration,
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
                                  <FaFilePdf
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
                      {data.forms.nocDocumentsAndSynopsis.data.uploadedAt && (
                        <p className="text-[10px] text-gray-400 mt-1">
                          Uploaded:{" "}
                          {formatDate(
                            data.forms.nocDocumentsAndSynopsis.data.uploadedAt,
                          )}
                          {data.forms.nocDocumentsAndSynopsis.data.updatedAt &&
                            data.forms.nocDocumentsAndSynopsis.data
                              .updatedAt !==
                              data.forms.nocDocumentsAndSynopsis.data
                                .uploadedAt &&
                            ` · Updated: ${formatDate(
                              data.forms.nocDocumentsAndSynopsis.data.updatedAt,
                            )}`}
                        </p>
                      )}
                    </>
                  )}

                  {/* Other Documents */}
                  <SectionHeader title="Other Documents" />
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
                      {
                        label: "Request Letter",
                        url: data.forms?.requestLetter?.data?.documentUrl,
                      },
                      {
                        label: "Synopsis",
                        url: data.forms?.nocDocumentsAndSynopsis?.data
                          ?.synopsis,
                      },
                      {
                        label: "Title Registration",
                        url: data.forms?.nocDocumentsAndSynopsis?.data
                          ?.titleRegistration,
                      },
                      {
                        label: "Registration Certificate",
                        url: data.forms?.nocDocumentsAndSynopsis?.data
                          ?.registrationCertificate,
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
                              <FaFilePdf size={14} className="text-red-500" />
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

                    {!data.filmmaker?.producerRegistration
                      ?.companyIdentificationDocument &&
                      !data.forms?.nocForm?.data?.mibCertificate && (
                        <div className="col-span-full py-12 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
                          No documents found
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* ──── Synopsis ──── */}
              {activeTab === "synopsis" && (
                <div className="space-y-4">
                  <SectionHeader title="Synopsis" />
                  {data.forms?.nocDocumentsAndSynopsis?.data?.synopsis ? (
                    <div className="bg-white border border-gray-200/80 rounded-xl p-6">
                      <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {data.forms.nocDocumentsAndSynopsis.data.synopsis}
                      </p>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-400 text-sm bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <FaFilePdf className="text-gray-300" size={16} />
                      </div>
                      No synopsis available
                    </div>
                  )}
                </div>
              )}

              {/* ──── Timeline ──── */}
              {activeTab === "timeline" && (
                <div className="space-y-5">
                  <SectionHeader title="Application Timeline" />

                  {/* Status Summary */}
                  {(() => {
                    const events = data.timeline || [];
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
                      <div className="bg-white rounded-xl border border-gray-200/80 p-5 flex flex-col md:flex-row gap-6 items-start">
                        {/* Progress */}
                        {departments.length > 0 && (
                          <div className="flex-1 w-full space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              Overall Progress
                            </label>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                              {data.status === "APPROVED" ? (
                                <div className="h-full w-full bg-emerald-500 rounded-full" />
                              ) : (
                                departments.map((dept, i) => {
                                  let color = "bg-gray-300";
                                  if (
                                    ["APPROVED", "ACCEPTED"].includes(
                                      dept.status,
                                    )
                                  )
                                    color = "bg-emerald-500";
                                  if (dept.status === "REJECTED")
                                    color = "bg-red-500";
                                  return (
                                    <div
                                      key={i}
                                      className={`h-full flex-1 ${color} border-r border-white last:border-0`}
                                    />
                                  );
                                })
                              )}
                            </div>
                            <div className="flex justify-between text-[11px] font-medium text-gray-500">
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
                              <span>{departments.length} Departments</span>
                            </div>
                          </div>
                        )}

                        {/* Current Stage */}
                        <div className="flex-1 w-full space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Current Stage
                          </label>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {(() => {
                              if (data.status === "APPROVED")
                                return (
                                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                    <FaCheckCircle size={11} /> All Stages
                                    Cleared
                                  </span>
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
                                  <>
                                    {rejectedDepts.map((d, i) => (
                                      <span
                                        key={`rej-${i}`}
                                        className="inline-flex items-center gap-1 text-[11px] text-red-700 font-medium bg-red-50 px-2 py-1 rounded-md border border-red-100"
                                      >
                                        <FaTimes size={9} /> {d.officeName}
                                      </span>
                                    ))}
                                    {approvedDepts.map((d, i) => (
                                      <span
                                        key={`app-${i}`}
                                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100"
                                      >
                                        <FaCheckCircle size={9} />{" "}
                                        {d.officeName}
                                      </span>
                                    ))}
                                    {pendingDepts.map((d, i) => (
                                      <span
                                        key={`pend-${i}`}
                                        className="inline-flex items-center gap-1 text-[11px] text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded-md border border-blue-100"
                                      >
                                        <FaClock size={9} /> {d.officeName}
                                      </span>
                                    ))}
                                  </>
                                );
                              }
                              return (
                                <span className="text-gray-400 text-xs">
                                  Initial Review
                                </span>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Last Updated */}
                        <div className="space-y-1 text-right shrink-0">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                            Last Updated
                          </label>
                          <p className="text-sm font-bold text-gray-800">
                            {formatDate(data.updatedAt || data.createdAt)}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">
                            {data.applicationNumber}
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Timeline Table */}
                  <div className="overflow-hidden border border-gray-200/80 rounded-xl bg-white">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200/80">
                          <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            Department
                          </th>
                          <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            Doc
                          </th>
                          <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            Forwarded
                          </th>
                          <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            Decided
                          </th>
                          <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            Remarks
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {(() => {
                          const events = data.timeline || [];
                          const deptMap = {};

                          events.forEach((ev) => {
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

                          const isFinalApproved =
                            data.finalApproval?.isApproved &&
                            data.finalApproval?.status === "APPROVED";

                          const allDepartmentsCleared =
                            deptRows.length > 0 &&
                            deptRows.every((r) =>
                              ["ACCEPTED", "APPROVED"].includes(
                                r.status?.toUpperCase(),
                              ),
                            );

                          if (isFinalApproved) {
                            deptRows.push({
                              id: "final-approval-row",
                              officeName:
                                "Bihar State Film Development and Finance Corporation",
                              status: "APPROVED",
                              documentUrl: data.finalApproval.documentUrl,
                              forwardedAt: data.finalApproval.createdAt,
                              decidedAt: data.finalApproval.approvedAt,
                              remarks: "Final Shooting Permission Granted",
                            });
                          }

                          if (deptRows.length === 0) {
                            return (
                              <tr>
                                <td
                                  colSpan="6"
                                  className="px-5 py-12 text-center text-gray-400 text-sm"
                                >
                                  No timeline history available yet
                                </td>
                              </tr>
                            );
                          }

                          return (
                            <>
                              {/* Final Approval Banner */}
                              {isFinalApproved && (
                                <tr>
                                  <td colSpan="6" className="px-0 py-0">
                                    <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-center justify-center gap-2">
                                      <FaCheckCircle
                                        size={14}
                                        className="text-emerald-600"
                                      />
                                      <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">
                                        NOC Permission Granted
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              )}

                              {/* Awaiting Approval Banner */}
                              {!isFinalApproved && allDepartmentsCleared && (
                                <tr>
                                  <td colSpan="6" className="px-0 py-0">
                                    <div className="bg-blue-50 border-b border-blue-100 px-5 py-3 flex items-center justify-center gap-2">
                                      <FaClock
                                        size={14}
                                        className="text-blue-600"
                                      />
                                      <span className="text-blue-700 font-bold text-xs uppercase tracking-wider">
                                        Awaiting Final Approval
                                      </span>
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
                                .map((row) => {
                                  const badge = getBadgeConfig(row.status);
                                  return (
                                    <tr
                                      key={row.id}
                                      className="hover:bg-gray-50/50 transition-colors"
                                    >
                                      <td className="px-5 py-3 text-[12px] font-medium text-gray-700">
                                        {row.officeName}
                                      </td>

                                      <td className="px-5 py-3 text-center">
                                        {row.documentUrl ||
                                        row.forwardedLetterUrl ? (
                                          <a
                                            href={
                                              row.documentUrl ||
                                              row.forwardedLetterUrl
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                            title="View Document"
                                          >
                                            <FaFilePdf size={11} />
                                          </a>
                                        ) : (
                                          <span className="text-gray-300">
                                            —
                                          </span>
                                        )}
                                      </td>

                                      <td className="px-5 py-3 text-center">
                                        <span
                                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[9px] uppercase font-bold tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}
                                        >
                                          <span
                                            className={`w-1 h-1 rounded-full ${badge.dot}`}
                                          />
                                          {row.status}
                                        </span>
                                      </td>

                                      <td className="px-5 py-3 text-gray-500 text-center text-[11px]">
                                        {formatDate(row.forwardedAt)}
                                      </td>

                                      <td className="px-5 py-3 text-gray-500 text-center whitespace-nowrap text-[11px]">
                                        {row.decidedAt
                                          ? formatDate(row.decidedAt)
                                          : "—"}
                                      </td>

                                      <td
                                        className="px-5 py-3 text-gray-500 max-w-xs truncate text-[11px]"
                                        title={row.remarks}
                                      >
                                        {row.remarks || "—"}
                                      </td>
                                    </tr>
                                  );
                                })}
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

// ─────────── Section Header ───────────
const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-3 pb-3 border-b border-gray-200/80 mb-1">
    <div className="w-1 h-5 bg-gray-900 rounded-full" />
    <h3 className="text-[13px] font-bold text-gray-900 tracking-tight">
      {title}
    </h3>
  </div>
);

export default ApplicationDetailsModal;
