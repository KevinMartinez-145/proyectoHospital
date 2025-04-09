// src/types/tratamiento.ts
import type { CitaPacienteInfo, CitaDoctorInfo } from './citas'; // Reuse simplified info types

// Main Tratamiento type matching the GET /tratamientos response structure
export interface Tratamiento {
  id_tratamiento: number;
  id_paciente: number;
  id_doctor: number;
  descripcion: string;
  fecha_inicio: string; // YYYY-MM-DD string from API
  fecha_fin: string;    // YYYY-MM-DD string from API
  paciente: CitaPacienteInfo; // Reuse from Cita types
  doctor: CitaDoctorInfo;     // Reuse from Cita types
  createdAt?: string; // Optional standard timestamp
  updatedAt?: string; // Optional standard timestamp
}

// Type for data sent to CREATE/UPDATE API (POST/PUT /tratamientos)
export interface TratamientoFormData {
  id_paciente: number;
  id_doctor: number;
  descripcion: string;
  fecha_inicio: string; // Expecting YYYY-MM-DD string format for API
  fecha_fin: string;    // Expecting YYYY-MM-DD string format for API
}