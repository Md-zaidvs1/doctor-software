import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DentalChartModule = ({ patientId }) => {
  const [chartMap, setChartMap] = useState({});
  const [selectedTooth, setSelectedTooth] = useState(null); // Selected tooth number (1-32)
  const [condition, setCondition] = useState('Healthy');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const API_TUNNEL = '/api/dental-chart';

  // Fetch full teeth structural data maps for this patient profile node
  const fetchDentalChartLogs = async () => {
    if (!patientId) return;
    try {
      const response = await axios.get(`${API_TUNNEL}/patient/${patientId}`);
      if (Array.isArray(response.data)) {
        const structuralMap = {};
        response.data.forEach(item => {
          structuralMap[item.toothNumber] = item;
        });
        setChartMap(structuralMap);
      }
    } catch (err) {
      console.error("Failed to load patient odontogram layers:", err);
    }
  };

  useEffect(() => {
    fetchDentalChartLogs();
    setSelectedTooth(null); // Reset selection when patient changes
  }, [patientId]);

  // Handle color code flags assignment matching design specs dynamically
  const getToothColorFlag = (toothNum) => {
    const state = chartMap[toothNum]?.condition;
    switch (state) {
      case 'Cavity': return '#ef4444';      // 🔴 Solid Red
      case 'Root Canal': return '#3b82f6';  // 🔵 Operational Blue
      case 'Missing': return '#64748b';     // ⚫ Slate Missing Gray
      case 'Filled': return '#10b981';      // 🟢 Emerald Green
      case 'Crown Needed': return '#f59e0b'; // 🟡 Amber Gold Warning
      default: return '#e2e8f0';            // ⚪ Default Clean Slate
    }
  };

  const handleUpdateToothState = async (e) => {
    e.preventDefault();
    if (!selectedTooth) return;

    setLoading(true);
    try {
      const response = await axios.post(API_TUNNEL, {
        patientId,
        toothNumber: selectedTooth,
        condition,
        notes: notes.trim()
      });

      if (response.data.status === 'success') {
        // Optimistically update local map coordinates state matrix
        setChartMap({
          ...chartMap,
          [selectedTooth]: { condition, notes, dateUpdated: new Date().toLocaleDateString('en-IN') }
        });
        setSelectedTooth(null); // Clear active card trigger control
        setNotes('');
        alert(`🎉 Tooth No. ${selectedTooth} Condition Logged Successfully!`);
      }
    } catch (err) {
      console.error("Odontogram engine network transmission failed:", err);
      alert("Database matrix transaction failure.");
    } finally {
      setLoading(false);
    }
  };

  // Generating helper arrays loops for clean map partitions
  const upperJawTeeth = Array.from({ length: 16 }, (_, i) => i + 1); // 1 to 16
  const lowerJawTeeth = Array.from({ length: 16 }, (_, i) => 32 - i); // 32 down to 17 for anatomical mirror symmetry

  return (
    <div style={{ fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      {/* Upper Layout: Visual Interactive Charting Section Grid */}
      <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start' }}>
        
        {/* Odontogram Interactive Panel */}
        <div style={{ flex: 2, background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
          <h4 style={{ marginTop: 0, color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', fontSize: '16px' }}>🦷 Interactive Odontogram Anatomy Matrix View</h4>
          
          {/* Color Indicators Legends */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', margin: '15px 0 30px 0', fontSize: '12px', fontWeight: 'bold' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '12px', height: '12px', background: '#e2e8f0', borderRadius: '3px' }}/> Healthy</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '3px' }}/> Cavity 🔴</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '3px' }}/> Root Canal 🔵</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '3px' }}/> Filled 🟢</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '3px' }}/> Crown Needed 🟡</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '12px', height: '12px', background: '#64748b', borderRadius: '3px' }}/> Missing ⚫</span>
          </div>

          {/* UPPER JAW GRID LAYER BLOCK */}
          <div style={{ marginBottom: '35px' }}>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>▲ UPPER JAW MAXILLARY ARCH</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '8px' }}>
              {upperJawTeeth.map(num => (
                <button key={num} onClick={() => setSelectedTooth(num)} style={{ position: 'relative', height: '55px', background: getToothColorFlag(num), border: selectedTooth === num ? '2px solid #0f172a' : '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontWeight: '800', fontSize: '13px', color: chartMap[num]?.condition && chartMap[num]?.condition !== 'Healthy' ? '#fff' : '#1e293b', transition: 'all 0.2s' }}>
                  {num}
                  {chartMap[num]?.condition && chartMap[num].condition !== 'Healthy' && (
                    <span style={{ fontSize: '9px', fontWeight: 'normal', opacity: 0.9 }}>{chartMap[num].condition.slice(0, 3)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* LOWER JAW GRID LAYER BLOCK */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '8px', marginBottom: '10px' }}>
              {lowerJawTeeth.map(num => (
                <button key={num} onClick={() => setSelectedTooth(num)} style={{ position: 'relative', height: '55px', background: getToothColorFlag(num), border: selectedTooth === num ? '2px solid #0f172a' : '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontWeight: '800', fontSize: '13px', color: chartMap[num]?.condition && chartMap[num]?.condition !== 'Healthy' ? '#fff' : '#1e293b', transition: 'all 0.2s' }}>
                  {num}
                  {chartMap[num]?.condition && chartMap[num].condition !== 'Healthy' && (
                    <span style={{ fontSize: '9px', fontWeight: 'normal', opacity: 0.9 }}>{chartMap[num].condition.slice(0, 3)}</span>
                  )}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold', textAlign: 'center' }}>▼ LOWER JAW MANDIBULAR ARCH</div>
          </div>

        </div>

        {/* Diagnostic Assessment Form Modifier Context */}
        <div style={{ flex: 1, background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', minHeight: '320px' }}>
          <h4 style={{ marginTop: 0, color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', fontSize: '16px' }}>⚡ Condition Assessment</h4>
          
          {selectedTooth ? (
            <form onSubmit={handleUpdateToothState} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#3b82f6' }}>Selected Active Unit: Tooth No. {selectedTooth}</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Clinical Status Map:</label>
                <select value={condition} onChange={(e) => setCondition(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}>
                  <option value="Healthy">Healthy / Natural State</option>
                  <option value="Cavity">Cavity / Decay detected 🔴</option>
                  <option value="Root Canal">Root Canal Treatment Done 🔵</option>
                  <option value="Filled">Amalgam/Composite Filled 🟢</option>
                  <option value="Crown Needed">Crown/Prosthetic Needed 🟡</option>
                  <option value="Missing">Tooth Extracted/Missing ⚫</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Doctor's Diagnostic Case Notes:</label>
                <textarea rows="3" placeholder="Enter custom observations (e.g. mesial decay path...)" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'none', fontFamily: 'sans-serif' }}/>
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                {loading ? "Saving State Parameters..." : "💾 Save Tooth Mapping Data"}
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', height: '220px', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }}>
              💡 Click on any individual tooth number block from the grid schema layout to load diagnoses controls.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default DentalChartModule;