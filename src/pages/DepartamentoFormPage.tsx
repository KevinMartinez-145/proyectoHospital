// src/pages/DepartamentoFormPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DepartamentoForm } from '@/components/forms/DepartamentoForm'; // Import the form
import {
  useCreateDepartamento,
  useUpdateDepartamento,
  useGetDepartamentoById,
} from '@/hooks/useDepartamentos'; // Import hooks
import type { DepartamentoFormValidationData } from '@/schemas/departamentoSchema';
import type { DepartamentoFormData as ApiDepartamentoFormData } from '@/types/departamentos';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DepartamentoFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const departamentoId = id ? parseInt(id, 10) : null;
  const isEditMode = departamentoId !== null;

  // --- Mutations ---
  const createDepartamentoMutation = useCreateDepartamento();
  const updateDepartamentoMutation = useUpdateDepartamento();

  // --- Query for fetching data in edit mode ---
  const {
    data: departamentoData,
    isLoading: isLoadingDepartamento,
    isError: isErrorLoading,
    error: loadingError,
  } = useGetDepartamentoById(departamentoId);

  // Combined loading/submitting state
  const isProcessing = createDepartamentoMutation.isPending || updateDepartamentoMutation.isPending;

  // State to hold formatted data for the form
  const [initialData, setInitialData] = useState<Partial<DepartamentoFormValidationData> | undefined>(undefined);

  // Effect to process fetched data for the form
  useEffect(() => {
    if (isEditMode && departamentoData) {
      setInitialData({
        nombre: departamentoData.nombre,
        descripcion: departamentoData.descripcion,
        jefe: departamentoData.jefe, // Directly use the number
      });
    }
    if (!isEditMode) {
      setInitialData(undefined); // Clear for create mode
    }
  }, [isEditMode, departamentoData]);

  // Helper to transform form data to API format (identical in this case)
  const transformFormDataForApi = (formData: DepartamentoFormValidationData): ApiDepartamentoFormData => {
    // Ensure jefe is a number before sending (Zod coerce helps, but double-check)
    return {
        ...formData,
        jefe: Number(formData.jefe) // Explicitly ensure it's a number
    };
  };

  // --- Submit Handler for CREATE ---
  const handleCreateSubmit = (formData: DepartamentoFormValidationData) => {
    const apiData = transformFormDataForApi(formData);
    console.log("Submitting (Create) Departamento Data:", apiData);
    createDepartamentoMutation.mutate(apiData, {
      onSuccess: () => navigate('/departamentos'), // Navigate to list on success
    });
  };

  // --- Submit Handler for UPDATE ---
  const handleUpdateSubmit = (formData: DepartamentoFormValidationData) => {
    if (!departamentoId) return;
    const apiData = transformFormDataForApi(formData);
    console.log(`Submitting (Update ID: ${departamentoId}) Departamento Data:`, apiData);
    updateDepartamentoMutation.mutate({ id: departamentoId, data: apiData }, {
      onSuccess: () => navigate('/departamentos'), // Navigate to list on success
    });
  };

  // --- Cancel Handler ---
  const handleCancel = () => {
    navigate('/departamentos');
  };

  // --- Render Loading State (Edit Mode Only) ---
  if (isEditMode && isLoadingDepartamento) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-6">Cargando Datos del Departamento...</h1>
        <div className="space-y-4 p-4 border rounded-md">
          <Skeleton className="h-8 w-1/3" /> {/* Nombre */}
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Descripcion */}
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Jefe ID */}
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
        <h1 className="text-xl font-semibold mb-2">Error al Cargar Departamento</h1>
        <p className="mb-4">No se pudieron cargar los datos del departamento ({departamentoId}).</p>
        <p className="text-sm text-muted-foreground mb-4">
          {loadingError instanceof Error ? loadingError.message : 'Error desconocido'}
        </p>
         <Button onClick={() => navigate('/departamentos')} variant="outline">
            Volver a la Lista
        </Button>
      </div>
    );
  }

  // Add check for preparing form state in edit mode
  if (isEditMode && !initialData && !isLoadingDepartamento && !isErrorLoading) {
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
        {isEditMode ? 'Editar Departamento' : 'Crear Nuevo Departamento'}
      </h1>

      <DepartamentoForm
        key={departamentoId ?? 'create'} // Force re-render on ID change
        onSubmit={isEditMode ? handleUpdateSubmit : handleCreateSubmit}
        initialData={isEditMode ? initialData : undefined}
        isSubmitting={isProcessing}
        submitButtonText={isEditMode ? 'Actualizar Departamento' : 'Guardar Departamento'}
        onCancel={handleCancel}
      />
    </div>
  );
}