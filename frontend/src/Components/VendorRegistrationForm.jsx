import React, { useState } from 'react';
import { Plus, Upload, X, Building2, Phone, Mail, MapPin, Globe, Package } from 'lucide-react';

const VendorRegistrationForm = () => {
  const [formData, setFormData] = useState({
    vendorName: '',
    category: '',
    phoneNumber: '',
    email: '',
    address: '',
    website: '',
    products: []
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    type: '',
    description: '',
    price: ''
  });

  const categories = [
    'Photography & Videography',
    'Catering Services',
    'Decorations & Lighting',
    'Music & Entertainment',
    'Transportation',
    'Venues & Locations',
    'Costumes & Makeup',
    'Equipment Rental',
    'Post-Production',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addProduct = () => {
    if (currentProduct.name && currentProduct.type) {
      setFormData(prev => ({
        ...prev,
        products: [...prev.products, { ...currentProduct }]
      }));
      setCurrentProduct({
        name: '',
        type: '',
        description: '',
        price: ''
      });
      setShowProductForm(false);
    }
  };

  const removeProduct = (index) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.vendorName.trim()) {
      alert('Please enter vendor name');
      return false;
    }
    if (!formData.category) {
      alert('Please select a category');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      alert('Please enter phone number');
      return false;
    }
    if (!formData.email.trim()) {
      alert('Please enter email address');
      return false;
    }
    if (!formData.address.trim()) {
      alert('Please enter address');
      return false;
    }
    if (!logoFile) {
      alert('Please upload a logo');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      // Append vendor data - exactly as your Postman test shows
      submitData.append('vendorName', formData.vendorName.trim());
      submitData.append('category', formData.category);
      submitData.append('phoneNumber', formData.phoneNumber.trim());
      submitData.append('email', formData.email.trim());
      submitData.append('address', formData.address.trim());

      // Optional website field
      if (formData.website && formData.website.trim()) {
        submitData.append('website', formData.website.trim());
      }

      // Handle products - send as individual fields like in your Postman test
      if (formData.products && formData.products.length > 0) {
        formData.products.forEach((product, index) => {
          submitData.append(`products[${index}][name]`, product.name);
          submitData.append(`products[${index}][type]`, product.type);
          if (product.description) {
            submitData.append(`products[${index}][description]`, product.description);
          }
          if (product.price) {
            submitData.append(`products[${index}][price]`, product.price);
          }
        });
      }

      // CRITICAL: Use 'logo' field name to match your multer configuration
      submitData.append('logo', logoFile);

      console.log('Form data being sent:');
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }

      const response = await fetch('https://bsfdfcbackend.onrender.com/api/vendor/addvendors', {
        method: 'POST',
        body: submitData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;

        try {
          const errorText = await response.text();
          console.log('Error response:', errorText);

          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
          } catch {
            if (errorText.includes('<!DOCTYPE html>')) {
              errorMessage = 'Server internal error. Please check your backend logs.';
            } else {
              errorMessage = errorText;
            }
          }
        } catch (textError) {
          console.error('Could not read error response:', textError);
        }

        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error('Server returned invalid response format');
      }

      const result = await response.json();
      console.log('Success response:', result);

      if (result.success) {
        alert('Vendor registered successfully!');
        // Reset form
        setFormData({
          vendorName: '',
          category: '',
          phoneNumber: '',
          email: '',
          address: '',
          website: '',
          products: []
        });
        setLogoFile(null);
        setLogoPreview(null);
      } else {
        throw new Error(result.message || 'Registration failed');
      }

    } catch (error) {
      console.error('Submit error:', error);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Vendor Registration</h1>
                <p className="text-blue-100 mt-1">Join our platform and showcase your services</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Logo Upload Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Company Logo *
              </label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {logoPreview ? (
                    <div className="w-24 h-24 rounded-lg border-2 border-gray-200 overflow-hidden">
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </label>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 inline mr-1" />
                  Vendor Name *
                </label>
                <input
                  type="text"
                  name="vendorName"
                  value={formData.vendorName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter complete address"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Website (Optional)
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            {/* Products Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Products & Services (Optional)
                </h3>
                <button
                  type="button"
                  onClick={() => setShowProductForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </button>
              </div>

              {/* Product List */}
              {formData.products.length > 0 && (
                <div className="space-y-3 mb-4">
                  {formData.products.map((product, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{product.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">Type: {product.type}</p>
                          {product.description && (
                            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                          )}
                          {product.price && (
                            <p className="text-sm font-medium text-green-600 mt-1">₹{product.price}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Product Form */}
              {showProductForm && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-4">Add New Product/Service</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={currentProduct.name}
                        onChange={handleProductChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Type *
                      </label>
                      <input
                        type="text"
                        name="type"
                        value={currentProduct.type}
                        onChange={handleProductChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Service, Equipment, etc."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={currentProduct.description}
                        onChange={handleProductChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Brief description of the product/service"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={currentProduct.price}
                        onChange={handleProductChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter price"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductForm(false);
                        setCurrentProduct({ name: '', type: '', description: '', price: '' });
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={addProduct}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add Product
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  'Register Vendor'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistrationForm;
