import { useState, useCallback } from "react";
import usePostData from "../../hooks/usePostData";
import { Input } from "../../components/forms/elements/input";
import { Button } from "../../components/forms/elements/button";
import { Forms } from "../../layout/Forms";
import { useNavigate } from 'react-router-dom';

export const FormAreas = () => {
    const initialData = { nombre: "" };
    const [inputs, setInputs] = useState(initialData);
    const navigate = useNavigate();

    // Definición de validaciones
    const validations = {
        idarea: [
        ],
        nombre: [
            {
                validate: value => value.trim() !== "",
                message: "La descripción del área es obligatoria."
            }
        ]
    };

    // Función de manejo de cambio de entrada
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs(prevInputs => ({ ...prevInputs, [name]: value }));
    };

    // Función de reseteo del formulario
    const handleFormReset = useCallback(() => {
        setInputs(initialData);
    }, []);

    // Función de envío de datos
    const onSubmit = useCallback(() => {
        handleFormReset();
        navigate("/areas", { replace: true });
    }, [handleFormReset, navigate]);

    // Hook usePostData
    const handleSubmit = usePostData("areas", onSubmit, inputs, validations);

    const inputs1 = [
        { 
            id: 2, 
            type: 'text', 
            name: 'nombre', 
            placeholder: 'Ingrese el nombre del área', 
            value: inputs.nombre, 
            required: true 
        }
    ];

    return (
        <Forms>
            <h1 className="text-center my-2 mb-8 text-xl font-bold">Formulario de Áreas</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                {inputs1.map(input => (
                    <Input
                        key={input.id}
                        type={input.type}
                        name={input.name}
                        placeholder={input.placeholder}
                        required={input.required}
                        value={input.value}
                        handleInputChange={handleInputChange}
                    />
                ))}
                <div className={inputs1.length % 2 === 0 ? "md:col-span-2" : "flex items-center justify-center mt-6"}>
                    <Button type={'submit'} name={'Enviar'} />
                </div>
            </form>
        </Forms>
    );
};
