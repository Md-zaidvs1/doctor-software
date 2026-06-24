import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { authService } from '../services/authService';
import Sidebar from '../components/dashboard/Sidebar';

const PatientHistoryView = () => {
  const currentUser = authService.getCurrentUser();
  const activeClinicId = currentUser?.clinicId || '6a391e7b5d9d49d512d572d6';

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  
  // Isolated Historical Streams
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBaseInitialDataMatrix();
    // Support auto-focusing queries if passed via router search parameters
    const queryId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
    if (queryId) setSelectedPatientId(queryId);
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      fetchUnifiedProfileHistory(selectedPatientId);
    } else {
      setAppointments([]);
      setBills([]);
    }
  }, [selectedPatientId]);

  const fetchBaseInitialDataMatrix = async () => {
    try {
      const contextQuery = `?clinicId=${activeClinicId}&tenantId=${activeClinicId}`;
      const res = await apiClient.get(`/patients${contextQuery}`);
      if (res.success) setPatients(res.data || []);
    } catch (err) {
      setError('Failed compiling initial database core index pathways.');
    }
  };

  const fetchUnifiedProfileHistory = async (id) => {
    try {
      setLoading(true);
      setError('');
      const contextQuery = `?clinicId=${activeClinicId}&tenantId=${activeClinicId}`;

      const [appointmentsRes, billingRes] = await Promise.all([
        apiClient.get(`/appointments${contextQuery}`),
        apiClient.get(`/billing${contextQuery}`)
      ]);

      if (appointmentsRes.success) {
        const filteredApps = (appointmentsRes.data || []).filter(app => {
          const appPatientId = app.patientId?._id || app.patientId;
          return appPatientId === id;
        });
        setAppointments(filteredApps);
      }

      if (billingRes.success) {
        const filteredBills = (billingRes.data || []).filter(bill => {
          const billPatientId = bill.patientId?._id || bill.patientId;
          return billPatientId === id;
        });
        setBills(filteredBills);
      }
    } catch (err) {
      setError('Error compiling unified historical matrix logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Unified Patient Clinical History Archive</h1>
            <p className="text-xs text-slate-500 mt-1">Consolidate timeline tracking workflows across accounting ledgers and diagnostic histories within a single pane view.</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-lg">⚠️ {error}</div>}

          {/* Core Profile Target Picker */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <label className="block text-3xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Select Patient Profile Channel To Audit *</label>
            <select 
              value={selectedPatientId} 
              onChange={(e) => setSelectedPatientId(e.target.value)} 
              className="w-full md:w-1/2 border border-slate-300 p-2.5 rounded-md text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
            >
              <option value="">-- Select Active Record Track node --</option>
              {patients.map(p => (
                <option key={p._id} value={p._id}>{p.name} [{p.phone || 'No Phone Link'}]</option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="text-center py-12 text-xs font-mono font-bold text-slate-400 uppercase animate-pulse">
              Assembling data vectors from chronological repositories...
            </div>
          )}

          {!loading && selectedPatientId && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chronological Appointments Flow */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b pb-1.5">Historical Intake Log Channels</h3>
                {appointments.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 font-medium">No system appointment logging entities verified for this account node.</p>
                ) : (
                  <div className="space-y-3 relative border-l-2 border-slate-100 pl-4 ml-2">
                    {appointments.map(app => (
                      <div key={app._id} className="relative space-y-1 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="absolute -left-[25px] top-4 w-2 h-2 rounded-full bg-slate-400 border border-white"></span>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-slate-700">{app.date ? new Date(app.date).toLocaleDateString() : 'Unknown Date'}</span>
                          <span className={`text-4xs font-bold px-1.5 py-0.5 border rounded uppercase ${
                            app.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>{app.status}</span>
                        </div>
                        <p className="text-xs text-slate-800 font-semibold">Reason: {app.reason || 'General Maintenance'}</p>
                        <p className="text-4xs font-mono text-slate-400">Clock: {app.time || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Historical Billing Ledger Matrix */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b pb-1.5">Financial Transaction Records Matrix</h3>
                {bills.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 font-medium">No accounting system bills assigned to this profile path.</p>
                ) : (
                  <div className="space-y-3">
                    {bills.map(bill => (
                      <div key={bill._id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="text-3xs font-mono text-slate-400">Invoice: {bill.invoiceNumber || bill._id}</div>
                          <div className="text-xs font-black text-slate-900">Gross Vol: ₹{bill.grandTotal || bill.totalAmount}</div>
                          <div className="text-4xs font-medium text-slate-500 uppercase tracking-wide">Method Channel: {bill.paymentMode || bill.paymentMethod}</div>
                        </div>
                        <span className={`text-4xs font-bold px-2 py-0.5 border rounded uppercase tracking-wider ${
                          (bill.paymentStatus === 'Paid' || bill.status === 'Paid') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>{bill.paymentStatus || bill.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default PatientHistoryView;