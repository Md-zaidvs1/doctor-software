import React, { useState, useEffect } from 'react';

const AppointmentForm = ({ currentAppointment, clinicId, patients, doctors, onFormSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    startTime: '',
    reasonForVisit: '',
    status: 'Scheduled',
    notes: '',
  });

  useEffect(() => {
    if (currentAppointment) {
      setFormData({
        patientId: currentAppointment.patientId?._id || currentAppointment.patientId || '',
        doctorId: currentAppointment.doctorId?._id || currentAppointment.doctorId || '',
        appointmentDate: currentAppointment.appointmentDate ? currentAppointment.appointmentDate.split('T')[0] : '',
        startTime: currentAppointment.startTime || '',
        reasonForVisit: currentAppointment.reasonForVisit || '',
        status: currentAppointment.status || 'Scheduled',
        notes: currentAppointment.notes || '',
      });
    } else {
      setFormData({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        startTime: '',
        reasonForVisit: '',
        status: 'Scheduled',
        notes: '',
      });
    }
  }, [currentAppointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit({ clinicId, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
      <h3 className="text-xl font-bold border-b pb-2 text-gray-700">
        {currentAppointment ? 'Modify Operational Booking Entry' : 'Log New Consultation Slot Reservation'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Select Patient File Target *</label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
            disabled={!!currentAppointment}
            className="w-full border p-2 rounded bg-gray-50 disabled:opacity-75"
          >
            <option value="">-- Choose Registered Patient --</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>{p.name} ({p.patientId})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Assign Clinician / Practitioner *</label>
          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Choose Medical Staff Node --</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>Dr. {d.name} ({d.specialization || 'General'})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Date Allocation *</label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Start Time Block (24hr format) *</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Primary Clinical Compliant / Reason For Visit *</label>
        <input
          type="text"
          name="reasonForVisit"
          value={formData.reasonForVisit}
          onChange={handleChange}
          required
          placeholder="e.g., Routine dental cleanup, localized bone swelling tracking"
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentAppointment && (
          <div>
            <label className="block text-sm font-semibold mb-1">Reservation Workflow State *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2 rounded bg-yellow-50 font-medium"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No-Show">No-Show</option>
            </select>
          </div>
        )}
        <div className={currentAppointment ? "" : "col-span-2"}>
          <label className="block text-sm font-semibold mb-1">Front-Desk Desk Notes / Coordination Logs</label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Ails for high priority tracking notes"
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div className="flex space-x-2 justify-end pt-2">
        {currentAppointment && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-gray-600"
          >
            Abort Allocation
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700"
        >
          {currentAppointment ? 'Authorize Reschedule Vector' : 'Commit Slot Reservation'}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;