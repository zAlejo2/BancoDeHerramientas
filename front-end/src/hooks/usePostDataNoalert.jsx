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
                onSubmit(response.data);
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
