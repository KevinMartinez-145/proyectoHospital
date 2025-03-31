// src/pages/PacienteFormPage.tsx
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns'; // For formatting date before sending
import { PacienteForm } from '@/components/forms/PacienteForm'; // Adjust path
import { useCreatePaciente } from '@/hooks/usePacientes'; // Adjust path
import type { PacienteFormValidationData } from '@/schemas/pacienteSchema'; // Adjust path
import type { PacienteFormData as ApiPacienteFormData } from '@/types/paciente'; // API type

export function PacienteFormPage() {
  const navigate = useNavigate();
  const createPacienteMutation = useCreatePaciente();

  // --- Submit Handler ---
  const handleCreateSubmit = (formData: PacienteFormValidationData) => {
    console.log("Form data validated:", formData);

    // --- Data Transformation (IMPORTANT) ---
    // Convert Date object to 'YYYY-MM-DD' string expected by the API
    const apiData: ApiPacienteFormData = {
      ...formData,
      // Ensure fecha_nacimiento is formatted correctly if it exists
      fecha_nacimiento: formData.fecha_nacimiento
        ? format(formData.fecha_nacimiento, 'yyyy-MM-dd')
        : '', // Or handle error/validation if date is required but missing
      // Ensure optional fields that are empty strings become null if API expects null
      correo_electronico: formData.correo_electronico || null,
      telefono: formData.telefono || null,
      direccion: formData.direccion || null,
      historia_medica: formData.historia_medica || null,
    };

    console.log("Data being sent to API:", apiData);

    // Call the mutation hook's mutate function
    createPacienteMutation.mutate(apiData, {
      onSuccess: () => {
        // Navigate back to the list page on successful creation
        navigate('/pacientes');
        // Toast is handled within the hook's onSuccess
      },
      // onError is handled within the hook
    });
  };

  // --- Render ---
  return (
    <div className="max-w-4xl mx-auto"> {/* Limit form width */}
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Paciente</h1>
      <PacienteForm
        onSubmit={handleCreateSubmit}
        isSubmitting={createPacienteMutation.isPending} // Use isPending (v5)
        submitButtonText="Crear Paciente"
      />
    </div>
  );
}