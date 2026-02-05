import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Film,
  FileText,
  Upload,
  Link as LinkIcon,
  Check,
  Plus,
  Trash2,
  Calendar,
  Play,
} from "lucide-react";
import api from "../Components/axios";
import AlertBox from "../Components/AlertBox";
import { validateFile } from "../utils/fileValidation";
import UniversalPreviewModal from "./UniversalPreviewModal";

// Bihar Districts Data
const BIHAR_DISTRICTS = [
  { name: "Araria", code: "ARA" },
  { name: "Arwal", code: "ARW" },
  { name: "Aurangabad", code: "AUR" },
  { name: "Banka", code: "BAN" },
  { name: "Begusarai", code: "BEG" },
  { name: "Bhagalpur", code: "BHA" },
  { name: "Bhojpur", code: "BHO" },
  { name: "Buxar", code: "BUX" },
  { name: "Darbhanga", code: "DAR" },
  { name: "East Champaran", code: "ECH" },
  { name: "Gaya", code: "GAY" },
  { name: "Gopalganj", code: "GOP" },
  { name: "Jamui", code: "JAM" },
  { name: "Jehanabad", code: "JEH" },
  { name: "Kaimur", code: "KAI" },
  { name: "Katihar", code: "KAT" },
  { name: "Khagaria", code: "KHA" },
  { name: "Kishanganj", code: "KIS" },
  { name: "Lakhisarai", code: "LAK" },
  { name: "Madhepura", code: "MAD" },
  { name: "Madhubani", code: "MDB" },
  { name: "Munger", code: "MUN" },
  { name: "Muzaffarpur", code: "MUZ" },
  { name: "Nalanda", code: "NAL" },
  { name: "Nawada", code: "NAW" },
  { name: "Patna", code: "PAT" },
  { name: "Purnia", code: "PUR" },
  { name: "Rohtas", code: "ROH" },
  { name: "Saharsa", code: "SAH" },
  { name: "Samastipur", code: "SAM" },
  { name: "Saran", code: "SAR" },
  { name: "Sheikhpura", code: "SHE" },
  { name: "Sheohar", code: "SHR" },
  { name: "Sitamarhi", code: "SIT" },
  { name: "Siwan", code: "SIW" },
  { name: "Supaul", code: "SUP" },
  { name: "Vaishali", code: "VAI" },
  { name: "West Champaran", code: "WCH" },
];

const PREDEFINED_ROLES = [
  { value: "actor", label: "Actor / Actress" },
  { value: "singer", label: "Singer" },
  { value: "composer", label: "Composer" },
  { value: "musician", label: "Musician" },
  { value: "director", label: "Director" },
  { value: "producer", label: "Producer" },
  { value: "dancer", label: "Dancer" },
  { value: "stunt", label: "Stunt / Action Artist" },
  { value: "writer", label: "Writer / Script" },
  { value: "editor", label: "Editor" },
  { value: "cinematographer", label: "Cinematographer" },
];

