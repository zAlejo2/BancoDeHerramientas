import React, { useState } from 'react';

const ListComponent = ({
    data, // Datos de la lista
    columns, // Definición de las columnas (etiquetas)
    renderRow, // Función para renderizar cada fila
    searchKeys, // Llaves para realizar la búsqueda
    title, // Título por defecto
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrar los datos según el término de búsqueda
    const filteredData = data?.filter((item) =>
        searchKeys.some((key) => {
            // Manejo para buscar en item.Elemento.descripcion
            if (key === 'Elemento.descripcion') {
                return item.Elemento?.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
    );

    return (
        <div className="p-2">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black p-4 mb-4">{title}</h1>

                {/* Buscador */}
                <input
                    type="text"
                    className="border-2 border-black p-2 w-1/3 mb-4 rounded-md"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Tabla genérica con scroll vertical y horizontal */}
            <div className="overflow-x-auto">
                <div className="max-h-[400px] max-w-[1000px] overflow-y-auto overflow-x-auto">
                    <table className="min-w-full bg-white border border-black">
                        <thead>
                            <tr>
                                {columns.map((col, index) => (
                                    <th key={index} className="px-1 py-0 bg-black text-white">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData?.length > 0 ? (
                                filteredData.map(renderRow)
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-4">
                                        No hay registros
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListComponent;
