// src/pages/PacientesListPage.tsx

import { useState } from 'react'; // Import React and useState
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils"; // Import cn utility

// --- Hooks & Types ---
// Adjust import paths based on your actual project structure
import { useGetPacientes, useDeletePaciente } from '@/hooks/usePacientes'; // Import BOTH hooks
import type { Paciente } from '@/types/paciente';

// --- Shadcn UI Components ---
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Import AlertDialog Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


// --- Icons ---
import {
  AlertCircle, Edit, Trash2, PlusCircle, Eye, Loader2, // Added Loader2
  User, Cake, Mail, Phone, MapPin, FileText, Clock, BadgeInfo
} from 'lucide-react';

// --- Helper Component for Displaying Values in Dialog ---
function DetailValue({ value, className = "" }: { value: string | number | null | undefined; className?: string }) {
  const displayValue = value === null || value === undefined || value === ''
    ? <span className="text-sm text-muted-foreground italic">N/A</span>
    : value;
  return <span className={cn("text-sm break-words", className)}>{displayValue}</span>;
}


// --- Main Page Component ---
export function PacientesListPage() {
  // --- State ---
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Paciente | null>(null);
  // State for Delete Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Paciente | null>(null);

  // --- Data Fetching ---
  const { data: pacientes, isLoading, isError, error,} = useGetPacientes(); // Added refetch if needed later

  // --- Mutations ---
  const deletePacienteMutation = useDeletePaciente(); // Instantiate the delete hook

  // --- Event Handlers ---
  const handleViewDetails = (paciente: Paciente) => {
    setSelectedPatient(paciente);
    setIsDetailDialogOpen(true);
  };

  // Handler to open delete confirmation dialog
  const handleDeleteClick = (paciente: Paciente) => {
    setPatientToDelete(paciente);
    setIsDeleteDialogOpen(true);
  };

  // Handler to confirm and execute deletion
  const handleConfirmDelete = () => {
    if (patientToDelete) {
      deletePacienteMutation.mutate(patientToDelete.id_paciente, {
        // Using callbacks here ensures dialog closes AFTER mutation settles
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setPatientToDelete(null);
          // Toast is handled within the hook's onSuccess
          // Invalidation is also handled in the hook
        },
        onError: () => {
          // Decide if dialog should close on error
          setIsDeleteDialogOpen(false);
          setPatientToDelete(null);
          // Toast is handled within the hook's onError
        }
      });
    }
  };


  // --- Formatting Helpers ---
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch { return 'Fecha inválida'; }
  };

  const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch { return 'Fecha inválida'; }
  };

  // --- Rendering Logic for Table Body ---
  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={`skel-${i}`}>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[76px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }

    if (isError) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center text-red-600">
              <div className="flex items-center justify-center gap-2 py-4">
                <AlertCircle className="h-5 w-5" />
                <span>Error al cargar los pacientes: {error instanceof Error ? error.message : 'Error desconocido'}</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    if (!pacientes || pacientes.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
              No se encontraron pacientes registrados.
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    // Render actual patient data
    return (
      <TableBody>
        {pacientes.map((paciente) => (
          <TableRow key={paciente.id_paciente}>
            <TableCell className="font-medium">{`${paciente.nombre} ${paciente.apellido}`}</TableCell>
            <TableCell>{paciente.correo_electronico || 'N/A'}</TableCell>
            <TableCell>{formatDate(paciente.fecha_nacimiento)}</TableCell>
            <TableCell>{paciente.telefono || 'N/A'}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-1">
                {/* View Details Button */}
                <Button variant="ghost" size="icon" title="Ver Detalles" onClick={() => handleViewDetails(paciente)}>
                  <Eye className="h-4 w-4" />
                </Button>
                {/* Edit Button */}
                <Button variant="outline" size="icon" asChild title="Editar Paciente">
                  <Link to={`/pacientes/editar/${paciente.id_paciente}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                {/* Delete Button - Updated */}
                <Button
                  variant="destructive"
                  size="icon"
                  title="Eliminar Paciente"
                  onClick={() => handleDeleteClick(paciente)} // Open confirmation dialog
                  // Disable button only if this specific patient is being deleted
                  disabled={deletePacienteMutation.isPending && patientToDelete?.id_paciente === paciente.id_paciente}
                >
                  {/* Show spinner only for the specific row being deleted */}
                  {deletePacienteMutation.isPending && patientToDelete?.id_paciente === paciente.id_paciente ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                     <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }; // End renderTableBody

  // --- Component Return JSX ---
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Pacientes</h1>
        <Button asChild>
          <Link to="/pacientes/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Paciente
          </Link>
        </Button>
      </div>

      {/* Table Section */}
      <div className="border rounded-md">
        <Table>
          <TableCaption>Lista de pacientes registrados en el sistema.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Correo Electrónico</TableHead>
              <TableHead>Fecha Nacimiento</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="text-right w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          {/* Render table body based on state */}
          {renderTableBody()}
        </Table>
      </div>

      {/* --- Patient Detail Dialog --- */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Detalles del Paciente
            </DialogTitle>
            <DialogDescription>
              Información completa del paciente seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="py-4 space-y-8">
              {/* Personal Info Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2">Información Personal</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex items-center gap-2"><BadgeInfo className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-32 text-muted-foreground flex-shrink-0">ID Paciente:</span><DetailValue value={selectedPatient.id_paciente} /></div>
                  <div></div>
                  <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-32 text-muted-foreground flex-shrink-0">Nombre:</span><DetailValue value={selectedPatient.nombre} /></div>
                  <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-32 text-muted-foreground flex-shrink-0">Apellido:</span><DetailValue value={selectedPatient.apellido} /></div>
                  <div className="flex items-center gap-2"><Cake className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-32 text-muted-foreground flex-shrink-0">Fec. Nacimiento:</span><DetailValue value={formatDate(selectedPatient.fecha_nacimiento)} /></div>
                </div>
              </div>
              {/* Contact Info Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2 mt-2">Información de Contacto</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-32 text-muted-foreground flex-shrink-0">Email:</span><DetailValue value={selectedPatient.correo_electronico} className='truncate max-w-[200px]' /></div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-32 text-muted-foreground flex-shrink-0">Teléfono:</span><DetailValue value={selectedPatient.telefono} /></div>
                  <div className="flex items-start gap-2 sm:col-span-2"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" /><span className="text-sm font-medium w-32 text-muted-foreground flex-shrink-0">Dirección:</span><DetailValue value={selectedPatient.direccion} /></div>
                </div>
              </div>
              {/* Medical Info Section */}
              <div className="space-y-2">
                 <div className="flex items-center gap-2 border-b pb-1 mb-2"><FileText className="h-4 w-4 text-primary" /><h4 className="text-sm font-semibold text-primary">Historia Médica</h4></div>
                 <div className="p-3 border rounded bg-muted/40 min-h-[80px] whitespace-pre-wrap"><DetailValue value={selectedPatient.historia_medica} className="text-sm" /></div>
              </div>
              {/* Metadata Section */}
              <div className="space-y-3">
                 <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2">Metadatos</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-32 text-muted-foreground flex-shrink-0">Registrado:</span><DetailValue value={formatDateTime(selectedPatient.createdAt)} /></div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-32 text-muted-foreground flex-shrink-0">Actualizado:</span><DetailValue value={formatDateTime(selectedPatient.updatedAt)} /></div>
                 </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}> Cerrar </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Delete Confirmation Dialog --- */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al paciente
              <span className="font-semibold"> {patientToDelete?.nombre} {patientToDelete?.apellido} </span>
              y todos sus datos asociados del servidor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setPatientToDelete(null)}
              disabled={deletePacienteMutation.isPending}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deletePacienteMutation.isPending}
              // Optional: Add destructive styling if default isn't red enough
              // className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePacienteMutation.isPending ? (
                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Eliminando... </>
              ) : ( 'Sí, eliminar paciente' )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div> // End main container div
  );
} // End PacientesListPage component