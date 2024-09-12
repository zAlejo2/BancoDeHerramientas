import React from 'react';

const ModalComponent = ({ item, fields, handleInputChange, handleSubmit, closeModal }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Modificar</h2>
                <form onSubmit={handleSubmit}>
                    {/* Agrupar campos en pares para que se alineen horizontalmente */}
                    <div className="grid grid-cols-2 gap-4">
                        {fields.map((field) => (
                            <div key={field.name} className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    {field.label}
                                </label>
                                {field.type === 'select' ? (
                                    <select
                                        name={field.name}
                                        value={item[field.name] || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md"
                                    >
                                        {field.options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type || 'text'}
                                        name={field.name}
                                        value={item[field.name] || ''}
                                        onChange={handleInputChange}
                                        readOnly={field.readOnly || false}
                                        className="w-full px-4 py-2 border rounded-md"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-600 text-white px-4 py-2 rounded-md mr-2"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-black text-white px-4 py-2 rounded-md"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalComponent;
