import React, { useState } from "react";
import api from "../Components/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, XCircle } from "lucide-react";
import UniversalPreviewModal from "./UniversalPreviewModal";

/* =======================
   REGEX RULES
======================= */
const ALPHA = /^[A-Za-z\s]+$/;
const ALPHANUM = /^[A-Za-z0-9\s]+$/;
const MOBILE = /^[6-9]\d{9}$/;

/* =======================
   SCHEMA
======================= */
/* =======================
   SCHEMA
======================= */
const schema = z.object({
  // Step 1
  typeOfProject: z
    .string()
    .min(1, "Required")
    .regex(ALPHA, "Only alphabets are allowed"),
  language: z
    .string()
    .min(1, "Required")
    .regex(ALPHA, "Only alphabets are allowed"),
  genre: z
    .string()
    .min(1, "Required")
    .regex(ALPHA, "Only alphabets are allowed"),
  duration: z.coerce.number().positive("Required"),
  title: z
    .string()
    .min(1, "Required")
    .regex(
      ALPHANUM,
      "Only letters and numbers are allowed (no special characters)",
    ),
  directorAndCast: z
    .string()
    .min(1, "Required")
    .regex(ALPHA, "Only alphabets are allowed"),
  synopsis: z
    .string()
    .min(1, "Synopsis is required")
    .refine((v) => v.trim().split(/\s+/).length <= 250, "Max 250 words"),

  // Step 2
  productionHouse: z
    .string()
    .min(1, "Required")
    .regex(
      ALPHANUM,
      "Only letters and numbers are allowed (no special characters)",
    ),
  productionAddress: z.string().min(5, "Address too short"),
  productionContact: z
    .string()
    .min(1, "Required")
    .regex(MOBILE, "Only numbers are allowed"),
  productionEmail: z.string().min(1, "Required").email(),
  constitution: z
    .string()
    .min(1, "Required")
    .regex(ALPHA, "Only alphabets are allowed"),
  registrationDetails: z
    .string()
    .min(1, "Required")
    .regex(
      ALPHANUM,
      "Only letters and numbers are allowed (no special characters)",
    ),
  representativeName: z
    .string()
    .min(1, "Required")
    .regex(ALPHA, "Only alphabets are allowed"),
  designation: z
    .string()
    .min(1, "Required")
    .regex(ALPHA, "Only alphabets are allowed"),
  applicantAddress: z.string().min(5, "Address too short"),
  applicantContact: z
    .string()
    .min(1, "Required")
    .regex(MOBILE, "Only numbers are allowed"),
  applicantEmail: z.string().min(1, "Required").email(),

  // Step 3
  mainArtists: z
    .string()
    .min(1, "Required")
    .regex(ALPHA, "Only alphabets are allowed"),
  totalLocations: z.coerce.number().positive("Required"),
  drone: z.enum(["Yes", "No"], { errorMap: () => ({ message: "Required" }) }),
  animal: z.enum(["Yes", "No"], { errorMap: () => ({ message: "Required" }) }),
  fireScene: z.enum(["Yes", "No"], {
    errorMap: () => ({ message: "Required" }),
  }),
  temporaryStructure: z.enum(["Yes", "No"], {
    errorMap: () => ({ message: "Required" }),
  }),
  otherDetails: z.string().optional(),
  lineProducerDetails: z.string().optional(),
  policeSecurityDetails: z.string().optional(),
  contactInCharge: z
    .string()
    .min(1, "Required")
    .regex(ALPHA, "Only alphabets are allowed"),
  brandingDetails: z.string().optional(),

  // Step 4
  mibPermission: z.any().optional(), // 30 (Conditional usually, but user asked for visual field)
  competentAuthorityPermission: z.any().optional(), // 31
  otherParticulars: z.string().optional(), // 32

  // Declaration
  authorizedName: z
    .string()
    .min(1, "Required")
    .regex(ALPHA, "Only alphabets are allowed"),
  sealFile: z.any().refine((f) => f && f.length > 0, "File is required"),
  signatureFile: z.any().refine((f) => f && f.length > 0, "File is required"),
});

