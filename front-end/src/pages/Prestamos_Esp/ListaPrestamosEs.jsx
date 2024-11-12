import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLoop } from "react-icons/md";
import useGetData from '../../hooks/useGetData';
import { TableCell, TableRow } from "@/components/ui/table";
import ModalArchivo from '@/components/listas/ModalArchivo';

const PrestamosEs = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado del término de búsqueda
  const navigate = useNavigate();
  const [filteredprestamoses, setFilteredprestamoses] = useState([]); // Estado de préstamos filtrados
  const inputRef = useRef(null); // Referencia al input para enfocarlo
  const { data: prestamosesData = [], error: prestamosesError, loading: prestamosesLoading } = useGetData(['prestamosEs']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  // Enfocar el input cuando el componente se monta
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Actualizar los préstamos filtrados cuando prestamosesData o searchTerm cambien
  useEffect(() => {
    if (prestamosesData && prestamosesData['prestamosEs']) {
      const prestamoses = prestamosesData['prestamosEs'];
      
      if (searchTerm === "") {
        setFilteredprestamoses(prestamoses); // Si no hay término de búsqueda, mostrar todos
      } else {
        // Filtrar préstamos por el término de búsqueda
        const prestamosesFiltrados = prestamoses.filter(prestamoes => 
          prestamoes.clientes_documento.toString().includes(searchTerm.toLowerCase())
        );
        setFilteredprestamoses(prestamosesFiltrados);
      }
    }
  }, [prestamosesData, searchTerm]); // Actualizar cuando cambien los datos o el término de búsqueda

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda
  };

  const openModal = (prestamoes) => {
    setFileUrl(prestamoes.archivo); // Aquí asumo que `archivo` es la URL del archivo
    setIsModalOpen(true);
  };

  // Función para manejar el clic y redirigir al detalle del préstamo
  const handleVerDetalles = (idprestamo) => {
    navigate(`/prestamosEs/${idprestamo}/detalle`); // Navega al componente de detalle
  };

  if (prestamosesLoading) return <p>Cargando...</p>;
  if (prestamosesError) return <p>{prestamosesError}</p>;

  return (
    <div style={{ textAlign: 'center' }}><br/>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginRight: '10px' }}>Préstamos Especiales</h1>    
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
              <th>Documento</th>
              <th>Nombre</th>
              <th>Fecha Inicio</th>
              <th>Fech Fin</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredprestamoses.length > 0 ? (filteredprestamoses.map((prestamoes) => (
              <tr key={prestamoes.idprestamo}>
                <td>{prestamoes.idprestamo}</td>
                <td>{prestamoes.clientes_documento}</td>
                <td>{prestamoes.Cliente.nombre}</td>
                <td>{prestamoes.fecha_inicio}</td>
                <td>{prestamoes.fecha_fin}</td>
                <td className="px-4 py-2">
                <button onClick={() => openModal(prestamoes)} className="bg-black text-white px-3 py-1 rounded-md m-1">
                    Archivo
                </button>
                <button onClick={() => handleVerDetalles(prestamoes.idprestamo)} className="bg-black text-white px-3 py-1 rounded-md m-1">
                    Ver
                </button>
            </td>
              </tr>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="9">No hay préstamos especiales</TableCell>
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

export default PrestamosEs;
