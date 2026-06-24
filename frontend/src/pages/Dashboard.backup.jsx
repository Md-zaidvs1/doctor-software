import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorClinicalPortal from '../components/DoctorClinicalPortal';
import PatientRegistryModule from '../components/PatientRegistryModule';
import InvoiceBillingModule from '../components/InvoiceBillingModule';
import AppointmentSchedulerModule from '../components/AppointmentSchedulerModule';

// ==========================================
// 🧑‍💻 RECEPTIONIST OPERATIONS DESK
// ==========================================
const ReceptionistDesk = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const hours = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
  const calendarDays = ["Mon 25", "Tue 26", "Wed 27", "Thu 28", "Fri 29"];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.2fr', gap: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
            <strong style={{ fontSize: '15px', color: '#0f172a' }}>Appointment Schedule (Multi-Provider View)</strong>
            <button style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 'bold', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px' }}>Today</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(5, 1fr)', gap: '1px', background: '#cbd5e1', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: '#f8fafc', padding: '8px', fontSize: '11px', fontWeight: 'bold' }}>Timeline</div>
            {calendarDays.map(d => <div key={d} style={{ background: '#f8fafc', padding: '8px', fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>{d}</div>)}
            {hours.map(h => (
              <React.Fragment key={h}>
                <div style={{ background: '#fff', padding: '10px 5px', fontSize: '11px', color: '#64748b' }}>{h}</div>
                <div style={{ background: h === '10:00 AM' ? '#dbeafe' : '#fff', padding: '10px', fontSize: '11px', color: '#2563eb', fontWeight: 'bold' }}>{h === '10:00 AM' && "Dect Rheni"}</div>
                <div style={{ background: h === '11:00 AM' ? '#eff6ff' : '#fff', padding: '10px', fontSize: '11px', color: '#2563eb' }}>{h === '11:00 AM' && "Doct Singer"}</div>
                <div style={{ background: h === '11:00 AM' ? '#dbeafe' : '#fff', padding: '10px', fontSize: '11px', color: '#2563eb', fontWeight: 'bold' }}>{h === '11:00 AM' && "Doct Rhan"}</div>
                <div style={{ background: h === '12:00 PM' ? '#fee2e2' : '#fff', padding: '10px', fontSize: '11px', color: '#991b1b' }}>{h === '12:00 PM' && "See SteriTime"}</div>
                <div style={{ background: h === '9:00 AM' ? '#dcfce7' : '#fff', padding: '10px', fontSize: '11px', color: '#166534', fontWeight: 'bold' }}>{h === '9:00 AM' && "Bine-Sleepe"}</div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '20px' }}>
          <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block', marginBottom: '15px' }}>Patient Check-In/Registration</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" placeholder="🔍 Search Patient ID, Name, Phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }} />
            <div style={{ borderTop: '1px dashed #cbd5e1', margin: '5px 0' }}></div>
            <input type="text" placeholder="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }} />
            <input type="text" placeholder="Phone Number" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }} />
            <select style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '12px' }}>
              <option>Walk-In No Insurance</option>
              <option>Corporate Insurance Account</option>
            </select>
            <button type="button" onClick={() => alert("🎉 Check-In Allocated and Logged into Queue!")} style={{ padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', marginTop: '5px' }}>
              Update Check-In Queue
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '20px' }}>
          <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block', marginBottom: '15px' }}>👥 Patients in Waiting Lounge Area</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[{ name: "Sume Name", doc: "Doctor Enevactor", time: "7:00 AM" }, { name: "John Smith", doc: "Doctor Radhakrishnan", time: "7:30 AM" }, { name: "Fatima Begum", doc: "Doctor Consult", time: "7:45 AM" }].map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <div><strong>{p.name}</strong> <span style={{ fontSize: '11px', color: '#64748b' }}>({p.doc})</span></div>
                <div style={{ fontSize: '12px', color: '#475569' }}>Arrival: <strong>Today, {p.time}</strong></div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '20px' }}>
          <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block', marginBottom: '15px' }}>💵 Quick Billing Transaction Queue</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f0fdf4', borderRadius: '6px', color: '#166534', fontWeight: 'bold' }}><span>RCT Complete</span><span>Completed</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f0fdf4', borderRadius: '6px', color: '#166534', fontWeight: 'bold' }}><span>Scaling Complete</span><span>Completed</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#eff6ff', borderRadius: '6px', color: '#1e40af' }}><span>Patient Extraction</span><span style={{ fontWeight: 'bold' }}>Paid</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#fff9db', borderRadius: '6px', color: '#d97706', fontWeight: 'bold' }}><span>Ledger Check</span><span>Pending</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🏥 MAIN DASHBOARD
