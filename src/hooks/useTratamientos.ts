// src/hooks/useTratamientos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as tratamientoService from '@/services/tratamientos'; // Import the service
import type { Tratamiento, TratamientoFormData } from '@/types/tratamiento';
import { useToast } from "@/hooks/use-toast";

// Define a query key constant
export const TRATAMIENTOS_QUERY_KEY = ['tratamientos'];

// Define expected API error structure
interface ApiErrorResponse {
  message: string;
}

/**
 * Hook to fetch the list of all tratamientos.
 */
export const useGetTratamientos = () => {
  return useQuery<Tratamiento[], Error>({
    queryKey: TRATAMIENTOS_QUERY_KEY,
    queryFn: tratamientoService.getTratamientos,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single tratamiento by ID.
 */
export const useGetTratamientoById = (id: number | null) => {
  return useQuery<Tratamiento, Error>({
    queryKey: [...TRATAMIENTOS_QUERY_KEY, id],
    queryFn: () => {
      if (!id) throw new Error("Cannot fetch tratamiento without ID");
      return tratamientoService.getTratamientoById(id);
    },
    enabled: !!id, // Only run if ID is provided
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook for the mutation to create a new tratamiento.
 */
export const useCreateTratamiento = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: TratamientoFormData) => tratamientoService.createTratamiento(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRATAMIENTOS_QUERY_KEY });
      toast({ title: "Éxito", description: "Tratamiento creado correctamente." });
    },
    onError: (error: unknown) => {
      console.error("Error creating tratamiento:", error);
      let message = "Error desconocido al crear el tratamiento.";
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
 * Hook for the mutation to update a tratamiento.
 */
export const useUpdateTratamiento = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: { id: number; data: Partial<TratamientoFormData> }) =>
      tratamientoService.updateTratamiento(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TRATAMIENTOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...TRATAMIENTOS_QUERY_KEY, variables.id] });
      toast({ title: "Éxito", description: "Tratamiento actualizado correctamente." });
    },
    onError: (error: unknown, variables) => {
      console.error(`Error updating tratamiento ${variables.id}:`, error);
      let message = "Error desconocido al actualizar el tratamiento.";
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
 * Hook for the mutation to delete a tratamiento.
 */
export const useDeleteTratamiento = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => tratamientoService.deleteTratamiento(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: TRATAMIENTOS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: [...TRATAMIENTOS_QUERY_KEY, id] });
      toast({ title: "Éxito", description: "Tratamiento eliminado correctamente." });
    },
    onError: (error: unknown, id) => {
      console.error(`Error deleting tratamiento ${id}:`, error);
      let message = "Error desconocido al eliminar el tratamiento.";
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