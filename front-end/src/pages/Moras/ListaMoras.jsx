import { FaCheck } from "react-icons/fa";
import { useState, useEffect, useRef } from 'react';
import useGetData from '../../hooks/useGetData';
import { TableCell, TableRow } from "@/components/ui/table";
import axiosInstance from "@/helpers/axiosConfig";
import Swal from 'sweetalert2';

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

  const handleReturnMora = (idmora, idelemento, cantidad, observaciones, documento) => {
    Swal.fire({
      title: 'Ingrese los detalles de la devolución de la mora',
      html: `
          <input type="number" id="cantidad" class="swal2-input border-1 border-gray-400" placeholder="Cantidad devuelta">
          <input type="text" id="observaciones" class="swal2-input border-1 border-gray-400" placeholder="Observaciones">
      `,
      showCancelButton: true,
      confirmButtonText: 'Devolver',
      confirmButtonColor: '#007BFF',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#81d4fa',
      preConfirm: () => {
          const cantidadDevuelta = document.getElementById('cantidad').value;
          const observaciones = document.getElementById('observaciones').value;

          if (!cantidadDevuelta || cantidadDevuelta < 1) {
              Swal.showValidationMessage('Debe ingresar una cantidad válida.');
          }

          return { cantidadDevuelta, observaciones };
      }
    }).then((result) => {
      if (result.isConfirmed) {
          const { cantidadDevuelta, observaciones } = result.value;
          const cantidadNum = Number(cantidadDevuelta);

          if (cantidadNum > cantidad || cantidadNum < 1) {
              return Swal.fire({
                  icon: "error",
                  title: "La cantidad a devolver no puede ser mayor que la cantidad en mora ni menor que 1",
                  text: "Por favor verifique los datos.",
                  confirmButtonColor: '#FC3F3F'
              });
          }

          axiosInstance.post('moras/return', { idmora, idelemento, cantidadDevuelta: cantidadNum, observaciones, documento })
              .then(response => {
                  if (response.status === 200) {
                      location.reload();
                  }
              })
              .catch(error => {
                  Swal.fire(
                      'Hubo un problema al devolver el elemento.',
                      'Por favor recargue la página y vuelva a intentarlo',
                      'error'
                  );
              });
      }
    });
  }

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
                <td><button onClick={() => handleReturnMora(mora.idmora, mora.Elemento.idelemento, mora.cantidad, mora.observaciones, mora.Cliente.documento)}>
                  <FaCheck/>
                </button></td>
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
    </div>
  );
};

export default Moras;
