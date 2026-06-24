import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { authService } from '../services/authService';
import Sidebar from '../components/dashboard/Sidebar';

const StaffManagement = () => {
  const currentUser = authService.getCurrentUser();
  
  // State Matrix Configurations
  const [clinics, setClinics] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Unified Multi-Tenant Payload State Map
  const [formData, setFormData] = useState({
    clinicId: currentUser?.clinicId || '',
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'Receptionist',
    specialization: '',
    isActive: true
  });

  // Fetch contextual arrays on mounting phases
  useEffect(() => {
    fetchClinicsMatrix();
    fetchStaffRegistry();
  }, []);

  const fetchClinicsMatrix = async () => {
    try {
      // Developers or Global Admin users load full relational arrays
      const res = await apiClient.get('/clinics');
      if (res.success && Array.isArray(res.data)) {
        setClinics(res.data);
      } else if (res.success && res.data) {
        setClinics([res.data]);
      }
    } catch (err) {
      console.error('Error loading tenant lists:', err);
    }
  };

  const fetchStaffRegistry = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/staff');
      if (res.success) {
        setStaffList(res.data || []);
      }
    } catch (err) {
      setError('Failed to fetch operational roster indices.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.clinicId) {
      setError('A valid Clinic Tenant assignment path parameter is required.');
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.post('/staff', formData);
      if (res.success) {
        setSuccessMsg(`Successfully onboarded ${formData.name} completely!`);
        // Reset local text fields cleanly
        setFormData(prev => ({
          ...prev,
          name: '',
          email: '',
          password: '',
          phone: '',
          specialization: ''
        }));
        fetchStaffRegistry(); // Hot-reload datatable layout
      } else {
        setError(res.message || 'Validation intercept failure inside pipeline.');
      }
    } catch (err) {
      setError('Network request error processing identity registration paths.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const res = await apiClient.put(`/staff/${id}`, { isActive: !currentStatus });
      if (res.success) {
        fetchStaffRegistry();
      }
    } catch (err) {
      setError('Could not complete operation cycle on the identity key entry.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Structural Framework Navigation Anchor Panel */}
      <Sidebar />

      {/* Main Viewport Grid Interface Area */}
      <main className="flex-1 p-8 overflow-y-auto font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Global Staff & Clinical Role Governance Node</h1>
            <p className="text-xs text-slate-500 mt-1">Configure systemic access matrix parameters across Doctors, Admins, and Front-Desk Operators.</p>
          </div>

          {/* Feedback Overlay Alerts Banner */}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-lg">⚠️ {error}</div>}
          {successMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold p-4 rounded-lg">✅ {successMsg}</div>}

          {/* Creation Block Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-4 border-b pb-2">Register Medical/Operations Staff</h2>
            
            <form onSubmit={handleOnboardSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Clinic Tenant Location Assignment *</label>
                {/* UNLOCKED: disabled attribute completely removed so you can change clinics on the fly */}
                <select
                  name="clinicId"
                  value={formData.clinicId}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Choose Assigned Active Clinic Partition --</option>
                  {clinics.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Identity Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Dr. Alex Mercer"
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Credential Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@clinicdomain.com"
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Portal Access Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Mobile Contact Number *</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 9876543210"
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">System Architecture Permission Access Level Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Receptionist">Receptionist</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Specialty Scope (Optional for Doctors)</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  placeholder="e.g. Orthodontics, Pediatrics"
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-slate-600">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span>Active Staff Status Permit</span>
                </label>
              </div>

              <div className="md:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
                >
                  {loading ? 'Processing Parameters...' : 'Authorize & Onboard Account'}
                </button>
              </div>
            </form>
          </div>

          {/* Roster Registry Matrix Data Table View */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/75">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Roster Tracking Registry</h3>
              <span className="text-3xs font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-600">Records Total: {staffList.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/50 border-b border-slate-200 text-3xs font-bold uppercase tracking-widest text-slate-500">
                    <th className="p-4">Identity Structure</th>
                    <th className="p-4">Clinic Tenant Assignment</th>
                    <th className="p-4">Access Scope Role</th>
                    <th className="p-4">Specialty Scope</th>
                    <th className="p-4">Contact Interface</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                  {staffList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-400 font-medium">No system personnel records returned matching active query parameters configuration.</td>
                    </tr>
                  ) : (
                    staffList.map(staff => (
                      <tr key={staff._id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-bold text-slate-900">{staff.name}</td>
                        <td className="p-4">
                          <span className="bg-blue-50 text-blue-700 text-3xs font-bold px-2 py-0.5 rounded tracking-wide uppercase border border-blue-100">
                            {staff.clinicId?.name || staff.clinicId || 'System Managed'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-3xs font-bold px-2 py-0.5 rounded ${
                            staff.role === 'Admin' ? 'bg-red-50 text-red-700' :
                            staff.role === 'Doctor' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {staff.role}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-500 text-2xs">{staff.specialization || 'N/A (Operational)'}</td>
                        <td className="p-4 space-y-0.5">
                          <div className="font-semibold text-slate-600">{staff.email}</div>
                          <div className="text-slate-400 font-mono text-3xs">{staff.phone || 'No Mobile Link'}</div>
                        </td>
                        <td className="p-4">
                          <span className={`text-3xs font-bold uppercase tracking-wider ${staff.isActive ? 'text-emerald-600' : 'text-rose-500'}`}>
                            ● {staff.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="p-4 text-center space-x-2">
                          <button 
                            type="button"
                            onClick={() => handleStatusToggle(staff._id, staff.isActive)}
                            className={`text-2xs font-bold uppercase tracking-wider hover:underline ${staff.isActive ? 'text-rose-600' : 'text-emerald-600'}`}
                          >
                            {staff.isActive ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default StaffManagement;