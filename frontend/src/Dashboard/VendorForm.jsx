import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Components/axios";
import { validateFile } from "../utils/fileValidation";

const VendorProductForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState({});
  const [productKeys, setProductKeys] = useState([]);
  const navigate = useNavigate();

  const [vendorData, setVendorData] = useState({
    vendorName: "",
    phoneNumber: "",
    email: "",
    address: "",
    website: "",
    category: [],
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const categories = [
    "Photography & Videography",
    "Catering Services",
    "Decorations & Lighting",
    "Music & Entertainment",
    "Transportation",
    "Venues & Locations",
    "Costumes & Makeup",
    "Equipment Rental",
    "Post-Production",
    "Security",
    "Other",
  ];

  const productTypes = {
    "Photography & Videography": [
      "Cameras",
      "Lighting",
      "Sound",
      "Grip",
      "Drones",
    ],
    "Catering Services": [
      "Food Catering",
      "Beverage Services",
      "Equipment Rental",
      "Staff Services",
    ],
    "Decorations & Lighting": [
      "Furniture",
      "Decor",
      "Lighting Equipment",
      "Temporary Structures",
    ],
    "Music & Entertainment": [
      "Sound Systems",
      "Musical Instruments",
      "DJ Equipment",
      "Entertainment Services",
    ],
    Transportation: ["Vanity Vans", "Generators", "Cranes", "Trolleys"],
    "Venues & Locations": [
      "Sets",
      "Green Screen",
      "Outdoor Props",
      "Temporary Structures",
    ],
    "Costumes & Makeup": [
      "Traditional",
      "Modern",
      "Fantasy",
      "Historical",
      "Uniforms",
    ],
    "Equipment Rental": ["Cameras", "Lighting", "Sound", "Grip", "Drones"],
    "Post-Production": [
      "Editing Systems",
      "VFX Workstations",
      "Color Grading Tools",
    ],
    Other: ["Miscellaneous Equipment", "Special Services", "Custom Solutions"],
  };

  const [vendorErrors, setVendorErrors] = useState({});

  const [productData, setProductData] = useState({});

  const [productErrors, setProductErrors] = useState({});

  useEffect(() => {
    const keys = Object.keys(selectedTypes).filter((key) => selectedTypes[key]);
    setProductKeys(keys);
  }, [selectedTypes]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        e.target.value = null;
        return;
      }

      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const validateVendorForm = () => {
    const errors = {};

    if (!vendorData.vendorName.trim()) {
      errors.vendorName = "Vendor name is required";
    }

    if (!vendorData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone is required";
    }

    if (!vendorData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(vendorData.email)) {
      errors.email = "Invalid email format";
    }

    if (!vendorData.address.trim()) {
      errors.address = "Address is required";
    }

    if (vendorData.website && !/^https?:\/\/.+/.test(vendorData.website)) {
      errors.website = "Invalid URL format";
    }

    if (vendorData.category.length === 0) {
      errors.category = "Select at least one category";
    }

    if (!logoFile) {
      errors.logo = "Please upload a logo";
    }

    setVendorErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateProductForm = () => {
    const errors = {};

    productKeys.forEach((key, index) => {
      const product = productData[key] || {};

      if (!product.name?.trim()) {
        errors[`${key}_name`] = "Product name is required";
      }

      if (!product.description?.trim()) {
        errors[`${key}_description`] = "Description is required";
      }

      if (!product.price || product.price <= 0) {
        errors[`${key}_price`] = "Price must be a positive number";
      }
    });

    setProductErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleVendorChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "category") {
        setVendorData((prev) => ({
          ...prev,
          category: checked
            ? [...prev.category, value]
            : prev.category.filter((cat) => cat !== value),
        }));
      }
    } else {
      setVendorData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (vendorErrors[name]) {
      setVendorErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleProductChange = (key, field, value) => {
    setProductData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));

    const errorKey = `${key}_${field}`;
    if (productErrors[errorKey]) {
      setProductErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }
  };

  const handleVendorSubmit = (e) => {
    e.preventDefault();

    if (validateVendorForm()) {
      console.log("Vendor data:", vendorData);
      setStep(2);
    }
  };

  const handleTypeChange = (cat, type, checked) => {
    const key = `${cat}-${type}`;
    setSelectedTypes((prev) => ({
      ...prev,
      [key]: checked,
    }));

    if (!checked) {
      setProductData((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (!validateProductForm()) {
      return;
    }

    console.log("Form data being submitted");
    setLoading(true);

    try {
      const validProducts = [];
      productKeys.forEach((key) => {
        const [category, type] = key.split("-");
        const product = productData[key];

        if (product && product.name && product.description && product.price) {
          validProducts.push({
            name: product.name,
            type: type,
            description: product.description,
            price: parseFloat(product.price),
          });
        }
      });

      console.log("Valid products:", validProducts);

      if (validProducts.length === 0) {
        alert(
          "Please add at least one complete product with all required fields."
        );
        return;
      }

      const submitData = new FormData();

      submitData.append("vendorName", vendorData.vendorName.trim());
      submitData.append("category", vendorData.category.join(", "));
      submitData.append("phoneNumber", vendorData.phoneNumber.trim());
      submitData.append("email", vendorData.email.trim());
      submitData.append("address", vendorData.address.trim());

      if (vendorData.website && vendorData.website.trim()) {
        submitData.append("website", vendorData.website.trim());
      }

      if (validProducts && validProducts.length > 0) {
        validProducts.forEach((product, index) => {
          submitData.append(`products[${index}][name]`, product.name);
          submitData.append(`products[${index}][type]`, product.type);
          if (product.description) {
            submitData.append(
              `products[${index}][description]`,
              product.description
            );
          }
          if (product.price) {
            submitData.append(`products[${index}][price]`, product.price);
          }
        });
      }

      // CRITICAL: Use 'logo' field name to match multer configuration
      submitData.append("logo", logoFile);

      console.log("Form data being sent:");
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }

      // Use api.post instead of fetch
      const response = await api.post("/api/vendor/addvendors", submitData);

      console.log("Response status:", response.status);
      const result = response.data;
      console.log("Success response:", result);

      if (result.success) {
        alert("Vendor registered successfully!");

        // Reset everything
        setVendorData({
          vendorName: "",
          phoneNumber: "",
          email: "",
          address: "",
          website: "",
          category: [],
        });
        setProductData({});
        setSelectedTypes({});
        setProductKeys([]);
        setVendorErrors({});
        setProductErrors({});
        setLogoFile(null);
        setLogoPreview(null);
        setStep(1);
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-8 bg-white rounded-2xl shadow-lg">
      {step === 1 && (
        <form onSubmit={handleVendorSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-[#a92b4e]">
            Vendor Information
          </h2>

          <div>
            <label className="block mb-1 font-medium">Vendor Name *</label>
            <input
              type="text"
              name="vendorName"
              value={vendorData.vendorName}
              onChange={handleVendorChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#a92b4e] focus:outline-none"
              placeholder="Enter vendor name"
            />
            {vendorErrors.vendorName && (
              <p className="text-red-500 text-sm mt-1">
                {vendorErrors.vendorName}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Phone *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={vendorData.phoneNumber}
                onChange={handleVendorChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#a92b4e] focus:outline-none"
                placeholder="Enter phone number"
              />
              {vendorErrors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {vendorErrors.phoneNumber}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium">Email *</label>
              <input
                type="email"
                name="email"
                value={vendorData.email}
                onChange={handleVendorChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#a92b4e] focus:outline-none"
                placeholder="Enter email address"
              />
              {vendorErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {vendorErrors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Address *</label>
            <textarea
              name="address"
              value={vendorData.address}
              onChange={handleVendorChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#a92b4e] focus:outline-none"
              placeholder="Enter complete address"
            />
            {vendorErrors.address && (
              <p className="text-red-500 text-sm mt-1">
                {vendorErrors.address}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Website (Optional)</label>
            <input
              type="url"
              name="website"
              value={vendorData.website}
              onChange={handleVendorChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#a92b4e] focus:outline-none"
              placeholder="https://example.com"
            />
            {vendorErrors.website && (
              <p className="text-red-500 text-sm mt-1">
                {vendorErrors.website}
              </p>
            )}
          </div>

          {/* Logo Upload Section */}
          <div>
            <label className="block mb-3 font-medium">Company Logo *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                {logoPreview ? (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="max-w-32 max-h-32 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">
                      Click to upload logo
                    </p>
                    <p className="text-xs text-gray-400">
                      Max size: 10MB, Format: JPG, PNG, GIF
                    </p>
                  </div>
                )}
              </label>
            </div>
            {vendorErrors.logo && (
              <p className="text-red-500 text-sm mt-1">{vendorErrors.logo}</p>
            )}
          </div>

          <div>
            <label className="block mb-3 font-medium">Categories *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="category"
                    value={cat}
                    checked={vendorData.category.includes(cat)}
                    onChange={handleVendorChange}
                    className="w-4 h-4 text-[#a92b4e] focus:ring-[#a92b4e]"
                  />
                  <span className="text-sm">{cat}</span>
                </label>
              ))}
            </div>
            {vendorErrors.category && (
              <p className="text-red-500 text-sm mt-1">
                {vendorErrors.category}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#a92b4e] hover:bg-[#f27d9c] text-white px-8 py-3 rounded-lg shadow-md transition-colors duration-200 font-medium"
          >
            Next: Products →
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleProductSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#a92b4e]">
              Product Details
            </h2>
            <div className="text-sm text-gray-600">
              Selected: {productKeys.length} product(s)
            </div>
          </div>

          {vendorData.category.map((cat) => (
            <div
              key={cat}
              className="border rounded-xl p-6 space-y-4 bg-gray-50"
            >
              <h3 className="text-lg font-semibold text-gray-800">{cat}</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {(productTypes[cat] || []).map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes[`${cat}-${type}`] || false}
                      onChange={(e) =>
                        handleTypeChange(cat, type, e.target.checked)
                      }
                      className="w-4 h-4 text-[#a92b4e] focus:ring-[#a92b4e]"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>

              {(productTypes[cat] || []).map((type) => {
                const key = `${cat}-${type}`;
                const isSelected = selectedTypes[key];

                return (
                  isSelected && (
                    <div
                      key={type}
                      className="border-t pt-4 mt-4 bg-white p-4 rounded-lg"
                    >
                      <h4 className="font-medium mb-3 text-[#a92b4e]">
                        {type} Details
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block mb-1 font-medium">
                            Product Name *
                          </label>
                          <input
                            type="text"
                            value={productData[key]?.name || ""}
                            onChange={(e) =>
                              handleProductChange(key, "name", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#a92b4e] focus:outline-none"
                            placeholder="Enter product name..."
                          />
                          {productErrors[`${key}_name`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {productErrors[`${key}_name`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block mb-1 font-medium">
                            Description *
                          </label>
                          <textarea
                            value={productData[key]?.description || ""}
                            onChange={(e) =>
                              handleProductChange(
                                key,
                                "description",
                                e.target.value
                              )
                            }
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#a92b4e] focus:outline-none"
                            placeholder="Describe the product..."
                          />
                          {productErrors[`${key}_description`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {productErrors[`${key}_description`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block mb-1 font-medium">
                            Price (₹) *
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={productData[key]?.price || ""}
                            onChange={(e) =>
                              handleProductChange(key, "price", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#a92b4e] focus:outline-none"
                            placeholder="0.00"
                          />
                          {productErrors[`${key}_price`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {productErrors[`${key}_price`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          ))}

          {productKeys.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Select product types above to add their details
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md transition-colors duration-200 font-medium"
            >
              ← Back
            </button>

            <button
              type="submit"
              disabled={loading || productKeys.length === 0}
              className="flex-1 bg-[#a92b4e] hover:bg-[#f27d9c] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors duration-200 font-medium"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                `Submit All (${productKeys.length} products)`
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default VendorProductForm;
