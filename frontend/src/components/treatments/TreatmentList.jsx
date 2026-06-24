import React from 'react';

const TreatmentList = ({ records, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {records.length === 0 ? (
        <div className="bg-white p-6 text-center text-gray-500 rounded border shadow-sm">
          No medical encounter charting histories mapped under current structural parameters.
        </div>
      ) : (
        records.map((rec) => (
          <div key={rec._id} className="bg-white p-5 rounded-lg shadow-md border-l-4 border-purple-500 space-y-4">
            <div className="flex justify-between items-start border-b pb-2 flex-wrap gap-2">
              <div>
                <h4 className="text-md font-bold text-gray-900">{rec.patientId?.name || 'Purged Identity File'}</h4>
                <div className="text-xs font-mono text-blue-700">{rec.patientId?.patientId}</div>
              </div>
              <div className="text-right text-xs text-gray-500 font-medium">
                <div>Attending practitioner: <strong>Dr. {rec.doctorId?.name}</strong></div>
                <div className="font-mono mt-0.5">Encounter Timestamp: {new Date(rec.createdAt).toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-xs font-bold text-gray-400 block uppercase mb-1">Clinical Signs & Records Notes</span>
                <p className="text-gray-700 font-medium whitespace-pre-wrap">{rec.clinicalNotes}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-xs font-bold text-gray-400 block uppercase mb-1">Conclusive Assessment Diagnosis</span>
                <p className="text-purple-900 font-bold whitespace-pre-wrap">{rec.diagnosis}</p>
              </div>
            </div>

            {rec.procedures && rec.procedures.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Executed Care Procedures Ledger:</span>
                <div className="flex flex-wrap gap-2">
                  {rec.procedures.map((p, idx) => (
                    <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs px-2.5 py-1 rounded font-semibold">
                      ⚙️ {p.name} (Value Cost: ₹{p.cost})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {rec.prescriptions && rec.prescriptions.length > 0 && (
              <div className="space-y-1.5 border-t pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Attached Rx Formulary Directive:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {rec.prescriptions.map((m, idx) => (
                    <div key={idx} className="text-xs border rounded p-2 bg-blue-50/50 text-gray-700 font-medium">
                      💊 <strong>{m.medicineName}</strong> - {m.dosage} | Loop Interval: {m.frequency} | Timeline: {m.duration}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 border-t pt-3 text-xs font-bold">
              <button onClick={() => onEdit(rec)} className="text-purple-600 hover:underline">Modify Chart Specs</button>
              <button onClick={() => onDelete(rec._id)} className="text-red-600 hover:underline">Drop Chart Record</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TreatmentList;