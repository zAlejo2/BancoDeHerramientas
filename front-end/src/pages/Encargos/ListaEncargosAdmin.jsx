import React, { useState, useEffect } from 'react';
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import useGetData from '@/hooks/useGetData';
import Swal from 'sweetalert2';
import axiosInstance from '@/helpers/axiosConfig';
import ListComponent from '@/components/listas/ListComponent';

const ListaEncargosAdmin = () => {
    const { data, loading, errorData } = useGetData(['encargos/admin']);
    const [encargos, setEncargos] = useState([]);
    const [EncargosAceptados, setEncargosAceptados] = useState([]);
    const [observaciones, setObservaciones] = useState({}); // Estado para las observaciones

    useEffect(() => {
        if (data['encargos/admin']) { 
            const pendingEncargos = data['encargos/admin'].filter(encargo => encargo.estado === 'pendiente');
            setEncargos(pendingEncargos);
            const acceptedEncargos = data['encargos/admin'].filter(encargo => encargo.estado === 'aceptado')
            setEncargosAceptados(acceptedEncargos);

            // Inicializa las observaciones con los valores actuales
            const initialObservaciones = {};
            pendingEncargos.forEach(encargo => {
                const key = `${encargo.encargos_idencargo}_${encargo.elementos_idelemento}`;
                initialObservaciones[key] = encargo.observaciones || '';
            });
            setObservaciones(initialObservaciones);
        }
    }, [data]);

    if (loading) return <p>Cargando...</p>;
    if (errorData) return <p>Error: {errorData.message}</p>;

    const handleReject = async (id, elemento) => {
        const key = `${id}_${elemento}`;
        const observacion = observaciones[key]; // Obtén la observación correspondiente
        try {
            await axiosInstance.post(`${import.meta.env.VITE_API_URL}/encargos/rechazar/${id}`, { elemento, observaciones: observacion });
            setEncargos(prevEncargos => prevEncargos.filter(encargo => !(encargo.encargos_idencargo === id && encargo.elementos_idelemento === elemento)));
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "Error inesperado";
            Swal.fire({
                icon: "error",
                title: mensaje,
                text: "Por favor verifique los datos.",
                confirmButtonColor: '#FC3F3F',
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup'
                }
            }).then(() => { location.reload(); });
        }
    };

    const handleAceptar = async (encargo) => {
        const { encargos_idencargo, elementos_idelemento } = encargo;
        const key = `${encargos_idencargo}_${elementos_idelemento}`;
        const observacion = observaciones[key];
        try {
            await axiosInstance.post(`${import.meta.env.VITE_API_URL}/encargos/aceptar/${encargos_idencargo}`, { elemento: elementos_idelemento, observaciones: observacion });
            // Actualiza el estado
            setEncargosAceptados(prev => [...prev, { ...encargo, observaciones }]);
            setEncargos(prev => prev.filter(e => !(e.encargos_idencargo === encargos_idencargo && e.elementos_idelemento === elementos_idelemento)));

        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "Error inesperado";
            Swal.fire({
                icon: "error",
                title: mensaje,
                text: "Por favor verifique los datos.",
                confirmButtonColor: '#FC3F3F',
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup'
                }
            }).then(() => { location.reload(); });
        }
    };

    const handleCancelAceptar = async (encargo) => {
        const { encargos_idencargo, elementos_idelemento } = encargo;
        const key = `${encargos_idencargo}_${elementos_idelemento}`;
        const observacion = observaciones[key];
        try {
            await axiosInstance.post(`${import.meta.env.VITE_API_URL}/encargos/cancel-aceptar/${encargos_idencargo}`, { elemento: elementos_idelemento, observaciones: observacion });

            setEncargosAceptados(prev => prev.filter(e => !(e.encargos_idencargo === encargos_idencargo && e.elementos_idelemento === elementos_idelemento)));
            setEncargos(prev => [...prev, { ...encargo, estado: 'pendiente' }]);

        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "Error inesperado";
            Swal.fire({
                icon: "error",
                title: mensaje,
                text: "Por favor verifique los datos.",
                confirmButtonColor: '#FC3F3F',
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup'
                }
            }).then(() => { location.reload(); });
        }
    };

    const handleReclamar = async (id, elemento, cantidad) => {
        const key = `${id}_${elemento}`;
        const observacion = observaciones[key]; // Obtén la observación correspondiente
        try {
            await axiosInstance.post(`${import.meta.env.VITE_API_URL}/encargos/reclamar/${id}`, { elemento, observaciones: observacion, cantidad });
            setEncargosAceptados(prevEncargos => prevEncargos.filter(encargo => !(encargo.encargos_idencargo === id && encargo.elementos_idelemento === elemento)));
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "Error inesperado";
            Swal.fire({
                icon: "error",
                title: mensaje,
                text: "Por favor verifique los datos.",
                confirmButtonColor: '#FC3F3F',
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup'
                }
            }).then(() => { location.reload(); });
        }
    };

    const handleObservationsChange = (id, elemento, value) => {
        const key = `${id}_${elemento}`;
        setObservaciones(prev => ({ ...prev, [key]: value })); // Actualiza el estado de observaciones
    };

    const renderRow = (encargo) => (
        <tr key={encargo.encargos_idencargo} className="border-b">
            <td className="px-4 py-2">{encargo.Encargo.clientes_documento}</td>
            <td className="px-4 py-2">{encargo.Encargo.Cliente.nombre}</td>
            <td className="px-4 py-2">{encargo.Encargo.correo}</td>
            <td className="px-4 py-2">{encargo.Encargo.numero}</td>
            <td className="px-4 py-2">{encargo.fecha_pedido}</td>
            <td className="px-4 py-2">{encargo.fecha_reclamo}</td>
            <td className="px-4 py-2">{encargo.Elemento.descripcion}</td>
            <td className="px-4 py-2">{encargo.cantidad}</td>
            <td className="px-4 py-2">
                <textarea 
                    type="text" 
                    style={{maxWidth: '100px'}}
                    value={observaciones[`${encargo.encargos_idencargo}_${encargo.elementos_idelemento}`] || ''} // Usa el estado local
                    onChange={(e) => handleObservationsChange(encargo.encargos_idencargo, encargo.elementos_idelemento, e.target.value)} // Actualiza la observación
                />
            </td>
            <td className="px-4 py-2">
                <button className="bg-black text-white px-2 py-1 rounded-md" onClick={() => handleAceptar(encargo)}>
                    <FaCheck />
                </button>
                <button className="bg-black text-white px-2 py-1 rounded-md" onClick={() => handleReject(encargo.encargos_idencargo, encargo.elementos_idelemento)}>
                    <IoClose />
                </button>
            </td>
        </tr>
    );

    const renderRowAceptados = (encargo) => (
        <tr key={encargo.encargos_idencargo} className="border-b">
            <td className="px-4 py-2">{encargo.Encargo.clientes_documento}</td>
            <td className="px-4 py-2">{encargo.Encargo.Cliente.nombre}</td>
            <td className="px-4 py-2">{encargo.Encargo.correo}</td>
            <td className="px-4 py-2">{encargo.Encargo.numero}</td>
            <td className="px-4 py-2">{encargo.fecha_pedido}</td>
            <td className="px-4 py-2">{encargo.fecha_reclamo}</td>
            <td className="px-4 py-2">{encargo.Elemento.descripcion}</td>
            <td className="px-4 py-2">{encargo.cantidad}</td>
            <td className="px-4 py-2">
                <textarea 
                    type="text" 
                    style={{maxWidth: '100px'}}
                    value={observaciones[`${encargo.encargos_idencargo}_${encargo.elementos_idelemento}`] || ''} // Usa el estado local
                    onChange={(e) => handleObservationsChange(encargo.encargos_idencargo, encargo.elementos_idelemento, e.target.value)} // Actualiza la observación
                />
            </td>
            <td className="px-4 py-2">
                <button className="bg-black text-white px-2 py-1 rounded-md m-1" onClick={() => handleReclamar(encargo.encargos_idencargo, encargo.elementos_idelemento, encargo.cantidad)}>
                    Reclamar
                </button>
                <button className="bg-black text-white px-2 py-1 rounded-md" onClick={() => handleCancelAceptar(encargo)}>
                    Cancelar
                </button>
            </td>
        </tr>
    );

    return (
        <div>
            <div>
                <ListComponent
                    data={encargos}
                    columns={['Documento', 'Nombre', 'Correo', 'Número', 'Fecha Pedido', 'Fecha Reclamo', 'Elemento', 'Cantidad', 'Observaciones', '']}
                    renderRow={renderRow}
                    searchKeys={['Elemento', 'Elemento.descripcion', 'cantidad', 'area_nombre', 'observaciones']}
                    title="Encargos Pendientes"
                />
            </div>
            <div>
                <ListComponent
                    data={EncargosAceptados}
                    columns={['Documento', 'Nombre', 'Correo', 'Número', 'Fecha Pedido', 'Fecha Reclamo', 'Elemento', 'Cantidad', 'Observaciones', '']}
                    renderRow={renderRowAceptados}
                    searchKeys={['Elemento', 'Elemento.descripcion', 'cantidad', 'area_nombre', 'observaciones']}
                    title="Encargos Aceptados"
                />
            </div>
        </div>
    );
};

export default ListaEncargosAdmin;
