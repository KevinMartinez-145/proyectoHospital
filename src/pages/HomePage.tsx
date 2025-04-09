// src/pages/HomePage.tsx
import { useMemo } from 'react'; // Import useMemo for calculations
import { Link } from 'react-router-dom';
import { format, parseISO, isToday } from 'date-fns'; // Import date-fns functions
import { es } from 'date-fns/locale';

// --- Hooks ---
import { useGetPacientes } from '@/hooks/usePacientes';
import { useGetDoctores } from '@/hooks/useDoctores';
import { useGetCitas } from '@/hooks/useCitas';

// --- UI Components ---
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { AlertCircle } from 'lucide-react'; // For error display

// --- Icons ---
import { Users, Stethoscope, CalendarPlus, CalendarClock, Loader2 } from 'lucide-react';

export function HomePage() {
  // --- Fetch Data ---
  const { data: pacientes, isLoading: isLoadingPacientes, isError: isErrorPacientes } = useGetPacientes();
  const { data: doctores, isLoading: isLoadingDoctores, isError: isErrorDoctores } = useGetDoctores();
  const { data: citas, isLoading: isLoadingCitas, isError: isErrorCitas } = useGetCitas();

  // --- Calculate Stats ---
  const totalPacientes = pacientes?.length ?? 0;
  const totalDoctores = doctores?.length ?? 0;

  // Calculate Today's Appointments using useMemo
  const citasHoy = useMemo(() => {
    if (!citas) return [];
    try {
        return citas
            .filter(cita => cita.fecha_hora && isToday(parseISO(cita.fecha_hora)))
            .sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime()); // Sort by time
    } catch (e) {
        console.error("Error processing citas dates:", e);
        return []; // Return empty array on error
    }
  }, [citas]); // Dependency: recalculate only when citas data changes

  const totalCitasHoy = citasHoy.length;

  // Helper to format time
  const formatTime = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      return format(date, 'HH:mm', { locale: es }); // Format like "16:30"
    } catch { return 'Hora inválida'; }
  };


  return (
    <div className="space-y-6">
      {/* 1. Welcome Message */}
      <h1 className="text-3xl font-bold tracking-tight">Panel Principal</h1>
      <p className="text-muted-foreground">
        Bienvenido/a al panel de administración de la clínica. Aquí tienes un resumen rápido.
      </p>

      {/* 2. Stats Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Pacientes Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pacientes Totales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingPacientes ? (
              <Skeleton className="h-8 w-16" />
            ) : isErrorPacientes ? (
              <span className="text-sm text-destructive">Error</span>
            ) : (
              <div className="text-2xl font-bold">{totalPacientes}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Número total de pacientes registrados.
            </p>
          </CardContent>
        </Card>

        {/* Doctores Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doctores Activos</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoadingDoctores ? (
              <Skeleton className="h-8 w-16" />
            ) : isErrorDoctores ? (
              <span className="text-sm text-destructive">Error</span>
            ) : (
              <div className="text-2xl font-bold">{totalDoctores}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Doctores disponibles en el sistema.
            </p>
          </CardContent>
        </Card>

        {/* Citas Hoy Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas para Hoy</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoadingCitas ? (
              <Skeleton className="h-8 w-16" />
            ) : isErrorCitas ? (
              <span className="text-sm text-destructive">Error</span>
            ) : (
              <div className="text-2xl font-bold">{totalCitasHoy}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Citas médicas programadas para hoy.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Quick Actions & Upcoming Appointments */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accesos directos a tareas comunes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button asChild className="flex-1">
              <Link to="/citas/nueva">
                <CalendarPlus className="mr-2 h-4 w-4" /> Nueva Cita
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/pacientes/nuevo">
                <Users className="mr-2 h-4 w-4" /> Nuevo Paciente
              </Link>
            </Button>
             <Button asChild variant="outline" className="flex-1">
              <Link to="/doctores/nuevo">
                <Stethoscope className="mr-2 h-4 w-4" /> Nuevo Doctor
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Appointments Card */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Citas (Hoy)</CardTitle>
            <CardDescription>
              Un vistazo rápido a la agenda de hoy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingCitas ? (
                <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : isErrorCitas ? (
                 <div className="flex items-center justify-center text-destructive gap-2 py-6">
                    <AlertCircle className="h-5 w-5" />
                    <span>Error al cargar citas</span>
                </div>
            ) : citasHoy.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No hay citas programadas para hoy.
              </p>
            ) : (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto"> {/* Added scroll */}
                {citasHoy.map((cita) => (
                  <div key={cita.id_cita} className="flex justify-between items-center p-2 border rounded text-sm hover:bg-muted/50">
                    <span className="font-medium truncate pr-2">
                        {cita.Paciente.nombre} {cita.Paciente.apellido}
                    </span>
                    <span className="text-muted-foreground text-right flex-shrink-0">
                        {formatTime(cita.fecha_hora)} - Dr. {cita.Doctor.apellido}
                    </span>
                  </div>
                ))}
              </div>
            )}
             <Button variant="link" className="mt-2 px-0" asChild>
                <Link to="/citas">Ver todas las citas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}