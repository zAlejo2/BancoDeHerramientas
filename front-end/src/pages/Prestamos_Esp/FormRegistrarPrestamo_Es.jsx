import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePostDataNoalert from "../../hooks/usePostDataNoalert.jsx";

const FormRegistrarPrestamo_Es = () => {
    const [documento, setDocumento] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setDocumento(event.target.value);
    };

    const validations = {
        documento: [
            {
                validate: value => value.trim() !== "",
                message: "El documento de usuario es obligatorio."
            }
        ]
    };

    const onSubmit = (data) => {
        const idprestamo = data.idprestamo;
        if (idprestamo) {
            console.log("Prestamo_Esp creado exitosamente con ID:", idprestamo);
            // Redirige a la ruta construida dinámicamente
            navigate(`/Prestamos_Esp/elementos/${idprestamo}`, { replace: true });
        } else {
            console.error("No se pudo crear el Prestamo_Esp  .");
        }
    };

    const handleSubmit = usePostDataNoalert(
        "Prestamos_Esp",
        onSubmit,     
        { documento }, 
        validations  
    );

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center border shadow-lg p-8 rounded-lg" style={{ maxWidth: '500px', margin: '50px auto', backgroundColor: '#F9F8F8f' }}>
        <h1 className="text-2xl font-bold mb-6 text-black">Registrar Prestamo_Esp</h1>
        
        <input
            type="text"
            name="documento"
            value={documento}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg mb-6 text-lg focus:outline-none focus:border-black caret-transparent"
            placeholder="Ingrese documento"
            required
            style={{ width: '100%' }}
        />

        <button
            type="submit"
            className="w-full bg-black hover:bg-black-700 text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out"
        >
            Registrar
        </button>
        </form>

    );
};

export {FormRegistrarPrestamo_Es};