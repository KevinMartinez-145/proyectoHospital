import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function EnfermerasListPage() { // Named export
  return (
    <div>
       <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Enfermeras</h1>
         <Button asChild>
          <Link to="/enfermeras/nuevo">Nueva Enfermera</Link>
        </Button>
      </div>
      <p>Aquí se mostrará la tabla de enfermeras...</p>
    </div>
  );
}