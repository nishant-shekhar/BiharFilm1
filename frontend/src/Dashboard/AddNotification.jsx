import { useState, useEffect } from "react";
import { Upload, FileText, X, Loader, Check, AlertCircle } from "lucide-react";
import AlertBox from "../Components/AlertBox";
import api from "../Components/axios"; // ✅ Import api instance
import { validateFile } from "../utils/fileValidation";

function AddNotification({ onClose, editData }) {
  const MAX_WORDS = 50;
  const [description, setDescription] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Alert State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    autoClose: false,
  });

  // Load previous data when editData is available
  useEffect(() => {
    if (editData) {
      console.log("Loading edit data:", editData);

      setTitle(editData.title || "");

      const desc = editData.description || "";
      setDescription(desc);
      setWordCount(desc.trim().split(/\s+/).filter(Boolean).length);

      if (editData.date) {
        const dateObj = new Date(editData.date);
        const formattedDate = dateObj.toISOString().split("T")[0];
        setDate(formattedDate);
      }
    }
  }, [editData]);

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean);

    if (words.length <= MAX_WORDS) {
      setDescription(text);
      setWordCount(words.length);
    }
  };

  const handleFileChange = (e) => {
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
      setPdfFile(file);
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

  // Create notification
  const handleCreateNotification = async () => {
    if (!title || !date || !description || !pdfFile) {
      showAlert({
        type: "warning",
        title: "Missing Fields",
        message: "Please fill in all fields and upload a PDF.",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("notificationTitle", title);
    formData.append("notificationDate", date);
    formData.append("notificationDescription", description);
    formData.append("notificationPdf", pdfFile);

    try {
      console.log("📤 Creating notification...");

      // ✅ Use api instance with FormData - cookies sent automatically
      const response = await api.post(
        "/api/notification/createNotification",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Notification created:", response.data);

      if (response.data.success) {
        showAlert({
          type: "success",
          title: "Success",
          message: "Notification created successfully!",
          autoClose: true,
          duration: 2000,
        });

        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        throw new Error(
          response.data.message || "Failed to create notification"
        );
      }
    } catch (error) {
      console.error("❌ Error creating notification:", error);
      showAlert({
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to create notification. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update notification
  const handleUpdateNotification = async () => {
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
    formData.append("notificationTitle", title);
    formData.append("notificationDate", date);
    formData.append("notificationDescription", description);

    if (pdfFile) {
      formData.append("notificationPdf", pdfFile);
    }

    try {
      console.log("📤 Updating notification...");

      // ✅ Use api instance with FormData - cookies sent automatically
      const response = await api.put(
        `/api/notification/updatedNotification/${editData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Notification updated:", response.data);

      if (response.data.success) {
        showAlert({
          type: "success",
          title: "Success",
          message: "Notification updated successfully!",
          autoClose: true,
          duration: 2000,
        });

        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        throw new Error(
          response.data.message || "Failed to update notification"
        );
      }
    } catch (error) {
      console.error("❌ Error updating notification:", error);
      showAlert({
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to update notification. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Main submit handler
  const handleSubmit = () => {
    if (editData) {
      handleUpdateNotification();
    } else {
      handleCreateNotification();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
      <AlertBox {...alertConfig} onClose={closeAlert} />

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {editData ? "Edit Notification" : "Create Notification"}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {editData
              ? "Update notification details"
              : "Add official notification"}
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
            placeholder="e.g., Film Policy Update 2024"
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
            Attachment (PDF, JPG, PNG){" "}
            {!editData && <span className="text-red-500">*</span>}
          </label>

          {editData && !pdfFile && (
            <div className="mb-2 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Current file is already uploaded. Upload a new file to replace
                it.
              </p>
            </div>
          )}

          <div
            className={`border-2 border-dashed rounded-lg p-4 transition-all ${
              pdfFile
                ? "border-gray-200 bg-gray-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="file"
              id="pdfUpload"
              accept="application/pdf,image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />

            {pdfFile ? (
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {pdfFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPdfFile(null)}
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
                  {editData ? "Upload New File (Optional)" : "Upload File"}
                </p>
                <p className="text-xs text-gray-500">Maximum file size 5MB</p>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-[#891737] hover:bg-[#891737]/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              {editData ? "Updating..." : "Saving..."}
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              {editData ? "Update" : "Publish"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default AddNotification;
