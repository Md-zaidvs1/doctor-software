import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import { authService } from '../../services/authService';

const DoctorDashboard = () => {
  const currentUser = authService.getCurrentUser();
  const activeClinicId = currentUser?.clinicId;

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!activeClinicId) {
      setError('Missing active workspace configuration profile context.');
      setLoading(false);
      return;
    }
    fetchDoctorContextMatrix();
  }, [activeClinicId]);

  const fetchDoctorContextMatrix = async () => {
    try {
      setLoading(true);
      const contextQuery = `?clinicId=${activeClinicId}&tenantId=${activeClinicId}`;
      
      const [patientsRes, appointmentsRes] = await Promise.all([
        apiClient.get(`/patients${contextQuery}`),
        apiClient.get(`/appointments${contextQuery}`)
      ]);

      if (patientsRes.success) setPatients(patientsRes.data || []);
      if (appointmentsRes.success) {
        // Filter out today's scheduled or active cases
        const todayStr = new Date().toISOString().split('T')[0];
        const filtered = (appointmentsRes.data || []).filter(app => {
          const appDate = app.date ? new Date(app.date).toISOString().split('T')[0] : '';
          return appDate === todayStr && app.status !== 'Cancelled';
        });
        setAppointments(filtered);
      }
    } catch (err) {
      setError('System structural failure loading clinical workstream logs.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-xs font-mono font-bold uppercase text-slate-400 animate-pulse">
          Compiling clinical dashboard queue channels...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Clinical Console: Dr. {currentUser?.name || 'Practitioner'}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Role Authorization Privilege: <span className="font-mono bg-blue-50 text-blue-700 px-1 rounded font-bold">Medical Officer</span></p>
        </div>
        <span className="text-3xs font-mono font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md border border-emerald-100 animate-pulse">
          Active Session Online
        </span>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-lg">⚠️ {error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Today's Intake Treatment Queue List */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs lg:col-span-2">
          <div className="p-4 border-b border-slate-100 bg-slate-50/75 flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">Today's Active Patient Intake Queue</h3>
            <span className="text-3xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">Cases: {appointments.length}</span>
          </div>
          
          <div className="divide-y divide-slate-100">
            {appointments.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 font-medium">No diagnostic intake records waiting on your workspace matrix today.</div>
            ) : (
              appointments.map(app => (
                <div key={app._id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-sm">{app.patientId?.name || 'EHR Profile Link'}</div>
                    <div className="text-3xs font-medium text-slate-500 uppercase">Indication: {app.reason || 'General Observation'}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-700">{app.time}</div>
                      <div className="text-4xs font-mono text-slate-400 uppercase">Est Slot Time</div>
                    </div>
                    <a 
                      href={`#/history?id=${app.patientId?._id || ''}`} 
                      className="bg-slate-900 hover:bg-slate-800 text-white text-3xs font-black uppercase tracking-wider px-3 py-2 rounded transition shadow-xs"
                    >
                      Chart Patient
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Diagnostics Action Panel Links */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs lg:col-span-1 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b pb-1.5">Clinical Fast-Paths</h3>
          <div className="space-y-2">
            <a href="#/history" className="block w-full text-center bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold p-2.5 rounded-md text-3xs uppercase tracking-wider transition">
              📂 Search Complete Patient Records Archive
            </a>
            <div className="p-3 bg-slate-50 border rounded-lg text-3xs text-slate-500 leading-relaxed font-medium">
              ℹ️ Use this dashboard interface panel vector to trace patient queues and launch diagnostic charting interfaces instantly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;