import { useState, useEffect } from "react";
import {
  Upload,
  FileText,
  X,
  Loader,
  Check,
  AlertCircle,
  Trash2,
} from "lucide-react";
import AlertBox from "../Components/AlertBox";
import api from "../Components/axios"; // ✅ Import api instance
import { validateFile } from "../utils/fileValidation";

function AddTender({ tenderData, onClose }) {
  const MAX_WORDS = 30;
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [pdf, setPdf] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Alert State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    autoClose: false,
    showCancel: false,
    onConfirm: null,
  });

  // Load previous data when tenderData is available
  useEffect(() => {
    if (tenderData) {
      setTitle(tenderData.title || "");

      const desc = tenderData.description || "";
      setDescription(desc);
      setWordCount(desc.trim().split(/\s+/).filter(Boolean).length);

      if (tenderData.date) {
        const dateObj = new Date(tenderData.date);
        const formattedDate = dateObj.toISOString().split("T")[0];
        setDate(formattedDate);
      }
    }
  }, [tenderData]);

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean);

    if (words.length <= MAX_WORDS && text.length <= 190) {
      setDescription(text);
      setWordCount(words.length);
    } else if (text.length > 190) {
      if (text.length < description.length) {
        setDescription(text);
        setWordCount(words.length);
      }
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        showAlert({
          type: "error",
          title: "Validation Error",
          message: validation.error,
        });
        e.target.value = null;
        return;
      }
      setPdf(file);
    }
  };

  const showAlert = (config) => {
    setAlertConfig({
      isOpen: true,
      ...config,
    });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCreateTender = async () => {
    if (!title || !date || !description || !pdf) {
      showAlert({
        type: "warning",
        title: "Missing Fields",
        message: "Please fill in all fields and upload a PDF.",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("description", description);
    formData.append("pdf", pdf);

    console.log("📤 Creating tender with data:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      // ✅ Use api instance with FormData - cookies sent automatically
      const response = await api.post("/api/tender/createTender", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Tender created:", response.data);

      if (response.data.success) {
        showAlert({
          type: "success",
          title: "Success",
          message: "Tender created successfully!",
          autoClose: true,
          duration: 2000,
        });

        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        throw new Error(response.data.message || "Failed to create tender");
      }
    } catch (error) {
      console.error("❌ Error creating tender:", error);
      showAlert({
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to create tender. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTender = async () => {
    if (!title || !date || !description) {
      showAlert({
        type: "warning",
        title: "Missing Fields",
        message: "Please fill in all required fields.",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("description", description);

    if (pdf) {
      formData.append("pdf", pdf);
    }

    console.log("📤 Updating tender...");

    try {
      // ✅ Use api instance with FormData - cookies sent automatically
      const response = await api.put(
        `/api/tender/updateTender/${tenderData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Tender updated:", response.data);

      if (response.data.success) {
        showAlert({
          type: "success",
          title: "Success",
          message: "Tender updated successfully!",
          autoClose: true,
          duration: 2000,
        });

        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        throw new Error(response.data.message || "Failed to update tender");
      }
    } catch (error) {
      console.error("❌ Error updating tender:", error);
      showAlert({
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to update tender. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTender = async () => {
    showAlert({
      type: "warning",
      title: "Confirm Delete",
      message:
        "Are you sure you want to delete this tender? This action cannot be undone.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      showCancel: true,
      onConfirm: async () => {
        setLoading(true);
        console.log("🗑️ Deleting tender:", tenderData.id);

        try {
          // ✅ Use api instance - cookies sent automatically
          const response = await api.delete(
            `/api/tender/deletetender/${tenderData.id}`
          );

          console.log("✅ Tender deleted:", response.data);

          showAlert({
            type: "success",
            title: "Deleted",
            message: "Tender deleted successfully!",
            autoClose: true,
            duration: 2000,
          });

          setTimeout(() => {
            if (onClose) onClose(true); // Pass true to indicate deletion
          }, 2000);
        } catch (error) {
          console.error("❌ Error deleting tender:", error);
          showAlert({
            type: "error",
            title: "Error",
            message:
              error.response?.data?.message ||
              error.message ||
              "Failed to delete tender. Please try again.",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSubmit = () => {
    if (tenderData) {
      handleUpdateTender();
    } else {
      handleCreateTender();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
      <AlertBox {...alertConfig} onClose={closeAlert} />

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {tenderData ? "Edit Tender" : "Create Tender"}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {tenderData ? "Update tender details" : "Add new tender notice"}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Procurement of Film Equipment"
            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 transition-colors"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <textarea
              rows="4"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter a brief description..."
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 transition-colors resize-none"
            ></textarea>
            <div
              className={`absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded ${
                wordCount >= MAX_WORDS
                  ? "bg-red-50 text-red-600"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              {wordCount}/{MAX_WORDS}
            </div>
          </div>
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Attachment (PDF){" "}
            {!tenderData && <span className="text-red-500">*</span>}
          </label>

          {tenderData && !pdf && (
            <div className="mb-2 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Current PDF is already uploaded. Upload a new file to replace
                it.
              </p>
            </div>
          )}

          <div
            className={`border-2 border-dashed rounded-lg p-4 transition-all ${
              pdf
                ? "border-gray-200 bg-gray-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="file"
              id="pdfUpload"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="hidden"
            />

            {pdf ? (
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {pdf.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(pdf.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPdf(null)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors flex-shrink-0 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="pdfUpload"
                className="cursor-pointer flex flex-col items-center justify-center py-3"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-2">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-0.5">
                  {tenderData ? "Upload New PDF (Optional)" : "Upload PDF"}
                </p>
                <p className="text-xs text-gray-500">Maximum file size 5MB</p>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
        {/* Delete Button - Only show when editing */}
        {tenderData && (
          <button
            type="button"
            onClick={handleDeleteTender}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        )}

        <div className={`flex gap-3 ${!tenderData ? "ml-auto" : ""}`}>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-[#891737] hover:bg-[#891737]/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                {tenderData ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {tenderData ? "Update" : "Publish"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTender;
