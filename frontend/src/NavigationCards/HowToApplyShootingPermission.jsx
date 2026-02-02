import React, { useState } from "react";
import {
  FileText,
  Download,
  Mail,
  CheckCircle2,
  Sparkles,
  FileCheck,
  Calendar,
  ArrowRight,
  Building,
  ScrollText,
  Stamp,
} from "lucide-react";
import Navbar from "../Components/Navbar";

const HowToApplyShootingPermission = () => {
  const [hoveredDoc, setHoveredDoc] = useState(null);
  const [activeStep, setActiveStep] = useState(1);

  // ✅ Sample PDF links (replace later)
  const LINKS = {
    opGuidelines: "document/op-guidelines",
    undertaking: "/pdf/Undertaking.pdf",

    annexure1: "/pdf/Annexture1.pdf",
    annexure2: "/pdf/annexture2.pdf",
    annexureA: "/pdf/annextureA.pdf",
  };

  const documents = [
    {
      icon: FileText,
      title: "Request Letter",
      subtitle: "On letterhead",
      // no download
    },
    {
      icon: Stamp,
      title: "Undertaking",
      subtitle:
        "To be copied and pasted on Letter Head with signature and seal with date",
      downloadUrl: LINKS.undertaking,
    },
    {
      icon: Building,
      title: "Company Registration",
      subtitle: "Certificate",
      // no download
    },
    {
      icon: FileCheck,
      title: "Title Registration",
      subtitle: "Certificate (IMPPA/WIFPA etc.)",
      // no download
    },
    {
      icon: ScrollText,
      title: "Synopsis",
      subtitle: "250 words",
      // no download
    },
    {
      icon: Download,
      title: "Annexure 1",
      subtitle: "Page 9",
      downloadUrl: LINKS.annexure1,
    },
    {
      icon: Download,
      title: "Annexure 2",
      subtitle: "Page 10-12",
      downloadUrl: LINKS.annexure2,
    },
    {
      icon: Download,
      title: "Annexure A",
      subtitle: "Seperately for Each District",
      downloadUrl: LINKS.annexureA,
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Register Online",
      items: [
        "Visit biharfilm.web.app",
        "Navigate to Policy & Forms",
        "Fill Producer Registration Form",
        "Submit form digitally",
      ],
      icon: FileText,
    },
    {
      num: "02",
      title: "Prepare Documents",
      items: [
        "Read Operational Guidelines",
        "Fill Annexure-1 (Page 9)",
        "Fill Annexure-2 (Page 10-12)",
        "Fill Annexure-A for each district seperately (Page 13-14)",
        "Download Undertaking format, copy and paste on your letterhead; fill and submit duly signed and sealed with date",
      ],
      icon: Download,
    },
    {
      num: "03",
      title: "Submit Everything",
      items: [
        "Compile all required documents",
        "Scan high-quality copies",
        "Email to biharfilmnigam@gmail.com",
        "Wait for confirmation",
      ],
      icon: Mail,
    },
  ];

  // ✅ Link rules for step items (new tab vs download)
  const STEP_LINKS = {
    "Fill Producer Registration Form": {
      href: "https://docs.google.com/forms/d/e/1FAIpQLSddl9uk7rqu-_fl6N4U_vgYXlrL_pwUTQaY5Mm8AqjB4NRSYQ/viewform",
      kind: "newtab",
    },
    "Read Operational Guidelines": { href: LINKS.opGuidelines, kind: "newtab" },

    "Fill Annexure-1 (Page 9)": { href: LINKS.annexure1, kind: "download" },
    "Fill Annexure-2 (Page 10-12)": { href: LINKS.annexure2, kind: "download" },
    "Fill Annexure-A for each district seperately (Page 13-14)": {
      href: LINKS.annexureA,
      kind: "download",
    },
    "Download Undertaking format and submit duly filled on your letterhead/letter pad":
      {
        href: LINKS.undertaking,
        kind: "download",
      },
  };

  return (
    <div className="min-h-screen bg-[#190108] transition-colors duration-300">
      <Navbar />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#891737]/5 border border-[#891737]/20 mb-6">
            <Sparkles className="w-4 h-4 text-[#891737]" />
            <span className="text-sm font-medium text-[#891737]">
              BIHAR STATE FILM DEVELOPMENT & FINANCE CO. LTD
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Shooting <span className="text-[#891737]">Permission</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Morrison Building, Near Gol Ghar, Patna - 800 001
          </p>
        </div>

        {/* Required Documents */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-white">
              Required Documents
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {documents.map((doc, idx) => {
              const Icon = doc.icon;
              const isDownload = !!doc.downloadUrl;

              const CardInner = (
                <div
                  onMouseEnter={() => setHoveredDoc(idx)}
                  onMouseLeave={() => setHoveredDoc(null)}
                  className="group relative"
                >
                  <div
                    className={`
                      relative h-full p-6 rounded-2xl 
                      bg-white border border-gray-200 shadow-sm
                      transition-all duration-300
                      ${isDownload ? "cursor-pointer" : "cursor-default"}
                      ${
                        hoveredDoc === idx
                          ? "border-[#891737] shadow-md -translate-y-1"
                          : "hover:border-gray-300"
                      }
                    `}
                  >
                    <div className="relative z-10">
                      <div
                        className={`
                          w-12 h-12 rounded-xl bg-gray-50 
                          flex items-center justify-center mb-4
                          group-hover:bg-[#891737] transition-colors duration-300
                        `}
                      >
                        <Icon className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
                      </div>

                      <h3 className="text-gray-800 font-semibold text-lg mb-1">
                        {doc.title}
                      </h3>
                      <p className="text-gray-500 text-xs">{doc.subtitle}</p>
                    </div>
                  </div>
                </div>
              );

              // ✅ Keep UI same: only wrap with <a> when downloadable
              return isDownload ? (
                <a
                  key={idx}
                  href={doc.downloadUrl}
                  download
                  className="block"
                  aria-label={`Download ${doc.title}`}
                >
                  {CardInner}
                </a>
              ) : (
                <div key={idx} className="block">
                  {CardInner}
                </div>
              );
            })}
          </div>

          <p className="text-gray-400 text-sm mt-6">
            Note: Annexure formats are also available inside the Operational
            Guidelines on the mentioned pages.
          </p>
        </div>

        {/* Application Process */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-white">
              Application Process
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx + 1)}
                  className={`
                    relative p-8 rounded-3xl cursor-pointer
                    bg-white border-2 shadow-sm
                    transition-all duration-500 group
                    ${
                      activeStep === idx + 1
                        ? "border-[#891737] ring-4 ring-[#891737]/5 scale-[1.02]"
                        : "border-gray-100 hover:border-gray-200"
                    }
                  `}
                >
                  <div
                    className="
                      text-8xl font-black absolute -top-2 -right-1 
                      text-gray-200 opacity-50 select-none
                    "
                  >
                    {step.num}
                  </div>

                  <div className="relative z-10">
                    <div
                      className={`
                        w-16 h-16 rounded-2xl 
                        ${
                          activeStep === idx + 1
                            ? "bg-[#891737]"
                            : "bg-gray-100 group-hover:bg-gray-200"
                        }
                        flex items-center justify-center mb-6
                        transition-all duration-300
                      `}
                    >
                      <Icon
                        className={`w-8 h-8 ${
                          activeStep === idx + 1
                            ? "text-white"
                            : "text-gray-600"
                        } transition-colors duration-300`}
                      />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-600 mb-6">
                      {step.title}
                    </h3>

                    <ul className="space-y-3">
                      {step.items.map((item, i) => {
                        const link = STEP_LINKS[item];
                        const isLink = !!link;

                        return (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-gray-400"
                          >
                            <a
                              href={isLink ? link.href : undefined}
                              target={
                                isLink && link.kind === "newtab"
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                isLink && link.kind === "newtab"
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              download={
                                isLink && link.kind === "download"
                                  ? true
                                  : undefined
                              }
                              className={`flex items-start gap-3 w-full transition-colors duration-200 ${
                                isLink
                                  ? "cursor-pointer text-gray-400 hover:text-[#891737]"
                                  : "pointer-events-none text-gray-400"
                              }`}
                            >
                              <div
                                className={`
                                  mt-1.5 w-1.5 h-1.5 rounded-full 
                                  ${
                                    activeStep === idx + 1
                                      ? "bg-gray-400"
                                      : "bg-gray-400"
                                  }
                                `}
                              />
                              <span className="text-sm leading-relaxed">
                                {item}
                              </span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Critical Requirements */}
        <div className="relative">
          <div className="relative rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-white">
                Critical Requirements
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <Calendar className="w-6 h-6 text-[#891737] mb-3" />
                <p className="text-gray-800 font-medium mb-2">
                  Submit 3 weeks early
                </p>
                <p className="text-gray-500 text-sm">
                  All documents must be submitted at least 3 weeks before
                  shooting
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-[#891737] mb-3" />
                <p className="text-gray-800 font-medium mb-2">
                  Daily updates required
                </p>
                <p className="text-gray-500 text-sm">
                  Inform District Art & Culture Officer one day before each
                  shoot
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <FileCheck className="w-6 h-6 text-[#891737] mb-3" />
                <p className="text-gray-800 font-medium mb-2">
                  Get Annexure-5 signed
                </p>
                <p className="text-gray-500 text-sm">
                  By Nodal Officer (ADM) & DM after shooting - needed for
                  subsidy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="mailto:biharfilmnigam@gmail.com"
            className="
              inline-flex items-center gap-3 px-8 py-4 rounded-2xl
              bg-[#891737] text-white font-semibold text-lg
              hover:bg-[#891737]/90 hover:shadow-lg hover:shadow-[#891737]/20
              transition-all duration-300 group
            "
          >
            <Mail className="w-5 h-5" />
            <span>Email Your Application</span>
          </a>
          <p className="text-gray-500 text-sm mt-4">biharfilmnigam@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default HowToApplyShootingPermission;
