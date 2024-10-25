import React, { useState } from 'react';
import useGetData from '@/hooks/useGetData';
import useUpdate from '@/hooks/useUpdate';
import useDeleteData from '@/hooks/useDeleteData';
import ListComponent from '@/components/listas/ListComponent';
import ModalComponent from '@/components/listas/Modal';

const Elementos = () => {
    const { data } = useGetData(['elements']);
    const { updateEntity } = useUpdate('/elements', '/elementos/lista');
    const [selectedElement, setSelectedElement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idelemento, setIdelemento] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // Nuevo estado para el archivo
    const { deleteData, data: deleted, isLoading, error } = useDeleteData(`elements/${idelemento}`, '/elementos/lista');

    const columns = ['ID', 'Descripción', 'Cant', 'Dispo', 'Ubicación', 'Tipo', 'Estado', 'Min', 'Observaciones', ''];

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
            <td className="px-4 py-2">{elemento.observaciones}</td>
            {/* <td className="px-4 py-2">
                {elemento.foto ? (
                    <img
                        src={`${import.meta.env.VITE_IMAGENES_URL}/${elemento.foto}`}
                        alt={`Foto de ${elemento.descripcion}`}
                        className="h-16 w-16 object-cover"
                    />
                ) : (
                    <span>No imagen</span>
                )}
            </td> */}
            <td className="px-4 py-2">
                <button onClick={() => openModal(elemento, elemento.idelemento)} className="bg-black text-white px-4 py-2 rounded-md">
                    Ver
                </button>
            </td>
        </tr>
    );

    const openModal = (element, idelemento) => {
        setSelectedElement(element);
        setIdelemento(idelemento)
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedElement(null);
        setSelectedFile(null); // Limpiar el archivo al cerrar el modal
    };

    const handleDelete = () => {
        deleteData();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedElement((prevElement) => ({
            ...prevElement,
            [name]: value,
        }));
    };

    // Nuevo handler para manejar el archivo seleccionado
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpdate = async () => {
        const formData = new FormData();
        Object.entries(selectedElement).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Solo si hay un archivo seleccionado, lo añadimos al formData
        if (selectedFile) {
            formData.append('foto', selectedFile);
        }

        await updateEntity(selectedElement.idelemento, formData);
        closeModal();
    };

    const optionsEstado = [{label: 'Disponible', value: 'disponible'}, {label: 'Agotado', value: 'agotado'}];
    const optionsTipo = [{label: 'Consumible', value: 'consumible'}, {label: 'Devolutivo', value: 'devolutivo'}];

    const fields = [
        { label: 'ID', name: 'idelemento', readOnly: true },
        { label: 'Descripción', name: 'descripcion' },
        { label: 'Cantidad', name: 'cantidad', type: 'number' },
        { label: 'Disponibles', name: 'disponibles', type: 'number' },
        { label: 'Ubicación', name: 'ubicacion' },
        { label: 'Tipo', name: 'tipo', type: 'select', options: optionsTipo},
        { label: 'Estado', name: 'estado', type: 'select', options: optionsEstado },
        { label: 'Mínimo', name: 'minimo', type: 'number' },
        { label: 'Observaciones', name: 'observaciones', type: 'text' },
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
                    handleDelete={handleDelete}
                    closeModal={closeModal}
                >
                    {/* Mostrar imagen si existe */}
                    {selectedElement?.foto && (
                        <div className="mb-4">
                            <label className="block font-bold mb-2">Foto actual:</label>
                            <img
                                src={`${import.meta.env.VITE_IMAGENES_URL}/${selectedElement.foto}`}
                                alt={`Foto de ${selectedElement.descripcion}`}
                                className="h-40 w-auto object-cover"
                            />
                        </div>
                    )}

                    {/* Campo para subir una nueva foto */}
                    <div className="mb-4">
                        <label className="block font-bold mb-2">Subir nueva foto:</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                </ModalComponent>
            )}
        </div>
    );
};

export default Elementos;
