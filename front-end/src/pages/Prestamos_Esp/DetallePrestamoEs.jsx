import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import usePostDataFile from "@/hooks/usePostDataImage";
import axiosInstance from "../../helpers/axiosConfig.js";
import '../../assets/formAgregarEditarStyles.css'; 

const DetallePrestamoEs = () => {
    const { idprestamo } = useParams();
    const [selectedItems, setSelectedItems] = useState([]);
    const [prestamoDetails, setPrestamoDetails] = useState([]);
    const [documento, setDocumento] = useState('');
    const [nombre, setNombre] = useState('');
    const [grupo, setGrupo] = useState('');
    const [fecha_inicio, setFechaInicio] = useState('');
    const [fecha_fin, setFechaFin] = useState('');
    const [archivo, setArchivo] = useState(null);

    const toggleEstado = (item, estadoDeseado) => {
        return item.estado === estadoDeseado ? { ...item, estado: 'actual' } : { ...item, estado: estadoDeseado };
    };

    const handleReturnAll = () => {
        setSelectedItems((prevItems) =>
            prevItems.map((item) =>
                item.fecha_entregaFormato // Solo para los elementos con fecha de entrega
                    ? { ...item, cantidadd: item.cantidad, estado: 'finalizado' } // Actualiza `cantidadd` con el valor de `cantidad`
                    : item
            )
        );
    };

    const handleMoraAll = () => {
        setSelectedItems((prevItems) =>
            prevItems.map((item) =>
                item.fecha_entregaFormato // Solo para los elementos con fecha de entrega
                    ? toggleEstado(item, 'mora')
                    : item
            )
        );
    };

    const handleDanoAll = () => {
        setSelectedItems((prevItems) =>
            prevItems.map((item) =>
                item.fecha_entregaFormato
                    ? toggleEstado(item, 'dano')
                    : item
            )
        );
    };

    const handleConsumoAll = () => {
        setSelectedItems((prevItems) =>
            prevItems.map((item) =>
                item.fecha_entregaFormato && item.tipo == 'consumible'// Solo para los elementos con fecha de entrega
                    ? toggleEstado(item, 'consumo')
                    : item
            )
        );
    };
    
    useEffect(() => {
        const fetchExistingLoan = async () => {
            try {
                const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/prestamosEs/${idprestamo}/elementos`, { documento: idprestamo });
                const { elementos, documento, nombre, grupo, loanExisting } = response.data;
                setPrestamoDetails(loanExisting);
                setDocumento(documento);
                setNombre(nombre);
                setGrupo(grupo);
                setFechaFin(loanExisting.fecha_fin);
                setFechaInicio(loanExisting.fecha_inicio);
                setSelectedItems(elementos.map(({ elemento, cantidad, observaciones, fecha_entregaFormato, fecha_devolucionFormato, estado }) => ({
                    idelemento: elemento.idelemento,
                    descripcion: elemento.descripcion,
                    cantidad,
                    cantidadd: 0,
                    observaciones,
                    fecha_entregaFormato,
                    fecha_devolucionFormato,
                    estado,
                    tipo: elemento.tipo,
                    dispoTotal : elemento.disponibles - elemento.minimo
                })));
            } catch (error) {
                console.error('Error al obtener el préstamo existente:', error);
            }
        };
    
        fetchExistingLoan();
    }, [idprestamo]);

    const handleQuantityDevChange = (idelemento, quantity) => {
        setSelectedItems((prevItems) => {
            const updatedItems = prevItems.map((item) =>
                item.idelemento === idelemento
                    ? { ...item, cantidadd: quantity}
                    : item
            );
            updateLoanStatus(updatedItems);
            return updatedItems;
        });
    };

    const handleObservationsChange = (idelemento, observations) => {
        setSelectedItems((prevItems) =>
            prevItems.map((item) =>
                item.idelemento === idelemento
                    ? { ...item, observaciones: observations }
                    : item
            )
        );
    };

    const handleFechaInicioChange = (e) => setFechaInicio(e.target.value); 
    const handleFechaFinChange = (e) => setFechaFin(e.target.value); 

    const handleFileChange = (e) => {
      setArchivo(e.target.files[0]); // Captura el primer archivo seleccionado
    };
  

    const updateLoanStatus = (items) => {
        setSelectedItems((prevItems) =>
            prevItems.map((item) => {
                const updatedItem = items.find((updated) => updated.idelemento === item.idelemento);
                if (updatedItem) {
                    if (updatedItem.manualStatus) {
                        return { ...updatedItem, estado: updatedItem.manualStatus };
                    }
                    if (updatedItem.cantidad == updatedItem.cantidadd) {
                        return { ...updatedItem, estado: 'finalizado' };
                    } else {
                        return { ...updatedItem, estado: 'actual' };
                    }
                }
                return item;
            })
        );
    };

    const handleManualStatusChange = (idelemento, status) => {
            setSelectedItems((prevItems) => {
                const updatedItems = prevItems.map((item) =>
                    item.idelemento === idelemento
                        ? { ...item, manualStatus: status, estado: status }
                        : item
                );
                return updatedItems;
            });
    };    

    const elementos = selectedItems.map(({ idelemento, cantidad, cantidadd, observaciones, estado }) => ({
        idelemento,
        cantidad,
        cantidadd,
        observaciones,
        estado
    }));

    // Crear el FormData
    const formData = new FormData();
    if (archivo) formData.append('archivo', archivo);
    formData.append('fecha_inicio', fecha_inicio);
    formData.append('fecha_fin', fecha_fin);
    formData.append('elementos', JSON.stringify(elementos));

    // Usar el hook con la URL, el FormData y la ruta de navegación después de la acción
    const handleSave = usePostDataFile(
      `prestamosEs/acciones/${idprestamo}`, // URL
      formData, // FormData
      '/prestamos_esp/lista' // Ruta después del éxito
    );
  
    return (
        <div className="form-container">
            <h1 className="text-center my-5 mb-8 text-xl font-bold">Préstamo Activo de {documento} (Nombre: {nombre} --- Grupo: {grupo})</h1>
            <div className="container">
                  <table className="mb-7">
                    <thead>
                      <tr>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Archivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>                                    
                          <input className="input"
                            type="date"
                            value={fecha_inicio}
                            onChange={handleFechaInicioChange}
                          />
                        </td>
                        <td>
                          <input className="input"
                            type="date"
                            value={fecha_fin}
                            onChange={handleFechaFinChange}
                          />
                        </td>
                        <td>
                          <input
                              type="file"
                              className="input ml-9"
                              onChange={handleFileChange}
                          />
                        </td>
                      </tr>
                    </tbody>
                   </table>
                <div className="table-container max-h-full overflow-y-auto overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descripción</th>
                                <th>Cantidad P</th>
                                <th>Observaciones</th>
                                <th>Cantidad Entrega</th>
                                <th>Estado</th>
                                <th>Enviar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedItems.map((item) => (
                                <tr key={item.idelemento}>
                                    <td>{item.idelemento}</td>
                                    <td>{item.descripcion}</td>
                                    <td>{item.cantidad}</td>              
                                    <td>
                                        <textarea className="input"
                                            type="text"
                                            value={item.observaciones}
                                            onChange={(e) =>
                                                handleObservationsChange(item.idelemento, e.target.value)
                                            }
                                        />
                                    </td>
                                    <td>
                                    <input className="input"
                                            type="number"
                                            value={item.cantidadd}
                                            onChange={(e) =>
                                                handleQuantityDevChange(item.idelemento, e.target.value)
                                            }
                                            disabled={item.estado == 'disponible'} 
                                            min="1"
                                    />               
                                    </td>
                                    <td>{item.estado}</td>
                                    <td>
                                    <select
                                            value={item.manualStatus || item.estado} // Default to automatic status if no manual status
                                            onChange={(e) => handleManualStatusChange(item.idelemento, e.target.value)}
                                            disabled={item.fecha_entregaFormato ? false : true || item.estado == 'finalizado'} // Disable if no date
                                            className="input"
                                        >
                                            <option></option>
                                            <option value="mora">mora</option>
                                            <option value="dano">daño</option>
                                            <option disabled={item.tipo == 'devolutivo'} value="consumo">consumo</option>
                                    </select> 
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-center">
                    <button
                        type="button"
                        className="consume-button"
                        onClick={handleSave} 
                    >
                        Guardar
                    </button>
                    <button
                        type="button"
                        className="consume-button"
                        onClick={handleReturnAll} // Cambiar la función
                    >
                        Devolver Todo 
                    </button>
                    <button
                        type="button"
                        className="consume-button"
                        onClick={handleMoraAll} // Cambiar la función
                    >
                        Todo a Mora 
                    </button>
                    <button
                        type="button"
                        className="consume-button"
                        onClick={handleDanoAll} // Cambiar la función
                    >
                        Todo a Daño 
                    </button>
                    <button
                        type="button"
                        className="consume-button"
                        onClick={handleConsumoAll} // Cambiar la función
                    >
                        Consumir Todo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetallePrestamoEs;