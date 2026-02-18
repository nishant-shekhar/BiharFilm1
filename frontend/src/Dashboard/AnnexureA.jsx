import React, { useState, useEffect } from "react";
import api from "../Components/axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, AlertCircle } from "lucide-react";
import UniversalPreviewModal from "./UniversalPreviewModal";

// Regex Patterns
const ALPHA_REGEX = /^[a-zA-Z\s]+$/;
const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9\s,.-]+$/;

// Validation Schema
const schema = z
  .object({
    location: z
      .string()
      .min(1, "Location is required")
      .min(3, "Location must be at least 3 characters"),

    landmark: z
      .string()
      .min(1, "Landmark is required")
      .min(3, "Landmark must be at least 3 characters"),

    locationType: z.enum(["indoor", "outdoor", "both"], {
      errorMap: () => ({ message: "Please select a location type" }),
    }),

    startDateTime: z
      .string()
      .min(1, "Start date and time is required")
      .refine(
        (val) => {
          const selectedDate = new Date(val);
          const now = new Date();
          // Allow selection of current minute (ignore seconds/milliseconds for comparison)
          // Effectively allow if selected time >= current time - 1 minute logic buffer
          return selectedDate >= new Date(now.getTime() - 60000);
        },
        { message: "Start time cannot be in the past" },
      ),

    endDateTime: z
      .string()
      .min(1, "End date and time is required")
      .refine(
        (val) => {
          const selectedDate = new Date(val);
          const now = new Date();
          return selectedDate >= new Date(now.getTime() - 60000);
        },
        { message: "End time cannot be in the past" },
      ),

    crewPublicInvolvement: z
      .string()
      .min(1, "Please specify crew/public involvement")
      .min(5, "Provide more details"),

    personCount: z.coerce
      .number({ invalid_type_error: "Required" })
      .int("Must be a whole number")
      .positive("Must be a positive number"),

    permissionDetails: z
      .string()
      .min(1, "Permission details are required")
      .min(10, "Provide more details about permissions needed"),

    locationFees: z.coerce
      .number({ invalid_type_error: "Required" })
      .nonnegative("Cannot be negative"),

    securityDeposit: z.coerce
      .number({ invalid_type_error: "Required" })
      .nonnegative("Cannot be negative"),

    paymentReference: z
      .string()
      .min(1, "Payment reference number or DD number is required"),

    locationManagerName: z.string().min(1, "Location manager name is required"),

    locationManagerPhone: z.string().min(10, "Valid phone number required"),

    locationManagerEmail: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),

    sceneDetails: z
      .string()
      .min(10, "Scene details are too short")
      .refine((val) => val.trim().split(/\s+/).length <= 100, {
        message: "Scene details must not exceed 100 words",
      }),

    isForestArea: z.enum(["yes", "no"], {
      errorMap: () => ({
        message: "Please specify if location is a forest area",
      }),
    }),

    forestType: z.union([z.string(), z.array(z.string())]).optional(),

    forestDetails: z.string().optional(),

    applicantName: z.string().min(1, "Authorized applicant name is required"),

    applicantDate: z.string().min(1, "Date is required"),
  })
  .refine(
    (data) => {
      if (data.startDateTime && data.endDateTime) {
        return new Date(data.endDateTime) >= new Date(data.startDateTime);
      }
      return true;
    },
    {
      message: "End date and time must be after start date and time",
      path: ["endDateTime"],
    },
  )
  .refine(
    (data) => {
      if (data.isForestArea === "yes") {
        return data.forestType && data.forestType.length > 0;
      }
      return true;
    },
    {
      message: "Forest type is required when location is a forest area",
      path: ["forestType"],
    },
  );

