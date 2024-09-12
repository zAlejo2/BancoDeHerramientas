import React, { useState } from 'react';
import useGetData from '@/hooks/useGetData';
import useUpdate from '@/hooks/useUpdate';
import ListComponent from '@/components/listas/ListComponent';
import ModalComponent from '@/components/listas/Modal';

const Admin = () => {
    const { data } = useGetData(['admins']);
    const { updateEntity } = useUpdate('/admins', '/');
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = ['Documento', 'Nombre', 'Tipo', 'Área', 'Acciones'];

    const renderRow = (admin) => (
        <tr key={admin.documento} className="border-b">
            <td className="px-4 py-2">{admin.documento}</td>
            <td className="px-4 py-2">{admin.nombre}</td>
            <td className="px-4 py-2">{admin.tipo}</td>
            <td className="px-4 py-2">{admin.areas_idarea}</td>
            <td className="px-4 py-2">
                <button onClick={() => openModal(admin)} className="bg-black text-white px-4 py-2 rounded-md">
                    Modificar
                </button>
            </td>
        </tr>
    );

    const openModal = (admin) => {
        setSelectedAdmin(admin);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAdmin(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedAdmin((prevAdmin) => ({
            ...prevAdmin,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        await updateEntity(selectedAdmin.documento, selectedAdmin);
        closeModal();
    };

    const fields = [
        { label: 'Documento', name: 'documento', readOnly: true },
        { label: 'Nombre', name: 'nombre' },
        { 
            label: 'Tipo', 
            name: 'tipo', 
            type: 'select', // Indicamos que es un select
            options: [ // Agregamos las opciones
                { label: 'Administrador', value: 'admin' },
                { label: 'Practicante', value: 'practicante' },
                { label: 'Contratista', value: 'contratista' }
            ] 
        },    ];

    return (
        <div>
            <ListComponent
                data={data?.admins}
                columns={columns}
                renderRow={renderRow}
                searchKeys={['documento', 'nombre', 'tipo', 'areas_idarea']}
            />

            {isModalOpen && (
                <ModalComponent
                    item={selectedAdmin}
                    fields={fields}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleUpdate}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default Admin;
