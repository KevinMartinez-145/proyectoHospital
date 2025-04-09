// src/services/departamentos.ts
import apiClient from '@/lib/apiClient';
import type { Departamento, DepartamentoFormData } from '@/types/departamentos';

const API_PREFIX = '/departamentos';

/**
 * Fetches a list of all departamentos.
 * Corresponds to: GET /departamentos
 */
export const getDepartamentos = async (): Promise<Departamento[]> => {
  const response = await apiClient.get<Departamento[]>(API_PREFIX);
  return response.data;
};

/**
 * Fetches details for a single departamento by ID.
 * Corresponds to: GET /departamentos/{id}
 */
export const getDepartamentoById = async (id: number): Promise<Departamento> => {
  const response = await apiClient.get<Departamento>(`${API_PREFIX}/${id}`);
  return response.data;
};

/**
 * Creates a new departamento.
 * Corresponds to: POST /departamentos
 */
export const createDepartamento = async (data: DepartamentoFormData): Promise<Departamento> => {
  const response = await apiClient.post<Departamento>(API_PREFIX, data);
  return response.data; // Assuming API returns the created departamento
};

/**
 * Updates an existing departamento.
 * Corresponds to: PUT /departamentos/{id}
 */
export const updateDepartamento = async ({ id, data }: { id: number; data: Partial<DepartamentoFormData> }): Promise<{ message: string }> => {
  const response = await apiClient.put<{ message: string }>(`${API_PREFIX}/${id}`, data);
  return response.data; // Assuming API returns a success message
};

/**
 * Deletes a departamento by ID.
 * Corresponds to: DELETE /departamentos/{id}
 */
export const deleteDepartamento = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`${API_PREFIX}/${id}`);
  return response.data; // Assuming API returns a success message
};