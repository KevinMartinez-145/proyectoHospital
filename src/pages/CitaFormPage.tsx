// src/pages/CitaFormPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { parseISO, formatISO, isValid } from 'date-fns'; // Import date-fns functions
import { CitaForm } from '@/components/forms/CItaForm'; // Import the form
import {
  useCreateCita,
  useUpdateCita,
  useGetCitaById,
} from '@/hooks/useCitas'; // Import hooks
import type { CitaFormValidationData } from '@/schemas/citaSchema';
import type { CitaFormData as ApiCitaFormData } from '@/types/citas';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Helper to format Date to ISO string suitable for API (without timezone offset 'Z')
const formatDateTimeForAPI = (date: Date): string => {
    if (!isValid(date)) return ''; // Handle invalid date
    // formatISO typically includes 'Z' or offset, adjust if backend needs local time string
    // Example: "2024-08-15T10:30:00" (adjust format string as needed)
    // return format(date, "yyyy-MM-dd'T'HH:mm:ss");
    return formatISO(date); // Use standard ISO format first, adjust if needed
};


export function CitaFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const citaId = id ? parseInt(id, 10) : null;
  const isEditMode = citaId !== null;

  // --- Mutations ---
  const createCitaMutation = useCreateCita();
  const updateCitaMutation = useUpdateCita();

  // --- Query for fetching data in edit mode ---
  const {
    data: citaData,
    isLoading: isLoadingCita,
    isError: isErrorLoading,
    error: loadingError,
  } = useGetCitaById(citaId);

  // Combined loading/submitting state
  const isProcessing = createCitaMutation.isPending || updateCitaMutation.isPending;

  // State to hold formatted data for the form
  const [initialData, setInitialData] = useState<Partial<CitaFormValidationData> | undefined>(undefined);

  // Effect to process fetched data for the form
  useEffect(() => {
    if (isEditMode && citaData) {
      // Convert API string date back to Date object for the form
      const fechaHoraDate = citaData.fecha_hora ? parseISO(citaData.fecha_hora) : undefined;

      setInitialData({
        id_paciente: citaData.id_paciente,
        id_doctor: citaData.id_doctor,
        fecha_hora: isValid(fechaHoraDate) ? fechaHoraDate : undefined, // Use Date object or undefined
        motivo_cita: citaData.motivo_cita,
        notas_medicas: citaData.notas_medicas ?? '', // Use empty string for form
      });
    }
    if (!isEditMode) {
      setInitialData(undefined); // Clear for create mode
    }
  }, [isEditMode, citaData]);

  // Helper to transform form data (with Date object) to API format (with string date)
  const transformFormDataForApi = (formData: CitaFormValidationData): ApiCitaFormData => {
    return {
      ...formData,
      // Convert Date object back to ISO string for API
      fecha_hora: formatDateTimeForAPI(formData.fecha_hora),
      // Ensure optional fields are null or omitted if empty, based on API needs
      notas_medicas: formData.notas_medicas || null,
    };
  };

  // --- Submit Handler for CREATE ---
  const handleCreateSubmit = (formData: CitaFormValidationData) => {
    const apiData = transformFormDataForApi(formData);
    createCitaMutation.mutate(apiData, {
      onSuccess: () => navigate('/citas'), // Navigate to list on success
    });
  };

  // --- Submit Handler for UPDATE ---
  const handleUpdateSubmit = (formData: CitaFormValidationData) => {
    if (!citaId) return;
    const apiData = transformFormDataForApi(formData);
    updateCitaMutation.mutate({ id: citaId, data: apiData }, {
      onSuccess: () => navigate('/citas'), // Navigate to list on success
    });
  };

  // --- Cancel Handler ---
  const handleCancel = () => {
    navigate('/citas');
  };

  // --- Render Loading State (Edit Mode Only) ---
  if (isEditMode && isLoadingCita) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-6">Cargando Datos de la Cita...</h1>
        <div className="space-y-4 p-4 border rounded-md">
          <Skeleton className="h-8 w-1/3" /> {/* Paciente */}
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Doctor */}
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Fecha/Hora */}
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Motivo */}
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Notas */}
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
      <div className="max-w-2xl mx-auto text-center text-red-600">
        <AlertCircle className="mx-auto h-12 w-12 mb-4" />
        <h1 className="text-xl font-semibold mb-2">Error al Cargar Cita</h1>
        <p className="mb-4">No se pudieron cargar los datos de la cita ({citaId}).</p>
        <p className="text-sm text-muted-foreground mb-4">
          {loadingError instanceof Error ? loadingError.message : 'Error desconocido'}
        </p>
         <Button onClick={() => navigate('/citas')} variant="outline">
            Volver a la Lista
        </Button>
      </div>
    );
  }

  // Add check for preparing form state in edit mode
  if (isEditMode && !initialData && !isLoadingCita && !isErrorLoading) {
     return (
        <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Preparando formulario...</span>
        </div>
     );
  }

  // --- Render Form ---
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Editar Cita' : 'Programar Nueva Cita'}
      </h1>

      <CitaForm
        key={citaId ?? 'create'} // Force re-render on ID change
        onSubmit={isEditMode ? handleUpdateSubmit : handleCreateSubmit}
        initialData={isEditMode ? initialData : undefined}
        isSubmitting={isProcessing}
        submitButtonText={isEditMode ? 'Actualizar Cita' : 'Guardar Cita'}
        onCancel={handleCancel}
      />
    </div>
  );
}