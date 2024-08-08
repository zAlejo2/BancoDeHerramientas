import { useState } from "react";
import usePostData from "../../hooks/usePostData";
import { Input } from "../../components/forms/elements/input";
import { Button } from "../../components/forms/elements/button";
import { Forms } from "../../layout/Forms";
import { useNavigate } from 'react-router-dom';

export const FormRoles = () => {
    const initialData = { idrol: "", descripcion: "" };
    const [inputs, setInputs] = useState(initialData);
    const navigate = useNavigate();

    const inputs1 = [
        { 
            id: 1, 
            type: 'number', 
            name: 'idrol', 
            placeholder: 'Ingrese el id del rol', 
            value: inputs.idrol, 
            required: true 
        },
        { 
            id: 2, 
            type: 'text', 
            name: 'descripcion', 
            placeholder: 'Ingrese la descripcion del rol', 
            value: inputs.descripcion, 
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
        handleFormReset();
        navigate("/", { replace: true });
    };

    const handleSubmit = usePostData("roles", onSubmit, { ...inputs });
    
    return (
        <Forms>
            <h1 className="text-center my-2 mb-8 text-xl font-semibold">Formulario Roles</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                {inputs1.map(input => (
                    <Input key={input.id} type={input.type} name={input.name} placeholder={input.placeholder} required={input.required} value={input.value} handleInputChange={handleInputChange} />
                ))}

                <div className={inputs1.length % 2 === 0 ? "md:col-span-2" : "flex items-center justify-center mt-6"}>
                    <Button type={'submit'} name={'Enviar'} />
                </div>
            </form>
        </Forms>
    );
};
