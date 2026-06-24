import React, { useState, useEffect } from 'react';
import AddPatientForm from './AddPatientForm';

const PatientRegistry = ({ onViewChart }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPatients = () => {
    const token = localStorage.getItem('token');
    
    fetch('/api/patients', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-clinic-id': 'clinic-alpha-77'
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server connection failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const patientList = Array.isArray(data) ? data : (data.patients || data.data || []);
        setPatients(patientList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Registry fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) return <div style={{ padding: '20px', fontWeight: 'bold' }}>Loading Clinic Records...</div>;

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      
      {/* 1. Add Patient Entry Box on Top */}
      <AddPatientForm onPatientAdded={fetchPatients} />

      {/* 2. Existing Index List Grid */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2c3e50' }}>Patient Registry Index</h3>
        
        {error && <p style={{ color: '#e67e22', background: '#fff3cd', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>⚠️ Working Offline or Missing Routes ({error})</p>}

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f2f6', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Patient Name</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Phone Identity</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Action Workflow</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', fontWeight: 'bold', color: '#34495e' }}>{patient.name}</td>
                <td style={{ padding: '12px', color: '#7f8c8d' }}>{patient.phone}</td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => onViewChart(patient._id)}
                    style={{
                      background: '#2ecc71', color: '#fff', border: 'none', padding: '8px 16px',
                      borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
                    }}
                  >
                    View Chart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientRegistry;