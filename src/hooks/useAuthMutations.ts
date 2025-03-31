// src/hooks/useAuthMutations.ts

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/stores/useAuthStore'; 
import { login } from '@/services/auth';            
import type { LoginRequest, LoginResponse } from '@/types/auth'; 
import { useToast } from "@/hooks/use-toast";

// Define the expected structure of the error data from your API
// Based on #/components/schemas/ErrorResponse in your OpenAPI spec
interface ApiErrorData {
  message: string;
  // Add other potential properties if your backend sends more error details
}

/**
 * Custom hook for handling the login mutation.
 * Uses Tanstack Query's useMutation to call the login service,
 * handles success (updating auth state, navigating) and errors (showing toast).
 */
export const useLogin = () => {
  // Hooks needed for side effects
  const navigate = useNavigate();
  const { setUser } = useAuthStore(); // Get the function to update auth state
  const { toast } = useToast();       // Get the toast function for feedback

  // Create the mutation instance
  const mutation = useMutation({
    // The function that performs the actual API call (must return a Promise)
    mutationFn: (credentials: LoginRequest) => login(credentials),

    // Function to run on successful mutation (API call returns 2xx status)
    onSuccess: (data: LoginResponse) => {
      // 'data' is the resolved value from the login() Promise (LoginResponse)
      setUser(data.usuario, data.token); // Update Zustand store
      toast({
        title: "Inicio de Sesión Exitoso",
        description: `¡Bienvenido/a de nuevo, ${data.usuario.nombre}!`,
      });
      navigate('/'); // Navigate to the main dashboard page
    },

    // Function to run if the mutation fails (API call returns error or throws)
    onError: (error: unknown) => {
      // We expect Axios errors, but type safely
      let errorMessage = "Error al iniciar sesión. Verifica tus credenciales o inténtalo más tarde.";

      if (error instanceof AxiosError) {
        // Try to extract the specific message from the API response
        const apiErrorData = error.response?.data as ApiErrorData | undefined;
        if (apiErrorData?.message) {
          errorMessage = apiErrorData.message;
        }
        console.error("Login API Error:", error.response?.data || error.message);
      } else if (error instanceof Error) {
        // Handle other types of errors
        errorMessage = error.message;
        console.error("Login Generic Error:", error);
      } else {
        // Handle unexpected error types
        console.error("Login Unexpected Error:", error);
      }

      toast({
        title: "Error de Inicio de Sesión",
        description: errorMessage,
        variant: "destructive",
      });
    },

    // Optional: You can add onMutate (runs before mutationFn) or
    // onSettled (runs after success or error) if needed later.
    // onSettled: () => {
    //   console.log("Login mutation finished (either success or error)");
    // }
  });

  // Return the mutation object, which contains status flags (isLoading, isError)
  // and the mutate/mutateAsync functions to trigger the login.
  return mutation;
};

// Optional: Add other mutations like useLogout here later if needed.