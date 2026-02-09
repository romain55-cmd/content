import axios from 'axios';

const apiClient = axios.create({
  //baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api', // Test VITE_ для React/Vite
  baseURL: import.meta.env.VITE_API_URL || '/api',  // Prod
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Safely extract the error message
    let errorMessage = "Произошла сетевая ошибка.";
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data?.message || `Ошибка: ${error.response.status}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "Сервер не отвечает. Проверьте ваше интернет-соединение.";
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }
    
    console.error("API Error:", errorMessage, error);

    // To prevent crashing, we create a new Error object with a clear message.
    // The component's catch block will receive this.
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
