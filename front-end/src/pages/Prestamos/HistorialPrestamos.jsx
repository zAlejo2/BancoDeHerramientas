import React, { useState } from 'react';
import useGetData from '@/hooks/useGetData';
import ListComponent from '@/components/listas/ListComponent';
// FALTA QUE FILTRE SOLO POR PRESTAMOS
const HistorialPrestamos = () => {
    const { data } = useGetData(['historial']);

    const columns = ['Código Pres', 'Documento', 'Elemento', 'Cantidad', 'Observaciones', 'Estado', 'Acción', 'DocumentoAdmin', 'Fecha'];

    const renderRow = (historial) => (
        <tr key={historial.id_historial} className="border-b">
            <td className="px-4 py-2">{historial.entidad_id}</td>
            <td className="px-4 py-2">{historial.cliente_id}</td>
            <td className="px-4 py-2">{historial.elemento_id}</td>
            <td className="px-4 py-2">{historial.cantidad}</td>
            <td className="px-4 py-2">{historial.observaciones}</td>
            <td className="px-4 py-2">{historial.estado}</td>
            <td className="px-4 py-2">{historial.accion}</td>
            <td className="px-4 py-2">{historial.admin_id}</td>
            <td className="px-4 py-2">{historial.fecha_accion}</td>
        </tr>
    );

    return (
        <div>
            <ListComponent
                data={data?.historial}
                columns={columns}
                renderRow={renderRow}
                searchKeys={['entidad_id', 'cliente_id', 'elemento_id', 'cantidad', 'observaciones', 'estado', 'accion', 'admin_id', 'fecha_accion']}
                title="Historial de Préstamos"
            />
        </div>
    );
};

export default HistorialPrestamos;
