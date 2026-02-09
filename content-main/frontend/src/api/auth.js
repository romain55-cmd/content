import apiClient from './apiClient';

export const getUserMeApi = async () => {
  try {
    const { data } = await apiClient.get('/users/me');
    return data;
  } catch (error) {
    throw error;
  }
};

export const loginUserApi = async (email, password) => {
  try {
    const { data } = await apiClient.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userProfile', JSON.stringify(data));
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const registerUserApi = async (userData) => {
  try {
    const { data } = await apiClient.post('/auth/register', userData);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userProfile', JSON.stringify(data));
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateUserMeApi = async (userData) => {
  try {
    const { data } = await apiClient.put('/users/me', userData);
    // Optionally update localStorage if the response contains updated user data
    const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
    localStorage.setItem('userProfile', JSON.stringify({ ...savedProfile, ...data }));
    return data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userProfile');
  // Optionally redirect to login page
};
