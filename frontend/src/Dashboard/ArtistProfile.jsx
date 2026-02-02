import React, { useState, useEffect } from "react";
import {
  Pencil,
  Loader,
  AlertCircle,
  Trash2,
  X,
  Plus,
  Upload,
  Film,
  MapPin,
  Mail,
  Phone,
  Calendar,
  User,
  Briefcase,
  ExternalLink,
  Image as IconImage,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaImdb,
} from "react-icons/fa";
import AlertBox from "../Components/AlertBox";
import api from "../Components/axios";
import { validateFile } from "../utils/fileValidation";
import AddSectionForm from "./AddSectionForm";
import ImageCropper from "../Components/ImageCropper";

// Role Definitions
const ARTIST_ROLES = ["Acting", "Music", "Dance"];
const TECHNICIAN_ROLES = [
  "Production",
  "Direction",
  "Writing",
  "Cinematography",
  "Sound",
  "Editing",
  "Production Designing",
  "Costume",
  "Make-up",
  "DI Colourist",
  "Others",
];

const PREDEFINED_ROLES = [...ARTIST_ROLES, ...TECHNICIAN_ROLES];

// 1. Role -> Specializations Mapping
const ROLE_SPECIALIZATIONS = {
  // Artist Roles
  Acting: [
    "Actor/Actress",
    "Anchor",
    "Voice Artist (Dubbing)",
    "Junior Artist",
  ],
  Music: [
    "Music Director (Songs)",
    "Music Director (Background)",
    "Arranger",
    "Musician",
    "Singer Male",
    "Singer Female",
  ],
  Dance: [
    "Choreographer",
    "Assistant Choreographer",
    "Dancer Male",
    "Dancer Female",
    "Group Dancer Male",
    "Group Dancer Female",
  ],

  // Technician Roles
  Production: ["Line Producer", "Production Manager", "Production Assistant"],
  Direction: ["Director", "Assistant Director", "Casting Director"],
  Writing: [
    "Story Writer",
    "Screenplay Writer",
    "Dialogue Writer",
    "Voice Over Writer",
  ],
  Cinematography: [
    "Director of Photography (DOP)",
    "Camera Assistant",
    "Lighting Assistant",
    "Light Man",
  ],
  Sound: [
    "Sound Designer",
    "Sound Recordist",
    "Effects & Foley Artist",
    "Sound Mixing Master (RR)",
  ],
  Editing: ["Editor", "Editing Assistant"],
  "Production Designing": [
    "Production Designer",
    "Art Director",
    "Art Director Assistant",
  ],
  Costume: ["Costume Designer", "Dress Man"],
  "Make-up": ["Make Up Man", "Make Up Assistant", "Hair Stylist", "Wig Maker"],
  "DI Colourist": [], // No specific specs provided, fallback to Others
  Others: [],
};

// Flatten for fallback or validation if needed, though we primarily filter now
const PREDEFINED_SPECIALIZATIONS = [
  ...new Set(Object.values(ROLE_SPECIALIZATIONS).flat()),
  "Others",
];

