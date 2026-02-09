import apiClient from './apiClient';

export const getProducts = async () => {
  try {
    const response = await apiClient.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createCheckoutSession = async (options) => {
  try {
    const response = await apiClient.post('/payments/create', options);
    return response.data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const createBillingPortalSession = async (options) => {
  console.log('[Mock API] createBillingPortalSession called with:', options);
  alert('Billing portal is currently disabled.');
  return Promise.resolve({ url: '#' });
};