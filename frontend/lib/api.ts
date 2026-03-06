const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    let errorMessage = data.message || 'Something went wrong';
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      errorMessage = data.errors[0].message;
    }
    throw new Error(errorMessage);
  }

  return data;
}

export const authApi = {
  login: (credentials: any) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData: any) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  getClients: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/clients${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },
  getDashboardStats: () => apiRequest('/analytics/dashboard', {
    method: 'GET',
  }),
  getWorkouts: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/workouts${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },
  getPayments: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/payments${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },
  getUsers: () => apiRequest('/auth/users', {
    method: 'GET',
  }),
  getProfile: () => apiRequest('/auth/me', {
    method: 'GET',
  }),
  // Services (freelancer + public hiring side)
  getPublicServices: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/services${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },
  getMyServices: () => apiRequest('/services/mine', {
    method: 'GET',
  }),
  createService: (payload: any) => apiRequest('/services', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateService: (id: string, payload: any) => apiRequest(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  deleteService: (id: string) => apiRequest(`/services/${id}`, {
    method: 'DELETE',
  }),
  // Project Requests
  getClientRequests: () => apiRequest('/requests/client', {
    method: 'GET',
  }),
  getFreelancerRequests: () => apiRequest('/requests/freelancer', {
    method: 'GET',
  }),
  createProjectRequest: (payload: any) => apiRequest('/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateProjectRequest: (id: string, payload: any) => apiRequest(`/requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  deleteProjectRequest: (id: string) => apiRequest(`/requests/${id}`, {
    method: 'DELETE',
  }),
  // Service Orders (booked services)
  createServiceOrder: (payload: any) => apiRequest('/service-orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getClientServiceOrders: () => apiRequest('/service-orders/client', {
    method: 'GET',
  }),
  getFreelancerServiceOrders: () => apiRequest('/service-orders/freelancer', {
    method: 'GET',
  }),
  updateServiceOrderStatus: (id: string, payload: any) => apiRequest(`/service-orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }),
  getServiceEarningsSummary: () => apiRequest('/service-orders/earnings', {
    method: 'GET',
  }),
  // Activity Logs
  getActivityLogs: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/analytics/logs${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },
  getSystemStats: () => apiRequest('/analytics/system', {
    method: 'GET',
  }),
  getRevenueTrends: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/analytics/revenue/trends${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },
};



