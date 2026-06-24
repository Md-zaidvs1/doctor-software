const API_URL = 'http://localhost:5000/api/auth';

export const authService = {
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (data.success && data.token) {
      localStorage.setItem('saas_auth_token', data.token);
      localStorage.setItem('saas_user_profile', JSON.stringify(data.user));
    }
    return data;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('saas_user_profile');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('saas_auth_token') || '';
  },

  logout: () => {
    localStorage.removeItem('saas_auth_token');
    localStorage.removeItem('saas_user_profile');
    window.location.hash = '/login';
  },

  getAuthHeaders: () => {
    const token = localStorage.getItem('saas_auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }
};