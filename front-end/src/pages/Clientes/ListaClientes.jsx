import React, { useState } from 'react';
import useGetData from '@/hooks/useGetData';
import useUpdate from '@/hooks/useUpdate';
import ListComponent from '@/components/listas/ListComponent';
import ModalComponent from '@/components/listas/Modal';

const Clientes = () => {
    const { data } = useGetData(['clients']);
    const { updateEntity } = useUpdate('/clients', '/usuarios/lista');
    const [selectedClient, setSelectedClient] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = ['Documento', 'Nombre', 'Correo', 'Fecha inicio', 'Fecha fin', 'Observaciones', 'Telefono', 'Grupo', 'Foto', ''];

    const renderRow = (cliente) => (
        <tr key={cliente.documento} className="border-b">
            <td className="px-4 py-2">{cliente.documento}</td>
            <td className="px-4 py-2">{cliente.nombre}</td>
            <td className="px-4 py-2">{cliente.correo}</td>
            <td className="px-4 py-2">{cliente.fechaInicio}</td>
            <td className="px-4 py-2">{cliente.fechaFin}</td>
            <td className="px-4 py-2">{cliente.observaciones}</td>
            <td className="px-4 py-2">{cliente.numero}</td>
            <td className="px-4 py-2">{cliente.roles_idrol}</td>
            <td className="px-4 py-2">
                {cliente.foto ? (
                    <img
                        src={`${import.meta.env.VITE_IMAGENES_URL}/${cliente.foto}`}
                        alt={`Foto de ${cliente.foto}`}
                        className="h-16 w-16 object-cover"
                    />
                ) : (
                    <span>No imagen</span>
                )}
            </td>
            <td className="px-4 py-2">
                <button onClick={() => openModal(cliente)} className="bg-black text-white px-4 py-2 rounded-md">
                    Ver
                </button>
            </td>
        </tr>
    );

    const openModal = (cliente) => {
        setSelectedClient(cliente);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedClient(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedClient((prevClient) => ({
            ...prevClient,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        await updateEntity(selectedClient.documento, selectedClient);
        closeModal();
    };

    const fields = [
        { label: 'Documento', name: 'documento', readOnly: true },
        { label: 'Nombre', name: 'nombre' },
        { label: 'Correo', name: 'correo', },
        { label: 'Fecha Inicio', name: 'fechaInicio', type: 'date' },
        { label: 'Fecha Fin', name: 'fechaFin', type: 'date' },
        { label: 'Observaciones', name: 'observaciones' },
        { label: 'Telefono', name: 'numero' },
        { label: 'Foto', name: 'foto', type: 'file' },
    ];

    return (
        <div>
            <ListComponent
                data={data?.clients}
                columns={columns}
                renderRow={renderRow}
                searchKeys={['documento', 'nombre', 'correo', 'fechaInicio', 'fechaFin', 'numero', 'observaciones']}
                title="Lista Clientes"
            />

            {isModalOpen && (
                <ModalComponent
                    item={selectedClient}
                    fields={fields}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleUpdate}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default Clientes;
