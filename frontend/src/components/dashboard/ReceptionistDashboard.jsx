// ReceptionistDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getAppointmentsByClinic } from "../../services/appointmentService";
import { getPatientsCount } from "../../services/patientService";

export default function ReceptionistDashboard() {
  const { clinicId } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [patientsCount, setPatientsCount] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      const appts = await getAppointmentsByClinic(clinicId);
      setAppointments(appts);
      const count = await getPatientsCount(clinicId);
      setPatientsCount(count);
    }
    fetchData();
  }, [clinicId]);

  const filteredAppointments = appointments.filter((appt) =>
    appt.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Receptionist Dashboard</h2>
      <button className="bg-green-500 text-white px-4 py-2 mb-4">
        Book New Appointment
      </button>
      <p className="mb-4">Total Patients Today: {patientsCount}</p>
      <input
        type="text"
        placeholder="Search patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <ul>
        {filteredAppointments.map((appt) => (
          <li key={appt.id} className="border-b py-2">
            {appt.time} — {appt.patientName} with {appt.doctorName}
          </li>
        ))}
      </ul>
    </div>
  );
}
