import React, { useState, useEffect } from "react";
import { FileText, PlusCircle, Trash2, Edit, AlertCircle } from "lucide-react";
import { RiContractFill } from "react-icons/ri";
import { IoEyeOutline } from "react-icons/io5";
import AddTender from "./AddTender";
import api from "../Components/axios"; // ✅ Use configured api instance

const TenderMain = ({ searchQuery }) => {
  const [tenders, setTenders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch Tenders from API
  const fetchTenders = async () => {
    try {
      console.log("📊 Fetching tenders...");

      // ✅ Use 'api' instead of 'axios' - automatically sends cookies
      const { data } = await api.get("/api/tender/tenders");

      console.log("✅ Tenders received:", data);
      setTenders(data.tenders || []);
    } catch (error) {
      console.error("❌ Failed to fetch tenders:", error);
      // ❌ DO NOT redirect - just log the error
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  // Filter tenders based on search query
  const filteredTenders = tenders.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  });

  // Delete Tender
  const deleteTender = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tender?")) return;

    try {
      console.log("🗑️ Deleting tender:", id);

      // ✅ Use 'api' instead of 'axios'
      await api.delete(`/api/tender/tenders/${id}`);

      console.log("✅ Tender deleted successfully");
      setTenders(tenders.filter((t) => t.id !== id));
    } catch (error) {
      console.error("❌ Failed to delete tender:", error);
      alert("Failed to delete tender. Please try again.");
    }
  };

  // Edit Tender
  const editTender = (item) => {
    setEditData(item);
    setShowForm(true);
  };

  // Dynamic Counts
  const totalTenders = tenders.length;
  const newTenders = tenders.filter((t) => {
    const today = new Date().toISOString().split("T")[0];
    return t.date === today;
  }).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Tenders */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">Total Tenders</p>
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <RiContractFill className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{totalTenders}</p>
        </div>

        {/* New Today */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">New Today</p>
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{newTenders}</p>
        </div>

        {/* Add Tender Button Card */}
        <button
          onClick={() => {
            setEditData(null);
            setShowForm(true);
          }}
          className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[#891737] hover:bg-gray-50/50 transition-all text-left group"
        >
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-medium text-gray-500 group-hover:text-[#891737] transition-colors">
              Add Tender
            </p>
            <div className="w-10 h-10 rounded-lg bg-[#891737] flex items-center justify-center group-hover:bg-[#891737]/90 transition-colors">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600">Create a new tender</p>
        </button>
      </div>

      {/* Tenders Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Tenders</h2>
          <span className="text-xs font-medium text-gray-500">
            {filteredTenders.length}{" "}
            {filteredTenders.length === 1 ? "tender" : "tenders"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  #
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Title
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Description
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Attachment
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTenders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No tenders found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try adjusting your search or add a new tender
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTenders.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-5 py-3.5 text-xs font-medium text-gray-900 whitespace-nowrap">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-3.5">
                      <p
                        className="text-sm font-medium text-gray-900 truncate max-w-[200px]"
                        title={item.title}
                      >
                        {item.title}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-gray-600 line-clamp-2 max-w-xs">
                        {item.description}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="px-5 py-3.5">
                      {item.pdf ? (
                        <a
                          href={item.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="View PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => editTender(item)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          title="View/Edit"
                        >
                          <IoEyeOutline className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Tender Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <AddTender
              tenderData={editData}
              onClose={() => {
                setShowForm(false);
                setEditData(null);
                fetchTenders();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TenderMain;
