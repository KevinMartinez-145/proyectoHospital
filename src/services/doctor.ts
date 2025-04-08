// src/services/doctores.ts
import apiClient from '@/lib/apiClient';
import type { Doctor, DoctorFormData } from '@/types/doctor';

/**
 * Fetches a list of all doctors from the API.
 * Corresponds to: GET /doctores
 */
export const getDoctores = async (): Promise<Doctor[]> => {
  const response = await apiClient.get<Doctor[]>('/doctores');
  return response.data;
};

/**
 * Fetches details for a single doctor by their ID.
 * Corresponds to: GET /doctores/{id}
 */
export const getDoctorById = async (id: number): Promise<Doctor> => {
  const response = await apiClient.get<Doctor>(`/doctores/${id}`);
  return response.data;
};

/**
 * Creates a new doctor.
 * Corresponds to: POST /doctores
 */
export const createDoctor = async (data: DoctorFormData): Promise<Doctor> => {
  const response = await apiClient.post<Doctor>('/doctores', data);
  return response.data;
};

/**
 * Updates an existing doctor.
 * Corresponds to: PUT /doctores/{id}
 */
export const updateDoctor = async ({ id, data }: { id: number; data: Partial<DoctorFormData> }): Promise<{ message: string }> => {
  const response = await apiClient.put<{ message: string }>(`/doctores/${id}`, data);
  return response.data;
};

/**
 * Deletes a doctor by their ID.
 * Corresponds to: DELETE /doctores/{id}
 */
export const deleteDoctor = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/doctores/${id}`);
  return response.data;
};
