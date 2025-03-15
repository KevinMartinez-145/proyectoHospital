export const obtenerPacientes = async () => {
    const response = await fetch('/api/pacientes');
    const data = await response.json();
    return data;
  };