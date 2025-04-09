// src/services/medicamentos.ts
import apiClient from '@/lib/apiClient';
import type { Medicamento, MedicamentoFormData } from '@/types/medicamento';

const API_PREFIX = '/medicamentos';

/**
 * Fetches a list of all medicamentos.
 * Corresponds to: GET /medicamentos
 */
export const getMedicamentos = async (): Promise<Medicamento[]> => {
  const response = await apiClient.get<Medicamento[]>(API_PREFIX);
  return response.data;
};

/**
 * Fetches details for a single medicamento by ID.
 * Corresponds to: GET /medicamentos/{id}
 */
export const getMedicamentoById = async (id: number): Promise<Medicamento> => {
  const response = await apiClient.get<Medicamento>(`${API_PREFIX}/${id}`);
  return response.data;
};

/**
 * Creates a new medicamento.
 * Corresponds to: POST /medicamentos
 */
export const createMedicamento = async (data: MedicamentoFormData): Promise<Medicamento> => {
  const response = await apiClient.post<Medicamento>(API_PREFIX, data);
  return response.data; // Assuming API returns the created medicamento
};

/**
 * Updates an existing medicamento.
 * Corresponds to: PUT /medicamentos/{id}
 */
export const updateMedicamento = async ({ id, data }: { id: number; data: Partial<MedicamentoFormData> }): Promise<{ message: string }> => {
  const response = await apiClient.put<{ message: string }>(`${API_PREFIX}/${id}`, data);
  return response.data; // Assuming API returns a success message
};

/**
 * Deletes a medicamento by ID.
 * Corresponds to: DELETE /medicamentos/{id}
 */
export const deleteMedicamento = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`${API_PREFIX}/${id}`);
  return response.data; // Assuming API returns a success message
};