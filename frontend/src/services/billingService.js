const API_URL = 'http://localhost:5000/api/billing';

export const billingService = {
  getInvoices: async (clinicId, paymentStatus = '') => {
    if (!clinicId) return { success: false, message: 'Multi-tenant verification requires passing active clinic scope fields.' };
    const endpoint = paymentStatus ? `${API_URL}?clinicId=${clinicId}&paymentStatus=${paymentStatus}` : `${API_URL}?clinicId=${clinicId}`;
    const response = await fetch(endpoint);
    return response.json();
  },

  getInvoiceById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json();
  },

  createInvoice: async (invoicePayload) => {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoicePayload),
    });
    return response.json();
  },

  collectPaymentInstallment: async (id, payload) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  deleteInvoice: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};