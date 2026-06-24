import React, { useState } from 'react';
import { apiClient } from '../utils/apiClient';

const OnboardingSetup = ({ onSetupComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [setupData, setSetupData] = useState({
    clinicName: '',
    category: 'Dental', // Default sector option match
    adminName: 'Master Administrator',
    adminEmail: '',
    adminPassword: '',
    licenseKey: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSetupData(prev => ({ ...prev, [name]: value }));
  };

  const handleInitialSetupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    // Basic frontend authorization code validation check to prevent accidental usage
    if (setupData.licenseKey.trim().length < 8) {
      setError('Licensing validation failure: Enter a valid production-tier product key.');
      setLoading(false);
      return;
    }

    try {
      // 1. Initialize the new clinic tenant profile space on the backend cloud repository
      const clinicPayload = {
        name: setupData.clinicName,
        category: setupData.category,
        isActive: true
      };

      const clinicRes = await apiClient.post('/onboarding/create-clinic', clinicPayload);
      
      if (!clinicRes.success || !clinicRes.data?._id) {
        setError(clinicRes.message || 'Failed to instantiate unique workspace partition node.');
        setLoading(false);
        return;
      }

      const generatedClinicId = clinicRes.data._id;

      // 2. Generate the local admin user credential profile bound cleanly to that brand new ID
      const staffPayload = {
        clinicId: generatedClinicId,
        name: setupData.adminName,
        email: setupData.adminEmail,
        password: setupData.adminPassword,
        role: 'Admin',
        isActive: true
      };

      const staffRes = await apiClient.post('/onboarding/create-admin', staffPayload);

      if (staffRes.success) {
        setSuccessMsg('System workspace deployed successfully!');
        
        // Save the hardware environment configuration context locally inside the desktop shell storage
        localStorage.setItem('local_clinic_id', generatedClinicId);
        localStorage.setItem('local_clinic_category', setupData.category);
        localStorage.setItem('activation_license_token', setupData.licenseKey);

        // Alert the parent state controller to swap routes instantly
        setTimeout(() => {
          onSetupComplete(generatedClinicId);
        }, 1500);
      } else {
        setError(staffRes.message || 'Failed to seed local master credentials.');
      }
    } catch (err) {
      setError('Critical context execution exception during system schema seeding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans select-none">
      <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-5 shadow-2xl">
        
        {/* Onboarding Header Title */}
        <div className="text-center space-y-1 border-b pb-3">
          <div className="text-2xl">🌳</div>
          <h1 className="text-base font-black uppercase tracking-tight text-slate-900">Plant2Tree Setup Engine</h1>
          <p className="text-4xs font-mono font-bold tracking-widest text-slate-400 uppercase">Hardware Localization Environment Seeder</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-3xs font-bold p-3 rounded-md">⚠️ {error}</div>}
        {successMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-3xs font-bold p-3 rounded-md">✅ {successMsg}</div>}

        <form onSubmit={handleInitialSetupSubmit} className="space-y-3.5">
          
          <div>
            <label className="block text-4xs font-black uppercase tracking-wider text-slate-500 mb-1">Clinic / Hospital Workspace Name *</label>
            <input type="text" name="clinicName" required value={setupData.clinicName} onChange={handleInputChange} placeholder="e.g. Apex Dental Hub" className="w-full border border-slate-300 p-2 rounded-md text-xs bg-slate-50 focus:bg-white outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800" />
          </div>

          <div>
            <label className="block text-4xs font-black uppercase tracking-wider text-slate-500 mb-1">Clinical Domain Framework Category *</label>
            <select name="category" value={setupData.category} onChange={handleInputChange} className="w-full border border-slate-300 p-2 rounded-md text-xs bg-white outline-none font-medium text-slate-800 focus:ring-1 focus:ring-blue-500">
              <option value="Dental">Dental Care Engine</option>
              <option value="ENT">ENT Diagnostics Platform</option>
              <option value="Eye">Ophthalmology Vision Suite</option>
              <option value="Ortho">Orthopedic Framework</option>
              <option value="General">General Practice Practitioner</option>
            </select>
          </div>

          <div className="border-t border-dashed pt-3 mt-2 space-y-3">
            <span className="text-4xs font-mono font-black uppercase tracking-widest text-slate-400 block">Deploy Local Admin Access</span>
            
            <div>
              <input type="email" name="adminEmail" required value={setupData.adminEmail} onChange={handleInputChange} placeholder="Admin Email Login Username" className="w-full border border-slate-300 p-2 rounded-md text-xs bg-slate-50 focus:bg-white outline-none text-slate-800" />
            </div>
            <div>
              <input type="password" name="adminPassword" required value={setupData.adminPassword} onChange={handleInputChange} placeholder="Set Master Security Password" className="w-full border border-slate-300 p-2 rounded-md text-xs bg-slate-50 focus:bg-white outline-none text-slate-800" />
            </div>
          </div>

          <div className="border-t border-dashed pt-3 mt-2">
            <label className="block text-4xs font-black uppercase tracking-wider text-blue-600 mb-1">Product Activation Key *</label>
            <input type="text" name="licenseKey" required value={setupData.licenseKey} onChange={handleInputChange} placeholder="P2T-XXXX-XXXX-XXXX" className="w-full border border-blue-200 p-2 rounded-md text-xs bg-blue-50/50 uppercase font-mono tracking-wider focus:bg-white outline-none text-slate-900 font-bold" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black p-2.5 rounded-md text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50">
            {loading ? 'Seeding Multi-Tenant Node...' : 'Authorize & Launch Software'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default OnboardingSetup;