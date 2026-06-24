import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentSchedulerModule = ({ activePatientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  
  // Doctor Filter Toggle and Date parameters hooks
  const [filterDoctor, setFilterDoctor] = useState('All Practitioners');

  const getSystemDateString = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // Booking Form Fields Hooks
  const [selectedDate, setSelectedDate] = useState(getSystemDateString()); 
  const [selectedTime, setSelectedTime] = useState('09:00 AM');
  const [treatment, setTreatment] = useState('General Check-Up');
  const [doctor, setDoctor] = useState('Dr. Emily Johnson');
  const [targetPatient, setTargetPatient] = useState('');
  
  // Rescheduling states overlay parameters
  const [editingApptId, setEditingApptId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('09:00 AM');

  const [loading, setLoading] = useState(false);

  const availableSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const fetchSchedulingData = async () => {
    try {
      const [apptRes, patientRes] = await Promise.all([
        axios.get('/api/appointments'),
        axios.get('/api/patients')
      ]);
      
      setAppointments(Array.isArray(apptRes.data) ? apptRes.data : []);
      
      let pData = [];
      if (Array.isArray(patientRes.data)) { pData = patientRes.data; }
      else if (patientRes.data && Array.isArray(patientRes.data.patients)) { pData = patientRes.data.patients; }
      else if (patientRes.data && patientRes.data.data && Array.isArray(patientRes.data.data)) { pData = patientRes.data.data; }
      
      setPatients(pData);

      if (activePatientId) { setTargetPatient(activePatientId); }
      else if (pData.length > 0) { setTargetPatient(pData[0]._id); }
    } catch (err) { console.error("Scheduler injection broken:", err); }
  };

  useEffect(() => { fetchSchedulingData(); }, [activePatientId]);

  useEffect(() => {
    if (patients.length > 0 && !targetPatient) { setTargetPatient(patients[0]._id); }
  }, [patients]);

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    let finalPatient = targetPatient;
    if (!finalPatient && patients.length > 0) { finalPatient = patients[0]._id; }

    if (!finalPatient) {
      alert("⚠️ Patient Registry dataset is empty! Head to 'Patient Registry CRM' tab first.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/appointments', {
        patientId: finalPatient, appointmentDate: selectedDate.trim(), appointmentTime: selectedTime,
        treatmentType: treatment.trim() || "General Check-Up", doctorName: doctor
      });

      if (response.data.status === 'success') {
        alert("📅 Operation Booking Slot Dispatched and Locked inside Streams!");
        fetchSchedulingData(); 
      }
    } catch (err) { alert("Network thread interception error."); }
    finally { setLoading(false); }
  };

  // 🔄 TRANSACTION ENGINE: MODIFY STATUS LAYER (Reschedule / Cancel)
  const handleModifyStatus = async (id, targetStatus, updatedDate = null, updatedTime = null) => {
    try {
      const targetMatch = appointments.find(a => a._id === id);
      const finalDate = updatedDate || targetMatch.appointmentDate;
      const finalTime = updatedTime || targetMatch.appointmentTime;

      const response = await axios.put(`/api/appointments/${id}`, {
        appointmentDate: finalDate,
        appointmentTime: finalTime,
        status: targetStatus
      });

      if (response.data.status === 'success') {
        alert(`✨ Shift Slot set state to context parameter [${targetStatus}] successfully!`);
        setEditingApptId(null);
        fetchSchedulingData();
      }
    } catch (err) { console.error("State compilation break:", err); }
  };

  // 📱 COMMUNICATION TRAFFIC ENGINE: WHATSAPP SIMULATION PUSH
  const handleTriggerNotification = async (id) => {
    try {
      const response = await axios.post(`/api/appointments/${id}/remind`);
      if (response.data.status === 'success') {
        alert(response.data.message);
      }
    } catch (err) { alert("Notification channel timeout."); }
  };

  // Doctor-wise filtering filter stream mapping selection
  const filteredAppointments = appointments.filter(appt => {
    if (filterDoctor === 'All Practitioners') return true;
    return appt.doctorName === filterDoctor;
  });

  return (
    <div style={{ fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: '25px', width: '100%' }}>
      
      {/* UPPER CONTROLLER SEGMENT: DOCTOR-WISE LIVE SWITCH BAR */}
      <div style={{ background: '#fff', padding: '15px 25px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748b' }}>🔍 Doctor Filter View:</span>
          <select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)} style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: '600', background: '#f8fafc', color: '#0f172a' }}>
            <option value="All Practitioners">All Practitioners (Global Hub View)</option>
            <option value="Dr. Emily Johnson">Dr. Emily Johnson (Pediatrician)</option>
            <option value="Dr. Michael Lee">Dr. Michael Lee (Dermatologist/Surgeon)</option>
          </select>
        </div>
        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>Active View Tracks: {filteredAppointments.length} Booked Segments</span>
      </div>

      {/* LOWER PANEL TWO-COLUMN LAYOUT CANVAS */}
      <div style={{ display: 'flex', gap: '25px' }}>
        
        {/* TIME-SLOT LOG TIMELINE MAP VIEW */}
        <div style={{ flex: 1.8, background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', marginBottom: '20px' }}>
            <h4 style={{ margin: 0, color: '#1e293b', fontSize: '15px' }}>📆 Clinical Scheduler Matrix (Interactive View)</h4>
            <input type="text" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} placeholder="DD/MM/YYYY" style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '110px', fontSize: '13px', textAlign: 'center', fontWeight: 'bold' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {availableSlots.map(slot => {
              const match = filteredAppointments.find(a => a.appointmentTime === slot && a.appointmentDate === selectedDate.trim());
              
              return (
                <div key={slot} style={{ display: 'flex', flexDirection: 'column', background: match ? (match.status === 'Cancelled' ? '#fef2f2' : '#eff6ff') : '#f8fafc', padding: '16px 20px', borderRadius: '12px', borderLeft: match ? (match.status === 'Cancelled' ? '4px solid #ef4444' : '4px solid #3b82f6') : '4px solid #cbd5e1', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '90px', fontWeight: '800', fontSize: '14px', color: '#475569' }}>{slot}</div>
                      <div>
                        {match ? (
                          <div>
                            <strong style={{ color: '#0f172a', fontSize: '14px' }}>{match.patientId?.name || 'Assigned Profile Node'}</strong>
                            <span style={{ marginLeft: '12px', fontSize: '11px', color: match.status === 'Cancelled' ? '#b91c1c' : '#2563eb', background: match.status === 'Cancelled' ? '#fee2e2' : '#dbeafe', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>{match.treatmentType}</span>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>Operator Focus: <strong>{match.doctorName}</strong></div>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>🟢 Idle Operational Slot Queue — Free to Book</span>
                        )}
                      </div>
                    </div>

                    {/* DYNAMIC CONTROLLER HOOKS IF SLOT CONTAINS ASSIGNED VALUE */}
                    {match && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {match.status !== 'Cancelled' && (
                          <>
                            <button onClick={() => { setEditingApptId(match._id); setEditDate(match.appointmentDate); setEditTime(match.appointmentTime); }} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>🔄 Reschedule</button>
                            <button onClick={() => handleModifyStatus(match._id, 'Cancelled')} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>❌ Cancel</button>
                          </>
                        )}
                        <button onClick={() => handleTriggerNotification(match._id)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>📱 WhatsApp Remind</button>
                      </div>
                    )}
                  </div>

                  {/* INLINE RESCHEDULING GRID RENDER DRAWER PANEL */}
                  {editingApptId === match?._id && (
                    <div style={{ marginTop: '12px', background: '#fff', padding: '12px', borderRadius: '8px', border: '1px dashed #f59e0b', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input type="text" value={editDate} onChange={(e) => setEditDate(e.target.value)} style={{ padding: '5px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px', width: '90px' }} />
                      <select value={editTime} onChange={(e) => setEditTime(e.target.value)} style={{ padding: '5px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}>
                        {availableSlots.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button onClick={() => handleModifyStatus(match._id, 'Confirmed', editDate, editTime)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>💾 Commit Change</button>
                      <button onClick={() => setEditingApptId(null)} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Close</button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* CASE APPOINTMENT CREATION PANEL */}
        <div style={{ flex: 1, background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h4 style={{ marginTop: 0, color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', fontSize: '15px' }}>⚡ Book New Shift Slot</h4>
          
          <form onSubmit={handleCreateAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Select Case Patient Profile:</label>
              <select value={targetPatient} onChange={(e) => setTargetPatient(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>
                {patients.length === 0 ? ( <option value="">No patients available</option> ) : (
                  patients.map(p => ( <option key={p._id} value={p._id}>{p.name || "Unknown"} ({p.patientId || "No ID"})</option> ))
                )}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Target Shift Time Window:</label>
              <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '13px' }}>
                {availableSlots.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Assigned Practitioner Clinician:</label>
              <select value={doctor} onChange={(e) => setDoctor(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '13px' }}>
                <option value="Dr. Emily Johnson">Dr. Emily Johnson (Pediatrician)</option>
                <option value="Dr. Michael Lee">Dr. Michael Lee (Dermatologist/Surgeon)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Clinical Procedure Intent:</label>
              <input type="text" value={treatment} onChange={(e) => setTreatment(e.target.value)} placeholder="e.g. Scaling / Bridge Placement" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
            </div>

            <button type="submit" disabled={loading} style={{ padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '5px' }}>
              {loading ? "Allocating Slot Matrices..." : "📅 Dispatch and Lock Shift Slot"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AppointmentSchedulerModule;