import React, { useState } from 'react';

const ListComponent = ({
    data, // Datos de la lista
    columns, // Definición de las columnas (etiquetas)
    renderRow, // Función para renderizar cada fila
    searchKeys, // Llaves para realizar la búsqueda
    itemsPerPage = 10, // Opcional: número de elementos por página
    title, // Título por defecto
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Filtrar los datos según el término de búsqueda
    const filteredData = data?.filter((item) =>
        searchKeys.some((key) =>
            item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Obtener los elementos de la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData?.slice(startIndex, startIndex + itemsPerPage);

    // Calcular el número total de páginas
    const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

    return (
        <div className="p-4">
            <div className='flex justify-between items-center'>
            <h1 className="text-2xl font-bold text-black p-4 mb-4">{title}</h1>

            {/* Buscador */}
            <input
                type="text"
                className="border border-black p-2 w-1/3 mb-4 rounded-md"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            /> </div>

            {/* Tabla genérica */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} className="px-4 py-2 bg-black text-white">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData?.map(renderRow)}
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
                <span className="text-gray-700">Página {currentPage} de {totalPages}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default ListComponent;
