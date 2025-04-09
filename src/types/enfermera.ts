
export interface Enfermera {
    id_enfermera: number;
    nombre: string;
    apellido: string;
    telefono: string; 
    correo_electronico: string; 
    usuario_id: number;
    createdAt?: string; 
    updatedAt?: string; 
  }
  
  // Type for data sent to create/update API
  export interface EnfermeraFormData {
    nombre: string;
    apellido: string;
    telefono: string;
    correo_electronico: string;
    usuario_id: number;
  }