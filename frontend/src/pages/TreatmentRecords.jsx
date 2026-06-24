import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { authService } from '../services/authService';
import Sidebar from '../components/dashboard/Sidebar';

const TreatmentRecords = () => {
  const currentUser = authService.getCurrentUser();
  const activeClinicId = currentUser?.clinicId || '6a391e7b5d9d49d512d572d6';

  // State Context Matrix
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [records, setRecords] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Local File Tracking State
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');

  // Complete Record Creation State Form Matching TreatmentRecord Schema
  const [formData, setFormData] = useState({
    notes: '',
    procedureName: '',
    procedureCost: '',
    medicineName: '',
    dosage: '',
    frequency: '1-0-1',
    duration: '5 Days'
  });

  useEffect(() => {
    fetchCorePatientIndex();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      fetchPatientClinicalRecords(selectedPatientId);
    } else {
      setRecords([]);
    }
    // Reset file selections on patient swap
    handleClearFile();
  }, [selectedPatientId]);

  const fetchCorePatientIndex = async () => {
    try {
      const contextQuery = `?clinicId=${activeClinicId}&tenantId=${activeClinicId}`;
      const res = await apiClient.get(`/patients${contextQuery}`);
      if (res.success) setPatients(res.data || []);
    } catch (err) {
      setError('System engine failed loading base client profiles registry.');
    }
  };

  const fetchPatientClinicalRecords = async (patientId) => {
    try {
      setLoading(true);
      const contextQuery = `?clinicId=${activeClinicId}&tenantId=${activeClinicId}`;
      // Read records linked directly to this target clinic configuration block
      const res = await apiClient.get(`/treatment-records/${patientId}${contextQuery}`);
      // Fallback fallback array check to maintain functional consistency
      const rawData = res.success ? (res.data || []) : [];
      setRecords(Array.isArray(rawData) ? rawData : []);
    } catch (err) {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size error: Selected image exceeds maximum 5MB storage limit thresholds.');
      return;
    }

    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview('');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) {
      setError('Operational choice error: Select a valid target profile before committing.');
      return;
    }

    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    // Build standard multi-part form payload to carrier binary uploads alongside strings
    const multiPartForm = new FormData();
    multiPartForm.append('clinicId', activeClinicId);
    multiPartForm.append('patientId', selectedPatientId);
    multiPartForm.append('doctorId', currentUser?._id || activeClinicId);
    multiPartForm.append('notes', formData.notes);

    // Construct procedures objects if inputs aren't blank
    if (formData.procedureName) {
      const proceduresPayload = [{
        name: formData.procedureName,
        cost: Number(formData.procedureCost) || 0,
        status: 'Completed'
      }];
      multiPartForm.append('procedures', JSON.stringify(proceduresPayload));
    }

    // Construct prescription array items if names are registered
    if (formData.medicineName) {
      const prescriptionPayload = [{
        medicineName: formData.medicineName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        duration: formData.duration
      }];
      multiPartForm.append('prescriptions', JSON.stringify(prescriptionPayload));
    }

    // Attach target binary file to the upload request stream key matching your multer layer
    if (selectedFile) {
      multiPartForm.append('xray', selectedFile);
    }

    try {
      // Direct raw fetch fallback boundary since standard apiClient handles pure JSON serialization
      const token = localStorage.getItem('token');
      const targetUrl = `http://localhost:5000/api/treatment-records?clinicId=${activeClinicId}&tenantId=${activeClinicId}`;
      
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: multiPartForm
      });

      const result = await response.json();

      if (response.ok || result.success) {
        setSuccessMsg('Clinical diagnostic entry logged successfully.');
        setFormData({
          notes: '',
          procedureName: '',
          procedureCost: '',
          medicineName: '',
          dosage: '',
          frequency: '1-0-1',
          duration: '5 Days'
        });
        handleClearFile();
        fetchPatientClinicalRecords(selectedPatientId);
      } else {
        setError(result.message || 'The data validation server rejected entry fields.');
      }
    } catch (err) {
      setError('Communication break: Network failed sending binary data payloads.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinical EHR Treatment Records & Diagnostics</h1>
            <p className="text-xs text-slate-500 mt-1">Chart operations, issue prescriptions, and upload radiology digital assets onto localized storage clusters.</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-lg">⚠️ {error}</div>}
          {successMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold p-4 rounded-lg">✅ {successMsg}</div>}

          {/* Selector Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <label className="block text-3xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Select Patient For Clinical Charting *</label>
            <select value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)} className="w-full md:w-1/2 border border-slate-300 p-2.5 rounded-md text-xs bg-white outline-none font-medium text-slate-800 focus:ring-1 focus:ring-blue-500">
              <option value="">-- Choose Patient Chart --</option>
              {patients.map(p => (
                <option key={p._id} value={p._id}>{p.name} [{p.patientId || 'EMR ID'}]</option>
              ))}
            </select>
          </div>

          {selectedPatientId && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Core Entry Form Interface */}
              <form onSubmit={handleFormSubmit} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 lg:col-span-1 shadow-xs">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b pb-1.5 mb-2">Compile Treatment Record</h2>

                <div>
                  <label className="block text-3xs font-black uppercase tracking-wider text-slate-500 mb-1">Clinical Signs / Case Notes *</label>
                  <textarea name="notes" required value={formData.notes} onChange={handleInputChange} rows="3" placeholder="Describe clinical symptoms, diagnoses, or general observation states..." className="w-full border border-slate-300 p-2 rounded-md text-xs bg-slate-50 focus:bg-white outline-none resize-none"></textarea>
                </div>

                <div className="p-3.5 bg-slate-50 border rounded-lg space-y-3">
                  <span className="text-4xs font-mono font-bold uppercase tracking-widest text-slate-400 block">Procedures Tracker</span>
                  <input type="text" name="procedureName" value={formData.procedureName} onChange={handleInputChange} placeholder="Procedure Name (e.g. Tooth Scaling)" className="w-full border border-slate-300 p-2 rounded-md text-xs bg-white outline-none" />
                  <input type="number" name="procedureCost" value={formData.procedureCost} onChange={handleInputChange} placeholder="Procedure Cost Fees (INR)" className="w-full border border-slate-300 p-2 rounded-md text-xs bg-white outline-none" />
                </div>

                <div className="p-3.5 bg-slate-50 border rounded-lg space-y-2">
                  <span className="text-4xs font-mono font-bold uppercase tracking-widest text-slate-400 block">Prescription Script Engine</span>
                  <input type="text" name="medicineName" value={formData.medicineName} onChange={handleInputChange} placeholder="Medicine Name" className="w-full border border-slate-300 p-1.5 rounded-md text-xs bg-white outline-none" />
                  <div className="grid grid-cols-3 gap-1">
                    <input type="text" name="dosage" value={formData.dosage} onChange={handleInputChange} placeholder="Dosage" className="border border-slate-300 p-1 rounded-md text-3xs bg-white outline-none" />
                    <input type="text" name="frequency" value={formData.frequency} onChange={handleInputChange} placeholder="Freq" className="border border-slate-300 p-1 rounded-md text-3xs bg-white outline-none" />
                    <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="Dur" className="border border-slate-300 p-1 rounded-md text-3xs bg-white outline-none" />
                  </div>
                </div>

                {/* Secure Local Asset Media Input Section */}
                <div className="p-3.5 bg-blue-50/50 border border-dashed border-blue-200 rounded-lg space-y-2">
                  <span className="text-4xs font-mono font-black uppercase tracking-widest text-blue-600 block">Attach Radiographs / Dental X-Ray File</span>
                  
                  {!filePreview ? (
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-3xs file:font-black file:uppercase file:tracking-wider file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer" />
                  ) : (
                    <div className="space-y-2">
                      <div className="relative border rounded-md overflow-hidden bg-white max-h-32 flex items-center justify-center">
                        <img src={filePreview} alt="Staged Upload Preview" className="max-h-28 object-contain" />
                      </div>
                      <button type="button" onClick={handleClearFile} className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-4xs font-black uppercase tracking-wider p-1 rounded transition text-center border border-rose-200">
                        Drop Selected Image File
                      </button>
                    </div>
                  )}
                </div>

                <button type="submit" disabled={submitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-2.5 rounded-md text-xs uppercase tracking-wider transition shadow-sm disabled:opacity-50">
                  {submitting ? 'Locking EHR Changes...' : 'Commit Patient Record Entry'}
                </button>
              </form>

              {/* Case History Summary Matrix Stream Feed */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden lg:col-span-2 shadow-xs">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/75">
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">Historical Treatment Log Instances</h3>
                  <span className="text-3xs font-mono bg-slate-200 px-2 py-0.5 rounded font-bold uppercase text-slate-600">Total Entries: {records.length}</span>
                </div>

                <div className="p-5 space-y-6 max-h-[600px] overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-12 text-xs font-mono font-bold text-slate-400 animate-pulse">Synchronizing case histories...</div>
                  ) : records.length === 0 ? (
                    <div className="text-center py-12 text-xs text-slate-400 font-medium">No prior diagnostic or procedure logging items mapped to this file pool coordinate.</div>
                  ) : (
                    records.map((rec, index) => (
                      <div key={rec._id || index} className="border border-slate-200 rounded-xl p-4 bg-white shadow-3xs space-y-3 relative hover:border-slate-300 transition">
                        <div className="flex items-center justify-between border-b pb-2">
                          <div className="text-3xs text-slate-400 font-mono">Log ID Node: {rec._id}</div>
                          <div className="text-xs font-mono font-bold text-slate-700">{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'Today'}</div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-4xs font-mono uppercase font-black tracking-widest text-slate-400 block">Case Progress Entry</span>
                          <p className="text-xs text-slate-800 leading-relaxed font-medium bg-slate-50 p-2.5 rounded border border-slate-100">{rec.notes}</p>
                        </div>

                        {/* Split layouts if procedure items or drug allocations are explicitly compiled */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {rec.procedures && rec.procedures.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-4xs font-mono uppercase font-black tracking-widest text-slate-400 block">Procedures Applied</span>
                              <div className="bg-slate-50/50 p-2 rounded border space-y-1 text-2xs">
                                {rec.procedures.map((p, pIdx) => (
                                  <div key={pIdx} className="flex justify-between font-medium">
                                    <span className="text-slate-800">{p.name}</span>
                                    <span className="font-mono text-slate-900 font-bold">₹{p.cost}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {rec.prescriptions && rec.prescriptions.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-4xs font-mono uppercase font-black tracking-widest text-slate-400 block">Prescribed Script Schema</span>
                              <div className="bg-slate-50/50 p-2 rounded border space-y-1 text-3xs font-medium">
                                {rec.prescriptions.map((m, mIdx) => (
                                  <div key={mIdx} className="text-slate-800 flex justify-between">
                                    <span className="font-bold">{m.medicineName} ({m.dosage})</span>
                                    <span className="font-mono text-slate-500">{m.frequency} | {m.duration}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Render live cloud storage asset nodes if x-ray strings are found */}
                        {rec.xrayUrl && (
                          <div className="space-y-1.5 pt-2 border-t border-dashed">
                            <span className="text-4xs font-mono uppercase font-black tracking-widest text-blue-600 block">Linked Image Diagnostic Asset</span>
                            <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-950 p-1 max-w-sm">
                              <img 
                                src={`http://localhost:5000/${rec.xrayUrl}`} 
                                alt="Patient Clinical Radiograph Asset" 
                                className="w-full max-h-48 object-contain rounded hover:scale-105 transition duration-300 cursor-zoom-in"
                                onError={(e) => {
                                  // Fallback configuration error if local asset routing breaks
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          </div>
                        )}

                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default TreatmentRecords;