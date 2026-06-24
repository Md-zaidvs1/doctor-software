const API_URL = 'http://localhost:5000/api/appointments';

export const appointmentService = {
  getAppointments: async (clinicId, filters = {}) => {
    if (!clinicId) return { success: false, message: 'Clinic tenancy boundaries required for schedule pulls.' };
    
    let queryParams = new URLSearchParams({ clinicId });
    if (filters.doctorId) queryParams.append('doctorId', filters.doctorId);
    if (filters.date) queryParams.append('date', filters.date);

    const response = await fetch(`${API_URL}?${queryParams.toString()}`);
    return response.json();
  },

  getAppointmentById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json();
  },

  createAppointment: async (appointmentData) => {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    return response.json();
  },

  updateAppointment: async (id, appointmentData) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    return response.json();
  },

  deleteAppointment: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};