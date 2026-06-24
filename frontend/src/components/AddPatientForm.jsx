import React, { useState } from 'react';

const AddPatientForm = ({ onPatientAdded }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Male');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');

    // Split history by comma into an array for the backend
    const historyArray = medicalHistory 
      ? medicalHistory.split(',').map(item => item.trim()) 
      : [];

    const payload = {
      name,
      phone,
      email,
      dateOfBirth, // Backend requires this!
      gender,
      medicalHistory: historyArray
    };

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register patient');
      }

      setMessage('🎉 Patient Registered Successfully!');
      setName('');
      setPhone('');
      setEmail('');
      setDateOfBirth('');
      setMedicalHistory('');
      
      if (onPatientAdded) onPatientAdded();
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '25px', fontFamily: 'sans-serif' }}>
      <h3 style={{ marginTop: 0, color: '#2c3e50' }}>➕ Add New Patient Record</h3>
      
      {message && <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', background: message.includes('❌') ? '#f8d7da' : '#d4edda', color: message.includes('❌') ? '#721c24' : '#155724', fontWeight: 'bold' }}>{message}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Full Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} placeholder="Ramesh Kumar" required />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Phone Number *</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} placeholder="+91 9876543210" required />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} placeholder="ramesh@gmail.com" />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Date of Birth *</label>
          <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Medical History (Comma Separated)</label>
          <input type="text" value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} placeholder="Diabetes, Hypertension" />
        </div>

        <button type="submit" disabled={loading} style={{ gridColumn: 'span 2', background: '#3498db', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'Saving Patient...' : 'Save Patient Details'}
        </button>
      </form>
    </div>
  );
};

export default AddPatientForm;