import apiClient from './apiClient';

/**
 * Saves a new piece of content.
 * @param {object} contentData - The content data to save.
 * @returns {Promise<object>} The saved content object.
 */
export const saveContentApi = async (contentData) => {
  try {
    const { data } = await apiClient.post('/content', contentData);
    return data;
  } catch (error) {
    // The apiClient interceptor will log the error, so we just re-throw it
    // for the component to handle.
    throw error;
  }
};

/**
 * Fetches all content for the authenticated user.
 * @returns {Promise<Array>} An array of content objects.
 */
export const updateContentApi = async (id, updateData) => {
  try {
    const { data } = await apiClient.put(`/content/${id}`, updateData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserContentApi = async (filters = {}) => {
  try {
    const { data } = await apiClient.get('/content', { params: filters });
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteContentApi = async (id) => {
  try {
    const { data } = await apiClient.delete(`/content/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};