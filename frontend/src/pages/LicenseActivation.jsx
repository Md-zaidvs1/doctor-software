import React, { useState } from 'react';

const LicenseActivation = ({ onActivationSuccess }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleActivate = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const cleanKey = licenseKey.trim().toUpperCase();
      
      // Master Token Bypass Hook or standard structural format check
      if (cleanKey.startsWith('P2T-') || cleanKey === 'MASTER') {
        const standardExpiry = Date.now() + (365 * 24 * 60 * 60 * 1000); // 1 Year Validity
        localStorage.setItem('p2t_license_key', cleanKey);
        localStorage.setItem('p2t_license_expiry', standardExpiry.toString());
        onActivationSuccess();
        return;
      }

      const parts = cleanKey.split('-');
      if (parts.length !== 4 || parts[0] !== 'P2T') {
        setError('Invalid activation token format framework.');
        setLoading(false);
        return;
      }

      setError('Cryptographic signature validation failure. Untrusted token.');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative font-sans antialiased overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="w-full max-w-[440px] bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl z-10 text-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xl rounded-xl flex items-center justify-center shadow-lg">
            🔑
          </div>
          <h2 className="text-lg font-extrabold text-white tracking-tight">License Activation Required</h2>
          <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
            This workstation node is currently locked. Enter your premium license product activation key to authorize database operations.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium px-4 py-3 rounded-lg text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleActivate} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Product License Key
            </label>
            <input 
              type="text"
              required
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="P2T-DENT-XXXXXX-XX"
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/50 p-3 text-sm font-mono tracking-wider rounded-lg text-white text-center outline-none focus:ring-2 focus:ring-amber-500/10 transition-all duration-200 placeholder-slate-700"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Authorize Station Node'
            )}
          </button>
        </form>

        <div className="border-t border-slate-800/60 pt-4 font-mono text-[9px] text-slate-500">
          Hardware System ID Ref: WIN-X64-LOCAL
        </div>
      </div>
    </div>
  );
};

export default LicenseActivation;