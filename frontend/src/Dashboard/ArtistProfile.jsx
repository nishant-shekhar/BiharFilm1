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

import {
  SKELETON_ARTIST,
  VideoLinksCard,
  SocialMediaCard,
  AboutMeCard,
  GalleryCard,
  ExperienceCard,
  EditProfileModal,
  updateProfile,
  BioDataCard,
} from "./ArtistProfileComponents";

const normalizeList = (list) =>
  list?.map((item) =>
    typeof item === "object" ? item.name || item.link || item.url || "" : item,
  ) || [];

const normalizeArtistData = (data) => ({
  ...data,
  professions: normalizeList(data.professions),
  specializations: normalizeList(data.specializations),
  videoLinks: normalizeList(data.videos || data.videoLinks),
  galleryImages: normalizeList(data.images || data.galleryImages),
});

// ----------------------------------------------------------------------
// HELPER: Age Calculation
// ----------------------------------------------------------------------
const calculateAge = (dob) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

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

  // Use skeleton if no artist data
  const displayArtist = artist || SKELETON_ARTIST;
  const isNewUser = !artist;

  return (
    <div className="min-h-screen  pb-20 font-sans">
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
                    src={displayArtist.image || "/placeholderProfile.jpg"}
                    alt={displayArtist.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Name & Basic Info - More Compact */}
              <div className="flex-1 text-center md:text-left space-y-1.5">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  {displayArtist.fullName}
                </h1>

                {/* Profession Tags */}
                <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                  {displayArtist.professions &&
                  displayArtist.professions.length > 0 ? (
                    displayArtist.professions.map((p, i) => (
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
                  {isNewUser ? (
                    <>
                      <Plus size={16} /> Create Artist Profile
                    </>
                  ) : (
                    <>
                      <Pencil size={14} /> Edit Profile
                    </>
                  )}
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
                    title={displayArtist.email}
                  >
                    {displayArtist.email}
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
                    {displayArtist.phoneNumber}
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
                    title={displayArtist.address}
                  >
                    {displayArtist.address || "N/A"}
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
                    {displayArtist.gender}{" "}
                    {displayArtist.dob && (
                      <>
                        <span className="mx-1">•</span>

                        <span className=" ml-1">
                          {calculateAge(displayArtist.dob)} Years
                        </span>
                      </>
                    )}
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
            <AboutMeCard artist={displayArtist} onUpdate={handleUpdate} />

            <ExperienceCard
              artist={displayArtist}
              onUpdate={handleUpdate}
              onAdd={() => setshowAddSectionForm(true)}
            />

            <GalleryCard artist={displayArtist} onUpdate={handleUpdate} />
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            <VideoLinksCard artist={displayArtist} onUpdate={handleUpdate} />
            <BioDataCard artist={displayArtist} onUpdate={handleUpdate} />
            <SocialMediaCard artist={displayArtist} onUpdate={handleUpdate} />
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          artist={artist || SKELETON_ARTIST}
          isCreating={isNewUser}
          onClose={() => setShowEditModal(false)}
          onUpdate={isNewUser ? handleProfileCreated : handleUpdate}
        />
      )}

      {showAddSectionForm && (
        <AddSectionForm
          onClose={() => setshowAddSectionForm(false)}
          onProfileCreated={handleProfileCreated}
          artist={artist}
          isCreatingProfile={isNewUser}
        />
      )}
    </div>
  );
};

export default ArtistProfile;
