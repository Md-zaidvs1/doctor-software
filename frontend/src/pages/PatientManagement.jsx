import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { authService } from '../services/authService';
import Sidebar from '../components/dashboard/Sidebar';

const PatientManagement = () => {
  const currentUser = authService.getCurrentUser();

  const activeClinicId =
    currentUser?.clinicId?._id ||
    currentUser?.clinicId ||
    '6a391e7b5d9d49d512d572d6';

  const userRole = currentUser?.role || 'Admin';

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    dob: '',
    phone: '',
    email: '',
    bloodGroup: 'O+',
    address: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
  });

  useEffect(() => {
    fetchPatientRegistry();
  }, []);

  const fetchPatientRegistry = async () => {
    try {
      setLoading(true);
      setError('');

      let path = '/patients';
      if (searchTerm.trim()) {
        path += `?search=${encodeURIComponent(searchTerm.trim())}`;
      }

      const res = await apiClient.get(path, {
        headers: {
          'x-user-role': userRole,
          'x-clinic-tenant-id': activeClinicId,
        },
      });

      if (res.success) {
        setPatients(res.data || []);
      } else {
        setError(res.message || 'Failed to fetch patient records.');
      }
    } catch (err) {
      setError('Could not sync patient records from database.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmergencyChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [name]: value },
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPatientRegistry();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setTimeout(() => {
      fetchPatientRegistry();
    }, 10);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      setLoading(true);

      const payload = {
        ...formData,
        clinicId: activeClinicId,
      };

      const res = await apiClient.post('/patients', payload, {
        headers: {
          'x-user-role': userRole,
          'x-clinic-tenant-id': activeClinicId,
        },
      });

      if (res.success) {
        setSuccessMsg(`Patient record created successfully for ${formData.name}`);
        setFormData({
          name: '',
          gender: 'Male',
          dob: '',
          phone: '',
          email: '',
          bloodGroup: 'O+',
          address: '',
          emergencyContact: { name: '', relationship: '', phone: '' },
        });
        setSearchTerm('');
        fetchPatientRegistry();
      } else {
        setError(res.message || 'Failed to create patient record.');
      }
    } catch (err) {
      setError('Network error while saving patient record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto font-sans">
        <div className="max-w-6xl mx-auto space-y-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Patient Registration</h1>
              <p className="text-xs text-slate-500 mt-1">Manage patient health profiles and demographic records.</p>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-slate-300 pl-3 pr-8 py-2 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-blue-500 w-64 font-medium"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2.5 top-2.5 text-slate-400 text-xs font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition"
              >
                Search
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-lg">
              ⚠️ {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold p-4 rounded-lg">
              ✅ {successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            <form
              onSubmit={handleRegisterSubmit}
              className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 lg:col-span-1 shadow-sm"
            >
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b pb-1.5 mb-2">
                New Patient Intake
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full border border-slate-300 p-2 rounded-md text-xs bg-slate-50 focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 p-2 rounded-md text-xs bg-white outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 p-2 rounded-md text-xs bg-white outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  required
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 p-2 rounded-md text-xs bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Phone *</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. 9988776655"
                  className="w-full border border-slate-300 p-2 rounded-md text-xs bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="patient@domain.com"
                  className="w-full border border-slate-300 p-2 rounded-md text-xs bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Address</label>
                <textarea
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Full street address..."
                  className="w-full border border-slate-300 p-2 rounded-md text-xs bg-slate-50 resize-none"
                />
              </div>

              <div className="border-t pt-3 space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 block">
                  Emergency Contact
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.emergencyContact.name}
                  onChange={handleEmergencyChange}
                  placeholder="Contact Name"
                  className="w-full border border-slate-300 p-2 rounded-md text-xs bg-slate-50"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleEmergencyChange}
                    placeholder="Relationship"
                    className="w-full border border-slate-300 p-1.5 rounded-md text-xs bg-slate-50"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleEmergencyChange}
                    placeholder="Phone"
                    className="w-full border border-slate-300 p-1.5 rounded-md text-xs bg-slate-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2.5 rounded-md text-xs uppercase tracking-wider transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Register Patient'}
              </button>
            </form>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden lg:col-span-2 shadow-sm">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">Patient Records</h3>
                <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold uppercase border border-blue-100">
                  Total: {patients.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-500">
                      <th className="p-4">Patient ID / Name</th>
                      <th className="p-4">Demographics</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Emergency</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                    {patients.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-12 text-center text-slate-400 font-medium">
                          No patient records found.
                        </td>
                      </tr>
                    ) : (
                      patients.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50 transition">
                          <td className="p-4">
                            <div className="text-xs font-mono font-bold text-blue-600 uppercase bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded inline-block mb-1">
                              {p.patientId || 'N/A'}
                            </div>
                            <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                          </td>
                          <td className="p-4 space-y-0.5">
                            <div>
                              <span className="text-slate-400">Gender:</span>{' '}
                              <span className="font-bold">{p.gender}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Blood:</span>{' '}
                              <span className="font-mono bg-slate-100 text-slate-700 px-1 rounded font-bold">
                                {p.bloodGroup || 'N/A'}
                              </span>
                            </div>
                            <div className="text-slate-400 font-mono">
                              {p.dob ? new Date(p.dob).toLocaleDateString() : 'No DOB'}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-700">{p.phone}</div>
                            <div className="text-slate-400 truncate max-w-[150px]">
                              {p.email || 'No email'}
                            </div>
                          </td>
                          <td className="p-4 text-xs text-slate-600">
                            {p.emergencyContact?.name ? (
                              <div>
                                <div className="font-bold text-slate-800">{p.emergencyContact.name}</div>
                                <div className="text-slate-400">
                                  {p.emergencyContact.relationship} · {p.emergencyContact.phone}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-300 italic">Not set</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                (window.location.hash = `/appointments?patientId=${p._id}`)
                              }
                              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold px-2.5 py-1 text-xs uppercase tracking-wider rounded transition"
                            >
                              Book
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
        </div>
      </main>
    </div>
  );
};

export default PatientManagement;