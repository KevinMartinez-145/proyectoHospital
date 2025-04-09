// src/pages/EnfermeraFormPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EnfermeraForm } from '@/components/forms/EnfermeraForm';
import {
  useCreateEnfermera,
  useUpdateEnfermera,
  useGetEnfermeraById,
} from '@/hooks/useEnfermeras';
import type { EnfermeraFormValidationData } from '@/schemas/enfermeraSchema';
import type { EnfermeraFormData as ApiEnfermeraFormData } from '@/types/enfermera'; // Use updated type
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EnfermeraFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const enfermeraId = id ? parseInt(id, 10) : null;
  const isEditMode = enfermeraId !== null;

  // --- Mutations ---
  const createEnfermeraMutation = useCreateEnfermera();
  const updateEnfermeraMutation = useUpdateEnfermera();

  // --- Query ---
  const {
    data: enfermeraData,
    isLoading: isLoadingEnfermera,
    isError: isErrorLoading,
    error: loadingError,
  } = useGetEnfermeraById(enfermeraId);

  const isProcessing = createEnfermeraMutation.isPending || updateEnfermeraMutation.isPending;

  const [initialData, setInitialData] = useState<Partial<EnfermeraFormValidationData> | undefined>(undefined);

  useEffect(() => {
    if (isEditMode && enfermeraData) {
      setInitialData({
        nombre: enfermeraData.nombre,
        apellido: enfermeraData.apellido,
        telefono: enfermeraData.telefono,
        correo_electronico: enfermeraData.correo_electronico,
      });
    }
    if (!isEditMode) {
      setInitialData(undefined);
    }
  }, [isEditMode, enfermeraData]);

  // Transform form data to API format (currently identical for base fields)
  const transformFormDataForApi = (formData: EnfermeraFormValidationData): Omit<ApiEnfermeraFormData, 'usuario_id'> => {
    // Return only the fields present in the form validation schema
    return {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        correo_electronico: formData.correo_electronico,
    };
  };

  // --- Submit Handler for CREATE ---
  const handleCreateSubmit = (formData: EnfermeraFormValidationData) => {
    // Transform the base form data
    const baseApiData = transformFormDataForApi(formData);
    // Add the hardcoded usuario_id specifically for creation
    const apiData: ApiEnfermeraFormData = {
        ...baseApiData,
        usuario_id: 1 // <-- ADDED HARDCODED ID FOR CREATE
    };
    console.log("Submitting (Create) Enfermera Data:", apiData);
    createEnfermeraMutation.mutate(apiData, {
      onSuccess: () => navigate('/enfermeras'),
    });
  };

  // --- Submit Handler for UPDATE ---
  const handleUpdateSubmit = (formData: EnfermeraFormValidationData) => {
    if (!enfermeraId) return;
    // For update, only send the fields from the form (no usuario_id)
    const apiData = transformFormDataForApi(formData);
    console.log(`Submitting (Update ID: ${enfermeraId}) Enfermera Data:`, apiData);
    // The update service expects Partial<EnfermeraFormData>, so apiData fits
    updateEnfermeraMutation.mutate({ id: enfermeraId, data: apiData }, {
      onSuccess: () => navigate('/enfermeras'),
    });
  };

  // --- Cancel Handler ---
  const handleCancel = () => {
    navigate('/enfermeras');
  };

  // --- Loading / Error Rendering (remains the same) ---
  if (isEditMode && isLoadingEnfermera) {
    // ... skeleton ...
     return (
      <div className="max-w-2xl mx-auto space-y-6"> {/* Adjusted width */}
        <h1 className="text-2xl font-bold mb-6">Cargando Datos de la Enfermera...</h1>
        <div className="space-y-4 p-4 border rounded-md">
          <Skeleton className="h-8 w-1/3" /> {/* Nombre */}
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Apellido */}
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Telefono */}
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Correo */}
          <Skeleton className="h-10 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    );
  }

   if (isEditMode && isErrorLoading) {
    // ... error display ...
     return (
      <div className="max-w-2xl mx-auto text-center text-red-600">
        <AlertCircle className="mx-auto h-12 w-12 mb-4" />
        <h1 className="text-xl font-semibold mb-2">Error al Cargar Enfermera</h1>
        <p className="mb-4">No se pudieron cargar los datos de la enfermera ({enfermeraId}).</p>
        <p className="text-sm text-muted-foreground mb-4">
          {loadingError instanceof Error ? loadingError.message : 'Error desconocido'}
        </p>
         <Button onClick={() => navigate('/enfermeras')} variant="outline">
            Volver a la Lista
        </Button>
      </div>
    );
  }

  if (isEditMode && !initialData && !isLoadingEnfermera && !isErrorLoading) {
    // ... preparing form ...
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
        {isEditMode ? 'Editar Enfermera' : 'Crear Nueva Enfermera'}
      </h1>

      <EnfermeraForm
        key={enfermeraId ?? 'create'}
        onSubmit={isEditMode ? handleUpdateSubmit : handleCreateSubmit}
        initialData={isEditMode ? initialData : undefined}
        isSubmitting={isProcessing}
        submitButtonText={isEditMode ? 'Actualizar Enfermera' : 'Crear Enfermera'}
        onCancel={handleCancel}
      />
    </div>
  );
}