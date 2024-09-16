import React, { useState } from 'react';
import useGetData from '@/hooks/useGetData';
import useUpdate from '@/hooks/useUpdate';
import ListComponent from '@/components/listas/ListComponent';
import ModalComponent from '@/components/listas/Modal';

const Elementos = () => {
    const { data } = useGetData(['elements']);
    const { updateEntity } = useUpdate('/elements', '/elementos/lista');
    const [selectedElement, setSelectedElement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = ['ID', 'Descripción', 'Cant', 'Dispo', 'Ubicación', 'Tipo', 'Estado', 'Min', 'Foto', ''];

    const renderRow = (elemento) => (
        <tr key={elemento.idelemento} className="border-b">
            <td className="px-4 py-2">{elemento.idelemento}</td>
            <td className="px-4 py-2">{elemento.descripcion}</td>
            <td className="px-4 py-2">{elemento.cantidad}</td>
            <td className="px-4 py-2">{elemento.disponibles}</td>
            <td className="px-4 py-2">{elemento.ubicacion}</td>
            <td className="px-4 py-2">{elemento.tipo}</td>
            <td className="px-4 py-2">{elemento.estado}</td>
            <td className="px-4 py-2">{elemento.minimo}</td>
            <td className="px-4 py-2">
                {elemento.foto ? (
                    <img
                        src={`${import.meta.env.VITE_IMAGENES_URL}/${elemento.foto}`}
                        alt={`Foto de ${elemento.descripcion}`}
                        className="h-16 w-16 object-cover"
                    />
                ) : (
                    <span>No imagen</span>
                )}
            </td>
            <td className="px-4 py-2">
                <button onClick={() => openModal(elemento)} className="bg-black text-white px-4 py-2 rounded-md">
                    Ver
                </button>
            </td>
        </tr>
    );

    const openModal = (element) => {
        setSelectedElement(element);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedElement(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedElement((prevElement) => ({
            ...prevElement,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        await updateEntity(selectedElement.idelemento, selectedElement);
        closeModal();
    };

    const fields = [
        { label: 'ID', name: 'idelemento', readOnly: true },
        { label: 'Descripción', name: 'descripcion' },
        { label: 'Cantidad', name: 'cantidad', type: 'number' },
        { label: 'Disponibles', name: 'disponibles', type: 'number' },
        { label: 'Ubicación', name: 'ubicacion' },
        { label: 'Tipo', name: 'tipo' },
        { label: 'Estado', name: 'estado' },
        { label: 'Mínimo', name: 'minimo', type: 'number' },
    ];

    return (
        <div>
            <ListComponent
                data={data?.elements}
                columns={columns}
                renderRow={renderRow}
                searchKeys={['idelemento', 'descripcion', 'ubicacion', 'tipo', 'estado']}
                title="Lista Elementos"
            />

            {isModalOpen && (
                <ModalComponent
                    item={selectedElement}
                    fields={fields}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleUpdate}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default Elementos;
