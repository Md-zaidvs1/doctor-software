import React, { useState, useEffect } from 'react';

const ClinicForm = ({ currentClinic, onFormSubmit, categories, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    ownerName: '',
    email: '',
    phone: '',
    gstNumber: '',
    address: '',
    logo: '',
    isActive: true,
  });

  useEffect(() => {
    if (currentClinic) {
      setFormData({
        name: currentClinic.name || '',
        slug: currentClinic.slug || '',
        category: currentClinic.category?._id || currentClinic.category || '',
        ownerName: currentClinic.ownerName || '',
        email: currentClinic.email || '',
        phone: currentClinic.phone || '',
        gstNumber: currentClinic.gstNumber || '',
        address: currentClinic.address || '',
        logo: currentClinic.logo || '',
        isActive: currentClinic.isActive !== undefined ? currentClinic.isActive : true,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        category: '',
        ownerName: '',
        email: '',
        phone: '',
        gstNumber: '',
        address: '',
        logo: '',
        isActive: true,
      });
    }
  }, [currentClinic]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
      <h3 className="text-xl font-bold border-b pb-2">
        {currentClinic ? 'Edit Clinic Profile' : 'Onboard New Clinic'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Clinic Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-1">Unique URL Slug *</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            placeholder="e.g., apex-dental"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Healthcare Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Specialty</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Owner / Chief Medical Officer *</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Primary Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Contact Phone *</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">GST Identification Number</label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            placeholder="22AAAAA0000A1Z5"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Logo URL</label>
          <input
            type="text"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Physical Address *</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          rows="2"
          className="w-full border p-2 rounded"
        ></textarea>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isActive"
          id="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <label htmlFor="isActive" className="text-sm font-semibold">Active Operational Status</label>
      </div>

      <div className="flex space-x-2 justify-end pt-2">
        {currentClinic && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {currentClinic ? 'Save Changes' : 'Complete Registration'}
        </button>
      </div>
    </form>
  );
};

export default ClinicForm;