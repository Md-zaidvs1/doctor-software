import { apiClient } from '../utils/apiClient';

export const patientService = {
  getPatients: async (clinicId, searchTerm = '') => {
    // Note: clinicId is automatically supplemented via backend security middleware, 
    // but kept as placeholder parameters signature to sustain codebase compatibility interface lines.
    return apiClient.get(`/patients?search=${encodeURIComponent(searchTerm)}`);
  },

  getPatientById: async (id) => {
    return apiClient.get(`/patients/${id}`);
  },

  createPatient: async (patientData) => {
    return apiClient.post('/patients', patientData);
  },

  updatePatient: async (id, patientData) => {
    return apiClient.put(`/patients/${id}`, patientData);
  },

  deletePatient: async (id) => {
    return apiClient.delete(`/patients/${id}`);
  },
};