import axios from 'axios';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const NuevaContrasena = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [inputs, setInputs] = useState({ nuevaContrasena: "", confirma: "" });

    const handleInputChange = (event) => {
        setInputs({
            ...inputs,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { nuevaContrasena, confirma } = inputs; 

            if (nuevaContrasena !== confirma) {
                Swal.fire({
                    icon: "error",
                    title: "Las contraseñas no coinciden",
                    text: "Por favor verifique los datos.",
                    confirmButtonColor: '#FC3F3F',
                    customClass: {
                        container: 'swal2-container',
                        popup: 'swal2-popup'
                    }
                });
                return;
            }
    
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/olvidar-contrasena/restablecer-constrasena`, { token, nuevaContrasena});   

            Swal.fire({
                icon: "success",
                iconColor: "#007BFF",
                title: response.data.mensaje,
                confirmButtonColor: '#81d4fa',
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup'
                }
            }).then(() => {
                navigate('/login');
            });

        } catch (error) {console.log(error)
            const mensaje = error.response?.data?.mensaje || "Error inesperado";
            Swal.fire({
                icon: "error",
                title: mensaje,
                text: "Por favor verifique los datos.",
                confirmButtonColor: '#FC3F3F',
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup'
                }
            });
        }
    };    

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className='shadow-lg text-3xl p-10 border border-neutral-400/40 m-4 p-6 shadow-lg shadow-[#1565c023] rounded-lg'>
                <h1 className='font-bold m-1'>Restablecer Contraseña</h1>
                <div className='m-5'>
                    <Label htmlFor="documento">Nueva Contraseña</Label>
                    <Input
                        name="nuevaContrasena"
                        placeholder="Documento"
                        onChange={handleInputChange}
                        value={inputs.nuevaContrasena}
                    />
                </div>
                <div className='m-5'>
                    <Label htmlFor="email">Confirma Contraseña</Label>
                    <Input
                        name="confirma"
                        placeholder="Correo Electrónico"
                        onChange={handleInputChange}
                        value={inputs.confirma}
                    />
                </div>
                <div className='text-center pt-2'>
                    <Button type="submit">Enviar Solicitud</Button>
                </div>               
            </form>
        </div>
    );
};

export default NuevaContrasena;
