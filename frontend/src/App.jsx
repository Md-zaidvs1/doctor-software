import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import BillingManagement from "./pages/BillingManagement";
import Reports from "./pages/Reports";
import OnboardingSetup from "./pages/OnboardingSetup";
import PatientHistoryView from "./pages/PatientHistoryView";
import Plant2TreePrivateAdmin from "./pages/Plant2TreePrivateAdmin";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { userRole } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/billing" element={<BillingManagement />} />
        <Route path="/reports" element={<Reports />} />

        {/* New Routes */}
        <Route path="/onboarding" element={<OnboardingSetup />} />
        <Route path="/patient-history" element={<PatientHistoryView />} />
        <Route
          path="/admin/plant2tree"
          element={
            (userRole === "SUPER_ADMIN" || userRole === "DEVELOPER")
              ? <Plant2TreePrivateAdmin />
              : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}
