// Main Departamento type matching the GET /departamentos response
export interface Departamento {
    id_departamento: number;
    nombre: string;
    descripcion: string;
    jefe: number; // ID of the head/chief
    createdAt?: string; // Optional standard timestamp
    updatedAt?: string; // Optional standard timestamp
  }
  
  // Type for data sent to CREATE/UPDATE API (POST/PUT /departamentos)
  // Matches the required fields for creation
  export interface DepartamentoFormData {
    nombre: string;
    descripcion: string;
    jefe: number;
  }