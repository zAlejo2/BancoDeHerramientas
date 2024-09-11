import React, { useState } from 'react';
import useGetData from '@/hooks/useGetData';
import useUpdate from '@/hooks/useUpdate';
import { ElementosModal } from '@/components/elementos/Modal'; 

const ElementosList = () => {
    const { data, error, loading } = useGetData(['elements']);
    const { updateEntity } = useUpdate('/elements', '/'); // Hook para actualizar, pasando la URL base correctamente
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedElement, setSelectedElement] = useState(null); // Estado para manejar el elemento seleccionado
    const [isModalOpen, setIsModalOpen] = useState(false); // Controla la visibilidad de la modal
    const itemsPerPage = 10;

    if (loading) {
        return <p className="text-center text-lg">Cargando datos...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    // Filtrar los datos según el término de búsqueda
    const filteredData = data.elements?.filter((item) =>
        item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.estado.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Obtener los elementos de la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData?.slice(startIndex, startIndex + itemsPerPage);

    // Calcular el número total de páginas
    const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

    // Abrir modal con el elemento seleccionado
    const openModal = (element) => {
        setSelectedElement(element);
        setIsModalOpen(true);
    };

    // Cerrar modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedElement(null);
    };

    // Manejar los cambios en los inputs de la modal
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedElement((prevElement) => ({
            ...prevElement,
            [name]: value,
        }));
    };

    // Actualizar elemento cuando se presiona "Guardar Cambios"
    const handleUpdate = async () => {
        if (selectedElement) {
            await updateEntity(selectedElement.idelemento, selectedElement); // Llamar correctamente al hook para actualizar
            closeModal();
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-white bg-black p-4 mb-4">Lista de Elementos</h1>

            {/* Buscador */}
            <input
                type="text"
                className="border border-gray-300 p-2 w-full mb-4 rounded-md"
                placeholder="Buscar por descripción, ubicación, tipo o estado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Tabla de elementos */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 bg-black text-white">ID</th>
                            <th className="px-4 py-2 bg-black text-white">Descripción</th>
                            <th className="px-4 py-2 bg-black text-white">Cantidad</th>
                            <th className="px-4 py-2 bg-black text-white">Disponibles</th>
                            <th className="px-4 py-2 bg-black text-white">Ubicación</th>
                            <th className="px-4 py-2 bg-black text-white">Tipo</th>
                            <th className="px-4 py-2 bg-black text-white">Estado</th>
                            <th className="px-4 py-2 bg-black text-white">Mínimo</th>
                            <th className="px-4 py-2 bg-black text-white">Área</th>
                            <th className="px-4 py-2 bg-black text-white">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData?.map((elemento) => (
                            <tr key={elemento.idelemento} className="border-b">
                                <td className="px-4 py-2">{elemento.idelemento}</td>
                                <td className="px-4 py-2">{elemento.descripcion}</td>
                                <td className="px-4 py-2">{elemento.cantidad}</td>
                                <td className="px-4 py-2">{elemento.disponibles}</td>
                                <td className="px-4 py-2">{elemento.ubicacion}</td>
                                <td className="px-4 py-2">{elemento.tipo}</td>
                                <td className="px-4 py-2">{elemento.estado}</td>
                                <td className="px-4 py-2">{elemento.minimo}</td>
                                <td className="px-4 py-2">{elemento.areas_idarea}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => openModal(elemento)}
                                        className="bg-black text-white px-4 py-2 rounded-md"
                                    >
                                        Modificar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                
                <span className="text-gray-700">
                    Página {currentPage} de {totalPages}
                </span>

                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <ElementosModal
                    selectedElement={selectedElement}
                    handleInputChange={handleInputChange}
                    handleUpdate={handleUpdate}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default ElementosList;
