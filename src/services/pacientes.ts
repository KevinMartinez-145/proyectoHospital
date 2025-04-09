// src/services/pacientes.ts
import apiClient from '@/lib/apiClient'; // Use our configured Axios instance
import type { Paciente, PacienteFormData } from '@/types/paciente'; // Import types

/**
 * Fetches a list of all patients from the API.
 * Corresponds to: GET /pacientes
 */
export const getPacientes = async (): Promise<Paciente[]> => {
  const response = await apiClient.get<Paciente[]>('/pacientes');
  return response.data;
};

/**
 * Fetches details for a single patient by their ID.
 * Corresponds to: GET /pacientes/{id}
 * IMPORTANT: This endpoint is NOT in your provided OpenAPI spec.
 *            It needs to be added to the backend for the Edit feature to work ideally.
 *            If it doesn't exist, we'll need a workaround later.
 */
export const getPacienteById = async (id: number): Promise<Paciente> => {
  // Assuming the endpoint will be /pacientes/{id}
  const response = await apiClient.get<Paciente>(`/pacientes/${id}`);
  return response.data;
};


/**
 * Creates a new patient.
 * Corresponds to: POST /pacientes
 */
export const createPaciente = async (data: PacienteFormData): Promise<Paciente> => {
  const response = await apiClient.post<Paciente>('/pacientes', data);
  return response.data;
};

/**
 * Updates an existing patient.
 * Corresponds to: PUT /pacientes/{id}
 */
// The backend PUT returns just a message, not the updated patient object based on spec
// We might adjust the return type later if needed for cache updates
export const updatePaciente = async ({ id, data }: { id: number; data: Partial<PacienteFormData> }): Promise<{ message: string }> => {
  const response = await apiClient.put<{ message: string }>(`/pacientes/${id}`, data);
  return response.data;
};

/**
 * Deletes a patient by their ID.
 * Corresponds to: DELETE /pacientes/{id}
 */
// The backend DELETE returns just a message
export const deletePaciente = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/pacientes/${id}`);
  return response.data;
};