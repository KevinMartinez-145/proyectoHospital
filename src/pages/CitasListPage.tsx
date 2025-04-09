// src/pages/CitasListPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";

// --- Hooks & Types ---
import { useGetCitas, useDeleteCita } from '@/hooks/useCitas'; // Import hooks
import type { Cita } from '@/types/citas'; // Import type

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
  AlertCircle, Edit, Trash2, PlusCircle, Eye, Loader2, Briefcase,
  User, Stethoscope, CalendarDays, Clock, BadgeInfo, MessageSquare // Added icons
} from 'lucide-react';

// --- Helper Component (can reuse) ---
function DetailValue({ value, className = "" }: { value: string | number | null | undefined; className?: string }) {
  const displayValue = value === null || value === undefined || value === ''
    ? <span className="text-sm text-muted-foreground italic">N/A</span>
    : value;
  return <span className={cn("text-sm break-words", className)}>{displayValue}</span>;
}

// --- Main Page Component ---
export function CitasListPage() {
  // --- State ---
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState<Cita | null>(null);

  // --- Data Fetching ---
  const { data: citas, isLoading, isError, error } = useGetCitas();

  // --- Mutations ---
  const deleteCitaMutation = useDeleteCita();

  // --- Event Handlers ---
  const handleViewDetails = (cita: Cita) => {
    setSelectedCita(cita);
    setIsDetailDialogOpen(true);
  };

  const handleDeleteClick = (cita: Cita) => {
    setCitaToDelete(cita);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (citaToDelete) {
      deleteCitaMutation.mutate(citaToDelete.id_cita, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setCitaToDelete(null);
        },
        onError: () => {
          setIsDeleteDialogOpen(false);
          setCitaToDelete(null);
        }
      });
    }
  };

  // --- Formatting Helpers ---
   const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
    } catch { return 'Fecha inválida'; }
  };
   const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      return format(date, 'PPP', { locale: es }); // Format like "15 de ago. de 2024"
    } catch { return 'Fecha inválida'; }
  };
   const formatTime = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      return format(date, 'HH:mm', { locale: es }); // Format like "16:30"
    } catch { return 'Hora inválida'; }
  };


  // --- Component Return JSX ---
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Citas Médicas</h1>
        <Button asChild>
          <Link to="/citas/nueva"> {/* Corrected link */}
            <PlusCircle className="mr-2 h-4 w-4" /> Nueva Cita
          </Link>
        </Button>
      </div>

      {/* Table Section */}
      <div className="border rounded-md">
        <Table>
          <TableCaption>Lista de citas médicas programadas.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead className="text-right w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          {/* Table Body Logic */}
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={`skel-cita-${i}`}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[76px]" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-red-600">
                  <div className="flex items-center justify-center gap-2 py-4">
                    <AlertCircle className="h-5 w-5" />
                    <span>Error al cargar las citas: {error instanceof Error ? error.message : 'Error desconocido'}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : !citas || citas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                  No se encontraron citas programadas.
                </TableCell>
              </TableRow>
            ) : (
              citas.map((cita) => (
                <TableRow key={cita.id_cita}>
                  <TableCell>{formatDate(cita.fecha_hora)}</TableCell>
                  <TableCell>{formatTime(cita.fecha_hora)}</TableCell>
                  <TableCell className="font-medium">{`${cita.Paciente.nombre} ${cita.Paciente.apellido}`}</TableCell>
                  <TableCell>{`${cita.Doctor.nombre} ${cita.Doctor.apellido}`}</TableCell>
                  <TableCell className="truncate max-w-[200px]">{cita.motivo_cita}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      {/* View Details Button */}
                      <Button variant="ghost" size="icon" title="Ver Detalles" onClick={() => handleViewDetails(cita)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {/* Edit Button */}
                      <Button variant="outline" size="icon" asChild title="Editar Cita">
                        <Link to={`/citas/editar/${cita.id_cita}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="icon"
                        title="Eliminar Cita"
                        onClick={() => handleDeleteClick(cita)}
                        disabled={deleteCitaMutation.isPending && citaToDelete?.id_cita === cita.id_cita}
                      >
                        {deleteCitaMutation.isPending && citaToDelete?.id_cita === cita.id_cita ? (
                           <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                           <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Cita Detail Dialog --- */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg"> {/* Adjusted width */}
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" /> {/* Icon */}
              Detalles de la Cita
            </DialogTitle>
             {selectedCita && <DialogDescription>
              Cita programada para el {formatDateTime(selectedCita.fecha_hora)}.
            </DialogDescription>}
          </DialogHeader>
          {selectedCita && (
            <div className="py-4 space-y-6"> {/* Adjusted spacing */}
              {/* Cita Info */}
               <div className="space-y-2">
                 <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2">Información de la Cita</h4>
                 <div className="flex items-center gap-2"><BadgeInfo className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">ID Cita:</span><DetailValue value={selectedCita.id_cita} /></div>
                 <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Fecha/Hora:</span><DetailValue value={formatDateTime(selectedCita.fecha_hora)} /></div>
                 <div className="flex items-start gap-2"><MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Motivo:</span><DetailValue value={selectedCita.motivo_cita} /></div>
              </div>
               {/* Paciente Info */}
               <div className="space-y-2">
                 <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2">Paciente</h4>
                 <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Nombre:</span><DetailValue value={`${selectedCita.Paciente.nombre} ${selectedCita.Paciente.apellido}`} /></div>
                 <div className="flex items-center gap-2"><BadgeInfo className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">ID Paciente:</span><DetailValue value={selectedCita.Paciente.id_paciente} /></div>
              </div>
               {/* Doctor Info */}
               <div className="space-y-2">
                 <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2">Doctor</h4>
                 <div className="flex items-center gap-2"><Stethoscope className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Nombre:</span><DetailValue value={`${selectedCita.Doctor.nombre} ${selectedCita.Doctor.apellido}`} /></div>
                 <div className="flex items-center gap-2"><BadgeInfo className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">ID Doctor:</span><DetailValue value={selectedCita.Doctor.id_doctor} /></div>
                 <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Especialidad:</span><DetailValue value={selectedCita.Doctor.especialidad} /></div>
              </div>
               {/* Notas Médicas */}
               <div className="space-y-2">
                 <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2">Notas Médicas</h4>
                 <div className="p-3 border rounded bg-muted/40 min-h-[60px] whitespace-pre-wrap"><DetailValue value={selectedCita.notas_medicas} className="text-sm" /></div>
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
            <AlertDialogTitle>¿Estás absolutely seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la cita
              {citaToDelete && ` del ${formatDateTime(citaToDelete.fecha_hora)} con ${citaToDelete.Paciente.nombre} ${citaToDelete.Paciente.apellido}`}
              del servidor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setCitaToDelete(null)}
              disabled={deleteCitaMutation.isPending}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteCitaMutation.isPending}
            >
              {deleteCitaMutation.isPending ? (
                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Eliminando... </>
              ) : ( 'Sí, eliminar cita' )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div> // End main container div
  );
}