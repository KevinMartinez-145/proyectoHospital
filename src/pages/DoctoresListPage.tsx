import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function DoctoresListPage() { // Named export
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Doctores</h1>
        <Button asChild>
          <Link to="/doctores/nuevo">Nuevo Doctor</Link>
        </Button>
      </div>
      <p>Aquí se mostrará la tabla de doctores...</p>
    </div>
  );
}