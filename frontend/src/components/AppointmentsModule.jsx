import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentsModule = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = '/api/appointments';

  const fetchAppointmentsAndPatients = async () => {
    const token = localStorage.getItem('token');
    try {
      const resAppt = await axios.get(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAppointments(resAppt.data || []);

      const resPatients = await axios.get('/api/patients', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataPatients = resPatients.data;
      const patientList = Array.isArray(dataPatients) ? dataPatients : (dataPatients.patients || []);
      setPatients(patientList);
    } catch (err) {
      console.error("Pipeline Sync Exception:", err);
      setError("Failed to fetch live updates from cluster.");
    }
  };

  useEffect(() => {
    fetchAppointmentsAndPatients();
  }, []);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedPatient || !date || !time) return;
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Session Expired: Please logout and login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        patientId: selectedPatient,
        appointmentDate: date,
        appointmentTime: time
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 201 || response.status === 200) {
        setSelectedPatient('');
        setDate('');
        fetchAppointmentsAndPatients(); 
        alert("🎉 Appointment Booked Successfully!");
      }
    } catch (err) {
      console.error("Fetch Dispatcher Broken:", err);
      alert("Network dispatcher error: Cluster update failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', display: 'flex', gap: '30px' }}>
      
      <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', height: 'fit-content' }}>
        <h3 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #f1f2f6', paddingBottom: '10px' }}>🗓️ Schedule Appointment</h3>
        <form onSubmit={handleBookAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Choose Registered Patient</label>
            <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }} required>
              <option value="">-- Dropdown Selection --</option>
              {patients.map(p => (
                <option key={p._id} value={p._id}>{p.name} ({p.phone})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Target Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} required />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Select Timed Slot</label>
            <select value={time} onChange={(e) => setTime(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:30 PM">02:30 PM</option>
              <option value="04:00 PM">04:00 PM</option>
              <option value="05:30 PM">05:30 PM</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={{ background: '#3498db', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'Processing Transaction...' : 'Confirm Operational Slot'}
          </button>
        </form>
      </div>

      <div style={{ flex: 1.5, background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #f1f2f6', paddingBottom: '10px' }}>🕒 Live Appointment Pipeline</h3>
        {error && <p style={{ color: '#e74c3c' }}>{error}</p>}
        {appointments.length === 0 ? (
          <p style={{ color: '#7f8c8d', marginTop: '15px' }}>No active bookings scheduled inside this system token segment.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
            {appointments.map((appt) => (
              <div key={appt._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '15px 20px', borderRadius: '6px', borderLeft: '5px solid #2ecc71' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '16px' }}>{appt.patientId?.name || 'Anonymous Profile'}</div>
                  <div style={{ fontSize: '13px', color: '#7f8c8d', marginTop: '3px' }}>
                    Scheduled: <strong>{appt.appointmentDate}</strong> at <span>{appt.appointmentTime}</span>
                  </div>
                </div>
                <span style={{ background: '#d4edda', color: '#155724', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                  {appt.status || "Confirmed"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AppointmentsModule;