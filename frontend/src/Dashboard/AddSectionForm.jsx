import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../Components/axios";
import {
  Loader,
  ChevronDown,
  X,
  User,
  Globe,
  Info,
  Briefcase,
  Check,
  MapPin,
  Calendar,
  Film,
} from "lucide-react";
import AlertBox from "../Components/AlertBox";

const PREDEFINED_ROLES = [
  "Acting",
  "Music",
  "Dance",
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

const PREDEFINED_SPECIALIZATIONS = [
  "Actor/Actress",
  "Anchor",
  "Voice Artist (Dubbing)",
  "Junior Artist",
  "Music Director (Songs)",
  "Music Director (Background)",
  "Arranger",
  "Musician",
  "Singer Male",
  "Singer Female",
  "Choreographer",
  "Assistant Choreographer",
  "Dancer Male",
  "Dancer Female",
  "Group Dancer Male",
  "Group Dancer Female",
  "Line Producer",
  "Production Manager",
  "Production Assistant",
  "Director",
  "Assistant Director",
  "Casting Director",
  "Story Writer",
  "Screenplay Writer",
  "Dialogue Writer",
  "Voice Over Writer",
  "Director of Photography (DOP)",
  "Camera Assistant",
  "Lighting Assistant",
  "Light Man",
  "Sound Designer",
  "Sound Recordist",
  "Effects & Foley Artist",
  "Sound Mixing Master (RR)",
  "Editor",
  "Editing Assistant",
  "Production Designer",
  "Art Director",
  "Art Director Assistant",
  "Costume Designer",
  "Dress Man",
  "Make Up Man",
  "Make Up Assistant",
  "Hair Stylist",
  "Wig Maker",
  "Others",
];

const AddSectionForm = ({
  onClose,
  onProfileCreated,
  artist,
  isCreatingProfile,
}) => {
  const [openSection, setOpenSection] = useState(
    isCreatingProfile ? "contact" : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [aboutUs, setAboutUs] = useState(artist?.description || "");

  // Contact / Basic Info State
  const [contactDetails, setContactDetails] = useState({
    name: artist?.fullName || "",
    email: artist?.email || "",
    phone: artist?.phoneNumber || "",
    address: artist?.address || "",
    gender: artist?.gender || "",
    dob: artist?.dob ? new Date(artist.dob).toISOString().split("T")[0] : "",
    bestFilm: artist?.bestFilm || "",
  });

  // Arrays
  const [professions, setProfessions] = useState(
    artist?.professions?.map((p) => (typeof p === "object" ? p.name : p)) || []
  );
  const [specializations, setSpecializations] = useState(
    artist?.specializations?.map((s) => (typeof s === "object" ? s.name : s)) ||
      []
  );

  // Helpers for Tags
  const [currentProfession, setCurrentProfession] = useState("");
  const [otherProfession, setOtherProfession] = useState(""); // State for manual profession
  const [currentSpecialization, setCurrentSpecialization] = useState("");
  const [otherSpecialization, setOtherSpecialization] = useState(""); // State for manual specialization

  const [socialLinks, setSocialLinks] = useState({
    facebook: artist?.facebook || "",
    instagram: artist?.instagram || "",
    twitter: artist?.twitter || "",
    linkedIn: artist?.linkedIn || "",
    imdb: artist?.imdbLink || "",
  });

  // Experience State
  const [experience, setExperience] = useState({
    filmTitle: "",
    roleInFilm: "",
    durationFrom: "",
    durationTo: "",
    description: "",
    awards: "",
    link: "",
  });

  const [errors, setErrors] = useState({});

  // Alert State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    confirmText: "OK",
  });
  const showAlert = ({ type, title, message, onConfirm }) => {
    setAlertConfig({
      isOpen: true,
      type: type || "info",
      title: title || "",
      message: message || "",
      confirmText: "OK",
      onConfirm: onConfirm || null,
    });
  };
  const closeAlert = () =>
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));

  const validateInput = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!/^[A-Za-z\s]+$/.test(value))
          error = "Name must contain only alphabets";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email address";
        break;
      case "phone":
        if (!/^\d*$/.test(value))
          error = "Phone number must contain only digits";
        else if (value.length !== 10 && value.length !== 12)
          error = "Phone number must be 10 or 12 digits";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleContactChange = (field, value) => {
    setContactDetails((prev) => ({ ...prev, [field]: value }));
    validateInput(field, value);
  };

  // Tag Handlers
  const addTag = (list, setList, value, setCurrent) => {
    if (value && !list.includes(value)) {
      setList((prev) => [...prev, value]);
      setCurrent("");
    }
  };
  const removeTag = (list, setList, index) => {
    setList((prev) => list.filter((_, i) => i !== index));
  };

  // --- API Handlers ---

  // 1. Create Profile
  const handleCreateProfile = async () => {
    setIsLoading(true);
    try {
      if (
        !contactDetails.name ||
        !contactDetails.email ||
        !contactDetails.phone ||
        !contactDetails.dob ||
        !contactDetails.gender ||
        !contactDetails.address
      ) {
        showAlert({
          type: "warning",
          title: "Missing Information",
          message: "Please fill all required contact details.",
        });
        setIsLoading(false);
        return;
      }

      if (professions.length === 0) {
        showAlert({
          type: "warning",
          title: "Missing Information",
          message: "Please add at least one profession.",
        });
        setIsLoading(false);
        return;
      }

      const nameError = validateInput("name", contactDetails.name);
      const emailError = validateInput("email", contactDetails.email);
      const phoneError = validateInput("phone", contactDetails.phone);
      if (nameError || emailError || phoneError) {
        showAlert({
          type: "warning",
          title: "Validation Error",
          message: "Please fix validation errors.",
        });
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("fullName", contactDetails.name);
      formData.append("email", contactDetails.email);
      formData.append("phoneNumber", contactDetails.phone);
      formData.append("address", contactDetails.address);
      formData.append("gender", contactDetails.gender);
      formData.append("dob", contactDetails.dob);
      formData.append("bestFilm", contactDetails.bestFilm);
      formData.append("description", aboutUs || "");

      // Arrays
      formData.append("professions", JSON.stringify(professions));
      formData.append("specializations", JSON.stringify(specializations));
      // Default empty arrays for others if needed, handled by backend usually
      formData.append("videoLinks", JSON.stringify([]));

      // Socials
      if (socialLinks.facebook)
        formData.append("facebook", socialLinks.facebook);
      if (socialLinks.instagram)
        formData.append("instagram", socialLinks.instagram);
      if (socialLinks.twitter) formData.append("twitter", socialLinks.twitter);
      if (socialLinks.linkedin)
        formData.append("linkedIn", socialLinks.linkedin);
      if (socialLinks.imdb) formData.append("imdbLink", socialLinks.imdb);

      // Create default avatar
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#891737";
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = "white";
      ctx.font = "bold 80px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(contactDetails.name.charAt(0).toUpperCase(), 100, 100);

      canvas.toBlob(async (blob) => {
        formData.append("image", blob, "avatar.png");
        await submitProfileCreation(formData);
      });
    } catch (err) {
      console.error("Prep error", err);
      setIsLoading(false);
    }
  };

  const submitProfileCreation = async (formData) => {
    try {
      const response = await api.post("/api/artist/addArtist", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data) {
        showAlert({
          type: "success",
          title: "Success!",
          message: "Artist profile created successfully!",
          onConfirm: () => {
            onProfileCreated(response.data.data);
            onClose();
          },
        });
      }
    } catch (err) {
      showAlert({
        type: "error",
        title: "Creation Failed",
        message: err.response?.data?.message || err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Update Profile
  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("fullName", contactDetails.name);
      data.append("email", contactDetails.email);
      data.append("phoneNumber", contactDetails.phone);
      data.append("address", contactDetails.address);
      data.append("gender", contactDetails.gender);
      data.append("dob", contactDetails.dob);
      data.append("bestFilm", contactDetails.bestFilm);
      data.append("description", aboutUs);

      const originalProfessions = new Set(
        artist.professions?.map((p) => (typeof p === "object" ? p.name : p)) ||
          []
      );
      const newProfessions = professions.filter(
        (p) => !originalProfessions.has(p)
      );
      data.append("professions", JSON.stringify(newProfessions));

      const originalSpecializations = new Set(
        artist.specializations?.map((s) =>
          typeof s === "object" ? s.name : s
        ) || []
      );
      const newSpecializations = specializations.filter(
        (s) => !originalSpecializations.has(s)
      );
      data.append("specializations", JSON.stringify(newSpecializations));

      if (socialLinks.facebook) data.append("facebook", socialLinks.facebook);
      if (socialLinks.instagram)
        data.append("instagram", socialLinks.instagram);
      if (socialLinks.twitter) data.append("twitter", socialLinks.twitter);
      if (socialLinks.linkedin) data.append("linkedIn", socialLinks.linkedin);
      if (socialLinks.imdb) data.append("imdbLink", socialLinks.imdb);

      const response = await api.put("/api/artist/updateMyProfile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        showAlert({
          type: "success",
          title: "Updated!",
          message: "Profile updated successfully!",
          onConfirm: () => {
            onProfileCreated(response.data.data);
            onClose();
          },
        });
      }
    } catch (err) {
      showAlert({
        type: "error",
        title: "Update Failed",
        message: err.response?.data?.message || err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Add Experience - keeping existing separate endpoint logic since it's a specific action in accordion
  const handleAddExperience = async () => {
    setIsLoading(true);
    try {
      if (
        !experience.filmTitle ||
        !experience.roleInFilm ||
        !experience.durationFrom
      ) {
        showAlert({
          type: "warning",
          title: "Missing Info",
          message: "Fill Film Title, Role, and Start Date.",
        });
        setIsLoading(false);
        return;
      }

      // Check if we should use v1 endpoint or existing?
      // User docs didn't specify addExperience endpoint change.
      // Assuming existing /api/artist/addExperience or /api/v1/artist/addExperience.
      // Let's try /api/v1/artist/addExperience just in case, or stick to old one if we are unsure.
      // We will try standard POST to /api/artist/addExperience as before, assuming functionality persists.

      const response = await api.post("/api/artist/addExperience", {
        filmTitle: experience.filmTitle,
        roleInFilm: experience.roleInFilm,
        durationFrom: experience.durationFrom,
        durationTo: experience.durationTo || null,
        description: experience.description,
        awards: experience.awards,
        link: experience.link,
      });

      if (response.status === 200 || response.status === 201) {
        showAlert({
          type: "success",
          title: "Success!",
          message: "Experience added!",
          onConfirm: () => {
            setExperience({
              filmTitle: "",
              roleInFilm: "",
              durationFrom: "",
              durationTo: "",
              description: "",
              awards: "",
              link: "",
            });
            setOpenSection(null);
            // We might need to refresh parent.
            // If we can't refresh parent easily from here without reload, we might need onProfileCreated callback to refetch?
            // Ideally we shouldn't reload page.
            window.location.reload();
          },
        });
      }
    } catch (err) {
      showAlert({
        type: "error",
        title: "Failed",
        message: err.response?.data?.message || "Failed to add experience",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (isCreatingProfile && !artist) {
      if (openSection === "contact") await handleCreateProfile();
      else {
        showAlert({
          type: "warning",
          title: "Incomplete",
          message: "Complete Contact Details first.",
        });
        setOpenSection("contact");
      }
    } else if (artist) {
      if (openSection === "experience") await handleAddExperience();
      else await handleUpdateProfile();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in duration-200">
      <AlertBox {...alertConfig} onClose={closeAlert} />
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {isCreatingProfile ? "Create Artist Profile" : "Update Profile"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isCreatingProfile
                ? "Complete your profile information"
                : "Edit your details"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Warning */}
        {isCreatingProfile && !artist && (
          <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">
              Please fill <strong>Contact & Professional Details</strong> to
              create your profile.
            </p>
          </div>
        )}

        {/* Accordion List */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-3">
          {/* 1. Contact & Basic Info */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() =>
                setOpenSection(openSection === "contact" ? null : "contact")
              }
              className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                openSection === "contact" ? "bg-gray-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {isCreatingProfile
                    ? "Basic Information"
                    : "Update Basic Info"}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  openSection === "contact" ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {openSection === "contact" && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden border-t border-gray-100"
                >
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-gray-500 mb-1 block">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={contactDetails.name}
                          onChange={(e) =>
                            handleContactChange("name", e.target.value)
                          }
                          className="w-full p-2 border rounded-lg text-sm outline-none focus:border-[#891737]"
                          placeholder="Required"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={contactDetails.email}
                          onChange={(e) =>
                            handleContactChange("email", e.target.value)
                          }
                          className="w-full p-2 border rounded-lg text-sm outline-none focus:border-[#891737]"
                          placeholder="Required"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={contactDetails.phone}
                          onChange={(e) =>
                            handleContactChange("phone", e.target.value)
                          }
                          className="w-full p-2 border rounded-lg text-sm outline-none focus:border-[#891737]"
                          placeholder="Required"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">
                          DOB *
                        </label>
                        <input
                          type="date"
                          value={contactDetails.dob}
                          onChange={(e) =>
                            handleContactChange("dob", e.target.value)
                          }
                          className="w-full p-2 border rounded-lg text-sm outline-none focus:border-[#891737]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">
                          Gender *
                        </label>
                        <select
                          value={contactDetails.gender}
                          onChange={(e) =>
                            handleContactChange("gender", e.target.value)
                          }
                          className="w-full p-2 border rounded-lg text-sm outline-none focus:border-[#891737]"
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-gray-500 mb-1 block">
                          Address *
                        </label>
                        <textarea
                          value={contactDetails.address}
                          onChange={(e) =>
                            handleContactChange("address", e.target.value)
                          }
                          rows={2}
                          className="w-full p-2 border rounded-lg text-sm outline-none focus:border-[#891737] resize-none"
                          placeholder="Full Address"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <label className="text-xs font-semibold text-gray-700 mb-2 block uppercase">
                        Professions *
                      </label>
                      <div className="flex gap-2 mb-2">
                        <select
                          value={currentProfession}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "Others") {
                              setCurrentProfession("Others");
                            } else {
                              addTag(
                                professions,
                                setProfessions,
                                val,
                                setCurrentProfession
                              );
                            }
                          }}
                          className="p-2 border rounded-lg text-sm w-full"
                        >
                          <option value="">Add Profession</option>
                          {PREDEFINED_ROLES.map((r) => (
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
                            className="p-2 border rounded-lg text-sm flex-1 outline-none focus:border-[#891737]"
                          />
                          <button
                            onClick={() => {
                              if (otherProfession.trim()) {
                                addTag(
                                  professions,
                                  setProfessions,
                                  otherProfession,
                                  setCurrentProfession
                                );
                                setOtherProfession("");
                                setCurrentProfession("");
                              }
                            }}
                            className="bg-gray-900 text-white px-3 rounded-lg text-xs"
                          >
                            Add
                          </button>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {professions.map((p, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-xs rounded border flex items-center gap-1"
                          >
                            {p}{" "}
                            <button
                              onClick={() =>
                                removeTag(professions, setProfessions, i)
                              }
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="text-xs font-semibold text-gray-700 mb-2 block uppercase">
                        Specializations
                      </label>
                      <div className="flex gap-2 mb-2">
                        <select
                          value={currentSpecialization}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "Others") {
                              setCurrentSpecialization("Others");
                            } else {
                              addTag(
                                specializations,
                                setSpecializations,
                                val,
                                setCurrentSpecialization
                              );
                            }
                          }}
                          className="p-2 border rounded-lg text-sm w-full"
                        >
                          <option value="">Add Specialization</option>
                          {PREDEFINED_SPECIALIZATIONS.map((s) => (
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
                            onChange={(e) =>
                              setOtherSpecialization(e.target.value)
                            }
                            placeholder="Specify Specialization"
                            className="p-2 border rounded-lg text-sm flex-1 outline-none focus:border-[#891737]"
                          />
                          <button
                            onClick={() => {
                              if (otherSpecialization.trim()) {
                                addTag(
                                  specializations,
                                  setSpecializations,
                                  otherSpecialization,
                                  setCurrentSpecialization
                                );
                                setOtherSpecialization("");
                                setCurrentSpecialization("");
                              }
                            }}
                            className="bg-gray-900 text-white px-3 rounded-lg text-xs"
                          >
                            Add
                          </button>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {specializations.map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-xs rounded border flex items-center gap-1"
                          >
                            {s}{" "}
                            <button
                              onClick={() =>
                                removeTag(
                                  specializations,
                                  setSpecializations,
                                  i
                                )
                              }
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-full py-2.5 bg-[#891737] text-white rounded-lg text-sm font-medium hover:bg-[#a01b41] flex justify-center items-center"
                    >
                      {isLoading ? (
                        <Loader className="animate-spin w-4 h-4" />
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" /> Save Basic Info
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Social Media */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() =>
                setOpenSection(openSection === "social" ? null : "social")
              }
              className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                openSection === "social" ? "bg-gray-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Social Media
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  openSection === "social" ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {openSection === "social" && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden border-t border-gray-100"
                >
                  <div className="p-4 space-y-3">
                    {[
                      "facebook",
                      "instagram",
                      "twitter",
                      "linkedin",
                      "imdb",
                    ].map((key) => (
                      <div key={key}>
                        <label className="text-xs font-medium text-gray-500 capitalize mb-1 block">
                          {key}
                        </label>
                        <input
                          type="url"
                          value={socialLinks[key]}
                          onChange={(e) =>
                            setSocialLinks({
                              ...socialLinks,
                              [key]: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded-lg text-sm outline-none focus:border-[#891737]"
                          placeholder="https://..."
                        />
                      </div>
                    ))}
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isLoading}
                      className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm mt-2"
                    >
                      Save Socials
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. About Me */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() =>
                setOpenSection(openSection === "about" ? null : "about")
              }
              className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                openSection === "about" ? "bg-gray-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Info className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  About Me
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  openSection === "about" ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {openSection === "about" && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden border-t border-gray-100"
                >
                  <div className="p-4">
                    <textarea
                      value={aboutUs}
                      onChange={(e) => setAboutUs(e.target.value)}
                      rows={6}
                      className="w-full p-3 border rounded-lg text-sm outline-none focus:border-[#891737] resize-none leading-relaxed"
                      placeholder="Write something about yourself..."
                    />
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isLoading}
                      className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm mt-3"
                    >
                      Save Description
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. Experience (Only if profile exists) */}
          {artist && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() =>
                  setOpenSection(
                    openSection === "experience" ? null : "experience"
                  )
                }
                className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                  openSection === "experience"
                    ? "bg-gray-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    Add Experience{" "}
                    <span className="text-gray-500 text-xs">(Optional)</span>
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    openSection === "experience" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openSection === "experience" && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-gray-100"
                  >
                    <div className="p-4 space-y-3">
                      <input
                        type="text"
                        placeholder="Film Title *"
                        value={experience.filmTitle}
                        onChange={(e) =>
                          setExperience({
                            ...experience,
                            filmTitle: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Role in Film *"
                        value={experience.roleInFilm}
                        onChange={(e) =>
                          setExperience({
                            ...experience,
                            roleInFilm: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-lg text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase">
                            From
                          </label>
                          <input
                            type="date"
                            value={experience.durationFrom}
                            onChange={(e) =>
                              setExperience({
                                ...experience,
                                durationFrom: e.target.value,
                              })
                            }
                            className="w-full p-2 border rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase">
                            To (Optional)
                          </label>
                          <input
                            type="date"
                            value={experience.durationTo}
                            onChange={(e) =>
                              setExperience({
                                ...experience,
                                durationTo: e.target.value,
                              })
                            }
                            className="w-full p-2 border rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <textarea
                        placeholder="Description"
                        rows={2}
                        value={experience.description}
                        onChange={(e) =>
                          setExperience({
                            ...experience,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-lg text-sm resize-none"
                      />
                      <input
                        type="text"
                        placeholder="Awards"
                        value={experience.awards}
                        onChange={(e) =>
                          setExperience({
                            ...experience,
                            awards: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-lg text-sm"
                      />
                      <input
                        type="url"
                        placeholder="Project Link"
                        value={experience.link}
                        onChange={(e) =>
                          setExperience({ ...experience, link: e.target.value })
                        }
                        className="w-full p-2 border rounded-lg text-sm"
                      />

                      <button
                        onClick={handleAddExperience}
                        disabled={isLoading}
                        className="w-full py-2 bg-[#891737] text-white rounded-lg text-sm mt-2"
                      >
                        Add Experience
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSectionForm;
