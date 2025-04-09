// src/lib/apiClient.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore'; // Import Zustand store

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Your backend URL from the OpenAPI spec
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Axios Interceptor ---
// This interceptor runs BEFORE each request is sent
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from the Zustand store
    const token = useAuthStore.getState().token;
    if (token) {
      // If a token exists, add the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Continue with the request configuration
  },
  (error) => {
    // Handle request errors (e.g., network issues)
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor for global error handling (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response, // Simply return successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., token expired)
      console.error("Unauthorized request - logging out.");
      // Clear auth state and redirect to login
      useAuthStore.getState().logout();
      // Prevent redirect loops if already on login page
      if (window.location.pathname !== '/login') {
         window.location.href = '/login'; // Force redirect
      }
    }
    // Return the error so specific hooks can handle it too
    return Promise.reject(error);
  }
);


export default apiClient;