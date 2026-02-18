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
export const ARTIST_ROLES = ["Acting", "Music", "Dance"];
export const TECHNICIAN_ROLES = [
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

export const PREDEFINED_ROLES = [...ARTIST_ROLES, ...TECHNICIAN_ROLES];

// 1. Role -> Specializations Mapping
export const ROLE_SPECIALIZATIONS = {
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
export const PREDEFINED_SPECIALIZATIONS = [
  ...new Set(Object.values(ROLE_SPECIALIZATIONS).flat()),
  "Others",
];

export const SKELETON_ARTIST = {
  fullName: "Your Name",
  email: "youremail@example.com",
  phoneNumber: "+91 XXXXXXXXXX",
  address: "Your Address",
  gender: "Gender",
  dob: null,
  professions: [],
  specializations: [],
  videoLinks: [],
  galleryImages: [],
  image: null,
  description: "Your bio will appear here once created.",
  facebook: "",
  twitter: "",
  instagram: "",
  linkedIn: "",
  imdbLink: "",
  experiences: [],
};

// ----------------------------------------------------------------------
// HELPER: API Update
// ----------------------------------------------------------------------
export const updateProfile = async (currentArtist, updates) => {
  const data = new FormData();
  const merged = { ...currentArtist, ...updates };

  // Text Fields
  [
    "fullName",
    "dob",
    "phoneNumber",
    "email",
    "gender",
    "address",
    "description",
    "imdbLink",
    "instagram",
    "facebook",
    "twitter",
    "linkedIn",
    "bestFilm", // For Bio Data Link
    "showPhonePublic",
  ].forEach((key) => {
    if (merged[key] !== undefined && merged[key] !== null) {
      data.append(key, merged[key]);
    }
  });

  // JSON Arrays - Flatten to ensure strings
  const cleanProfessions =
    merged.professions?.map((p) => (typeof p === "object" ? p.name : p)) || [];
  const cleanSpecializations =
    merged.specializations?.map((s) => (typeof s === "object" ? s.name : s)) ||
    [];
  const cleanVideoLinks =
    merged.videoLinks?.map((v) =>
      typeof v === "object" ? v.link || v.url : v,
    ) || [];
  const cleanGallery =
    merged.galleryImages?.map((img) =>
      typeof img === "object" ? img.url || img.link : img,
    ) || [];

  data.append("professions", JSON.stringify(cleanProfessions));
  data.append("specializations", JSON.stringify(cleanSpecializations));
  data.append("videoLinks", JSON.stringify(cleanVideoLinks));

  // Gallery Logic: "galleryImages" field now handles BOTH the whitelist of URLs (req.body)
  // and new files (req.files).
  data.append("galleryImages", JSON.stringify(cleanGallery));

  return await api.put("/api/artist/updateMyProfile", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ----------------------------------------------------------------------
// COMPONENT: Video Links Card
// ----------------------------------------------------------------------
export const VideoLinksCard = ({ artist, onUpdate, readOnly = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [links, setLinks] = useState(artist.videoLinks || []);
  const [currentLink, setCurrentLink] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLinks(artist.videoLinks || []);
  }, [artist]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateProfile(artist, { videoLinks: links });
      onUpdate(res.data.data);
      setIsEditing(false);
    } catch (e) {
      alert("Failed to update videos");
    } finally {
      setLoading(false);
    }
  };

  const addLink = () => {
    if (links.length >= 5) {
      alert("You can add up to 5 video links.");
      return;
    }

    if (!currentLink) return;

    // Validate URL
    try {
      new URL(currentLink);
    } catch (_) {
      alert("Please enter a valid URL (must start with http:// or https://)");
      return;
    }

    if (!links.includes(currentLink)) {
      setLinks([...links, currentLink]);
      setCurrentLink("");
    }
  };

  const removeLink = (idx) => {
    setLinks(links.filter((_, i) => i !== idx));
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Manage Videos</h3>
          <button onClick={() => setIsEditing(false)}>
            <X size={16} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              value={currentLink}
              onChange={(e) => setCurrentLink(e.target.value)}
              placeholder="Youtube/Vimeo Link"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-rose-500"
            />
            <button
              type="button"
              onClick={addLink}
              className="px-3 py-2 bg-gray-900 text-white rounded-lg text-xs hover:bg-black transition-colors"
            >
              Add
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {links.map((link, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-50 p-2 rounded text-xs"
              >
                <span className="truncate flex-1">{link}</span>
                <button
                  onClick={() => removeLink(i)}
                  className="text-red-500 p-1"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-2 bg-[#891737] text-white rounded-lg text-sm font-medium mt-2 flex justify-center items-center gap-2"
          >
            {loading && <Loader className="animate-spin w-4 h-4" />} Save Videos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm relative group">
      {!readOnly && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 p-1.5 bg-gray-100 rounded-full text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
        >
          <Pencil size={12} />
        </button>
      )}
      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
        Video Showreels
      </h3>
      {artist.videoLinks && artist.videoLinks.length > 0 ? (
        <div className="space-y-2.5">
          {artist.videoLinks.map((link, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-white hover:shadow-sm border border-gray-100"
            >
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <Film size={14} />
              </div>
              <div className="overflow-hidden min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 truncate">
                  Video {i + 1}
                </p>
                <p className="text-[9px] text-gray-500 truncate">{link}</p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic">No videos added.</p>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// COMPONENT: Bio Data Card (Using bestFilm field)
// ----------------------------------------------------------------------
export const BioDataCard = ({ artist, onUpdate, readOnly = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    // If no new file selected, just close (unless we want to allow deleting?)
    if (!selectedFile) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      // bestFilm field now carries the File object
      const res = await updateProfile(artist, { bestFilm: selectedFile });
      onUpdate(res.data.data);
      setIsEditing(false);
      setSelectedFile(null);
    } catch (e) {
      alert("Failed to update Bio Data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm relative group mt-6">
      {!readOnly && (
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-4 right-4 p-1.5 bg-gray-100 rounded-full text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
        >
          <Pencil size={12} />
        </button>
      )}

      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
        Bio Data
      </h3>

      {/* VIEW MODE */}
      {!isEditing && (
        <>
          {artist.bestFilm ? (
            <div className="flex items-center gap-2">
              <a
                href={artist.bestFilm}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-white hover:shadow-sm border border-gray-100 group/file transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-[#891737] flex items-center justify-center group-hover/file:bg-[#891737] group-hover/file:text-white transition-colors">
                  <ExternalLink size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    View Bio Data
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    Click to open
                  </p>
                </div>
              </a>
              {!readOnly && (
                <button
                  onClick={async () => {
                    if (
                      confirm("Are you sure you want to delete your Bio Data?")
                    ) {
                      setLoading(true);
                      try {
                        // Send empty string to clear the field
                        console.log("Deleting Bio Data...");
                        const res = await updateProfile(artist, {
                          bestFilm: "",
                        });
                        console.log("Delete Response:", res.data);

                        // Explicitly check if backend cleared it. If not, forcing null for UI update.
                        const updatedArtist = res.data.data;
                        if (
                          !updatedArtist.bestFilm ||
                          updatedArtist.bestFilm === ""
                        ) {
                          onUpdate(updatedArtist);
                        } else {
                          // Fallback: If backend sends back the old link, manually clear it for UI
                          console.warn(
                            "Backend didn't clear bestFilm, Forcing UI update.",
                          );
                          onUpdate({ ...updatedArtist, bestFilm: "" });
                        }
                      } catch (e) {
                        console.error("Delete failed", e);
                        alert("Failed to delete Bio Data");
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                  disabled={loading}
                  className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-600 border border-gray-100 transition-colors"
                  title="Delete Bio Data"
                >
                  {loading ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              )}
            </div>
          ) : (
            !readOnly && (
              <div className="flex justify-center">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-medium text-[#891737] hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Bio Data
                </button>
              </div>
            )
          )}
        </>
      )}

      {/* EDIT MODE */}
      {isEditing && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-[#891737]/30 transition-all">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              id="bio-data-upload"
            />
            <label
              htmlFor="bio-data-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#891737] mb-2">
                <Upload size={18} />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {selectedFile ? selectedFile.name : "Click to upload Bio Data"}
              </span>
              <span className="text-[10px] text-gray-400 mt-1">
                PDF, JPG, PNG (Max 5MB)
              </span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setSelectedFile(null);
              }}
              className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !selectedFile}
              className="flex-1 py-2 bg-[#891737] text-white rounded-lg text-xs font-medium hover:bg-[#a01b41] transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader className="animate-spin w-3 h-3" />}
              Upload & Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// COMPONENT: Social Media Card
// ----------------------------------------------------------------------
const getSmartUrl = (platform, value) => {
  if (!value) return "";
  let clean = value.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;

  // If it has domain of the platform, prepend https
  const domains = {
    instagram: "instagram.com",
    facebook: "facebook.com",
    twitter: "twitter.com",
    linkedIn: "linkedin.com",
    imdbLink: "imdb.com",
  };
  if (domains[platform] && clean.includes(domains[platform])) {
    return clean.startsWith("www.") ? `https://${clean}` : `https://${clean}`;
  }

  // Else treat as handle
  const prefixes = {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    twitter: "https://twitter.com/",
    linkedIn: "https://linkedin.com/in/",
    imdbLink: "https://imdb.com/name/",
  };
  return prefixes[platform] ? `${prefixes[platform]}${clean}` : clean;
};

export const SocialMediaCard = ({ artist, onUpdate, readOnly = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [socials, setSocials] = useState({
    facebook: artist.facebook || "",
    twitter: artist.twitter || "",
    instagram: artist.instagram || "",
    linkedIn: artist.linkedIn || "",
    imdbLink: artist.imdbLink || "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSocials({
      facebook: artist.facebook || "",
      twitter: artist.twitter || "",
      instagram: artist.instagram || "",
      linkedIn: artist.linkedIn || "",
      imdbLink: artist.imdbLink || "",
    });
  }, [artist]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const processedSocials = {
        facebook: getSmartUrl("facebook", socials.facebook),
        twitter: getSmartUrl("twitter", socials.twitter),
        instagram: getSmartUrl("instagram", socials.instagram),
        linkedIn: getSmartUrl("linkedIn", socials.linkedIn),
        imdbLink: getSmartUrl("imdbLink", socials.imdbLink),
      };

      const res = await updateProfile(artist, processedSocials);
      onUpdate(res.data.data);
      setIsEditing(false);
    } catch (e) {
      alert("Failed to update social links");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSocials({ ...socials, [e.target.name]: e.target.value });
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-24">
        <div className="flex justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Edit Socials</h3>
          <button onClick={() => setIsEditing(false)}>
            <X size={16} />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: "instagram", icon: FaInstagram, color: "text-pink-600" },
            { name: "facebook", icon: FaFacebookF, color: "text-blue-600" },
            { name: "twitter", icon: FaTwitter, color: "text-blue-400" },
            { name: "linkedIn", icon: FaLinkedinIn, color: "text-blue-700" },
            { name: "imdbLink", icon: FaImdb, color: "text-yellow-600" },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <item.icon className={item.color} />
              <input
                name={item.name}
                value={socials[item.name]}
                onChange={handleChange}
                placeholder={`${item.name} link`}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-rose-500"
              />
            </div>
          ))}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-2 bg-[#891737] text-white rounded-lg text-sm font-medium mt-2 flex justify-center items-center gap-2"
          >
            {loading && <Loader className="animate-spin w-4 h-4" />} Save
            Socials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-24 relative group">
      {!readOnly && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 p-1.5 bg-gray-100 rounded-full text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
        >
          <Pencil size={12} />
        </button>
      )}

      <h3 className="text-sm font-bold text-gray-900 mb-4">Social Media</h3>
      <div className="grid grid-cols-5 gap-2">
        {/* Render Logic - similar to original but using helper map if cleaner, or keep explicitly */}
        {socials.facebook && (
          <a
            href={getSmartUrl("facebook", socials.facebook)}
            target="_blank"
            className="aspect-square rounded-xl bg-[#1877F2]/5 text-[#891737] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all"
          >
            <FaFacebookF size={16} />
          </a>
        )}
        {socials.twitter && (
          <a
            href={getSmartUrl("twitter", socials.twitter)}
            target="_blank"
            className="aspect-square rounded-xl bg-[#1DA1F2]/5 text-[#891737] hover:bg-[#1DA1F2] hover:text-white flex items-center justify-center transition-all"
          >
            <FaTwitter size={16} />
          </a>
        )}
        {socials.instagram && (
          <a
            href={getSmartUrl("instagram", socials.instagram)}
            target="_blank"
            className="aspect-square rounded-xl bg-[#E4405F]/5 text-[#891737] hover:bg-[#E4405F] hover:text-white flex items-center justify-center transition-all"
          >
            <FaInstagram size={16} />
          </a>
        )}
        {socials.linkedIn && (
          <a
            href={getSmartUrl("linkedIn", socials.linkedIn)}
            target="_blank"
            className="aspect-square rounded-xl bg-[#0A66C2]/5 text-[#891737] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-all"
          >
            <FaLinkedinIn size={16} />
          </a>
        )}
        {socials.imdbLink && (
          <a
            href={getSmartUrl("imdbLink", socials.imdbLink)}
            target="_blank"
            className="aspect-square rounded-xl bg-[#F5C518]/10 text-[#891737] hover:bg-[#F5C518] hover:text-white flex items-center justify-center transition-all"
          >
            <FaImdb size={18} />
          </a>
        )}
        {!Object.values(socials).some(Boolean) && (
          <span className="col-span-5 text-xs text-gray-400 italic text-center py-4">
            No social links added
          </span>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// COMPONENT: About Me Card (Bio + Professions + Specializations)
// ----------------------------------------------------------------------
export const AboutMeCard = ({ artist, onUpdate, readOnly = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    description: artist.description || "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      description: artist.description || "",
    });
  }, [artist]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateProfile(artist, formData);
      onUpdate(res.data.data);
      setIsEditing(false);
    } catch (e) {
      alert("Failed to update About Me");
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative">
        <div className="flex justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Edit About Me</h3>
          <button onClick={() => setIsEditing(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Bio / Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#891737]"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-2 bg-[#891737] text-white rounded-lg text-sm font-medium"
          >
            {loading ? "Saving..." : "Save About Me"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative group">
      {!readOnly && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 p-1.5 bg-gray-100 rounded-full text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
        >
          <Pencil size={14} />
        </button>
      )}

      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        About Me
      </h3>
      <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap text-[13px] md:text-sm">
        {artist.description ||
          "No description added yet. Tell people about your journey!"}
      </div>

      {artist.specializations && artist.specializations.length > 0 && (
        <div className="mt-6 pt-5 border-t border-gray-100">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            Specializations & Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {artist.specializations.map((s, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-50 text-gray-700 rounded-lg text-[11px] md:text-xs font-medium border border-gray-100"
              >
                {typeof s === "object" ? s.name : s}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

// ----------------------------------------------------------------------
// COMPONENT: Gallery Card
// ----------------------------------------------------------------------
export const GalleryCard = ({ artist, onUpdate, readOnly = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [existing, setExisting] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure existing are strings (URLs)
    const raw = artist.galleryImages || artist.images || [];
    const clean = raw
      .map((img) => (typeof img === "object" ? img.url || img.link || "" : img))
      .filter(Boolean);
    setExisting(clean);
    setNewFiles([]);
    setPreviews([]);
  }, [artist, artist.galleryImages]); // ✅ Added specific dependency

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (existing.length + newFiles.length + files.length > 5) {
      alert("Max 5 images allowed.");
      return;
    }
    const validFiles = files.filter((f) => validateFile(f).isValid);
    setNewFiles([...newFiles, ...validFiles]);
    setPreviews([
      ...previews,
      ...validFiles.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeExisting = (i) =>
    setExisting(existing.filter((_, idx) => idx !== i));
  const removeNew = (i) => {
    setNewFiles(newFiles.filter((_, idx) => idx !== i));
    setPreviews(previews.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = new FormData();

      // Explicitly clean existing again just in case
      const cleanExisting = existing
        .map((img) => (typeof img === "object" ? img.url || img.link : img))
        .filter(Boolean);

      // Backend expects "galleryImages" to contain the whitelist of URLs to keep
      // If empty, send "[]"
      data.append("galleryImages", JSON.stringify(cleanExisting));
      // Append new files with field name "galleryFiles" (different from the JSON)
      newFiles.forEach((f) => data.append("galleryFiles", f));

      // Append other fields to ensure profile consistency, though ideally backend handles partial updates
      [
        "fullName",
        "dob",
        "phoneNumber",
        "email",
        "gender",
        "address",
        "description",
        "bestFilm",
        "imdbLink",
        "instagram",
        "facebook",
        "twitter",
        "linkedIn",
        "showPhonePublic",
      ].forEach((k) => {
        // Fix: Use !== undefined/null to allow sending empty strings (deletions)
        if (artist[k] !== undefined && artist[k] !== null) {
          data.append(k, artist[k]);
        }
      });

      // Flatten complex arrays
      const cleanProfessions =
        artist.professions?.map((p) => (typeof p === "object" ? p.name : p)) ||
        [];
      const cleanSpecializations =
        artist.specializations?.map((s) =>
          typeof s === "object" ? s.name : s,
        ) || [];
      const cleanVideoLinks =
        artist.videoLinks?.map((v) =>
          typeof v === "object" ? v.link || v.url : v,
        ) || [];

      data.append("professions", JSON.stringify(cleanProfessions));
      data.append("specializations", JSON.stringify(cleanSpecializations));
      data.append("videoLinks", JSON.stringify(cleanVideoLinks));

      const res = await api.put("/api/artist/updateMyProfile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Robust update handling
      if (res.data && res.data.data) {
        alert("Gallery updated successfully!"); // ✅ Added success feedback
        onUpdate(res.data.data);
        // ✅ Clean up local state
        setNewFiles([]);
        setPreviews([]);
      } else {
        // Fallback if backend doesn't return data
        alert("Gallery updated! Refreshing...");
        window.location.reload();
      }
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert("Failed to update gallery");
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Manage Gallery</h3>
          <button onClick={() => setIsEditing(false)}>
            <X size={18} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {existing.map((src, i) => (
            <div
              key={`ex-${i}`}
              className="relative w-20 h-20 flex-shrink-0 group"
            >
              <img
                src={src}
                className="w-full h-full object-cover rounded-lg border border-gray-100"
              />
              <button
                onClick={() => removeExisting(i)}
                className="absolute -top-1.5 -right-1.5 bg-white text-red-500 p-1 rounded-full shadow-md hover:bg-red-50 transition-colors border border-gray-100"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {previews.map((src, i) => (
            <div
              key={`new-${i}`}
              className="relative w-20 h-20 flex-shrink-0 group"
            >
              <img
                src={src}
                className="w-full h-full object-cover rounded-lg border-2 border-[#891737]"
              />
              <button
                onClick={() => removeNew(i)}
                className="absolute -top-1.5 -right-1.5 bg-white text-red-500 p-1 rounded-full shadow-md hover:bg-red-50 transition-colors border border-gray-100"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {existing.length + newFiles.length < 5 && (
            <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <Plus size={20} className="text-gray-400" />
              <span className="text-[10px] text-gray-500 font-medium mt-1">
                Add Photo
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-2.5 bg-[#891737] text-white rounded-lg text-sm font-medium hover:bg-[#a01b41] transition-colors flex justify-center items-center gap-2 shadow-lg shadow-[#891737]/20"
        >
          {loading && <Loader className="animate-spin w-4 h-4" />} Save Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative group">
      {!readOnly && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full text-gray-500 hover:text-[#891737] hover:bg-[#891737]/5 transition-all opacity-0 group-hover:opacity-100"
        >
          <Pencil size={14} />
        </button>
      )}
      <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
        Gallery
      </h3>

      {artist.galleryImages && artist.galleryImages.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {/* Display only first 5 or so if needed, but here we show all */}
          {artist.galleryImages.map((img, i) => {
            const src = typeof img === "object" ? img.url || img.link : img;
            return (
              <div
                key={i}
                className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img
                  src={src}
                  className="w-full h-full object-cover"
                  alt={`Gallery ${i}`}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <IconImage className="text-gray-400" size={18} />
          </div>
          <p className="text-xs text-gray-500 font-medium">
            No photos added yet.
          </p>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// COMPONENT: Experience Card
// ----------------------------------------------------------------------
export const ExperienceCard = ({ artist, onUpdate, readOnly = false }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newExp, setNewExp] = useState({
    filmTitle: "",
    roleInFilm: "",
    durationFrom: "",
    durationTo: "",
    description: "",
    awards: "",
    link: "",
  });

  const handleChange = (e) =>
    setNewExp({ ...newExp, [e.target.name]: e.target.value });

  /* ----------------------------------------------------------------------
   * EDIT & DELETE Handlers
   * ---------------------------------------------------------------------- */
  const handleDeleteExperience = async (indexToDelete) => {
    if (!window.confirm("Are you sure you want to delete this experience?"))
      return;

    const expToDelete = artist.experiences[indexToDelete];
    console.log("Attempting to delete experience:", expToDelete);

    // Safety check for ID (handle both _id and id)
    const expId = expToDelete._id || expToDelete.id;

    if (!expId) {
      console.error("Experience ID missing in object:", expToDelete);
      alert("Experience ID missing. Cannot identify which item to delete.");
      return;
    }

    setLoading(true);
    try {
      // Attempt direct delete endpoint
      await api.delete(`/api/artist/deleteExperience/${expId}`);

      // If successful, update local state
      const updatedExperiences = artist.experiences.filter(
        (_, i) => i !== indexToDelete,
      );
      onUpdate({ ...artist, experiences: updatedExperiences });
    } catch (e) {
      console.error("Delete failed:", e);
      // Try fallback endpoint if 404?
      if (e.response && e.response.status === 404) {
        try {
          await api.post("/api/artist/deleteExperience", { id: expId });
          const updatedExperiences = artist.experiences.filter(
            (_, i) => i !== indexToDelete,
          );
          onUpdate({ ...artist, experiences: updatedExperiences });
          return;
        } catch (e2) {
          console.error("Fallback delete failed:", e2);
        }
      }
      alert("Failed to delete experience. Backend support might be missing.");
    } finally {
      setLoading(false);
    }
  };

  const [editingIndex, setEditingIndex] = useState(null);

  const handleEditClick = (index, exp) => {
    console.log("Editing experience:", exp);
    setNewExp({
      filmTitle: exp.filmTitle || "",
      roleInFilm: exp.roleInFilm || "",
      durationFrom: exp.durationFrom
        ? new Date(exp.durationFrom).toISOString().split("T")[0]
        : "",
      durationTo: exp.durationTo
        ? new Date(exp.durationTo).toISOString().split("T")[0]
        : "",
      description: exp.description || "",
      awards: exp.awards || "",
      link: exp.link || "",
    });
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleSaveCommon = async () => {
    if (!newExp.filmTitle || !newExp.roleInFilm || !newExp.durationFrom) {
      alert("Please fill required fields (Title, Role, Start Date)");
      return;
    }

    if (newExp.durationTo && newExp.durationFrom > newExp.durationTo) {
      alert("Start date cannot be after end date");
      return;
    }
    setLoading(true);

    try {
      // Format Dates to ISO-8601 (YYYY-MM-DDTHH:mm:ss.sssZ) for Prisma
      const payload = {
        ...newExp,
        durationFrom: newExp.durationFrom
          ? new Date(newExp.durationFrom).toISOString()
          : null,
        durationTo: newExp.durationTo
          ? new Date(newExp.durationTo).toISOString()
          : null,
      };

      // If Adding New
      if (editingIndex === null) {
        await api.post("/api/artist/addExperience", payload);

        // ✅ Re-fetch the profile to get the latest experiences
        const refreshRes = await api.get(
          "/api/artist/myProfileWithExperiences",
        );
        if (refreshRes.data && refreshRes.data.data) {
          onUpdate(refreshRes.data.data);
        } else {
          // Fallback
          window.location.reload();
        }
      }
      // If Editing Existing
      else {
        const expToUpdate = artist.experiences[editingIndex];
        console.log("Attempting to update experience:", expToUpdate);
        const expId = expToUpdate._id || expToUpdate.id;

        if (!expId) {
          console.error("Experience ID missing in object:", expToUpdate);
          alert("Experience ID missing. Cannot update.");
          setLoading(false);
          return;
        }

        // Attempt direct UPDATE endpoint
        await api.put(`/api/artist/updateExperience/${expId}`, payload);

        // ✅ Re-fetch the profile to get the latest experiences
        const refreshRes = await api.get(
          "/api/artist/myProfileWithExperiences",
        );
        if (refreshRes.data && refreshRes.data.data) {
          onUpdate(refreshRes.data.data);
        } else {
          // Fallback manual update if response is weird but success
          const updatedList = [...artist.experiences];
          updatedList[editingIndex] = {
            ...expToUpdate,
            ...newExp,
            durationTo: newExp.durationTo || null,
          };
          onUpdate({ ...artist, experiences: updatedList });
        }
      }

      setIsAdding(false);
      setEditingIndex(null);
      setNewExp({
        filmTitle: "",
        roleInFilm: "",
        durationFrom: "",
        durationTo: "",
        description: "",
        awards: "",
        link: "",
      });
    } catch (e) {
      console.error(e);
      alert("Failed to save experience. Backend support might be missing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          Experience
        </h3>
        {!isAdding && !readOnly && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
          >
            <Plus size={14} /> Add position
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-8 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">
                Film / Project *
              </label>
              <input
                name="filmTitle"
                value={newExp.filmTitle}
                onChange={handleChange}
                placeholder="Ex: The Dark Knight"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Role in Project *
                </label>
                <input
                  name="roleInFilm"
                  value={newExp.roleInFilm}
                  onChange={handleChange}
                  placeholder="Ex: Lead Actor"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Role Category
                </label>
                <input
                  disabled // Placeholder or could be a select if needed
                  value={artist.professions?.[0] || "Artist"}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="durationFrom"
                  value={newExp.durationFrom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  End Date
                </label>
                <input
                  type="date"
                  name="durationTo"
                  value={newExp.durationTo}
                  min={newExp.durationFrom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">
                Description
              </label>
              <textarea
                name="description"
                value={newExp.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe your responsibilities, achievements, etc."
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">
                Awards / Recognition
              </label>
              <input
                name="awards"
                value={newExp.awards}
                onChange={handleChange}
                placeholder="Ex: Best Actor, National Award"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingIndex(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCommon}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              {loading && <Loader className="animate-spin w-3 h-3" />}{" "}
              {editingIndex !== null ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}

      {artist.experiences && artist.experiences.length > 0 ? (
        <div className="space-y-6">
          {artist.experiences.map((exp, i) => (
            <div
              key={i}
              className="group relative pl-4 border-l-2 border-gray-100 last:border-transparent pb-6 last:pb-0"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white ring-1 ring-gray-100 group-hover:bg-gray-900 group-hover:ring-gray-200 transition-all"></div>

              {/* ACTION BUTTONS (Edit/Delete) */}
              {!readOnly && (
                <div className="absolute right-0 top-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => handleEditClick(i, exp)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit Experience"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteExperience(i)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Experience"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <div>
                  <h4 className="text-base font-bold text-gray-900 leading-snug">
                    {exp.roleInFilm}
                  </h4>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">
                    {exp.filmTitle}
                    {exp.role && (
                      <span className="text-gray-400 font-normal">
                        {" "}
                        · {exp.role}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    {new Date(exp.durationFrom).getFullYear()} -{" "}
                    {exp.durationTo
                      ? new Date(exp.durationTo).getFullYear()
                      : "Present"}
                    {/* Calculate duration roughly if needed, for simplicity date range is fine */}
                  </p>
                </div>
              </div>

              {exp.description && (
                <p className="text-sm text-gray-600 mt-3 leading-relaxed max-w-2xl">
                  {exp.description}
                </p>
              )}

              {/* Awards - Subtle Text Tag */}
              {exp.awards && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <div className="inline-flex items-center text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                    {exp.awards}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !isAdding && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Briefcase className="text-gray-400" size={20} />
            </div>
            <h4 className="text-sm font-semibold text-gray-900">
              No experience added
            </h4>
            <p className="text-xs text-gray-500 max-w-[200px] mt-1">
              Add your film projects and roles to showcase your career journey.
            </p>
          </div>
        )
      )}
    </section>
  );
};

// ✅ helpers for requested changes
const MAX_PHONE_DIGITS = 12;

const getMaxDobDate = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 8); // must be at least 8 years old
  return d.toISOString().split("T")[0]; // yyyy-mm-dd
};

const calcAge = (yyyy_mm_dd) => {
  if (!yyyy_mm_dd) return null;
  const dob = new Date(yyyy_mm_dd);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

// NOTE: validateFile must exist in your project as you already used it.
export const EditProfileModal = ({
  artist,
  onClose,
  onUpdate,
  isCreating = false,
}) => {
  // If creating, artist might be SKELETON_ARTIST or empty manually handled
  // We use SKELETON_ARTIST as base if provided, else defaults below.
  const base = isCreating ? {} : artist || {};

  const [formData, setFormData] = useState({
    fullName: base.fullName || "",
    email: base.email || "",
    phoneNumber: base.phoneNumber || "",
    gender: base.gender || "",
    dob: base.dob ? new Date(base.dob).toISOString().split("T")[0] : "",
    address: base.address || "",
    showPhonePublic:
      base.showPhonePublic === true || base.showPhonePublic === "true",
    image: null,
    professions:
      base.professions?.map((p) => (typeof p === "object" ? p.name : p)) || [],
    specializations:
      base.specializations?.map((s) => (typeof s === "object" ? s.name : s)) ||
      [],
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentProfession, setCurrentProfession] = useState("");
  const [otherProfession, setOtherProfession] = useState("");
  const [currentSpecialization, setCurrentSpecialization] = useState("");
  const [otherSpecialization, setOtherSpecialization] = useState("");

  // For edit mode, we show existing image. For create, it starts null.
  const [previewImage, setPreviewImage] = useState(base.image || null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Pre-fill Logic for Creation Mode
  useEffect(() => {
    const fetchAuthDetails = async () => {
      if (isCreating) {
        setIsLoadingAuth(true);
        try {
          // Fetch user details from auth API
          const res = await api.get("/api/auth/me");
          if (res.data && res.data.user) {
            setFormData((prev) => ({
              ...prev,
              fullName: res.data.user.name || prev.fullName,
              email: res.data.user.email || prev.email,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch auth details", error);
        } finally {
          setIsLoadingAuth(false);
        }
      }
    };
    fetchAuthDetails();
  }, [isCreating]);

  // Determine initial category
  useEffect(() => {
    if (!selectedCategory && formData.professions.length > 0) {
      const hasArtist = formData.professions.some((p) =>
        ARTIST_ROLES.includes(p),
      );
      if (hasArtist) setSelectedCategory("Artist");
      else {
        const hasTech = formData.professions.some((p) =>
          TECHNICIAN_ROLES.includes(p),
        );
        if (hasTech) setSelectedCategory("Technician");
      }
    }
  }, [formData.professions]);

  const availableSpecializations = React.useMemo(() => {
    if (!formData.professions.length) return PREDEFINED_SPECIALIZATIONS;
    const relevant = formData.professions.flatMap(
      (p) => ROLE_SPECIALIZATIONS[p] || [],
    );
    return relevant.length > 0 ? [...new Set(relevant), "Others"] : ["Others"];
  }, [formData.professions]);

  const addTag = (field, val, list, setter) => {
    if (val && !list.includes(val))
      setter((prev) => ({ ...prev, [field]: [...list, val] }));
  };
  const removeTag = (field, idx) => {
    const list = formData[field];
    setFormData((prev) => ({
      ...prev,
      [field]: list.filter((_, i) => i !== idx),
    }));
  };

  // ✅ changed: phone number max 12 digits + numeric only
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const digitsOnly = String(value)
        .replace(/\D/g, "")
        .slice(0, MAX_PHONE_DIGITS);
      setFormData((prev) => ({ ...prev, phoneNumber: digitsOnly }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file);
      if (validation.isValid) {
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
    e.target.value = "";
  };

  const handleCropComplete = (croppedBlob) => {
    setFormData((prev) => ({ ...prev, image: croppedBlob }));
    setPreviewImage(URL.createObjectURL(croppedBlob));
    setShowCropper(false);
    setTempImageSrc(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImageSrc(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ✅ DOB validation: must be >= 8 years
    const age = calcAge(formData.dob);
    if (age !== null && age < 8) {
      alert("Age must be at least 8 years.");
      setIsSubmitting(false);
      return;
    }

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.dob ||
      !formData.gender ||
      !formData.address
    ) {
      alert(
        "Please fill all required fields (Name, Email, Phone, DOB, Gender, Address).",
      );
      setIsSubmitting(false);
      return;
    }

    // ✅ Phone validation: max 12 digits
    if (
      String(formData.phoneNumber).replace(/\D/g, "").length > MAX_PHONE_DIGITS
    ) {
      alert("Phone number should not exceed 12 digits.");
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === "image") {
          // Check if image is a file (blob) before appending, or if it's new
          if (val instanceof Blob || val instanceof File) {
            data.append("image", val);
          }
        } else if (val !== undefined && val !== null && val !== "") {
          if (key === "professions" || key === "specializations") {
            // Arrays are handled separately below to ensure correct format if needed,
            // but formData already has them as arrays.
            // We need to match updateProfile logic which stringifies them.
            // However, looking at updateProfile, it appends them as JSON strings.
            // Let's check how the backend expects them for creating/updating.
            // updateProfile does: data.append("professions", JSON.stringify(cleanProfessions));
            // standard append handles string conversion, but we probably want JSON.stringify for arrays.
            // Actually, we should probably skip appending them here in the loop
            // and handle them explicitly like in updateProfile helper if we want consistency.
            // But let's check the existing code. `updateProfile` helper handles it.
            // Here we are manually building FormData.
            // We should use JSON.stringify for these arrays.
          } else {
            data.append(key, val);
          }
        }
      });

      // Explicitly append arrays as JSON strings
      data.append("professions", JSON.stringify(formData.professions));
      data.append("specializations", JSON.stringify(formData.specializations));

      // Debugging: Log what's being sent
      console.log("📤 Submitting Profile Update:");
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }

      if (!isCreating) {
        const cleanProfessions =
          base.professions?.map((p) => (typeof p === "object" ? p.name : p)) ||
          [];
        const cleanSpecializations =
          base.specializations?.map((s) =>
            typeof s === "object" ? s.name : s,
          ) || [];
        const cleanVideoLinks =
          base.videoLinks?.map((v) =>
            typeof v === "object" ? v.link || v.url : v,
          ) || [];
        const cleanGallery =
          base.galleryImages?.map((img) =>
            typeof img === "object" ? img.url || img.link : img,
          ) || [];

        data.append("professions", JSON.stringify(cleanProfessions));
        data.append("specializations", JSON.stringify(cleanSpecializations));
        data.append("videoLinks", JSON.stringify(cleanVideoLinks));
        data.append("existingGalleryImages", JSON.stringify(cleanGallery));
      }

      let res;
      if (isCreating) {
        res = await api.post("/api/artist/addArtist", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.put("/api/artist/updateMyProfile", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onUpdate(res.data.data);
      onClose();
    } catch (error) {
      console.error("Save error", error);
      alert(error.response?.data?.message || "Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isCreating ? "Create Profile" : "Edit Profile"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isCreating
                ? "Fill in your details to get started"
                : "Update your personal and professional details"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto custom-scrollbar"
        >
          <div className="p-6 space-y-6">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                  <img
                    src={previewImage || "/placeholderProfile.jpg"}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 p-1.5 bg-[#891737] text-white rounded-full cursor-pointer hover:bg-[#a01b41] transition-colors shadow-sm">
                  <Pencil size={12} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                {isCreating
                  ? "Upload a profile picture"
                  : "Click pencil to change photo"}
              </p>
            </div>

            {/* Cropper Modal Overlay */}
            {showCropper && tempImageSrc && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
                <div className="bg-white p-4 rounded-xl w-full max-w-md">
                  <ImageCropper
                    imageSrc={tempImageSrc}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                    aspect={1}
                  />
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Basic Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#891737]"
                      placeholder="Required"
                    />
                    {isLoadingAuth && isCreating && (
                      <Loader className="absolute right-2 top-2.5 w-4 h-4 animate-spin text-gray-400" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#891737]"
                      placeholder="Required"
                    />
                    {isLoadingAuth && isCreating && (
                      <Loader className="absolute right-2 top-2.5 w-4 h-4 animate-spin text-gray-400" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone *
                  </label>
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={MAX_PHONE_DIGITS}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#891737]"
                    placeholder="Required"
                  />

                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-xs text-gray-500">
                      Would you like to show your phone number publicly?
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="showPhonePublic"
                          checked={formData.showPhonePublic === true}
                          onChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              showPhonePublic: true,
                            }))
                          }
                          className="text-[#891737] focus:ring-[#891737]"
                        />
                        <span className="text-xs text-gray-700">Yes</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="showPhonePublic"
                          checked={formData.showPhonePublic === false}
                          onChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              showPhonePublic: false,
                            }))
                          }
                          className="text-[#891737] focus:ring-[#891737]"
                        />
                        <span className="text-xs text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* ✅ DOB: calendar max date = today-8y and show age */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    DOB *
                  </label>

                  <div className="flex items-center gap-3">
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      max={getMaxDobDate()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#891737]"
                    />

                    {formData.dob && (
                      <span className="text-xs text-gray-600 whitespace-nowrap">
                        Age:{" "}
                        <span className="font-semibold">
                          {calcAge(formData.dob)}
                        </span>
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-500 mt-1">
                    Minimum age: 8 years
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#891737]"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Professions & Specializations */}
                <div className="md:col-span-2 space-y-4 border-t border-gray-100 pt-4 mt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profession / Role *
                    </label>
                    <div className="flex gap-4 mb-3">
                      {["Artist", "Technician"].map((cat) => (
                        <label
                          key={cat}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            checked={selectedCategory === cat}
                            onChange={() => {
                              setSelectedCategory(cat);
                              setCurrentProfession("");
                            }}
                            className="text-[#891737] focus:ring-[#891737]"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="flex gap-2 mb-2">
                      <select
                        value={currentProfession}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "Others") setCurrentProfession("Others");
                          else {
                            addTag(
                              "professions",
                              val,
                              formData.professions,
                              setFormData,
                            );
                            setCurrentProfession("");
                          }
                        }}
                        disabled={!selectedCategory}
                        className="p-2 border border-gray-300 rounded-lg text-sm flex-1 outline-none focus:border-[#891737]"
                      >
                        <option value="">Select Profession</option>
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
                      {currentProfession === "Others" && (
                        <div className="flex gap-2 flex-1">
                          <input
                            value={otherProfession}
                            onChange={(e) => setOtherProfession(e.target.value)}
                            placeholder="Specify"
                            className="p-2 border border-gray-300 rounded-lg text-sm w-full outline-none focus:border-[#891737]"
                          />
                          <button
                            onClick={() => {
                              addTag(
                                "professions",
                                otherProfession,
                                formData.professions,
                                setFormData,
                              );
                              setOtherProfession("");
                              setCurrentProfession("");
                            }}
                            type="button"
                            className="bg-black text-white px-3 rounded-lg text-xs hover:bg-gray-800 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.professions.map((p, i) => (
                        <span
                          key={i}
                          className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border border-rose-100"
                        >
                          {p}{" "}
                          <button
                            type="button"
                            onClick={() => removeTag("professions", i)}
                            className="hover:text-rose-900"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specializations *
                    </label>
                    <div className="flex gap-2 mb-2">
                      <select
                        value={currentSpecialization}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "Others")
                            setCurrentSpecialization("Others");
                          else {
                            addTag(
                              "specializations",
                              val,
                              formData.specializations,
                              setFormData,
                            );
                            setCurrentSpecialization("");
                          }
                        }}
                        disabled={!formData.professions.length}
                        className="p-2 border border-gray-300 rounded-lg text-sm flex-1 outline-none focus:border-[#891737]"
                      >
                        <option value="">Select Specialization</option>
                        {availableSpecializations.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {currentSpecialization === "Others" && (
                        <div className="flex gap-2 flex-1">
                          <input
                            value={otherSpecialization}
                            onChange={(e) =>
                              setOtherSpecialization(e.target.value)
                            }
                            placeholder="Specify"
                            className="p-2 border border-gray-300 rounded-lg text-sm w-full outline-none focus:border-[#891737]"
                          />
                          <button
                            onClick={() => {
                              addTag(
                                "specializations",
                                otherSpecialization,
                                formData.specializations,
                                setFormData,
                              );
                              setOtherSpecialization("");
                              setCurrentSpecialization("");
                            }}
                            type="button"
                            className="bg-black text-white px-3 rounded-lg text-xs hover:bg-gray-800 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.specializations.map((s, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border border-gray-200"
                        >
                          {s}{" "}
                          <button
                            type="button"
                            onClick={() => removeTag("specializations", i)}
                            className="hover:text-gray-900"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#891737]"
                    placeholder="Full Address with Pin Code"
                  />
                </div>
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
                  <Loader className="w-4 h-4 animate-spin" />{" "}
                  {isCreating ? "Creating..." : "Saving..."}
                </>
              ) : isCreating ? (
                "Create Profile"
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

const normalizeList = (list) =>
  list?.map((item) =>
    typeof item === "object" ? item.name || item.link || item.url || "" : item,
  ) || [];
