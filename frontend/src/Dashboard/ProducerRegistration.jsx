import React, { useState, useEffect } from "react";
import api from "../Components/axios";
import { validateFile } from "../utils/fileValidation";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import UniversalPreviewModal from "./UniversalPreviewModal";
import AlertBox from "../Components/AlertBox";

const ProducerRegistration = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    companyDetails: {
      productionCompanyName: "",
      companyType: "",
      fullAddress: "",
      pinCode: "",
      state: "",
      country: "",
      email: "",
      contactNumber: "",
      authorizedRepresentative: "",
    },
    producerDocumentation: {
      companyIdentificationNumber: "",
      companyIdentificationDocument: null,
      pan: "",
      panDocument: null,
      gstRegistrationNumber: "",
      gstCertificate: null,
    },
    lineProducerDetails: {
      lineProducerCompanyType: "",
      lineProducerCompanyName: "",
      lineProducerName: "",
      lineProducerPan: "",
      lineProducerAddress: "",
      lineProducerPinCode: "",
      lineProducerState: "",
      lineProducerEmail: "",
      lineProducerMobile: "",
    },
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

  // Company type options
  const companyTypeOptions = [
    "Proprietor",
    "Firm",
    "Partnership Firm",
    "Private Limited Company",
    "Limited Liability Partnership (LLP)",
    "Society",
    "Trust",
  ];

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobileNumber = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const validatePinCode = (pinCode) => {
    const pinCodeRegex = /^[0-9]{6}$/;
    return pinCodeRegex.test(pinCode);
  };

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateGST = (gst) => {
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  };

  // Handle input change with validation
  const handleInputChange = (section, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));

    // Clear validation error for this field
    setValidationErrors((prev) => ({
      ...prev,
      [`${section}.${field}`]: "",
    }));
  };

  const handleFileChange = (section, field, file) => {
    if (!file) return;

    // File size validation based on field
    let maxSizeMB = 5; // 5MB limit
    if (field === "panDocument") {
      maxSizeMB = 1; // 1MB for PAN
    }

    const validation = validateFile(file, maxSizeMB);

    if (!validation.isValid) {
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
      [section]: {
        ...prevData[section],
        [field]: file,
      },
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

  // Validate current step
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      const { companyDetails } = formData;

      if (!companyDetails.productionCompanyName.trim()) {
        errors["companyDetails.productionCompanyName"] =
          "Production Company Name is required";
      }
      if (!companyDetails.companyType) {
        errors["companyDetails.companyType"] = "Company Type is required";
      }
      if (!companyDetails.fullAddress.trim()) {
        errors["companyDetails.fullAddress"] = "Full Address is required";
      }
      if (!companyDetails.pinCode) {
        errors["companyDetails.pinCode"] = "Pin code is required";
      } else if (!validatePinCode(companyDetails.pinCode)) {
        errors["companyDetails.pinCode"] = "Pin code must be 6 digits";
      }
      if (!companyDetails.state.trim()) {
        errors["companyDetails.state"] = "State is required";
      }
      if (!companyDetails.country.trim()) {
        errors["companyDetails.country"] = "Country is required";
      }
      if (!companyDetails.email) {
        errors["companyDetails.email"] = "Email ID is required";
      } else if (!validateEmail(companyDetails.email)) {
        errors["companyDetails.email"] = "Please enter a valid email address";
      }
      if (!companyDetails.contactNumber) {
        errors["companyDetails.contactNumber"] = "Contact Number is required";
      } else if (!validateMobileNumber(companyDetails.contactNumber)) {
        errors["companyDetails.contactNumber"] =
          "Contact Number must be 10 digits";
      }
      if (!companyDetails.authorizedRepresentative.trim()) {
        errors["companyDetails.authorizedRepresentative"] =
          "Authorized Representative is required";
      }
    } else if (step === 2) {
      const { producerDocumentation } = formData;

      if (!producerDocumentation.companyIdentificationNumber.trim()) {
        errors["producerDocumentation.companyIdentificationNumber"] =
          "ABCDE1234F";
      }
      if (!producerDocumentation.companyIdentificationDocument) {
        errors["producerDocumentation.companyIdentificationDocument"] =
          "Company Identification Document is required";
      }
      if (!producerDocumentation.pan) {
        errors["producerDocumentation.pan"] = "PAN is required";
      } else if (!validatePAN(producerDocumentation.pan.toUpperCase())) {
        errors["producerDocumentation.pan"] =
          "Please enter a valid PAN (e.g., ABCDE1234F)";
      }
      if (!producerDocumentation.panDocument) {
        errors["producerDocumentation.panDocument"] = "Copy of PAN is required";
      }
      if (!producerDocumentation.gstRegistrationNumber) {
        errors["producerDocumentation.gstRegistrationNumber"] =
          "GST Registration Number is required";
      } else if (
        !validateGST(producerDocumentation.gstRegistrationNumber.toUpperCase())
      ) {
        errors["producerDocumentation.gstRegistrationNumber"] =
          "Please enter a valid GST Number";
      }
      if (!producerDocumentation.gstCertificate) {
        errors["producerDocumentation.gstCertificate"] =
          "GST Registration Certificate is required";
      }
    } else if (step === 3) {
      const { lineProducerDetails } = formData;

      if (!lineProducerDetails.lineProducerCompanyType) {
        errors["lineProducerDetails.lineProducerCompanyType"] =
          "Line Producer Company Type is required";
      }
      if (!lineProducerDetails.lineProducerCompanyName.trim()) {
        errors["lineProducerDetails.lineProducerCompanyName"] =
          "Line Producer Company Name is required";
      }
      if (!lineProducerDetails.lineProducerName.trim()) {
        errors["lineProducerDetails.lineProducerName"] =
          "Line Producer Name is required";
      }
      if (!lineProducerDetails.lineProducerPan) {
        errors["lineProducerDetails.lineProducerPan"] =
          "PAN Number is required";
      } else if (
        !validatePAN(lineProducerDetails.lineProducerPan.toUpperCase())
      ) {
        errors["lineProducerDetails.lineProducerPan"] =
          "Please enter a valid PAN (e.g., ABCDE1234F)";
      }
      if (!lineProducerDetails.lineProducerAddress.trim()) {
        errors["lineProducerDetails.lineProducerAddress"] =
          "Full Address is required";
      }
      if (!lineProducerDetails.lineProducerPinCode) {
        errors["lineProducerDetails.lineProducerPinCode"] =
          "Pin code is required";
      } else if (!validatePinCode(lineProducerDetails.lineProducerPinCode)) {
        errors["lineProducerDetails.lineProducerPinCode"] =
          "Pin code must be 6 digits";
      }
      if (!lineProducerDetails.lineProducerState.trim()) {
        errors["lineProducerDetails.lineProducerState"] = "State is required";
      }
      if (!lineProducerDetails.lineProducerEmail) {
        errors["lineProducerDetails.lineProducerEmail"] =
          "Email ID is required";
      } else if (!validateEmail(lineProducerDetails.lineProducerEmail)) {
        errors["lineProducerDetails.lineProducerEmail"] =
          "Please enter a valid email address";
      }
      if (!lineProducerDetails.lineProducerMobile) {
        errors["lineProducerDetails.lineProducerMobile"] =
          "Mobile Number is required";
      } else if (
        !validateMobileNumber(lineProducerDetails.lineProducerMobile)
      ) {
        errors["lineProducerDetails.lineProducerMobile"] =
          "Mobile Number must be 10 digits";
      }
    }

    return errors;
  };

  const onSubmit = () => {
    // Validate all steps before showing preview
    // Since we are at the end, we can assume previous steps were saved/validated partially,
    // but good to check current step or just ensure required fields are there.
    // Ideally we should valid all steps here, but for now we rely on the step-by-step validation.

    const errors = validateStep(activeStep); // Validate final step
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
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
    try {
      setSaveStatus("saving");

      const formToSubmit = new FormData();

      // Append all form fields to FormData
      Object.entries(formData).forEach(([sectionKey, sectionData]) => {
        Object.entries(sectionData).forEach(([fieldKey, fieldValue]) => {
          if (fieldValue instanceof File) {
            formToSubmit.append(fieldKey, fieldValue);
          } else if (fieldValue && fieldValue !== "") {
            formToSubmit.append(fieldKey, fieldValue);
          }
        });
      });

      const response = await api.post(
        "/api/producer-registration/addProducerRegistration",
        formToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("✅ Producer registration submitted:", response.data);

      setSaveStatus("success");
      setNotification({
        show: true,
        message: "Producer registration submitted successfully!",
        type: "success",
      });

      // Mark producer registration as completed
      localStorage.setItem("producerRegistrationCompleted", "true");

      // Clear localStorage after successful submission
      localStorage.removeItem("companyDetails");
      localStorage.removeItem("producerDocumentation");
      localStorage.removeItem("lineProducerDetails");

      setTimeout(() => {
        setShowPreview(false); // Close modal

        setFormData({
          companyDetails: {
            productionCompanyName: "",
            companyType: "",
            fullAddress: "",
            pinCode: "",
            state: "",
            country: "",
            email: "",
            contactNumber: "",
            authorizedRepresentative: "",
          },
          producerDocumentation: {
            companyIdentificationNumber: "",
            companyIdentificationDocument: null,
            pan: "",
            panDocument: null,
            gstRegistrationNumber: "",
            gstCertificate: null,
          },
          lineProducerDetails: {
            lineProducerCompanyType: "",
            lineProducerCompanyName: "",
            lineProducerName: "",
            lineProducerPan: "",
            lineProducerAddress: "",
            lineProducerPinCode: "",
            lineProducerState: "",
            lineProducerEmail: "",
            lineProducerMobile: "",
          },
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

      let errorMessage = "Failed to submit registration. Please try again.";

      if (err.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
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
    const keys = [
      "companyDetails",
      "producerDocumentation",
      "lineProducerDetails",
    ];

    keys.forEach((key) => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsedData = JSON.parse(stored);

          // Handle file objects
          Object.keys(parsedData).forEach((fieldKey) => {
            if (
              parsedData[fieldKey] &&
              typeof parsedData[fieldKey] === "object" &&
              parsedData[fieldKey].isFile
            ) {
              parsedData[fieldKey] = {
                name: parsedData[fieldKey].name,
                size: parsedData[fieldKey].size,
                type: parsedData[fieldKey].type,
                lastModified: parsedData[fieldKey].lastModified,
                isStoredFile: true,
              };
            }
          });

          setFormData((prev) => ({ ...prev, [key]: parsedData }));
        } catch (error) {
          console.warn(`Error parsing stored data for ${key}:`, error);
        }
      }
    });
    setLoading(false);
  }, []);

  // Save current step to localStorage
  const saveCurrentStep = () => {
    const sectionKeys = {
      1: "companyDetails",
      2: "producerDocumentation",
      3: "lineProducerDetails",
    };

    const sectionKey = sectionKeys[activeStep];
    if (sectionKey) {
      const sectionData = { ...formData[sectionKey] };

      // Convert File objects to storable format
      Object.keys(sectionData).forEach((key) => {
        if (sectionData[key] instanceof File) {
          sectionData[key] = {
            name: sectionData[key].name,
            size: sectionData[key].size,
            type: sectionData[key].type,
            lastModified: sectionData[key].lastModified,
            isFile: true,
            type: sectionData[key].type,
          };
        }
      });

      localStorage.setItem(sectionKey, JSON.stringify(sectionData));
    }
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

    if (activeStep < 3) {
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

  // Render input fields with validation
  const renderInputField = (
    section,
    field,
    label,
    type = "text",
    required = true,
    options = null,
  ) => {
    const value = formData[section][field];
    const errorKey = `${section}.${field}`;
    const hasError = validationErrors[errorKey];

    return (
      <InputGroup
        label={label}
        required={required}
        error={{ message: hasError }}
      >
        {options ? (
          <select
            value={value}
            onChange={(e) => handleInputChange(section, field, e.target.value)}
            className="form-select"
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => {
              let inputValue = e.target.value;

              // Auto-format inputs
              if (field.includes("pan") || field.includes("Pan")) {
                inputValue = inputValue.toUpperCase();
              }
              if (field.includes("gst") || field.includes("Gst")) {
                inputValue = inputValue.toUpperCase();
              }
              if (type === "tel") {
                // Allow digits only, max 10
                inputValue = inputValue.replace(/\D/g, "").slice(0, 10);
              }
              if (field.includes("pinCode") || field.includes("PinCode")) {
                // Allow digits only, max 6
                inputValue = inputValue.replace(/\D/g, "").slice(0, 6);
              }

              handleInputChange(section, field, inputValue);
            }}
            className="form-input"
            placeholder={label}
          />
        )}
      </InputGroup>
    );
  };

  const renderFileUpload = (
    section,
    field,
    label,
    maxSize = "10 MB",
    required = true,
  ) => {
    const value = formData[section][field];
    const errorKey = `${section}.${field}`;
    const hasError = validationErrors[errorKey];

    return (
      <InputGroup
        label={label}
        required={required}
        error={{ message: hasError }}
      >
        <div className="space-y-3">
          <div className="relative">
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              onChange={(e) =>
                handleFileChange(section, field, e.target.files[0])
              }
              className="block w-full text-base text-gray-600 file:mr-4 file:py-2.5 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#891737] file:text-white hover:file:bg-[#70122d] file:transition-colors cursor-pointer border border-gray-300 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-[#891737]"
            />
          </div>
          <small className="text-gray-500 text-sm block">
            Upload supported file: PDF, JPG, PNG. Max {maxSize}.
          </small>
          {value && (
            <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{value.name || value}</p>
                {value.isStoredFile && (
                  <p className="text-green-600/80 text-xs">
                    (Previously uploaded)
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </InputGroup>
    );
  };

  // Render Step 1: Company Details
  const renderStep1 = () => (
    <SectionBlock title="Company Details">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
        {renderInputField(
          "companyDetails",
          "productionCompanyName",
          "Production Company Name",
        )}
        {renderInputField(
          "companyDetails",
          "companyType",
          "Company Type",
          "text",
          true,
          companyTypeOptions,
        )}
        {renderInputField("companyDetails", "fullAddress", "Full Address")}
        {renderInputField("companyDetails", "pinCode", "Pin code", "text")}
        {renderInputField("companyDetails", "state", "State")}
        {renderInputField("companyDetails", "country", "Country")}
        {renderInputField("companyDetails", "email", "E-Mail ID", "email")}
        {renderInputField(
          "companyDetails",
          "contactNumber",
          "Contact No. (Mobile)",
          "tel",
        )}
        {renderInputField(
          "companyDetails",
          "authorizedRepresentative",
          "Authorized Representative",
        )}
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

  // Render Step 2: Producer Documentation
  const renderStep2 = () => (
    <SectionBlock title="Producer Documentation">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
        {renderInputField(
          "producerDocumentation",
          "companyIdentificationNumber",
          "Company Identification Number",
        )}
        {renderFileUpload(
          "producerDocumentation",
          "companyIdentificationDocument",
          "Company ID Document (Self Attested)",
        )}
        {renderInputField("producerDocumentation", "pan", "PAN")}
        {renderFileUpload(
          "producerDocumentation",
          "panDocument",
          "Copy of PAN (Self Attested)",
          "1 MB",
        )}
        {renderInputField(
          "producerDocumentation",
          "gstRegistrationNumber",
          "GST Registration Number",
        )}
        {renderFileUpload(
          "producerDocumentation",
          "gstCertificate",
          "GST Registration Certificate (Self Attested)",
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

  // Render Step 3: Line Producer Details
  const renderStep3 = () => (
    <SectionBlock title="Line Producer Details">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
        {renderInputField(
          "lineProducerDetails",
          "lineProducerCompanyType",
          "Line Producer Company Type",
          "text",
          true,
          companyTypeOptions,
        )}
        {renderInputField(
          "lineProducerDetails",
          "lineProducerCompanyName",
          "Line Producer Company Name",
        )}
        {renderInputField(
          "lineProducerDetails",
          "lineProducerName",
          "Line Producer Representative Name",
        )}
        {renderInputField(
          "lineProducerDetails",
          "lineProducerPan",
          "PAN Number",
        )}
        {renderInputField(
          "lineProducerDetails",
          "lineProducerAddress",
          "Full Address",
        )}
        {renderInputField(
          "lineProducerDetails",
          "lineProducerPinCode",
          "Pin code",
          "text",
        )}
        {renderInputField("lineProducerDetails", "lineProducerState", "State")}
        {renderInputField(
          "lineProducerDetails",
          "lineProducerEmail",
          "E-Mail Id",
          "email",
        )}
        {renderInputField(
          "lineProducerDetails",
          "lineProducerMobile",
          "Mobile Number",
          "tel",
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
              Submit Registration <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </SectionBlock>
  );

  // Step indicator
  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: "Company Details" },
      { number: 2, title: "Producer Documentation" },
      { number: 3, title: "Line Producer" },
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
            Producer Registration Form
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
            const errors = validateStep(3);
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
            onSubmit();
          }}
          className="animate-in fade-in duration-500"
        >
          {activeStep === 1 && renderStep1()}
          {activeStep === 2 && renderStep2()}
          {activeStep === 3 && renderStep3()}
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
        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.75rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
      `}</style>
      {/* PREVIEW MODAL */}
      <UniversalPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleFinalSubmit}
        data={formData}
        title="PRODUCER REGISTRATION FORM"
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
        title="Registration Successful"
        message="Your producer registration form is filled successfully. Please refresh the page once."
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

export default ProducerRegistration;
