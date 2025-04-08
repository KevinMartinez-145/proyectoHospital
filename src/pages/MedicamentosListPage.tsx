// src/pages/MedicamentosListPage.tsx
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function MedicamentosListPage() { // Named export
  return (
    <div>
       <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Medicamentos</h1>
         {/* Link to a future "new medicamento" form */}
         <Button asChild>
          <Link to="/medicamentos/nuevo">Nuevo Medicamento</Link>
        </Button>
      </div>
      <p>Aquí se mostrará la tabla de medicamentos...</p>
      {/* Add Table, Data Fetching etc. later */}
    </div>
  );
}