const API_URL = 'http://localhost:5000/api/subscription-plans';

export const subscriptionPlanService = {
  getPlans: async () => {
    const response = await fetch(`${API_URL}`);
    return response.json();
  },

  getPlanById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json();
  },

  createPlan: async (planData) => {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planData),
    });
    return response.json();
  },

  updatePlan: async (id, planData) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planData),
    });
    return response.json();
  },

  deletePlan: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};