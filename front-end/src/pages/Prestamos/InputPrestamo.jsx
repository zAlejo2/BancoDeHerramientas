import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePostDataNoalert from "../../hooks/usePostDataNoalert.jsx";

const InputPrestamo = () => {
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

    const onSubmit = (data, error) => {
        if (data?.idprestamo) {
            // Si el préstamo fue creado exitosamente
            const idprestamo = data.idprestamo;
            navigate(`/prestamos/elementos/${idprestamo}`, { replace: true });
        } else if (error) {
        }
    };

    const handleSubmit = usePostDataNoalert(
        "prestamos",
        onSubmit,     
        { documento }, 
        validations
    );

    return (
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                <input
                    type="text"
                    name="documento"
                    value={documento}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-300 rounded mb-4"
                    required
                    style={{border:'2px solid black', width: '400px', height: '60px', fontSize: '42px', textAlign: 'center', caretColor: "transparent"}}
                />
                <button type="submit" style={{ backgroundColor: 'black', borderRadius: '3px', marginLeft: '20px', marginTop: '5px', height: '50px', color: 'white', padding: '15px'}}>Buscar</button></div>
            </form>
    );
};

export default InputPrestamo;