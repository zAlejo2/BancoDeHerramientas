import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePostDataNoalert from "../../hooks/usePostDataNoalert.jsx";

const FormCrearConsumo = () => {
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
        const idconsumo = data.idconsumo;
        if (idconsumo) {
            console.log("Consumo creado exitosamente con ID:", idconsumo);
            // Redirige a la ruta construida dinámicamente
            navigate(`/consumos/elementos/${idconsumo}`, { replace: true });
        } else {
            console.error("No se pudo crear el consumo  .");
        }
    };

    const handleSubmit = usePostDataNoalert(
        "consumos",
        onSubmit,     
        { documento }, 
        validations  
    );

    return (
            <form onSubmit={handleSubmit} className="flex flex-col items-center border border-gray">
                <h1 style={{textAlign: 'center', fontWeight: 'bold', fontSize:'25px'}}>Registrar Consumo</h1>
                <input
                    type="text"
                    name="documento"
                    value={documento}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-300 rounded mb-4"
                    required
                    style={{border:'2px solid black', width: '400px', height: '60px', fontSize: '42px', textAlign: 'center', caretColor: "transparent"}}
                />
            </form>
    );
};

export {FormCrearConsumo};