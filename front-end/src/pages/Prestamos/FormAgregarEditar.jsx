import React, { useState } from "react";
import useSearchElements from "../../hooks/useSearchElements";
import usePostData from "../../hooks/usePostData.jsx";
import useGetData from "../../hooks/useGetData.jsx";
import useDeleteData from "../../hooks/useDeleteData";
import { useParams } from "react-router-dom";
import '../../assets/formAgregarEditarStyles.css'; 
import axiosInstance from "../../helpers/axiosConfig.js";

export const FormAgregarEditarPrestamo = () => {
    const { idprestamo } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const { deleteData, data, isLoading, error } = useDeleteData(`prestamos/${idprestamo}`, '/inicio');

    // const elementosEnPrestamo = axiosInstance.get(`${import.meta.env.VITE_API_URL}/prestamos/${idprestamo}/elementos`);
    // console.log(elementosEnPrestamo)

    const handleDelete = () => {
        deleteData();
    };

    const { data: searchResults = [], error: searchError, loading: searchLoading } = useSearchElements(searchTerm);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddItem = (item) => {
        const itemExists = selectedItems.some(selectedItem => selectedItem.idelemento === item.idelemento);
        
        if (itemExists) {
            console.log("El elemento ya está en la lista.");
            return; // No hacer nada si el elemento ya está en la lista
        }
    
        console.log("Elemento agregado:", item);
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

    const handleSave = usePostData(`prestamos/addElements/${idprestamo}`, () => {}, { elementos }, {},`/prestamos/elementos/${idprestamo}`);

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
                                <th>Fecha En</th>
                                <th>Fecha Dev</th>
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
                                    <td>{item.fecha_entrega}</td>
                                    <td>{item.fecha_devolucion}</td>
                                    <td>
                                        <button 
                                            type="button"
                                            className="delete-button"
                                            onClick={() =>
                                                setSelectedItems((prevItems) =>
                                                    prevItems.filter((i) => i.idelemento !== item.idelemento)
                                                )
                                            }
                                        >
                                            Eliminar
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