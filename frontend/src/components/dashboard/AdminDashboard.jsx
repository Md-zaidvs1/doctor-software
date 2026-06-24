import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import { authService } from '../../services/authService';

const AdminDashboard = () => {
  const currentUser = authService.getCurrentUser();
  // REMOVED HARDCODED FALLBACK: Extract cleanly from the verified JWT user session profile
  const activeClinicId = currentUser?.clinicId;

  // Stats State Matrix
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    totalRevenue: 0,
    upcomingAppointments: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // If no valid clinic context exists in the session, reject request loop instantly
    if (!activeClinicId) {
      setError('Critical Multi-Tenant Isolation Error: Missing valid clinic workspace token context. Please log in again.');
      setLoading(false);
      return;
    }
    fetchDashboardMetrics();
  }, [activeClinicId]);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      setError('');
      
      const contextQuery = `?clinicId=${activeClinicId}&tenantId=${activeClinicId}`;

      // Fetch overview indicators from backend data nodes
      const [reportsRes, appointmentsRes, patientsRes, billingRes] = await Promise.all([
        apiClient.get(`/reports/overview${contextQuery}`).catch(() => ({ success: false })),
        apiClient.get(`/appointments${contextQuery}`),
        apiClient.get(`/patients${contextQuery}`),
        apiClient.get(`/billing${contextQuery}`)
      ]);

      // Fallback calculation matrix if your /reports route isn't fully aggregated yet
      let computedRevenue = 0;
      if (billingRes.success && billingRes.data) {
        computedRevenue = billingRes.data.reduce((sum, bill) => sum + (bill.grandTotal || 0), 0);
      }

      const todayStr = new Date().toISOString().split('T')[0];
      let todayCount = 0;
      let upcomingCount = 0;

      if (appointmentsRes.success && appointmentsRes.data) {
        appointmentsRes.data.forEach(app => {
          const appDate = app.date ? new Date(app.date).toISOString().split('T')[0] : '';
          if (appDate === todayStr) todayCount++;
          else if (appDate > todayStr) upcomingCount++;
        });
        // Sort and slice for feed preview panel
        setRecentAppointments(appointmentsRes.data.slice(0, 5));
      }

      setStats({
        todayAppointments: todayCount || reportsRes?.data?.todayAppointments || 0,
        totalPatients: patientsRes.success ? (patientsRes.data?.length || 0) : 0,
        totalRevenue: computedRevenue || reportsRes?.data?.totalRevenue || 0,
        upcomingAppointments: upcomingCount || 0
      });

    } catch (err) {
      setError('System context failure calculating operational dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-xs font-mono font-bold uppercase text-slate-400 animate-pulse">
          Synchronizing multi-tenant workspace matrix...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner Message */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Welcome back, {currentUser?.name || 'Administrator'}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Clinical Domain Segment: <span className="font-mono bg-slate-100 text-slate-700 px-1 rounded font-bold">{activeClinicId || 'UNASSIGNED'}</span></p>
        </div>
        <span className="text-3xs font-mono font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md border border-blue-100">
          Clinic Tenant Workspace
        </span>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-lg">⚠️ {error}</div>}

      {!error && (
        <>
          {/* Overview Stat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Today's Lineup */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-black text-slate-400 uppercase tracking-wider">Today's Lineup</span>
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">📅</div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900 font-mono">{stats.todayAppointments}</span>
                <span className="text-3xs text-slate-400 font-semibold uppercase">Sessions</span>
              </div>
              <p className="text-3xs text-slate-400">Scheduled for immediate intake</p>
            </div>

            {/* Card 2: Total Active Pool */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-black text-slate-400 uppercase tracking-wider">Total Patient Pool</span>
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">👥</div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900 font-mono">{stats.totalPatients}</span>
                <span className="text-3xs text-slate-400 font-semibold uppercase">Profiles</span>
              </div>
              <p className="text-3xs text-slate-400">Registered across this domain</p>
            </div>

            {/* Card 3: Financial Gross Yield */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-black text-slate-400 uppercase tracking-wider">Gross Revenue Summary</span>
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold">₹</div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900 font-mono">₹{stats.totalRevenue.toLocaleString()}</span>
                <span className="text-3xs text-slate-400 font-semibold uppercase">INR</span>
              </div>
              <p className="text-3xs text-slate-400">Aggregated tracking invoices</p>
            </div>

            {/* Card 4: Forward Queue */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-black text-slate-400 uppercase tracking-wider">Forward Queue</span>
                <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold">⏳</div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900 font-mono">{stats.upcomingAppointments}</span>
                <span className="text-3xs text-slate-400 font-semibold uppercase">Upcoming</span>
              </div>
              <p className="text-3xs text-slate-400">Future scheduled interactions</p>
            </div>

          </div>

          {/* Feed Panel Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Schedule Logs Tracker Feed */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs lg:col-span-2">
              <div className="p-4 border-b border-slate-100 bg-slate-50/75 flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">Active Stream: Recent Appointments</h3>
                <span className="text-3xs font-mono font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase">Live Feed</span>
              </div>
              <div className="divide-y divide-slate-100">
                {recentAppointments.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 font-medium">No system appointment instances scheduled in this domain.</div>
                ) : (
                  recentAppointments.map(app => (
                    <div key={app._id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 text-sm">{app.patientId?.name || 'Unlinked Profile'}</div>
                        <div className="text-3xs text-slate-400 font-medium uppercase tracking-wide">Reason: {app.reason || 'General Checkup'}</div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-xs font-mono font-bold text-slate-700">{app.time || '00:00'}</div>
                        <span className={`text-3xs font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                          app.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          app.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>{app.status || 'Scheduled'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Operations Panel Container */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs lg:col-span-1 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b pb-1.5">Domain Quick Links</h3>
              <div className="space-y-2">
                <a href="#/patients" className="block w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-bold p-2 rounded-md text-3xs uppercase tracking-wider transition shadow-sm">
                  + Register New Patient Profile
                </a>
                <a href="#/appointments" className="block w-full text-center bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold p-2 rounded-md text-3xs uppercase tracking-wider transition">
                  📅 Open Calendar Scheduler
                </a>
                <a href="#/billing" className="block w-full text-center bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold p-2 rounded-md text-3xs uppercase tracking-wider transition">
                  ₹ Open Invoicing Ledger
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;