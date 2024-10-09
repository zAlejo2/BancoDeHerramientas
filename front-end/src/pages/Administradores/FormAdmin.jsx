import { useState } from "react";
import usePostData from "../../hooks/usePostData";
import { Input } from "../../components/forms/elements/input";
import { Button } from "../../components/forms/elements/button";
import { Forms } from "../../layout/Forms";
import { Select } from "../../components/forms/elements/select";
import { useNavigate } from 'react-router-dom';
import useGetData from "@/hooks/useGetData";

export const FormAdmin = () => {
    const initialData = { documento: "", contrasena: "", nombre: "", tipo: "", areas_idarea: "", correo: "", numero: ""};
    const [inputs, setInputs] = useState(initialData);
    const navigate = useNavigate();
    const urls = ["areas"];
    const { data } = useGetData(urls);
    const areas = data.areas || [];

    const validations = {
        documento: [
            {
                validate: value => value.trim() !== "",
                message: "El documento es obligatorio."
            },
            {
                validate: value => /^[0-9]{6,10}$/.test(value),
                message: "El documento debe tener entre 6 y 10 dígitos."
            }
        ],
        contrasena: [
            {
                validate: value => value.trim() !== "",
                message: "La contraseña es obligatoria."
            },
            {
                validate: value => value.length >= 6,
                message: "La contraseña debe tener al menos 6 caracteres."
            }
        ],
        nombre: [
            {
                validate: value => value.trim() !== "",
                message: "El nombre es obligatorio."
            }
        ],
        tipo: [
            {
                validate: value => value.trim() !== "",
                message: "El tipo es obligatorio."
            }
        ],
        areas_idarea: [
            {
                validate: value => value.trim() !== "",
                message: "El área es obligatoria."
            }
        ]
    };

    const inputs1 = [
        { 
            id: 1, 
            type: 'text', 
            name: 'documento', 
            placeholder: 'Ingrese el documento del administrador', 
            value: inputs.documento, 
            required: true 
        },
        { 
            id: 2, 
            type: 'password', 
            name: 'contrasena', 
            placeholder: 'Ingrese la contraseña del administrador', 
            value: inputs.contrasena, 
            required: true 
        },
        { 
            id: 3, 
            type: 'text', 
            name: 'nombre', 
            placeholder: 'Ingrese el nombre del administrador', 
            value: inputs.nombre, 
            required: true 
        },
        { 
            id: 4, 
            type: 'text', 
            name: 'correo', 
            placeholder: 'Ingrese el correo del administrador', 
            value: inputs.correo, 
            required: true 
        },
        { 
            id: 5, 
            type: 'text', 
            name: 'numero', 
            placeholder: 'Ingrese el número del administrador', 
            value: inputs.numero, 
            required: true 
        },
    ];

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleFormReset = () => {
        setInputs(initialData);
    };

    const onSubmit = () => {
        console.log(inputs);
        handleFormReset();
        navigate("/admin", { replace: true });
    };

    const handleSubmit = usePostData("admins", onSubmit, inputs, validations, '/administrador/formulario');
    
    return (
        <Forms>
            <h1 className="text-center my-2 mb-8 text-xl font-bold">Formulario Administradores</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[900px]" onSubmit={handleSubmit}>
                {inputs1.map(input => (
                    <Input key={input.id} type={input.type} name={input.name} placeholder={input.placeholder} required={input.required} value={input.value} handleInputChange={handleInputChange} />
                ))}
                <Select
                    label="Tipo"
                    name="tipo"
                    value={inputs.tipo}
                    onChange={handleInputChange}
                    options={[
                        {
                            value: "admin",
                            label: "Admin",
                        },
                        {
                            value: "practicante",
                            label: "Practicante",
                        },
                        {
                            value: "contratista",
                            label: "Contratista",
                        },
                    ]}                
                />
                <Select
                    label="Área"
                    name="areas_idarea"
                    value={inputs.areas_idarea}
                    onChange={handleInputChange}
                    options={areas.map(area => ({ value: area.idarea, label: area.nombre }))}
                />
                <div className={inputs1.length % 2 === 0 ? "md:col-span-2" : "flex items-center justify-center mt-6"}>
                    <Button type={'submit'} name={'Enviar'} />
                </div>
            </form>
        </Forms>
    );
};
