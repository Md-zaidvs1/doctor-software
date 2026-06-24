import React, { useState } from 'react';
import Login from './pages/Login';
import LicenseActivation from './pages/LicenseActivation';
import DashboardLayout from './components/dashboard/DashboardLayout';

const App = () => {
  const [currentView, setCurrentView] = useState(() => {
    const savedKey = localStorage.getItem('p2t_license_key');
    return savedKey ? 'login' : 'activation';
  });

  const handleActivationSuccess = () => {
    setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {currentView === 'activation' && (
        <LicenseActivation onActivationSuccess={handleActivationSuccess} />
      )}
      
      {currentView === 'login' && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}

      {currentView === 'dashboard' && (
        <DashboardLayout />
      )}
    </div>
  );
};

export default App;