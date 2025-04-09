// src/hooks/useMedicamentos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as medicamentoService from '@/services/medicamentos'; // Import the service
import type { Medicamento, MedicamentoFormData } from '@/types/medicamento';
import { useToast } from "@/hooks/use-toast";

// Define a query key constant
export const MEDICAMENTOS_QUERY_KEY = ['medicamentos'];

// Define expected API error structure
interface ApiErrorResponse {
  message: string;
}

/**
 * Hook to fetch the list of all medicamentos.
 */
export const useGetMedicamentos = () => {
  return useQuery<Medicamento[], Error>({
    queryKey: MEDICAMENTOS_QUERY_KEY,
    queryFn: medicamentoService.getMedicamentos,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single medicamento by ID.
 */
export const useGetMedicamentoById = (id: number | null) => {
  return useQuery<Medicamento, Error>({
    queryKey: [...MEDICAMENTOS_QUERY_KEY, id],
    queryFn: () => {
      if (!id) throw new Error("Cannot fetch medicamento without ID");
      return medicamentoService.getMedicamentoById(id);
    },
    enabled: !!id, // Only run if ID is provided
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook for the mutation to create a new medicamento.
 */
export const useCreateMedicamento = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: MedicamentoFormData) => medicamentoService.createMedicamento(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDICAMENTOS_QUERY_KEY });
      toast({ title: "Éxito", description: "Medicamento creado correctamente." });
    },
    onError: (error: unknown) => {
      console.error("Error creating medicamento:", error);
      let message = "Error desconocido al crear el medicamento.";
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
 * Hook for the mutation to update a medicamento.
 */
export const useUpdateMedicamento = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: { id: number; data: Partial<MedicamentoFormData> }) =>
      medicamentoService.updateMedicamento(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: MEDICAMENTOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...MEDICAMENTOS_QUERY_KEY, variables.id] });
      toast({ title: "Éxito", description: "Medicamento actualizado correctamente." });
    },
    onError: (error: unknown, variables) => {
      console.error(`Error updating medicamento ${variables.id}:`, error);
      let message = "Error desconocido al actualizar el medicamento.";
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
 * Hook for the mutation to delete a medicamento.
 */
export const useDeleteMedicamento = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => medicamentoService.deleteMedicamento(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: MEDICAMENTOS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: [...MEDICAMENTOS_QUERY_KEY, id] });
      toast({ title: "Éxito", description: "Medicamento eliminado correctamente." });
    },
    onError: (error: unknown, id) => {
      console.error(`Error deleting medicamento ${id}:`, error);
      let message = "Error desconocido al eliminar el medicamento.";
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