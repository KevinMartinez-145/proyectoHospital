import React, { useState, useEffect } from 'react';
import TablaPaciente from '../componentes/TablaPaciente';
import { obtenerPacientes } from '../utilidade/api';

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    obtenerPacientes().then((data) => setPacientes(data));
  }, []);

  return (
    <div>
      <h1>Pacientes</h1>
      <TablaPaciente pacientes={pacientes} />
    </div>
  );
};

export default Pacientes;