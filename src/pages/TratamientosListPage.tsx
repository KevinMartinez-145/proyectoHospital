import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function TratamientosListPage() { // Named export
  return (
    <div>
       <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Tratamientos</h1>
         <Button asChild>
          <Link to="/tratamientos/nuevo">Nuevo Tratamiento</Link>
        </Button>
      </div>
      <p>Aquí se mostrará la tabla de tratamientos...</p>
    </div>
  );
}