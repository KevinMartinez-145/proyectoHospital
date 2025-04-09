// src/pages/TratamientoFormPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { parse, format, isValid } from 'date-fns'; // Import date-fns functions
import { TratamientoForm } from '@/components/forms/TratamientoForm'; // Import the form
import {
  useCreateTratamiento,
  useUpdateTratamiento,
  useGetTratamientoById,
} from '@/hooks/useTratamientos'; // Import hooks
import type { TratamientoFormValidationData } from '@/schemas/tratamientoSchema';
import type { TratamientoFormData as ApiTratamientoFormData } from '@/types/tratamiento';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Helper to format Date to YYYY-MM-DD string for API
const formatDateForAPI = (date: Date | undefined): string => {
    if (!date || !isValid(date)) return ''; // Handle invalid or undefined date
    return format(date, 'yyyy-MM-dd');
};

// Helper to parse YYYY-MM-DD string from API to Date object
const parseDateFromAPI = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    // Use parse with the expected format string
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    return isValid(date) ? date : undefined;
};


export function TratamientoFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const tratamientoId = id ? parseInt(id, 10) : null;
  const isEditMode = tratamientoId !== null;

  // --- Mutations ---
  const createTratamientoMutation = useCreateTratamiento();
  const updateTratamientoMutation = useUpdateTratamiento();

  // --- Query for fetching data in edit mode ---
  const {
    data: tratamientoData,
    isLoading: isLoadingTratamiento,
    isError: isErrorLoading,
    error: loadingError,
  } = useGetTratamientoById(tratamientoId);

  // Combined loading/submitting state
  const isProcessing = createTratamientoMutation.isPending || updateTratamientoMutation.isPending;

  // State to hold formatted data for the form
  const [initialData, setInitialData] = useState<Partial<TratamientoFormValidationData> | undefined>(undefined);

  // Effect to process fetched data for the form
  useEffect(() => {
    if (isEditMode && tratamientoData) {
      // Convert API string dates back to Date objects for the form
      setInitialData({
        id_paciente: tratamientoData.id_paciente,
        id_doctor: tratamientoData.id_doctor,
        descripcion: tratamientoData.descripcion,
        fecha_inicio: parseDateFromAPI(tratamientoData.fecha_inicio),
        fecha_fin: parseDateFromAPI(tratamientoData.fecha_fin),
      });
    }
    if (!isEditMode) {
      setInitialData(undefined); // Clear for create mode
    }
  }, [isEditMode, tratamientoData]);

  // Helper to transform form data (with Date objects) to API format (with YYYY-MM-DD strings)
  const transformFormDataForApi = (formData: TratamientoFormValidationData): ApiTratamientoFormData => {
    return {
      id_paciente: formData.id_paciente,
      id_doctor: formData.id_doctor,
      descripcion: formData.descripcion,
      fecha_inicio: formatDateForAPI(formData.fecha_inicio),
      fecha_fin: formatDateForAPI(formData.fecha_fin),
    };
  };

  // --- Submit Handler for CREATE ---
  const handleCreateSubmit = (formData: TratamientoFormValidationData) => {
    const apiData = transformFormDataForApi(formData);
    createTratamientoMutation.mutate(apiData, {
      onSuccess: () => navigate('/tratamientos'), // Navigate to list on success
    });
  };

  // --- Submit Handler for UPDATE ---
  const handleUpdateSubmit = (formData: TratamientoFormValidationData) => {
    if (!tratamientoId) return;
    const apiData = transformFormDataForApi(formData);
    updateTratamientoMutation.mutate({ id: tratamientoId, data: apiData }, {
      onSuccess: () => navigate('/tratamientos'), // Navigate to list on success
    });
  };

  // --- Cancel Handler ---
  const handleCancel = () => {
    navigate('/tratamientos');
  };

  // --- Render Loading State (Edit Mode Only) ---
  if (isEditMode && isLoadingTratamiento) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-6">Cargando Datos del Tratamiento...</h1>
        <div className="space-y-4 p-4 border rounded-md">
          <Skeleton className="h-8 w-1/3" /> {/* Paciente */}
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Doctor */}
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Descripcion */}
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Fecha Inicio */}
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Fecha Fin */}
          <Skeleton className="h-10 w-full" />
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
        <h1 className="text-xl font-semibold mb-2">Error al Cargar Tratamiento</h1>
        <p className="mb-4">No se pudieron cargar los datos del tratamiento ({tratamientoId}).</p>
        <p className="text-sm text-muted-foreground mb-4">
          {loadingError instanceof Error ? loadingError.message : 'Error desconocido'}
        </p>
         <Button onClick={() => navigate('/tratamientos')} variant="outline">
            Volver a la Lista
        </Button>
      </div>
    );
  }

  // Add check for preparing form state in edit mode
  if (isEditMode && !initialData && !isLoadingTratamiento && !isErrorLoading) {
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
        {isEditMode ? 'Editar Tratamiento' : 'Registrar Nuevo Tratamiento'}
      </h1>

      <TratamientoForm
        key={tratamientoId ?? 'create'} // Force re-render on ID change
        onSubmit={isEditMode ? handleUpdateSubmit : handleCreateSubmit}
        initialData={isEditMode ? initialData : undefined}
        isSubmitting={isProcessing}
        submitButtonText={isEditMode ? 'Actualizar Tratamiento' : 'Guardar Tratamiento'}
        onCancel={handleCancel}
      />
    </div>
  );
}