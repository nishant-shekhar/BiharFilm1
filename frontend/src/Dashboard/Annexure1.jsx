import React, { useState } from "react";
import api from "../Components/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, AlertCircle } from "lucide-react";

// Regex Patterns
const ALPHA = /^[A-Za-z\s]+$/;
const ALPHANUM = /^[A-Za-z0-9\s]+$/;
const MOBILE = /^[6-9]\d{9}$/;

// Validation Schema
const schema = z
  .object({
    projectType: z
      .string()
      .min(1, "Project type is required")
      .regex(ALPHA, "Only alphabets are allowed"),

    language: z
      .string()
      .min(1, "Language is required")
      .regex(ALPHA, "Only alphabets are allowed"),

    genre: z
      .string()
      .min(1, "Genre is required")
      .regex(ALPHA, "Only alphabets are allowed"),

    duration: z.coerce
      .number({ invalid_type_error: "Duration must be a number" })
      .positive("Duration must be a positive number"),

    projectTitle: z
      .string()
      .min(1, "Project title is required")
      .regex(
        ALPHANUM,
        "Only letters and numbers are allowed (no special characters)",
      ),

    producerName: z
      .string()
      .min(1, "Producer name is required")
      .regex(ALPHA, "Only alphabets are allowed"),
    productionHouse: z
      .string()
      .min(1, "Production house is required")
      .regex(
        ALPHANUM,
        "Only letters and numbers are allowed (no special characters)",
      ),

    totalShootingDays: z.coerce
      .number({ invalid_type_error: "Required" })
      .positive("Must be positive"),
    biharShootingDays: z.coerce
      .number({ invalid_type_error: "Required" })
      .positive("Must be positive"),

    shootingStartDate: z.string().min(1, "Start date required"),
    shootingEndDate: z.string().min(1, "End date required"),

    approxBudget: z.coerce
      .number({ invalid_type_error: "Required" })
      .positive("Must be positive"),
    approxExpenditureBihar: z.coerce
      .number({ invalid_type_error: "Required" })
      .positive("Must be positive"),
    estimatedManpower: z.coerce
      .number({ invalid_type_error: "Required" })
      .int()
      .positive("Must be positive"),

    shootingLocation: z.string().min(1, "Location is required"),

    lineProducerName: z
      .string()
      .min(1, "Line Producer name is required")
      .regex(ALPHA, "Only alphabets are allowed"),
    lineProducerContact: z
      .string()
      .min(1, "Contact is required")
      .regex(MOBILE, "Only numbers are allowed"),

    producerContactName: z
      .string()
      .min(1, "Name is required")
      .regex(ALPHA, "Only alphabets are allowed"),
    producerDesignation: z
      .string()
      .min(1, "Designation is required")
      .regex(ALPHA, "Only alphabets are allowed"),
    producerAddress: z
      .string()
      .min(1, "Address is required")
      .regex(
        ALPHANUM,
        "Only letters and numbers are allowed (no special characters)",
      ),
    producerEmail: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email"),
    producerMobile: z
      .string()
      .min(1, "Mobile is required")
      .regex(MOBILE, "Only numbers are allowed"),

    directorName: z
      .string()
      .min(1, "Director name is required")
      .regex(ALPHA, "Only alphabets are allowed"),
    mainCast: z
      .string()
      .min(1, "Main cast names are required")
      .regex(
        /^[a-zA-Z\s,]+$/,
        "Only alphabets, spaces and commas are allowed in Main Cast",
      ),

    synopsis: z
      .string()
      .min(10, "Synopsis is too short")
      .refine((val) => val.trim().split(/\s+/).length <= 100, {
        message: "Synopsis must not exceed 100 words",
      }),
  })
  .refine(
    (data) => {
      if (data.shootingStartDate && data.shootingEndDate) {
        return (
          new Date(data.shootingEndDate) >= new Date(data.shootingStartDate)
        );
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["shootingEndDate"],
    },
  );

const Annexure1 = ({ activeApplication }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    // 1. Validate Pre-conditions
    if (!activeApplication || !activeApplication.id) {
      alert(
        "No active application found. Please create an application via the 'NOC Forms' menu first.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Transform data to match backend schema
      const payload = {
        language: data.language,
        genre: data.genre,
        typeOfProject: data.projectType,
        titleOfProject: data.projectTitle,
        durationOfProject: data.duration.toString(), // Backend might expect string or int, usually string if 'Duration'
        producerName: data.producerName,
        productionHouse: data.productionHouse,
        lineProducerNameAndContact: `${data.lineProducerName} (${data.lineProducerContact})`,
        totalShootingDays: parseInt(data.totalShootingDays),
        shootingDaysInBihar: parseInt(data.biharShootingDays),
        shootingDatesInBihar: `${data.shootingStartDate} to ${data.shootingEndDate}`,
        proposedShootingLocationInBihar: data.shootingLocation,
        approximateBudgetOfProject: data.approxBudget.toString(),
        approximateExpenditureInBihar: data.approxExpenditureBihar.toString(),
        estimatedManpowerUtilizationBihar: data.estimatedManpower.toString(),
        executiveProducerName: data.producerContactName,
        executiveProducerDesignation: data.producerDesignation,
        executiveProducerAddress: data.producerAddress,
        executiveProducerEmail: data.producerEmail,
        executiveProducerMobile: data.producerMobile,
        directorAndMainCastNames: `Director: ${data.directorName}, Cast: ${data.mainCast}`,
        synopsis: data.synopsis,
      };

      console.log(
        "Submitting Annexure 1 Payload for App ID:",
        activeApplication.id,
        payload,
      );

      // 2. API Call
      const response = await api.post(
        `/api/annexureOne/applications/${activeApplication.id}/annexure-one`,
        payload,
      );

      if (response.data.success) {
        alert("Annexure 1 Submitted Successfully!");
        reset();
        // Optional: You might want to refresh the dashboard status here, but for now we reset.
      } else {
        alert(response.data.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "An error occurred while submitting. Please try again.";
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const synopsisText = watch("synopsis") || "";
  const wordCount =
    synopsisText.trim() === "" ? 0 : synopsisText.trim().split(/\s+/).length;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-2 border-b border-gray-200 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Project Specific Detail Format
          </h1>
          <p className="text-gray-500 text-xs">
            Please fill in the details below accurately. This information is
            required for Annexure-1 compliance.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Section 1: Project Overview */}
          <SectionBlock title="Project Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <InputGroup
                label="Title of Project"
                error={errors.projectTitle}
                required
              >
                <input
                  {...register("projectTitle")}
                  className="form-input"
                  placeholder="Enter full title"
                />
              </InputGroup>

              <InputGroup
                label="Type of Project"
                error={errors.projectType}
                required
              >
                <select {...register("projectType")} className="form-select">
                  <option value="">Select Type</option>
                  <option value="Feature Film">Feature Film</option>
                  <option value="Web Series">Web Series</option>
                  <option value="TV Serial">TV Serial</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Short Film">Short Film</option>
                </select>
              </InputGroup>

              <InputGroup label="Language" error={errors.language} required>
                <input
                  {...register("language")}
                  className="form-input"
                  placeholder="e.g. Hindi, Bhojpuri"
                />
              </InputGroup>

              <InputGroup label="Genre" error={errors.genre} required>
                <input
                  {...register("genre")}
                  className="form-input"
                  placeholder="e.g. Drama, Action"
                />
              </InputGroup>

              <InputGroup
                label="Duration (Minutes)"
                error={errors.duration}
                required
              >
                <input
                  type="number"
                  min="0"
                  {...register("duration")}
                  className="form-input"
                  placeholder="e.g. 120"
                />
              </InputGroup>
            </div>
          </SectionBlock>

          {/* Section 2: Production Details */}
          <SectionBlock title="Production Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <InputGroup
                label="Producer Name"
                error={errors.producerName}
                required
              >
                <input
                  {...register("producerName")}
                  className="form-input"
                  placeholder="Full legal name"
                />
              </InputGroup>

              <InputGroup
                label="Production House"
                error={errors.productionHouse}
                required
              >
                <input
                  {...register("productionHouse")}
                  className="form-input"
                  placeholder="Registered company name"
                />
              </InputGroup>

              <InputGroup
                label="Approx Budget (₹)"
                error={errors.approxBudget}
                required
              >
                <input
                  type="number"
                  min="0"
                  {...register("approxBudget")}
                  className="form-input"
                  placeholder="0.00"
                />
              </InputGroup>

              <InputGroup
                label="Est. Expenditure in Bihar (₹)"
                error={errors.approxExpenditureBihar}
                required
              >
                <input
                  type="number"
                  min="0"
                  {...register("approxExpenditureBihar")}
                  className="form-input"
                  placeholder="0.00"
                />
              </InputGroup>
            </div>
          </SectionBlock>

          {/* Section 3: Shooting Details */}
          <SectionBlock title="Shooting Schedule">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <InputGroup
                label="Total Shooting Days"
                error={errors.totalShootingDays}
                required
              >
                <input
                  type="number"
                  min="0"
                  {...register("totalShootingDays")}
                  className="form-input"
                  placeholder="Total days"
                />
              </InputGroup>

              <InputGroup
                label="Shooting Days in Bihar"
                error={errors.biharShootingDays}
                required
              >
                <input
                  type="number"
                  min="0"
                  {...register("biharShootingDays")}
                  className="form-input"
                  placeholder="Days in Bihar"
                />
              </InputGroup>

              <InputGroup
                label="Shooting Location (Bihar)"
                error={errors.shootingLocation}
                required
              >
                <input
                  {...register("shootingLocation")}
                  className="form-input"
                  placeholder="e.g. Patna, Gaya, Rajgir"
                />
              </InputGroup>

              <InputGroup
                label="Bihar Manpower (Est.)"
                error={errors.estimatedManpower}
                required
              >
                <input
                  type="number"
                  min="0"
                  {...register("estimatedManpower")}
                  className="form-input"
                  placeholder="Number of personnel"
                />
              </InputGroup>

              <InputGroup
                label="Shooting Start Date"
                error={errors.shootingStartDate}
                required
              >
                <input
                  type="date"
                  min={today}
                  {...register("shootingStartDate")}
                  className="form-input"
                />
              </InputGroup>

              <InputGroup
                label="Shooting End Date"
                error={errors.shootingEndDate}
                required
              >
                <input
                  type="date"
                  min={today}
                  {...register("shootingEndDate")}
                  className="form-input"
                />
              </InputGroup>
            </div>
          </SectionBlock>

          {/* Section 4: Personnel */}
          <SectionBlock title="Key Personnel">
            <div className="space-y-8">
              <div className="p-0">
                <h3 className="text-base font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                  Line Producer
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <InputGroup
                    label="Name"
                    error={errors.lineProducerName}
                    required
                  >
                    <input
                      {...register("lineProducerName")}
                      className="form-input"
                      placeholder="Full Name"
                    />
                  </InputGroup>
                  <InputGroup
                    label="Contact"
                    error={errors.lineProducerContact}
                    required
                  >
                    <input
                      {...register("lineProducerContact")}
                      className="form-input"
                      placeholder="+91..."
                    />
                  </InputGroup>
                </div>
              </div>

              <div className="p-0">
                <h3 className="text-base font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                  Producer / Executive Producer
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <InputGroup
                    label="Contact Person"
                    error={errors.producerContactName}
                    required
                  >
                    <input
                      {...register("producerContactName")}
                      className="form-input"
                      placeholder="Name"
                    />
                  </InputGroup>

                  <InputGroup
                    label="Designation"
                    error={errors.producerDesignation}
                    required
                  >
                    <input
                      {...register("producerDesignation")}
                      className="form-input"
                      placeholder="e.g. Executive Producer"
                    />
                  </InputGroup>

                  <InputGroup
                    label="Email"
                    error={errors.producerEmail}
                    required
                  >
                    <input
                      {...register("producerEmail")}
                      className="form-input"
                      placeholder="producer@example.com"
                    />
                  </InputGroup>

                  <InputGroup
                    label="Mobile (WhatsApp)"
                    error={errors.producerMobile}
                    required
                  >
                    <input
                      {...register("producerMobile")}
                      className="form-input"
                      placeholder="+91..."
                    />
                  </InputGroup>

                  <div className="md:col-span-2">
                    <InputGroup
                      label="Full Address"
                      error={errors.producerAddress}
                      required
                    >
                      <textarea
                        {...register("producerAddress")}
                        className="form-textarea"
                        rows="3"
                        placeholder="Registered office address..."
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>
            </div>
          </SectionBlock>

          {/* Section 5: Cast & Creative */}
          <SectionBlock title="Cast & Creative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
              <InputGroup
                label="Director Name"
                error={errors.directorName}
                required
              >
                <input
                  {...register("directorName")}
                  className="form-input"
                  placeholder="Director Name"
                />
              </InputGroup>
              <InputGroup label="Main Cast" error={errors.mainCast} required>
                <input
                  {...register("mainCast")}
                  className="form-input"
                  placeholder="e.g. Actor A, Actor B..."
                />
              </InputGroup>
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Synopsis
                  <span className="text-red-500">*</span>
                </label>
                <span
                  className={`text-xs ${wordCount > 100 ? "text-red-500 font-bold" : "text-gray-500"}`}
                >
                  {wordCount}/100 words
                </span>
              </div>
              <textarea
                {...register("synopsis")}
                className={`form-textarea h-32 ${errors.synopsis ? "ring-red-500 border-red-500" : ""}`}
                placeholder="Brief summary of the project (max 100 words)..."
              />
              {errors.synopsis && (
                <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.synopsis.message}</span>
                </div>
              )}
            </div>
          </SectionBlock>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-4 pt-10 border-t border-gray-200">
            <button
              type="button"
              onClick={() => reset()}
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
                  Submit Application <ArrowRight className="ml-2 w-4 h-4" />
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

export default Annexure1;
