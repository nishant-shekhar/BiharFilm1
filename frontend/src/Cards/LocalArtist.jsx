import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiUser,
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFilm,
  FiExternalLink,
  FiAward,
} from "react-icons/fi";
import api from "../Components/axios";

const LocalArtist = () => {
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState("");
  const [focusedArtist, setFocusedArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await api.get("/api/admin/artist/allArtists");
        if (response.data.success) {
          setArtists(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching artists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const filtered = artists.filter(
    (a) => a.fullName && a.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const getPrimaryRole = (artist) => {
    let experiences = [];
    try {
      if (typeof artist.experiences === "string") {
        experiences = JSON.parse(artist.experiences);
      } else if (Array.isArray(artist.experiences)) {
        experiences = artist.experiences;
      }
    } catch (e) {
      console.error("Error parsing experiences", e);
    }

    if (experiences.length > 0) {
      return experiences[0].role;
    }
    return "Artist";
  };

  const getParsedExperiences = (artist) => {
    try {
      if (typeof artist.experiences === "string") {
        return JSON.parse(artist.experiences);
      }
      return artist.experiences || [];
    } catch (e) {
      return [];
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto min-h-[42rem] max-h-[50rem] flex rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-xl font-sans text-gray-900">
      {/* Sidebar Navigation */}
      <div
        className={`${
          focusedArtist ? "hidden lg:flex lg:w-80" : "w-full lg:w-80 flex"
        } bg-white border-r border-gray-100 flex-col transition-all duration-300`}
      >
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">
            Talent Directory
          </h2>
          <p className="text-xs text-gray-400 mb-5 font-medium">
            BSFDFC • Official Registry
          </p>

          <div className="relative group">
            <FiSearch className="absolute left-3 top-3 text-gray-400 text-sm group-focus-within:text-[#891737] transition-colors" />
            <input
              type="text"
              placeholder="Search artists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#891737] focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 space-y-3">
              <div className="w-6 h-6 border-2 border-[#891737] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-400">Loading Directory...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 px-6">
              <p className="text-sm text-gray-400">No artists found.</p>
            </div>
          ) : (
            filtered.map((artist, i) => (
              <button
                key={artist.id || i}
                onClick={() => setFocusedArtist(artist)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 border border-transparent ${
                  focusedArtist?.id === artist.id
                    ? "bg-[#891737] text-white shadow-md shadow-[#891737]/20"
                    : "hover:bg-gray-50 hover:border-gray-100 text-gray-700"
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={artist.image || "https://via.placeholder.com/150"}
                    alt={artist.fullName}
                    className={`w-10 h-10 rounded-full object-cover border-2 ${
                      focusedArtist?.id === artist.id
                        ? "border-white"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-sm font-semibold truncate ${
                      focusedArtist?.id === artist.id
                        ? "text-white"
                        : "text-gray-900 group-hover:text-black"
                    }`}
                  >
                    {artist.fullName}
                  </h4>
                  <p
                    className={`text-[11px] truncate uppercase tracking-wider font-medium ${
                      focusedArtist?.id === artist.id
                        ? "text-white/80"
                        : "text-gray-400"
                    }`}
                  >
                    {getPrimaryRole(artist)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <p className="text-[10px] text-center text-gray-400 font-medium">
            {filtered.length} PROFILES LISTED
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
        {!focusedArtist ? (
          // Empty State / Welcome Screen
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 relative z-10">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-gray-100">
              <FiUser className="text-3xl text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Select a Profile
            </h3>
            <p className="text-gray-500 max-w-sm leading-relaxed text-sm">
              Click on an artist from the sidebar to view their full portfolio,
              contact details, and filmography history.
            </p>
          </div>
        ) : (
          // Detailed Profile View
          <div className="flex-1 flex flex-col h-full relative z-10">
            {/* Header / Breadcrumb for Mobile */}
            <div className="lg:hidden p-4 border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-20">
              <button
                onClick={() => setFocusedArtist(null)}
                className="flex items-center text-sm text-gray-500 hover:text-gray-900 font-medium"
              >
                <FiArrowLeft className="mr-2" /> Back to Directory
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12">
              <div className="max-w-4xl mx-auto space-y-12">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="group relative shrink-0 mx-auto md:mx-0">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden shadow-xl border border-gray-200 relative z-10 bg-white">
                      <img
                        src={
                          focusedArtist.image ||
                          "https://via.placeholder.com/150"
                        }
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={focusedArtist.fullName}
                      />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-5">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                        {focusedArtist.fullName}
                      </h1>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span className="px-3 py-1 bg-[#891737] text-white text-xs font-medium uppercase tracking-wider rounded-full  shadow-[#891737]/20">
                          {getPrimaryRole(focusedArtist)}
                        </span>
                        {focusedArtist.district && (
                          <span className="flex items-center text-gray-500 text-sm font-medium bg-gray-50 px-3 py-1 rounded border border-gray-200">
                            <FiMapPin className="mr-1.5 text-gray-400" />
                            {focusedArtist.district}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto md:mx-0">
                      <div className="bg-gray-50 rounded-lg p-3 flex items-center space-x-3 border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#891737] shadow-sm">
                          <FiMail className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                            Email
                          </p>
                          <p className="text-sm text-gray-900 font-medium truncate">
                            {focusedArtist.emailId || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 flex items-center space-x-3 border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#891737] shadow-sm">
                          <FiPhone className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                            Phone
                          </p>
                          <p className="text-sm text-gray-900 font-medium truncate">
                            {focusedArtist.phoneNumber || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {focusedArtist.address && (
                      <div className="text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto md:mx-0 bg-white p-0 border-t border-gray-100 pt-4 mt-2">
                        <span className="text-gray-900 font-semibold mr-1">
                          Address:
                        </span>{" "}
                        {focusedArtist.address}
                      </div>
                    )}
                  </div>
                </div>

                {/* Experience Section */}
                <div className="space-y-6 pt-6 border-t border-gray-100">
                  <div className="flex items-end justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      Experience & Work History
                    </h3>
                    <span className="text-sm text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100">
                      {getParsedExperiences(focusedArtist).length} Credits
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {getParsedExperiences(focusedArtist).length > 0 ? (
                      getParsedExperiences(focusedArtist).map((exp, index) => (
                        <div
                          key={index}
                          className="group relative bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#891737]/30 rounded-xl p-6 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                            <div className="space-y-2 flex-grow">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#891737] transition-colors">
                                  {exp.filmTitle}
                                </h4>
                                {(exp.durationFrom || exp.durationTo) && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                                    {exp.durationFrom
                                      ? new Date(exp.durationFrom).getFullYear()
                                      : ""}
                                    {exp.durationTo
                                      ? ` - ${new Date(
                                          exp.durationTo
                                        ).getFullYear()}`
                                      : ""}
                                  </span>
                                )}
                              </div>

                              <div className="flex gap-4 text-sm">
                                <span className="flex items-center gap-1.5 text-gray-600">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#891737]/50"></span>
                                  Role:{" "}
                                  <span className="text-gray-900 font-medium">
                                    {exp.role}
                                  </span>
                                </span>
                                {exp.roleInFilm && (
                                  <span className="flex items-center gap-1.5 text-gray-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                    Character:{" "}
                                    <span className="text-gray-900 font-medium">
                                      {exp.roleInFilm}
                                    </span>
                                  </span>
                                )}
                              </div>

                              {exp.description && (
                                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl pt-2">
                                  {exp.description}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-row md:flex-col gap-3 shrink-0">
                              {exp.imdbLink && (
                                <a
                                  href={exp.imdbLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-[#f5c518] hover:bg-[#e2b616] text-black text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                  IMDb <FiExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              {exp.link && (
                                <a
                                  href={exp.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors border border-gray-200 flex items-center justify-center gap-2 hover:border-gray-300"
                                >
                                  Project <FiExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <FiAward className="text-4xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium">
                          No filmography credits listed yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default LocalArtist;
