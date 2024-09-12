import React from 'react';

const ModalComponent = ({
    item, // El elemento seleccionado para editar
    fields, // Campos a mostrar en el formulario
    handleInputChange, // Función para manejar los cambios en los inputs
    handleSubmit, // Función para manejar el submit del formulario
    closeModal, // Función para cerrar el modal
    title = "Modificar", // Título del modal
}) => {

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(); // Ejecuta la función de submit pasada como prop
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg w-1/2">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        {fields.map(({ label, name, type, readOnly, options }, index) => (
                            <div key={index}>
                                <label className="block mb-1">{label}</label>
                                {type === 'select' ? (
                                    <select
                                        name={name}
                                        value={item[name] || ''}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 p-2 w-full mb-4 rounded-md"
                                        disabled={readOnly}
                                    >
                                        <option value="" disabled>Selecciona {label}</option>
                                        {options.map((option, idx) => (
                                            <option key={idx} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={type || 'text'}
                                        name={name}
                                        value={item[name] || ''}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 p-2 w-full mb-4 rounded-md"
                                        readOnly={readOnly}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            className="bg-gray-600 text-white px-4 py-2 rounded-md mr-2"
                            onClick={closeModal}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-black text-white px-4 py-2 rounded-md"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalComponent;
