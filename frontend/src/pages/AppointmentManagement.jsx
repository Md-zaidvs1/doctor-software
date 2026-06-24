import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { authService } from '../services/authService';
import Sidebar from '../components/dashboard/Sidebar';

const AppointmentManagement = () => {
  const currentUser = authService.getCurrentUser();
  const activeClinicId = currentUser?.clinicId || '6a391e7b5d9d49d512d572d6';

  // Core Data States
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Calendar Context Engine States
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);

  // Intake Form State matching backend schema
  const [formData, setFormData] = useState({
    patientId: '',
    time: '10:00',
    reason: '',
    status: 'Scheduled'
  });

  useEffect(() => {
    fetchClinicalSchedulerMatrix();
  }, []);

  const fetchClinicalSchedulerMatrix = async () => {
    try {
      setLoading(true);
      setError('');
      const contextQuery = `?clinicId=${activeClinicId}&tenantId=${activeClinicId}`;

      const [appointmentsRes, patientsRes] = await Promise.all([
        apiClient.get(`/appointments${contextQuery}`),
        apiClient.get(`/patients${contextQuery}`)
      ]);

      if (appointmentsRes.success) setAppointments(appointmentsRes.data || []);
      if (patientsRes.success) setPatients(patientsRes.data || []);
    } catch (err) {
      setError('System failure parsing operational clinical calendars channels.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const payload = {
      clinicId: activeClinicId,
      patientId: formData.patientId,
      date: selectedDateStr,
      time: formData.time,
      reason: formData.reason,
      status: formData.status
    };

    try {
      setLoading(true);
      const res = await apiClient.post('/appointments', payload);
      if (res.success) {
        setSuccessMsg(`Session registered securely inside system timeline slots.`);
        setFormData({ patientId: '', time: '10:00', reason: '', status: 'Scheduled' });
        fetchClinicalSchedulerMatrix();
      } else {
        setError(res.message || 'Pipeline rejected booking instance parameters.');
      }
    } catch (err) {
      setError('Network validation failure committing appointment vectors.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, nextStatus) => {
    try {
      const res = await apiClient.put(`/appointments/${id}`, { clinicId: activeClinicId, status: nextStatus });
      if (res.success) fetchClinicalSchedulerMatrix();
    } catch (err) {
      setError('Could not modify timeline node status state.');
    }
  };

  // Calendar Logic Operations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
  const leadingBlanks = Array.from({ length: firstDayIndex }, (_, i) => null);
  const calendarCells = [...leadingBlanks, ...daysArray];

  const changeMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  // Filter queue displays matching focal selected index date
  const selectedDayAppointments = appointments.filter(app => {
    if (!app.date) return false;
    const target = new Date(app.date).toISOString().split('T')[0];
    return target === selectedDateStr;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Scheduler & Calendar View</h1>
            <p className="text-xs text-slate-500 mt-1">Track patient flow channels, schedule intakes, and coordinate multi-role staff streams.</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-lg">⚠️ {error}</div>}
          {successMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold p-4 rounded-lg">✅ {successMsg}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Column 1: Interactive Grid Calendar */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-sm font-black uppercase text-slate-700 tracking-wide">{monthNames[month]} {year}</h2>
                <div className="flex gap-1">
                  <button onClick={() => changeMonth(-1)} className="p-1 px-2.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded border transition">◀</button>
                  <button onClick={() => setCurrentDate(new Date())} className="p-1 px-2.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded border transition">Today</button>
                  <button onClick={() => changeMonth(1)} className="p-1 px-2.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded border transition">▶</button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-3xs font-black uppercase text-slate-400 tracking-widest">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>

              {/* Day Matrix Cells */}
              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((day, idx) => {
                  if (day === null) return <div key={`empty-${idx}`} className="bg-slate-50/50 aspect-square rounded-md border border-slate-100"></div>;
                  
                  const targetCellStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const hasAppointments = appointments.some(app => app.date && new Date(app.date).toISOString().split('T')[0] === targetCellStr);
                  const isSelected = targetCellStr === selectedDateStr;

                  return (
                    <button
                      key={`day-${day}`}
                      type="button"
                      onClick={() => setSelectedDateStr(targetCellStr)}
                      className={`aspect-square p-1 rounded-md border flex flex-col justify-between items-start transition font-mono relative ${
                        isSelected ? 'bg-slate-900 text-white border-slate-900 font-black' : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 font-medium'
                      }`}
                    >
                      <span className="text-xs">{day}</span>
                      {hasAppointments && (
                        <span className={`w-1.5 h-1.5 rounded-full block mx-auto absolute bottom-1.5 right-1.5 ${isSelected ? 'bg-emerald-400' : 'bg-slate-900'}`}></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Booking Form & Focused Day Feed */}
            <div className="space-y-6 lg:col-span-1">
              
              {/* Form Element */}
              <form onSubmit={handleBookingSubmit} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b pb-1.5">Book Session: {selectedDateStr}</h3>
                
                <div>
                  <label className="block text-3xs font-black uppercase tracking-wider text-slate-500 mb-1">Target Patient profile *</label>
                  <select name="patientId" required value={formData.patientId} onChange={handleInputChange} className="w-full border border-slate-300 p-2 rounded-md text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="">-- Choose Patient Account --</option>
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-3xs font-black uppercase tracking-wider text-slate-500 mb-1">Intake Clock *</label>
                    <input type="time" name="time" required value={formData.time} onChange={handleInputChange} className="w-full border border-slate-300 p-1.5 rounded-md text-xs bg-slate-50 focus:bg-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-3xs font-black uppercase tracking-wider text-slate-500 mb-1">Status Context</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-slate-300 p-1.5 rounded-md text-xs bg-white outline-none">
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-3xs font-black uppercase tracking-wider text-slate-500 mb-1">Clinical Indication / Reason *</label>
                  <input type="text" name="reason" required value={formData.reason} onChange={handleInputChange} placeholder="e.g. Tooth Extraction Consultation" className="w-full border border-slate-300 p-2 rounded-md text-xs bg-slate-50 focus:bg-white outline-none" />
                </div>

                <button type="submit" disabled={loading || patients.length === 0} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-2.5 rounded-md text-xs uppercase tracking-wider transition disabled:opacity-50">
                  {loading ? 'Locking Timeline Cells...' : 'Confirm System Booking'}
                </button>
              </form>

              {/* Active Feed Panel for Selected Date */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-3 border-b bg-slate-50/75 text-3xs font-black text-slate-500 uppercase tracking-wider">
                  Timeline Queue: {selectedDateStr}
                </div>
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {selectedDayAppointments.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 font-medium">No procedures booked on this grid coordinate node.</div>
                  ) : (
                    selectedDayAppointments.map(app => (
                      <div key={app._id} className="p-3.5 space-y-2 hover:bg-slate-50/50 transition">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{app.patientId?.name || 'Purged Account'}</div>
                            <div className="text-3xs font-mono text-slate-400">Clock: {app.time}</div>
                          </div>
                          <span className={`text-3xs font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                            app.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            app.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>{app.status}</span>
                        </div>
                        <div className="text-3xs text-slate-600 font-medium italic">Reason: {app.reason}</div>
                        
                        {app.status === 'Scheduled' && (
                          <div className="flex gap-1 pt-1 border-t border-dashed mt-1">
                            <button type="button" onClick={() => handleStatusChange(app._id, 'Completed')} className="w-full bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold p-1 text-3xs uppercase tracking-wider rounded border border-emerald-200 transition">Complete</button>
                            <button type="button" onClick={() => handleStatusChange(app._id, 'Cancelled')} className="w-full bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold p-1 text-3xs uppercase tracking-wider rounded border border-rose-200 transition">Cancel</button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default AppointmentManagement;