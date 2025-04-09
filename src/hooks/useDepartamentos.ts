// src/hooks/useDepartamentos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as departamentoService from '@/services/departamentos'; // Import the service
import type { Departamento, DepartamentoFormData } from '@/types/departamentos';
import { useToast } from "@/hooks/use-toast";

// Define a query key constant
export const DEPARTAMENTOS_QUERY_KEY = ['departamentos'];

// Define expected API error structure
interface ApiErrorResponse {
  message: string;
}

/**
 * Hook to fetch the list of all departamentos.
 */
export const useGetDepartamentos = () => {
  return useQuery<Departamento[], Error>({
    queryKey: DEPARTAMENTOS_QUERY_KEY,
    queryFn: departamentoService.getDepartamentos,
    staleTime: 1000 * 60 * 10, // Departments might not change often, 10 min stale time
  });
};

/**
 * Hook to fetch a single departamento by ID.
 */
export const useGetDepartamentoById = (id: number | null) => {
  return useQuery<Departamento, Error>({
    queryKey: [...DEPARTAMENTOS_QUERY_KEY, id],
    queryFn: () => {
      if (!id) throw new Error("Cannot fetch departamento without ID");
      return departamentoService.getDepartamentoById(id);
    },
    enabled: !!id, // Only run if ID is provided
    staleTime: 1000 * 60 * 10,
  });
};

/**
 * Hook for the mutation to create a new departamento.
 */
export const useCreateDepartamento = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: DepartamentoFormData) => departamentoService.createDepartamento(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTAMENTOS_QUERY_KEY });
      toast({ title: "Éxito", description: "Departamento creado correctamente." });
    },
    onError: (error: unknown) => {
      console.error("Error creating departamento:", error);
      let message = "Error desconocido al crear el departamento.";
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
 * Hook for the mutation to update a departamento.
 */
export const useUpdateDepartamento = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: { id: number; data: Partial<DepartamentoFormData> }) =>
      departamentoService.updateDepartamento(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DEPARTAMENTOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...DEPARTAMENTOS_QUERY_KEY, variables.id] });
      toast({ title: "Éxito", description: "Departamento actualizado correctamente." });
    },
    onError: (error: unknown, variables) => {
      console.error(`Error updating departamento ${variables.id}:`, error);
      let message = "Error desconocido al actualizar el departamento.";
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
 * Hook for the mutation to delete a departamento.
 */
export const useDeleteDepartamento = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => departamentoService.deleteDepartamento(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: DEPARTAMENTOS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: [...DEPARTAMENTOS_QUERY_KEY, id] });
      toast({ title: "Éxito", description: "Departamento eliminado correctamente." });
    },
    onError: (error: unknown, id) => {
      console.error(`Error deleting departamento ${id}:`, error);
      let message = "Error desconocido al eliminar el departamento.";
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