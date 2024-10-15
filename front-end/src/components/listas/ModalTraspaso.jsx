import React, { useState } from 'react';

    const ModalTraspaso = ({ isOpen, onClose, traspaso, onTransferir }) => {
    const [observaciones, setObservaciones] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onTransferir({ observaciones, archivo: file, traspaso });
        }
    };

    const handleTransferir = () => {
        onTransferir({ observaciones, archivo: null, traspaso });
    };     

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-2 rounded-lg w-2/3 h-200">
                <h1 className='mb-10 mt-5 font-bold'>DETALLES DEL TRASPASO</h1>
                <div className="grid grid-cols-3 gap-10 mb-10">
                    <p><strong>Código:</strong> {traspaso.elementos_idelemento}</p>
                    <p><strong>Descripción:</strong> {traspaso.Elemento.descripcion}</p>
                    <p><strong>Cantidad:</strong> {traspaso.cantidad}</p>
                </div>
                <div className="m-7">
                    <input
                        className="mr-5 border border-gray-500 rounded-md"
                        type="text"
                        placeholder="Observaciones"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                    />
                    <input type="file" onChange={handleFileChange} />
                </div>
                <div className="modal-buttons">
                    <button onClick={handleTransferir} className="close bg-black text-white px-5 py-3 rounded-md mr-5 mb-4">Transferir a Banco</button>
                    <button onClick={onClose} className="close bg-black text-white px-5 py-3 rounded-md mr-5 mb-4">Volver</button>
                </div>
            </div>
        </div>
    );
};

export default ModalTraspaso;
