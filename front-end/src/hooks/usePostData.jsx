import axiosInstance from '../helpers/axiosConfig';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const usePostData = (url, onSubmit, inputs, validations, ruta) => {
    const navigate = useNavigate();

    const validateInputs = () => {
        for (const [field, rules] of Object.entries(validations)) {
            for (const rule of rules) {
                if (!rule.validate(inputs[field])) {
                    Swal.fire({
                        icon: "error",
                        title: "Error de validación",
                        text: rule.message,
                        confirmButtonColor: "#6fc390",
                        customClass: {
                            container: 'swal2-container',
                            popup: 'swal2-popup'
                        }
                    });
                    return false;
                }
            }
        }
        return true;
    };

    const aceptSubmit = async () => {
        try {
            const response = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/${url}`, inputs);
            Swal.fire({
                title: "¡Bien!",
                text: "La información ha sido guardada correctamente.",
                icon: "success",
                iconColor: "#212121",
                showConfirmButton: false,
                timer: 500,
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup'
                }
            }).then(() => {
                onSubmit(response.data);
                onSubmit();
                navigate(ruta, { replace: true });
                location.reload()
            });
        } catch (error) {
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
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload(); // Recarga la página si el usuario confirma
                }
            });
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateInputs()) {
            confirmSubmit();
        }
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
                container: 'swal2-container',
                popup: 'swal2-popup'
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
