// src/hooks/usePacientes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as pacienteService from '@/services/pacientes'; // Import service functions
import type { Paciente, PacienteFormData } from '@/types/paciente';
import { useToast } from "@/hooks/use-toast"; // Ensure correct path

// Define a query key constant for patients
export const PACIENTES_QUERY_KEY = ['pacientes'];

/**
 * Hook to fetch the list of all patients.
 */
export const useGetPacientes = () => {
  return useQuery<Paciente[], Error>({
    queryKey: PACIENTES_QUERY_KEY, // Unique key for this query
    queryFn: pacienteService.getPacientes, // Function to fetch the data
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    // Add other options like refetchOnWindowFocus: false if desired
  });
};

/**
 * Hook to fetch a single patient by ID.
 * (Depends on GET /pacientes/{id} existing on the backend)
 */
export const useGetPacienteById = (id: number | null) => {
  return useQuery<Paciente, Error>({
    queryKey: [...PACIENTES_QUERY_KEY, id], // Unique key including the ID
    queryFn: () => {
        if (!id) throw new Error("Cannot fetch patient without ID"); // Prevent fetch if ID is null
        return pacienteService.getPacienteById(id);
    },
    enabled: !!id, // Only run the query if the ID is truthy (not null, 0, undefined)
    staleTime: 1000 * 60 * 5,
  });
};


/**
 * Hook for the mutation to create a new patient.
 */
export const useCreatePaciente = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({ // Using object syntax
    mutationFn: (data: PacienteFormData) => pacienteService.createPaciente(data),
    onSuccess: () => {
      // When creation is successful, invalidate the main patients list query
      // This tells Tanstack Query to refetch the list to include the new patient
      queryClient.invalidateQueries({ queryKey: PACIENTES_QUERY_KEY });

      // Optional: Directly add the new patient to the cache for instant UI update
      // queryClient.setQueryData<Paciente[]>(PACIENTES_QUERY_KEY, (oldData = []) => [...oldData, newPaciente]);

      toast({ title: "Éxito", description: "Paciente creado correctamente." });
    },
    onError: (error: unknown) => {
      // Basic error handling (can be improved like in useLogin)
      console.error("Error creating patient:", error);
      const message = (error instanceof Error) ? error.message : "Error desconocido al crear el paciente.";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });
};

/**
 * Hook for the mutation to update a patient.
 */
export const useUpdatePaciente = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        // The mutation function expects an object { id, data }
        mutationFn: (params: { id: number; data: Partial<PacienteFormData> }) =>
            pacienteService.updatePaciente(params),

        onSuccess: (_, variables) => { // First arg is mutation result (message), second is variables ({id, data})
            // Invalidate the list query and the specific patient query
            queryClient.invalidateQueries({ queryKey: PACIENTES_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...PACIENTES_QUERY_KEY, variables.id] });

            // Note: Since PUT doesn't return the updated object, direct cache update is harder.
            // Invalidation is the most reliable approach here.

            toast({ title: "Éxito", description: "Paciente actualizado correctamente." });
        },
        onError: (error: unknown, variables) => {
            console.error(`Error updating patient ${variables.id}:`, error);
            const message = (error instanceof Error) ? error.message : "Error desconocido al actualizar el paciente.";
            toast({ title: "Error", description: message, variant: "destructive" });
        },
    });
};


/**
 * Hook for the mutation to delete a patient.
 */
export const useDeletePaciente = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => pacienteService.deletePaciente(id), // Function takes patient ID
    onSuccess: (_, id) => { // First arg is mutation result (message), second is the ID passed to mutate
      // Invalidate the main list query to remove the deleted patient
      queryClient.invalidateQueries({ queryKey: PACIENTES_QUERY_KEY });

      // Optional: Remove the specific patient query from cache if it exists
      queryClient.removeQueries({ queryKey: [...PACIENTES_QUERY_KEY, id] });

      toast({ title: "Éxito", description: "Paciente eliminado correctamente." });
    },
    onError: (error: unknown, id) => {
      console.error(`Error deleting patient ${id}:`, error);
      const message = (error instanceof Error) ? error.message : "Error desconocido al eliminar el paciente.";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });
};