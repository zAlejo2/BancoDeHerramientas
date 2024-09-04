import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import useSearchElements from "../../hooks/useSearchElements";
import usePostData from "../../hooks/usePostData.jsx";
import useDeleteData from "../../hooks/useDeleteData";
import { useParams } from "react-router-dom";
import '../../assets/formAgregarEditarStyles.css'; 
import axiosInstance from "../../helpers/axiosConfig.js";
import { MdMargin } from "react-icons/md";

export const FormAgregarEditarPrestamo = () => {
    const { idprestamo } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const { deleteData, isLoading, error } = useDeleteData(`prestamos/${idprestamo}`, '/inicio');

    const handleDelete = async () => {
        try {
            await deleteData();  // Llama a la función deleteData que ya tienes configurada.
            console.log("Préstamo eliminado con éxito.");
        } catch (error) {
            console.error("Error al eliminar el préstamo:", error);
        }
    };
    
    useEffect(() => {
        const fetchExistingLoan = async () => {
            try {
                const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/prestamos/${idprestamo}/elementos`, { documento: idprestamo });
                const { idprestamo: idprestamo2, elementos } = response.data;
                // Asegúrate de usar 'idprestamo2' después de esta línea
                setSelectedItems(elementos.map(({ elemento, cantidad, observaciones, fecha_entregaFormato, fecha_devolucionFormato, estado }) => ({
                    idelemento: elemento.idelemento,
                    descripcion: elemento.descripcion,
                    cantidad,
                    observaciones,
                    fecha_entregaFormato,
                    fecha_devolucionFormato,
                    estado
                })));
            } catch (error) {
                console.error('Error al obtener el préstamo existente:', error);
            }
        };
    
        fetchExistingLoan();
    }, [idprestamo]);
    

    const { data: searchResults = [], error: searchError, loading: searchLoading } = useSearchElements(searchTerm);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddItem = (item) => {
        const itemExists = selectedItems.some(selectedItem => selectedItem.idelemento === item.idelemento);
        
        if (itemExists) {
            console.log("El elemento ya está en la lista.");
            return;
        }
    
        setSelectedItems((prevItems) => [
            ...prevItems,
            { ...item, cantidad: 1, observaciones: "", checked: false }
        ]);
    };    

    const handleQuantityChange = (idelemento, quantity) => {
        setSelectedItems((prevItems) =>
            prevItems.map((item) =>
                item.idelemento === idelemento
                    ? { ...item, cantidad: quantity }
                    : item
            )
        );
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

    const elementos = selectedItems.map(({ idelemento, cantidad, observaciones }) => ({
        idelemento,
        cantidad,
        observaciones
    }));

    const handleSave = usePostData(`prestamos/addElements/${idprestamo}`, () => {}, { elementos }, {},'/inicio');

    return (
        <div className="form-container">
            <h1 className="text-center my-2 mb-8 text-xl font-bold">Formulario de Prestamo</h1>
            <div className="container">
                <div className="search-results-container">
                    <label htmlFor="search" className="block text-neutral-500">
                        Busca el elemento que deseas agregar al préstamo
                    </label>
                    <input
                        type="text"
                        id="search"
                        name="search"
                        placeholder="Nombre del elemento"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="input-field"
                    />
                    {searchLoading && <p>Cargando...</p>}
                    {searchError && <p>Error: {searchError}</p>}
                    <div className="search-results">
                        {Array.isArray(searchResults) && searchResults.map((item) => (
                            <div
                                key={item.idelemento}
                                className="search-result-item"
                                onClick={() => handleAddItem(item)}
                            >
                                <span className="search-result-text">{item.descripcion}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="table-container">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th>Elemento</th>
                                <th>Cantidad</th>
                                <th>Observaciones</th>
                                <th>Entrega</th>
                                <th>Devolución</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedItems.map((item) => (
                                <tr key={item.idelemento}>
                                    <td>{item.descripcion}</td>
                                    <td>
                                        <input className="input"
                                            type="number"
                                            value={item.cantidad}
                                            onChange={(e) =>
                                                handleQuantityChange(item.idelemento, e.target.value)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input className="input"
                                            type="text"
                                            value={item.observaciones}
                                            onChange={(e) =>
                                                handleObservationsChange(item.idelemento, e.target.value)
                                            }
                                        />
                                    </td>
                                    <td>{item.fecha_entregaFormato}</td>
                                    <td>{item.fecha_devolucionFormato}</td>
                                    <td>{item.estado}</td>
                                    <td>                                        
                                        <button 
                                            type="button"
                                            className="delete-button"
                                            onClick={() =>
                                                setSelectedItems((prevItems) =>
                                                    prevItems.filter((i) => i.idelemento !== item.idelemento)
                                                )
                                            }
                                            style={{margin: '5px'}}
                                        >
                                            <FaCheck/>
                                        </button>
                                        <button 
                                            type="button"
                                            className="delete-button"
                                            onClick={() =>
                                                setSelectedItems((prevItems) =>
                                                    prevItems.filter((i) => i.idelemento !== item.idelemento)
                                                )
                                            }
                                            style={{margin: '5px'}}
                                        >
                                            <IoClose/>
                                        </button>
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
                        onClick={handleSave} // Cambia handleConsume a handleSave
                    >
                        Guardar Prestamo
                    </button>
                    <button
                        type="button"
                        className="consume-button"
                        onClick={handleDelete} disabled={isLoading}>
                        {isLoading ? 'Eliminando...' : 'Eliminar Prestamo'}                    
                    </button>
                </div>
            </div>
        </div>
    );
};
