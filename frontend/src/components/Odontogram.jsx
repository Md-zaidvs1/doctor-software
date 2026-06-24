import React, { useState, useEffect } from 'react';

const Odontogram = ({ patientId }) => {
  const [chartData, setChartData] = useState({});
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [statusInput, setStatusInput] = useState('Healthy');
  const [notesInput, setNotesInput] = useState('');
  const [saving, setSaving] = useState(false);

  const upperTeeth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const lowerTeeth = [32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17];

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // ✅ URL FIXED: Match with your backend GET route structure
    fetch(`/api/dental/records/patient/${patientId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-clinic-id': 'clinic-alpha-77'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const mapped = {};
        // Handle variations in array extraction safely
        const records = Array.isArray(data) ? data : (data.records || data.data || []);
        records.forEach(item => {
          mapped[item.toothNumber] = { status: item.status, notes: item.notes || '' };
        });
        setChartData(mapped);
        setSelectedTooth(null);
      })
      .catch((err) => console.error("Error fetching chart records:", err));
  }, [patientId]);

  const handleToothClick = (toothNum) => {
    setSelectedTooth(toothNum);
    setStatusInput(chartData[toothNum]?.status || 'Healthy');
    setNotesInput(chartData[toothNum]?.notes || '');
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedTooth) return;
    setSaving(true);

    const token = localStorage.getItem('token');

    const payload = {
      patientId,
      toothNumber: Number(selectedTooth),
      status: statusInput,
      notes: notesInput,
      clinicId: "clinic-alpha-77"
    };

    try {
      // ✅ URL FIXED: Match with your backend POST route structure
      const response = await fetch('/api/dental/records', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-clinic-id': 'clinic-alpha-77'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Server responded with status ${response.status}`);
      }

      setChartData(prev => ({
        ...prev,
        [selectedTooth]: { status: statusInput, notes: notesInput }
      }));
      setSelectedTooth(null);
    } catch (err) {
      alert("Error saving tooth data: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getToothColor = (status) => {
    switch (status) {
      case 'Caries': return '#e74c3c';
      case 'Restored': return '#3498db';
      case 'Missing': return '#7f8c8d';
      default: return '#2ecc71';
    }
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>Clinical Chart (Odontogram)</h2>
      <p style={{ color: '#7f8c8d' }}>Patient ID: {patientId}</p>

      <div style={{ margin: '30px 0', padding: '20px', background: '#f1f2f6', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          {upperTeeth.map(num => (
            <button
              key={num}
              onClick={() => handleToothClick(num)}
              style={{
                width: '40px', height: '55px', borderRadius: '4px', border: selectedTooth === num ? '3px solid #000' : '1px solid #bdc3c7',
                background: getToothColor(chartData[num]?.status), color: '#fff', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              {num}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {lowerTeeth.map(num => (
            <button
              key={num}
              onClick={() => handleToothClick(num)}
              style={{
                width: '40px', height: '55px', borderRadius: '4px', border: selectedTooth === num ? '3px solid #000' : '1px solid #bdc3c7',
                background: getToothColor(chartData[num]?.status), color: '#fff', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {selectedTooth && (
        <form onSubmit={handleSaveStatus} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px', border: '1px solid #dee2e6' }}>
          <h4>Update Condition for Tooth #{selectedTooth}</h4>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Condition: </label>
            <select value={statusInput} onChange={(e) => setStatusInput(e.target.value)} style={{ padding: '5px', width: '150px' }}>
              <option value="Healthy">Healthy</option>
              <option value="Caries">Caries</option>
              <option value="Restored">Restored</option>
              <option value="Missing">Missing</option>
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Clinical Notes: </label>
            <textarea 
              value={notesInput} 
              onChange={(e) => setNotesInput(e.target.value)} 
              rows="2" 
              style={{ width: '100%', padding: '5px' }} 
              placeholder="Add observation details..."
            />
          </div>

          <button type="submit" disabled={saving} style={{ background: '#3498db', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
            {saving ? 'Saving...' : 'Save Diagnosis'}
          </button>
          <button type="button" onClick={() => setSelectedTooth(null)} style={{ marginLeft: '10px', background: '#ccc', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Odontogram;