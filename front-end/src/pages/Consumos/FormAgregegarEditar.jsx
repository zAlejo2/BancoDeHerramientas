import React, { useState } from 'react';
import '../../assets/styles.css'; 

const FormAgregarEditar = () => {
  const [busqueda, setBusqueda] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fecha, setFecha] = useState('');
  const [consumos, setConsumos] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (busqueda && cantidad && fecha) {
      const nuevoConsumo = {
        id: Date.now(),
        busqueda,
        cantidad: parseFloat(cantidad),
        observaciones,
        fecha,
      };
      setConsumos([...consumos, nuevoConsumo]);
      setBusqueda('');
      setCantidad('');
      setObservaciones('');
      setFecha('');
    } else {
      alert('Por favor, complete los campos requeridos.');
    }
  };

  return (
    <div className="form-container">
      <h2>Agregar Consumo</h2>
      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-group">
          <label htmlFor="busqueda">Buscar Consumo:</label>
          <input
            type="text"
            id="busqueda"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            required
            placeholder="Ingrese el nombre del consumo"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cantidad">Cantidad:</label>
          <input
            type="number"
            id="cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="observaciones">Observaciones:</label>
          <input
            type="text"
            id="observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Opcional"
          />
        </div>
        <div className="form-group">
          <label htmlFor="fecha">Fecha:</label>
          <input
            type="date"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
        <button type="submit">Agregar a la Tabla</button>
      </form>

      <div className="table-container">
        <h3>Tabla de Consumos</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre del Consumo</th>
              <th>Cantidad</th>
              <th>Observaciones</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {consumos.map((consumo) => (
              <tr key={consumo.id}>
                <td>{consumo.busqueda}</td>
                <td>{consumo.cantidad}</td>
                <td>{consumo.observaciones}</td>
                <td>{consumo.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export {FormAgregarEditar};