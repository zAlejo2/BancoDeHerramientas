import { useState } from "react";
import { Input } from "../../components/forms/elements/input";
import { Button } from "../../components/forms/elements/button";
import { Forms } from "../../layout/Forms";
import { Select } from "../../components/forms/elements/select";
import { useNavigate } from 'react-router-dom';
import useGetData from "@/hooks/useGetData";
import usePostDataImage from "../../hooks/usePostDataImage";

export const FormElementos = () => {
    const initialData = { descripcion: "", cantidad: "", disponibles: "", ubicacion: "", tipo: "", estado: "", areas_idarea: "", foto: "" };
    const [inputs, setInputs] = useState(initialData);
    const navigate = useNavigate();
    const urls = ["areas"];
    const { data } = useGetData(urls);
    const areas = data.areas || [];

    const inputs1 = [
        { 
            id: 1, 
            type: 'text', 
            name: 'descripcion', 
            placeholder: 'Ingrese la descripción del elemento', 
            value: inputs.descripcion, 
            required: true 
        },
        { 
            id: 2, 
            type: 'text', 
            name: 'cantidad', 
            placeholder: 'Ingrese la cantidad del elemento', 
            value: inputs.cantidad, 
            required: true 
        },
        { 
            id: 3, 
            type: 'text', 
            name: 'disponibles', 
            placeholder: 'Ingrese la disponibilidad de cada elemento', 
            value: inputs.disponibles, 
            required: true 
        },
        { 
            id: 4, 
            type: 'text', 
            name: 'ubicacion', 
            placeholder: 'Ingrese la ubicacion del elemento', 
            value: inputs.ubicacion, 
            required: true 
        },
        {
            id: 5,
            type: 'file',
            name: 'foto',
            placeholder: '',
            value: inputs.foto,
            required: true
        },
    ];

    const handleInputChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'foto') {
            setInputs({ ...inputs, [name]: files[0] });
        } else {
            setInputs({ ...inputs, [name]: value });
        }
    };


    const handleFormReset = () => {
        setInputs(initialData);
        setFile(null);
    };

    const onSubmit = () => {
        handleFormReset();
        navigate("/", { replace: true });
    };

    // Convert inputs to FormData
    const formData = new FormData();
    Object.keys(inputs).forEach(key => {
        formData.append(key, inputs[key]);
    });

    const handleSubmit = usePostDataImage("elements", onSubmit, formData);
    
    return (
        <Forms>
            <h1 className="text-center my-2 mb-8 text-xl font-bold">Formulario Elementos</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                {inputs1.map(input => (
                    <Input
                        key={input.id}
                        type={input.type}
                        name={input.name}
                        placeholder={input.placeholder}
                        required={input.required}
                        value={input.type === 'file' ? undefined : input.value}
                        handleInputChange={handleInputChange}
                    />
                ))}
                <Select
                    label="Tipo de elemento"
                    name="tipo"
                    value={inputs.tipo}
                    onChange={handleInputChange}
                    options={[
                        {
                            value: "Prestamo",
                            label: "Prestamo",
                        },
                        {
                            value: "Consumo",
                            label: "Consumo",
                        },
                    ]}                
                />
                <Select
                    label="Estado"
                    name="estado"
                    value={inputs.estado}
                    onChange={handleInputChange}
                    options={[
                        {
                            value: "Disponible",
                            label: "Disponible",
                        },
                        {
                            value: "Agotado",
                            label: "Agotado",
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
