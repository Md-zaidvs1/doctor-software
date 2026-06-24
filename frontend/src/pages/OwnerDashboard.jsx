import React, { useState, useEffect } from 'react';

export default function OwnerDashboard() {
  const [clinics, setClinics] = useState([
    { id: "C-101", name: "RK Dental Clinic", category: "Dental", status: "Active", billing: "Premium Monthly", revenue: 8500 },
    { id: "C-102", name: "Omega Eye Diagnostics", category: "Eye", status: "Active", billing: "Enterprise Annual", revenue: 45000 },
    { id: "C-103", name: "Alpha ENT Care", category: "ENT", status: "Suspended", billing: "Trial Node", revenue: 0 },
  ]);

  const toggleClinicStatus = (id) => {
    setClinics(clinics.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Suspended' : 'Active' } : c));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b0f19', color: '#f1f5f9', fontFamily: 'sans-serif' }}>
      
      {/* 🧭 ENTERPRISE SIDEBAR */}
      <div style={{ width: '260px', background: '#0f172a', padding: '30px 20px', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#3b82f6', margin: 0, letterSpacing: '-0.5px' }}>APEX NEXUS</h2>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>SYSTEM ROOT CONTROL</span>
        </div>
        <button style={{ padding: '12px', background: '#1e293b', border: 'none', color: '#fff', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold' }}>📊 Global Analytics</button>
        <button style={{ padding: '12px', background: 'transparent', border: 'none', color: '#94a3b8', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>🏥 Fleet Clinic Control</button>
        <button style={{ padding: '12px', background: 'transparent', border: 'none', color: '#94a3b8', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>💰 Subscription Models</button>
        <button style={{ padding: '12px', background: 'transparent', border: 'none', color: '#94a3b8', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>⚙️ Global Engine Configurations</button>
      </div>

      {/* 🖥️ DATA DESK PANE */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* TOP META PANEL */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800' }}>Platform Infrastructure Matrix</h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Real-time cross-cluster telemetry analysis</p>
          </div>
          <span style={{ background: '#1e293b', color: '#3b82f6', border: '1px solid #3b82f6', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>⚡ System Status: Operational</span>
        </div>

        {/* 📊 GLOBAL MACRO ANALYTICS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px', marginBottom: '40px' }}>
          <div style={{ background: '#0f172a', padding: '25px', borderRadius: '16px', border: '1px solid #1e293b' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Mapped Clinics</span>
            <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '5px', color: '#3b82f6' }}>482</div>
          </div>
          <div style={{ background: '#0f172a', padding: '25px', borderRadius: '16px', border: '1px solid #1e293b' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Gross System ARR</span>
            <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '5px', color: '#10b981' }}>₹4,82,500 <span style={{ fontSize: '12px', color: '#64748b' }}>/mo</span></div>
          </div>
          <div style={{ background: '#0f172a', padding: '25px', borderRadius: '16px', border: '1px solid #1e293b' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Active Pipeline Nodes</span>
            <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '5px', color: '#f59e0b' }}>94%</div>
          </div>
          <div style={{ background: '#0f172a', padding: '25px', borderRadius: '16px', border: '1px solid #1e293b' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Cross-System Medical Staff</span>
            <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '5px', color: '#a855f7' }}>2,194</div>
          </div>
        </div>

        {/* 🏥 FLEET MANAGEMENT MODULE TABLE */}
        <div style={{ background: '#0f172a', padding: '30px', borderRadius: '20px', border: '1px solid #1e293b' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>🌐 Global Subsystem Registry</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #1e293b', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Clinic Node Name</th>
                <th style={{ padding: '12px' }}>Category Matrix</th>
                <th style={{ padding: '12px' }}>Billing Mapped Tier</th>
                <th style={{ padding: '12px' }}>Monthly Yield</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Network Status</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Security Override</th>
              </tr>
            </thead>
            <tbody>
              {clinics.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #1e293b', fontSize: '14px' }}>
                  <td style={{ padding: '16px 12px', fontWeight: 'bold' }}>🏢 {c.name}</td>
                  <td style={{ padding: '16px 12px' }}><span style={{ background: '#1e293b', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>{c.category}</span></td>
                  <td style={{ padding: '16px 12px', color: '#cbd5e1' }}>{c.billing}</td>
                  <td style={{ padding: '16px 12px', color: '#10b981', fontWeight: 'bold' }}>₹{c.revenue}</td>
                  <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                    <span style={{ background: c.status === 'Active' ? '#064e3b' : '#7f1d1d', color: c.status === 'Active' ? '#10b981' : '#f87171', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                    <button onClick={() => toggleClinicStatus(c.id)} style={{ padding: '6px 12px', background: c.status === 'Active' ? '#451a1a' : '#1e3a8a', color: c.status === 'Active' ? '#f87171' : '#3b82f6', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
                      {c.status === 'Active' ? "🔴 Suspend Node" : "🟢 Re-Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}