import React, { useState, useEffect } from 'react';

const PlanForm = ({ currentPlan, onFormSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: 'Trial',
    price: 0,
    billingCycle: 'Monthly',
    staffLimit: 3,
    patientLimit: 100,
    storageLimitGb: 5,
    features: '',
    isActive: true,
  });

  useEffect(() => {
    if (currentPlan) {
      setFormData({
        name: currentPlan.name || 'Trial',
        price: currentPlan.price || 0,
        billingCycle: currentPlan.billingCycle || 'Monthly',
        staffLimit: currentPlan.limits?.staffLimit ?? 3,
        patientLimit: currentPlan.limits?.patientLimit ?? 100,
        storageLimitGb: currentPlan.limits?.storageLimitGb ?? 5,
        features: currentPlan.features ? currentPlan.features.join(', ') : '',
        isActive: currentPlan.isActive !== undefined ? currentPlan.isActive : true,
      });
    } else {
      setFormData({
        name: 'Trial',
        price: 0,
        billingCycle: 'Monthly',
        staffLimit: 3,
        patientLimit: 100,
        storageLimitGb: 5,
        features: '',
        isActive: true,
      });
    }
  }, [currentPlan]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      name: formData.name,
      price: Number(formData.price),
      billingCycle: formData.billingCycle,
      limits: {
        staffLimit: Number(formData.staffLimit),
        patientLimit: Number(formData.patientLimit),
        storageLimitGb: Number(formData.storageLimitGb),
      },
      features: formData.features.split(',').map((f) => f.trim()).filter((f) => f !== ''),
      isActive: formData.isActive,
    };
    onFormSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
      <h3 className="text-xl font-bold border-b pb-2">
        {currentPlan ? 'Modify Tier Matrix' : 'Establish New SaaS Plan Configuration'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Tier Name Placement *</label>
          <select
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!!currentPlan}
            className="w-full border p-2 rounded bg-gray-50 disabled:opacity-70"
          >
            <option value="Trial">Trial</option>
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Price Billing (INR) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Cycle Duration *</label>
          <select
            name="billingCycle"
            value={formData.billingCycle}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Max Authorized Staff (-1 = No Cap) *</label>
          <input
            type="number"
            name="staffLimit"
            value={formData.staffLimit}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Max Unique Patients (-1 = No Cap) *</label>
          <input
            type="number"
            name="patientLimit"
            value={formData.patientLimit}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Cloud Storage Limit (GB) *</label>
          <input
            type="number"
            name="storageLimitGb"
            value={formData.storageLimitGb}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Enabled SaaS System Features (Separated by Commas)</label>
        <input
          type="text"
          name="features"
          value={formData.features}
          onChange={handleChange}
          placeholder="Appointments, Billing, Treatment Records, API Portal"
          className="w-full border p-2 rounded"
        />
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
        <label htmlFor="isActive" className="text-sm font-semibold">Public Tier Availability</label>
      </div>

      <div className="flex space-x-2 justify-end pt-2">
        {currentPlan && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel Modification
          </button>
        )}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {currentPlan ? 'Update Plan Metrics' : 'Deploy Global Configuration'}
        </button>
      </div>
    </form>
  );
};

export default PlanForm;