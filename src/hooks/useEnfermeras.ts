// src/hooks/useEnfermeras.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as enfermeraService from '@/services/enfermeras'; // Import the service
import type { Enfermera, EnfermeraFormData } from '@/types/enfermera';
import { useToast } from "@/hooks/use-toast";

// Define a query key constant
export const ENFERMERAS_QUERY_KEY = ['enfermeras'];

/**
 * Hook to fetch the list of all enfermeras.
 */
export const useGetEnfermeras = () => {
  return useQuery<Enfermera[], Error>({
    queryKey: ENFERMERAS_QUERY_KEY,
    queryFn: enfermeraService.getEnfermeras,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single enfermera by ID.
 */
export const useGetEnfermeraById = (id: number | null) => {
  return useQuery<Enfermera, Error>({
    queryKey: [...ENFERMERAS_QUERY_KEY, id],
    queryFn: () => {
      if (!id) throw new Error("Cannot fetch enfermera without ID");
      return enfermeraService.getEnfermeraById(id);
    },
    enabled: !!id, // Only run if ID is provided
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook for the mutation to create a new enfermera.
 */
export const useCreateEnfermera = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: EnfermeraFormData) => enfermeraService.createEnfermera(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENFERMERAS_QUERY_KEY });
      toast({ title: "Éxito", description: "Enfermera creada correctamente." });
    },
    onError: (error: unknown) => {
      console.error("Error creating enfermera:", error);
      const message = (error instanceof Error) ? error.message : "Error desconocido al crear la enfermera.";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });
};

/**
 * Hook for the mutation to update an enfermera.
 */
export const useUpdateEnfermera = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: { id: number; data: Partial<EnfermeraFormData> }) =>
      enfermeraService.updateEnfermera(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ENFERMERAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ENFERMERAS_QUERY_KEY, variables.id] });
      toast({ title: "Éxito", description: "Enfermera actualizada correctamente." });
    },
    onError: (error: unknown, variables) => {
      console.error(`Error updating enfermera ${variables.id}:`, error);
      const message = (error instanceof Error) ? error.message : "Error desconocido al actualizar la enfermera.";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });
};

/**
 * Hook for the mutation to delete an enfermera.
 */
export const useDeleteEnfermera = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => enfermeraService.deleteEnfermera(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ENFERMERAS_QUERY_KEY });
      // Optionally remove specific query if cached
      queryClient.removeQueries({ queryKey: [...ENFERMERAS_QUERY_KEY, id] });
      toast({ title: "Éxito", description: "Enfermera eliminada correctamente." });
    },
    onError: (error: unknown, id) => {
      console.error(`Error deleting enfermera ${id}:`, error);
      const message = (error instanceof Error) ? error.message : "Error desconocido al eliminar la enfermera.";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });
};