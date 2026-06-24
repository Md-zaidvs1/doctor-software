const API_URL = 'http://localhost:5000/api/treatment-records';

export const treatmentRecordService = {
  getTreatmentRecords: async (clinicId, patientId = '') => {
    if (!clinicId) return { success: false, message: 'Tenant operational boundaries mapping parameters required.' };
    
    let queryParams = new URLSearchParams({ clinicId });
    if (patientId) queryParams.append('patientId', patientId);

    const response = await fetch(`${API_URL}?${queryParams.toString()}`);
    return response.json();
  },

  getTreatmentRecordById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json();
  },

  createTreatmentRecord: async (recordPayload) => {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recordPayload),
    });
    return response.json();
  },

  updateTreatmentRecord: async (id, recordPayload) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recordPayload),
    });
    return response.json();
  },

  deleteTreatmentRecord: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};