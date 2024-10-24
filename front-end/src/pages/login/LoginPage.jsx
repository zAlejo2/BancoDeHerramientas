import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sena from "../../assets/Sena.png";
import useLogin from '../../hooks/useLogin';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useValidation from '@/hooks/useValidation'; // Importa el hook de validación
import fondoInicio from '../../assets/fondo-inicio.avif';

export const Login = () => {
    const navigate = useNavigate();
    const initialData = { documento: "", contrasena: "" };
    const [inputs, setInputs] = useState(initialData);
    const [colorTheme, setColorTheme] = useState('white');

    // Define las validaciones
    const validations = {
      documento: [
          { validate: value => value.trim() !== "", message: "El número de documento es obligatorio." },
          { validate: value => /^[0-9]+$/.test(value), message: "El número de documento debe contener solo números." }
      ],
      contrasena: [
          { validate: value => value.trim() !== "", message: "La contraseña es obligatoria." }
      ]
    };

    const { validateInputs } = useValidation(inputs, validations);

    const handleInputChange = (event) => {
        setInputs({
            ...inputs,
            [event.target.name]: event.target.value,
        });
    };

    const handleForgotPassword = () => {
      navigate('/olvidar-contrasena'); // Cambia esta ruta según tu configuración
    };

    // Usa la función validateInputs para validar los datos antes de enviar
    const handleSubmit = useLogin("login", inputs, validations);

    return (
        <div 
          className={`flex items-center justify-center min-h-screen p-4 w-full ${colorTheme === 'white' ? 'bg-white' : colorTheme === 'gray' ? 'bg-gray-500' : 'bg-black'}`} 
          style={{
            backgroundImage: `url(${fondoInicio})`,
            backgroundSize: 'cover',  // Ajusta la imagen para cubrir todo el contenedor
            backgroundPosition: 'center',  // Centra la imagen
            backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
          }}>
          <div className={`flex flex-col md:flex-row rounded-lg shadow-[5px_5px_100px_40px_rgba(0,0,0,0.2)] overflow-hidden max-w-4xl w-full ${colorTheme === 'white' ? 'bg-white text-black' : colorTheme === 'gray' ? 'bg-gray-300 text-black' : 'bg-black text-white'}`} style={{}}>
            <div className={`flex flex-col justify-center items-center p-8 md:w-1/2 ${colorTheme === 'white' ? 'bg-gray-600' : colorTheme === 'gray' ? 'bg-gray-600' : 'bg-gray-800'}`}>
              <div className="flex items-center mb-4">
              </div><br/>
              <h1 className="text-4xl font-bold mb-4 text-white">Bienvenid@</h1><br/>
              <p className="mb-6 text-center text-white">
                Este es un software utilizado para la gestión de préstamos de elementos de los bancos de herramientas del Sena CIAA, solo para usuarios ya registrados.
              </p>
            </div>
            <div className="flex flex-col justify-center items-center p-8 md:w-1/2">
            <img src={Sena} alt="Descripción de la imagen" className="w-20 h-auto mb-4" />
              <h2 className="text-2xl font-bold mb-6">Inicio de sesión</h2>
              <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                <div className="mb-6">
                  <Label htmlFor="documento" className="block">
                    Número de Documento
                  </Label>
                  <Input 
                    name="documento" 
                    placeholder="Documento" 
                    className="w-full mt-1 border-gray-400" 
                    onChange={handleInputChange} 
                    value={inputs.documento}
                  />
                </div>
                <div className="mb-6">
                  <Label htmlFor="contrasena" className="block">
                    Contraseña
                  </Label>
                  <Input
                    name="contrasena"
                    type="password"
                    placeholder="Contraseña"
                    className="w-full mt-1 border-gray-400"
                    onChange={handleInputChange}
                    value={inputs.contrasena}
                  />
                </div>
                <Button type="submit" className="w-full py-2 rounded-lg text-1xl">Iniciar sesión</Button>
                <p className="mt-4 text-center text-gray-700 cursor-pointer text-2s" onClick={handleForgotPassword}>
                  ¿Olvidaste tu contraseña?
                </p>
              </form>
            </div>
          </div>
        </div>
    ); 
};
