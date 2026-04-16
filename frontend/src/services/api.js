export const apiGet = async (path) => {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const message = `API request failed: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
};

export const apiPost = async (path, body) => {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = `API request failed: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
};

export const apiPatch = async (path, body) => {
  const response = await fetch(path, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = `API request failed: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
};

const api = {
  getAdminDashboard: () => apiGet('/api/admin/dashboard'),
  getSites: () => apiGet('/api/sites'),
  createSite: (siteData) => apiPost('/api/sites', siteData),
  getUsers: () => apiGet('/api/users'),
  createUser: (userData) => apiPost('/api/users', userData),
  getTasks: ({ siteId, assigneeName } = {}) => {
    const params = new URLSearchParams();
    if (siteId) params.set('siteId', siteId);
    if (assigneeName) params.set('assigneeName', assigneeName);
    const query = params.toString();
    return apiGet(`/api/tasks${query ? `?${query}` : ''}`);
  },
  updateTaskStatus: (taskId, payload) => apiPatch(`/api/tasks/${taskId}/status`, payload),
  getInventory: () => apiGet('/api/inventory'),
  getInventoryTransactions: (itemId) => apiGet(`/api/inventory/transactions${itemId ? `?itemId=${itemId}` : ''}`),
  createInventoryTransaction: (payload) => apiPost('/api/inventory/transactions', payload),
  getPmDashboard: () => apiGet('/api/dashboards/pm'),
  getEngineerDashboard: (assigneeName = 'Arjun') => apiGet(`/api/dashboards/engineer?assigneeName=${encodeURIComponent(assigneeName)}`),
  getStoreDashboard: () => apiGet('/api/dashboards/store'),
  getInspections: () => apiGet('/api/inspections'),
  createInspection: (payload) => apiPost('/api/inspections', payload),
};

export default api;
