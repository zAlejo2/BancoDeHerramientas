import { useState } from "react";
import axiosInstance from '../helpers/axiosConfig';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const useValidatedPostDataImage = (url, onSubmit, formData, validations, ruta) => {
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateField = (name, value, rules) => {
        let error = "";
        if (rules.required && !value) {
            error = "Este campo es obligatorio.";
        } else if (rules.pattern && !rules.pattern.test(value)) {
            error = "El formato del campo es incorrecto.";
        }
        return error;
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const value = formData.get(key);
            const error = validateField(key, value, validations[key] || {});
            if (error) {
                newErrors[key] = error;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        const newValue = files ? files[0] : value;
        formData.set(name, newValue);

        const error = validateField(name, newValue, validations[name] || {});
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    };

    const aceptSubmit = async () => {
        try {
            await axiosInstance.post(`${import.meta.env.VITE_API_URL}/${url}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            Swal.fire({
                title: "¡Bien!",
                text: "La información ha sido guardada correctamente.",
                icon: "success",
                iconColor: "#212121",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup'
                }
            }).then(() => {
                onSubmit();
                navigate(ruta, { replace: true });
                location.reload();
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
            })
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            confirmSubmit();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Validación fallida',
                text: 'Por favor, corrija los errores en el formulario.',
                confirmButtonColor: '#6fc390',
            });
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
    };

    return { handleSubmit, errors, handleChange };
};

export default useValidatedPostDataImage;
