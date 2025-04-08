import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DoctorForm } from '@/components/forms/DoctorForm';
import {
  useCreateDoctor,
  useUpdateDoctor,
  useGetDoctorById,
} from '@/hooks/useDoctores';
import type { DoctorFormValidationData } from '@/schemas/doctorSchema';
import type { DoctorFormData as ApiDoctorFormData } from '@/types/doctor';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DoctorFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const doctorId = id ? parseInt(id, 10) : null;
  const isEditMode = doctorId !== null;

  // --- Mutaciones ---
  const createDoctorMutation = useCreateDoctor();
  const updateDoctorMutation = useUpdateDoctor();

  // --- Consulta para obtener doctor ---
  const {
    data: doctorData,
    isLoading: isLoadingDoctor,
    isError: isErrorLoading,
    error: loadingError,
  } = useGetDoctorById(doctorId);

  const isSubmitting = createDoctorMutation.isPending || updateDoctorMutation.isPending;

  const [initialData, setInitialData] = useState<Partial<DoctorFormValidationData> | undefined>(undefined);

  useEffect(() => {
    if (isEditMode && doctorData) {
      setInitialData({
        nombre: doctorData.nombre,
        apellido: doctorData.apellido,
        especialidad: doctorData.especialidad,
        telefono: doctorData.telefono ?? '',
        correo_electronico: doctorData.correo_electronico ?? '',
      });
    }
    if (!isEditMode) {
      setInitialData(undefined);
    }
  }, [isEditMode, doctorData]);

  const transformFormDataForApi = (formData: DoctorFormValidationData): ApiDoctorFormData => ({
    ...formData,
    correo_electronico: formData.correo_electronico || null,
    telefono: formData.telefono || null,
  });

  const handleCreateSubmit = (formData: DoctorFormValidationData) => {
    const apiData = transformFormDataForApi(formData);
    createDoctorMutation.mutate(apiData, {
      onSuccess: () => navigate('/doctores'),
    });
  };

  const handleUpdateSubmit = (formData: DoctorFormValidationData) => {
    if (!doctorId) return;
    const apiData = transformFormDataForApi(formData);
    updateDoctorMutation.mutate({ id: doctorId, data: apiData }, {
      onSuccess: () => navigate('/doctores'),
    });
  };

  const handleCancel = () => {
    navigate('/doctores');
  };

  if (isEditMode && isLoadingDoctor) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-6">Cargando Datos del Doctor...</h1>
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

  if (isEditMode && isErrorLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center text-red-600">
        <AlertCircle className="mx-auto h-12 w-12 mb-4" />
        <h1 className="text-xl font-semibold mb-2">Error al Cargar Doctor</h1>
        <p className="mb-4">No se pudieron cargar los datos del doctor ({doctorId}).</p>
        <p className="text-sm text-muted-foreground mb-4">
          {loadingError instanceof Error ? loadingError.message : 'Error desconocido'}
        </p>
        <Button onClick={() => navigate('/doctores')} variant="outline">
          Volver a la Lista
        </Button>
      </div>
    );
  }

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
        {isEditMode ? 'Editar Doctor' : 'Crear Nuevo Doctor'}
      </h1>

      <DoctorForm
        key={doctorId ?? 'create'}
        onSubmit={isEditMode ? handleUpdateSubmit : handleCreateSubmit}
        initialData={isEditMode ? initialData : undefined}
        isSubmitting={isSubmitting}
        submitButtonText={isEditMode ? 'Actualizar Doctor' : 'Crear Doctor'}
        onCancel={handleCancel}
      />
    </div>
  );
}

