// src/pages/PacienteFormPage.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { PacienteForm } from '@/components/forms/PacienteForm'; // Ensure correct path
import {
  useCreatePaciente,
  useUpdatePaciente,
  useGetPacienteById,
} from '@/hooks/usePacientes'; // Ensure correct path
import type { PacienteFormValidationData } from '@/schemas/pacienteSchema'; // Ensure correct path
import type { PacienteFormData as ApiPacienteFormData } from '@/types/paciente'; // Ensure correct path
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PacienteFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const patientId = id ? parseInt(id, 10) : null;
  const isEditMode = patientId !== null;

  // --- Mutations ---
  const createPacienteMutation = useCreatePaciente();
  const updatePacienteMutation = useUpdatePaciente();

  // --- Query for fetching patient data ---
  const {
    data: pacienteData,
    isLoading: isLoadingPaciente,
    isError: isErrorLoading,
    error: loadingError,
  } = useGetPacienteById(patientId);

  // --- Loading/Submitting State ---
  const isSubmitting = createPacienteMutation.isPending || updatePacienteMutation.isPending;

  // --- State to hold formatted data for the form ---
  const [initialData, setInitialData] = useState<Partial<PacienteFormValidationData> | undefined>(undefined);

  // --- Effect to process fetched data for the form ---
  useEffect(() => {
    if (isEditMode && pacienteData) {
      setInitialData({
        nombre: pacienteData.nombre,
        apellido: pacienteData.apellido,
        fecha_nacimiento: pacienteData.fecha_nacimiento
          ? parseISO(pacienteData.fecha_nacimiento)
          : undefined,
        direccion: pacienteData.direccion ?? '',
        telefono: pacienteData.telefono ?? '',
        correo_electronico: pacienteData.correo_electronico ?? '',
        historia_medica: pacienteData.historia_medica ?? '',
      });
    }
    if (!isEditMode) {
        setInitialData(undefined);
    }
  }, [isEditMode, pacienteData]);

  // --- Helper to transform form data to API format ---
  const transformFormDataForApi = (formData: PacienteFormValidationData): ApiPacienteFormData => {
    return {
      ...formData,
      fecha_nacimiento: formData.fecha_nacimiento
        ? format(formData.fecha_nacimiento, 'yyyy-MM-dd')
        : '',
      correo_electronico: formData.correo_electronico || null,
      telefono: formData.telefono || null,
      direccion: formData.direccion || null,
      historia_medica: formData.historia_medica || null,
    };
  };

  // --- Submit Handler for CREATE ---
  const handleCreateSubmit = (formData: PacienteFormValidationData) => {
    const apiData = transformFormDataForApi(formData);
    createPacienteMutation.mutate(apiData, {
      onSuccess: () => {
        navigate('/pacientes');
      },
    });
  };

  // --- Submit Handler for UPDATE ---
  const handleUpdateSubmit = (formData: PacienteFormValidationData) => {
    if (!patientId) return;
    const apiData = transformFormDataForApi(formData);
    console.log(`Submitting (Update ID: ${patientId}):`, apiData);
    updatePacienteMutation.mutate({ id: patientId, data: apiData }, {
      onSuccess: () => {
        navigate('/pacientes');
      },
    });
  };

  // --- Cancel Handler ---
  const handleCancel = () => {
    navigate('/pacientes'); // Navigate back to the list page
    // Or use navigate(-1) to go back one step in history, but '/pacientes' is more explicit
  };


  // --- Render Loading State (Edit Mode Only) ---
  if (isEditMode && isLoadingPaciente) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-6">Cargando Datos del Paciente...</h1>
        <div className="space-y-4 p-4 border rounded-md">
           <Skeleton className="h-8 w-1/3" />
           <Skeleton className="h-10 w-full" />
           <Skeleton className="h-8 w-1/3" />
           <Skeleton className="h-10 w-full" />
           <Skeleton className="h-8 w-1/3" />
           <Skeleton className="h-24 w-full" />
           <div className="flex justify-end">
             <Skeleton className="h-10 w-24" />
           </div>
        </div>
      </div>
    );
  }

  // --- Render Error State (Edit Mode Only) ---
   if (isEditMode && isErrorLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center text-red-600">
        <AlertCircle className="mx-auto h-12 w-12 mb-4" />
        <h1 className="text-xl font-semibold mb-2">Error al Cargar Paciente</h1>
        <p className="mb-4">No se pudieron cargar los datos del paciente ({patientId}).</p>
        <p className="text-sm text-muted-foreground mb-4">
          {loadingError instanceof Error ? loadingError.message : 'Error desconocido'}
        </p>
         <Button onClick={() => navigate('/pacientes')} variant="outline">
            Volver a la Lista
        </Button>
      </div>
    );
  }

  // --- Render Form ---
  if (isEditMode && !initialData) {
     return (
        <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Preparando formulario...</span>
        </div>
     );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Editar Paciente' : 'Crear Nuevo Paciente'}
      </h1>

      <PacienteForm
        key={patientId ?? 'create'}
        onSubmit={isEditMode ? handleUpdateSubmit : handleCreateSubmit}
        initialData={isEditMode ? initialData : undefined}
        isSubmitting={isSubmitting}
        submitButtonText={isEditMode ? 'Actualizar Paciente' : 'Crear Paciente'}
        onCancel={handleCancel} // <-- Pass the cancel handler here
      />
    </div>
  );
}