import React, { useState } from "react";
import {
  Upload,
  Calendar,
  Type,
  FileText,
  Image as ImageIcon,
  Save,
  Film,
  Coffee,
  MessageCircle,
  Award,
} from "lucide-react";
import { validateFile } from "../utils/fileValidation";

const FilmClubAdmin = () => {
  const [activeTab, setActiveTab] = useState("Coffee with Film");
  const [activeFestivalTab, setActiveFestivalTab] =
    useState("IFFI Film Festival");

  // Mock Data / State for Forms
  const [coffeeData, setCoffeeData] = useState({
    description: "",
    image: null,
  });

  const [cineSamwadData, setCineSamwadData] = useState({
    title: "",
    date: "",
    description: "",
    image: null,
  });

  const [festivalData, setFestivalData] = useState({
    "IFFI Film Festival": { title: "", description: "", image: null },
    "Children Film Festival": { title: "", description: "", image: null },
    "Women Film Festival": { title: "", description: "", image: null },
  });

  const handleImageUpload = (e, section, subSection = null) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        alert(validation.error); // Simple alert for this component as it uses window.alert elsewhere
        e.target.value = null;
        return;
      }

      // In a real app, you'd upload this to a server. Here we just mock it.
      const imageUrl = URL.createObjectURL(file);

      if (section === "Coffee") {
        setCoffeeData({ ...coffeeData, image: imageUrl });
      } else if (section === "Cine") {
        setCineSamwadData({ ...cineSamwadData, image: imageUrl });
      } else if (section === "Festival" && subSection) {
        setFestivalData({
          ...festivalData,
          [subSection]: { ...festivalData[subSection], image: imageUrl },
        });
      }
    }
  };

  const handleSave = (section) => {
    alert(`${section} data saved successfully! (Mock Action)`);
    // API call would go here
  };

  const renderCoffeeSection = () => (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Coffee className="w-5 h-5 text-[#891737]" />
          Update Coffee with Film
        </h3>

        <div className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                {coffeeData.image ? (
                  <img
                    src={coffeeData.image}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "Coffee")}
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                rows="6"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#891737] focus:border-[#891737] sm:text-sm"
                placeholder="Enter detailed description..."
                value={coffeeData.description}
                onChange={(e) =>
                  setCoffeeData({ ...coffeeData, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => handleSave("Coffee with Film")}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#891737] text-white rounded-lg hover:bg-[#891737]/90 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCineSamwadSection = () => (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#891737]" />
          Update Cine-Samwad
        </h3>

        <div className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                {cineSamwadData.image ? (
                  <img
                    src={cineSamwadData.image}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "Cine")}
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Type className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#891737] focus:border-[#891737] sm:text-sm"
                  placeholder="Event Title"
                  value={cineSamwadData.title}
                  onChange={(e) =>
                    setCineSamwadData({
                      ...cineSamwadData,
                      title: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#891737] focus:border-[#891737] sm:text-sm"
                  value={cineSamwadData.date}
                  onChange={(e) =>
                    setCineSamwadData({
                      ...cineSamwadData,
                      date: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                rows="6"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#891737] focus:border-[#891737] sm:text-sm"
                placeholder="Event details..."
                value={cineSamwadData.description}
                onChange={(e) =>
                  setCineSamwadData({
                    ...cineSamwadData,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => handleSave("Cine-Samwad")}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#891737] text-white rounded-lg hover:bg-[#891737]/90 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFestivalSection = () => {
    const currentFestival = festivalData[activeFestivalTab];

    return (
      <div className="space-y-6 max-w-4xl">
        {/* Sub Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
          {[
            "IFFI Film Festival",
            "Children Film Festival",
            "Women Film Festival",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFestivalTab(tab)}
              className={`
                                px-4 py-2 rounded-md text-xs font-medium transition-all
                                ${
                                  activeFestivalTab === tab
                                    ? "bg-white text-[#891737] shadow-sm"
                                    : "text-gray-600 hover:text-[#891737]"
                                }
                            `}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#891737]" />
            Update {activeFestivalTab}
          </h3>

          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Festival Banner
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  {currentFestival.image ? (
                    <img
                      src={currentFestival.image}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      handleImageUpload(e, "Festival", activeFestivalTab)
                    }
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Type className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#891737] focus:border-[#891737] sm:text-sm"
                  placeholder="Festival Title"
                  value={currentFestival.title}
                  onChange={(e) =>
                    setFestivalData({
                      ...festivalData,
                      [activeFestivalTab]: {
                        ...currentFestival,
                        title: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <textarea
                  rows="6"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#891737] focus:border-[#891737] sm:text-sm"
                  placeholder="Festival details..."
                  value={currentFestival.description}
                  onChange={(e) =>
                    setFestivalData({
                      ...festivalData,
                      [activeFestivalTab]: {
                        ...currentFestival,
                        description: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => handleSave(activeFestivalTab)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#891737] text-white rounded-lg hover:bg-[#891737]/90 transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {[
            { name: "Coffee with Film", icon: Coffee },
            { name: "Cine-Samwad", icon: MessageCircle },
            { name: "Film Festivals", icon: Film },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`
                                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                                ${
                                  activeTab === tab.name
                                    ? "border-[#891737] text-[#891737]"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }
                            `}
            >
              <tab.icon
                className={`
                                -ml-0.5 mr-2 h-5 w-5
                                ${
                                  activeTab === tab.name
                                    ? "text-[#891737]"
                                    : "text-gray-400 group-hover:text-gray-500"
                                }
                            `}
              />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="py-4">
        {activeTab === "Coffee with Film" && renderCoffeeSection()}
        {activeTab === "Cine-Samwad" && renderCineSamwadSection()}
        {activeTab === "Film Festivals" && renderFestivalSection()}
      </div>
    </div>
  );
};

export default FilmClubAdmin;
