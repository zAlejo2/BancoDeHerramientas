import { useState, useEffect, useRef } from 'react';
import useGetData from '../../hooks/useGetData';
import { TableCell, TableRow } from "@/components/ui/table";
import ModalArchivo from '@/components/listas/ModalArchivo';

const Reintegros = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado del término de búsqueda
  const [filteredreintegros, setFilteredreintegros] = useState([]); // Estado de préstamos filtrados
  const inputRef = useRef(null); // Referencia al input para enfocarlo
  const { data: reintegrosData = [], error: reintegrosError, loading: reintegrosLoading } = useGetData(['bajas/reintegros']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  // Enfocar el input cuando el componente se monta
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Actualizar los préstamos filtrados cuando reintegrosData o searchTerm cambien
  useEffect(() => {
    if (reintegrosData &&reintegrosData['bajas/reintegros']) {
      const reintegros =reintegrosData['bajas/reintegros'];
      
      if (searchTerm === "") {
        setFilteredreintegros(reintegros); // Si no hay término de búsqueda, mostrar todos
      } else {
        // Filtrar préstamos por el término de búsqueda
        const reintegrosFiltrados = reintegros.filter(reintegro => 
          reintegro.Elemento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reintegro.elementos_idelemento.toString().includes(searchTerm) ||
          reintegro.observaciones.toString().includes(searchTerm.toLowerCase()) ||
          reintegro.cantidad.toString().includes(searchTerm.toLowerCase())
        );
        setFilteredreintegros(reintegrosFiltrados);
      }
    }
  }, [reintegrosData, searchTerm]); // Actualizar cuando cambien los datos o el término de búsqueda

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda
  };

  const openModal = (reintegro) => {
    setFileUrl(reintegro.archivo); // Aquí asumo que `archivo` es la URL del archivo
    setIsModalOpen(true);
  };

  if (reintegrosLoading) return <p>Cargando...</p>;
  if (reintegrosError) return <p>{reintegrosError}</p>;

  return (
    <div style={{ textAlign: 'center' }}><br/>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginRight: '10px' }}>Lista Reintegros</h1>
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
              <th>Código</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Archivo</th>
              <th>Observaciones</th>
              <th>Fecha</th>
              <th>Admin</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredreintegros.length > 0 ? (filteredreintegros.map((reintegro) => (
              <tr key={reintegro.idbaja}>
                <td>{reintegro.elementos_idelemento}</td>
                <td>{reintegro.Elemento.descripcion}</td>
                <td>{reintegro.cantidad}</td>
                <td>{reintegro.archivo}</td>
                <td>{reintegro.observaciones}</td>
                <td>{reintegro.fecha}</td>
                <td>{reintegro.idadmin}</td>
                <td className="px-4 py-2">
                <button onClick={() => openModal(reintegro)} className="bg-black text-white px-4 py-1 rounded-md">
                    Ver
                </button>
            </td>
              </tr>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="8">No hay reintegros</TableCell>
            </TableRow>
          )}
          </tbody>
        </table>
      </div>
      <ModalArchivo 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            fileUrl={fileUrl} 
      />
    </div>
  );
};

export default Reintegros;
