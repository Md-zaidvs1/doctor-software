import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientRegistryModule = ({ onSelectPatient, activePatientId }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [selectedHistories, setSelectedHistories] = useState([]);
  
  const availableTags = ["Diabetes", "Hypertension", "Cardiac Issue", "Bleeding Disorder", "Drug Allergy"];

  // Find the currently selected patient's full object to display details
  const selectedPatientData = patients.find(p => 
    (p.patientId && String(p.patientId) === String(activePatientId)) || 
    (p._id && String(p._id) === String(activePatientId))
  );

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/patients').catch(() => ({ data: [] }));
      if (Array.isArray(res.data)) {
        setPatients(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleTagToggle = (tag) => {
    if (selectedHistories.includes(tag)) {
      setSelectedHistories(selectedHistories.filter(t => t !== tag));
    } else {
      setSelectedHistories([...selectedHistories, tag]);
    }
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !age) return alert("Please fill fields!");

    const safePatientId = "PT-" + Math.floor(100000 + Math.random() * 900000);
    const payload = { patientId: safePatientId, name, phone, age: Number(age), gender, medicalHistory: selectedHistories };

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/patients', payload);
      alert(`🎉 Patient File Created: ${safePatientId}`);
      
      if (response.data && response.data.patientId) {
        onSelectPatient(response.data.patientId);
      } else {
        onSelectPatient(safePatientId);
      }
      
      setName(''); setPhone(''); setAge(''); setSelectedHistories([]);
      fetchPatients();
    } catch (err) {
      alert("Error saving patient file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.2fr', gap: '20px', marginTop: '10px' }}>
      
      {/* 1. REGISTRATION FORM CHIP */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.01)' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#0f172a', fontWeight: 'bold', fontSize: '14px' }}>➕ Register Patient</h4>
        <form onSubmit={handlePatientSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} required />
          <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} required />
          <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} required />
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '13px' }}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '5px' }}>
            {availableTags.map(tag => {
              const isSelected = selectedHistories.includes(tag);
              return (
                <button type="button" key={tag} onClick={() => handleTagToggle(tag)} style={{
                  padding: '5px 10px', borderRadius: '20px', border: isSelected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                  background: isSelected ? '#eff6ff' : '#fff', color: isSelected ? '#2563eb' : '#475569', fontSize: '11px', cursor: 'pointer'
                }}>{tag}</button>
              );
            })}
          </div>
          <button type="submit" style={{ padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', marginTop: '5px' }}>💾 Create File</button>
        </form>
      </div>

      {/* 2. DIRECTORY MASTER LIST */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', maxHeight: '75vh', overflowY: 'auto' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#0f172a', fontWeight: 'bold', fontSize: '14px' }}>📑 Registered Patient Directory</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {patients.map(p => {
            const currentIdMatch = p.patientId || p._id;
            const isSelected = activePatientId && String(currentIdMatch) === String(activePatientId);

            return (
              <div key={p._id || p.patientId} onClick={() => onSelectPatient(currentIdMatch)} style={{
                padding: '15px', borderRadius: '12px',
                border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                background: isSelected ? '#f0f6ff' : '#fff', cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: isSelected ? '#2563eb' : '#0f172a', fontSize: '13px' }}>👤 {p.name}</strong>
                  <span style={{ fontSize: '10px', background: isSelected ? '#2563eb' : '#e2e8f0', padding: '2px 6px', borderRadius: '6px', color: isSelected ? '#fff' : '#475569', fontWeight: 'bold' }}>{p.patientId || 'NEW'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 🔥 NEW: SEPARATE PATIENT DETAILS BOX (DRAWER) */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#0f172a', fontWeight: 'bold', fontSize: '14px' }}>📋 Patient File Live Details View</h4>
        
        {selectedPatientData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '5px' }}>👤</div>
              <h3 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '18px', fontWeight: 'bold' }}>{selectedPatientData.name}</h3>
              <span style={{ fontSize: '11px', background: '#2563eb', color: '#fff', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>{selectedPatientData.patientId}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#334155' }}>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}><strong>📞 Phone:</strong> {selectedPatientData.phone}</div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}><strong>🎂 Age:</strong> {selectedPatientData.age} Years</div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}><strong>⚥ Gender:</strong> {selectedPatientData.gender}</div>
            </div>

            {/* Medical Conditions Badges */}
            <div style={{ marginTop: '5px' }}>
              <strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '8px' }}>📋 Medical Risk Factors / History:</strong>
              {selectedPatientData.medicalHistory && selectedPatientData.medicalHistory.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedPatientData.medicalHistory.map(h => (
                    <span key={h} style={{ fontSize: '10px', background: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold', border: '1px solid #fca5a5' }}>⚠️ {h}</span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '12px', color: '#94a3b8', italic: 'true' }}>No systemic conditions reported. (Fit for treatment)</span>
              )}
            </div>
            
            <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '11px', color: '#1e40af', fontWeight: 'bold', marginTop: '10px', textAlign: 'center' }}>
              🎯 Patient file is active. Ready for GST Billing or Scheduler modules!
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70%', color: '#94a3b8', textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>👈</div>
            <p style={{ fontSize: '13px', margin: 0 }}>Please click any patient card from the middle registry to open their clinical details file box.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default PatientRegistryModule;