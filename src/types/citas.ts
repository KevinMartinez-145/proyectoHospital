// Simplified info included in the Cita GET response
export interface CitaPacienteInfo {
  id_paciente: number;
  nombre: string;
  apellido: string;
}

export interface CitaDoctorInfo {
  id_doctor: number;
  nombre: string;
  apellido: string;
  especialidad: string;
}

// Main Cita type matching the GET /citas response structure
export interface Cita {
  id_cita: number;
  id_paciente: number;
  id_doctor: number;
  fecha_hora: string; // ISO string from API
  motivo_cita: string;
  notas_medicas: string | null; // Assuming notes can be null
  Paciente: CitaPacienteInfo;
  Doctor: CitaDoctorInfo;
  createdAt?: string; // Optional standard timestamp
  updatedAt?: string; // Optional standard timestamp
}

// Type for data sent to CREATE/UPDATE API (POST/PUT /citas)
export interface CitaFormData {
  id_paciente: number;
  id_doctor: number;
  fecha_hora: string; // Expecting ISO string format for API
  motivo_cita: string;
  notas_medicas?: string | null; // Optional
}