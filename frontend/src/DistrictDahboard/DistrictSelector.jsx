// DistrictSelector.jsx
import React from 'react';

const DistrictSelector = ({ currentDistrict, onDistrictChange }) => {
    const districts = [
        "ARARIA", "ARWAL", "AURANGABAD", "BANKA", "BEGUSARAI",
        "BHAGALPUR", "BHOJPUR", "BUXAR", "DARBHANGA", "EAST CHAMPARAN",
        "GAYA", "GOPALGANJ", "JAMUI", "JEHANABAD", "KAIMUR",
        "KATIHAR", "KHAGARIA", "KISHANGANJ", "LAKHISARAI", "MADHEPURA",
        "MADHUBANI", "MUNGER", "MUZAFFARPUR", "NALANDA", "NAWADA",
        "PATNA", "PURNIA", "ROHTAS", "SAHARSA", "SAMASTIPUR",
        "SARAN", "SHEIKHPURA", "SHEOHAR", "SITAMARHI", "SIWAN",
        "SUPAUL", "VAISHALI", "WEST CHAMPARAN"
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">District Selection</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {districts.map((district, index) => (
                    <button
                        key={index + 1}
                        onClick={() => onDistrictChange(index + 1)}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                            currentDistrict === index + 1
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {district}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DistrictSelector;
