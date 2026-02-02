import React from "react";
import { GraduationCap, FileText, CreditCard } from "lucide-react";
import Navbar from "../Components/Navbar";
import ContactUs from "./ContactUs";

const ScholarshipAndExpenses = () => {
  const scholarshipDetails = [
    {
      id: "Eligibility",
      text: "Under Clause 9.13 of Bihar Film Promotion Policy 2024, annual scholarship is provided to students from Bihar studying at premier institutes like FTII Pune, SRFTI Kolkata, NSD New Delhi, and others.",
      icon: <GraduationCap className="w-6 h-6" />,
    },
    {
      id: "Requirements",
      text: "Applications must include proof of admission, nomination proof, Aadhar card, and detailed course fee receipts from the managing director.",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      id: "Benefit",
      text: "The scholarship covers the course fee (tuition fee only), paid directly to the institution.",
      icon: <CreditCard className="w-6 h-6" />,
    },
  ];

  const recipients = [
    { name: "Ashish Kumar", reg: "R/16/2024", sem: "1st, 2nd", session: "" },
    {
      name: "Ravi Kumar Sah",
      reg: "R/EDM/217/23-25",
      sem: "1st",
      session: "23-25",
    },
    { name: "Nishant Kumar", reg: "R/865/20-23", sem: "4th", session: "20-23" },
    {
      name: "Sujeet Kumar",
      reg: "R/1039/23-26",
      sem: "1st, 2nd",
      session: "23-26",
    },
    {
      name: "Chandrabhan Singh",
      reg: "R/968/2022-25",
      sem: "3rd, 4th",
      session: "22-25",
    },
    {
      name: "Hema Kumari",
      reg: "R/993/2022-25",
      sem: "3rd, 4th",
      session: "22-25",
    },
    {
      name: "Chandan Kumar Priyadarshi",
      amount: "₹82,688",
      reg: "R/EDM/191/22-24",
      sem: "2nd, 3rd",
      session: "22-24",
    },
  ];

  return (
    <div className="min-h-screen bg-[#190108] font-sans text-gray-100">
      <Navbar />

      {/* Header Section */}
      <div className="pt-32 pb-16 px-4 text-center border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
            Scholarships & <span className="text-[#a92b4e]">Expenses</span>
          </h1>
          <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Empowering Bihar's future filmmakers through education support and
            transparent production cost guidelines.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        {/* Scholarship Program */}
        <section>
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3 sticky top-24">
              <h2 className="text-3xl font-bold text-white mb-4">
                Student Scholarship
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                We support talented students from Bihar pursuing education in
                premier film and television institutes across India.
              </p>
              <div className="h-1 w-20 bg-[#a92b4e] rounded-full"></div>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 gap-6">
              {scholarshipDetails.map((detail, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="flex items-start gap-6">
                    <div className="p-3 bg-[#a92b4e]/20 rounded-xl text-[#a92b4e]">
                      {detail.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {detail.id}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {detail.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recipients */}
        <section>
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              SRFTI Recipients
            </h2>
            <p className="text-gray-400">
              Proud beneficiaries from Bihar studying at Satyajit Ray Film &
              Television Institute.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipients.map((student, idx) => (
              <div
                key={idx}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#a92b4e]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a92b4e] to-[#891737] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#a92b4e] transition-colors">
                      {student.name}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Scholar
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-400 pl-16">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Reg No</span>
                    <span className="text-gray-200">{student.reg}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Semester</span>
                    <span className="text-gray-200">{student.sem}</span>
                  </div>
                  {student.session && (
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Session</span>
                      <span className="text-gray-200">{student.session}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <ContactUs />
    </div>
  );
};

export default ScholarshipAndExpenses;
