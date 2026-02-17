import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";

const CategoryDropdown = ({
  options,
  value, // Expected to be an array for multi-select
  onChange,
  placeholder = "Select categories",
  label = "Categories",
  required = false,
  error = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Ensure value is always an array
  const selectedValues = Array.isArray(value) ? value : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    let newValues;
    if (selectedValues.includes(option)) {
      newValues = selectedValues.filter((item) => item !== option);
    } else {
      newValues = [...selectedValues, option];
    }
    onChange(newValues);
  };

  const removeOption = (e, option) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((item) => item !== option);
    onChange(newValues);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 bg-white border rounded-lg flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-[#a92b4e] focus:border-transparent ${
          error ? "border-red-500" : "border-gray-300"
        } min-h-[42px]`}
      >
        <div className="flex flex-wrap gap-1 text-left">
          {selectedValues.length > 0 ? (
            selectedValues.map((val) => (
              <span
                key={val}
                className="bg-rose-50 text-[#a92b4e] text-xs px-2 py-0.5 rounded-md flex items-center gap-1"
              >
                {val}
                <span
                  role="button"
                  onClick={(e) => removeOption(e, val)}
                  className="hover:text-rose-800 rounded-full"
                >
                  <X className="w-3 h-3" />
                </span>
              </span>
            ))
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ml-2 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option);
              return (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full px-4 py-2 text-sm text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${
                      isSelected
                        ? "bg-rose-50/50 text-[#a92b4e] font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <span className="truncate">{option}</span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
