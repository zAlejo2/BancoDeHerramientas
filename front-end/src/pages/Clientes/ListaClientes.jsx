import React, { useState } from 'react';
import useGetData from '@/hooks/useGetData';
import useUpdate from '@/hooks/useUpdate';
import ListComponent from '@/components/listas/ListComponent';
import ModalComponent from '@/components/listas/Modal';
import useDeleteData from '@/hooks/useDeleteData';

const Clientes = () => {
    const { data } = useGetData(['clients']);
    const { updateEntity } = useUpdate('/clients', '/usuarios/lista');
    const [selectedClient, setSelectedClient] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [documento, setIdcliente] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); 
    const { data: rolesd } = useGetData(['roles']);
    const roles = rolesd.roles || []; 
    const { deleteData, data: deleted, isLoading, error } = useDeleteData(`clients/${documento}`, '/usuarios/lista');

    const columns = ['Documento', 'Nombre', 'Correo', 'Fecha inicio', 'Fecha fin', 'Observaciones', 'Telefono', 'Grupo',  ''];

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
            {/* <td className="px-4 py-2">
                {cliente.foto ? (
                    <img
                        src={`${import.meta.env.VITE_IMAGENES_URL}/${cliente.foto}`}
                        alt={`Foto de ${cliente.foto}`}
                        className="h-16 w-16 object-cover"
                    />
                ) : (
                    <span>No imagen</span>
                )}
            </td> */}
            <td className="px-4 py-2">
                <button onClick={() => openModal(cliente, cliente.documento)} className="bg-black text-white px-4 py-2 rounded-md">
                    Ver
                </button>
            </td>
        </tr>
    );

    const openModal = (cliente, documento) => {
        setSelectedClient(cliente);
        setIdcliente(documento);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedClient(null);
        setSelectedFile(null); 
    };

    const handleDelete = () => {
        deleteData();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedClient((prevClient) => ({
            ...prevClient,
            [name]: value,
        }));
    };

    // Nuevo handler para manejar el archivo seleccionado
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpdate = async () => {
        const formData = new FormData();
        Object.entries(selectedClient).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Solo si hay un archivo seleccionado, lo añadimos al formData
        if (selectedFile) {
            formData.append('foto', selectedFile);
        }

        await updateEntity(selectedClient.documento, formData);
        closeModal();
    };

    const roleOptions = roles.map(role => ({
        value: role.idrol, // O el campo adecuado para el ID de rol
        label: role.descripcion, // O el campo adecuado para el nombre del rol
    }));

    const instructorRole = roles.find(role => role.descripcion === 'instructor');
    const instructorRoleId = instructorRole ? instructorRole.idrol : null;
    const isInstructor = selectedClient?.roles_idrol === instructorRoleId;

    const fields = [
        { label: 'Documento', name: 'documento', readOnly: true },
        { label: 'Nombre', name: 'nombre' },
        { label: 'Correo', name: 'correo', },
        { label: 'Fecha Inicio', name: 'fechaInicio', type: 'date' },
        { label: 'Fecha Fin', name: 'fechaFin', type: 'date' },
        { label: 'Observaciones', name: 'observaciones' },
        { label: 'Telefono', name: 'numero' },
        { label: 'Grupo', name: 'roles_idrol', type: 'select', options: roleOptions },
        ...(isInstructor
            ? [{ label: 'Contraseña', name: 'contrasena', type: 'password' }]
            : [])
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
                    handleDelete={handleDelete}
                    closeModal={closeModal}
                >
                    {/* Mostrar imagen si existe */}
                    {selectedClient?.foto && (
                        <div className="mb-4">
                            <label className="block font-bold mb-2">Foto actual:</label>
                            <img
                                src={`${import.meta.env.VITE_IMAGENES_URL}/${selectedClient.foto}`}
                                alt={`Foto de ${selectedClient.nombre}`}
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

export default Clientes;
