import React, { useState } from 'react';
import useGetData from '@/hooks/useGetData';
import useUpdate from '@/hooks/useUpdate';
import ListComponent from '@/components/listas/ListComponent';
import ModalComponent from '@/components/listas/Modal';

const Roles = () => {
    const { data } = useGetData(['roles']);
    const { updateEntity } = useUpdate('/roles', '/roles/lista');
    const [selectedRol, setSelectedRol] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = ['Codigo Grupo', 'Descripcion', 'Acciones'];

    const renderRow = (rol) => (
        <tr key={rol.idrol} className="border-b">
            <td className="px-4 py-2">{rol.idrol}</td>
            <td className="px-4 py-2">{rol.descripcion}</td>
            <td className="px-4 py-2">
                <button onClick={() => openModal(rol)} className="bg-black text-white px-4 py-2 rounded-md">
                    Modificar
                </button>
            </td>
        </tr>
    );

    const openModal = (rol) => {
        setSelectedRol(rol);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRol(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedRol((prevRol) => ({
            ...prevRol,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        await updateEntity(selectedRol.idrol, selectedRol);
        closeModal();
    };

    const fields = [
        { label: 'Id', name: 'idrol', readOnly: true },
        { label: 'Descripcion', name: 'descripcion' },  
    ];

    return (
        <div>
            <ListComponent
                data={data?.roles}
                columns={columns}
                renderRow={renderRow}
                searchKeys={['idrol', 'descripcion']}
                title="Lista Grupos"
            />

            {isModalOpen && (
                <ModalComponent
                    item={selectedRol}
                    fields={fields}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleUpdate}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default Roles;
