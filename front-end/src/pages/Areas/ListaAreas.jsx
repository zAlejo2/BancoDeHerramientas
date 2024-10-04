import React, { useState } from 'react';
import useGetData from '@/hooks/useGetData';
import useUpdate from '@/hooks/useUpdate';
import ListComponent from '@/components/listas/ListComponent';
import ModalComponent from '@/components/listas/Modal';
import useDeleteData from '@/hooks/useDeleteData';

const Areas = () => {
    const { data } = useGetData(['areas']);
    const { updateEntity } = useUpdate('/areas', '/areas/lista');
    const [selectedArea, setselectedArea] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idarea, setIdarea] = useState(null);
    const { deleteData, data: deleted, isLoading, error } = useDeleteData(`areas/${idarea}`, '/areas/lista');

    const columns = ['Codigo Área', 'Nombre', ''];

    const renderRow = (area) => (
        <tr key={area.idarea} className="border-b">
            <td className="px-4 py-2">{area.idarea}</td>
            <td className="px-4 py-2">{area.nombre}</td>
            <td className="px-4 py-2">
                <button onClick={() => openModal(area, area.idarea)} className="bg-black text-white px-4 py-2 rounded-md">
                    Ver
                </button>
            </td>
        </tr>
    );

    const openModal = (area, idarea) => {
        setselectedArea(area);
        setIdarea(idarea);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setselectedArea(null);
    };

    const handleDelete = () => {
        deleteData();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setselectedArea((prevArea) => ({
            ...prevArea,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        await updateEntity(selectedArea.idarea, selectedArea);
        closeModal();
    };

    const fields = [
        { label: 'Id', name: 'idarea', readOnly: true },
        { label: 'Nombre', name: 'nombre' },  
    ];

    return (
        <div>
            <ListComponent
                data={data?.areas}
                columns={columns}
                renderRow={renderRow}
                searchKeys={['idarea', 'nombre']}
                title="Lista Áreas"
            />

            {isModalOpen && (
                <ModalComponent
                    item={selectedArea}
                    fields={fields}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleUpdate}
                    handleDelete={handleDelete}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default Areas;
