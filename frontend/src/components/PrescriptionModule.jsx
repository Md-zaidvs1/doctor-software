import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrescriptionModule = ({ patientId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicine, setMedicine] = useState('');
  const [dosage, setDosage] = useState('1-0-1 (Before Food)');
  const [duration, setDuration] = useState('5 Days');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const API_TUNNEL = '/api/prescriptions';

  const fetchPrescriptionLogs = async () => {
    if (!patientId) return;
    try {
      const response = await axios.get(`${API_TUNNEL}/patient/${patientId}`);
      setPrescriptions(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Prescriptions lookup failed:", err);
    }
  };

  useEffect(() => {
    fetchPrescriptionLogs();
  }, [patientId]);

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    if (!medicine.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(API_TUNNEL, {
        patientId,
        medications: [{ medicine: medicine.trim(), dosage, duration }],
        notes: notes.trim()
      });

      if (response.status === 201 || response.data.status === "success") {
        alert("🎉 Rx Prescription Matrix Synced with Cloud Database!");
        setMedicine('');
        setNotes('');
        fetchPrescriptionLogs();
      }
    } catch (err) {
      console.error("Prescription dispatch error:", err);
      alert("Network thread transmission failure.");
    } finally {
      setLoading(false);
    }
  };

  // 🖨️ ELITE PRESCRIPTION EXPORT PDF ENGINE LAYOUT TRIGGER
  const triggerPrintPrescription = (rx) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Rx Clinical Prescription - Apex Dental Hub</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 50px; color: #1e293b; line-height: 1.6; }
            .letterhead { border-bottom: 3px double #3b82f6; padding-bottom: 20px; margin-bottom: 40px; }
            .clinic-title { font-size: 26px; font-weight: 800; color: #1e3a8a; margin: 0; }
            .clinic-subtitle { font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin: 5px 0 0 0; }
            .meta-grid { display: flex; justify-content: space-between; margin-bottom: 40px; font-size: 14px; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .rx-symbol { font-size: 32px; font-weight: bold; color: #3b82f6; margin-bottom: 20px; font-family: 'Times New Roman', serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 30px; }
            th, td { border-bottom: 1px solid #e2e8f0; padding: 14px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; color: #475569; }
            .notes-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 6px; font-size: 14px; margin-top: 30px; }
            .footer-sign { margin-top: 80px; display: flex; justify-content: space-between; font-size: 14px; border-top: 1px dashed #cbd5e1; pt: 20px; }
          </style>
        </head>
        <body>
          <div class="letterhead">
            <h2 class="clinic-title">🦷 APEX DENTAL HUB WORKSPACE</h2>
            <p class="clinic-subtitle">Premium Clinical Care & Diagnostics Network</p>
          </div>
          
          <div class="meta-grid">
            <div>
              <strong>Patient Profile Reference Node:</strong><br/>
              ID Node String: ${rx.patientId?.patientId || patientId}<br/>
              Date Logged: ${rx.dateGenerated || new Date().toLocaleDateString('en-IN')}
            </div>
            <div>
              <strong>Authorized Clinician Operator:</strong><br/>
              Dr. Emily Johnson (MDS - Oral Health)<br/>
              Reg ID: APEX-MED-77584
            </div>
          </div>

          <div class="rx-symbol">Rx</div>
          
          <table>
            <thead>
              <tr>
                <th>Medicine / Formulation Name</th>
                <th>Dosage Frequency Protocol</th>
                <th>Duration Period</th>
              </tr>
            </thead>
            <tbody>
              ${rx.medications.map(med => `
                <tr>
                  <td style="font-weight: bold; color: #0f172a;">💊 ${med.medicine}</td>
                  <td>${med.dosage}</td>
                  <td>${med.duration}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          ${rx.notes ? `<div class="notes-box"><strong>📋 Practitioner Advice & Instructions:</strong><br/>${rx.notes}</div>` : ''}

          <div class="footer-sign">
            <div>Report Token: System Checked Axis</div>
            <div style="text-align: right; margin-top: 40px;">
              <br/><strong>Authorized Signature</strong>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      {/* Upper Grid Split: Creation Form Layer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '25px' }}>
        
        {/* Form Container */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
          <h4 style={{ marginTop: 0, color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', fontSize: '15px' }}>📝 Draft Medical Prescription (Rx)</h4>
          
          <form onSubmit={handleAddPrescription} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="Medicine Name (e.g. Amoxicillin 500mg)" value={medicine} onChange={(e) => setMedicine(e.target.value)} style={{ flex: 2, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <select value={dosage} onChange={(e) => setDosage(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}>
                <option value="1-0-1 (Before Food)">1-0-1 (Before Food)</option>
                <option value="1-0-1 (After Food)">1-0-1 (After Food)</option>
                <option value="1-1-1 (After Food)">1-1-1 (After Food)</option>
                <option value="0-0-1 (Bedtime)">0-0-1 (Bedtime)</option>
              </select>
              <input type="text" placeholder="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '90px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Special Instructions / Notes:</label>
              <textarea rows="2" placeholder="Drink plenty of water, avoid cold dairy food steps..." value={notes} onChange={(e) => setNotes(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'none', fontFamily: 'sans-serif' }} />
            </div>

            <button type="submit" disabled={loading} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '11px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
              {loading ? "Locking Rx Data Streams..." : "➕ Append and Save Prescription Log"}
            </button>
          </form>
        </div>

        {/* Informative Grid Card */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🖨️</div>
          <h5 style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#1e293b' }}>Instant PDF Letterhead Generator</h5>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>Is component mein automatic style injection engine laga hai, jo prescription charts ko directly a4 letterhead format mein convert karke print dispatcher window trigger karta hai.</p>
        </div>

      </div>

      {/* Historical Logs Stream Section */}
      <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
        <h4 style={{ marginTop: 0, color: '#1e293b', marginBottom: '15px', fontSize: '15px' }}>📜 Past Saved Rx Logs For Selected Profile</h4>
        
        {prescriptions.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>No medical formulation data recorded for this user node context.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {prescriptions.map((rx) => (
              <div key={rx._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '15px 25px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>
                    💊 Formulation: {rx.medications?.[0]?.medicine || 'Standard Compound'} ({rx.medications?.[0]?.duration || 'N/A'})
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Frequency Index: {rx.medications?.[0]?.dosage || 'As directed'} | Date Logged: {rx.dateGenerated || new Date().toLocaleDateString('en-IN')}
                  </div>
                </div>
                <button onClick={() => triggerPrintPrescription(rx)} style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  🖨️ Export PDF / Print
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default PrescriptionModule;