// ==========================================
const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [activePatientId, setActivePatientId] = useState('');
  const [currentBranch, setCurrentBranch] = useState('Branch 1: Kalavai Hub (HQ)');

  useEffect(() => {
    const savedToken = window.localStorage.getItem('saas_session_token');
    const savedUser = window.localStorage.getItem('saas_session_user');
    if (savedToken && savedUser) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
      setActiveTab('overview');
    }
  }, []);

  const handleSecureLogin = (e) => {
    e.preventDefault();
    let matchedRole = null;
    if (inputEmail === 'rkdentalclinic@test.com' && inputPassword === 'rk@123') matchedRole = 'CLINIC_ADMIN';
    else if (inputEmail === 'radhakrishnan@test.com' && inputPassword === 'radha@123') matchedRole = 'DOCTOR';
    else if (inputEmail === 'receiptionist@test.com' && inputPassword === 'rec@123') matchedRole = 'RECEPTIONIST';

    if (matchedRole) {
      const mockUser = { email: inputEmail, role: matchedRole };
      window.localStorage.setItem('saas_session_token', 'secure-gateway-token');
      window.localStorage.setItem('saas_session_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      setIsLoggedIn(true);
      setActiveTab('overview');
      setInputEmail('');
      setInputPassword('');
    } else {
      alert("🔒 Access Denied: Credentials mismatched.");
    }
  };

  const handleSessionLogout = () => {
    window.localStorage.removeItem('saas_session_token');
    window.localStorage.removeItem('saas_session_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ background: '#fff', padding: '45px 40px', borderRadius: '24px', width: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ background: '#10b981', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>🦷</div>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '22px', fontWeight: '900' }}>Plant2Tree</h3>
          </div>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 30px 0', fontWeight: '500', textAlign: 'center' }}>🏥 Plant2Tree Workstation</p>
          <form onSubmit={handleSecureLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="email" placeholder="username@test.com" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} required />
            <input type="password" placeholder="••••••••" value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} required />
            <button type="submit" style={{ padding: '14px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', marginTop: '10px' }}>🔓 Authenticate Security Gate</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', display: 'flex', minHeight: '100vh', background: '#f1f5f9', color: '#1e293b' }}>

      {/* SIDEBAR */}
      <div style={{ width: '250px', background: '#1e293b', color: '#fff', padding: '25px 15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '10px', marginBottom: '35px' }}>
          <div style={{ background: '#10b981', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>🦷</div>
          <h3 style={{ fontSize: '17px', fontWeight: '900', margin: 0, color: '#fff' }}>Plant2Tree</h3>
        </div>
        <button onClick={() => setActiveTab('overview')} style={{ width: '100%', padding: '12px 15px', background: activeTab === 'overview' ? '#10b981' : 'transparent', color: '#fff', border: 'none', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>📊 Dashboard Summary</button>
        <button onClick={() => setActiveTab('registry')} style={{ width: '100%', padding: '12px 15px', background: activeTab === 'registry' ? '#10b981' : 'transparent', color: '#fff', border: 'none', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>👥 Patient Database CRM</button>
        <button onClick={() => setActiveTab('billing')} style={{ width: '100%', padding: '12px 15px', background: activeTab === 'billing' ? '#10b981' : 'transparent', color: '#fff', border: 'none', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>💵 Financial Reports (GST)</button>
        <button onClick={() => setActiveTab('scheduler')} style={{ width: '100%', padding: '12px 15px', background: activeTab === 'scheduler' ? '#10b981' : 'transparent', color: '#fff', border: 'none', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>📅 Staff Directory & Shifts</button>
        <button onClick={handleSessionLogout} style={{ width: '100%', padding: '12px', background: '#3b1818', color: '#f87171', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>🔒 Terminal Logout</button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', background: '#fff', padding: '18px 25px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>Clinical Operations Node Space</span>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800' }}>🏥 Plant2Tree Workstation</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '13px' }}>
            <span>Portal Session: <strong style={{ color: '#10b981' }}>{currentUser?.role === 'DOCTOR' ? '🩺 DOCTOR' : currentUser?.role === 'RECEPTIONIST' ? '🧑‍💻 RECEPTIONIST' : '👑 CLINIC_ADMIN'} Mode</strong></span>
            <select value={currentBranch} onChange={(e) => setCurrentBranch(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 'bold', color: '#10b981' }}>
              <option value="Branch 1: Kalavai Hub (HQ)">Branch 1: Kalavai Hub (HQ)</option>
              <option value="Branch 2: Vembakkam Branch">Branch 2: Vembakkam Branch</option>
            </select>
          </div>
        </div>

        {activeTab === 'overview' && (
          currentUser?.role === 'DOCTOR' ? <DoctorClinicalPortal activePatientId={activePatientId} /> :
          currentUser?.role === 'RECEPTIONIST' ? <ReceptionistDesk /> : (
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.3fr', gap: '25px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: '20px' }}>
                  <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Combined Yield Metrics</span>
                    <div style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', margin: '5px 0' }}>₹1,850,000</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '40px', marginTop: '10px' }}>
                      <div style={{ height: '30%', width: '100%', background: '#10b981', borderRadius: '2px' }}></div>
                      <div style={{ height: '75%', width: '100%', background: '#10b981', borderRadius: '2px' }}></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ background: '#fff', padding: '12px 15px', borderRadius: '12px', border: '1px solid #cbd5e1' }}><span style={{ fontSize: '11px', color: '#64748b' }}>Patients</span><div style={{ fontSize: '16px', fontWeight: '800' }}>1,333</div></div>
                    <div style={{ background: '#fff', padding: '12px 15px', borderRadius: '12px', border: '1px solid #cbd5e1' }}><span style={{ fontSize: '11px', color: '#64748b' }}>Staff Nodes</span><div style={{ fontSize: '16px', fontWeight: '800' }}>30</div></div>
                  </div>
                  <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', textAlign: 'left' }}>Workload Share</span>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '10px solid #10b981', borderTopColor: '#ef4444', margin: '10px auto 0 auto' }}></div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ background: currentBranch.includes('Kalavai') ? '#eafaf1' : '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                    <strong>📍 Primary Hub: Kalavai</strong>
                    <p style={{ fontSize: '12px', color: '#475569', margin: '5px 0' }}>No.10/1 School Street, Kalavai - 632506</p>
                  </div>
                  <div style={{ background: currentBranch.includes('Vembakkam') ? '#eafaf1' : '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                    <strong>📍 Sub-Branch: Vembakkam</strong>
                    <p style={{ fontSize: '12px', color: '#475569', margin: '5px 0' }}>No.626 Main Road, Vembakkam - 604410</p>
                  </div>
                </div>
                <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1e293b' }}>⚙️ Fixed Base Operating Configurations ({currentBranch})</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '12px' }}>
                    <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>⏰ Timings: <strong>9:00 AM - 9:00 PM</strong></div>
                    <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>💵 Check Fee: <strong>₹200.00 Fixed</strong></div>
                  </div>
                </div>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
                <strong style={{ fontSize: '13px', color: '#0f172a' }}>⚡ Node Activity Logs</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', marginTop: '15px' }}>
                  <div>🟢 Branch operations synced.</div>
                  <div>🟢 Security token encryption active.</div>
                </div>
              </div>
            </div>
          )
        )}

        {activeTab === 'registry' && <PatientRegistryModule onSelectPatient={(id) => setActivePatientId(id)} activePatientId={activePatientId} />}
        {activeTab === 'scheduler' && <AppointmentSchedulerModule activePatientId={activePatientId} />}
        {activeTab === 'billing' && <InvoiceBillingModule patientId={activePatientId} />}
      </div>
    </div>
  );
};

export default Dashboard;