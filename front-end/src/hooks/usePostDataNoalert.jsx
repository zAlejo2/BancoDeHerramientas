import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../helpers/axiosConfig';

const usePostDataNoalert = (url, onSubmit, inputs, validations) => {
    const navigate = useNavigate();

    const validateInputs = () => {
        for (const [field, rules] of Object.entries(validations)) {
            for (const rule of rules) {
                if (!rule.validate(inputs[field])) {
                    return false;
                }
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateInputs()) {
            try {
                const response = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/${url}`, inputs);

                // Verifica si hay advertencia de mora
                if (response.data.advertencia && response.data.continuar) {
                    Swal.fire({
                        title: response.data.advertencia,
                        text: "¿Está seguro de que quiere continuar con el préstamo?",
                        icon: "warning",
                        iconColor: "#FC3F3F",
                        showCancelButton: true,
                        confirmButtonColor: "#FFA2A3",
                        cancelButtonColor: "#FC3F3F",
                        confirmButtonText: "Continuar",
                        cancelButtonText: "Cancelar"
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            // Si el usuario confirma, continuar con el préstamo
                            inputs.continuar = true;  // Añade "continuar: true" al cuerpo de la solicitud
                            const newResponse = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/${url}`, inputs);  // Misma ruta
                            onSubmit(newResponse.data);
                        }
                    });
                    
                } else {
                    // Si no hay advertencia de mora, continuar normalmente
                    onSubmit(response.data);
                }

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
                });
            }
        }
    };

    return handleSubmit;
};

export default usePostDataNoalert;