/* =======================
   COMPONENT
======================= */
export default function Annexure2Form({ activeApplication, onSubmit }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  /* STEP FIELDS DEFINITION */
  const stepsFields = {
    1: [
      "typeOfProject",
      "language",
      "genre",
      "duration",
      "title",
      "directorAndCast",
      "synopsis",
    ],
    2: [
      "productionHouse",
      "productionAddress",
      "productionContact",
      "productionEmail",
      "constitution",
      "registrationDetails",
      "representativeName",
      "designation",
      "applicantAddress",
      "applicantContact",
      "applicantEmail",
    ],
    3: [
      "mainArtists",
      "totalLocations",
      "drone",
      "animal",
      "fireScene",
      "temporaryStructure",
      "otherDetails",
      "lineProducerDetails",
      "policeSecurityDetails",
      "contactInCharge",
      "brandingDetails",
    ],
    4: [
      "mibPermission",
      "competentAuthorityPermission",
      "otherParticulars",
      "authorizedName",
      "sealFile",
      "signatureFile",
    ],
  };

  /* SAVE DATA ON NEXT */
  const nextStep = async () => {
    const fields = stepsFields[step];
    const valid = await trigger(fields);

    if (!valid) return;

    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleClear = () => {
    const fields = stepsFields[step];
    fields.forEach((field) => resetField(field));
  };

  /* HANDLE SUBMIT ERRORS & AUTO-REDIRECT */
  const onError = (errors) => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      // Find which step contains this field
      const stepWithErr = Object.keys(stepsFields).find((key) =>
        stepsFields[key].includes(firstErrorField),
      );

      if (stepWithErr) {
        setStep(Number(stepWithErr));
        alert(`Please complete required fields in Step ${stepWithErr}`);
      }
    }
  };

  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = () => {
    // 1. Validate Pre-conditions
    if (!activeApplication || !activeApplication.id) {
      alert("No active application found.");
      return;
    }
    setShowPreview(true);
  };

  const submitFinal = async () => {
    const data = getValues();
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // --- Map Fields to Backend Keys ---

      // Project Information
      formData.append("typeOfProject", data.typeOfProject);
      formData.append("language", data.language);
      formData.append("genre", data.genre);
      formData.append("duration", data.duration.toString());
      formData.append("title", data.title);
      formData.append("directorAndMainCast", data.directorAndCast);
      formData.append("producerHouse", data.productionHouse); // Note key mapping
      formData.append("synopsis", data.synopsis);

      // Production House Details
      formData.append("contactOfProductionHouse", data.productionContact);
      formData.append("productionHouseAddress", data.productionAddress);
      formData.append("emailOfProductionHouse", data.productionEmail);
      formData.append("productionHouseConstitution", data.constitution);
      formData.append("registrationNumber", data.registrationDetails);

      // Applicant Details
      formData.append("representativeName", data.representativeName);
      formData.append("designationOfApplicant", data.designation);
      formData.append("addressOfApplicant", data.applicantAddress);
      formData.append("contactOfApplicant", data.applicantContact);
      formData.append("emailOfApplicant", data.applicantEmail);

      // Shooting Details
      formData.append("briefSynopsis", data.synopsis);

      formData.append("mainArtistsAtLocation", data.mainArtists);
      formData.append(
        "numberOfShootingLocations",
        data.totalLocations.toString(),
      );

      // Special Permissions (Booleans)
      formData.append(
        "dronePermissionRequired",
        data.drone === "Yes" ? "true" : "false",
      );
      formData.append(
        "animalPartOfShooting",
        data.animal === "Yes" ? "true" : "false",
      );
      formData.append(
        "fireOrBlastingScene",
        data.fireScene === "Yes" ? "true" : "false",
      );
      formData.append(
        "temporaryStructureCreation",
        data.temporaryStructure === "Yes" ? "true" : "false",
      );

      // Optional Details
      if (data.otherDetails) formData.append("otherDetails", data.otherDetails);
      if (data.lineProducerDetails)
        formData.append("lineProducerDetails", data.lineProducerDetails);
      if (data.policeSecurityDetails)
        formData.append(
          "policeOrSecurityRequirement",
          data.policeSecurityDetails,
        );
      if (data.contactInCharge)
        formData.append("siteContactPersonDetails", data.contactInCharge);

      if (data.brandingDetails) {
        const existingOther = formData.get("otherDetails") || "";
        formData.set(
          "otherDetails",
          existingOther
            ? `${existingOther} | Branding: ${data.brandingDetails}`
            : `Branding: ${data.brandingDetails}`,
        );
      }

      // Declaration
      formData.append("authorizedApplicantName", data.authorizedName);

      // --- Files ---
      // Files come as FileList from react-hook-form. Access [0].
      if (data.mibPermission && data.mibPermission[0]) {
        formData.append("mibCertificate", data.mibPermission[0]);
      }
      if (
        data.competentAuthorityPermission &&
        data.competentAuthorityPermission[0]
      ) {
        formData.append("meaCertificate", data.competentAuthorityPermission[0]);
      }

      // Important: Prompt says "otherParticulars" (text) field 32.
      if (data.otherParticulars) {
        const existingOther = formData.get("otherDetails") || "";
        formData.set(
          "otherDetails",
          existingOther
            ? `${existingOther} | Particulars: ${data.otherParticulars}`
            : `Particulars: ${data.otherParticulars}`,
        );
      }

      if (data.sealFile && data.sealFile[0]) {
        formData.append("seal", data.sealFile[0]);
      }
      if (data.signatureFile && data.signatureFile[0]) {
        formData.append("signature", data.signatureFile[0]);
      }

      console.log("Submitting NOC Payload for App ID:", activeApplication.id);

      const response = await api.post(
        `/api/noc/applications/${activeApplication.id}/noc-form`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        alert("NOC Form Submitted Successfully!");
        if (onSubmit) onSubmit(); // Trigger dashboard refresh
        setShowPreview(false);
      } else {
        alert(response.data.message || "Submission failed.");
        setShowPreview(false);
      }
    } catch (error) {
      console.error("Submission Error:", error);

      let msg = "An error occurred.";
      if (error.response) {
        msg = error.response.data.message || msg;
        if (error.response.status === 400) {
          msg = `Validation Error: ${msg}`;
        } else if (error.response.status === 409) {
          msg = "Already Submitted: This application already has a NOC form.";
        }
      }
      alert(msg);
      setShowPreview(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="text-center mb-10 border-b border-gray-100 pb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase">
          Application form for seeking permission to shoot in bihar
        </h1>
      </div>

      <Stepper currentStep={step} onStepClick={setStep} />

      {/* STEP 1: Project Details */}
      {step === 1 && (
        <Card title="Step 1: Project Details">
          <Grid>
            <Alpha
              label="1. Type of Project"
              name="typeOfProject"
              placeholder="e.g. Feature Film, Documentary"
              register={register}
              error={errors}
            />
            <Alpha
              label="2. Language of the Film/Project"
              name="language"
              placeholder="e.g. Hindi, Bhojpuri"
              register={register}
              error={errors}
            />
            <Alpha
              label="3. Genre"
              name="genre"
              placeholder="e.g. Drama, Action"
              register={register}
              error={errors}
            />
            <NumberInput
              label="4. Duration of Project (minutes)"
              name="duration"
              placeholder="e.g. 120"
              register={register}
              error={errors}
            />
            <AlphaNum
              label="5. Title of Project"
              name="title"
              placeholder="e.g. The Bihar Story"
              register={register}
              error={errors}
            />
            <Alpha
              label="6. Director and Main Cast Names"
              name="directorAndCast"
              placeholder="e.g. Director: John Doe, Cast: Jane Doe"
              register={register}
              error={errors}
            />
          </Grid>

          <Textarea
            label="7. Synopsis of Project (In 250 Words)"
            name="synopsis"
            placeholder="Brief summary of the project..."
            register={register}
            error={errors}
          />
        </Card>
      )}

      {/* STEP 2: Production & Applicant Details */}
      {step === 2 && (
        <Card title="Step 2: Production & Applicant Details">
          <Grid>
            <AlphaNum
              label="8. Production House"
              name="productionHouse"
              placeholder="e.g. ABC Productions"
              register={register}
              error={errors}
            />
            <Input
              label="9. Address of the production house"
              name="productionAddress"
              placeholder="Full address"
              register={register}
              error={errors}
            />
            <Mobile
              label="10. Contact of the production house"
              name="productionContact"
              placeholder="+91..."
              register={register}
              error={errors}
            />
            <Input
              label="11. E-mail ID of the production house"
              name="productionEmail"
              placeholder="example@domain.com"
              register={register}
              error={errors}
            />

            <Alpha
              label="12. Production House Constitution"
              name="constitution"
              placeholder="Proprietorship, Partnership, Company"
              register={register}
              error={errors}
            />
            <AlphaNum
              label="13. Details of Constitution/ Registration no."
              name="registrationDetails"
              placeholder="Registration Number"
              register={register}
              error={errors}
            />

            <Alpha
              label="14. Representative Name (Attach Authorization letter)"
              name="representativeName"
              placeholder="Name of representative"
              register={register}
              error={errors}
            />
            <Alpha
              label="15. Designation of the applicant"
              name="designation"
              placeholder="e.g. Producer, Manager"
              register={register}
              error={errors}
            />

            <Input
              label="16. Address of the applicant"
              name="applicantAddress"
              placeholder="Full address"
              register={register}
              error={errors}
            />
            <Mobile
              label="17. Contact of the applicant"
              name="applicantContact"
              placeholder="+91..."
              register={register}
              error={errors}
            />
            <Input
              label="18. E-mail ID of the applicant"
              name="applicantEmail"
              placeholder="applicant@domain.com"
              register={register}
              error={errors}
            />
          </Grid>
        </Card>
      )}

      {/* STEP 3: Shooting Specifics */}
      {step === 3 && (
        <Card title="Step 3: Shooting Specifics">
          <Grid>
            <Alpha
              label="19. Main Artist/s at shooting Location (Names only)"
              name="mainArtists"
              placeholder="List main artists"
              register={register}
              error={errors}
            />
            <NumberInput
              label="20. Total Number of Shooting Locations"
              name="totalLocations"
              placeholder="e.g. 5"
              register={register}
              error={errors}
            />
          </Grid>

          <div className="space-y-4 border-t pt-4 mt-2">
            <div className="grid md:grid-cols-2 gap-6">
              <YesNo
                label="21. Is Drone Permission required"
                name="drone"
                register={register}
                error={errors}
              />
              <YesNo
                label="22. Whether any animal is part of shooting"
                name="animal"
                register={register}
                error={errors}
              />
              <YesNo
                label="23. Is there any fire/blasting scene in the script"
                name="fireScene"
                register={register}
                error={errors}
              />
              <YesNo
                label="24. Is there any temporary structure to be created"
                name="temporaryStructure"
                register={register}
                error={errors}
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <Textarea
              label="25. Other Details (Road Blocks, set creation, special assistance etc.)"
              name="otherDetails"
              placeholder="Enter details if any..."
              register={register}
              error={errors}
            />
            <Textarea
              label="26. Details of Line Producer (Name, Contact, E-mail, Address)"
              name="lineProducerDetails"
              placeholder="Enter Line Producer details..."
              register={register}
              error={errors}
            />
            <Input
              label="27. Details/No. of Police convoy/security person need"
              name="policeSecurityDetails"
              placeholder="Enter requirements..."
              register={register}
              error={errors}
            />
            <Alpha
              label="28. Contact details of person in charge (for BSFDFC official)"
              name="contactInCharge"
              placeholder="Name and Contact"
              register={register}
              error={errors}
            />
            <Textarea
              label="29. In case of In-Film Branding or using any Assets/Name/Place..."
              name="brandingDetails"
              placeholder="Enter branding details..."
              register={register}
              error={errors}
            />
          </div>
        </Card>
      )}

      {step === 4 && (
        <Card title="Step 4: Permissions & Declaration">
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Foreign/International Productions (Optional)
              </h3>
              <div className="grid md:grid-cols-1 gap-6">
                <File
                  label="30. In case of International Film, Web Series and TV Serials shooting - Enclose shoot Permission Certificate issued by the MIB (Ministry of Information & Broadcasting)"
                  name="mibPermission"
                  register={register}
                  error={errors}
                />
                <File
                  label="31. In case of International Documentary, AV Commercial and Music Videos shooting - Enclose shoot Permission Certificate issued by the competent authority"
                  name="competentAuthorityPermission"
                  register={register}
                  error={errors}
                />
              </div>
            </div>

            <Textarea
              label="32. Other particular (if any)"
              name="otherParticulars"
              placeholder="Any other information..."
              register={register}
              error={errors}
            />

            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-bold text-[#891737] mb-4">
                Declaration
              </h3>
              <Grid>
                <Alpha
                  label="Name of Authorized Applicant"
                  name="authorizedName"
                  placeholder="Full Name"
                  register={register}
                  error={errors}
                />
                <File
                  label="Upload Seal"
                  name="sealFile"
                  register={register}
                  error={errors}
                />
                <File
                  label="Upload Signature"
                  name="signatureFile"
                  register={register}
                  error={errors}
                />
              </Grid>
            </div>
          </div>
        </Card>
      )}

      {/* NAVIGATION */}
      <div className="flex justify-between pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={handleClear}
          className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm"
        >
          Clear Step
        </button>

        <div className="flex gap-4">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium shadow-sm hover:shadow"
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={nextStep}
              className="px-8 py-3 bg-[#891737] text-white rounded-lg hover:bg-[#70122d] transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
            >
              Save And Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit(handlePreview, onError)}
              className="px-8 py-3 bg-[#891737] text-white rounded-lg hover:bg-[#70122d] transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center gap-2 min-w-[200px] justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  Submitting Application...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          )}
        </div>
      </div>
      <Styles />

      {/* PREVIEW MODAL */}
      <UniversalPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={submitFinal}
        data={{
          "Project Details": {
            "Type of Project": getValues("typeOfProject"),
            Language: getValues("language"),
            Genre: getValues("genre"),
            "Duration (min)": getValues("duration"),
            Title: getValues("title"),
            "Director & Cast": getValues("directorAndCast"),
            Synopsis: getValues("synopsis"),
          },
          "Production Info": {
            "Production House": getValues("productionHouse"),
            Address: getValues("productionAddress"),
            Contact: getValues("productionContact"),
            Email: getValues("productionEmail"),
            Constitution: getValues("constitution"),
            "Registration No": getValues("registrationDetails"),
            Representative: getValues("representativeName"),
            Designation: getValues("designation"),
          },
          "Applicant Info": {
            Address: getValues("applicantAddress"),
            Contact: getValues("applicantContact"),
            Email: getValues("applicantEmail"),
          },
          "Shooting Specs": {
            "Main Artists": getValues("mainArtists"),
            "Total Locations": getValues("totalLocations"),
            "Drone Required?": getValues("drone"),
            "Animals Used?": getValues("animal"),
            "Fire/Blasting?": getValues("fireScene"),
            "Temp Structure?": getValues("temporaryStructure"),
            "Line Producer": getValues("lineProducerDetails") || "N/A",
            "Police/Security": getValues("policeSecurityDetails") || "N/A",
            Branding: getValues("brandingDetails") || "N/A",
          },
          Declaration: {
            "Authorized Applicant": getValues("authorizedName"),
            "Other Particulars": getValues("otherParticulars") || "N/A",
          },
        }}
        title="Application Preview - Annexure 2"
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

/* =======================
   UI HELPERS
======================= */

const Stepper = ({ currentStep, onStepClick }) => {
  const steps = [
    { number: 1, title: "Project Details" },
    { number: 2, title: "Production Info" },
    { number: 3, title: "Shooting Specs" },
    { number: 4, title: "Uploads" },
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div
              className="flex flex-col items-center z-10 cursor-pointer"
              onClick={() => onStepClick(step.number)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 ${
                  currentStep === step.number
                    ? "bg-[#891737] border-[#891737] text-white ring-4 ring-[#891737]/10"
                    : currentStep > step.number
                      ? "bg-[#891737] border-[#891737] text-white"
                      : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {currentStep > step.number ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <p
                className={`mt-2 text-xs font-medium tracking-wide uppercase ${
                  currentStep === step.number
                    ? "text-[#891737]"
                    : currentStep > step.number
                      ? "text-[#891737]"
                      : "text-gray-400"
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 md:w-24 h-0.5 -mx-3 mb-6 transition-all duration-300 ${
                  currentStep > step.number ? "bg-[#891737]" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Reusable Layout Components
const Card = ({ title, children }) => (
  <div className="space-y-6 mb-8">
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
        <XCircle size={12} />
        <span>{error.message}</span>
      </div>
    )}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
    {children}
  </div>
);

/* INPUT WRAPPERS */
// Using .form-input classes matching ProducerRegistration style
// Removed onInput regex to prevent crashes

const Alpha = ({ label, name, register, error, placeholder }) => (
  <InputGroup label={label} error={error?.[name]} required>
    <input
      {...register(name)}
      className="form-input"
      placeholder={placeholder || label}
    />
  </InputGroup>
);

const AlphaNum = ({ label, name, register, error, placeholder }) => (
  <InputGroup label={label} error={error?.[name]} required>
    <input
      {...register(name)}
      className="form-input"
      placeholder={placeholder || label}
    />
  </InputGroup>
);

const Mobile = ({ label, name, register, error, placeholder }) => (
  <InputGroup label={label} error={error?.[name]} required>
    <input
      {...register(name)}
      className="form-input"
      placeholder={placeholder || "+91..."}
      maxLength={10}
      inputMode="numeric"
    />
  </InputGroup>
);

const NumberInput = ({ label, name, register, error, placeholder }) => (
  <InputGroup label={label} error={error?.[name]} required>
    <input
      type="number"
      min="0"
      {...register(name)}
      className="form-input"
      placeholder={placeholder || "0"}
    />
  </InputGroup>
);

const Input = ({
  label,
  name,
  register,
  error,
  placeholder,
  type = "text",
}) => (
  <InputGroup label={label} error={error?.[name]} required>
    <input
      type={type}
      {...register(name)}
      className="form-input"
      placeholder={placeholder || label}
    />
  </InputGroup>
);

const YesNo = ({ label, name, register, error }) => (
  <InputGroup label={label} error={error?.[name]} required>
    <select {...register(name)} className="form-select">
      <option value="">Select Option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </InputGroup>
);

const File = ({ label, name, register, error }) => (
  <InputGroup label={label} error={error?.[name]} required>
    <input
      type="file"
      {...register(name)}
      className="block w-full text-base text-gray-600 file:mr-4 file:py-2.5 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#891737] file:text-white hover:file:bg-[#70122d] file:transition-colors cursor-pointer border border-gray-300 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-[#891737]"
    />
  </InputGroup>
);

const Textarea = ({ label, name, register, error, placeholder }) => (
  <InputGroup label={label} error={error?.[name]} required>
    <textarea
      {...register(name)}
      className="form-textarea h-32 resize-none"
      placeholder={placeholder || "Enter details..."}
    />
  </InputGroup>
);

const Styles = () => (
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
);
