// src/pages/DoctoresListPage.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";

// --- Hooks & Types ---
import { useGetDoctores, useDeleteDoctor } from '@/hooks/useDoctores'; // Import Doctor hooks
import type { Doctor } from '@/types/doctor'; // Import Doctor type

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
  AlertCircle, Edit, Trash2, PlusCircle, Eye, Loader2,
  Stethoscope, User, Mail, Phone, Clock, BadgeInfo, Briefcase, // Adjusted icons
} from 'lucide-react'; // Use Stethoscope or Briefcase for specialty

// --- Helper Component for Displaying Values in Dialog ---
function DetailValue({ value, className = "" }: { value: string | number | null | undefined; className?: string }) {
  const displayValue = value === null || value === undefined || value === ''
    ? <span className="text-sm text-muted-foreground italic">N/A</span>
    : value;
  return <span className={cn("text-sm break-words", className)}>{displayValue}</span>;
}

// --- Main Page Component ---
export function DoctoresListPage() {
  // --- State ---
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  // --- Data Fetching ---
  const { data: doctores, isLoading, isError, error } = useGetDoctores();

  // --- Mutations ---
  const deleteDoctorMutation = useDeleteDoctor();

  // --- Event Handlers ---
  const handleViewDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDetailDialogOpen(true);
  };

  const handleDeleteClick = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (doctorToDelete) {
      deleteDoctorMutation.mutate(doctorToDelete.id_doctor, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setDoctorToDelete(null);
        },
        onError: () => {
          setIsDeleteDialogOpen(false);
          setDoctorToDelete(null);
        }
      });
    }
  };

  // --- Formatting Helpers ---
  // Keep formatDateTime if createdAt/updatedAt are available and displayed
   const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      // Assuming API returns ISO string like '2023-10-27T10:00:00.000Z'
      // Adjust parsing if the format is different
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch { return 'Fecha inválida'; }
  };

  // --- Rendering Logic for Table Body ---
  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={`skel-doc-${i}`}>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell> {/* Nombre Apellido */}
              <TableCell><Skeleton className="h-4 w-24" /></TableCell> {/* Especialidad */}
              <TableCell><Skeleton className="h-4 w-32" /></TableCell> {/* Correo */}
              <TableCell><Skeleton className="h-4 w-24" /></TableCell> {/* Telefono */}
              <TableCell><Skeleton className="h-4 w-[76px]" /></TableCell> {/* Acciones */}
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
                <span>Error al cargar los doctores: {error instanceof Error ? error.message : 'Error desconocido'}</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    if (!doctores || doctores.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
              No se encontraron doctores registrados.
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    // Render actual doctor data
    return (
      <TableBody>
        {doctores.map((doctor) => (
          <TableRow key={doctor.id_doctor}>
            <TableCell className="font-medium">{`${doctor.nombre} ${doctor.apellido}`}</TableCell>
            <TableCell>{doctor.especialidad}</TableCell>
            <TableCell>{doctor.correo_electronico || 'N/A'}</TableCell>
            <TableCell>{doctor.telefono || 'N/A'}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-1">
                {/* View Details Button */}
                <Button variant="ghost" size="icon" title="Ver Detalles" onClick={() => handleViewDetails(doctor)}>
                  <Eye className="h-4 w-4" />
                </Button>
                {/* Edit Button */}
                <Button variant="outline" size="icon" asChild title="Editar Doctor">
                  <Link to={`/doctores/editar/${doctor.id_doctor}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                {/* Delete Button */}
                <Button
                  variant="destructive"
                  size="icon"
                  title="Eliminar Doctor"
                  onClick={() => handleDeleteClick(doctor)}
                  disabled={deleteDoctorMutation.isPending && doctorToDelete?.id_doctor === doctor.id_doctor}
                >
                  {deleteDoctorMutation.isPending && doctorToDelete?.id_doctor === doctor.id_doctor ? (
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
        <h1 className="text-2xl font-bold">Gestión de Doctores</h1>
        <Button asChild>
          <Link to="/doctores/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Doctor
          </Link>
        </Button>
      </div>

      {/* Table Section */}
      <div className="border rounded-md">
        <Table>
          <TableCaption>Lista de doctores registrados en el sistema.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Especialidad</TableHead>
              <TableHead>Correo Electrónico</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="text-right w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          {/* Render table body based on state */}
          {renderTableBody()}
        </Table>
      </div>

      {/* --- Doctor Detail Dialog --- */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto"> {/* Adjusted width */}
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" /> {/* Doctor Icon */}
              Detalles del Doctor
            </DialogTitle>
            <DialogDescription>
              Información completa del doctor seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedDoctor && (
            <div className="py-4 space-y-6"> {/* Adjusted spacing */}
              {/* Personal & Professional Info Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2">Información Profesional</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex items-center gap-2"><BadgeInfo className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-28 text-muted-foreground flex-shrink-0">ID Doctor:</span><DetailValue value={selectedDoctor.id_doctor} /></div>
                  <div></div> {/* Spacer */}
                  <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-28 text-muted-foreground flex-shrink-0">Nombre:</span><DetailValue value={selectedDoctor.nombre} /></div>
                  <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-28 text-muted-foreground flex-shrink-0">Apellido:</span><DetailValue value={selectedDoctor.apellido} /></div>
                  <div className="flex items-center gap-2 sm:col-span-2"><Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-28 text-muted-foreground flex-shrink-0">Especialidad:</span><DetailValue value={selectedDoctor.especialidad} /></div>
                   <div className="flex items-center gap-2 sm:col-span-2"><Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-28 text-muted-foreground flex-shrink-0">Horario:</span><DetailValue value={selectedDoctor.horario_atencion} /></div>
                </div>
              </div>
              {/* Contact Info Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2 mt-2">Información de Contacto</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-28 text-muted-foreground flex-shrink-0">Email:</span><DetailValue value={selectedDoctor.correo_electronico} className='truncate max-w-[150px]' /></div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-28 text-muted-foreground flex-shrink-0">Teléfono:</span><DetailValue value={selectedDoctor.telefono} /></div>
                  {/* Add Dirección here if it becomes available in the API/Type */}
                  {/* <div className="flex items-start gap-2 sm:col-span-2"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" /><span className="text-sm font-medium w-28 text-muted-foreground flex-shrink-0">Dirección:</span><DetailValue value={selectedDoctor.direccion} /></div> */}
                </div>
              </div>

              {/* Metadata Section (Optional) */}
              {(selectedDoctor.createdAt || selectedDoctor.updatedAt) && (
                <div className="space-y-3">
                   <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2">Metadatos</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      {selectedDoctor.createdAt && <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-28 text-muted-foreground flex-shrink-0">Registrado:</span><DetailValue value={formatDateTime(selectedDoctor.createdAt)} /></div>}
                      {selectedDoctor.updatedAt && <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-28 text-muted-foreground flex-shrink-0">Actualizado:</span><DetailValue value={formatDateTime(selectedDoctor.updatedAt)} /></div>}
                   </div>
                </div>
              )}
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente al doctor
              <span className="font-semibold"> {doctorToDelete?.nombre} {doctorToDelete?.apellido} </span>
              y todos sus datos asociados del servidor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDoctorToDelete(null)}
              disabled={deleteDoctorMutation.isPending}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteDoctorMutation.isPending}
              // className="bg-destructive text-destructive-foreground hover:bg-destructive/90" // Optional: if default red isn't enough
            >
              {deleteDoctorMutation.isPending ? (
                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Eliminando... </>
              ) : ( 'Sí, eliminar doctor' )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div> // End main container div
  );
} // End DoctoresListPage component