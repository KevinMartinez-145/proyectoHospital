// src/App.tsx

import { Routes, Route } from 'react-router-dom'; // Import only Routes and Route

// Import UI components
import { Toaster } from '@/components/ui/toaster';

// Layout import (ensure named import)
import { MainLayout } from '@/components/layouts/MainLayout';

import { ProtectedRoute } from './components/common/ProtectedRoute';

// Import Page Components from the main 'pages' folder (Named Imports)
import { LoginPage } from './pages/LoginPage';
import { HomePage } from '@/pages/HomePage';
import { PacientesListPage } from '@/pages/PacientesListPage';
import { DoctoresListPage } from '@/pages/DoctoresListPage';
import { EnfermerasListPage } from '@/pages/EnfermerasListPage';
import { CitasListPage } from '@/pages/CitasListPage';
import { TratamientosListPage } from '@/pages/TratamientosListPage';
import { MedicamentosListPage } from '@/pages/MedicamentosListPage';
import { DepartamentosListPage } from '@/pages/DepartamentosListPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PacienteFormPage } from './pages/PacienteFormPage';
import { DoctorFormPage } from './pages/DoctorFormPage';
import { EnfermeraFormPage } from './pages/EnfermeraFormPage';
import { CitaFormPage } from './pages/CitaFormPage';
import { TratamientoFormPage } from './pages/TratamientoFormPage';

// Import form pages later when created, e.g.:
// import { PacienteFormPage } from '@/pages/PacienteFormPage';

export default function App() { // Named export for App component
  return (
    <> {/* Use a Fragment or a simple div if needed, but often not necessary here */}
      <Routes>
        {/* --- Public Route --- */}
        {/* The login page is accessible without authentication */}
        <Route path="/login" element={<LoginPage />} />
        {/* All routes nested directly under MainLayout */}
        <Route element={<ProtectedRoute />}>
          {/* Routes nested inside ProtectedRoute require authentication */}
          {/* This route renders the MainLayout (sidebar, etc.) */}
        <Route element={<MainLayout />}>
          {/* Main Dashboard */}
          <Route path="/" element={<HomePage />} />

          {/* Pacientes Routes */}
          <Route path="/pacientes" element={<PacientesListPage />} />
          <Route path="/pacientes/nuevo" element={<PacienteFormPage/>} /> 
          <Route path="/pacientes/editar/:id" element={<PacienteFormPage/>} />

          {/* Doctores Routes */}
          <Route path="/doctores" element={<DoctoresListPage />} />
          <Route path="/doctores/nuevo" element={<DoctorFormPage/>} /> 
          <Route path="/doctores/editar/:id" element={<DoctorFormPage />} />

          {/* Enfermeras Routes */}
          <Route path="/enfermeras" element={<EnfermerasListPage />} />
          <Route path="/enfermeras/nuevo" element={<EnfermeraFormPage  />} />
          <Route path="/enfermeras/editar/:id" element={<EnfermeraFormPage />} /> 

          {/* Citas Routes */}
          <Route path="/citas" element={<CitasListPage />} />
          <Route path="/citas/nueva" element={<CitaFormPage/>} />
          <Route path="/citas/editar/:id" element={<CitaFormPage  />} /> 

          {/* Tratamientos Routes */}
          <Route path="/tratamientos" element={<TratamientosListPage />} />
          <Route path="/tratamientos/nuevo" element={<TratamientoFormPage/>} />
          <Route path="/tratamientos/editar/:id" element={<TratamientoFormPage />} /> 

          {/* --- ADDED Medicamentos Route --- */}
          <Route path="/medicamentos" element={<MedicamentosListPage />} />
          {/* Add Medicamento form routes later */}
          {/* <Route path="/medicamentos/nuevo" element={<MedicamentoFormPage />} /> */}
          {/* <Route path="/medicamentos/editar/:id" element={<MedicamentoFormPage />} 

          {/* Departamentos Routes */}
          <Route path="/departamentos" element={<DepartamentosListPage />} />
          {/* <Route path="/departamentos/nuevo" element={<DepartamentoFormPage mode="create" />} /> */}
          {/* <Route path="/departamentos/editar/:id" element={<DepartamentoFormPage mode="edit" />} /> */}

          {/* Add other routes like settings if needed */}
          {/* <Route path="/configuracion" element={<SettingsPage />} /> */}

        </Route> {/* End MainLayout Routes */}
        </Route>

        {/* Catch-all Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>

      {/* Keep Toaster here as it's often useful at the App level */}
      <Toaster />
    </>
  );
}