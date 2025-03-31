// src/services/auth.ts
import apiClient from '@/lib/apiClient'; // Use the configured Axios instance
import type { LoginRequest, LoginResponse } from '@/types/auth'; // Import types

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  // Make the POST request using apiClient
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
  // Axios automatically throws for non-2xx status codes,
  // so we just return the data on success.
  return response.data;
};

// Optional: Add other auth-related functions here later (e.g., getMe, logout API call if needed)