import { FaCheck } from "react-icons/fa";
import { useState, useEffect, useRef } from 'react';
import useGetData from '../../hooks/useGetData';
import { TableCell, TableRow } from "@/components/ui/table";
import axiosInstance from "@/helpers/axiosConfig";
import Swal from 'sweetalert2';

const Danos = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado del término de búsqueda
  const [filtereddanos, setFiltereddanos] = useState([]); // Estado de préstamos filtrados
  const inputRef = useRef(null); // Referencia al input para enfocarlo
  const { data: danosData, error: danosError, loading: danosLoading } = useGetData(['danos']);

  // Enfocar el input cuando el componente se monta
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Actualizar los préstamos filtrados cuando danosData o searchTerm cambien
  useEffect(() => {
    if (danosData && danosData['danos']) {
      const danos = danosData['danos'];
      
      if (searchTerm === "") {
        setFiltereddanos(danos); // Si no hay término de búsqueda, mostrar todos
      } else {
        // Filtrar préstamos por el término de búsqueda
        const danosFiltrados = danos.filter(dano => 
          dano.Elemento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dano.elementos_idelemento.toString().includes(searchTerm) ||
          dano.Cliente.nombre.toString().includes(searchTerm.toLowerCase()) ||
          dano.clientes_documento.toString().includes(searchTerm) ||
          dano.observaciones.toString().includes(searchTerm.toLowerCase()) ||
          dano.cantidad.toString().includes(searchTerm.toLowerCase())
        );
        setFiltereddanos(danosFiltrados);
      }
    }
  }, [danosData, searchTerm]); // Actualizar cuando cambien los datos o el término de búsqueda

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda
  };

  if (danosLoading) return <p>Cargando...</p>;
  if (danosError) return <p>{danosError}</p>;

  const handleReturndano = (iddano, idelemento, cantidad, observaciones, documento) => {
    Swal.fire({
      title: '¿Estás seguro de que quieres reponer la daño?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      iconColor: '#3085d6',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#81d4fa',
      confirmButtonText: 'Sí, devolverlo'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance.post('danos/return', {iddano, idelemento, cantidad, observaciones, documento})
          .then(response => {
            if (response.status === 200) {
              setFiltereddanos((prevDanos) => prevDanos.filter(dano => dano.iddano !== iddano));
            }
          })
          .catch(error => {
            Swal.fire(
              'Error!',
              'Hubo un problema al reponer el elemento.',
              'error'
            );
          });
      }
    });
  }
  return (
    <div style={{ textAlign: 'center' }}><br/>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginRight: '10px' }}>Daños Activos</h1>
        <input
          ref={inputRef}
          type="text"
          placeholder="Filtra por ID o descripción"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            width: '250px',
            padding: '7px',
            border: '2px solid black',
            borderRadius: '5px',
          }}
        />
      </div>

      <table style={{ margin: '0 auto' }}>
        <thead>
          <tr>
            <th>Documento</th>
            <th>Nombre</th>
            <th>Grupo</th>
            <th>Codigo</th>
            <th>Descripcion</th>
            <th>Cantidad</th>
            <th>Fecha</th>
            <th>Observaciones</th>
            <th>Reponer</th>
          </tr>
        </thead>
        <tbody>
          {filtereddanos.length > 0 ? (filtereddanos.map((dano) => (
            <tr key={dano.iddano}>
              <td>{dano.Cliente.documento}</td>
              <td>{dano.Cliente.nombre}</td>
              <td>{dano.Cliente.roles_idrol}</td>
              <td>{dano.Elemento.idelemento}</td>
              <td>{dano.Elemento.descripcion}</td>
              <td>{dano.cantidad}</td>
              <td>{dano.fecha}</td>
              <td>{dano.observaciones}</td>
              <td><button onClick={() => handleReturndano(dano.iddano, dano.Elemento.idelemento, dano.cantidad, dano.observaciones, dano.Cliente.documento)}>
                <FaCheck/>
              </button></td>
            </tr>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan="9">No hay danos</TableCell>
          </TableRow>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default Danos;
