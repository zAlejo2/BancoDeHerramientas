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
        title: 'Ingrese los detalles de la reposición del daño',
        html: `
            <input type="number" id="cantidad" class="swal2-input border-1 border-gray-400" placeholder="Cantidad repuesta">
            <input type="text" id="observaciones" class="swal2-input border-1 border-gray-400" placeholder="Observaciones">
        `,
        showCancelButton: true,
        confirmButtonText: 'Reponer',
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
                    title: "La cantidad a reponer no puede ser mayor que la cantidad en daño ni menor que 1",
                    text: "Por favor verifique los datos.",
                    confirmButtonColor: '#FC3F3F'
                });
            }

            axiosInstance.post('danos/return', { iddano, idelemento, cantidadDevuelta: cantidadNum, observaciones, documento })
                .then(response => {
                    if (response.status === 200) {
                        location.reload();
                    }
                })
                .catch(error => {
                    Swal.fire(
                        'Hubo un problema al reponer el elemento.',
                        'Por favor recargue la página y vuelva a intentarlo',
                        'error'
                    );
                });
        }
    });
};

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
    </div>
  );
};

export default Danos;
