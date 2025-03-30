import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function DepartamentosListPage() { // Named export
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Departamentos</h1>
         <Button asChild>
          <Link to="/departamentos/nuevo">Nuevo Departamento</Link>
        </Button>
      </div>
      <p>Aquí se mostrará la tabla de departamentos...</p>
    </div>
  );
}