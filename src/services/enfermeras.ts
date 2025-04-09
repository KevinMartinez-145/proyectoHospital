// src/services/enfermeras.ts
import apiClient from '@/lib/apiClient';
import type { Enfermera, EnfermeraFormData } from '@/types/enfermera';

const API_PREFIX = '/enfermeras';


export const getEnfermeras = async (): Promise<Enfermera[]> => {
  const response = await apiClient.get<Enfermera[]>(API_PREFIX);
  return response.data;
};


export const getEnfermeraById = async (id: number): Promise<Enfermera> => {
  const response = await apiClient.get<Enfermera>(`${API_PREFIX}/${id}`);
  return response.data;
};


export const createEnfermera = async (data: EnfermeraFormData): Promise<Enfermera> => {
  const response = await apiClient.post<Enfermera>(API_PREFIX, data);
  return response.data; // Assuming API returns the created enfermera
};


export const updateEnfermera = async ({ id, data }: { id: number; data: Partial<EnfermeraFormData> }): Promise<{ message: string }> => {
  const response = await apiClient.put<{ message: string }>(`${API_PREFIX}/${id}`, data);
  return response.data; // Assuming API returns a success message
};


export const deleteEnfermera = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`${API_PREFIX}/${id}`);
  return response.data; // Assuming API returns a success message
};