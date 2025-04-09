// src/types/paciente.ts (or src/types/index.ts)

export interface Paciente {
    id_paciente: number;
    nombre: string;
    apellido: string;
    fecha_nacimiento: string; // Keep as string from API, format later for display
    direccion: string | null; // Allow null based on schema/DB
    telefono: string | null;
    correo_electronico: string | null;
    historia_medica?: string | null; // Optional text field
    createdAt?: string; // Optional
    updatedAt?: string; // Optional
  }
  
  // Type for data sent to create/update (omit id, createdAt, updatedAt)
  // Based on #/components/schemas/NuevoPaciente
  export interface PacienteFormData {
    nombre: string;
    apellido: string;
    fecha_nacimiento: string; // API expects 'YYYY-MM-DD' string for creation
    direccion?: string | null;
    telefono?: string | null;
    correo_electronico?: string | null;
    historia_medica?: string | null;
  }