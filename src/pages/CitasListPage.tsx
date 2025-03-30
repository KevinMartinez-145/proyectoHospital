import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function CitasListPage() { // Named export
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Citas Médicas</h1>
         <Button asChild>
          <Link to="/citas/nueva">Nueva Cita</Link>
        </Button>
      </div>
      <p>Aquí se mostrará la tabla de citas...</p>
    </div>
  );
}