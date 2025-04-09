// src/pages/TratamientosListPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";

// --- Hooks & Types ---
import { useGetTratamientos, useDeleteTratamiento } from '@/hooks/useTratamientos'; // Import hooks
import type { Tratamiento } from '@/types/tratamiento'; // Import type

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
  User, Stethoscope, CalendarRange, FileText, BadgeInfo, // Added icons
} from 'lucide-react';

// --- Helper Component (can reuse) ---
function DetailValue({ value, className = "" }: { value: string | number | null | undefined; className?: string }) {
  const displayValue = value === null || value === undefined || value === ''
    ? <span className="text-sm text-muted-foreground italic">N/A</span>
    : value;
  return <span className={cn("text-sm break-words", className)}>{displayValue}</span>;
}

// --- Main Page Component ---
export function TratamientosListPage() {
  // --- State ---
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedTratamiento, setSelectedTratamiento] = useState<Tratamiento | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tratamientoToDelete, setTratamientoToDelete] = useState<Tratamiento | null>(null);

  // --- Data Fetching ---
  const { data: tratamientos, isLoading, isError, error } = useGetTratamientos();

  // --- Mutations ---
  const deleteTratamientoMutation = useDeleteTratamiento();

  // --- Event Handlers ---
  const handleViewDetails = (tratamiento: Tratamiento) => {
    setSelectedTratamiento(tratamiento);
    setIsDetailDialogOpen(true);
  };

  const handleDeleteClick = (tratamiento: Tratamiento) => {
    setTratamientoToDelete(tratamiento);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (tratamientoToDelete) {
      deleteTratamientoMutation.mutate(tratamientoToDelete.id_tratamiento, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setTratamientoToDelete(null);
        },
        onError: () => {
          setIsDeleteDialogOpen(false);
          setTratamientoToDelete(null);
        }
      });
    }
  };

  // --- Formatting Helpers ---
   const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      // API provides YYYY-MM-DD, parseISO might work but parse is safer for specific format
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      return format(date, 'dd/MM/yyyy', { locale: es });
    } catch { return 'Fecha inválida'; }
  };

  // --- Component Return JSX ---
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Tratamientos</h1>
        <Button asChild>
          <Link to="/tratamientos/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Tratamiento
          </Link>
        </Button>
      </div>

      {/* Table Section */}
      <div className="border rounded-md">
        <Table>
          <TableCaption>Lista de tratamientos registrados.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Fecha Fin</TableHead>
              <TableHead className="text-right w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          {/* Table Body Logic */}
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={`skel-trat-${i}`}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[76px]" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-red-600">
                  <div className="flex items-center justify-center gap-2 py-4">
                    <AlertCircle className="h-5 w-5" />
                    <span>Error al cargar los tratamientos: {error instanceof Error ? error.message : 'Error desconocido'}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : !tratamientos || tratamientos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                  No se encontraron tratamientos registrados.
                </TableCell>
              </TableRow>
            ) : (
              tratamientos.map((tratamiento) => (
                <TableRow key={tratamiento.id_tratamiento}>
                  <TableCell className="font-medium">{`${tratamiento.paciente.nombre} ${tratamiento.paciente.apellido}`}</TableCell>
                  <TableCell>{`${tratamiento.doctor.nombre} ${tratamiento.doctor.apellido}`}</TableCell>
                  <TableCell className="truncate max-w-[250px]">{tratamiento.descripcion}</TableCell>
                  <TableCell>{formatDate(tratamiento.fecha_inicio)}</TableCell>
                  <TableCell>{formatDate(tratamiento.fecha_fin)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      {/* View Details Button */}
                      <Button variant="ghost" size="icon" title="Ver Detalles" onClick={() => handleViewDetails(tratamiento)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {/* Edit Button */}
                      <Button variant="outline" size="icon" asChild title="Editar Tratamiento">
                        <Link to={`/tratamientos/editar/${tratamiento.id_tratamiento}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="icon"
                        title="Eliminar Tratamiento"
                        onClick={() => handleDeleteClick(tratamiento)}
                        disabled={deleteTratamientoMutation.isPending && tratamientoToDelete?.id_tratamiento === tratamiento.id_tratamiento}
                      >
                        {deleteTratamientoMutation.isPending && tratamientoToDelete?.id_tratamiento === tratamiento.id_tratamiento ? (
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

      {/* --- Tratamiento Detail Dialog --- */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg"> {/* Adjusted width */}
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> {/* Icon */}
              Detalles del Tratamiento
            </DialogTitle>
             {selectedTratamiento && <DialogDescription>
              Tratamiento ID: {selectedTratamiento.id_tratamiento}
            </DialogDescription>}
          </DialogHeader>
          {selectedTratamiento && (
            <div className="py-4 space-y-6"> {/* Adjusted spacing */}
              {/* Tratamiento Info */}
               <div className="space-y-2">
                 <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2">Información del Tratamiento</h4>
                 <div className="flex items-center gap-2"><CalendarRange className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Inicio:</span><DetailValue value={formatDate(selectedTratamiento.fecha_inicio)} /></div>
                 <div className="flex items-center gap-2"><CalendarRange className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Fin:</span><DetailValue value={formatDate(selectedTratamiento.fecha_fin)} /></div>
                 <div className="flex items-start gap-2"><FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Descripción:</span></div>
                 <div className="p-3 border rounded bg-muted/40 min-h-[60px] whitespace-pre-wrap"><DetailValue value={selectedTratamiento.descripcion} className="text-sm" /></div>
              </div>
               {/* Paciente Info */}
               <div className="space-y-2">
                 <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2">Paciente</h4>
                 <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Nombre:</span><DetailValue value={`${selectedTratamiento.paciente.nombre} ${selectedTratamiento.paciente.apellido}`} /></div>
                 <div className="flex items-center gap-2"><BadgeInfo className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">ID Paciente:</span><DetailValue value={selectedTratamiento.paciente.id_paciente} /></div>
              </div>
               {/* Doctor Info */}
               <div className="space-y-2">
                 <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2">Doctor</h4>
                 <div className="flex items-center gap-2"><Stethoscope className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Nombre:</span><DetailValue value={`${selectedTratamiento.doctor.nombre} ${selectedTratamiento.doctor.apellido}`} /></div>
                 <div className="flex items-center gap-2"><BadgeInfo className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">ID Doctor:</span><DetailValue value={selectedTratamiento.doctor.id_doctor} /></div>
                 <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Especialidad:</span><DetailValue value={selectedTratamiento.doctor.especialidad} /></div>
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente el tratamiento
              {tratamientoToDelete && ` (ID: ${tratamientoToDelete.id_tratamiento}) para ${tratamientoToDelete.paciente.nombre} ${tratamientoToDelete.paciente.apellido}`}
              del servidor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setTratamientoToDelete(null)}
              disabled={deleteTratamientoMutation.isPending}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteTratamientoMutation.isPending}
            >
              {deleteTratamientoMutation.isPending ? (
                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Eliminando... </>
              ) : ( 'Sí, eliminar tratamiento' )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div> // End main container div
  );
}