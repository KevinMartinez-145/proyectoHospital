// src/pages/EnfermerasListPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

// --- Hooks & Types ---
import { useGetEnfermeras, useDeleteEnfermera } from '@/hooks/useEnfermeras'; // Import hooks
import type { Enfermera } from '@/types/enfermera'; // Import type

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
  UserPlus, User, Mail, Phone, BadgeInfo, // Adjusted icons
} from 'lucide-react';

// --- Helper Component (can reuse from Doctores/Pacientes) ---
function DetailValue({ value, className = "" }: { value: string | number | null | undefined; className?: string }) {
  const displayValue = value === null || value === undefined || value === ''
    ? <span className="text-sm text-muted-foreground italic">N/A</span>
    : value;
  return <span className={cn("text-sm break-words", className)}>{displayValue}</span>;
}

// --- Main Page Component ---
export function EnfermerasListPage() {
  // --- State ---
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedEnfermera, setSelectedEnfermera] = useState<Enfermera | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [enfermeraToDelete, setEnfermeraToDelete] = useState<Enfermera | null>(null);

  // --- Data Fetching ---
  const { data: enfermeras, isLoading, isError, error } = useGetEnfermeras();

  // --- Mutations ---
  const deleteEnfermeraMutation = useDeleteEnfermera();

  // --- Event Handlers ---
  const handleViewDetails = (enfermera: Enfermera) => {
    setSelectedEnfermera(enfermera);
    setIsDetailDialogOpen(true);
  };

  const handleDeleteClick = (enfermera: Enfermera) => {
    setEnfermeraToDelete(enfermera);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (enfermeraToDelete) {
      deleteEnfermeraMutation.mutate(enfermeraToDelete.id_enfermera, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setEnfermeraToDelete(null);
        },
        onError: () => {
          setIsDeleteDialogOpen(false);
          setEnfermeraToDelete(null);
        }
      });
    }
  };

  // --- Component Return JSX ---
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Enfermeras</h1>
        <Button asChild>
          <Link to="/enfermeras/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" /> Nueva Enfermera
          </Link>
        </Button>
      </div>

      {/* Table Section */}
      <div className="border rounded-md">
        <Table>
          <TableCaption>Lista de enfermeras registradas en el sistema.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Correo Electrónico</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="text-right w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          {/* Table Body Logic */}
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={`skel-enf-${i}`}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[76px]" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-red-600">
                  <div className="flex items-center justify-center gap-2 py-4">
                    <AlertCircle className="h-5 w-5" />
                    <span>Error al cargar las enfermeras: {error instanceof Error ? error.message : 'Error desconocido'}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : !enfermeras || enfermeras.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                  No se encontraron enfermeras registradas.
                </TableCell>
              </TableRow>
            ) : (
              enfermeras.map((enfermera) => (
                <TableRow key={enfermera.id_enfermera}>
                  <TableCell className="font-medium">{`${enfermera.nombre} ${enfermera.apellido}`}</TableCell>
                  <TableCell>{enfermera.correo_electronico}</TableCell>
                  <TableCell>{enfermera.telefono}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      {/* View Details Button */}
                      <Button variant="ghost" size="icon" title="Ver Detalles" onClick={() => handleViewDetails(enfermera)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {/* Edit Button */}
                      <Button variant="outline" size="icon" asChild title="Editar Enfermera">
                        <Link to={`/enfermeras/editar/${enfermera.id_enfermera}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="icon"
                        title="Eliminar Enfermera"
                        onClick={() => handleDeleteClick(enfermera)}
                        disabled={deleteEnfermeraMutation.isPending && enfermeraToDelete?.id_enfermera === enfermera.id_enfermera}
                      >
                        {deleteEnfermeraMutation.isPending && enfermeraToDelete?.id_enfermera === enfermera.id_enfermera ? (
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

      {/* --- Enfermera Detail Dialog --- */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-md"> {/* Adjusted width */}
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" /> {/* Icon */}
              Detalles de la Enfermera
            </DialogTitle>
            <DialogDescription>
              Información de la enfermera seleccionada.
            </DialogDescription>
          </DialogHeader>
          {selectedEnfermera && (
            <div className="py-4 space-y-4"> {/* Adjusted spacing */}
              {/* Info Section */}
              <div className="space-y-2">
                 <div className="flex items-center gap-2"><BadgeInfo className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">ID:</span><DetailValue value={selectedEnfermera.id_enfermera} /></div>
                 <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Nombre:</span><DetailValue value={selectedEnfermera.nombre} /></div>
                 <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Apellido:</span><DetailValue value={selectedEnfermera.apellido} /></div>
                 <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Email:</span><DetailValue value={selectedEnfermera.correo_electronico} className='truncate max-w-[200px]' /></div>
                 <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">Teléfono:</span><DetailValue value={selectedEnfermera.telefono} /></div>
                 <div className="flex items-center gap-2"><BadgeInfo className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-sm font-medium w-24 text-muted-foreground flex-shrink-0">ID Usuario:</span><DetailValue value={selectedEnfermera.usuario_id} /></div>
                 {/* Add createdAt/updatedAt if needed and available */}
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente a la enfermera
              <span className="font-semibold"> {enfermeraToDelete?.nombre} {enfermeraToDelete?.apellido} </span>
              y todos sus datos asociados del servidor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setEnfermeraToDelete(null)}
              disabled={deleteEnfermeraMutation.isPending}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteEnfermeraMutation.isPending}
            >
              {deleteEnfermeraMutation.isPending ? (
                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Eliminando... </>
              ) : ( 'Sí, eliminar enfermera' )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div> // End main container div
  );
}