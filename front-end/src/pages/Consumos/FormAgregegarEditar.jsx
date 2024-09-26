import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import useSearchElements from "../../hooks/useSearchElements";
import usePostData from "../../hooks/usePostData";
import useDeleteData from "../../hooks/useDeleteData";
import { useParams } from "react-router-dom";
import '../../assets/formAgregarEditarStyles.css'; 

export const FormAgregarEditarConsumo = () => {
    const { idconsumo } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const { deleteData, data, isLoading, error } = useDeleteData(`consumos/${idconsumo}`, '/consumos');

    const handleDelete = () => {
        deleteData();
    };

    const { data: searchResults = [], error: searchError, loading: searchLoading } = useSearchElements(searchTerm);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddItem = (item) => {
        setSelectedItems((prevItems) => {
            // Verifica si el elemento ya existe en la lista
            const itemExists = prevItems.find((selectedItem) => selectedItem.idelemento === item.idelemento);
    
            if (itemExists) {
                // Si el elemento ya está en la lista, incrementa la cantidad actual en 1
                return prevItems.map((selectedItem) =>
                    selectedItem.idelemento === item.idelemento
                        ? { ...selectedItem, cantidad: parseInt(selectedItem.cantidad, 10) + 1 }
                        : selectedItem
                );
            }
    
            // Si el elemento no está en la lista, lo agrega con cantidad 1
            return [
                ...prevItems,
                { ...item, cantidad: 1, cantidadd: 0, observaciones: "", checked: false }
            ];
        });
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

    const handleDeleteSelected = () => {
        setSelectedItems((prevItems) =>
            prevItems.filter((item) => !item.checked)
        );
    };

    const elementos = selectedItems.map(({ idelemento, cantidad, observaciones }) => ({
        idelemento,
        cantidad,
        observaciones
    }));

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (searchResults.length > 0) {
                handleAddItem(searchResults[0]); // Agregar el primer elemento de la búsqueda
            }
        }
    };

    const handleSave = usePostData(`consumos/addElements/${idconsumo}`, () => {}, { elementos }, {},`/consumos`);

    return (
        <div className="form-container">
            <h1 className="text-center my-2 mb-8 text-xl font-bold">Formulario de Consumo</h1>
            <div className="container">
                <div className="search-results-container">
                    <label htmlFor="search" className="block text-neutral-500">
                        Busca el elemento que deseas agregar al consumo
                    </label>
                    <input
                        type="text"
                        id="search"
                        name="search"
                        placeholder="Nombre del elemento"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyPress}
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
                                            min="1"
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
                        onClick={handleSave}
                    >
                        Guardar Consumo
                    </button>
                    <button
                        type="button"
                        className="consume-button"
                        onClick={handleDelete} disabled={isLoading}>
                        {isLoading ? 'Cancelar...' : 'Cancelar Consumo'}                    
                    </button>
                </div>
            </div>
        </div>
    );
};
