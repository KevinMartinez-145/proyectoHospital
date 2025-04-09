// src/types/medicamento.ts

// Simplified info for the nested tratamiento object
export interface MedicamentoTratamientoInfo {
    id_tratamiento: number;
    id_paciente: number;
    id_doctor: number;
    descripcion: string;
    fecha_inicio: string; // YYYY-MM-DD
    fecha_fin: string;    // YYYY-MM-DD
  }
  
  // Main Medicamento type matching the GET /medicamentos response
  export interface Medicamento {
    id_medicamento: number;
    nombre: string;
    descripcion: string;
    dosis: string;
    frecuencia: string;
    id_tratamiento: number;
    tratamiento: MedicamentoTratamientoInfo; // Nested info
    createdAt?: string; // Optional standard timestamp
    updatedAt?: string; // Optional standard timestamp
  }
  
  // Type for data sent to CREATE/UPDATE API (POST/PUT /medicamentos)
  export interface MedicamentoFormData {
    nombre: string;
    descripcion: string;
    dosis: string;
    frecuencia: string;
    id_tratamiento: number;
  }