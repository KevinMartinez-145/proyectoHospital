// src/types/auth.ts (or index.ts)

// Matches the #/components/schemas/LoginRequest in OpenAPI
export interface LoginRequest {
    email: string;
    password: string;
    rol?: 'admin' | 'doctor' | 'enfermera'; // Optional role
  }
  
  // Matches the #/components/schemas/LoginResponse in OpenAPI
  export interface LoginResponse {
    message: string;
    token: string;
    usuario: {
      id: number;
      rol: 'admin' | 'doctor' | 'enfermera' | 'paciente'; // Include 'paciente' if possible
      email: string;
      nombre: string;
    };
  }
  
  // Type for the user object stored in Zustand (derived from LoginResponse)
  export type AuthUser = LoginResponse['usuario'];