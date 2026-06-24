const API_URL = 'http://localhost:5000/api/reports';

export const reportService = {
  getClinicAnalytics: async (clinicId) => {
    if (!clinicId) return { success: false, message: 'Tenant verification parameter required to generate system metrics charts.' };
    const response = await fetch(`${API_URL}/analytics?clinicId=${clinicId}`);
    return response.json();
  },
};