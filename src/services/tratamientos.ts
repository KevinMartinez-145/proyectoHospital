// src/services/tratamientos.ts
import apiClient from '@/lib/apiClient';
import type { Tratamiento, TratamientoFormData } from '@/types/tratamiento';

const API_PREFIX = '/tratamientos';

/**
 * Fetches a list of all tratamientos.
 * Corresponds to: GET /tratamientos
 */
export const getTratamientos = async (): Promise<Tratamiento[]> => {
  const response = await apiClient.get<Tratamiento[]>(API_PREFIX);
  return response.data;
};

/**
 * Fetches details for a single tratamiento by ID.
 * Corresponds to: GET /tratamientos/{id}
 */
export const getTratamientoById = async (id: number): Promise<Tratamiento> => {
  const response = await apiClient.get<Tratamiento>(`${API_PREFIX}/${id}`);
  return response.data;
};

/**
 * Creates a new tratamiento.
 * Corresponds to: POST /tratamientos
 */
export const createTratamiento = async (data: TratamientoFormData): Promise<Tratamiento> => {
  // API expects dates as YYYY-MM-DD strings
  const response = await apiClient.post<Tratamiento>(API_PREFIX, data);
  return response.data; // Assuming API returns the created tratamiento
};

/**
 * Updates an existing tratamiento.
 * Corresponds to: PUT /tratamientos/{id}
 */
export const updateTratamiento = async ({ id, data }: { id: number; data: Partial<TratamientoFormData> }): Promise<{ message: string }> => {
  // API expects dates as YYYY-MM-DD strings if included
  const response = await apiClient.put<{ message: string }>(`${API_PREFIX}/${id}`, data);
  return response.data; // Assuming API returns a success message
};

/**
 * Deletes a tratamiento by ID.
 * Corresponds to: DELETE /tratamientos/{id}
 */
export const deleteTratamiento = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`${API_PREFIX}/${id}`);
  return response.data; // Assuming API returns a success message
};