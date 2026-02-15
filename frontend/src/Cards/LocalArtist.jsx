import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiUser,
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiMapPin,
  FiAward,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaImdb,
} from "react-icons/fa";
import api from "../Components/axios";
import {
  AboutMeCard,
  ExperienceCard,
  GalleryCard,
  VideoLinksCard,
  BioDataCard,
  SocialMediaCard,
} from "../Dashboard/ArtistProfileComponents";

const Disclaimer = () => (
  <div className="pt-8 pb-4">
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
      <p className="text-[10px] leading-relaxed text-gray-400 font-medium text-center italic">
        <span className="font-bold text-gray-500 uppercase tracking-widest not-italic mr-1">
          Disclaimer:
        </span>
        The information and data displayed on this portal are provided solely by
        the respective individuals/applicants and have not been independently
        verified by the Department. The Department makes no representations or
        warranties regarding the accuracy, completeness, or reliability of the
        submitted information and shall not be held responsible or liable for
        any errors, omissions, or claims arising from its use.
      </p>
    </div>
  </div>
);

const LocalArtist = ({ onClose }) => {
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [focusedArtist, setFocusedArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  // Categories List
  const categories = [
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
    "Other",
        "All",

  ];

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        // Fetch from both endpoints
        const [allArtistsRes, verifiedArtistsRes] = await Promise.all([
          api.get("/api/admin/artist/allArtists"),
          api.get("/api/artist/verifiedartists"),
        ]);

        let combinedArtists = [];

        if (allArtistsRes.data.success) {
          combinedArtists = [...allArtistsRes.data.data];
        }

        if (verifiedArtistsRes.data.success) {
          // Normalize verified artists to match structure if needed, then merge
          const verifiedData = verifiedArtistsRes.data.data.map((artist) => ({
            ...artist,
            // Ensure email field matches what UI expects (emailId or email)
            emailId: artist.emailId || artist.email,
            // Ensure experience structure is handled correctly in mapping later
            isVerifiedSource: true,
          }));

          // Merge and deduplicate by ID
          const existingIds = new Set(combinedArtists.map((a) => a.id));
          verifiedData.forEach((vArtist) => {
            if (!existingIds.has(vArtist.id)) {
              combinedArtists.push(vArtist);
            } else {
              // Optionally update existing artist with verified details if they overlap
              const index = combinedArtists.findIndex(
                (a) => a.id === vArtist.id,
              );
              combinedArtists[index] = {
                ...combinedArtists[index],
                ...vArtist,
              };
            }
          });
        }

        setArtists(combinedArtists);
      } catch (error) {
        console.error("Error fetching artists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const getParsedExperiences = (artist) => {
    try {
      let exps = [];
      if (typeof artist.experiences === "string") {
        exps = JSON.parse(artist.experiences);
      } else {
        exps = artist.experiences || [];
      }

      // Normalize roleInFilm to role if it exists (for new API structure)
      return exps.map((e) => ({
        ...e,
        role: e.role || e.roleInFilm,
      }));
    } catch (e) {
      return [];
    }
  };

  const getPrimaryRole = (artist) => {
    // 1. Check professions (new API structure)
    if (
      artist.professions &&
      Array.isArray(artist.professions) &&
      artist.professions.length > 0
    ) {
      return artist.professions
        .map((p) => (typeof p === "object" ? p.name || p : p))
        .join(", ");
    }
    // 2. Check specializations (new API structure)
    if (
      artist.specializations &&
      Array.isArray(artist.specializations) &&
      artist.specializations.length > 0
    ) {
      return artist.specializations
        .map((s) => (typeof s === "object" ? s.name || s : s))
        .join(", ");
    }

    // 3. Fallback to experiences
    const experiences = getParsedExperiences(artist);
    if (experiences.length > 0) {
      return experiences[0].role || experiences[0].roleInFilm || "Artist";
    }
    return "Artist Profile";
  };
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age + " Years";
  };

  const filtered = artists.filter((a) => {
    const matchesSearch =
      a.fullName && a.fullName.toLowerCase().includes(search.toLowerCase());

    if (selectedCategory === "All") return matchesSearch;

    // Helper to check if a role matches the selected category
    const hasRole = (role) => {
      if (!role) return false;
      const roleName = typeof role === "string" ? role : role.name;
      return (
        roleName && roleName.toLowerCase() === selectedCategory.toLowerCase()
      );
    };

    const matchesCategory =
      (a.professions && a.professions.some(hasRole)) ||
      (a.specializations && a.specializations.some(hasRole)) ||
      getParsedExperiences(a).some(
        (exp) => hasRole(exp.role) || hasRole(exp.roleInFilm),
      );

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full min-h-screen bg-[#FDFCFD] flex relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#891737]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#891737]/3 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Global Close Button - Always Visible */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[60] p-2 bg-white/90 backdrop-blur-md rounded-full text-gray-400 hover:text-[#891737] hover:bg-[#891737]/5 transition-all shadow-sm border border-gray-100/50"
        title="Close Directory"
      >
        <FiX className="w-5 h-5" />
      </button>

      {/* LEFT SIDEBAR - Fixed Width */}
      <div className="w-72 border-r border-gray-100 bg-white/50 backdrop-blur-xl h-screen sticky top-0 flex-col z-40 hidden lg:flex">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-100/50">
          {/* Search Bar - Smaller Size */}
          <div className="relative group w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#891737] transition-colors w-4 h-4" />
            <input
              type="text"
              placeholder="Search artist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full placeholder:text-gray-400 pl-9 pr-3 py-2 text-xs rounded-lg bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#891737] focus:ring-2 focus:ring-[#891737]/5 transition-all outline-none"
            />
          </div>
        </div>

        {/* Categories List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-3 space-y-0.5 custom-scrollbar">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
            Categories
          </h3>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setFocusedArtist(null); // Reset detail view on category change
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-between group ${
                selectedCategory === cat
                  ? "bg-[#891737] text-white shadow-sm"
                  : "text-gray-600 hover:bg-white hover:shadow-sm"
              }`}
            >
              <span>{cat === "All" ? "All Artists" : cat}</span>
              {selectedCategory === cat && (
                <div className="w-1 h-1 rounded-full bg-white"></div>
              )}
            </button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-100/50 text-center">
          <p className="text-[10px] text-gray-400">
            {filtered.length} Artists Found
          </p>
        </div>
      </div>

      {/* RIGHT CONTENT AREA - Scrollable */}
      <div className="flex-1 h-screen overflow-y-auto relative z-10 w-full">
        {/* Mobile Header (Search & Toggle) - Visible only on small screens */}
        <div className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Artist Directory
            </h2>
            <span className="text-xs text-gray-500">
              {filtered.length} artists
            </span>
          </div>

          <div className="flex gap-2">
            <div className="relative group flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-100 focus:border-[#891737] focus:ring-2 focus:ring-[#891737]/10 outline-none"
              />
            </div>
            {/* Mobile Category Dropdown */}
            <div className="relative w-40">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setFocusedArtist(null);
                }}
                className="w-full appearance-none bg-gray-50 border border-gray-100 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:border-[#891737] font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <FiChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-full">
          {!focusedArtist ? (
            // GRID VIEW
            <>
              {/* TOP HEADER - Restored Title Here */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-700 tracking-tight leading-none mb-2">
                    Artist Directory
                  </h2>
                  <p className="text-xs text-gray-400">
                    Official BSFDFC Talent Registry
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-xs font-bold text-[#891737] uppercase tracking-wide">
                    {selectedCategory === "All"
                      ? "All Categories"
                      : selectedCategory}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {filtered.length} Result{filtered.length !== 1 ? "s" : ""}{" "}
                    Found
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                  <div className="w-12 h-12 border-[3px] border-[#891737]/10 border-t-[#891737] rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Loading Artists...
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500 bg-white/50 rounded-3xl border border-gray-100/50">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                    <FiUser className="text-2xl text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    No artists found
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    Try adjusting your search or category filter.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filtered.map((artist, i) => (
                    <div
                      key={artist.id || i}
                      onClick={() => setFocusedArtist(artist)}
                      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#891737]/20"
                    >
                      {/* Aspect Ratio Box */}
                      <div className="aspect-[3/4] overflow-hidden relative bg-gray-100">
                        <img
                          src={
                            artist.image ||
                            "https://via.placeholder.com/400x533"
                          }
                          alt={artist.fullName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-sm md:text-base font-bold text-white mb-0.5 leading-tight truncate">
                            {artist.fullName}
                          </h3>
                          <p className="text-[10px] md:text-xs text-gray-300 font-medium  uppercase tracking-wide truncate">
                            {[
                              ...(artist.professions || []).map(
                                (p) => p.name || p,
                              ),
                              ...(artist.specializations || []).map(
                                (s) => s.name || s,
                              ),
                            ].join(", ") || "Artist"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Disclaimer />
            </>
          ) : (
            // DETAIL PROFILE VIEW (Rendered inside the right pane)
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 relative">
              {/* Back Helper */}
              <button
                onClick={() => setFocusedArtist(null)}
                className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#891737] transition-colors group px-4 py-2 rounded-lg hover:bg-white/80 border border-transparent hover:border-gray-100"
              >
                <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to List
              </button>

              <div className="space-y-6">
                {/* 1. PROFILE HEADER */}
                <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm">
                  {/* Cover Banner */}
                  <div className="h-32 md:h-48 bg-gray-900 relative">
                    <img
                      src="/newBannerArtist.jpg"
                      alt="Banner"
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  <div className="px-6 pb-6 md:px-8 md:pb-8 relative">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 md:-mt-16">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-lg bg-gray-100 overflow-hidden">
                          <img
                            src={
                              focusedArtist.image ||
                              "https://via.placeholder.com/300"
                            }
                            alt={focusedArtist.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-2 mt-2 md:mt-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">
                          {focusedArtist.fullName}
                        </h1>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-[#891737] text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {getPrimaryRole(focusedArtist).split(",")[0]}
                          </span>
                          {focusedArtist.district && (
                            <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                              <FiMapPin className="w-3 h-3" />{" "}
                              {focusedArtist.district}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Social Actions */}
                      <div className="flex gap-2 pt-4 md:pt-0">
                        {/* Render Social Icons if available */}
                        {[
                          {
                            link: focusedArtist.imdbLink,
                            icon: FaImdb,
                            color: "text-yellow-600 bg-yellow-50",
                          },
                          {
                            link: focusedArtist.instagram,
                            icon: FaInstagram,
                            color: "text-rose-600 bg-rose-50",
                          },
                          {
                            link: focusedArtist.facebook,
                            icon: FaFacebookF,
                            color: "text-blue-600 bg-blue-50",
                          },
                          {
                            link: focusedArtist.twitter,
                            icon: FaTwitter,
                            color: "text-blue-400 bg-blue-50",
                          },
                          {
                            link: focusedArtist.linkedIn,
                            icon: FaLinkedinIn,
                            color: "text-blue-700 bg-blue-50",
                          },
                        ].map((social, idx) =>
                          social.link ? (
                            <a
                              key={idx}
                              href={social.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`p-2.5 rounded-xl transition-all hover:scale-110 ${social.color}`}
                            >
                              <social.icon size={16} />
                            </a>
                          ) : null,
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. STATS BAR */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                      Email
                    </p>
                    <p
                      className="font-semibold text-gray-900 truncate text-sm"
                      title={focusedArtist.emailId || focusedArtist.email}
                    >
                      {focusedArtist.emailId || focusedArtist.email || "N/A"}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                      Phone
                    </p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {focusedArtist.phoneNumber || "N/A"}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                      Gender
                    </p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {focusedArtist.gender || "N/A"}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                      Age
                    </p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {calculateAge(focusedArtist.dob)}
                    </p>
                  </div>
                </div>

                {/* 3. MAIN DETAILS GRID */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  {/* Main Info Column */}
                  <div className="xl:col-span-8 space-y-6">
                    <AboutMeCard artist={focusedArtist} readOnly={true} />
                    <ExperienceCard artist={focusedArtist} readOnly={true} />
                    <GalleryCard artist={focusedArtist} readOnly={true} />
                  </div>

                  {/* Sidebar Info Column */}
                  <div className="xl:col-span-4 space-y-6">
                    <VideoLinksCard artist={focusedArtist} readOnly={true} />
                    <BioDataCard artist={focusedArtist} readOnly={true} />
                    <SocialMediaCard artist={focusedArtist} readOnly={true} />
                  </div>
                </div>

                <Disclaimer />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocalArtist;
