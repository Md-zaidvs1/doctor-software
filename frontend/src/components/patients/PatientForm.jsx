import React, { useState, useEffect } from 'react';

const PatientForm = ({ currentPatient, clinicId, onFormSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    dob: '',
    email: '',
    phone: '',
    bloodGroup: 'Unknown',
    address: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    allergies: '',
  });

  useEffect(() => {
    if (currentPatient) {
      setFormData({
        name: currentPatient.name || '',
        gender: currentPatient.gender || 'Male',
        dob: currentPatient.dob ? currentPatient.dob.split('T')[0] : '',
        email: currentPatient.email || '',
        phone: currentPatient.phone || '',
        bloodGroup: currentPatient.bloodGroup || 'Unknown',
        address: currentPatient.address || '',
        emergencyName: currentPatient.emergencyContact?.name || '',
        emergencyPhone: currentPatient.emergencyContact?.phone || '',
        emergencyRelation: currentPatient.emergencyContact?.relationship || '',
        allergies: currentPatient.allergies ? currentPatient.allergies.join(', ') : '',
      });
    } else {
      setFormData({
        name: '',
        gender: 'Male',
        dob: '',
        email: '',
        phone: '',
        bloodGroup: 'Unknown',
        address: '',
        emergencyName: '',
        emergencyPhone: '',
        emergencyRelation: '',
        allergies: '',
      });
    }
  }, [currentPatient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPayload = {
      clinicId,
      name: formData.name,
      gender: formData.gender,
      dob: formData.dob,
      email: formData.email,
      phone: formData.phone,
      bloodGroup: formData.bloodGroup,
      address: formData.address,
      emergencyContact: {
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
        relationship: formData.emergencyRelation,
      },
      allergies: formData.allergies.split(',').map((a) => a.trim()).filter((a) => a !== ''),
    };
    onFormSubmit(cleanPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
      <h3 className="text-xl font-bold border-b pb-2 text-gray-700">
        {currentPatient ? `Update Demographics: ${formData.name}` : 'Intake New Electronic Patient Record'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Patient Full Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Gender Assigned *</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Date of Birth *</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Primary Phone Contact *</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Email Interface</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Blood Core Classification *</label>
          <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="Unknown">Unknown</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-3"><span className="text-xs font-bold uppercase tracking-wider text-gray-400">Next of Kin / Emergency Contact Metrics</span></div>
        <div>
          <label className="block text-sm font-semibold mb-1">Contact Name</label>
          <input type="text" name="emergencyName" value={formData.emergencyName} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Contact Phone</label>
          <input type="text" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Relationship Structure</label>
          <input type="text" name="emergencyRelation" value={formData.emergencyRelation} onChange={handleChange} placeholder="e.g., Spouse, Parent" className="w-full border p-2 rounded" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Critical Clinical Allergies (Comma Listed)</label>
        <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="Sulfa drugs, Latex, Aspirin" className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Residential Address Block</label>
        <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full border p-2 rounded"></textarea>
      </div>

      <div className="flex space-x-2 justify-end">
        {currentPatient && (
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm font-semibold">Cancel</button>
        )}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold">
          {currentPatient ? 'Persist Records Architecture' : 'Initialize Patient Admission Record'}
        </button>
      </div>
    </form>
  );
};

export default PatientForm;