import React from 'react';

export const ElementosModal = ({ selectedElement, handleInputChange, handleUpdate, closeModal }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdate();      
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg w-1/2">
                <h2 className="text-xl font-bold mb-4">Modificar Elemento</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label>ID</label>
                            <input
                                type="text"
                                name="idelemento"
                                value={selectedElement.idelemento}
                                className="border border-gray-300 p-2 w-full mb-4 rounded-md"
                                readOnly
                            />
                        </div>
                        <div>
                            <label>Descripción</label>
                            <input
                                type="text"
                                name="descripcion"
                                value={selectedElement.descripcion}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 w-full mb-4 rounded-md"
                            />
                        </div>
                        <div>
                            <label>Cantidad</label>
                            <input
                                type="number"
                                name="cantidad"
                                value={selectedElement.cantidad}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 w-full mb-4 rounded-md"
                            />
                        </div>
                        <div>
                            <label>Disponibles</label>
                            <input
                                type="number"
                                name="disponibles"
                                value={selectedElement.disponibles}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 w-full mb-4 rounded-md"
                            />
                        </div>
                        <div>
                            <label>Ubicación</label>
                            <input
                                type="text"
                                name="ubicacion"
                                value={selectedElement.ubicacion}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 w-full mb-4 rounded-md"
                            />
                        </div>
                        <div>
                            <label>Tipo</label>
                            <input
                                type="text"
                                name="tipo"
                                value={selectedElement.tipo}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 w-full mb-4 rounded-md"
                            />
                        </div>
                        <div>
                            <label>Estado</label>
                            <input
                                type="text"
                                name="estado"
                                value={selectedElement.estado}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 w-full mb-4 rounded-md"
                            />
                        </div>
                        <div>
                            <label>Mínimo</label>
                            <input
                                type="number"
                                name="minimo"
                                value={selectedElement.minimo}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 w-full mb-4 rounded-md"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            className="bg-gray-600 text-white px-4 py-2 rounded-md mr-2"
                            onClick={closeModal}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-black text-white px-4 py-2 rounded-md"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
