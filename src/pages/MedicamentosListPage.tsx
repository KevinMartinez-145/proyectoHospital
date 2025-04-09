// src/pages/MedicamentosListPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

// --- Hooks & Types ---
import { useGetMedicamentos, useDeleteMedicamento } from '@/hooks/useMedicamentos'; // Import hooks
import type { Medicamento } from '@/types/medicamento'; // Import type

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
  AlertCircle, Edit, Trash2, PlusCircle, Eye, Loader2, BadgeInfo,
  Pill, FileText, Repeat, Thermometer, // Added icons
} from 'lucide-react';

// --- Helper Component (can reuse) ---
function DetailValue({ value, className = "" }: { value: string | number | null | undefined; className?: string }) {
  const displayValue = value === null || value === undefined || value === ''
    ? <span className="text-sm text-muted-foreground italic">N/A</span>
    : value;
  return <span className={cn("text-sm break-words", className)}>{displayValue}</span>;
}

// --- Main Page Component ---
export function MedicamentosListPage() {
  // --- State ---
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState<Medicamento | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [medicamentoToDelete, setMedicamentoToDelete] = useState<Medicamento | null>(null);

  // --- Data Fetching ---
  const { data: medicamentos, isLoading, isError, error } = useGetMedicamentos();

  // --- Mutations ---
  const deleteMedicamentoMutation = useDeleteMedicamento();

  // --- Event Handlers ---
  const handleViewDetails = (medicamento: Medicamento) => {
    setSelectedMedicamento(medicamento);
    setIsDetailDialogOpen(true);
  };

  const handleDeleteClick = (medicamento: Medicamento) => {
    setMedicamentoToDelete(medicamento);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (medicamentoToDelete) {
      deleteMedicamentoMutation.mutate(medicamentoToDelete.id_medicamento, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setMedicamentoToDelete(null);
        },
        onError: () => {
          setIsDeleteDialogOpen(false);
          setMedicamentoToDelete(null);
        }
      });
    }
  };

  // --- Component Return JSX ---
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Medicamentos</h1>
        <Button asChild>
          <Link to="/medicamentos/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Medicamento
          </Link>
        </Button>
      </div>

      {/* Table Section */}
      <div className="border rounded-md">
        <Table>
          <TableCaption>Lista de medicamentos registrados.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Dosis</TableHead>
              <TableHead>Frecuencia</TableHead>
              <TableHead>Tratamiento (Desc.)</TableHead>
              <TableHead className="text-right w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          {/* Table Body Logic */}
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={`skel-med-${i}`}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[76px]" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-red-600">
                  <div className="flex items-center justify-center gap-2 py-4">
                    <AlertCircle className="h-5 w-5" />
                    <span>Error al cargar los medicamentos: {error instanceof Error ? error.message : 'Error desconocido'}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : !medicamentos || medicamentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                  No se encontraron medicamentos registrados.
                </TableCell>
              </TableRow>
            ) : (
              medicamentos.map((medicamento) => (
                <TableRow key={medicamento.id_medicamento}>
                  <TableCell className="font-medium">{medicamento.nombre}</TableCell>
                  <TableCell>{medicamento.dosis}</TableCell>
                  <TableCell>{medicamento.frecuencia}</TableCell>
                  <TableCell className="truncate max-w-[250px]">{medicamento.tratamiento.descripcion}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      {/* View Details Button */}
                      <Button variant="ghost" size="icon" title="Ver Detalles" onClick={() => handleViewDetails(medicamento)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {/* Edit Button */}
                      <Button variant="outline" size="icon" asChild title="Editar Medicamento">
                        <Link to={`/medicamentos/editar/${medicamento.id_medicamento}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="icon"
                        title="Eliminar Medicamento"
                        onClick={() => handleDeleteClick(medicamento)}
                        disabled={deleteMedicamentoMutation.isPending && medicamentoToDelete?.id_medicamento === medicamento.id_medicamento}
                      >
                        {deleteMedicamentoMutation.isPending && medicamentoToDelete?.id_medicamento === medicamento.id_medicamento ? (
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

      {/* --- Medicamento Detail Dialog --- */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg"> {/* Adjusted width */}
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" /> {/* Icon */}
              Detalles del Medicamento
            </DialogTitle>
             {selectedMedicamento && <DialogDescription>
              Medicamento: {selectedMedicamento.nombre} (ID: {selectedMedicamento.id_medicamento})
            </DialogDescription>}
          </DialogHeader>
          {selectedMedicamento && (
            <div className="py-4 space-y-6"> {/* Adjusted spacing */}
              {/* Medicamento Info */}
               <div className="space-y-2">
                 <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2">Información del Medicamento</h4>
                 <div className="flex items-center gap-2"><Pill className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Nombre:</span><DetailValue value={selectedMedicamento.nombre} /></div>
                 <div className="flex items-center gap-2"><Thermometer className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Dosis:</span><DetailValue value={selectedMedicamento.dosis} /></div>
                 <div className="flex items-center gap-2"><Repeat className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Frecuencia:</span><DetailValue value={selectedMedicamento.frecuencia} /></div>
                 <div className="flex items-start gap-2"><FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Descripción:</span></div>
                 <div className="p-3 border rounded bg-muted/40 min-h-[60px] whitespace-pre-wrap"><DetailValue value={selectedMedicamento.descripcion} className="text-sm" /></div>
              </div>
               {/* Tratamiento Info */}
               <div className="space-y-2">
                 <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2">Tratamiento Asociado</h4>
                 <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Desc:</span><DetailValue value={selectedMedicamento.tratamiento.descripcion} /></div>
                 <div className="flex items-center gap-2"><BadgeInfo className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">ID Tratam.:</span><DetailValue value={selectedMedicamento.tratamiento.id_tratamiento} /></div>
                 {/* Optionally add patient/doctor IDs from tratamiento if needed */}
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente el medicamento
              <span className="font-semibold"> {medicamentoToDelete?.nombre} </span>
              (ID: {medicamentoToDelete?.id_medicamento}) del servidor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setMedicamentoToDelete(null)}
              disabled={deleteMedicamentoMutation.isPending}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMedicamentoMutation.isPending}
            >
              {deleteMedicamentoMutation.isPending ? (
                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Eliminando... </>
              ) : ( 'Sí, eliminar medicamento' )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div> // End main container div
  );
}