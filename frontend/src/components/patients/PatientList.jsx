import React from "react";
import { useNavigate } from "react-router-dom";

export default function PatientList({ patients }) {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Patients</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td className="border p-2">{patient.name}</td>
              <td className="border p-2">{patient.age}</td>
              <td className="border p-2">
                <button
                  onClick={() => navigate(`/patient-history?patientId=${patient.id}`)}
                  className="bg-gray-500 text-white px-3 py-1 mr-2"
                >
                  View History
                </button>
                <button className="bg-blue-500 text-white px-3 py-1">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
