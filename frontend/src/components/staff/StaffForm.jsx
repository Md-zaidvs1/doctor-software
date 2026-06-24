import React, { useState, useEffect } from 'react';

const StaffForm = ({ currentStaff, clinics, onFormSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    clinicId: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'Receptionist',
    specialization: '',
    isActive: true,
  });

  useEffect(() => {
    if (currentStaff) {
      setFormData({
        clinicId: currentStaff.clinicId?._id || currentStaff.clinicId || '',
        name: currentStaff.name || '',
        email: currentStaff.email || '',
        password: '', // Kept empty unless explicit override is needed
        phone: currentStaff.phone || '',
        role: currentStaff.role || 'Receptionist',
        specialization: currentStaff.specialization || '',
        isActive: currentStaff.isActive !== undefined ? currentStaff.isActive : true,
      });
    } else {
      setFormData({
        clinicId: clinics[0]?._id || '',
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'Receptionist',
        specialization: '',
        isActive: true,
      });
    }
  }, [currentStaff, clinics]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentStaff && !formData.password) {
      alert('Password criteria configuration is mandatory for initial registration routing.');
      return;
    }
    onFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
      <h3 className="text-xl font-bold border-b pb-2">
        {currentStaff ? `Edit Profile: ${formData.name}` : 'Register Medical/Operations Staff'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Clinic Tenant Location Assignment *</label>
          <select
            name="clinicId"
            value={formData.clinicId}
            onChange={handleChange}
            required
            disabled={!!currentStaff}
            className="w-full border p-2 rounded bg-gray-50 disabled:opacity-75"
          >
            <option value="">Choose Targeted Clinic Platform</option>
            {clinics.map((clinic) => (
              <option key={clinic._id} value={clinic._id}>
                {clinic.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Full Identity Name *</label>
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
          <label className="block text-sm font-semibold mb-1">Credential Email Address *</label>
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
          <label className="block text-sm font-semibold mb-1">
            {currentStaff ? 'Change Authentication Password (Leave blank to keep same)' : 'Portal Access Password *'}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!currentStaff}
            placeholder={currentStaff ? "••••••••" : "Minimum 6 characters"}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Mobile Contact Number *</label>
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
          <label className="block text-sm font-semibold mb-1">System Architecture Permission Access Level Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Admin">Admin</option>
            <option value="Doctor">Doctor</option>
            <option value="Receptionist">Receptionist</option>
          </select>
        </div>
      </div>

      {formData.role === 'Doctor' && (
        <div>
          <label className="block text-sm font-semibold mb-1">Clinical Area Specialization *</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
            placeholder="e.g., Dental Surgeon, Orthopedic Consultant"
            className="w-full border p-2 rounded"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isActive"
          id="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <label htmlFor="isActive" className="text-sm font-semibold">Active Staff Status Permit</label>
      </div>

      <div className="flex space-x-2 justify-end pt-2">
        {currentStaff && (
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
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          {currentStaff ? 'Save Changes Profile' : 'Authorize & Onboard Account'}
        </button>
      </div>
    </form>
  );
};

export default StaffForm;