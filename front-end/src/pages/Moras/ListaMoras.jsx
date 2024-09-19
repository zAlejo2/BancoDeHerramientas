import { FaCheck } from "react-icons/fa";
import { useState, useEffect, useRef } from 'react';
import useGetData from '../../hooks/useGetData';
import { TableCell, TableRow } from "@/components/ui/table";

const Moras = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado del término de búsqueda
  const [filteredmoras, setFilteredmoras] = useState([]); // Estado de préstamos filtrados
  const inputRef = useRef(null); // Referencia al input para enfocarlo
  const { data: morasData, error: morasError, loading: morasLoading } = useGetData(['moras']);

  // Enfocar el input cuando el componente se monta
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Actualizar los préstamos filtrados cuando morasData o searchTerm cambien
  useEffect(() => {
    if (morasData && morasData['moras']) {
      const moras = morasData['moras'];
      
      if (searchTerm === "") {
        setFilteredmoras(moras); // Si no hay término de búsqueda, mostrar todos
      } else {
        // Filtrar préstamos por el término de búsqueda
        const morasFiltrados = moras.filter(mora => 
          mora.Elemento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mora.elementos_idelemento.toString().includes(searchTerm) ||
          mora.Cliente.nombre.toString().includes(searchTerm.toLowerCase()) ||
          mora.clientes_documento.toString().includes(searchTerm) ||
          mora.observaciones.toString().includes(searchTerm.toLowerCase()) ||
          mora.cantidad.toString().includes(searchTerm.toLowerCase())
        );
        setFilteredmoras(morasFiltrados);
      }
    }
  }, [morasData, searchTerm]); // Actualizar cuando cambien los datos o el término de búsqueda

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda
  };

  if (morasLoading) return <p>Cargando...</p>;
  if (morasError) return <p>{morasError}</p>;

  return (
    <div style={{ textAlign: 'center' }}><br/>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginRight: '10px' }}>Moras Activas</h1>
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
            <th>Devolver</th>
          </tr>
        </thead>
        <tbody>
          {filteredmoras.length > 0 ? (filteredmoras.map((mora) => (
            <tr key={mora.idmora}>
              <td>{mora.Cliente.documento}</td>
              <td>{mora.Cliente.nombre}</td>
              <td>{mora.Cliente.roles_idrol}</td>
              <td>{mora.Elemento.idelemento}</td>
              <td>{mora.Elemento.descripcion}</td>
              <td>{mora.cantidad}</td>
              <td>{mora.fecha}</td>
              <td>{mora.observaciones}</td>
              <td><button><FaCheck/></button></td>
            </tr>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan="9">No hay moras</TableCell>
          </TableRow>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default Moras;
