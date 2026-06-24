import React, { useState } from 'react';

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Mock initial dataset to ensure system runs lightning-fast completely offline
  const [patients] = useState([
    { id: 'P-101', name: 'Aman Verma', age: 34, phone: '9845120023', lastVisit: '2026-06-21', condition: 'Root Canal Therapy' },
    { id: 'P-102', name: 'Kavitha Rao', age: 28, phone: '9110238475', lastVisit: '2026-06-22', condition: 'Pre-Molar Extraction' }
  ]);

  return (
    <div className="h-screen w-screen flex bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* SIDEBAR NAVIGATION CONTROLLER */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 text-md rounded-lg flex items-center justify-center">🌳</div>
            <div>
              <h2 className="text-xs font-black text-white uppercase tracking-tight">Plant2Tree</h2>
              <p className="text-[9px] font-mono tracking-wider font-bold text-emerald-400 uppercase">Doctor Suite v1.0</p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {[
              { id: 'overview', label: '📊 System Overview' },
              { id: 'patients', label: '👥 Patient Directory' },
              { id: 'billing', label: '🧾 Billing Ledger' },
              { id: 'history', label: '📂 Clinical History (2C)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left p-2.5 text-xs font-bold rounded-lg transition-all duration-150 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/10 text-emerald-400 border border-emerald-500/20' 
                    : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* STEP 2D: GET SUPPORT ACTION ANCHOR */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-2">
          <button 
            onClick={() => setShowSupportModal(true)}
            className="w-full bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold border border-slate-700 py-2 rounded-lg text-[11px] uppercase tracking-wide transition-all"
          >
            🛠️ Get Help desk Support
          </button>
          <div className="text-center text-[9px] font-mono text-slate-600">
            Local Node DB: Connected
          </div>
        </div>
      </aside>

      {/* WORKSPACE VIEW CONTENT RENDERING HUB */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        
        {/* Header Bar */}
        <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/40">
          <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider">
            {activeTab === 'overview' && 'System Performance Analytics'}
            {activeTab === 'patients' && 'Active Patient Directory'}
            {activeTab === 'billing' && 'Financial Billing Ledger Operations'}
            {activeTab === 'history' && 'Clinical Patient History Ledger Index'}
          </h3>
          <div className="text-[10px] bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 font-medium">
            📍 Station Domain: <span className="text-white font-bold">Local Host Machine</span>
          </div>
        </header>

        {/* Dashboard Worksheets Layout Panel Contexts */}
        <div className="flex-1 p-8 overflow-y-auto">
          
          {/* VIEW: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Cached Records</p>
                  <p className="text-2xl font-black font-mono text-white">{patients.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Daily System Revenue</p>
                  <p className="text-2xl font-black font-mono text-emerald-400">₹4,500</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Local Connection Port</p>
                  <p className="text-2xl font-black font-mono text-teal-400">27017</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: PATIENTS MAP REGISTRY DIRECTORY */}
          {activeTab === 'patients' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-800">
                    <th className="p-4">Patient ID</th>
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Age Profile</th>
                    <th className="p-4">Contact Number</th>
                    <th className="p-4">Last Treatment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300 font-medium">
                  {patients.map(p => (
                    <tr key={p.id} className="hover:bg-slate-850/40 transition">
                      <td className="p-4 font-mono text-slate-400">{p.id}</td>
                      <td className="p-4 font-bold text-white">{p.name}</td>
                      <td className="p-4">{p.age} Yrs</td>
                      <td className="p-4 font-mono">{p.phone}</td>
                      <td className="p-4 text-emerald-400">{p.condition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW: BILLING MANAGEMENT LEDGER CONTAINER */}
          {activeTab === 'billing' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">Invoice #INV-2026-001</h4>
                  <p className="text-[10px] font-mono text-slate-500">Target Patient Profile: Aman Verma</p>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-3xs uppercase tracking-wider px-3 py-1.5 rounded-lg transition shadow-md"
                >
                  🖨️ Print Receipt Button (2B)
                </button>
              </div>
              <div className="font-mono text-xs space-y-1 text-slate-400 bg-slate-950/50 p-4 rounded-lg border border-slate-850">
                <div>Treatment Charge: ₹3,500.00</div>
                <div>Disposable Kit:   ₹500.00</div>
                <div className="border-t border-slate-800 pt-1 mt-1 font-bold text-white">Total Amount Due: ₹4,000.00</div>
              </div>
            </div>
          )}

          {/* STEP 2C: VIEW: DYNAMIC CLINICAL PATIENT HISTORY VIEW LEDGER */}
          {activeTab === 'history' && (
            <div className="space-y-4 max-w-2xl">
              {patients.map(p => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-bold text-white">{p.name} <span className="font-mono text-slate-500 font-normal">({p.id})</span></h4>
                    <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">Last Log: {p.lastVisit}</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div><span className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">Diagnostics logs:</span> Patient reported sharp sensitivity in lower left molar cluster quadrant.</div>
                    <div><span className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">Prescriptions Index:</span> Amoxicillin 500mg, Paracetamol 650mg SOS.</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* STEP 2D: GET SUPPORT INTERACTIVE MODAL DIALOG OVERLAY */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 max-w-sm w-full p-6 rounded-2xl text-center space-y-5 shadow-2xl">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xl rounded-xl flex items-center justify-center mx-auto">
              🛠️
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-white">Plant2Tree Technical Helpdesk</h3>
              <p className="text-3xs text-slate-400 leading-relaxed">
                Connect directly with our corporate support lines. Open AnyDesk on your workstation and share your desktop access credentials.
              </p>
            </div>
            
            <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl font-mono text-xs text-center space-y-1">
              <div className="text-slate-500 text-[9px] font-bold uppercase">Emergency Contact Desk</div>
              <div className="text-white font-bold text-sm tracking-wide">+91 XXXXX XXXXX</div>
            </div>

            <div className="space-y-2">
              <a 
                href="https://anydesk.com/en/downloads/windows" 
                target="_blank" 
                rel="noreferrer"
                className="block w-full bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 py-2 rounded-lg text-3xs font-black uppercase tracking-wider transition"
              >
                📥 Download AnyDesk Utility Installer
              </a>
              <button 
                onClick={() => setShowSupportModal(false)}
                className="w-full bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-850 py-2 rounded-lg text-3xs font-black uppercase tracking-wider transition"
              >
                Dismiss Help Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardLayout;