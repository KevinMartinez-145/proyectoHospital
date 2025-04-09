// src/hooks/useCitas.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios'; // <-- Import AxiosError
import * as citaService from '@/services/citas';
import type { Cita, CitaFormData } from '@/types/citas'; // Corrected import path if needed
import { useToast } from "@/hooks/use-toast";

// Define a query key constant
export const CITAS_QUERY_KEY = ['citas'];

// Define expected API error structure
interface ApiErrorResponse {
  message: string;
}

/**
 * Hook to fetch the list of all citas.
 */
export const useGetCitas = () => {
  return useQuery<Cita[], Error>({
    queryKey: CITAS_QUERY_KEY,
    queryFn: citaService.getCitas,
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook to fetch a single cita by ID.
 */
export const useGetCitaById = (id: number | null) => {
  return useQuery<Cita, Error>({
    queryKey: [...CITAS_QUERY_KEY, id],
    queryFn: () => {
      if (!id) throw new Error("Cannot fetch cita without ID");
      return citaService.getCitaById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook for the mutation to create a new cita.
 */
export const useCreateCita = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CitaFormData) => citaService.createCita(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CITAS_QUERY_KEY });
      toast({ title: "Éxito", description: "Cita creada correctamente." });
    },
    onError: (error: unknown) => { // error is initially unknown
      console.error("Error creating cita:", error);
      let message = "Error desconocido al crear la cita.";

      // Check if it's an AxiosError
      if (error instanceof AxiosError) {
        // Safely access response data and cast to known type
        const apiError = error.response?.data as ApiErrorResponse | undefined;
        if (apiError?.message) {
          message = apiError.message;
        } else if (error.message) { // Fallback to Axios error message
            message = error.message;
        }
      } else if (error instanceof Error) { // Check if it's a standard Error
        message = error.message;
      }

      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });
};

/**
 * Hook for the mutation to update a cita.
 */
export const useUpdateCita = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: { id: number; data: Partial<CitaFormData> }) =>
      citaService.updateCita(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CITAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...CITAS_QUERY_KEY, variables.id] });
      toast({ title: "Éxito", description: "Cita actualizada correctamente." });
    },
    onError: (error: unknown, variables) => { // error is initially unknown
      console.error(`Error updating cita ${variables.id}:`, error);
      let message = "Error desconocido al actualizar la cita.";

      if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiErrorResponse | undefined;
        if (apiError?.message) {
          message = apiError.message;
        } else if (error.message) {
            message = error.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });
};

/**
 * Hook for the mutation to delete a cita.
 */
export const useDeleteCita = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => citaService.deleteCita(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CITAS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: [...CITAS_QUERY_KEY, id] });
      toast({ title: "Éxito", description: "Cita eliminada correctamente." });
    },
    onError: (error: unknown, id) => { // error is initially unknown
      console.error(`Error deleting cita ${id}:`, error);
      let message = "Error desconocido al eliminar la cita.";

      if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiErrorResponse | undefined;
        if (apiError?.message) {
          message = apiError.message;
        } else if (error.message) {
            message = error.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });
};