import axiosInstance from '../helpers/axiosConfig';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const usePostData = (url, onSubmit, inputs, validations) => {
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
    console.log('cacorro')
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
                    container: 'swal2-container',
                    popup: 'swal2-popup'
                }
            }).then(() => {
                onSubmit();
                navigate("/inicio", { replace: true });
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Parece que hubo un error: por favor verifique los datos.",
                confirmButtonColor: "#6fc390",
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup'
                }
            });
            console.log(error);
        }
    }

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
