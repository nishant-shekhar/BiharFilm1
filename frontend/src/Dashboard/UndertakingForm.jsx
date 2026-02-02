import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, AlertCircle, Download, Upload } from "lucide-react";
import api from "../Components/axios";

const schema = z.object({
  undertakingFile: z
    .any()
    .refine((f) => f?.length === 1, "File is required")
    .refine(
      (f) =>
        ["application/pdf", "image/jpeg", "image/png"].includes(f[0]?.type),
      "Only PDF / JPG / PNG allowed",
    )
    .refine((f) => f[0]?.size <= 5 * 1024 * 1024, "Max 5MB allowed"),
});

export default function UndertakingForm({ activeApplication, refreshData }) {
  const [previewFile, setPreviewFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    const blockKeys = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ["p", "s"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", blockKeys);
    return () => document.removeEventListener("keydown", blockKeys);
  }, []);

  const onSubmit = async (data) => {
    if (!activeApplication?.id) {
      alert("No active application found.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("undertaking", data.undertakingFile[0]);

      console.log("Submitting Undertaking for App ID:", activeApplication.id);

      const response = await api.post(
        `/api/undertaking/applications/${activeApplication.id}/undertaking`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      if (response.data.success) {
        alert("Undertaking uploaded successfully!");
        if (refreshData) refreshData();
      } else {
        alert(response.data.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Undertaking Upload Error:", error);
      let msg = "An error occurred during upload.";
      if (error.response) {
        msg = error.response.data.message || msg;
        if (error.response.status === 400 && msg.includes("Annexure A")) {
          msg =
            "Cannot upload Undertaking: Annexure A must be submitted first.";
        }
      }
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8 bg-white font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 border-b border-gray-100 pb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase">
            Undertaking
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm">
            Download, Fill, Sign and Upload
          </p>
        </div>

        <div className="space-y-8 animate-in fade-in duration-500">
          <SectionBlock title="Step 1: Download Undertaking">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <iframe
                  src="NOC_Documents/UndertakingForm.pdf#toolbar=0&navpanes=0&scrollbar=0"
                  className="w-full h-[500px]"
                />
              </div>
              <div className="flex justify-center">
                <a
                  href="NOC_Documents/UndertakingForm.pdf"
                  download
                  className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-[#891737] rounded-lg hover:bg-[#70122d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#891737] transition-all"
                >
                  <Download className="mr-2 w-4 h-4" />
                  Download Undertaking PDF
                </a>
              </div>
            </div>
          </SectionBlock>

          <SectionBlock title="Step 2: Fill & Sign">
            <div className="bg-gray-100  rounded-lg p-6">
              <h3 className="text-gray-600 font-semibold mb-3">
                Instructions:
              </h3>
              <ul className="list-disc ml-5 space-y-2 text-gray-600 text-sm">
                <li>Print the downloaded PDF document.</li>
                <li>Mention the Place, Date, and apply the official Seal.</li>
                <li>
                  Scan the filled document clearly (high quality PDF/Image).
                </li>
              </ul>
            </div>
          </SectionBlock>

          <SectionBlock title="Step 3: Upload Signed Undertaking">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                  Upload Signed Document <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-4">
                  <div className="relative group">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      {...register("undertakingFile")}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#891737] file:text-white hover:file:bg-[#70122d] file:transition-colors cursor-pointer border border-gray-300 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-[#891737] bg-white transition-all"
                      onChange={(e) => {
                        register("undertakingFile").onChange(e);
                        if (e.target.files?.[0]) {
                          setPreviewFile(e.target.files[0]);
                          setShowPreview(true);
                        }
                      }}
                    />
                  </div>
                  {errors.undertakingFile && (
                    <div className="flex items-center gap-1 text-red-500 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.undertakingFile.message}</span>
                    </div>
                  )}

                  {previewFile && !showPreview && (
                    <button
                      type="button"
                      onClick={() => setShowPreview(true)}
                      className="text-sm font-semibold text-[#891737] hover:underline flex items-center gap-1"
                    >
                      <ArrowRight className="w-4 h-4" /> View Preview
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-8 py-2.5 text-sm font-semibold text-white bg-[#891737] rounded-lg hover:bg-[#70122d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#891737] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 w-4 h-4" />
                      Submit Undertaking
                    </>
                  )}
                </button>
              </div>
            </form>
          </SectionBlock>
        </div>
      </div>

      {showPreview && previewFile && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="bg-white rounded-xl w-full max-w-4xl h-[85vh] relative overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Document Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 bg-gray-100 overflow-auto p-4 flex items-center justify-center">
              {previewFile.type === "application/pdf" ? (
                <iframe
                  src={`${URL.createObjectURL(previewFile)}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full rounded shadow-sm bg-white"
                />
              ) : (
                <img
                  src={URL.createObjectURL(previewFile)}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded shadow-sm"
                  draggable={false}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .form-input, .form-select, .form-textarea {
          width: 100%;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          color: #1f2937;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #891737;
          box-shadow: 0 0 0 1px #891737;
        }
        .form-input::placeholder, .form-textarea::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}

const SectionBlock = ({ title, children }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
      <div className="w-1 h-6 bg-[#891737]"></div>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    </div>
    <div className="">{children}</div>
  </div>
);

const InputGroup = ({ label, error, required, children }) => (
  <div className="flex flex-col gap-1.5 min-w-0">
    <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
      <span className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
    </label>
    <div className="relative group">{children}</div>
    {error && (
      <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
        <AlertCircle className="w-3 h-3" />
        <span>{error.message}</span>
      </div>
    )}
  </div>
);
