import React, { useState, useEffect } from "react";
import api from "../Components/axios";
import { validateFile } from "../utils/fileValidation";
import { AlertCircle, ArrowRight, CheckCircle2, Upload } from "lucide-react";
import UniversalPreviewModal from "./UniversalPreviewModal";
import AlertBox from "../Components/AlertBox";

const ShootingPermissionDocuments = ({ applicationId, onSuccess }) => {
  const [formData, setFormData] = useState({
    requestLetterFile: null,
    registrationCertificateFile: null,
    titleRegistrationFile: null,
    synopsis: "",
  });

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [saveStatus, setSaveStatus] = useState("idle");
  const [validationErrors, setValidationErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Validation functions
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.requestLetterFile) {
        errors.requestLetterFile = "Request Letter on Letter Head is required";
      }
    } else if (step === 2) {
      if (!formData.registrationCertificateFile) {
        errors.registrationCertificateFile =
          "Registration Certificate of Company is required";
      }
    } else if (step === 3) {
      if (!formData.titleRegistrationFile) {
        errors.titleRegistrationFile =
          "Title Registration Certificate is required";
      }
    } else if (step === 4) {
      if (!formData.synopsis.trim()) {
        errors.synopsis = "Synopsis is required";
      } else if (formData.synopsis.trim().split(/\s+/).length > 250) {
        errors.synopsis = "Synopsis must not exceed 250 words";
      }
    }

    return errors;
  };

  const handleFileChange = (field, file, event) => {
    if (!file) return;

    const maxSizeMB = 5; // 5MB limit for all documents
    const validation = validateFile(file, maxSizeMB);

    if (!validation.isValid) {
      // Clear the file input
      if (event?.target) {
        event.target.value = "";
      }

      setNotification({
        show: true,
        message: validation.error,
        type: "warning",
      });
      setTimeout(
        () => setNotification({ show: false, message: "", type: "" }),
        3000,
      );
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [field]: file,
    }));

    // Clear any previous validation errors for this field
    setValidationErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    setNotification({
      show: true,
      message: `File uploaded successfully: ${file.name}`,
      type: "success",
    });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      2000,
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    // Clear validation error for this field
    setValidationErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleFileRemove = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: null,
    }));

    // Clear validation error for this field
    setValidationErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    setNotification({
      show: true,
      message: "File removed successfully. You can upload a new file.",
      type: "success",
    });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      2000,
    );
  };

  const onSubmit = () => {
    // Validate all steps before showing preview
    const allErrors = {};
    for (let i = 1; i <= 4; i++) {
      const stepErrors = validateStep(i);
      Object.assign(allErrors, stepErrors);
    }

    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      setNotification({
        show: true,
        message: "Please fill all required fields correctly",
        type: "warning",
      });
      return;
    }

    setShowPreview(true);
  };

  const handleFinalSubmit = async () => {
    if (!applicationId) {
      setNotification({
        show: true,
        message: "No application selected. Please select an application first.",
        type: "error",
      });
      return;
    }

    try {
      setSaveStatus("saving");

      const formToSubmit = new FormData();

      // Append all files and text fields to FormData
      if (formData.requestLetterFile) {
        formToSubmit.append("requestLetter", formData.requestLetterFile);
      }
      if (formData.registrationCertificateFile) {
        formToSubmit.append(
          "registrationCertificate",
          formData.registrationCertificateFile,
        );
      }
      if (formData.titleRegistrationFile) {
        formToSubmit.append(
          "titleRegistration",
          formData.titleRegistrationFile,
        );
      }
      if (formData.synopsis) {
        formToSubmit.append("synopsis", formData.synopsis);
      }

      const response = await api.post(
        `/api/documents/${applicationId}/upload`,
        formToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("✅ Shooting permission documents submitted:", response.data);

      setSaveStatus("success");
      setNotification({
        show: true,
        message: "Shooting permission documents submitted successfully!",
        type: "success",
      });

      // Mark shooting permission as completed
      localStorage.setItem("shootingPermissionCompleted", "true");

      // Clear localStorage after successful submission
      localStorage.removeItem("shootingPermissionData");

      setTimeout(() => {
        setShowPreview(false); // Close modal

        setFormData({
          requestLetterFile: null,
          registrationCertificateFile: null,
          titleRegistrationFile: null,
          synopsis: "",
        });
        setActiveStep(1);
        // Redirect to Overview
        if (onSuccess) onSuccess();
        setShowSuccessAlert(true);
      }, 2000);
    } catch (err) {
      console.error("❌ Error submitting form:", err);

      setSaveStatus("error");
      setShowPreview(false); // Close modal on error to show notification

      let errorMessage = "Failed to submit documents. Please try again.";

      if (err.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else if (err.response?.status === 403) {
        errorMessage = "This application does not belong to your account.";
      } else if (err.response?.status === 404) {
        errorMessage =
          "Application not found. Please check your application ID.";
      } else if (err.response?.status === 400) {
        errorMessage =
          err.response.data?.message ||
          "Invalid form data. Please check all fields.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setNotification({
        show: true,
        message: errorMessage,
        type: "error",
      });
    } finally {
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
        setSaveStatus("idle");
      }, 5000);
    }
  };

  // Load saved data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("shootingPermissionData");
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        setFormData((prev) => ({ ...prev, ...parsedData }));
      } catch (error) {
        console.warn("Error parsing stored data:", error);
      }
    }
    setLoading(false);
  }, []);

  // Save current step to localStorage
  const saveCurrentStep = () => {
    const dataToSave = {
      synopsis: formData.synopsis,
    };

    localStorage.setItem("shootingPermissionData", JSON.stringify(dataToSave));
  };

  const handleNext = () => {
    const errors = validateStep(activeStep);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setNotification({
        show: true,
        message: "Please fill all required fields correctly",
        type: "warning",
      });
      setTimeout(
        () => setNotification({ show: false, message: "", type: "" }),
        3000,
      );
      return;
    }

    saveCurrentStep();
    setValidationErrors({});

    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Render file upload field
  const renderFileUpload = (
    field,
    label,
    maxSize = "5 MB",
    required = true,
  ) => {
    const value = formData[field];
    const hasError = validationErrors[field];

    return (
      <InputGroup
        label={label}
        required={required}
        error={{ message: hasError }}
      >
        <div className="space-y-3">
          {!value ? (
            <>
              <div className="relative">
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  onChange={(e) =>
                    handleFileChange(field, e.target.files[0], e)
                  }
                  className="block w-full text-base text-gray-600 file:mr-4 file:py-2.5 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#891737] file:text-white hover:file:bg-[#70122d] file:transition-colors cursor-pointer border border-gray-300 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-[#891737]"
                />
              </div>
              <small className="text-gray-500 text-sm block">
                Upload supported file: PDF, JPG, PNG. Max {maxSize}.
              </small>
            </>
          ) : (
            <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4 transition-all">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-green-900 text-sm mb-1">
                    File uploaded successfully
                  </p>
                  <p className="font-medium text-green-700 truncate text-sm">
                    {value.name || value}
                  </p>
                  <p className="text-green-600 text-xs mt-1">
                    {value.size
                      ? `${(value.size / 1024 / 1024).toFixed(2)} MB`
                      : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFileRemove(field)}
                  className="ml-2 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0 group"
                  title="Remove file"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-green-200">
                <button
                  type="button"
                  onClick={() => handleFileRemove(field)}
                  className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline transition-colors"
                >
                  Remove and upload a different file
                </button>
              </div>
            </div>
          )}
        </div>
      </InputGroup>
    );
  };

  // Render Step 1: Request Letter on Letter Head
  const renderStep1 = () => (
    <SectionBlock title="Step 1: Request Letter on Letter Head">
      <div className="space-y-6">
        <p className="text-gray-600 text-sm">
          Please upload a formal request letter on your company's official
          letterhead.
        </p>
        {renderFileUpload("requestLetterFile", "Request Letter on Letter Head")}
      </div>

      <div className="flex justify-end mt-10 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center px-8 py-2.5 text-sm font-semibold text-white bg-[#891737] rounded-lg hover:bg-[#70122d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#891737] transition-all"
        >
          Save & Continue <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </SectionBlock>
  );

  // Render Step 2: Registration Certificate of Company
  const renderStep2 = () => (
    <SectionBlock title="Step 2: Registration Certificate of Company">
      <div className="space-y-6">
        <p className="text-gray-600 text-sm">
          Upload your company's official registration certificate.
        </p>
        {renderFileUpload(
          "registrationCertificateFile",
          "Registration Certificate of Company",
        )}
      </div>

      <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
        >
          ← Go Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center px-8 py-2.5 text-sm font-semibold text-white bg-[#891737] rounded-lg hover:bg-[#70122d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#891737] transition-all"
        >
          Save & Continue <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </SectionBlock>
  );

  // Render Step 3: Title Registration Certificate
  const renderStep3 = () => (
    <SectionBlock title="Step 3: Title Registration Certificate">
      <div className="space-y-6">
        <p className="text-gray-600 text-sm">
          Upload the title registration certificate for your film/project.
        </p>
        {renderFileUpload(
          "titleRegistrationFile",
          "Title Registration Certificate",
        )}
      </div>

      <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
        >
          ← Go Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center px-8 py-2.5 text-sm font-semibold text-white bg-[#891737] rounded-lg hover:bg-[#70122d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#891737] transition-all"
        >
          Save & Continue <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </SectionBlock>
  );

  // Render Step 4: Synopsis
  const renderStep4 = () => {
    const wordCount = formData.synopsis
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    const hasError = validationErrors.synopsis;

    return (
      <SectionBlock title="Step 4: Synopsis (250 words)">
        <div className="space-y-6">
          <p className="text-gray-600 text-sm">
            Provide a brief synopsis of your film/project. Maximum 250 words.
          </p>
          <InputGroup
            label="Synopsis"
            required={true}
            error={{ message: hasError }}
          >
            <textarea
              value={formData.synopsis}
              onChange={(e) => handleInputChange("synopsis", e.target.value)}
              className="form-textarea"
              placeholder="Enter your synopsis here..."
              rows={8}
            />
            <div className="flex justify-between items-center mt-2">
              <small
                className={`text-sm ${wordCount > 250 ? "text-red-500 font-medium" : "text-gray-500"}`}
              >
                Word count: {wordCount} / 250
              </small>
            </div>
          </InputGroup>
        </div>

        <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
          >
            ← Go Back
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={saveStatus === "saving"}
            className="inline-flex items-center px-8 py-2.5 text-sm font-semibold text-white bg-[#891737] rounded-lg hover:bg-[#70122d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#891737] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saveStatus === "saving" ? (
              <>
                <span className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Submitting...
              </>
            ) : (
              <>
                Submit Documents <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </SectionBlock>
    );
  };

  // Step indicator
  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: "Request Letter" },
      { number: 2, title: "Registration Certificate" },
      { number: 3, title: "Title Registration" },
      { number: 4, title: "Synopsis" },
    ];

    return (
      <div className="mb-12">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 ${
                    activeStep === step.number
                      ? "bg-[#891737] border-[#891737] text-white ring-4 ring-[#891737]/10"
                      : activeStep > step.number
                        ? "bg-[#891737] border-[#891737] text-white"
                        : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {activeStep > step.number ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <p
                  className={`mt-2 text-xs font-medium tracking-wide uppercase ${
                    activeStep === step.number
                      ? "text-[#891737]"
                      : activeStep > step.number
                        ? "text-[#891737]"
                        : "text-gray-400"
                  }`}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-0.5 -mx-3 mb-6 transition-all duration-300 ${
                    activeStep > step.number ? "bg-[#891737]" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#891737] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!applicationId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-amber-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No Application Selected
          </h3>
          <p className="text-sm text-gray-500">
            Please select an application from the sidebar to upload your
            shooting permission documents.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8 bg-white font-sans">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center max-w-sm animate-in fade-in slide-in-from-top-4 ${
            notification.type === "success"
              ? "bg-green-600 text-white"
              : notification.type === "warning"
                ? "bg-amber-500 text-white"
                : "bg-red-600 text-white"
          }`}
        >
          <span className="mr-3">
            {notification.type === "warning" ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </span>
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 border-b border-gray-100 pb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Shooting Permission Documents
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm">
            Bihar State Film Development & Finance Corporation Ltd
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="animate-in fade-in duration-500"
        >
          {activeStep === 1 && renderStep1()}
          {activeStep === 2 && renderStep2()}
          {activeStep === 3 && renderStep3()}
          {activeStep === 4 && renderStep4()}
        </form>
      </div>

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

      {/* PREVIEW MODAL */}
      <UniversalPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleFinalSubmit}
        data={{
          Documents: {
            "Request Letter":
              formData.requestLetterFile?.name || "Not uploaded",
            "Registration Certificate":
              formData.registrationCertificateFile?.name || "Not uploaded",
            "Title Registration":
              formData.titleRegistrationFile?.name || "Not uploaded",
          },
          Synopsis: {
            "Word Count": formData.synopsis.trim().split(/\s+/).filter(Boolean)
              .length,
            Content: formData.synopsis || "N/A",
          },
        }}
        title="SHOOTING PERMISSION DOCUMENTS"
        isSubmitting={saveStatus === "saving"}
      />

      {/* SUCCESS ALERT */}
      <AlertBox
        isOpen={showSuccessAlert}
        onClose={() => {
          setShowSuccessAlert(false);
          window.location.reload();
        }}
        onConfirm={() => {
          setShowSuccessAlert(false);
          window.location.reload();
        }}
        type="success"
        title="Submission Successful"
        message="Your shooting permission documents have been submitted successfully. Please refresh the page."
        confirmText="Refresh Page"
      />
    </div>
  );
};

// Reusable Layout Components
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
    {error?.message && (
      <div className="flex items-center gap-1 text-red-500 text-xs mt-1 animate-in fade-in">
        <AlertCircle className="w-3 h-3" />
        <span>{error.message}</span>
      </div>
    )}
  </div>
);

export default ShootingPermissionDocuments;
