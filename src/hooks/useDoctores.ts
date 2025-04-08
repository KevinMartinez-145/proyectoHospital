// src/hooks/useDoctores.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as doctorService from '@/services/doctor';
import type { Doctor, DoctorFormData } from '@/types/doctor';
import { useToast } from "@/hooks/use-toast";

export const DOCTORES_QUERY_KEY = ['doctores'];

export const useGetDoctores = () => {
  return useQuery<Doctor[], Error>({
    queryKey: DOCTORES_QUERY_KEY,
    queryFn: doctorService.getDoctores,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetDoctorById = (id: number | null) => {
  return useQuery<Doctor, Error>({
    queryKey: [...DOCTORES_QUERY_KEY, id],
    queryFn: () => {
      if (!id) throw new Error("Cannot fetch doctor without ID");
      return doctorService.getDoctorById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: DoctorFormData) => doctorService.createDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCTORES_QUERY_KEY });
      toast({ title: "Éxito", description: "Doctor creado correctamente." });
    },
    onError: (error: unknown) => {
      console.error("Error creating doctor:", error);
      const message = (error instanceof Error) ? error.message : "Error desconocido al crear el doctor.";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: { id: number; data: Partial<DoctorFormData> }) =>
      doctorService.updateDoctor(params),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCTORES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...DOCTORES_QUERY_KEY, variables.id] });
      toast({ title: "Éxito", description: "Doctor actualizado correctamente." });
    },
    onError: (error: unknown, variables) => {
      console.error(`Error updating doctor ${variables.id}:`, error);
      const message = (error instanceof Error) ? error.message : "Error desconocido al actualizar el doctor.";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => doctorService.deleteDoctor(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: DOCTORES_QUERY_KEY });
      queryClient.removeQueries({ queryKey: [...DOCTORES_QUERY_KEY, id] });
      toast({ title: "Éxito", description: "Doctor eliminado correctamente." });
    },
    onError: (error: unknown, id) => {
      console.error(`Error deleting doctor ${id}:`, error);
      const message = (error instanceof Error) ? error.message : "Error desconocido al eliminar el doctor.";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });
};
