import { useState, useEffect, useRef } from 'react';
import useGetData from '../../hooks/useGetData';
import { TableCell, TableRow } from "@/components/ui/table";

const Consumos = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado del término de búsqueda
  const [filteredconsumos, setFilteredconsumos] = useState([]); // Estado de préstamos filtrados
  const inputRef = useRef(null); // Referencia al input para enfocarlo
  const { data: consumosData, error: consumosError, loading: consumosLoading } = useGetData(['consumos']);

  // Enfocar el input cuando el componente se monta
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Actualizar los préstamos filtrados cuando consumosData o searchTerm cambien
  useEffect(() => {
    if (consumosData && consumosData['consumos']) {
      const consumos = consumosData['consumos'];
      
      if (searchTerm === "") {
        setFilteredconsumos(consumos); // Si no hay término de búsqueda, mostrar todos
      } else {
        // Filtrar préstamos por el término de búsqueda
        const consumosFiltrados = consumos.filter(consumo => 
          consumo.Elemento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consumo.elementos_idelemento.toString().includes(searchTerm) ||
          consumo.Consumo.Cliente.nombre.toString().includes(searchTerm.toLowerCase()) ||
          consumo.Consumo.Cliente.documento.toString().includes(searchTerm) ||
          consumo.observaciones.toString().includes(searchTerm.toLowerCase()) ||
          consumo.cantidad.toString().includes(searchTerm.toLowerCase())||
          consumo.fecha.toString().includes(searchTerm.toLowerCase())
        );
        setFilteredconsumos(consumosFiltrados);
      }
    }
  }, [consumosData, searchTerm]); // Actualizar cuando cambien los datos o el término de búsqueda

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda
  };

  if (consumosLoading) return <p>Cargando...</p>;
  if (consumosError) return <p>{consumosError}</p>;

  return (
    <div style={{ textAlign: 'center' }}><br/>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginRight: '10px' }}>Lista Consumos</h1>
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
      <div className="max-h-[400px] max-w-[1000px] overflow-y-auto overflow-x-auto">
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
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {filteredconsumos.length > 0 ? (filteredconsumos.map((consumo) => (
              <tr key={consumo.Consumo.documento}>
                <td>{consumo.Consumo.Cliente.documento}</td>
                <td>{consumo.Consumo.Cliente.nombre}</td>
                <td>{consumo.Consumo.Cliente.roles_idrol}</td>
                <td>{consumo.Elemento.idelemento}</td>
                <td>{consumo.Elemento.descripcion}</td>
                <td>{consumo.cantidad}</td>
                <td>{consumo.fecha}</td>
                <td>{consumo.observaciones}</td>
                <td>{consumo.administradores_documento}</td>
              </tr>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="9">No hay consumos</TableCell>
            </TableRow>
          )}
          </tbody>
      </table>
      </div>
    </div>
  );
};

export default Consumos;
