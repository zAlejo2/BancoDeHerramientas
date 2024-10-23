// useLogin.js
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import axiosInstance from '../helpers/axiosConfig';
import Swal from 'sweetalert2';
import { useContext } from 'react';
import { MediosContext } from '../Context';

const useLogin = (url, inputs) => {
    const navigate = useNavigate();
    const { setLoader, setTokenSession } = useContext(MediosContext);

    const aceptSubmit = async () => {
        try {
            const response = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/${url}`, inputs);
            const token = response.data.token;

            // Decodificar el token para obtener el tipo de usuario
            const decodedToken = jwtDecode(token);
            const userType = decodedToken.type;

            Swal.fire({
                title: "¡Bien!",
                text: "Ha Iniciado Sesión.",
                icon: "success",
                iconColor: '#007BFF',
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                setLoader(false);
                setTokenSession(token);
                
                // Redirige según el tipo de usuario
                if (userType === 'administrador') {
                    navigate("/inicio", { replace: true });
                } else if (userType === 'cliente') {
                    navigate("/encargos/lista", { replace: true });
                } else {
                    // Manejo de errores o redirección por defecto
                    navigate("/inicio", { replace: true });
                }
            });
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "Error inesperado";
            Swal.fire({
                icon: "error",
                title: mensaje,
                text: `Por favor verifique los datos.`,
                confirmButtonColor: '#FC3F3F'
            });
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        confirmSubmit();
    };

    const confirmSubmit = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Confirma que la información sea correcta.",
            icon: 'warning',
            iconColor: '#007BFF',
            showCancelButton: true,
            confirmButtonColor: '#007BFF',
            cancelButtonColor: '#81d4fa',
            confirmButtonText: 'Si, estoy seguro!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                aceptSubmit();
            }
        });
    };

    return handleSubmit;
};

export default useLogin;