// src/types/doctor.ts

export interface Doctor {
  id_doctor: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string | null;
  correo_electronico: string | null;
  horario_atencion: string | null; 
  createdAt?: string;
  updatedAt?: string;

}

// Type for data sent to create/update (aligned with DoctorForm.tsx)
export interface DoctorFormData {
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono?: string | null;
  correo_electronico?: string | null;
  horario_atencion: string;

}