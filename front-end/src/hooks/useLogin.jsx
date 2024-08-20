// useLogin.js
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../helpers/axiosConfig';
import Swal from 'sweetalert2';
import { useContext } from 'react';
import { MediosContext } from '../Context';

const useLogin = (url, onSubmit, inputs) => {
    const navigate = useNavigate();
    const { setLoader, setTokenSession } = useContext(MediosContext);

    const aceptSubmit = async () => {
        try {
            const response = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/${url}`, inputs);
            Swal.fire({
                title: "¡Bien!",
                text: "Ha Iniciado Sesión.",
                icon: "success",
                iconColor: '#007BFF',
                showConfirmButton: false,
                timer: 2500,
            }).then(() => {
                onSubmit();
                setLoader(false);
                setTokenSession(response.data.token);
                //localStorage.setItem('authToken', response.data.token)
                navigate("/inicio", {
                    replace: true,
                });
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Parece que hubo un error: Por favor verifique los datos.`,
                confirmButtonColor: "#6fc390",
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