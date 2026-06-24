import React from 'react';

const PatientList = ({ patients, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded shadow-md overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Medical Identifier ID</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Full Structural Name</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Vital Coordinates (DOB/Sex)</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Contact Details</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Blood Class</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Allergy Manifests</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700 text-right">Actions Matrix</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-4 text-center text-gray-500">No synchronized patient data profiles matching structural queries.</td>
            </tr>
          ) : (
            patients.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50 text-sm">
                <td className="p-3 font-mono text-xs font-bold text-blue-700">{p.patientId}</td>
                <td className="p-3 font-semibold text-gray-900">{p.name}</td>
                <td className="p-3 text-gray-600">
                  {p.gender} <div>{p.dob ? new Date(p.dob).toLocaleDateString() : 'N/A'}</div>
                </td>
                <td className="p-3 text-xs text-gray-600">
                  <div>📞 {p.phone}</div>
                  {p.email && <div>✉️ {p.email}</div>}
                </td>
                <td className="p-3"><span className="bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold text-xs">{p.bloodGroup}</span></td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {p.allergies && p.allergies.length > 0 ? (
                      p.allergies.map((a, i) => (
                        <span key={i} className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-xs font-medium">{a}</span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs italic">Nil Noted</span>
                    )}
                  </div>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => onEdit(p)} className="text-blue-600 hover:text-blue-900 font-semibold">Modify</button>
                  <button onClick={() => onDelete(p._id)} className="text-red-600 hover:text-red-900 font-semibold">Purge</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;