const AddArtistForm = ({ onClose, isEditMode = false, initialData = null }) => {
  const [previewImage, setPreviewImage] = useState(
    isEditMode ? initialData?.image : null,
  );
  const [imageFile, setImageFile] = useState(null);

  // Basic Fields
  const [formData, setFormData] = useState({
    fullName: isEditMode ? initialData?.fullName || "" : "",
    emailId: isEditMode ? initialData?.emailId || initialData?.email || "" : "",
    phoneNumber: isEditMode ? initialData?.phoneNumber || "" : "",
    address: isEditMode ? initialData?.address || "" : "",
    district: isEditMode ? initialData?.district || "" : "",
  });

  // Experiences State
  const [experiences, setExperiences] = useState(() => {
    if (isEditMode && initialData?.experiences) {
      if (typeof initialData.experiences === "string") {
        try {
          return JSON.parse(initialData.experiences);
        } catch (e) {
          console.error("Failed to parse experiences", e);
          return [];
        }
      }
      return initialData.experiences;
    }
    return [];
  });
  const [showExpForm, setShowExpForm] = useState(false);
  const [currentExp, setCurrentExp] = useState({
    role: "",
    filmTitle: "",
    roleInFilm: "",
    durationFrom: "",
    durationTo: "",
    imdbLink: "",
    link: "", // General link/video link
    description: "",
  });

  const [showPreview, setShowPreview] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Alert State
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    emailId: "",
  });

  // Experience Validation State
  const [expErrors, setExpErrors] = useState({
    imdbLink: "",
    link: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        setAlertState({
          isOpen: true,
          type: "error",
          title: "Validation Error",
          message: validation.error,
        });
        e.target.value = null;
        return;
      }

      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          error = "Only text allowed (no numbers or special characters).";
        }
        break;
      case "phoneNumber":
        if (!/^\d*$/.test(value)) {
          error = "Only numbers allowed.";
        } else if (
          value.length > 0 &&
          value.length !== 10 &&
          value.length !== 12
        ) {
          error = "Phone number must be either 10 or 12 digits.";
        }
        break;
      case "emailId":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          error = "Please enter a valid email address.";
        }
        break;
      // Experience link validation
      case "imdbLink":
      case "link":
        if (value && !value.startsWith("https://")) {
          error = "URL must start with https://";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Limit phone number to 12 digits
    if (name === "phoneNumber" && value.length > 12) {
      return;
    }

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExpChange = (e) => {
    const { name, value } = e.target;

    if (name === "imdbLink" || name === "link") {
      const error = validateField(name, value);
      setExpErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }

    setCurrentExp((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addExperience = () => {
    // Check for validation errors in experience form
    if (Object.values(expErrors).some((err) => err)) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "Please fix the URL errors in the experience form.",
      });
      return;
    }

    // Basic validation for experience
    if (!currentExp.role || !currentExp.filmTitle) {
      setAlertState({
        isOpen: true,
        type: "warning",
        title: "Missing Info",
        message: "Role and Film Title are required for an experience entry.",
      });
      return;
    }

    setExperiences((prev) => [...prev, currentExp]);
    setCurrentExp({
      role: "",
      filmTitle: "",
      roleInFilm: "",
      durationFrom: "",
      durationTo: "",
      imdbLink: "",
      link: "",
      description: "",
    });
    // Reset errors
    setExpErrors({ imdbLink: "", link: "" });
    setShowExpForm(false);
  };

  const removeExperience = (index) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    // Check for existing validation errors
    if (Object.values(errors).some((err) => err)) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "Please fix the errors in the form before submitting.",
      });
      return false;
    }

    if (!formData.fullName.trim()) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Missing Field",
        message: "Full Name is required",
      });
      return false;
    }
    if (!formData.emailId.trim()) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Missing Field",
        message: "Email is required",
      });
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Missing Field",
        message: "Phone number is required",
      });
      return false;
    }
    if (!formData.address.trim()) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Missing Field",
        message: "Address is required",
      });
      return false;
    }
    if (!imageFile) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Missing Field",
        message: "Artist photo is required",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowPreview(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const data = new FormData();

      data.append("image", imageFile);
      data.append("fullName", formData.fullName.trim());
      data.append("phoneNumber", formData.phoneNumber.trim());
      data.append("emailId", formData.emailId.trim());

      let finalAddress = formData.address.trim();
      if (formData.district) {
        finalAddress += `, ${formData.district}`;
      }
      data.append("address", finalAddress);

      if (experiences.length > 0) {
        const formattedExperiences = experiences.map((exp) => ({
          role: exp.role,
          description: exp.description,
          imdbLink: exp.imdbLink,
          filmTitle: exp.filmTitle,
          roleInFilm: exp.roleInFilm,
          durationFrom: exp.durationFrom
            ? new Date(exp.durationFrom).toISOString()
            : null,
          durationTo: exp.durationTo
            ? new Date(exp.durationTo).toISOString()
            : null,
          link: exp.link,
        }));

        data.append("experiences", JSON.stringify(formattedExperiences));
      } else {
        data.append("experiences", JSON.stringify([]));
      }

      const url = isEditMode
        ? `/api/admin/artist/updateArtist/${initialData.id}`
        : "/api/admin/artist/addArtist";
      const method = isEditMode ? "put" : "post";

      const response = await api[method](url, data);

      if (response.data) {
        setAlertState({
          isOpen: true,
          type: "success",
          title: "Success",
          message: isEditMode
            ? "Artist updated successfully!"
            : "Artist registered successfully!",
          onConfirm: () => {
            setShowPreview(false);
            if (onClose) onClose();
          },
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setShowPreview(false); // Close modal on error
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Registration Failed",
        message:
          error.response?.data?.message ||
          error.message ||
          "An error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-10 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transform scale-100 transition-all flex flex-col max-h-[90vh]">
          {/* Modal Header */}
          <div className="px-8 py-10 border-b border-gray-100 flex items-center justify-between bg-gray-50 flex-shrink-0">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {isEditMode ? "Edit Artist Profile" : "Add New Artist"}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Fill in the details to register an artist.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="p-8 overflow-y-auto custom-scrollbar flex-grow">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Row */}
              <div className="flex items-start gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="relative group shrink-0">
                  {previewImage ? (
                    <div className="w-24 h-24 rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
                      <img
                        src={previewImage}
                        alt="Artist View"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg border border-dashed border-gray-300 flex items-center justify-center bg-white group-hover:border-[#891737] transition-colors">
                      <User className="w-8 h-8 text-gray-300 group-hover:text-[#891737]" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">
                    Artist Photo <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Upload a professional headshot. JPEG or PNG, max 5MB.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="artist-photo-upload"
                  />
                  <label
                    htmlFor="artist-photo-upload"
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium shadow-sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photo
                  </label>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              {/* Basic Information */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                          errors.fullName ? "border-red-500" : "border-gray-200"
                        } rounded-lg text-sm focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all placeholder:text-gray-300`}
                        placeholder="e.g. Michael Scott"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="emailId"
                        value={formData.emailId}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                          errors.emailId ? "border-red-500" : "border-gray-200"
                        } rounded-lg text-sm focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all placeholder:text-gray-300`}
                        placeholder="artist@example.com"
                      />
                    </div>
                    {errors.emailId && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.emailId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                          errors.phoneNumber
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded-lg text-sm focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all placeholder:text-gray-300`}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all placeholder:text-gray-300 resize-none"
                        placeholder="Complete physical address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      District (Reference)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] focus:border-transparent outline-none transition-all appearance-none"
                      >
                        <option value="">Select District</option>
                        {BIHAR_DISTRICTS.map((dist) => (
                          <option key={dist.code} value={dist.name}>
                            {dist.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              {/* Experiences / Professional Info */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Experiences & Credits
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowExpForm(true)}
                    className="inline-flex items-center px-3 py-1.5 bg-[#891737]/10 text-[#891737] rounded-lg hover:bg-[#891737]/20 transition-colors text-xs font-medium border border-[#891737]/20"
                  >
                    <Plus className="w-3 h-3 mr-1.5" />
                    Add Experience
                  </button>
                </div>

                {/* Experience List */}
                {experiences.length > 0 && (
                  <div className="space-y-3 mb-5">
                    {experiences.map((exp, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-xl border border-gray-100 group relative"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-semibold text-gray-900 text-sm">
                              {exp.filmTitle}
                            </h5>
                            <p className="text-xs text-gray-500">
                              {exp.role} • {exp.roleInFilm}
                            </p>
                            {(exp.durationFrom || exp.durationTo) && (
                              <p className="text-[10px] text-gray-400 mt-1">
                                {exp.durationFrom} - {exp.durationTo}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Experience Sub-Form */}
                {showExpForm && (
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="text-sm font-semibold text-gray-900">
                        New Experience Entry
                      </h5>
                      <button
                        onClick={() => setShowExpForm(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Role Type *
                        </label>
                        <div className="relative">
                          <Film className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <select
                            name="role"
                            value={currentExp.role}
                            onChange={handleExpChange}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#891737] focus:border-[#891737] outline-none appearance-none"
                          >
                            <option value="">Select Role</option>
                            {PREDEFINED_ROLES.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Film Title *
                        </label>
                        <input
                          type="text"
                          name="filmTitle"
                          value={currentExp.filmTitle}
                          onChange={handleExpChange}
                          placeholder="Name of the project"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#891737] focus:border-[#891737] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Role In Film
                        </label>
                        <input
                          type="text"
                          name="roleInFilm"
                          value={currentExp.roleInFilm}
                          onChange={handleExpChange}
                          placeholder="e.g. Protagonist, Editor"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#891737] focus:border-[#891737] outline-none"
                        />
                      </div>

                      {/* Dates */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          From
                        </label>
                        <input
                          type="date"
                          name="durationFrom"
                          value={currentExp.durationFrom}
                          onChange={handleExpChange}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#891737] focus:border-[#891737] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          To
                        </label>
                        <input
                          type="date"
                          name="durationTo"
                          value={currentExp.durationTo}
                          onChange={handleExpChange}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#891737] focus:border-[#891737] outline-none"
                        />
                      </div>

                      {/* Links */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          IMDb Link
                        </label>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                          <input
                            type="url"
                            name="imdbLink"
                            value={currentExp.imdbLink}
                            onChange={handleExpChange}
                            placeholder="https://imdb.com/..."
                            className={`w-full pl-9 pr-3 py-2 bg-white border ${
                              expErrors.imdbLink
                                ? "border-red-500"
                                : "border-gray-200"
                            } rounded-lg text-sm focus:ring-1 focus:ring-[#891737] focus:border-[#891737] outline-none`}
                          />
                        </div>
                        {expErrors.imdbLink && (
                          <p className="text-xs text-red-500 mt-1">
                            {expErrors.imdbLink}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Video/Project Link
                        </label>
                        <div className="relative">
                          <Play className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                          <input
                            type="url"
                            name="link"
                            value={currentExp.link}
                            onChange={handleExpChange}
                            placeholder="https://youtube.com/..."
                            className={`w-full pl-9 pr-3 py-2 bg-white border ${
                              expErrors.link
                                ? "border-red-500"
                                : "border-gray-200"
                            } rounded-lg text-sm focus:ring-1 focus:ring-[#891737] focus:border-[#891737] outline-none`}
                          />
                        </div>
                        {expErrors.link && (
                          <p className="text-xs text-red-500 mt-1">
                            {expErrors.link}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={currentExp.description}
                          onChange={handleExpChange}
                          rows={2}
                          placeholder="Details about this experience..."
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#891737] focus:border-[#891737] outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => setShowExpForm(false)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={addExperience}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 hover:bg-black rounded-lg transition-colors"
                      >
                        Add Entry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:border-gray-400 hover:shadow-sm transition-all text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#891737] text-white rounded-lg hover:bg-[#891737]/90 hover:shadow-lg hover:shadow-[#891737]/20 transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Artist"}
              {!isSubmitting && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <AlertBox
          isOpen={alertState.isOpen}
          type={alertState.type}
          title={alertState.title}
          message={alertState.message}
          onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={alertState.onConfirm}
        />
      </div>
      <UniversalPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleFinalSubmit}
        title="FILMMAKER REGISTRATION PREVIEW"
        isSubmitting={isSubmitting}
        data={{
          PersonalDetails: {
            FullName: formData.fullName,
            Email: formData.emailId,
            Phone: formData.phoneNumber,
            Address: formData.address,
            District: formData.district,
            Photo: imageFile ? imageFile.name : "Not Uploaded",
          },
          ...experiences.reduce(
            (acc, exp, i) => ({
              ...acc,
              [`Experience ${i + 1}`]: {
                Role: exp.role,
                Film: exp.filmTitle,
                RoleInFilm: exp.roleInFilm,
                Duration: `${exp.durationFrom || ""} - ${exp.durationTo || ""}`,
                IMDb: exp.imdbLink,
                Link: exp.link,
              },
            }),
            {},
          ),
        }}
      />
    </>
  );
};

export default AddArtistForm;