const EditProfileModal = ({ artist, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: artist.fullName || "",
    email: artist.email || "",
    phoneNumber: artist.phoneNumber || "",
    address: artist.address || "",
    gender: artist.gender || "",
    dob: artist.dob ? new Date(artist.dob).toISOString().split("T")[0] : "",
    professions:
      artist.professions?.map((p) => (typeof p === "object" ? p.name : p)) ||
      [],
    specializations:
      artist.specializations?.map((s) =>
        typeof s === "object" ? s.name : s,
      ) || [],
    videoLinks: artist.videoLinks || [],
    description: artist.description || "",
    bestFilm: artist.bestFilm || "",
    imdbLink: artist.imdbLink || "",
    instagram: artist.instagram || "",
    facebook: artist.facebook || "",
    twitter: artist.twitter || "",
    linkedIn: artist.linkedIn || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(artist.image || null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);

  // Gallery
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState(
    artist.galleryImages || [],
  );

  // Experience State - we will allow adding experiences only via this simplistic form or separate calls?
  // For now, let's keep it simple: Basic Profile updates + Gallery.
  // Experiences are usually complex to edit in a massive modal.
  // We can let the main page handle experience add/delete/edit if needed, or include basic flow here.
  // Given the complexity, let's focus on Profile Fields first.

  const [currentProfession, setCurrentProfession] = useState("");
  const [otherProfession, setOtherProfession] = useState("");

  // Category Selection State
  // Determine initial category based on existing professions if possible, or default to empty
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (artist.professions && artist.professions.length > 0) {
      // Check if any profession matches Artist Roles
      const hasArtistRole = artist.professions.some((p) => {
        const name = typeof p === "object" ? p.name : p;
        return ARTIST_ROLES.includes(name);
      });
      if (hasArtistRole) return "Artist";

      // Check if any profession matches Technician Roles
      const hasTechRole = artist.professions.some((p) => {
        const name = typeof p === "object" ? p.name : p;
        return TECHNICIAN_ROLES.includes(name);
      });
      if (hasTechRole) return "Technician";
    }
    return "";
  });

  const [currentSpecialization, setCurrentSpecialization] = useState("");
  const [otherSpecialization, setOtherSpecialization] = useState("");
  const [currentVideoLink, setCurrentVideoLink] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Specializations Calculation
  const availableSpecializations = React.useMemo(() => {
    // If no professions selected, show all (or could show none)
    if (!formData.professions || formData.professions.length === 0) {
      return PREDEFINED_SPECIALIZATIONS;
    }

    // Filter specs based on selected professions
    const relevantSpecs = formData.professions.flatMap(
      (prof) => ROLE_SPECIALIZATIONS[prof] || [],
    );

    // If we have relevant specs, return unique list + Others
    if (relevantSpecs.length > 0) {
      return [...new Set(relevantSpecs), "Others"];
    }

    return ["Others"];
  }, [formData.professions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file);
      if (validation.isValid) {
        // Start cropping flow
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setTempImageSrc(reader.result);
          setShowCropper(true);
        });
        reader.readAsDataURL(file);
      } else {
        alert(validation.error);
      }
    }
    // Reset input value to allow re-selecting same file
    e.target.value = "";
  };

  const handleCropComplete = (croppedBlob) => {
    setImageFile(croppedBlob);
    setPreviewImage(URL.createObjectURL(croppedBlob));
    setShowCropper(false);
    setTempImageSrc(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImageSrc(null);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + galleryImages.length + existingGallery.length > 5) {
      alert("Max 5 images allowed in gallery.");
      return;
    }

    const newFiles = [];
    const newPreviews = [];
    files.forEach((file) => {
      if (validateFile(file).isValid) {
        newFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      }
    });
    setGalleryImages((prev) => [...prev, ...newFiles]);
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryImage = (index) => {
    setExistingGallery((prev) => prev.filter((_, i) => i !== index));
  };

  // Tag Helpers
  const addTag = (type, value, setter, currentSetter) => {
    if (type === "videoLinks" && formData[type].length >= 5) {
      alert("Max 5 video links allowed.");
      return;
    }
    if (value && !formData[type].includes(value)) {
      setFormData((prev) => ({ ...prev, [type]: [...prev[type], value] }));
      currentSetter("");
    }
  };
  const removeTag = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      // Basic
      data.append("fullName", formData.fullName);
      data.append("dob", formData.dob);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("email", formData.email);
      data.append("gender", formData.gender);
      data.append("address", formData.address);
      data.append("description", formData.description);
      data.append("bestFilm", formData.bestFilm);

      // Social
      if (formData.imdbLink) data.append("imdbLink", formData.imdbLink);
      if (formData.instagram) data.append("instagram", formData.instagram);
      if (formData.facebook) data.append("facebook", formData.facebook);
      if (formData.twitter) data.append("twitter", formData.twitter);
      if (formData.linkedIn) data.append("linkedIn", formData.linkedIn);

      // Arrays - Send full list (Backend handles replacement)
      data.append("professions", JSON.stringify(formData.professions));
      data.append("specializations", JSON.stringify(formData.specializations));
      data.append("videoLinks", JSON.stringify(formData.videoLinks));

      // Image
      if (imageFile) data.append("image", imageFile);

      // Gallery
      // Send existing gallery images (to keep)
      data.append("existingGalleryImages", JSON.stringify(existingGallery));
      // Send new files
      galleryImages.forEach((file) => data.append("galleryImages", file));

      const response = await api.put("/api/artist/updateMyProfile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        onUpdate(response.data.data);
        onClose();
      }
    } catch (error) {
      console.error("Update error:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed  inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      {showCropper && tempImageSrc && (
        <ImageCropper
          imageSrc={tempImageSrc}
          aspect={1}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
            {/* Image */}
            <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <img
                  src={previewImage || "/placeholderProfile.jpg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-900">
                  Profile Photo
                </label>
                <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium shadow-sm transition-colors">
                  <Upload className="w-4 h-4 mr-2" /> Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Basic Info Grid */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] outline-none resize-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Bio / Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#891737] outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Arrays */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Professional Details
              </h4>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Professions
                  </label>

                  {/* Category Selection */}
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value="Artist"
                        checked={selectedCategory === "Artist"}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setCurrentProfession(""); // Reset profession selection on category change
                        }}
                        className="w-4 h-4 text-[#891737] focus:ring-[#891737]"
                      />
                      <span className="text-sm text-gray-700">Artist</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value="Technician"
                        checked={selectedCategory === "Technician"}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setCurrentProfession("");
                        }}
                        className="w-4 h-4 text-[#891737] focus:ring-[#891737]"
                      />
                      <span className="text-sm text-gray-700">Technician</span>
                    </label>
                  </div>

                  <div className="flex gap-2 mb-2">
                    <select
                      value={currentProfession}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) return;

                        if (val === "Others") {
                          setCurrentProfession("Others");
                        } else {
                          // Add the specific profession
                          addTag(
                            "professions",
                            val,
                            setCurrentProfession,
                            setCurrentProfession,
                          );

                          // Also add the Category tag (Artist/Technician) if not present
                          if (
                            selectedCategory &&
                            !formData.professions.includes(selectedCategory)
                          ) {
                            setFormData((prev) => ({
                              ...prev,
                              professions: [
                                ...prev.professions,
                                selectedCategory,
                              ],
                            }));
                          }
                        }
                      }}
                      disabled={!selectedCategory}
                      className={`px-3 py-2.5 border border-gray-200 rounded-lg text-sm flex-1 focus:ring-2 focus:ring-[#891737] outline-none ${
                        !selectedCategory
                          ? "bg-gray-100 cursor-not-allowed"
                          : "bg-white"
                      }`}
                    >
                      <option value="">
                        {!selectedCategory
                          ? "Select Category First"
                          : `Select ${selectedCategory} Profession`}
                      </option>

                      {selectedCategory === "Artist" &&
                        ARTIST_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}

                      {selectedCategory === "Technician" &&
                        TECHNICIAN_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                    </select>
                  </div>
                  {currentProfession === "Others" && (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={otherProfession}
                        onChange={(e) => setOtherProfession(e.target.value)}
                        placeholder="Specify Profession"
                        className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm flex-1 focus:ring-2 focus:ring-[#891737] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (otherProfession.trim()) {
                            addTag(
                              "professions",
                              otherProfession,
                              setCurrentProfession,
                              setCurrentProfession,
                            );
                            setOtherProfession("");
                            setCurrentProfession("");
                          }
                        }}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-black"
                      >
                        Add
                      </button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {formData.professions.map((p, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 rounded-full text-xs flex items-center gap-1 border border-gray-200"
                      >
                        {p}{" "}
                        <button
                          type="button"
                          onClick={() => removeTag("professions", i)}
                        >
                          <X size={12} className="hover:text-red-500" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Specializations
                  </label>
                  <div className="flex gap-2 mb-2">
                    <select
                      value={currentSpecialization}
                      onChange={(e) => {
                        const isProfessionsSelected =
                          formData.professions &&
                          formData.professions.length > 0;

                        const val = e.target.value;
                        if (val === "Others") {
                          setCurrentSpecialization("Others");
                        } else {
                          addTag(
                            "specializations",
                            val,
                            setCurrentSpecialization,
                            setCurrentSpecialization,
                          );
                        }
                      }}
                      disabled={
                        !formData.professions ||
                        formData.professions.length === 0
                      }
                      className={`px-3 py-2.5 border border-gray-200 rounded-lg text-sm flex-1 focus:ring-2 focus:ring-[#891737] outline-none ${
                        !formData.professions ||
                        formData.professions.length === 0
                          ? "bg-gray-100 cursor-not-allowed"
                          : "bg-white"
                      }`}
                    >
                      <option value="">
                        {formData.professions && formData.professions.length > 0
                          ? "Select Specialization"
                          : "Select Profession First"}
                      </option>
                      {availableSpecializations.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  {currentSpecialization === "Others" && (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={otherSpecialization}
                        onChange={(e) => setOtherSpecialization(e.target.value)}
                        placeholder="Specify Specialization"
                        className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm flex-1 focus:ring-2 focus:ring-[#891737] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (otherSpecialization.trim()) {
                            addTag(
                              "specializations",
                              otherSpecialization,
                              setCurrentSpecialization,
                              setCurrentSpecialization,
                            );
                            setOtherSpecialization("");
                            setCurrentSpecialization("");
                          }
                        }}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-black"
                      >
                        Add
                      </button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {formData.specializations.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 rounded-full text-xs flex items-center gap-1 border border-gray-200"
                      >
                        {s}{" "}
                        <button
                          type="button"
                          onClick={() => removeTag("specializations", i)}
                        >
                          <X size={12} className="hover:text-red-500" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Video Links
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={currentVideoLink}
                      onChange={(e) => setCurrentVideoLink(e.target.value)}
                      placeholder="https://..."
                      className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm flex-1 focus:ring-2 focus:ring-[#891737] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        addTag(
                          "videoLinks",
                          currentVideoLink,
                          setCurrentVideoLink,
                          setCurrentVideoLink,
                        )
                      }
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-black"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {formData.videoLinks.map((l, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded-lg border border-gray-100"
                      >
                        <span className="truncate">{l}</span>
                        <button
                          type="button"
                          onClick={() => removeTag("videoLinks", i)}
                          className="text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Upload */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Gallery Images
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                Add new images to your gallery (Max 5 total).
              </p>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {/* Existing Images */}
                {existingGallery.map((src, i) => (
                  <div
                    key={`existing-${i}`}
                    className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 group"
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover"
                      alt="Existing Gallery"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingGalleryImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}

                {/* New Previews */}
                {galleryPreviews.map((src, i) => (
                  <div
                    key={`new-${i}`}
                    className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 group"
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover"
                      alt="New Gallery"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewGalleryImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}

                <label className="flex-shrink-0 w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#891737] hover:bg-gray-50 transition-colors">
                  <Plus className="text-gray-400 mb-1" />
                  <span className="text-[10px] text-gray-500">Add Image</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 flex-shrink-0 z-10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-[#891737] rounded-lg hover:bg-[#a01b41] transition-colors flex items-center gap-2 shadow-lg shadow-[#891737]/20"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const normalizeArtistData = (data) => ({
  ...data,
  professions: data.professions || [],
  specializations: data.specializations || [],
  // Map videos -> videoLinks
  videoLinks:
    data.videos?.map((v) => (typeof v === "object" ? v.link || v.url : v)) ||
    data.videoLinks ||
    [],
  // Map images -> galleryImages
  galleryImages:
    data.images?.map((img) =>
      typeof img === "object" ? img.url || img.link : img,
    ) ||
    data.galleryImages ||
    [],
});

const ArtistProfile = () => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddSectionForm, setshowAddSectionForm] = useState(false);
  const [bannerImage, setBannerImage] = useState("/newBannerArtist.jpg");

  // Alert State
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });
  const showAlert = (type, title, message) =>
    setAlertState({ isOpen: true, type, title, message });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/artist/myProfileWithExperiences");
      const data = res.data.data;
      setArtist(normalizeArtistData(data));
    } catch (error) {
      console.error("Fetch error", error);
      // Silent fail or show simple message
    } finally {
      setLoading(false);
    }
  };

  const handleProfileCreated = (newArtist) => {
    setArtist(normalizeArtistData(newArtist));
    setshowAddSectionForm(false);
    showAlert("success", "Welcome!", "Profile created successfully.");
  };

  const handleUpdate = (updatedArtist) => {
    setArtist(normalizeArtistData(updatedArtist));
    showAlert("success", "Success", "Profile updated successfully!");
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin text-[#891737] w-8 h-8" />
      </div>
    );

  if (!artist) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-blue-50 p-8 rounded-2xl max-w-md mx-4">
          <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Setup Your Profile
          </h3>
          <p className="text-blue-600/80 mb-6 text-sm">
            Complete your artist profile to get showcased and start connecting.
          </p>
          <button
            onClick={() => setshowAddSectionForm(true)}
            className="bg-[#891737] text-white px-6 py-2.5 rounded-xl hover:bg-[#a92b4e] transition-all shadow-lg shadow-[#891737]/20 font-medium"
          >
            + Create Artist Profile
          </button>

          {showAddSectionForm && (
            <AddSectionForm
              onClose={() => setshowAddSectionForm(false)}
              onProfileCreated={handleProfileCreated}
              isCreatingProfile={true}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
      <AlertBox
        {...alertState}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Hero / Banner Section - Reduced Height */}
      <div className="relative h-48 md:h-64 w-full overflow-hidden group rounded-2xl">
        <div className="absolute inset-0 bg-gray-900">
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-16 md:-mt-20">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="p-5 md:p-6">
            <div className="flex flex-col md:flex-row gap-5 md:items-end">
              {/* Profile Image - Reduced Size */}
              <div className="relative -mt-12 md:-mt-16 self-center md:self-auto">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[4px] border-white shadow-xl overflow-hidden bg-gray-100 ring-1 ring-gray-100">
                  <img
                    src={artist.image || "/placeholderProfile.jpg"}
                    alt={artist.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Name & Basic Info - More Compact */}
              <div className="flex-1 text-center md:text-left space-y-1.5">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  {artist.fullName}
                </h1>

                {/* Profession Tags */}
                <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                  {artist.professions && artist.professions.length > 0 ? (
                    artist.professions.map((p, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 bg-[#891737]/5 text-[#891737] border border-[#891737]/10 rounded-full text-[7px] md:text-[7px] font-semibold uppercase"
                      >
                        {typeof p === "object" ? p.name : p}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs italic">
                      Add your profession
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-center md:justify-end pb-1">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-all shadow-md shadow-gray-900/20 font-medium text-xs md:text-sm group"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Quick Stats Grid - More Compact */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-100/80">
              <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="p-2 bg-gray-50 rounded-lg text-[#891737]">
                  <Mail size={14} />
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                    Email
                  </p>

                  <p
                    className="text-sm font-medium text-gray-900 truncate"
                    title={artist.email}
                  >
                    {artist.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="p-2 bg-gray-50 rounded-lg text-[#891737]">
                  <Phone size={14} />
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                    Phone
                  </p>
                  <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                    {artist.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="p-2 bg-gray-50 rounded-lg text-[#891737]">
                  <MapPin size={14} />
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                    Location
                  </p>
                  <p
                    className="text-xs md:text-sm font-medium text-gray-900 truncate"
                    title={artist.address}
                  >
                    {artist.address || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="p-2 bg-gray-50 rounded-lg text-[#891737]">
                  <User size={14} />
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                    Gender & Date of Birth
                  </p>
                  <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                    {artist.gender}{" "}
                    {artist.dob &&
                      ` • ${new Date(artist.dob).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout - Tighter Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (Main Info) */}
          <div className="lg:col-span-8 space-y-6">
            {/* About Section */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative overflow-hidden">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                About Me
              </h3>
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap text-[13px] md:text-sm">
                {artist.description ||
                  "No description added yet. Tell people about your journey!"}
              </div>

              {/* Specializations Tags */}
              {artist.specializations && artist.specializations.length > 0 && (
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Specializations & Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {artist.specializations.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-50 text-gray-700 rounded-lg text-[11px] md:text-xs font-medium border border-gray-100 hover:bg-gray-100 transition-colors cursor-default"
                      >
                        {typeof s === "object" ? s.name : s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Experience Section */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  Experience
                </h3>
                <button
                  onClick={() => setshowAddSectionForm(true)}
                  className="text-xs font-semibold text-[#891737] hover:bg-[#891737]/5 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Add Experience
                </button>
              </div>

              {artist.experiences && artist.experiences.length > 0 ? (
                <div className="relative space-y-0">
                  <div className="absolute left-[15px] top-2 bottom-2 w-[1.5px] bg-gray-100"></div>
                  {artist.experiences.map((exp, i) => (
                    <div
                      key={i}
                      className="relative pl-10 pb-8 last:pb-0 group"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-0 top-1 w-8 h-8 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-white border-2 border-[#891737] rounded-full z-10 group-hover:scale-110 transition-transform shadow-sm"></div>
                      </div>

                      <div className="bg-gray-50/50 hover:bg-gray-50 p-4 rounded-xl border border-transparent hover:border-gray-200 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm md:text-base font-bold text-gray-900 leading-tight">
                            {exp.filmTitle}
                          </h4>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 text-gray-600 whitespace-nowrap border border-gray-200">
                            <Calendar size={10} className="mr-1" />
                            {new Date(exp.durationFrom).getFullYear()} -{" "}
                            {exp.durationTo
                              ? new Date(exp.durationTo).getFullYear()
                              : "Present"}
                          </span>
                        </div>
                        <p className="text-[#891737] font-semibold text-xs md:text-sm mb-2">
                          {exp.roleInFilm}{" "}
                          <span className="text-gray-400 font-normal mx-1">
                            •
                          </span>{" "}
                          <span className="text-gray-500 font-medium">
                            {exp.role}
                          </span>
                        </p>

                        {exp.description && (
                          <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-3">
                            {exp.description}
                          </p>
                        )}

                        {exp.awards && (
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100 w-fit">
                            <span className="text-sm">🏆</span> {exp.awards}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Briefcase className="text-gray-400" size={18} />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    No experience added yet.
                  </p>
                </div>
              )}
            </section>

            {/* Gallery Section */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                Gallery
              </h3>

              {artist.galleryImages && artist.galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {artist.galleryImages.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100 relative group cursor-pointer"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${i}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <IconImage className="text-gray-400" size={18} />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    Your gallery is empty.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Showreel / Video Links */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                Video
              </h3>
              {artist.videoLinks && artist.videoLinks.length > 0 ? (
                <div className="space-y-2.5">
                  {artist.videoLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-white hover:shadow-sm transition-all border border-gray-100 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform border border-red-100">
                        <Film size={16} />
                      </div>
                      <div className="overflow-hidden min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#891737] transition-colors">
                          Watch Video {i + 1}
                        </p>
                        <p className="text-[9px] text-gray-500 truncate mt-0.5">
                          {link}
                        </p>
                      </div>
                      <div className="text-gray-300 group-hover:text-[#891737] px-1">
                        <ExternalLink size={12} />
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  No video links added.
                </p>
              )}
            </div>

            {/* Social Connect */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-24">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <p> Social Media </p>
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {artist.facebook && (
                  <a
                    href={artist.facebook}
                    target="_blank"
                    className="aspect-square rounded-xl bg-[#1877F2]/5 text-[#891737] hover:bg-[#1877F2] hover:text-white transition-all flex flex-col items-center justify-center gap-1 group border border-transparent hover:shadow-md hover:shadow-[#1877F2]/20"
                    title="Facebook"
                  >
                    <FaFacebookF
                      size={16}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </a>
                )}
                {artist.twitter && (
                  <a
                    href={artist.twitter}
                    target="_blank"
                    className="aspect-square rounded-xl bg-[#1DA1F2]/5 text-[#891737] hover:bg-[#1DA1F2] hover:text-white transition-all flex flex-col items-center justify-center gap-1 group border border-transparent hover:shadow-md hover:shadow-[#1DA1F2]/20"
                    title="Twitter"
                  >
                    <FaTwitter
                      size={16}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </a>
                )}
                {artist.instagram && (
                  <a
                    href={artist.instagram}
                    target="_blank"
                    className="aspect-square rounded-xl bg-[#E4405F]/5 text-[#891737] hover:bg-[#E4405F] hover:text-white transition-all flex flex-col items-center justify-center gap-1 group border border-transparent hover:shadow-md hover:shadow-[#E4405F]/20"
                    title="Instagram"
                  >
                    <FaInstagram
                      size={16}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </a>
                )}
                {artist.linkedIn && (
                  <a
                    href={artist.linkedIn}
                    target="_blank"
                    className="aspect-square rounded-xl bg-[#0A66C2]/5 text-[#891737] hover:bg-[#0A66C2] hover:text-white transition-all flex flex-col items-center justify-center gap-1 group border border-transparent hover:shadow-md hover:shadow-[#0A66C2]/20"
                    title="LinkedIn"
                  >
                    <FaLinkedinIn
                      size={16}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </a>
                )}
                {artist.imdbLink && (
                  <a
                    href={artist.imdbLink}
                    target="_blank"
                    className="aspect-square rounded-xl bg-[#F5C518]/10 text-[#891737] hover:bg-[#F5C518] hover:text-black transition-all flex flex-col items-center justify-center gap-1 group border border-transparent hover:shadow-md hover:shadow-[#F5C518]/20"
                    title="IMDb"
                  >
                    <FaImdb
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          artist={artist}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdate}
        />
      )}

      {showAddSectionForm && (
        <AddSectionForm
          onClose={() => setshowAddSectionForm(false)}
          onProfileCreated={handleProfileCreated}
          artist={artist}
          isCreatingProfile={false}
        />
      )}
    </div>
  );
};

export default ArtistProfile;
