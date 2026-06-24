import React, { useState, useEffect } from 'react';
import ClinicForm from '../components/clinics/ClinicForm';
import ClinicList from '../components/clinics/ClinicList';
import { clinicService } from '../services/clinicService';

const Clinics = () => {
  const [clinics, setClinics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentClinic, setCurrentClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch clinics
      const clinicRes = await clinicService.getClinics();
      if (clinicRes.success) {
        setClinics(clinicRes.data);
      } else {
        setError(clinicRes.message || 'Failed to populate clinics');
      }

      // Fetch categories from existing endpoint
      const catResponse = await fetch('http://localhost:5000/api/categories');
      const catData = await catResponse.json();
      if (Array.isArray(catData)) {
        setCategories(catData);
      } else if (catData.success && Array.isArray(catData.data)) {
        setCategories(catData.data);
      }
    } catch (err) {
      setError('System connection error. Verify your multi-clinic backend infrastructure endpoints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      let result;
      if (currentClinic) {
        result = await clinicService.updateClinic(currentClinic._id, formData);
      } else {
        result = await clinicService.createClinic(formData);
      }

      if (result.success) {
        setCurrentClinic(null);
        loadData();
      } else {
        alert(result.message || 'Validation or runtime execution failure.');
      }
    } catch (err) {
      alert('Error updating system configurations.');
    }
  };

  const handleEdit = (clinic) => {
    setCurrentClinic(clinic);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you certain you want to isolate and completely purge this system database asset profile?')) {
      try {
        const result = await clinicService.deleteClinic(id);
        if (result.success) {
          loadData();
        } else {
          alert(result.message);
        }
      } catch (err) {
        alert('Error purging profile record.');
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Clinic Infrastructure Profiles</h2>
        <p className="text-sm text-gray-500">Configure global multi-tenant clinic structures and specialized assignments.</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <ClinicForm
        currentClinic={currentClinic}
        onFormSubmit={handleFormSubmit}
        categories={categories}
        onCancel={() => setCurrentClinic(null)}
      />

      {loading ? (
        <div className="text-center font-medium text-gray-600">Retrieving operational architecture matrices...</div>
      ) : (
        <ClinicList clinics={clinics} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Clinics;