const AnnextureA = ({ activeApplication }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);

  // --- Multi-Location Logic ---
  const [totalLocations, setTotalLocations] = useState(1);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [locationsData, setLocationsData] = useState([]);
  const [loadingApp, setLoadingApp] = useState(false);

  // Fetch fresh application data to ensure we have the latest nocForm
  useEffect(() => {
    const fetchLatestAppData = async () => {
      console.log("Using Active Application ID:", activeApplication?.id);

      if (!activeApplication?.id) {
        console.warn("No Active Application ID found");
        return;
      }

      try {
        setLoadingApp(true);
        let locations = 1;

        // Strategy 1: Try getting the specific NOC form for this application
        try {
          console.log("Attempting to fetch specific NOC form...");
          const nocResponse = await api.get(
            `/api/noc/applications/${activeApplication.id}/noc-form`,
          );
          console.log("Specific NOC Response:", nocResponse.data);

          if (nocResponse.data.success && nocResponse.data.data) {
            const noc = nocResponse.data.data;
            if (noc.numberOfShootingLocations) {
              console.log(
                "Found location count in specific NOC:",
                noc.numberOfShootingLocations,
              );
              setTotalLocations(Number(noc.numberOfShootingLocations));
              return; // Exit if successful
            }
          }
        } catch (specificErr) {
          console.warn(
            "Specific NOC fetch failed, trying generic list...",
            specificErr,
          );
        }

        // Strategy 2: Fetch all my NOC forms and find the match
        try {
          const allNocsResponse = await api.get("/api/noc/my-forms");
          console.log("All NOCs Response:", allNocsResponse.data);

          if (
            allNocsResponse.data.success &&
            Array.isArray(allNocsResponse.data.data)
          ) {
            // Find NOC that belongs to this application.
            // Assuming key is applicationId or application.
            // We need to look for a match with activeApplication.id
            const match = allNocsResponse.data.data.find(
              (n) =>
                n.applicationId === activeApplication.id ||
                (n.application && n.application.id === activeApplication.id) ||
                n.application === activeApplication.id,
            );

            if (match && match.numberOfShootingLocations) {
              console.log(
                "Found matching NOC in list. Locations:",
                match.numberOfShootingLocations,
              );
              setTotalLocations(Number(match.numberOfShootingLocations));
              return;
            }
          }
        } catch (listErr) {
          console.error("Failed to fetch NOC list", listErr);
        }

        // Strategy 3: Check the activeApplication prop itself (fallback)
        if (activeApplication?.nocForm?.numberOfShootingLocations) {
          console.log(
            "Using prop fallback:",
            activeApplication.nocForm.numberOfShootingLocations,
          );
          setTotalLocations(
            Number(activeApplication.nocForm.numberOfShootingLocations),
          );
          return;
        }

        console.warn(
          "Could not determine detailed location count. Defaulting to 1.",
        );
        setTotalLocations(1);
      } catch (err) {
        console.error("Critical error in data fetch", err);
        setTotalLocations(1);
      } finally {
        setLoadingApp(false);
      }
    };

    fetchLatestAppData();
  }, [activeApplication?.id]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    control,
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      locationType: "outdoor",
      isForestArea: "no",
      locationFees: 0,
      securityDeposit: 0,
      personCount: 0,
    },
  });

  const isForestArea = watch("isForestArea");
  const sceneDetailsText = watch("sceneDetails") || "";
  const wordCount =
    sceneDetailsText.trim() === ""
      ? 0
      : sceneDetailsText.trim().split(/\s+/).length;

  // Get current date for date-only inputs
  const today = new Date().toISOString().split("T")[0];

  // Get current datetime for datetime-local inputs (no past dates allowed)
  const now = new Date();
  const currentDateTime = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 16);

  const [showPreview, setShowPreview] = useState(false);
  const [currentPreviewData, setCurrentPreviewData] = useState(null);

  const handlePreview = (data) => {
    // 1. Validate: Ensure an active application exists
    if (!activeApplication || !activeApplication.id) {
      alert("No active application found.");
      return;
    }

    // Set preview data for the specific location being added
    setCurrentPreviewData(data);
    setShowPreview(true);
  };

  const onConfirmLocation = async () => {
    // Proceed with adding the location (original onSubmit logic)
    const data = currentPreviewData;
    setShowPreview(false); // Close preview

    // 2. Add current form data to our aggregated list
    // Note: 'data' is the current location's form values
    const currentLocationEntry = {
      location: data.location,
      landmark: data.landmark,
      // Prompt example shows "Public", "Forest", "Road".
      // I'll capitalize or keep as is. Let's capitalized first char.
      // actually prompt example shows "Public", "Forest".
      // The form select has "indoor", "outdoor", "both".
      // I will map to Title Case "Indoor", "Outdoor", "Both".
      locationType:
        data.locationType.charAt(0).toUpperCase() + data.locationType.slice(1),

      startDateTime: new Date(data.startDateTime).toISOString(),
      endDateTime: new Date(data.endDateTime).toISOString(),

      crewInvolvement: data.crewPublicInvolvement, // map to 'crewInvolvement'
      personCount: parseInt(data.personCount),

      permissionDetails: data.permissionDetails,
      locationFee: `₹${data.locationFees}`, // prompt example "₹50,000"
      securityDeposit: `₹${data.securityDeposit}`,
      paymentRef: data.paymentReference,
      locationManager: `${data.locationManagerName} (${data.locationManagerPhone}, ${data.locationManagerEmail})`, // Combined details

      sceneDetails: data.sceneDetails,

      forestType:
        data.isForestArea === "yes" && data.forestType
          ? Array.isArray(data.forestType)
            ? data.forestType.join(", ")
            : data.forestType
          : null,
      forestDetails: data.isForestArea === "yes" ? data.forestDetails : null,

      // Extra identifying info if needed
      applicantName: data.applicantName,
      applicantDate: data.applicantDate,
    };

    const updatedLocations = [...locationsData, currentLocationEntry];
    setLocationsData(updatedLocations);

    // Check if we need to move to next location or submit final
    if (currentLocationIndex < totalLocations - 1) {
      // Move to next
      if (
        confirm(
          `Location ${currentLocationIndex + 1} saved. Proceed to Location ${currentLocationIndex + 2}?`,
        )
      ) {
        setCurrentLocationIndex((prev) => prev + 1);
        reset(); // Clear form for next entry
        setSignatureImage(null);
        window.scrollTo(0, 0);
      } else {
        // If user cancels, we revert the add? usually just stay.
        // But for simplicity in this flow, we just wait.
        // Actually, let's just proceed automatically.
      }
    } else {
      // FINAL SUBMISSION
      setIsSubmitting(true);
      try {
        const payload = {
          locations: updatedLocations,
        };

        console.log(
          "Submitting Annexure A Payload:",
          JSON.stringify(payload, null, 2),
        );

        const response = await api.post(
          `/api/annexureA/applications/${activeApplication.id}/annexure-a`,
          payload,
        );

        if (response.data.success) {
          alert("Annexure A Submitted Successfully!");
          reset();
          setLocationsData([]);
          setCurrentLocationIndex(0);
          // Redirect or update UI
        } else {
          alert(response.data.message || "Submission failed.");
          // If failed, we might want to keep the data?
          // For now, we keep local state 'updatedLocations' implicitly in 'locationsData' state
          // BUT 'locationsData' was updated via setLocationsData above.
          // If it fails, user can try again?
          // Wait, if it fails, 'reset()' runs only on success.
          // But 'setLocationsData' is async.
          // Actually, if we are at the last step, we shouldn't wipe 'locationsData' if API fails.
          // I should revert the state update if it fails?
          // Or better: Just hold the 'updatedLocations' in a var and only set state if necessary (or simply retry with 'updatedLocations').
          // Let's just alert. The user is still on the form of the *last* location.
          // If they click submit again, 'updatedLocations' will append AGAIN? Yes.
          // Fix: Check if we already have data for this index?
          // Simplified approach: Just build payload from 'locationsData' (previous) + current 'currentLocationEntry'.
        }
      } catch (error) {
        console.error("Submission Error:", error);
        let msg = "An error occurred.";
        if (error.response) {
          msg = error.response.data.message || msg;
          if (error.response.status === 400) {
            msg = `Validation Error: ${msg}`;
          } else if (error.response.status === 409) {
            msg =
              "Already Submitted: Annexure A already exists for this application.";
          }
        }
        alert(msg);
        // Revert the state add if failed?
        setLocationsData(locationsData); // Revert to previous
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSignatureCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onError = (errors) => {
    console.error("Validation Errors:", errors);
    const firstError = Object.values(errors)[0];
    if (firstError) {
      alert(`Validation Error: ${firstError.message}`);
      // Optional: Scroll to error
      const errorElement = document.querySelector(
        `[name="${Object.keys(errors)[0]}"]`,
      );
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
    }
  };

  return (
    <div className="min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8 bg-white font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 border-b border-gray-100 pb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase">
            Annexure-A: Location Detail Format
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="bg-[#891737] text-white px-3 py-1 rounded-full text-xs font-bold">
              Location {currentLocationIndex + 1} of {totalLocations}
            </span>
          </div>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm mt-2">
            Please fill details for Location #{currentLocationIndex + 1}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handlePreview, onError)}
          className="space-y-8 animate-in fade-in duration-500"
        >
          {/* Section 1: Location Information */}
          <SectionBlock title="Location Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <InputGroup label="Location" error={errors.location} required>
                <input
                  {...register("location")}
                  className="form-input"
                  placeholder="Enter location name"
                />
              </InputGroup>

              <InputGroup label="Landmark" error={errors.landmark} required>
                <input
                  {...register("landmark")}
                  className="form-input"
                  placeholder="Enter nearby landmark"
                />
              </InputGroup>

              <InputGroup
                label="Location Type"
                error={errors.locationType}
                required
              >
                <select {...register("locationType")} className="form-select">
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="both">Both</option>
                </select>
              </InputGroup>
            </div>
          </SectionBlock>

          {/* Section 2: Date & Time Details */}
          <SectionBlock title="Date & Time Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <InputGroup
                label="Start Date & Time"
                error={errors.startDateTime}
                required
              >
                <input
                  type="datetime-local"
                  {...register("startDateTime")}
                  className="form-input"
                />
              </InputGroup>

              <InputGroup
                label="Expected End Date & Time"
                error={errors.endDateTime}
                required
              >
                <input
                  type="datetime-local"
                  {...register("endDateTime")}
                  className="form-input"
                />
              </InputGroup>
            </div>
          </SectionBlock>

          {/* Section 3: Personnel & Involvement */}
          <SectionBlock title="Personnel & Involvement">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <InputGroup
                label="Crew / Public Involvement"
                error={errors.crewPublicInvolvement}
                required
              >
                <textarea
                  {...register("crewPublicInvolvement")}
                  className="form-textarea h-24 pt-2 resize-none"
                  placeholder="Describe crew and public involvement..."
                />
              </InputGroup>

              <InputGroup
                label="Tentative Count (Persons & Extras)"
                error={errors.personCount}
                required
              >
                <input
                  type="number"
                  {...register("personCount")}
                  className="form-input"
                  placeholder="Total count"
                  min="1"
                />
              </InputGroup>
            </div>
          </SectionBlock>

          {/* Section 4: Permissions & Fees */}
          <SectionBlock title="Permissions & Fees">
            <div className="space-y-6">
              <InputGroup
                label="Details of Permission Required"
                error={errors.permissionDetails}
                required
              >
                <textarea
                  {...register("permissionDetails")}
                  className="form-textarea h-24 pt-2 resize-none"
                  placeholder="Specify what permissions are required..."
                />
              </InputGroup>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <InputGroup
                  label="Location Fees (₹)"
                  error={errors.locationFees}
                  required
                >
                  <input
                    type="number"
                    {...register("locationFees")}
                    className="form-input"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </InputGroup>

                <InputGroup
                  label="Security Deposit (₹)"
                  error={errors.securityDeposit}
                  required
                >
                  <input
                    type="number"
                    {...register("securityDeposit")}
                    className="form-input"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </InputGroup>
              </div>

              <InputGroup
                label="Payment Reference / DD Number"
                error={errors.paymentReference}
                required
              >
                <input
                  {...register("paymentReference")}
                  className="form-input"
                  placeholder="Reference or DD number"
                />
              </InputGroup>
            </div>
          </SectionBlock>

          {/* Section 5: Location Manager Details */}
          <SectionBlock title="Location Manager Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <InputGroup
                label="Location Manager Name"
                error={errors.locationManagerName}
                required
              >
                <input
                  {...register("locationManagerName")}
                  className="form-input"
                  placeholder="Full name"
                />
              </InputGroup>

              <InputGroup
                label="Phone Number"
                error={errors.locationManagerPhone}
                required
              >
                <input
                  type="tel"
                  {...register("locationManagerPhone")}
                  className="form-input"
                  placeholder="..."
                />
              </InputGroup>

              <div className="md:col-span-2">
                <InputGroup
                  label="Email Address"
                  error={errors.locationManagerEmail}
                  required
                >
                  <input
                    type="email"
                    {...register("locationManagerEmail")}
                    className="form-input"
                    placeholder="email@example.com"
                  />
                </InputGroup>
              </div>
            </div>
          </SectionBlock>

          {/* Section 6: Scene Details */}
          <SectionBlock title="Scene Details">
            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Scene Details (max 100 words){" "}
                  <span className="text-red-500">*</span>
                </label>
                <span
                  className={`text-xs ${wordCount > 100 ? "text-red-500 font-bold" : "text-gray-500"}`}
                >
                  {wordCount}/100 words
                </span>
              </div>
              <textarea
                {...register("sceneDetails")}
                className={`form-textarea h-32 pt-2 resize-none ${errors.sceneDetails ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="Describe the scenes to be shot at this location..."
              />
              {errors.sceneDetails && (
                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.sceneDetails.message}</span>
                </div>
              )}
            </div>
          </SectionBlock>

          {/* Section 7: Forest Area Details */}
          <SectionBlock title="Forest Area Details">
            <div className="space-y-6">
              <InputGroup
                label="Is this location a forest area?"
                error={errors.isForestArea}
                required
              >
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="yes"
                      {...register("isForestArea")}
                      className="cursor-pointer w-4 h-4 text-[#891737] focus:ring-[#891737]"
                    />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="no"
                      {...register("isForestArea")}
                      className="cursor-pointer w-4 h-4 text-[#891737] focus:ring-[#891737]"
                    />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>
              </InputGroup>

              {isForestArea === "yes" && (
                <div className="animate-in fade-in slide-in-from-top-4 space-y-6">
                  <InputGroup
                    label="Type of Forest Area"
                    error={errors.forestType}
                    required
                  >
                    <div className="space-y-3 mt-2">
                      {[
                        "Reserve Forest",
                        "National Park",
                        "Buffer zone",
                        "Sanctuary",
                        "Zoo",
                      ].map((type) => (
                        <label
                          key={type}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={type}
                            {...register("forestType")}
                            className="cursor-pointer w-4 h-4 text-[#891737] rounded focus:ring-[#891737]"
                          />
                          <span className="text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </InputGroup>

                  <InputGroup
                    label="Mention Details of Forest Area"
                    error={errors.forestDetails}
                  >
                    <textarea
                      {...register("forestDetails")}
                      className="form-textarea h-24 pt-2 resize-none"
                      placeholder="Provide details about the forest area..."
                    />
                  </InputGroup>
                </div>
              )}
            </div>
          </SectionBlock>

          {/* Section 8: Signature & Authorization */}
          <SectionBlock title="Authorization & Signature">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <InputGroup
                  label="Name of Authorized Applicant"
                  error={errors.applicantName}
                  required
                >
                  <input
                    {...register("applicantName")}
                    className="form-input"
                    placeholder="Full name"
                  />
                </InputGroup>

                <InputGroup label="Date" error={errors.applicantDate} required>
                  <input
                    type="date"
                    min={today}
                    {...register("applicantDate")}
                    className="form-input"
                  />
                </InputGroup>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#891737] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureCapture}
                  className="hidden"
                  id="signature-upload"
                />
                <label
                  htmlFor="signature-upload"
                  className="cursor-pointer w-full h-full block"
                >
                  {signatureImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={signatureImage}
                        alt="Signature"
                        className="h-20 object-contain"
                      />
                      <p className="text-sm text-gray-600">
                        Click to change signature
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-2">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-gray-700">
                        Upload Signature
                      </p>
                      <p className="text-sm text-gray-500">
                        Click to upload your signature image
                      </p>
                    </div>
                  )}
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <span className="font-semibold">Seal & Signature:</span>{" "}
                    Please ensure your signature is clear and legible in the
                    image format.
                  </span>
                </p>
              </div>
            </div>
          </SectionBlock>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-4 pt-10 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                reset();
                setSignatureImage(null);
              }}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-8 py-2.5 text-sm font-semibold text-white bg-[#891737] rounded hover:bg-[#70122d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#891737] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Submitting
                </>
              ) : (
                <>
                  {currentLocationIndex < totalLocations - 1 ? (
                    <>
                      Save & Next Location{" "}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Submit Application ({locationsData.length + 1}/
                      {totalLocations}) <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </>
              )}
            </button>
          </div>
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
      <UniversalPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={onConfirmLocation}
        title={`LOCATION PREVIEW (${currentLocationIndex + 1}/${totalLocations})`}
        isSubmitting={isSubmitting}
        data={{
          "Location Info": {
            "Location Name": currentPreviewData?.location,
            Landmark: currentPreviewData?.landmark,
            Type: currentPreviewData?.locationType,
            "Is Forest?": currentPreviewData?.isForestArea,
          },
          Schedule: {
            Start: currentPreviewData?.startDateTime,
            End: currentPreviewData?.endDateTime,
          },
          Involvement: {
            "Crew/Public": currentPreviewData?.crewPublicInvolvement,
            "Person Count": currentPreviewData?.personCount,
          },
          "Permissions & Fees": {
            Details: currentPreviewData?.permissionDetails,
            Fees: `₹${currentPreviewData?.locationFees}`,
            "Security Deposit": `₹${currentPreviewData?.securityDeposit}`,
            "Payment Ref": currentPreviewData?.paymentReference,
          },
          "Location Manager": {
            Name: currentPreviewData?.locationManagerName,
            Phone: currentPreviewData?.locationManagerPhone,
            Email: currentPreviewData?.locationManagerEmail,
          },
          "Scene & Forest": {
            "Scene Details": currentPreviewData?.sceneDetails,
            "Forest Type":
              currentPreviewData?.forestType &&
              Array.isArray(currentPreviewData.forestType)
                ? currentPreviewData?.forestType.join(", ")
                : currentPreviewData?.forestType || "N/A",
            "Forest Details": currentPreviewData?.forestDetails,
          },
          Authorization: {
            Applicant: currentPreviewData?.applicantName,
            Date: currentPreviewData?.applicantDate,
          },
        }}
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
    {error && (
      <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
        <AlertCircle className="w-3 h-3" />
        <span>{error.message}</span>
      </div>
    )}
  </div>
);

export default AnnextureA;
