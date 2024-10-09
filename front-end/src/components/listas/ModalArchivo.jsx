import React from 'react';

const ModalArchivo = ({ isOpen, onClose, fileUrl }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-2 rounded-lg w-2/3 h-200">
                {fileUrl ? (
                    <iframe src={`${import.meta.env.VITE_IMAGENES_URL}/${fileUrl}`} style={{ width: '100%', height: '500px', padding: '5px' }} title="Archivo"></iframe>
                ) : (
                    <p>No hay archivo disponible.</p>
                )}
                <button type="button" className="close bg-black text-white px-5 py-3 rounded-md mr-2" onClick={onClose}>Volver</button>
            </div>
        </div>
    );
};

export default ModalArchivo;
