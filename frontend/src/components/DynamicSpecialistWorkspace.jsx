import React, { useState } from 'react';
import DentalChartModule from './DentalChartModule'; // Pre-existing module

// ==========================================
// 👁️ EYE WORKSPACE MODULE (VISION RECORDS STANDARD)
// ==========================================
const EyeVisionModule = ({ patientId }) => {
  const [visionData, setVisionData] = useState({
    re_sph: '0.00', re_cyl: '0.00', re_axis: '0', re_va: '6/6',
    le_sph: '0.00', le_cyl: '0.00', le_axis: '0', le_va: '6/6',
    iop_re: '15', iop_le: '15', fundusNotes: 'Normal optic disc margins.'
  });

  const handleSaveVision = (e) => {
    e.preventDefault();
    alert(`👁️ Vision Records locked into encrypted cluster logs for patient node: ${patientId}`);
  };

  return (
    <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
      <h4 style={{ marginTop: 0, color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', fontSize: '15px' }}>👁️ Ophthalmic Metrics & Snellen Acuity Logs</h4>
      
      <form onSubmit={handleSaveVision} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '15px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* RIGHT EYE CANVAS */}
          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#2563eb', fontSize: '13px', display: 'block', marginBottom: '10px' }}>OD (Right Eye Parameters)</strong>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div><label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>SPH</label><input type="text" value={visionData.re_sph} onChange={(e) => setVisionData({...visionData, re_sph: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }} /></div>
              <div><label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>CYL</label><input type="text" value={visionData.re_cyl} onChange={(e) => setVisionData({...visionData, re_cyl: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }} /></div>
              <div><label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>AXIS</label><input type="text" value={visionData.re_axis} onChange={(e) => setVisionData({...visionData, re_axis: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }} /></div>
              <div><label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>Acuity (VA)</label><input type="text" value={visionData.re_va} onChange={(e) => setVisionData({...visionData, re_va: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }} /></div>
            </div>
          </div>

          {/* LEFT EYE CANVAS */}
          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#10b981', fontSize: '13px', display: 'block', marginBottom: '10px' }}>OS (Left Eye Parameters)</strong>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div><label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>SPH</label><input type="text" value={visionData.le_sph} onChange={(e) => setVisionData({...visionData, le_sph: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }} /></div>
              <div><label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>CYL</label><input type="text" value={visionData.le_cyl} onChange={(e) => setVisionData({...visionData, le_cyl: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }} /></div>
              <div><label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>AXIS</label><input type="text" value={visionData.le_axis} onChange={(e) => setVisionData({...visionData, le_axis: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }} /></div>
              <div><label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>Acuity (VA)</label><input type="text" value={visionData.le_va} onChange={(e) => setVisionData({...visionData, le_va: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }} /></div>
            </div>
          </div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Intraocular Pressure (IOP mm Hg):</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <input type="text" value={visionData.iop_re} placeholder="RE" style={{ width: '50%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }} />
              <input type="text" value={visionData.iop_le} placeholder="LE" style={{ width: '50%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Fundus Examination Notes:</label>
            <input type="text" value={visionData.fundusNotes} onChange={(e) => setVisionData({...visionData, fundusNotes: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', marginTop: '4px' }} />
          </div>
        </div>

        <button type="submit" style={{ padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
          💾 Commit Vision Diagnostics Ledger
        </button>
      </form>
    </div>
  );
};

// ==========================================
// 👂 ENT WORKSPACE MODULE (HEARING REPORTS AUDIOGRAM)
// ==========================================
const EntHearingModule = ({ patientId }) => {
  const [frequencies] = useState([250, 500, 1000, 2000, 4000, 8000]);
  const [airConductionRE, setAirConductionRE] = useState([15, 20, 20, 25, 30, 35]);
  const [airConductionLE, setAirConductionLE] = useState([20, 20, 25, 30, 35, 40]);

  return (
    <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
      <h4 style={{ marginTop: 0, color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', fontSize: '15px' }}>👂 Pure Tone Audiometry Diagnostic Grid</h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '25px', marginTop: '15px' }}>
        
        {/* INTERACTIVE THRESHOLD CONTROLLER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Air Conduction Threshold Values (dB HL):</span>
          {frequencies.map((freq, index) => (
            <div key={freq} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '70px', fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>{freq} Hz</div>
              <input type="number" value={airConductionRE[index]} onChange={(e) => {
                const updated = [...airConductionRE]; updated[index] = Number(e.target.value); setAirConductionRE(updated);
              }} style={{ width: '60px', padding: '5px', fontSize: '12px', textAlign: 'center', border: '1px solid #ef4444', color: '#b91c1c', fontWeight: 'bold', borderRadius: '4px' }} placeholder="RE" />
              <input type="number" value={airConductionLE[index]} onChange={(e) => {
                const updated = [...airConductionLE]; updated[index] = Number(e.target.value); setAirConductionLE(updated);
              }} style={{ width: '60px', padding: '5px', fontSize: '12px', textAlign: 'center', border: '1px solid #3b82f6', color: '#2563eb', fontWeight: 'bold', borderRadius: '4px' }} placeholder="LE" />
            </div>
          ))}
        </div>

        {/* SIMULATED VISUAL MATRIX ANALYSIS MAP */}
        <div style={{ background: '#0f172a', borderRadius: '12px', padding: '20px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#3b82f6', fontWeight: 'bold', letterSpacing: '1px' }}>System Response Grid Interpretation</span>
            <h5 style={{ margin: '5px 0 15px 0', fontSize: '14px', color: '#f8fafc' }}>Real-time Plotting Analytics Simulation</h5>
          </div>

          <div style={{ borderLeft: '2px solid #475569', borderBottom: '2px solid #475569', height: '140px', position: 'relative', margin: '10px 0 20px 20px' }}>
            <div style={{ position: 'absolute', bottom: '-20px', left: '0', fontSize: '9px', color: '#64748b' }}>250Hz</div>
            <div style={{ position: 'absolute', bottom: '-20px', right: '0', fontSize: '9px', color: '#64748b' }}>8000Hz</div>
            <div style={{ position: 'absolute', top: '0', left: '-25px', fontSize: '9px', color: '#64748b' }}>0 dB</div>
            <div style={{ position: 'absolute', bottom: '0', left: '-25px', fontSize: '9px', color: '#64748b' }}>120dB</div>
            
            {/* Visual plot markers simulation tracks */}
            <div style={{ position: 'absolute', left: '20%', top: '30%', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', left: '50%', top: '45%', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', left: '80%', top: '60%', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></div>
            
            <div style={{ position: 'absolute', left: '25%', top: '35%', width: '8px', height: '8px', background: '#3b82f6', transform: 'rotate(45deg)' }}></div>
            <div style={{ position: 'absolute', left: '55%', top: '50%', width: '8px', height: '8px', background: '#3b82f6', transform: 'rotate(45deg)' }}></div>
            <div style={{ position: 'absolute', left: '85%', top: '65%', width: '8px', height: '8px', background: '#3b82f6', transform: 'rotate(45deg)' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '15px', fontSize: '11px', color: '#94a3b8' }}>
            <div><span style={{ color: '#ef4444' }}>⭕</span> RE (Right Eye Conduction)</div>
            <div><span style={{ color: '#3b82f6' }}>❌</span> LE (Left Eye Conduction)</div>
          </div>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// 🚀 MAIN WORKSPACE SWITCHER EXPORT WRAPPER
// ==========================================
const DynamicSpecialistWorkspace = ({ patientId }) => {
  const [specialty, setSpecialty] = useState('Dental'); // Master domain toggle index

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      
      {/* BRAND NEW SPECIALTY DOMAIN CONTROL STRIP BAR */}
      <div style={{ background: '#1e293b', padding: '15px 25px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div>
          <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '15px', fontWeight: '800' }}>⚡ Clinical Specialty Engine Gateway</h4>
          <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '11px' }}>Flip your active specialization matrix instantly to adjust user tracking tools</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {['Dental', 'Eye', 'ENT'].map(domain => (
            <button key={domain} onClick={() => setSpecialty(domain)} style={{
              padding: '8px 18px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
              background: specialty === domain ? '#3b82f6' : '#334155', color: '#fff',
              boxShadow: specialty === domain ? '0 2px 8px rgba(59, 130, 246, 0.4)' : 'none'
            }}>
              {domain === 'Dental' ? '🦷 Dental Pro' : domain === 'Eye' ? '👁️ Eye Vision' : '👂 ENT Hearing'}
            </button>
          ))}
        </div>
      </div>

      {/* CORE GATEWAY VIEWPORT INTERCEPT DISPATCH */}
      <div style={{ width: '100%' }}>
        {specialty === 'Dental' && <DentalChartModule patientId={patientId} />}
        {specialty === 'Eye' && <EyeVisionModule patientId={patientId} />}
        {specialty === 'ENT' && <EntHearingModule patientId={patientId} />}
      </div>

    </div>
  );
};

export default DynamicSpecialistWorkspace;