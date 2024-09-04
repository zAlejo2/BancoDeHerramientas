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
    };

    return handleSubmit;
};

export default usePostDataNoalert;
