import axiosInstance from '../helpers/axiosConfig';
import { useNavigate } from "react-router-dom";
import showAlert from '../components/alertas/showAlert.jsx';  // Importa la función

const usePostData = (url, onSubmit, inputs, validations, ruta) => {
    const navigate = useNavigate();

    const validateInputs = () => {
        for (const [field, rules] of Object.entries(validations)) {
            for (const rule of rules) {
                if (!rule.validate(inputs[field])) {
                    showAlert({
                        type: "error",
                        title: "Error de validación",
                        message: rule.message
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

            // Mostrar el mensaje del back si existe
            if (response.data.mensaje) {
                showAlert({
                    type: 'success', // Puedes cambiarlo según el tipo de alerta que deseas
                    message: response.data.mensaje
                });
            }

            // Si necesitas redirigir después de una respuesta exitosa
            if (ruta) {
                navigate(ruta, { replace: true });
            }

            // Ejecutar cualquier otra lógica con los datos recibidos
            onSubmit(response.data);

        } catch (error) {
            // Si el servidor envía un mensaje de error, lo mostramos
            const errorMessage = error.response?.data?.mensaje || "Parece que hubo un error: por favor verifique los datos.";
            
            showAlert({
                type: "error",
                title: "Oops...",
                message: errorMessage
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
        showAlert({
            type: 'confirmation',
            title: '¿Estás seguro?',
            message: "Confirma que la información sea correcta.",
            confirmAction: aceptSubmit // Pasa la función de confirmación
        });
    };

    return handleSubmit;
};

export default usePostData;
