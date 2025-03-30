// src/App.tsx

import { Routes, Route } from 'react-router-dom'; // Import only Routes and Route

// Import UI components
import { Toaster } from '@/components/ui/toaster';

// Layout import (ensure named import)
import { MainLayout } from '@/components/layouts/MainLayout';

// Import Page Components from the main 'pages' folder (Named Imports)
import { HomePage } from '@/pages/HomePage';
import { PacientesListPage } from '@/pages/PacientesListPage';
import { DoctoresListPage } from '@/pages/DoctoresListPage';
import { EnfermerasListPage } from '@/pages/EnfermerasListPage';
import { CitasListPage } from '@/pages/CitasListPage';
import { TratamientosListPage } from '@/pages/TratamientosListPage';
import { DepartamentosListPage } from '@/pages/DepartamentosListPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Import form pages later when created, e.g.:
// import { PacienteFormPage } from '@/pages/PacienteFormPage';

export default function App() { // Named export for App component
  return (
    <> {/* Use a Fragment or a simple div if needed, but often not necessary here */}
      <Routes>
        {/* All routes nested directly under MainLayout */}
        <Route element={<MainLayout />}>
          {/* Main Dashboard */}
          <Route path="/" element={<HomePage />} />

          {/* Pacientes Routes */}
          <Route path="/pacientes" element={<PacientesListPage />} />
          {/* <Route path="/pacientes/nuevo" element={<PacienteFormPage mode="create" />} /> */}
          {/* <Route path="/pacientes/editar/:id" element={<PacienteFormPage mode="edit" />} /> */}

          {/* Doctores Routes */}
          <Route path="/doctores" element={<DoctoresListPage />} />
          {/* <Route path="/doctores/nuevo" element={<DoctorFormPage mode="create" />} /> */}
          {/* <Route path="/doctores/editar/:id" element={<DoctorFormPage mode="edit" />} /> */}

          {/* Enfermeras Routes */}
          <Route path="/enfermeras" element={<EnfermerasListPage />} />
          {/* <Route path="/enfermeras/nuevo" element={<EnfermeraFormPage mode="create" />} /> */}
          {/* <Route path="/enfermeras/editar/:id" element={<EnfermeraFormPage mode="edit" />} /> */}

          {/* Citas Routes */}
          <Route path="/citas" element={<CitasListPage />} />
          {/* <Route path="/citas/nueva" element={<CitaFormPage mode="create" />} /> */}
          {/* <Route path="/citas/editar/:id" element={<CitaFormPage mode="edit" />} /> */}

          {/* Tratamientos Routes */}
          <Route path="/tratamientos" element={<TratamientosListPage />} />
          {/* <Route path="/tratamientos/nuevo" element={<TratamientoFormPage mode="create" />} /> */}
          {/* <Route path="/tratamientos/editar/:id" element={<TratamientoFormPage mode="edit" />} /> */}

          {/* Departamentos Routes */}
          <Route path="/departamentos" element={<DepartamentosListPage />} />
          {/* <Route path="/departamentos/nuevo" element={<DepartamentoFormPage mode="create" />} /> */}
          {/* <Route path="/departamentos/editar/:id" element={<DepartamentoFormPage mode="edit" />} /> */}

          {/* Add other routes like settings if needed */}
          {/* <Route path="/configuracion" element={<SettingsPage />} /> */}

        </Route> {/* End MainLayout Routes */}

        {/* Catch-all Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>

      {/* Keep Toaster here as it's often useful at the App level */}
      <Toaster />
    </>
  );
}