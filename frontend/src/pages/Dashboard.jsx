import Sidebar from "../components/dashboard/Sidebar";
import "../components/dashboard/dashboard.css";
import Header from "../components/dashboard/Header";
import AdminDashboard from "../components/dashboard/AdminDashboard";

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <Header />
        <AdminDashboard />
      </div>
    </div>
  );
}