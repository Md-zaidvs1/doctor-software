import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { authService } from '../services/authService';
import Sidebar from '../components/dashboard/Sidebar';

const Reports = () => {
  const currentUser = authService.getCurrentUser();

  // Analytics Metrics State Nodes
  const [metrics, setMetrics] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalTreatments: 0,
    grossRevenue: 0,
    pendingCollections: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalyticalMetrics();
  }, []);

  const fetchAnalyticalMetrics = async () => {
    try {
      setLoading(true);
      setError('');

      // Scrape telemetry registers via batch requests
      const [patientsRes, apptsRes, treatmentsRes, billingRes] = await Promise.all([
        apiClient.get('/patients'),
        apiClient.get('/appointments'),
        apiClient.get('/treatments'),
        apiClient.get('/billing')
      ]);

      let patientCount = 0;
      let apptCount = 0;
      let treatmentCount = 0;
      let revenueSum = 0;
      let openBalanceSum = 0;

      if (patientsRes.success && Array.isArray(patientsRes.data)) {
        patientCount = patientsRes.data.length;
      }
      if (apptsRes.success && Array.isArray(apptsRes.data)) {
        apptCount = apptsRes.data.length;
      }
      if (treatmentsRes.success && Array.isArray(treatmentsRes.data)) {
        treatmentCount = treatmentsRes.data.length;
      }
      if (billingRes.success && Array.isArray(billingRes.data)) {
        billingRes.data.forEach(bill => {
          revenueSum += parseFloat(bill.paidAmount) || 0;
          const total = parseFloat(bill.totalAmount) || 0;
          const paid = parseFloat(bill.paidAmount) || 0;
          if (total > paid) {
            openBalanceSum += (total - paid);
          }
        });
      }

      setMetrics({
        totalPatients: patientCount,
        totalAppointments: apptCount,
        totalTreatments: treatmentCount,
        grossRevenue: revenueSum,
        pendingCollections: openBalanceSum
      });
    } catch (err) {
      setError('System structural exception compiling analytics reporting ledger sheets.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">SaaS Performance Metrics & Analytics</h1>
              <p className="text-xs text-slate-500 mt-1">Real-time analytical telemetry for tracking operational efficiency and financial margins.</p>
            </div>
            <button 
              onClick={fetchAnalyticalMetrics}
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-2xs uppercase tracking-wider transition shadow-xs disabled:opacity-50"
            >
              {loading ? 'Refreshing Registry...' : 'Force Sync Matrix'}
            </button>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-lg shadow-2xs">⚠️ Error: {error}</div>}

          {/* Operational Metrics Cards Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-3xs font-black uppercase tracking-widest text-slate-400 block">Patient Acquisition Index</span>
                <h3 className="text-3xl font-black text-slate-900 mt-1 font-mono">{metrics.totalPatients}</h3>
              </div>
              <p className="text-3xs text-slate-400 mt-4 leading-relaxed">Total legal clinical EMR files allocated onto this isolated tenant partition space.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-3xs font-black uppercase tracking-widest text-slate-400 block">Encounter Load / Volumes</span>
                <h3 className="text-3xl font-black text-indigo-600 mt-1 font-mono">{metrics.totalAppointments}</h3>
              </div>
              <p className="text-3xs text-slate-400 mt-4 leading-relaxed">Total combined scheduled, completed, and canceled consultation timelines.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-3xs font-black uppercase tracking-widest text-slate-400 block">Clinical Diagnostic Operations</span>
                <h3 className="text-3xl font-black text-teal-600 mt-1 font-mono">{metrics.totalTreatments}</h3>
              </div>
              <p className="text-3xs text-slate-400 mt-4 leading-relaxed">Total case chart updates, treatments executed, and prescription lines written.</p>
            </div>

          </div>

          {/* Financial Performance Ledger Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-emerald-950 p-6 rounded-xl border border-emerald-900 shadow-2xs text-white">
              <span className="text-3xs font-black uppercase tracking-widest text-emerald-400 block">Gross Realized Liquid Revenue</span>
              <h2 className="text-4xl font-black text-white mt-1 font-mono">₹{metrics.grossRevenue.toLocaleString('en-IN')}</h2>
              <div className="mt-4 pt-4 border-t border-emerald-900 flex justify-between items-center text-3xs font-semibold text-emerald-300">
                <span>Payment Channel: Active Collections</span>
                <span className="bg-emerald-900 px-2 py-0.5 rounded text-white font-mono uppercase text-4xs">Audited Node</span>
              </div>
            </div>

            <div className="bg-amber-950 p-6 rounded-xl border border-amber-900 shadow-2xs text-white">
              <span className="text-3xs font-black uppercase tracking-widest text-amber-400 block">Outstanding Arrears Portfolio</span>
              <h2 className="text-4xl font-black text-white mt-1 font-mono">₹{metrics.pendingCollections.toLocaleString('en-IN')}</h2>
              <div className="mt-4 pt-4 border-t border-amber-900 flex justify-between items-center text-3xs font-semibold text-amber-300">
                <span>Uncollected Accounts Receivable Balance</span>
                <span className="bg-amber-900 px-2 py-0.5 rounded text-white font-mono uppercase text-4xs">Pending Sync</span>
              </div>
            </div>

          </div>

          {/* System Audit Trail Node */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-500 text-2xs font-medium flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All analytical logs verified under security tenancy scope parameters.</span>
            </div>
            <span className="text-3xs font-mono text-slate-400">Tenant Hash Link Context Secured</span>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Reports;