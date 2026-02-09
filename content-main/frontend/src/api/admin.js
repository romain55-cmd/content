import apiClient from './apiClient';

export const getDashboardData = async () => {
  try {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const getUsers = async ({ page = 1, limit = 10, search = '', role = '' }) => {
  try {
    const response = await apiClient.get('/admin/users', {
      params: { page, limit, search, role },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/admin/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

export const getPromoCodes = async () => {
  try {
    const response = await apiClient.get('/admin/promocodes');
    return response.data;
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    throw error;
  }
};

export const createPromoCode = async (promoCodeData) => {
  try {
    const response = await apiClient.post('/admin/promocodes', promoCodeData);
    return response.data;
  } catch (error) {
    console.error('Error creating promo code:', error);
    throw error;
  }
};

export const getAuditLogs = async ({ page = 1, limit = 15, userId = '', action = '' }) => {
  try {
    const response = await apiClient.get('/admin/audit-logs', {
      params: { page, limit, userId, action },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

export const getAiContent = async ({ page = 1, limit = 10 }) => {
  try {
    const response = await apiClient.get('/admin/ai-content', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching AI content:', error);
    throw error;
  }
};

export const getPayments = async ({ cursor = null }) => {
  try {
    const response = await apiClient.get('/admin/payments', {
      params: { cursor },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};
