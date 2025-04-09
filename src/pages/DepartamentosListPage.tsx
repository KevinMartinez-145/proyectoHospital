// src/pages/DepartamentosListPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

// --- Hooks & Types ---
import { useGetDepartamentos, useDeleteDepartamento } from '@/hooks/useDepartamentos'; // Import hooks
import type { Departamento } from '@/types/departamentos'; // Import type

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
  Building, FileText, UserCircle // Added icons
} from 'lucide-react';

// --- Helper Component (can reuse) ---
function DetailValue({ value, className = "" }: { value: string | number | null | undefined; className?: string }) {
  const displayValue = value === null || value === undefined || value === ''
    ? <span className="text-sm text-muted-foreground italic">N/A</span>
    : value;
  return <span className={cn("text-sm break-words", className)}>{displayValue}</span>;
}

// --- Main Page Component ---
export function DepartamentosListPage() {
  // --- State ---
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedDepartamento, setSelectedDepartamento] = useState<Departamento | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [departamentoToDelete, setDepartamentoToDelete] = useState<Departamento | null>(null);

  // --- Data Fetching ---
  const { data: departamentos, isLoading, isError, error } = useGetDepartamentos();

  // --- Mutations ---
  const deleteDepartamentoMutation = useDeleteDepartamento();

  // --- Event Handlers ---
  const handleViewDetails = (departamento: Departamento) => {
    setSelectedDepartamento(departamento);
    setIsDetailDialogOpen(true);
  };

  const handleDeleteClick = (departamento: Departamento) => {
    setDepartamentoToDelete(departamento);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (departamentoToDelete) {
      deleteDepartamentoMutation.mutate(departamentoToDelete.id_departamento, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setDepartamentoToDelete(null);
        },
        onError: () => {
          setIsDeleteDialogOpen(false);
          setDepartamentoToDelete(null);
        }
      });
    }
  };

  // --- Component Return JSX ---
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Departamentos</h1>
        <Button asChild>
          <Link to="/departamentos/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Departamento
          </Link>
        </Button>
      </div>

      {/* Table Section */}
      <div className="border rounded-md">
        <Table>
          <TableCaption>Lista de departamentos registrados.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>ID Jefe</TableHead>
              <TableHead className="text-right w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          {/* Table Body Logic */}
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={`skel-dept-${i}`}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[76px]" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-red-600">
                  <div className="flex items-center justify-center gap-2 py-4">
                    <AlertCircle className="h-5 w-5" />
                    <span>Error al cargar los departamentos: {error instanceof Error ? error.message : 'Error desconocido'}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : !departamentos || departamentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                  No se encontraron departamentos registrados.
                </TableCell>
              </TableRow>
            ) : (
              departamentos.map((departamento) => (
                <TableRow key={departamento.id_departamento}>
                  <TableCell className="font-medium">{departamento.nombre}</TableCell>
                  <TableCell className="truncate max-w-xs">{departamento.descripcion}</TableCell>
                  <TableCell>{departamento.jefe}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      {/* View Details Button */}
                      <Button variant="ghost" size="icon" title="Ver Detalles" onClick={() => handleViewDetails(departamento)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {/* Edit Button */}
                      <Button variant="outline" size="icon" asChild title="Editar Departamento">
                        <Link to={`/departamentos/editar/${departamento.id_departamento}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="icon"
                        title="Eliminar Departamento"
                        onClick={() => handleDeleteClick(departamento)}
                        disabled={deleteDepartamentoMutation.isPending && departamentoToDelete?.id_departamento === departamento.id_departamento}
                      >
                        {deleteDepartamentoMutation.isPending && departamentoToDelete?.id_departamento === departamento.id_departamento ? (
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

      {/* --- Departamento Detail Dialog --- */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg"> {/* Adjusted width */}
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" /> {/* Icon */}
              Detalles del Departamento
            </DialogTitle>
             {selectedDepartamento && <DialogDescription>
              Departamento: {selectedDepartamento.nombre} (ID: {selectedDepartamento.id_departamento})
            </DialogDescription>}
          </DialogHeader>
          {selectedDepartamento && (
            <div className="py-4 space-y-6"> {/* Adjusted spacing */}
              {/* Departamento Info */}
               <div className="space-y-2">
                 <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2">Información</h4>
                 <div className="flex items-center gap-2"><Building className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Nombre:</span><DetailValue value={selectedDepartamento.nombre} /></div>
                 <div className="flex items-center gap-2"><UserCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">ID Jefe:</span><DetailValue value={selectedDepartamento.jefe} /></div>
                 <div className="flex items-start gap-2"><FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Descripción:</span></div>
                 <div className="p-3 border rounded bg-muted/40 min-h-[60px] whitespace-pre-wrap"><DetailValue value={selectedDepartamento.descripcion} className="text-sm" /></div>
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente el departamento
              <span className="font-semibold"> {departamentoToDelete?.nombre} </span>
              (ID: {departamentoToDelete?.id_departamento}) del servidor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDepartamentoToDelete(null)}
              disabled={deleteDepartamentoMutation.isPending}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteDepartamentoMutation.isPending}
            >
              {deleteDepartamentoMutation.isPending ? (
                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Eliminando... </>
              ) : ( 'Sí, eliminar departamento' )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div> // End main container div
  );
}