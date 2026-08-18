// Production-ready API service client connecting React frontend with Node/Express/MongoDB backend

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

const getAuthHeaders = () => {
  const token = localStorage.getItem('shoplytics_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const fetchWithTimeout = async (url, options = {}, timeoutMs = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
};

export const api = {
  // Health & connection status
  async checkHealth() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 4000);
      return await handleResponse(res);
    } catch (err) {
      console.warn('Backend server notice: running with local cached store.');
      return null;
    }
  },

  // Authentication
  async login(email, password) {
    const res = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async register(name, email, password) {
    const res = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetchWithTimeout(`${API_BASE_URL}/auth/me`);
    return handleResponse(res);
  },

  // Monthly & Custom Date Range Records
  async getMonthlyRecords() {
    const res = await fetchWithTimeout(`${API_BASE_URL}/records`);
    return handleResponse(res);
  },

  async saveDateRangeRecord(recordData) {
    const res = await fetchWithTimeout(`${API_BASE_URL}/records/save-period`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordData),
    });
    return handleResponse(res);
  },

  async deleteRecord(monthKey) {
    const res = await fetchWithTimeout(`${API_BASE_URL}/records/${encodeURIComponent(monthKey)}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  async updateRevenue(month, revenue) {
    const res = await fetchWithTimeout(`${API_BASE_URL}/records/${encodeURIComponent(month)}/revenue`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revenue }),
    });
    return handleResponse(res);
  },

  async updateProductCost(month, productCost) {
    const res = await fetchWithTimeout(`${API_BASE_URL}/records/${encodeURIComponent(month)}/product-cost`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productCost }),
    });
    return handleResponse(res);
  },

  async addExpense(month, expense) {
    const res = await fetchWithTimeout(`${API_BASE_URL}/records/${encodeURIComponent(month)}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    });
    return handleResponse(res);
  },

  async updateExpense(month, expense) {
    const res = await fetchWithTimeout(`${API_BASE_URL}/records/${encodeURIComponent(month)}/expenses/${expense.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    });
    return handleResponse(res);
  },

  async deleteExpense(month, expenseId) {
    const res = await fetchWithTimeout(`${API_BASE_URL}/records/${encodeURIComponent(month)}/expenses/${expenseId}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  async updateOrderStatus(month, orderId, status) {
    const res = await fetchWithTimeout(`${API_BASE_URL}/records/${encodeURIComponent(month)}/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  // Products
  async getProducts() {
    const res = await fetchWithTimeout(`${API_BASE_URL}/products`);
    return handleResponse(res);
  },

  async createProduct(product) {
    const res = await fetchWithTimeout(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return handleResponse(res);
  },

  // Customers
  async getCustomers() {
    const res = await fetchWithTimeout(`${API_BASE_URL}/customers`);
    return handleResponse(res);
  },

  // Settings
  async getSettings() {
    const res = await fetchWithTimeout(`${API_BASE_URL}/settings`);
    return handleResponse(res);
  },

  async updateSettings(settings) {
    const res = await fetchWithTimeout(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return handleResponse(res);
  },

  // Reset database
  async resetDatabase() {
    const res = await fetchWithTimeout(`${API_BASE_URL}/seed/reset`, {
      method: 'POST',
    });
    return handleResponse(res);
  },
};
