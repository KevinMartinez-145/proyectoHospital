// src/pages/MedicamentoFormPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MedicamentoForm } from '@/components/forms/MedicamentoForm'; // Import the form
import {
  useCreateMedicamento,
  useUpdateMedicamento,
  useGetMedicamentoById,
} from '@/hooks/useMedicamentos'; // Import hooks
import type { MedicamentoFormValidationData } from '@/schemas/medicamentoSchema';
import type { MedicamentoFormData as ApiMedicamentoFormData } from '@/types/medicamento';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MedicamentoFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const medicamentoId = id ? parseInt(id, 10) : null;
  const isEditMode = medicamentoId !== null;

  // --- Mutations ---
  const createMedicamentoMutation = useCreateMedicamento();
  const updateMedicamentoMutation = useUpdateMedicamento();

  // --- Query for fetching data in edit mode ---
  const {
    data: medicamentoData,
    isLoading: isLoadingMedicamento,
    isError: isErrorLoading,
    error: loadingError,
  } = useGetMedicamentoById(medicamentoId);

  // Combined loading/submitting state
  const isProcessing = createMedicamentoMutation.isPending || updateMedicamentoMutation.isPending;

  // State to hold formatted data for the form
  const [initialData, setInitialData] = useState<Partial<MedicamentoFormValidationData> | undefined>(undefined);

  // Effect to process fetched data for the form
  useEffect(() => {
    if (isEditMode && medicamentoData) {
      setInitialData({
        nombre: medicamentoData.nombre,
        descripcion: medicamentoData.descripcion,
        dosis: medicamentoData.dosis,
        frecuencia: medicamentoData.frecuencia,
        id_tratamiento: medicamentoData.id_tratamiento,
      });
    }
    if (!isEditMode) {
      setInitialData(undefined); // Clear for create mode
    }
  }, [isEditMode, medicamentoData]);

  // Helper to transform form data to API format (identical in this case)
  const transformFormDataForApi = (formData: MedicamentoFormValidationData): ApiMedicamentoFormData => {
    return formData;
  };

  // --- Submit Handler for CREATE ---
  const handleCreateSubmit = (formData: MedicamentoFormValidationData) => {
    const apiData = transformFormDataForApi(formData);
    console.log("Submitting (Create) Medicamento Data:", apiData);
    createMedicamentoMutation.mutate(apiData, {
      onSuccess: () => navigate('/medicamentos'), // Navigate to list on success
    });
  };

  // --- Submit Handler for UPDATE ---
  const handleUpdateSubmit = (formData: MedicamentoFormValidationData) => {
    if (!medicamentoId) return;
    const apiData = transformFormDataForApi(formData);
    console.log(`Submitting (Update ID: ${medicamentoId}) Medicamento Data:`, apiData);
    updateMedicamentoMutation.mutate({ id: medicamentoId, data: apiData }, {
      onSuccess: () => navigate('/medicamentos'), // Navigate to list on success
    });
  };

  // --- Cancel Handler ---
  const handleCancel = () => {
    navigate('/medicamentos');
  };

  // --- Render Loading State (Edit Mode Only) ---
  if (isEditMode && isLoadingMedicamento) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-6">Cargando Datos del Medicamento...</h1>
        <div className="space-y-4 p-4 border rounded-md">
          <Skeleton className="h-8 w-1/3" /> {/* Tratamiento */}
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Nombre */}
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Descripcion */}
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Dosis */}
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-1/3" /> {/* Frecuencia */}
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
        <h1 className="text-xl font-semibold mb-2">Error al Cargar Medicamento</h1>
        <p className="mb-4">No se pudieron cargar los datos del medicamento ({medicamentoId}).</p>
        <p className="text-sm text-muted-foreground mb-4">
          {loadingError instanceof Error ? loadingError.message : 'Error desconocido'}
        </p>
         <Button onClick={() => navigate('/medicamentos')} variant="outline">
            Volver a la Lista
        </Button>
      </div>
    );
  }

  // Add check for preparing form state in edit mode
  if (isEditMode && !initialData && !isLoadingMedicamento && !isErrorLoading) {
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
        {isEditMode ? 'Editar Medicamento' : 'Registrar Nuevo Medicamento'}
      </h1>

      <MedicamentoForm
        key={medicamentoId ?? 'create'} // Force re-render on ID change
        onSubmit={isEditMode ? handleUpdateSubmit : handleCreateSubmit}
        initialData={isEditMode ? initialData : undefined}
        isSubmitting={isProcessing}
        submitButtonText={isEditMode ? 'Actualizar Medicamento' : 'Guardar Medicamento'}
        onCancel={handleCancel}
      />
    </div>
  );
}