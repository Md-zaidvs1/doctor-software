const API_URL = 'http://localhost:5000/api/staff';

export const staffService = {
  getStaff: async (clinicId = '') => {
    const url = clinicId ? `${API_URL}?clinicId=${clinicId}` : API_URL;
    const response = await fetch(url);
    return response.json();
  },

  getStaffById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json();
  },

  createStaff: async (staffData) => {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(staffData),
    });
    return response.json();
  },

  updateStaff: async (id, staffData) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(staffData),
    });
    return response.json();
  },

  deleteStaff: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};