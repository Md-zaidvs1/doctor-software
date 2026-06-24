import React from 'react';

const AppointmentList = ({ appointments, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded shadow-md overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Date/Time Node</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Patient Registry Reference</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Assigned Clinician</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Reason For Session</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700">Status State</th>
            <th className="p-3 text-sm font-bold uppercase text-gray-700 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No session allocations recorded within current scheduling boundaries.
              </td>
            </tr>
          ) : (
            appointments.map((appt) => (
              <tr key={appt._id} className="border-b hover:bg-gray-50 text-sm">
                <td className="p-3 font-medium text-gray-900">
                  <div className="font-bold">{appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : ''}</div>
                  <div className="text-xs text-blue-600 font-mono">🕒 {appt.startTime}</div>
                </td>
                <td className="p-3">
                  <div className="font-semibold">{appt.patientId?.name || 'Purged Profile'}</div>
                  <div className="text-xs font-mono text-gray-500">{appt.patientId?.patientId} | {appt.patientId?.phone}</div>
                </td>
                <td className="p-3 text-gray-700">
                  <div className="font-medium">Dr. {appt.doctorId?.name || 'Unassigned'}</div>
                  <div className="text-xs text-purple-600">{appt.doctorId?.specialization}</div>
                </td>
                <td className="p-3 text-gray-600 max-w-xs truncate">
                  <div>{appt.reasonForVisit}</div>
                  {appt.notes && <div className="text-xs text-gray-400 italic">Note: {appt.notes}</div>}
                </td>
                <td className="p-3">
                  <span className={`text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
                    appt.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    appt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    appt.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {appt.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => onEdit(appt)}
                    className="text-blue-600 hover:text-blue-900 font-semibold"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => onDelete(appt._id)}
                    className="text-red-600 hover:text-red-900 font-semibold"
                  >
                    Drop
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

export default AppointmentList;