import React from 'react';

const TablaPaciente = ({ pacientes }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Edad</th>
        </tr>
      </thead>
      <tbody>
        {pacientes.map((paciente) => (
          <tr key={paciente.id}>
            <td>{paciente.id}</td>
            <td>{paciente.nombre}</td>
            <td>{paciente.edad}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaPaciente;