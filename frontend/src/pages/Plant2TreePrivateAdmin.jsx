import React, { useState } from 'react';
import { licenseService } from '../services/licenseService';

const Plant2TreePrivateAdmin = () => {
  const [selectedCategory, setSelectedCategory] = useState('DENT');
  const [generatedKey, setGeneratedKey] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Private memory logging pool for client tracking tracking metrics
  const [clientRegistry, setClientRegistry] = useState([
    { id: 1, name: 'Apex Dental Hub', sector: 'DENT', license: 'P2T-DENT-19E4A96E100-AB', status: 'Active' },
    { id: 2, name: 'Vasan Eye Care Clinic', sector: 'EYE', license: 'P2T-EYEE-19E15B30F00-C4', status: 'Expired' }
  ]);

  const handleMintKeyAction = (e) => {
    e.preventDefault();
    setCopySuccess(false);
    
    // Call our cryptographically structured licensing machine array generator
    const freshToken = licenseService.generateOneYearLicense(selectedCategory);
    setGeneratedKey(freshToken);
  };

  const handleCopyToClipboard = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-100 font-sans select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Private Banner Identity Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 bg-slate-900/40 p-4 rounded-xl border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌳</span>
              <h1 className="text-base font-black uppercase tracking-tight text-white">Plant2Tree Admin HQ</h1>
            </div>
            <p className="text-4xs font-mono font-bold tracking-widest text-slate-500 uppercase">Proprietary Key Provisioner & Licensing Console</p>
          </div>
          <span className="text-4xs font-mono font-black uppercase tracking-wider bg-red-950 text-red-400 px-2 py-1 rounded border border-red-900/60">
            Internal Developer Use Only
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Key Generator Form Unit */}
          <form onSubmit={handleMintKeyAction} className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4 md:col-span-1 shadow-xl">
            <h2 className="text-3xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5 mb-2">Mint Product License</h2>

            <div>
              <label className="block text-4xs font-black uppercase tracking-wider text-slate-400 mb-1">Target Client Framework Segment</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-slate-700 bg-slate-950 p-2 rounded-md text-xs font-medium text-slate-300 outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="DENT">Dental Specialization Suite (DENT)</option>
                <option value="ENT">ENT Specialization Suite (ENT)</option>
                <option value="EYEE">Ophthalmology Vision Suite (EYEE)</option>
                <option value="ORTH">Orthopedic Specialization Engine (ORTH)</option>
                <option value="GENR">General Clinical Sector Frame (GENR)</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black p-2 rounded-md text-xs uppercase tracking-wider transition shadow-md">
              ⚡ Generate Activation Key
            </button>

            {generatedKey && (
              <div className="space-y-1.5 pt-3 border-t border-slate-800/80 mt-2 animate-fadeIn">
                <span className="text-4xs font-mono font-black text-emerald-400 block uppercase tracking-wider">Generated Product Token:</span>
                <div className="bg-slate-950 border border-slate-800 p-2 rounded text-xs font-mono text-center font-bold text-white tracking-widest select-all break-all">
                  {generatedKey}
                </div>
                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  className={`w-full text-4xs font-black uppercase tracking-wider p-1.5 rounded transition ${
                    copySuccess ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {copySuccess ? '✓ Token Copied To Clipboard' : '📋 Copy Token String'}
                </button>
              </div>
            )}
          </form>

          {/* Client Ledger Tracking Matrix */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden md:col-span-2 shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <h3 className="text-3xs font-black text-slate-400 uppercase tracking-wider">Active Client Registry Log</h3>
              <span className="text-4xs font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-slate-300">Monitored Accounts: {clientRegistry.length}</span>
            </div>

            <div className="divide-y divide-slate-800/60 max-h-[400px] overflow-y-auto">
              {clientRegistry.map(client => (
                <div key={client.id} className="p-4 flex items-center justify-between hover:bg-slate-950/20 transition">
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{client.name}</div>
                    <div className="text-4xs font-mono font-bold text-slate-500 tracking-wider">KEY: {client.license}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className={`text-4xs font-bold px-2 py-0.5 border rounded uppercase ${
                      client.status === 'Active' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-900/60' : 'bg-rose-950/60 text-rose-400 border-rose-900/60'
                    }`}>{client.status}</span>
                    <div className="text-5xs font-mono text-slate-500 uppercase tracking-wider mt-0.5">SECTOR: {client.sector}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Plant2TreePrivateAdmin;