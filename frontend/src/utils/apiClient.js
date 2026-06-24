import { authService } from '../services/authService';

const BASE_URL = 'http://localhost:5000/api';

export const apiClient = {
  request: async (endpoint, options = {}) => {
    const headers = authService.getAuthHeaders();
    const currentUser = authService.getCurrentUser();

    // 1. Extract context variables safely
    const rawRole = currentUser?.role || currentUser?.userRole || 'ADMIN';
    const userRole = rawRole.toUpperCase(); 
    
    const extractedTenantId = 
      currentUser?.clinicId || 
      currentUser?.clinic || 
      (currentUser?.clinic && typeof currentUser.clinic === 'object' ? currentUser.clinic._id : null) ||
      currentUser?.tenantId ||
      '6a391e7b5d9d49d512d572d6'; // Active Apex Hub backup fallback

    // 2. AUTOMATIC QUERY PARAMETER INJECTION FOR GET/FETCH SELECTION
    // If the endpoint path doesn't already have a tenant filter, we append it to the URL string
    let finalEndpoint = endpoint;
    if (!finalEndpoint.includes('clinicId=') && !finalEndpoint.includes('tenantId=')) {
      const separator = finalEndpoint.includes('?') ? '&' : '?';
      finalEndpoint = `${finalEndpoint}${separator}clinicId=${extractedTenantId}&tenantId=${extractedTenantId}`;
    }

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        'x-user-role': userRole,
        'x-clinic-tenant-id': extractedTenantId,
        'X-User-Role': userRole,
        'X-Clinic-Tenant-Id': extractedTenantId,
        ...options.headers, 
      },
    };

    const response = await fetch(`${BASE_URL}${finalEndpoint}`, config);
    
    if (response.status === 401) {
      authService.logout();
      window.location.hash = '/login';
      throw new Error('Session expired.');
    }
    
    return response.json();
  },

  get: function(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  },

  post: function(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  },

  put: function(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  },

  delete: function(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
};