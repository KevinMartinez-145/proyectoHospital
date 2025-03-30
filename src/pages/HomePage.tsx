// src/pages/HomePage.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Stethoscope, CalendarPlus, CalendarClock } from 'lucide-react'; // Import icons

export function HomePage() {
  // Placeholder data - replace with real data from hooks later
  const stats = {
    totalPacientes: 62, // Example number
    totalDoctores: 12,  // Example number
    citasHoy: 7,       // Example number
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pacientes Totales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPacientes}</div>
            <p className="text-xs text-muted-foreground">
              Número total de pacientes registrados.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doctores Activos</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDoctores}</div>
            <p className="text-xs text-muted-foreground">
              Doctores disponibles en el sistema.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas para Hoy</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.citasHoy}</div>
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
              <Link to="/citas/nueva"> {/* Assuming this route exists later */}
                <CalendarPlus className="mr-2 h-4 w-4" /> Nueva Cita
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/pacientes/nuevo"> {/* Assuming this route exists later */}
                <Users className="mr-2 h-4 w-4" /> Nuevo Paciente
              </Link>
            </Button>
            {/* Add more buttons as needed */}
          </CardContent>
        </Card>

        {/* Upcoming Appointments Placeholder Card */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Citas (Hoy)</CardTitle>
            <CardDescription>
              Un vistazo rápido a la agenda de hoy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              La lista de citas programadas para hoy aparecerá aquí cuando los datos estén disponibles.
            </p>
            {/* Placeholder structure (optional) */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between p-2 border rounded">
                <span>Paciente Ejemplo 1</span>
                <span className="text-muted-foreground">09:00 AM - Dr. García</span>
              </div>
               <div className="flex justify-between p-2 border rounded">
                <span>Paciente Ejemplo 2</span>
                <span className="text-muted-foreground">09:30 AM - Dra. López</span>
              </div>
            </div>
             <Button variant="link" className="mt-2 px-0" asChild>
                <Link to="/citas">Ver todas las citas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Add more sections/cards as needed */}

    </div>
  );
}