import axiosInstance from '../helpers/axiosConfig';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const usePostData = (url, onSubmit, inputs) => {
    const navigate = useNavigate(); 

    const aceptSubmit = async () => {
        try {
            await axiosInstance.post(`${import.meta.env.VITE_API_URL}/${url}`, inputs);
            Swal.fire({
                title: "¡Bien!",
                text: "La información ha sido guardada correctamente.",
                icon: "success",
                iconColor: "#007BFF",
                showConfirmButton: false,
                timer: 2500,
                customClass: {
                    container: 'swal2-container', // Custom class for container
                    popup: 'swal2-popup' // Custom class for popup
                }
            }).then(() => {
                onSubmit();
                navigate("/inicio", { replace: true });
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Parece que hubo un error: por favor verifique los datos.`,
                confirmButtonColor: "#6fc390",
                customClass: {
                    container: 'swal2-container', // Custom class for container
                    popup: 'swal2-popup' // Custom class for popup
                }
            });
            console.log(error);
        }
    }

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
            confirmButtonText: 'Sí, estoy seguro!',
            cancelButtonText: 'Cancelar',
            customClass: {
                container: 'swal2-container', // Custom class for container
                popup: 'swal2-popup' // Custom class for popup
            }
        }).then((result) => {
            if (result.isConfirmed) {
                aceptSubmit();
            }
        });
    }

    return handleSubmit;
};

export default usePostData;
