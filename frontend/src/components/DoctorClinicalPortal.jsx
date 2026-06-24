import React, { useState } from 'react';

// ==========================================
// 🦷 INLINE MODULE: DOCTOR CLINICAL PORTAL 
// ==========================================
const DoctorClinicalPortal = ({ activePatientId }) => {

  // ── TABS ──────────────────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState('dashboard');

  // ── PATIENTS DATA ─────────────────────────────────────────────────────────
  const [patients] = useState([
    {
      id: "PT-901", name: "Thomas Angelo", age: 32, sex: "Male", blood: "LW (a+)",
      height: "6'2\"", weight: "140 lb", tel: "999 545 8842", avatarColor: "#38bdf8",
      allergies: ["Penicillin", "Aspirin"], conditions: ["Hypertension"],
      lastVisit: "10 Jun 2026", nextVisit: "20 Jun 2026",
      history: [
        { date: "10 Jun 2026", procedure: "Root Canal Treatment", tooth: 14, cost: 3500, status: "Completed" },
        { date: "15 May 2026", procedure: "Scaling & Polishing", tooth: null, cost: 800, status: "Completed" },
      ],
      prescriptions: [
        { drug: "Amoxicillin 500mg", dosage: "1-0-1", days: 5, date: "10 Jun 2026" },
        { drug: "Ibuprofen 400mg", dosage: "1-1-1", days: 3, date: "10 Jun 2026" },
      ],
      documents: [
        { name: "OPG X-Ray Jun 2026.jpg", type: "xray", date: "10 Jun 2026" },
        { name: "Medical History Form.pdf", type: "doc", date: "01 Jan 2026" },
      ],
      toothStatus: { 7: 'cured', 8: 'cured', 13: 'prosthesis', 14: 'prosthesis', 17: 'caries', 25: 'caries', 1: 'missing', 27: 'missing' }
    },
    {
      id: "PT-902", name: "Rahul Kumar", age: 28, sex: "Male", blood: "B+",
      height: "5'9\"", weight: "165 lb", tel: "987 654 3210", avatarColor: "#34d399",
      allergies: ["Sulfa drugs"], conditions: ["Diabetes Type 2"],
      lastVisit: "08 Jun 2026", nextVisit: "22 Jun 2026",
      history: [
        { date: "08 Jun 2026", procedure: "Tooth Extraction", tooth: 28, cost: 1200, status: "Completed" },
      ],
      prescriptions: [
        { drug: "Metronidazole 400mg", dosage: "1-1-1", days: 5, date: "08 Jun 2026" },
      ],
      documents: [
        { name: "Periapical X-Ray.jpg", type: "xray", date: "08 Jun 2026" },
      ],
      toothStatus: { 28: 'missing', 3: 'caries', 19: 'caries' }
    },
    {
      id: "PT-903", name: "Zaid Khan", age: 24, sex: "Male", blood: "O+",
      height: "5'7\"", weight: "150 lb", tel: "912 345 6789", avatarColor: "#f472b6",
      allergies: [], conditions: [],
      lastVisit: "12 Jun 2026", nextVisit: "15 Jun 2026",
      history: [
        { date: "12 Jun 2026", procedure: "Composite Filling", tooth: 6, cost: 900, status: "In Progress" },
      ],
      prescriptions: [],
      documents: [],
      toothStatus: { 6: 'caries', 11: 'caries' }
    },
    {
      id: "PT-904", name: "Aman Verma", age: 35, sex: "Male", blood: "A+",
      height: "5'11\"", weight: "175 lb", tel: "900 123 4567", avatarColor: "#fbbf24",
      allergies: ["Latex"], conditions: ["Asthma"],
      lastVisit: "05 Jun 2026", nextVisit: "19 Jun 2026",
      history: [
        { date: "05 Jun 2026", procedure: "Crown Placement", tooth: 16, cost: 5000, status: "Completed" },
        { date: "20 May 2026", procedure: "Root Canal Treatment", tooth: 16, cost: 3500, status: "Completed" },
      ],
      prescriptions: [
        { drug: "Clindamycin 300mg", dosage: "1-0-1", days: 7, date: "05 Jun 2026" },
      ],
      documents: [
        { name: "Crown Prep X-Ray.jpg", type: "xray", date: "05 Jun 2026" },
      ],
      toothStatus: { 16: 'prosthesis', 2: 'cured', 15: 'cured' }
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [selectedTooth, setSelectedTooth] = useState(null);

  // ── APPOINTMENT DATA ────────────────────────────────────────────────────────
  const appointments = [
    { pid: "PT-901", name: "Thomas Angelo", time: "09:00 AM", type: "Root Canal Follow-up", status: "done", color: "#38bdf8", emergency: false },
    { pid: "PT-902", name: "Rahul Kumar",   time: "11:00 AM", type: "Post-Extraction Review", status: "progress", color: "#34d399", emergency: false },
    { pid: "PT-903", name: "Zaid Khan",     time: "01:30 PM", type: "Filling Completion",  status: "pending", color: "#f472b6", emergency: false },
    { pid: "PT-904", name: "Aman Verma",    time: "03:00 PM", type: "Crown Cementation",  status: "pending", color: "#fbbf24", emergency: false },
    { pid: "PT-901", name: "Emergency Walk-In", time: "04:30 PM", type: "Severe Toothache", status: "emergency", color: "#ef4444", emergency: true },
  ];

  const followUps = [
    { name: "Thomas Angelo", due: "20 Jun 2026", reason: "Root Canal Review", priority: "high" },
    { name: "Aman Verma",    due: "19 Jun 2026", reason: "Crown Adjustment",  priority: "medium" },
    { name: "Rahul Kumar",   due: "22 Jun 2026", reason: "Extraction Socket Check", priority: "low" },
  ];

  // ── SOAP NOTES STATE ────────────────────────────────────────────────────────
  const [soap, setSoap] = useState({ S: '', O: '', A: '', P: '' });
  const [voiceActive, setVoiceActive] = useState(false);
  const [activeSOAP, setActiveSOAP] = useState('S');

  // ── TREATMENT PLAN STATE ────────────────────────────────────────────────────
  const [treatmentPlan, setTreatmentPlan] = useState([
    { id: 1, procedure: "Root Canal Treatment", tooth: 14, cost: 3500, status: "Completed", phase: 1 },
    { id: 2, procedure: "Crown Placement",       tooth: 14, cost: 5000, status: "Pending",   phase: 2 },
    { id: 3, procedure: "Scaling & Polishing",   tooth: null, cost: 800, status: "Pending", phase: 3 },
  ]);
  const [newProc, setNewProc] = useState({ procedure: '', tooth: '', cost: '', phase: 1 });

  // ── PRESCRIPTION STATE ──────────────────────────────────────────────────────
  const [rxList, setRxList] = useState(selectedPatient.prescriptions);
  const [newRx, setNewRx] = useState({ drug: '', dosage: '', days: '', notes: '' });

  // ── FOLLOW-UP SCHEDULE STATE ─────────────────────────────────────────────────
  const [newFollowUp, setNewFollowUp] = useState({ date: '', reason: '', notes: '' });
  const [followUpSaved, setFollowUpSaved] = useState(false);

  // ── TOOTH CHART ──────────────────────────────────────────────────────────────
  const toothColorMap = { cured: '#34d399', caries: '#f472b6', prosthesis: '#818cf8', missing: '#52525b' };
  const upperTeeth = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
  const lowerTeeth = [32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17];

  const toothColor = (num) => {
    const s = selectedPatient.toothStatus[num];
    return s ? toothColorMap[s] : '#3f3f46';
  };

  // ── STYLES ─────────────────────────────────────────────────────────────────
  const S = {
    wrap:       { fontFamily: 'sans-serif', display: 'flex', height: '85vh', background: '#0f172a', borderRadius: '24px', overflow: 'hidden' },
    sidebar:    { width: '220px', background: '#1e293b', display: 'flex', flexDirection: 'column', padding: '20px 12px', gap: '4px', flexShrink: 0 },
    logo:       { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px', marginBottom: '28px' },
    navBtn:     (active) => ({ width: '100%', padding: '10px 12px', background: active ? '#38bdf8' : 'transparent', color: active ? '#0f172a' : '#94a3b8', border: 'none', borderRadius: '8px', textAlign: 'left', fontWeight: '600', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }),
    main:       { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    topbar:     { background: '#1e293b', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' },
    content:    { flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' },
    card:       { background: '#1e293b', borderRadius: '14px', padding: '16px 18px' },
    cardHead:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    label:      { fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
    badge:      (color) => ({ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', background: color + '22', color }),
    input:      { background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#e2e8f0', fontSize: '12px', width: '100%', boxSizing: 'border-box' },
    textarea:   { background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', color: '#e2e8f0', fontSize: '12px', width: '100%', resize: 'none', boxSizing: 'border-box' },
    btn:        (bg, color) => ({ padding: '8px 16px', background: bg, color: color || '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '11px', cursor: 'pointer' }),
    grid2:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    grid3:      { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' },
    statCard:   { background: '#0f172a', borderRadius: '10px', padding: '12px 14px' },
    ptCard:     (active) => ({ padding: '10px 12px', borderRadius: '10px', background: active ? '#38bdf8' : '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }),
  };

  const navItems = [
    { id: 'dashboard',  icon: '📊', label: 'Dashboard'          },
    { id: 'patients',   icon: '👤', label: 'Patient Records'    },
    { id: 'charting',   icon: '🦷', label: 'Dental Charting'    },
    { id: 'treatment',  icon: '📋', label: 'Treatment Plans'    },
    { id: 'soap',       icon: '📝', label: 'Clinical Notes'     },
    { id: 'rx',         icon: '💊', label: 'Prescriptions'      },
    { id: 'followup',   icon: '🔔', label: 'Follow-ups'         },
  ];

  const statusColor = { done: '#34d399', progress: '#38bdf8', pending: '#fbbf24', emergency: '#ef4444' };
  const statusLabel = { done: 'Done', progress: 'In Progress', pending: 'Pending', emergency: '🚨 Emergency' };

  // ── SELECT PATIENT ──────────────────────────────────────────────────────────
  const selectPatient = (p) => {
    setSelectedPatient(p);
    setRxList(p.prescriptions);
    setSelectedTooth(null);
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={S.wrap}>

      {/* ── SIDEBAR ── */}
      <div style={S.sidebar}>
        <div style={S.logo}>
          <div style={{ background: '#38bdf8', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🦷</div>
          <span style={{ color: '#fff', fontWeight: '800', fontSize: '15px' }}>Doctor Portal</span>
        </div>

        {navItems.map(n => (
          <button key={n.id} style={S.navBtn(activeSection === n.id)} onClick={() => setActiveSection(n.id)}>
            <span>{n.icon}</span> {n.label}
          </button>
        ))}

        <div style={{ marginTop: 'auto' }}>
          <div style={{ padding: '10px 12px', borderRadius: '10px', background: '#0f172a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f472b6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px', color: '#fff' }}>VR</div>
              <div>
                <div style={{ color: '#fff', fontSize: '11px', fontWeight: '700' }}>Dr. V. Radhakrishnan</div>
                <div style={{ color: '#64748b', fontSize: '10px' }}>BDS, MDS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={S.main}>

        {/* TOP BAR */}
        <div style={S.topbar}>
          <div>
            <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Clinical Portal</div>
            <div style={{ color: '#fff', fontWeight: '700', fontSize: '16px' }}>
              {navItems.find(n => n.id === activeSection)?.icon} {navItems.find(n => n.id === activeSection)?.label}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
              🚨 1 Emergency
            </div>
            <div style={{ color: '#64748b', fontSize: '12px' }}>Mon, 15 Jun 2026</div>
          </div>
        </div>

        {/* ─────────────────────────────────────── */}
        {/* SECTION: DASHBOARD                      */}
        {/* ─────────────────────────────────────── */}
        {activeSection === 'dashboard' && (
          <div style={S.content}>

            {/* STATS ROW */}
            <div style={S.grid3}>
              {[
                { label: "Today's Patients", value: '4', sub: '1 emergency', color: '#38bdf8' },
                { label: 'Pending Follow-ups', value: '3', sub: 'Due this week', color: '#fbbf24' },
                { label: "Revenue Today", value: '₹11,200', sub: 'Across 3 treatments', color: '#34d399' },
              ].map((s, i) => (
                <div key={i} style={{ ...S.card, borderLeft: `3px solid ${s.color}` }}>
                  <div style={S.label}>{s.label}</div>
                  <div style={{ color: s.color, fontSize: '26px', fontWeight: '800', margin: '6px 0 2px' }}>{s.value}</div>
                  <div style={{ color: '#64748b', fontSize: '11px' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* APPOINTMENTS + FOLLOW-UPS */}
            <div style={S.grid2}>
              {/* TODAY'S APPOINTMENTS */}
              <div style={S.card}>
                <div style={S.cardHead}>
                  <span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '13px' }}>Today's Appointments</span>
                  <span style={S.badge('#38bdf8')}>{appointments.length} total</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {appointments.map((a, i) => (
                    <div key={i} onClick={() => { const p = patients.find(p => p.id === a.pid); if (p) { selectPatient(p); setActiveSection('patients'); }}}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: a.emergency ? '#450a0a' : '#0f172a', cursor: 'pointer', borderLeft: `3px solid ${a.color}` }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: '#0f172a', flexShrink: 0 }}>
                        {a.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: '700' }}>{a.name}</div>
                        <div style={{ color: '#64748b', fontSize: '10px' }}>{a.type}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#94a3b8', fontSize: '11px' }}>{a.time}</div>
                        <span style={S.badge(statusColor[a.status])}>{statusLabel[a.status]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FOLLOW-UPS + UPCOMING */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={S.card}>
                  <div style={S.cardHead}>
                    <span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '13px' }}>Pending Follow-ups</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {followUps.map((f, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#0f172a', borderRadius: '8px' }}>
                        <div>
                          <div style={{ color: '#e2e8f0', fontSize: '11px', fontWeight: '700' }}>{f.name}</div>
                          <div style={{ color: '#64748b', fontSize: '10px' }}>{f.reason}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#94a3b8', fontSize: '10px' }}>{f.due}</div>
                          <span style={S.badge(f.priority === 'high' ? '#ef4444' : f.priority === 'medium' ? '#fbbf24' : '#34d399')}>{f.priority}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ ...S.card, background: '#450a0a', border: '1px solid #ef4444' }}>
                  <div style={{ color: '#ef4444', fontWeight: '700', fontSize: '13px', marginBottom: '8px' }}>🚨 Emergency Case</div>
                  <div style={{ color: '#fca5a5', fontSize: '12px' }}>Walk-in patient — Severe toothache, possible abscess. Scheduled 4:30 PM today.</div>
                  <button style={{ ...S.btn('#ef4444'), marginTop: '10px', width: '100%' }}>View & Assign</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────── */}
        {/* SECTION: PATIENT RECORDS               */}
        {/* ─────────────────────────────────────── */}
        {activeSection === 'patients' && (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '200px 1fr', overflow: 'hidden' }}>
            {/* PATIENT LIST */}
            <div style={{ background: '#0f172a', padding: '14px', overflowY: 'auto', borderRight: '1px solid #334155' }}>
              <div style={{ color: '#64748b', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '10px' }}>Patients</div>
              {patients.map(p => (
                <div key={p.id} style={S.ptCard(selectedPatient.id === p.id)} onClick={() => selectPatient(p)}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: p.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '11px', color: '#0f172a', flexShrink: 0 }}>
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ color: selectedPatient.id === p.id ? '#0f172a' : '#e2e8f0', fontSize: '11px', fontWeight: '700' }}>{p.name}</div>
                    <div style={{ color: selectedPatient.id === p.id ? '#0f172a' : '#64748b', fontSize: '10px' }}>{p.id}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* PATIENT DETAIL */}
            <div style={{ overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* PROFILE HEADER */}
              <div style={S.card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: selectedPatient.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '20px', color: '#0f172a' }}>
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: '800', fontSize: '17px' }}>{selectedPatient.name}</div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>{selectedPatient.id} · Last visit: {selectedPatient.lastVisit}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                    <button style={S.btn('#38bdf8', '#0f172a')} onClick={() => setActiveSection('rx')}>+ Prescription</button>
                    <button style={S.btn('#818cf8')} onClick={() => setActiveSection('treatment')}>Treatment Plan</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', marginTop: '16px' }}>
                  {[
                    ['Age', selectedPatient.age],
                    ['Sex', selectedPatient.sex],
                    ['Blood', selectedPatient.blood],
                    ['Height', selectedPatient.height],
                    ['Weight', selectedPatient.weight],
                    ['Tel', selectedPatient.tel],
                  ].map(([k, v]) => (
                    <div key={k} style={S.statCard}>
                      <div style={S.label}>{k}</div>
                      <div style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '13px', marginTop: '4px' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ALLERGIES + CONDITIONS */}
              <div style={S.grid2}>
                <div style={S.card}>
                  <div style={S.cardHead}><span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '13px' }}>⚠️ Allergies</span></div>
                  {selectedPatient.allergies.length === 0
                    ? <div style={{ color: '#34d399', fontSize: '12px' }}>No known allergies</div>
                    : selectedPatient.allergies.map((a, i) => (
                      <span key={i} style={{ ...S.badge('#ef4444'), display: 'inline-block', marginRight: '6px', marginBottom: '4px', padding: '4px 10px', fontSize: '11px' }}>{a}</span>
                    ))
                  }
                </div>
                <div style={S.card}>
                  <div style={S.cardHead}><span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '13px' }}>🩺 Health Conditions</span></div>
                  {selectedPatient.conditions.length === 0
                    ? <div style={{ color: '#34d399', fontSize: '12px' }}>No known conditions</div>
                    : selectedPatient.conditions.map((c, i) => (
                      <span key={i} style={{ ...S.badge('#fbbf24'), display: 'inline-block', marginRight: '6px', marginBottom: '4px', padding: '4px 10px', fontSize: '11px' }}>{c}</span>
                    ))
                  }
                </div>
              </div>

              {/* VISIT HISTORY */}
              <div style={S.card}>
                <div style={S.cardHead}><span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '13px' }}>Previous Visits</span></div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ color: '#64748b' }}>
                      {['Date', 'Procedure', 'Tooth', 'Cost', 'Status'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontWeight: '600', fontSize: '10px', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPatient.history.map((h, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #334155' }}>
                        <td style={{ padding: '8px', color: '#94a3b8' }}>{h.date}</td>
                        <td style={{ padding: '8px', color: '#e2e8f0', fontWeight: '600' }}>{h.procedure}</td>
                        <td style={{ padding: '8px', color: '#94a3b8' }}>{h.tooth ? `Tooth #${h.tooth}` : '—'}</td>
                        <td style={{ padding: '8px', color: '#34d399', fontWeight: '700' }}>₹{h.cost.toLocaleString()}</td>
                        <td style={{ padding: '8px' }}><span style={S.badge(h.status === 'Completed' ? '#34d399' : '#fbbf24')}>{h.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* DOCUMENTS */}
              <div style={S.card}>
                <div style={S.cardHead}>
                  <span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '13px' }}>Documents & X-Rays</span>
                  <button style={S.btn('#334155')}>+ Upload</button>
                </div>
                {selectedPatient.documents.length === 0
                  ? <div style={{ color: '#64748b', fontSize: '12px' }}>No documents uploaded</div>
                  : <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedPatient.documents.map((d, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#0f172a', borderRadius: '8px' }}>
                        <span style={{ fontSize: '18px' }}>{d.type === 'xray' ? '🩻' : '📄'}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: '600' }}>{d.name}</div>
                          <div style={{ color: '#64748b', fontSize: '10px' }}>{d.date}</div>
                        </div>
                        <button style={S.btn('#334155')}>View</button>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────── */}
        {/* SECTION: DENTAL CHARTING               */}
        {/* ─────────────────────────────────────── */}
        {activeSection === 'charting' && (
          <div style={S.content}>
            <div style={S.grid2}>
              {/* TOOTH CHART */}
              <div style={S.card}>
                <div style={S.cardHead}>
                  <span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '13px' }}>Interactive Tooth Chart — {selectedPatient.name}</span>
                </div>

                {/* LEGEND */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {Object.entries({ Cured: '#34d399', Caries: '#f472b6', Prosthesis: '#818cf8', Missing: '#52525b', Healthy: '#3f3f46' }).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: v }}></div>
                      <span style={{ color: '#94a3b8', fontSize: '10px' }}>{k}</span>
                    </div>
                  ))}
                </div>

                {/* UPPER TEETH */}
                <div style={{ marginBottom: '6px' }}>
                  <div style={{ color: '#64748b', fontSize: '10px', fontWeight: '600', marginBottom: '6px' }}>UPPER (1–16)</div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {upperTeeth.map(num => (
                      <div key={num} onClick={() => setSelectedTooth(selectedTooth === num ? null : num)}
                        style={{ width: '32px', height: '38px', borderRadius: '6px', background: toothColor(num), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: selectedTooth === num ? '2px solid #fff' : '2px solid transparent', fontSize: '9px', fontWeight: '700', color: '#fff' }}>
                        <span style={{ fontSize: '14px' }}>🦷</span>
                        {num}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed #334155', margin: '10px 0', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '50%', top: '-9px', transform: 'translateX(-50%)', background: '#1e293b', padding: '0 8px', color: '#64748b', fontSize: '10px' }}>MIDLINE</span>
                </div>

                {/* LOWER TEETH */}
                <div>
                  <div style={{ color: '#64748b', fontSize: '10px', fontWeight: '600', marginBottom: '6px' }}>LOWER (17–32)</div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {lowerTeeth.map(num => (
                      <div key={num} onClick={() => setSelectedTooth(selectedTooth === num ? null : num)}
                        style={{ width: '32px', height: '38px', borderRadius: '6px', background: toothColor(num), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: selectedTooth === num ? '2px solid #fff' : '2px solid transparent', fontSize: '9px', fontWeight: '700', color: '#fff' }}>
                        <span style={{ fontSize: '14px' }}>🦷</span>
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TOOTH DETAIL + HISTORY */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={S.card}>
                  {selectedTooth ? (
                    <>
                      <div style={{ color: '#38bdf8', fontWeight: '800', fontSize: '15px', marginBottom: '8px' }}>Tooth #{selectedTooth}</div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '12px' }}>
                        Status: <span style={{ color: '#e2e8f0', fontWeight: '700' }}>
                          {selectedPatient.toothStatus[selectedTooth] 
                            ? selectedPatient.toothStatus[selectedTooth].charAt(0).toUpperCase() + selectedPatient.toothStatus[selectedTooth].slice(1)
                            : 'Healthy'}
                        </span>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <div style={S.label}>Diagnosis Notes</div>
                        <textarea style={{ ...S.textarea, marginTop: '6px', height: '80px' }} placeholder="Enter diagnosis for this tooth..." />
                      </div>
                      <div>
                        <div style={S.label}>Treatment History for this Tooth</div>
                        {selectedPatient.history.filter(h => h.tooth === selectedTooth).length === 0
                          ? <div style={{ color: '#64748b', fontSize: '11px', marginTop: '6px' }}>No treatment recorded</div>
                          : selectedPatient.history.filter(h => h.tooth === selectedTooth).map((h, i) => (
                            <div key={i} style={{ padding: '8px 10px', background: '#0f172a', borderRadius: '8px', marginTop: '6px', fontSize: '11px', color: '#94a3b8' }}>
                              <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{h.procedure}</span> · {h.date}
                            </div>
                          ))
                        }
                      </div>
                      <button style={{ ...S.btn('#38bdf8', '#0f172a'), marginTop: '12px', width: '100%' }}>Save Diagnosis</button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', padding: '30px 0' }}>
                      Click any tooth on the chart to view details
                    </div>
                  )}
                </div>

                <div style={S.card}>
                  <div style={S.cardHead}><span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '13px' }}>Dental Condition Summary</span></div>
                  {[
                    { label: 'Healthy', count: 32 - Object.keys(selectedPatient.toothStatus).length, color: '#3f3f46' },
                    { label: 'Cured', count: Object.values(selectedPatient.toothStatus).filter(v => v === 'cured').length, color: '#34d399' },
                    { label: 'Caries', count: Object.values(selectedPatient.toothStatus).filter(v => v === 'caries').length, color: '#f472b6' },
                    { label: 'Prosthesis', count: Object.values(selectedPatient.toothStatus).filter(v => v === 'prosthesis').length, color: '#818cf8' },
                    { label: 'Missing', count: Object.values(selectedPatient.toothStatus).filter(v => v === 'missing').length, color: '#52525b' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, flexShrink: 0 }}></div>
                      <span style={{ color: '#94a3b8', fontSize: '11px', width: '80px' }}>{item.label}</span>
                      <div style={{ flex: 1, height: '5px', background: '#0f172a', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${(item.count / 32) * 100}%`, height: '100%', background: item.color, borderRadius: '3px' }}></div>
                      </div>
                      <span style={{ color: '#e2e8f0', fontSize: '11px', fontWeight: '700', width: '20px', textAlign: 'right' }}>{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────── */}
        {/* SECTION: TREATMENT MANAGEMENT          */}
        {/* ─────────────────────────────────────── */}
        {activeSection === 'treatment' && (
          <div style={S.content}>
            <div style={S.card}>
              <div style={S.cardHead}>
                <span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '13px' }}>Treatment Plan — {selectedPatient.name}</span>
                <span style={{ color: '#34d399', fontWeight: '700', fontSize: '13px' }}>
                  Total: ₹{treatmentPlan.reduce((s, t) => s + Number(t.cost), 0).toLocaleString()}
                </span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '16px' }}>
                <thead>
                  <tr style={{ color: '#64748b' }}>
                    {['Phase', 'Procedure', 'Tooth', 'Cost (₹)', 'Status', 'Action'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontWeight: '600', fontSize: '10px', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {treatmentPlan.map((t) => (
                    <tr key={t.id} style={{ borderTop: '1px solid #334155' }}>
                      <td style={{ padding: '8px', color: '#64748b' }}>Phase {t.phase}</td>
                      <td style={{ padding: '8px', color: '#e2e8f0', fontWeight: '600' }}>{t.procedure}</td>
                      <td style={{ padding: '8px', color: '#94a3b8' }}>{t.tooth ? `#${t.tooth}` : '—'}</td>
                      <td style={{ padding: '8px', color: '#34d399', fontWeight: '700' }}>₹{Number(t.cost).toLocaleString()}</td>
                      <td style={{ padding: '8px' }}><span style={S.badge(t.status === 'Completed' ? '#34d399' : '#fbbf24')}>{t.status}</span></td>
                      <td style={{ padding: '8px' }}>
                        <button style={S.btn(t.status === 'Completed' ? '#334155' : '#34d399', t.status === 'Completed' ? '#64748b' : '#0f172a')}
                          onClick={() => setTreatmentPlan(prev => prev.map(p => p.id === t.id ? { ...p, status: p.status === 'Completed' ? 'Pending' : 'Completed' } : p))}>
                          {t.status === 'Completed' ? 'Undo' : 'Mark Done'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ADD PROCEDURE */}
              <div style={{ borderTop: '1px solid #334155', paddingTop: '14px' }}>
                <div style={{ color: '#94a3b8', fontWeight: '700', fontSize: '12px', marginBottom: '10px' }}>Add New Procedure</div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', alignItems: 'end' }}>
                  <div>
                    <div style={S.label}>Procedure</div>
                    <input style={{ ...S.input, marginTop: '4px' }} placeholder="e.g. Root Canal" value={newProc.procedure}
                      onChange={e => setNewProc(p => ({ ...p, procedure: e.target.value }))} />
                  </div>
                  <div>
                    <div style={S.label}>Tooth #</div>
                    <input style={{ ...S.input, marginTop: '4px' }} placeholder="e.g. 14" value={newProc.tooth}
                      onChange={e => setNewProc(p => ({ ...p, tooth: e.target.value }))} />
                  </div>
                  <div>
                    <div style={S.label}>Cost (₹)</div>
                    <input style={{ ...S.input, marginTop: '4px' }} placeholder="e.g. 3500" value={newProc.cost}
                      onChange={e => setNewProc(p => ({ ...p, cost: e.target.value }))} />
                  </div>
                  <div>
                    <div style={S.label}>Phase</div>
                    <select style={{ ...S.input, marginTop: '4px' }} value={newProc.phase}
                      onChange={e => setNewProc(p => ({ ...p, phase: e.target.value }))}>
                      {[1,2,3,4].map(n => <option key={n} value={n}>Phase {n}</option>)}
                    </select>
                  </div>
                  <button style={{ ...S.btn('#38bdf8', '#0f172a'), height: '34px', whiteSpace: 'nowrap' }}
                    onClick={() => {
                      if (!newProc.procedure || !newProc.cost) return;
                      setTreatmentPlan(prev => [...prev, { id: Date.now(), procedure: newProc.procedure, tooth: newProc.tooth ? Number(newProc.tooth) : null, cost: Number(newProc.cost), status: 'Pending', phase: Number(newProc.phase) }]);
                      setNewProc({ procedure: '', tooth: '', cost: '', phase: 1 });
                    }}>
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────── */}
        {/* SECTION: CLINICAL NOTES (SOAP)         */}
        {/* ─────────────────────────────────────── */}
        {activeSection === 'soap' && (
          <div style={S.content}>
            <div style={S.card}>
              <div style={S.cardHead}>
                <span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '13px' }}>SOAP Notes — {selectedPatient.name}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={S.btn(voiceActive ? '#ef4444' : '#334155')}
                    onClick={() => setVoiceActive(v => !v)}>
                    {voiceActive ? '🔴 Stop Voice' : '🎙️ Voice-to-Text'}
                  </button>
                  <button style={S.btn('#38bdf8', '#0f172a')}>💾 Save Notes</button>
                </div>
              </div>

              {voiceActive && (
                <div style={{ padding: '10px 14px', background: '#450a0a', borderRadius: '8px', marginBottom: '12px', border: '1px solid #ef4444', color: '#fca5a5', fontSize: '12px' }}>
                  🔴 Voice recording active — speak clearly. Notes will auto-fill in the active section.
                </div>
              )}

              {/* SOAP TAB SELECTOR */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                {[['S', 'Subjective'], ['O', 'Objective'], ['A', 'Assessment'], ['P', 'Plan']].map(([k, label]) => (
                  <button key={k} style={{ ...S.btn(activeSOAP === k ? '#818cf8' : '#0f172a'), flex: 1 }}
                    onClick={() => setActiveSOAP(k)}>
                    <strong>{k}</strong> — {label}
                  </button>
                ))}
              </div>

              <div>
                {[['S', 'Subjective', "Patient's chief complaint, symptoms, pain level, duration..."],
                  ['O', 'Objective', "Clinical findings, vitals, examination results..."],
                  ['A', 'Assessment', "Diagnosis, differential diagnosis, clinical impression..."],
                  ['P', 'Plan', "Treatment plan, medications, follow-up instructions..."]
                ].filter(([k]) => k === activeSOAP).map(([k, label, ph]) => (
                  <div key={k}>
                    <div style={{ color: '#818cf8', fontWeight: '700', fontSize: '12px', marginBottom: '6px' }}>{label}</div>
                    <textarea
                      style={{ ...S.textarea, height: '160px' }}
                      placeholder={ph}
                      value={soap[k]}
                      onChange={e => setSoap(prev => ({ ...prev, [k]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>

              {/* ALL SOAP PREVIEW */}
              <div style={{ marginTop: '14px', borderTop: '1px solid #334155', paddingTop: '14px' }}>
                <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Full SOAP Preview</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[['S', 'Subjective'], ['O', 'Objective'], ['A', 'Assessment'], ['P', 'Plan']].map(([k, label]) => (
                    <div key={k} style={{ padding: '10px 12px', background: '#0f172a', borderRadius: '8px', borderLeft: '3px solid #818cf8' }}>
                      <div style={{ color: '#818cf8', fontSize: '10px', fontWeight: '700', marginBottom: '4px' }}>{label}</div>
                      <div style={{ color: soap[k] ? '#e2e8f0' : '#334155', fontSize: '11px', minHeight: '32px' }}>
                        {soap[k] || 'Not filled yet...'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ATTACH PHOTOS */}
            <div style={S.card}>
              <div style={S.cardHead}><span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '13px' }}>Attach Photos & X-Rays</span></div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ ...S.btn('#334155'), flex: 1, padding: '14px' }}>📷 Camera Photo</button>
                <button style={{ ...S.btn('#334155'), flex: 1, padding: '14px' }}>🩻 Upload X-Ray</button>
                <button style={{ ...S.btn('#334155'), flex: 1, padding: '14px' }}>📄 Attach Document</button>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────── */}
        {/* SECTION: PRESCRIPTIONS                 */}
        {/* ─────────────────────────────────────── */}
        {activeSection === 'rx' && (
          <div style={S.content}>
            <div style={S.card}>
              <div style={S.cardHead}>
                <span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '13px' }}>Digital Prescription — {selectedPatient.name}</span>
                <button style={S.btn('#38bdf8', '#0f172a')}>🖨️ Print Rx</button>
              </div>

              {/* PRESCRIPTION HEADER */}
              <div style={{ padding: '12px 14px', background: '#0f172a', borderRadius: '10px', marginBottom: '14px' }}>
                <div style={{ color: '#e2e8f0', fontWeight: '800', fontSize: '14px' }}>Plant2Tree Workstation</div>
                <div style={{ color: '#64748b', fontSize: '11px' }}>Dr. V. Radhakrishnan · BDS, MDS · Reg No: TN-12345</div>
                <div style={{ display: 'flex', gap: '20px', marginTop: '8px', fontSize: '11px', color: '#94a3b8' }}>
                  <span>Patient: <strong style={{ color: '#e2e8f0' }}>{selectedPatient.name}</strong></span>
                  <span>Age: <strong style={{ color: '#e2e8f0' }}>{selectedPatient.age}</strong></span>
                  <span>Date: <strong style={{ color: '#e2e8f0' }}>15 Jun 2026</strong></span>
                </div>
                {selectedPatient.allergies.length > 0 && (
                  <div style={{ marginTop: '8px', padding: '4px 10px', background: '#450a0a', borderRadius: '6px', color: '#fca5a5', fontSize: '11px', fontWeight: '700' }}>
                    ⚠️ ALLERGY: {selectedPatient.allergies.join(', ')}
                  </div>
                )}
              </div>

              {/* MEDICINE LIST */}
              {rxList.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '14px' }}>
                  <thead>
                    <tr style={{ color: '#64748b' }}>
                      {['#', 'Drug', 'Dosage', 'Days', 'Date', ''].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontWeight: '600', fontSize: '10px', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rxList.map((r, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #334155' }}>
                        <td style={{ padding: '8px', color: '#64748b' }}>{i + 1}</td>
                        <td style={{ padding: '8px', color: '#e2e8f0', fontWeight: '600' }}>{r.drug}</td>
                        <td style={{ padding: '8px', color: '#94a3b8' }}>{r.dosage}</td>
                        <td style={{ padding: '8px', color: '#94a3b8' }}>{r.days} days</td>
                        <td style={{ padding: '8px', color: '#64748b' }}>{r.date}</td>
                        <td style={{ padding: '8px' }}>
                          <button style={S.btn('#450a0a', '#ef4444')} onClick={() => setRxList(prev => prev.filter((_, j) => j !== i))}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '14px' }}>No medications added yet.</div>
              )}

              {/* ADD MEDICINE */}
              <div style={{ borderTop: '1px solid #334155', paddingTop: '12px' }}>
                <div style={{ color: '#94a3b8', fontWeight: '700', fontSize: '12px', marginBottom: '8px' }}>Add Medication</div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '8px', alignItems: 'end' }}>
                  <div>
                    <div style={S.label}>Drug Name</div>
                    <input style={{ ...S.input, marginTop: '4px' }} placeholder="e.g. Amoxicillin 500mg" value={newRx.drug}
                      onChange={e => setNewRx(r => ({ ...r, drug: e.target.value }))} />
                  </div>
                  <div>
                    <div style={S.label}>Dosage</div>
                    <input style={{ ...S.input, marginTop: '4px' }} placeholder="e.g. 1-0-1" value={newRx.dosage}
                      onChange={e => setNewRx(r => ({ ...r, dosage: e.target.value }))} />
                  </div>
                  <div>
                    <div style={S.label}>Days</div>
                    <input style={{ ...S.input, marginTop: '4px' }} placeholder="e.g. 5" value={newRx.days}
                      onChange={e => setNewRx(r => ({ ...r, days: e.target.value }))} />
                  </div>
                  <button style={{ ...S.btn('#38bdf8', '#0f172a'), height: '34px' }}
                    onClick={() => {
                      if (!newRx.drug || !newRx.dosage || !newRx.days) return;
                      setRxList(prev => [...prev, { ...newRx, date: '15 Jun 2026' }]);
                      setNewRx({ drug: '', dosage: '', days: '', notes: '' });
                    }}>
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────── */}
        {/* SECTION: FOLLOW-UPS                    */}
        {/* ─────────────────────────────────────── */}
        {activeSection === 'followup' && (
          <div style={S.content}>
            <div style={S.grid2}>
              {/* EXISTING FOLLOW-UPS */}
              <div style={S.card}>
                <div style={S.cardHead}><span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '13px' }}>Scheduled Follow-ups</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {followUps.map((f, i) => (
                    <div key={i} style={{ padding: '12px 14px', background: '#0f172a', borderRadius: '10px', borderLeft: `3px solid ${f.priority === 'high' ? '#ef4444' : f.priority === 'medium' ? '#fbbf24' : '#34d399'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '13px' }}>{f.name}</div>
                          <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>{f.reason}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#94a3b8', fontSize: '11px' }}>{f.due}</div>
                          <span style={S.badge(f.priority === 'high' ? '#ef4444' : f.priority === 'medium' ? '#fbbf24' : '#34d399')}>{f.priority} priority</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                        <button style={{ ...S.btn('#334155'), flex: 1, fontSize: '10px' }}>📞 Call Reminder</button>
                        <button style={{ ...S.btn('#334155'), flex: 1, fontSize: '10px' }}>📱 SMS Alert</button>
                        <button style={{ ...S.btn('#34d399', '#0f172a'), flex: 1, fontSize: '10px' }}>✓ Done</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SCHEDULE NEW */}
              <div style={S.card}>
                <div style={S.cardHead}><span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '13px' }}>Schedule Review Appointment</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <div style={S.label}>Patient</div>
                    <select style={{ ...S.input, marginTop: '4px' }}
                      value={selectedPatient.id} onChange={e => { const p = patients.find(pt => pt.id === e.target.value); if (p) selectPatient(p); }}>
                      {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={S.label}>Follow-up Date</div>
                    <input type="date" style={{ ...S.input, marginTop: '4px' }} value={newFollowUp.date}
                      onChange={e => setNewFollowUp(f => ({ ...f, date: e.target.value }))} />
                  </div>
                  <div>
                    <div style={S.label}>Reason / Treatment Reminder</div>
                    <input style={{ ...S.input, marginTop: '4px' }} placeholder="e.g. Root canal review" value={newFollowUp.reason}
                      onChange={e => setNewFollowUp(f => ({ ...f, reason: e.target.value }))} />
                  </div>
                  <div>
                    <div style={S.label}>Doctor Notes</div>
                    <textarea style={{ ...S.textarea, marginTop: '4px', height: '80px' }} placeholder="Any special instructions..."
                      value={newFollowUp.notes} onChange={e => setNewFollowUp(f => ({ ...f, notes: e.target.value }))} />
                  </div>
                  <button style={{ ...S.btn('#38bdf8', '#0f172a'), padding: '12px' }}
                    onClick={() => { setFollowUpSaved(true); setTimeout(() => setFollowUpSaved(false), 3000); setNewFollowUp({ date: '', reason: '', notes: '' }); }}>
                    📅 Schedule Follow-up
                  </button>
                  {followUpSaved && (
                    <div style={{ padding: '10px', background: '#052e16', border: '1px solid #34d399', borderRadius: '8px', color: '#34d399', fontSize: '12px', textAlign: 'center', fontWeight: '700' }}>
                      ✓ Follow-up scheduled successfully!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DoctorClinicalPortal;
