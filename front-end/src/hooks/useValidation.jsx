import { useState } from 'react';

const useValidation = (inputs) => {
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        let tempErrors = {};

        // Ejemplo de validaciones: Verificar si los campos están vacíos
        for (const [key, value] of Object.entries(inputs)) {
            if (!value) {
                tempErrors[key] = `${key} es un campo requerido`;
            }
        }

        // Ejemplo de validación para un campo específico
        if (inputs.documento && !/^\d+$/.test(inputs.documento)) {
            tempErrors.documento = "El documento debe ser un número válido";
        }

        setErrors(tempErrors);

        // Retorna true si no hay errores
        return Object.keys(tempErrors).length === 0;
    };

    return { errors, validateInputs };
};

export default useValidation;
