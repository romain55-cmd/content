import apiClient from './apiClient';

export const generatePromoCodeApi = async (email) => {
  try {
    const response = await apiClient.post('/promocodes', { email }); // Corrected: send email as an object
    return response.data;
  } catch (error) {
    console.error('Error in generatePromoCodeApi:', error);
    // apiClient's interceptor already wraps the error, so re-throwing as is.
    throw error;
  }
};

export const applyPromoCodeApi = async (code, originalPrice) => {
  try {
    const response = await apiClient.post('/promocodes/apply', { code, originalPrice });
    return response.data;
  } catch (error) {
    console.error('Error in applyPromoCodeApi:', error);
    throw error;
  }
};
