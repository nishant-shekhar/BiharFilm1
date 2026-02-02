import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";

const Tenders = () => {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      const { data } = await axios.get(
        // "https://bsfdfcbackend.onrender.com/api/tender/tenders"
      );
      setTenders(data.tenders || []);
    } catch (error) {
      console.error("Failed to fetch tenders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#190108] px-4 sm:px-10 lg:px-20 py-10 text-white font-[Poppins] animate-fade">
      <Navbar />


      {/* Back Button */}
      <div className="mb-10 mt-18">
        <button
          onClick={() => navigate("/")}
          className="bg-white text-[#891737] font-semibold px-4 py-2 rounded shadow hover:bg-gray-200 transition duration-300"
        >
          ← Back to Home
        </button>
      </div>

      {/* Title and Quote */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Tenders</h1>
        <p className="text-zinc-300 italic text-sm sm:text-base max-w-2xl mx-auto">
          “Stay informed. Explore the latest tenders and opportunities available for filmmakers and vendors.”
        </p>
      </div>

      {/* Tenders Section */}
      <div className="bg-white rounded-xl shadow-md overflow-y-auto text-black animate-slide-up w-full max-w-5xl mx-auto max-h-[500px]">
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
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  Loading tenders...
                </td>
              </tr>
            ) : tenders.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  No tenders found.
                </td>
              </tr>
            ) : (
              tenders.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50 transition duration-300">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.date ? new Date(item.date).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.description}</td>
                  <td className="px-4 py-3">
                    {item.pdf ? (
                      <a
                        href={item.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-[#891737] border border-[#891737] px-3 py-1 rounded hover:bg-[#891737] hover:text-white text-sm font-semibold transition duration-300 no-underline"
                      >
                        ⬇ PDF
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tenders;
