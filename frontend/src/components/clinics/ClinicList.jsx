import React from 'react';

const ClinicList = ({ clinics, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded shadow-md overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Clinic Profile</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Specialty</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Owner</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Contact Details</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Status</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700 text-right">Management Actions</th>
          </tr>
        </thead>
        <tbody>
          {clinics.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No healthcare facilities are currently registered.
              </td>
            </tr>
          ) : (
            clinics.map((clinic) => (
              <tr key={clinic._id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center space-x-3">
                    {clinic.logo ? (
                      <img src={clinic.logo} alt="Logo" className="w-10 h-10 object-contain rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 text-blue-700 font-bold flex items-center justify-center rounded">
                        {clinic.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{clinic.name}</div>
                      <div className="text-xs text-gray-500">/{clinic.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded font-medium">
                    {clinic.category?.name || 'Unassigned'}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-700">{clinic.ownerName}</td>
                <td className="p-3 text-sm text-gray-600">
                  <div>{clinic.email}</div>
                  <div>{clinic.phone}</div>
                </td>
                <td className="p-3">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded font-medium ${
                      clinic.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {clinic.isActive ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => onEdit(clinic)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => onDelete(clinic._id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClinicList;