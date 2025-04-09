// src/services/citas.ts
import apiClient from '@/lib/apiClient';
import type { Cita, CitaFormData } from '@/types/citas';

const API_PREFIX = '/citas';

/**
 * Fetches a list of all citas.
 * Corresponds to: GET /citas
 */
export const getCitas = async (): Promise<Cita[]> => {
  const response = await apiClient.get<Cita[]>(API_PREFIX);
  return response.data;
};

/**
 * Fetches details for a single cita by ID.
 * Corresponds to: GET /citas/{id}
 */
export const getCitaById = async (id: number): Promise<Cita> => {
  const response = await apiClient.get<Cita>(`${API_PREFIX}/${id}`);
  return response.data;
};

/**
 * Creates a new cita.
 * Corresponds to: POST /citas
 */
export const createCita = async (data: CitaFormData): Promise<Cita> => {
  // API expects fecha_hora as string
  const response = await apiClient.post<Cita>(API_PREFIX, data);
  return response.data; // Assuming API returns the created cita
};

/**
 * Updates an existing cita.
 * Corresponds to: PUT /citas/{id}
 */
export const updateCita = async ({ id, data }: { id: number; data: Partial<CitaFormData> }): Promise<{ message: string }> => {
  // API expects fecha_hora as string if included
  const response = await apiClient.put<{ message: string }>(`${API_PREFIX}/${id}`, data);
  return response.data; // Assuming API returns a success message
};

/**
 * Deletes a cita by ID.
 * Corresponds to: DELETE /citas/{id}
 */
export const deleteCita = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`${API_PREFIX}/${id}`);
  return response.data; // Assuming API returns a success message
};