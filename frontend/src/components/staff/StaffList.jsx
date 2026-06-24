import React from 'react';

const StaffList = ({ staff, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded shadow-md overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Identity Structure</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Clinic Tenant Assignment</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Access Scope Role</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Specialty Scope</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Contact Interface</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Status</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-4 text-center text-gray-500">
                No active operational profiles are currently registered to system nodes.
              </td>
            </tr>
          ) : (
            staff.map((member) => (
              <tr key={member._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-semibold text-gray-900">{member.name}</td>
                <td className="p-3 text-sm text-gray-600">{member.clinicId?.name || 'Isolated Environment'}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                    member.role === 'Admin' ? 'bg-red-100 text-red-800' :
                    member.role === 'Doctor' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-700">{member.specialization || 'N/A (Operational)'}</td>
                <td className="p-3 text-xs text-gray-600">
                  <div>{member.email}</div>
                  <div>{member.phone}</div>
                </td>
                <td className="p-3">
                  <span className={`text-xs px-2.5 py-0.5 rounded font-semibold ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {member.isActive ? 'Active' : 'Locked'}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => onEdit(member)}
                    className="text-purple-600 hover:text-purple-900 text-sm font-semibold"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => onDelete(member._id)}
                    className="text-red-600 hover:text-red-900 text-sm font-semibold"
                  >
                    Suspend
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

export default StaffList;