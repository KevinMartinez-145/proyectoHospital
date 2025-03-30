import { Link } from 'react-router-dom';

export function NotFoundPage() { // Named export
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Página No Encontrada</h1>
      <p className="mb-6">Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" className="text-primary hover:underline">
        Volver al Panel Principal
      </Link>
    </div>
  );
}