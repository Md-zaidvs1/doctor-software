import React, { useState, useEffect } from 'react';

const TreatmentForm = ({ currentRecord, clinicId, patients, doctors, linkedAppointment, onFormSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    clinicalNotes: '',
    diagnosis: '',
  });

  const [procedures, setProcedures] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  // Temp form slot collectors
  const [procName, setProcName] = useState('');
  const [procCost, setProcCost] = useState('');
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFreq, setMedFreq] = useState('');
  const [medDuration, setMedDuration] = useState('');

  useEffect(() => {
    if (linkedAppointment) {
      setFormData({
        patientId: linkedAppointment.patientId?._id || '',
        doctorId: linkedAppointment.doctorId?._id || '',
        clinicalNotes: '',
        diagnosis: '',
      });
    } else if (currentRecord) {
      setFormData({
        patientId: currentRecord.patientId?._id || '',
        doctorId: currentRecord.doctorId?._id || '',
        clinicalNotes: currentRecord.clinicalNotes || '',
        diagnosis: currentRecord.diagnosis || '',
      });
      setProcedures(currentRecord.procedures || []);
      setPrescriptions(currentRecord.prescriptions || []);
    } else {
      setFormData({ patientId: '', doctorId: '', clinicalNotes: '', diagnosis: '' });
      setProcedures([]);
      setPrescriptions([]);
    }
  }, [currentRecord, linkedAppointment]);

  const addProcedure = () => {
    if (!procName || !procCost) return;
    setProcedures([...procedures, { name: procName, cost: Number(procCost) }]);
    setProcName('');
    setProcCost('');
  };

  const addPrescription = () => {
    if (!medName || !medDosage || !medFreq || !medDuration) return;
    setPrescriptions([...prescriptions, { medicineName: medName, dosage: medDosage, frequency: medFreq, duration: medDuration }]);
    setMedName('');
    setMedDosage('');
    setMedFreq('');
    setMedDuration('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit({
      clinicId,
      appointmentId: linkedAppointment?._id || currentRecord?.appointmentId || null,
      ...formData,
      procedures,
      prescriptions
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-6 border-t-4 border-blue-600">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
        {currentRecord ? 'Modify Existing Medical Summary File' : 'Chart Active Patient Treatment Entry'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Target Patient Identity Profile *</label>
          <select
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            required
            disabled={!!linkedAppointment || !!currentRecord}
            className="w-full border p-2 rounded bg-gray-50 disabled:opacity-75"
          >
            <option value="">-- Select Target Demographics File --</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>{p.name} ({p.patientId})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Attending Clinical Doctor *</label>
          <select
            value={formData.doctorId}
            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
            required
            disabled={!!linkedAppointment}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Choose Operator Node --</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>Dr. {d.name} ({d.specialization})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Symptomatic Evaluation Notes & Complaints *</label>
          <textarea
            rows="3"
            value={formData.clinicalNotes}
            onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
            required
            placeholder="Document vital baseline details, localized pains, clinical observation notes..."
            className="w-full border p-2 rounded text-sm"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Diagnostic Assessment Statement *</label>
          <textarea
            rows="3"
            value={formData.diagnosis}
            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
            required
            placeholder="Conclusive assessment conclusion finding description codes..."
            className="w-full border p-2 rounded text-sm"
          ></textarea>
        </div>
      </div>

      {/* Procedures Ledger Section */}
      <div className="border p-4 rounded-md bg-gray-50 space-y-3">
        <span className="text-sm font-bold tracking-wider uppercase text-gray-500">Performed Systems Procedures</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
          <div>
            <label className="text-xs font-semibold">Procedure Description Nomenclature</label>
            <input type="text" value={procName} onChange={(e) => setProcName(e.target.value)} placeholder="e.g., Composite Filling" className="w-full border p-1 text-sm rounded bg-white" />
          </div>
          <div>
            <label className="text-xs font-semibold">Standard Cost Unit (INR)</label>
            <input type="number" value={procCost} onChange={(e) => setProcCost(e.target.value)} placeholder="5000" className="w-full border p-1 text-sm rounded bg-white" />
          </div>
          <button type="button" onClick={addProcedure} className="bg-gray-800 text-white py-1.5 px-3 rounded text-sm font-semibold hover:bg-black">Log Action</button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {procedures.map((p, i) => (
            <span key={i} className="bg-blue-100 text-blue-900 border border-blue-200 text-xs px-3 py-1 rounded font-medium">
              ⚙️ {p.name} - <strong>₹{p.cost}</strong>
            </span>
          ))}
        </div>
      </div>

      {/* Prescription Matrix Section */}
      <div className="border p-4 rounded-md bg-gray-50 space-y-3">
        <span className="text-sm font-bold tracking-wider uppercase text-gray-500">Rx Formulation Script Matrix</span>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
          <div className="col-span-2 md:col-span-1">
            <label className="text-xs font-semibold">Medicine Formulation</label>
            <input type="text" value={medName} onChange={(e) => setMedName(e.target.value)} placeholder="Paracetamol" className="w-full border p-1 text-sm rounded bg-white" />
          </div>
          <div>
            <label className="text-xs font-semibold">Volume Dosage</label>
            <input type="text" value={medDosage} onChange={(e) => setMedDosage(e.target.value)} placeholder="650 mg" className="w-full border p-1 text-sm rounded bg-white" />
          </div>
          <div>
            <label className="text-xs font-semibold">Interval Rate</label>
            <input type="text" value={medFreq} onChange={(e) => setMedFreq(e.target.value)} placeholder="1-0-1 (BID)" className="w-full border p-1 text-sm rounded bg-white" />
          </div>
          <div>
            <label className="text-xs font-semibold">Duration Loop</label>
            <input type="text" value={medDuration} onChange={(e) => setMedDuration(e.target.value)} placeholder="5 Days" className="w-full border p-1 text-sm rounded bg-white" />
          </div>
          <button type="button" onClick={addPrescription} className="bg-gray-800 text-white py-1.5 px-3 rounded text-sm font-semibold col-span-2 md:col-span-1 hover:bg-black">Append Rx</button>
        </div>
        <div className="flex flex-col gap-1 pt-1.5">
          {prescriptions.map((m, i) => (
            <div key={i} className="text-xs bg-white p-2 border rounded shadow-xs font-medium text-gray-700">
              💊 <strong className="text-gray-900">{m.medicineName}</strong> - {m.dosage} | Frequency: {m.frequency} | Timeline: {m.duration}
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-2 justify-end pt-2">
        {(currentRecord || linkedAppointment) && (
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-gray-600">Cancel</button>
        )}
        <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-bold hover:bg-blue-700 shadow-md">
          {currentRecord ? 'Persist Corrections' : 'Finalize & Lock Clinical Chart'}
        </button>
      </div>
    </form>
  );
};

export default TreatmentForm;