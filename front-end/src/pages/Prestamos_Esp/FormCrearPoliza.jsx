import React, { useState } from 'react';
import '../../components/estilos poliza-prestamos-Esp/Polizastyle.css';

const FormCrearPoliza = () => {
  const [busqueda, setBusqueda] = useState('');
  const [prestamos, setPrestamos] = useState([]);
  const [nuevoPrestamo, setNuevoPrestamo] = useState({
    fechaInicio: '',
    fechaFin: '',
    archivo: null,
  });

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
    // Aquí puedes implementar la lógica de búsqueda de elementos
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoPrestamo({ ...nuevoPrestamo, [name]: value });
  };

  const handleFileChange = (e) => {
    setNuevoPrestamo({ ...nuevoPrestamo, archivo: e.target.files[0] });
  };

  const agregarPrestamo = () => {
    const Id = prestamos.length + 1;
    const nuevoRegistro = {
      Codigo:  Id,
      Descripcion: busqueda,
      CantidadP: nuevoPrestamo.Cantidad_P,
      Observaciones: nuevoPrestamo.Observaciones,
      fechaInicio: nuevoPrestamo.fechaInicio,
      fechaFin: nuevoPrestamo.fechaFin,
      Estado: nuevoPrestamo.Estado,
    };
    setPrestamos([...prestamos, nuevoRegistro]);
    // Limpiar inputs
    setNuevoPrestamo({ fechaInicio: '', fechaFin: '', archivo: null });
    setBusqueda('');
  };

 

  const cancelarAccion = () => {
    navigate('/inicio'); // Redirige a "/inicio"
  };

  return (
    <div>
      <h1><strong>Gestión de Préstamos Especiales</strong></h1>
      {/* Barra de búsqueda */}
      <input  className='input3'
        type="text"
        placeholder="Buscar elemento..."
        value={busqueda}
        onChange={handleBusqueda}
      />

        <div className="contenedor7" overflow='auto'>
         <span class="search-result-text"> CABLE PLC S71200</span>
         <div className='search-result-item'/>
         <span class="search-result-text">CAJA PINZA BOQUILLA X 11</span>
         <div className='search-result-item'/>
         <span class="search-result-text">CAJA PINZAS BOQUILLA COLLET X 18</span>
         <div className='search-result-item'/>
         <span class="search-result-text">CAJA PINZAS, BOQUILLAS X 16</span>
         <div className='search-result-item'/>
         <span class="search-result-text">CAJA WISTONG O TORNO X 21</span>
          <div class="search-result-item"/>
            <span class="search-result-text">CABLE PLC S71200</span>
  
            <div class="search-result-item"/>
            <span class="search-result-text">CAJA METALICA FRESADORA X 29</span>
           
            <div class="search-result-item"/>
            <span class="search-result-text">CAJA PVC 2X4</span>
            
            <div class="search-result-item"/>
              <span class="search-result-text">CAJA RECTIFICADORA X 20</span>
              
            <div class="search-result-item"/>
              <span class="search-result-text">CAJA WISTONG O TORNO X 21</span>       
      </div>  
      {/* Tabla de préstamos */}
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Cantidad P</th>
            <th>Observaciones</th>
            <th>fechaInicio</th>
            <th>fechaFin</th>
            <th>Estado</th>
            <th>Acc</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map((prestamo) => (
            <tr key={prestamo.id}>
              <td>{prestamo.Código}</td>
              <td>{prestamo.Descripción}</td>
              <td>{prestamo.Cantidad_P}</td>
              <td>{prestamo.Observaciones}</td>
              <td>{prestamo.fechaInicio}</td>
              <td>{prestamo.fechaFin}</td>
              <td>{prestamo.Estado}</td>
              <td>{prestamo.Acc}</td>
            </tr>
          ))}
        </tbody>
      </table><br/>

      {/* Inputs de fecha y archivo */}
      <div>
        <label><strong>Fecha Inicio:</strong></label>
        <input className='input1'
          type="date"
          name="fechaInicio"
          value={nuevoPrestamo.fechaInicio}
          onChange={handleInputChange}
        /><br/>

        <label><strong>Fecha Fin:</strong></label>
        <input className='input2'
          type="date"
          name="fechaFin"
          value={nuevoPrestamo.fechaFin}
          onChange={handleInputChange}
        /><br/>

        <label><strong>Subir Archivo:</strong></label>
        <input className='input4' type="file" onChange={handleFileChange} />
      </div>

      {/* Botones para guardar y Cancelar */}
      <center>
      <button  className='container5' onClick={agregarPrestamo}>Guardar</button>
      <button  className='container6' onClick={cancelarAccion}>Cancelar</button>
         </center>
    </div>
 
  );
};

export  {FormCrearPoliza};
