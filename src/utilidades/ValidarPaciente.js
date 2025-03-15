export const validarPaciente = (paciente) => {
    if (!paciente.nombre || paciente.edad <= 0) {
      return false;
    }
    return true;
  };