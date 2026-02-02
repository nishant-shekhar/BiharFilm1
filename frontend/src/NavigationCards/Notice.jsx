import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import Navbar from "../Components/Navbar"



const notifications = [
  { title: "New Film Policy Launched", date: "2025-06-01", description: "The government has introduced a new policy for film makers." },
  { title: "Film Festival Dates Announced", date: "2025-05-20", description: "Annual Bihar Film Festival will take place in August." },
  { title: "Post-production Services", date: "2025-05-28", description: "Tender for post-production services now open." },
  { title: "Camera Equipment Tender", date: "2025-06-10", description: "Vendors invited to supply camera equipment." },
];

const tenders = [
  { title: "Camera Equipment Tender", date: "2025-06-10", description: "Vendors invited to supply camera equipment." },
  { title: "Post-production Services", date: "2025-05-28", description: "Tender for post-production services now open." }, 
  { title: "Film Festival Dates Announced", date: "2025-05-20", description: "Annual Bihar Film Festival will take place in August." },
  { title: "New Film Policy Launched", date: "2025-06-01", description: "The government has introduced a new policy for film makers." },
];

const Notifications = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-[#190108] px-4 sm:px-10 lg:px-20 py-10 text-white font-[Poppins] animate-fade">
    <Navbar/>
      {/* Back Button */}
      <div className="mb-10 mt-18">
        <button
          onClick={() => navigate("/")}
          className="bg-white text-[#891737]  font-semibold px-4 py-2 rounded shadow hover:bg-gray-200 transition duration-300"
        >
          ← Back to Home
        </button>
      </div>

      {/* Title and Quote */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Notifications & Tenders</h1>
        <p className="text-zinc-300 italic text-sm sm:text-base max-w-2xl mx-auto">
          “Stay informed. Opportunities don’t knock twice — stay updated with every notice and tender.”
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Notifications Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden text-black animate-slide-up">
          <h2 className="text-xl font-semibold bg-[#891737] text-white p-4">Notifications</h2>
          <table className="w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Sr. No</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Download</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100 transition duration-300">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.description}</td>
                  <td className="px-4 py-3">
                    <button className="text-[#891737] border border-[#891737] px-3 py-1 rounded hover:bg-[#891737] hover:text-white text-sm font-semibold transition duration-300">
                      ⬇ PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tenders Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden text-black animate-slide-up delay-200">
          <h2 className="text-xl font-semibold bg-[#891737] text-white p-4">Tenders</h2>
          <table className="w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Sr. No</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Description</th>
                 <th className="px-4 py-3 text-left">Download</th>
              </tr>
            </thead>
            <tbody>
              {tenders.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100 transition duration-300">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.description}</td>
                  <td className="px-4 py-3">
                    <button className="text-[#891737] border border-[#891737] px-3 py-1 rounded hover:bg-[#891737] hover:text-white text-sm font-semibold transition duration-300">
                      ⬇ PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
