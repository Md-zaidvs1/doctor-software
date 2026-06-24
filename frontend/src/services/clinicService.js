const API_URL = 'http://localhost:5000/api/clinics';

export const clinicService = {
  createClinic: async (clinicData) => {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clinicData),
    });
    return response.json();
  },

  getClinics: async () => {
    const response = await fetch(`${API_URL}`);
    return response.json();
  },

  getClinicById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json();
  },

  updateClinic: async (id, clinicData) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clinicData),
    });
    return response.json();
  },

  deleteClinic: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};