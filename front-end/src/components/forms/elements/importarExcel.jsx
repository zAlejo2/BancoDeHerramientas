import { useState } from "react";
import axiosInstance from "@/helpers/axiosConfig";
import Swal from "sweetalert2";

const ImportarExcelCliente = () => {
    const [file, setfile] = useState(null);

    const handleExcelChange = (event) => {
        setfile(event.target.files[0]);
    };

    const handleExcelUpload = async () => {
        if (!file) {
            Swal.fire({
                icon: "error",
                title:  "Error",
                text: "Por favor seleccione un archivo excel",
                confirmButtonColor: '#FC3F3F',
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup'
                }
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/importar-excel/cliente`, formData);

            if (response.status === 200) {
                Swal.fire({
                    title: response.data.mensaje || 'Clientes registrados sin problemas',
                    icon: "success",
                    iconColor: "#212121",
                    showConfirmButton: false,
                    timer: 1300,
                    customClass: {
                        container: 'swal2-container',
                        popup: 'swal2-popup'
                    }
                })
                setfile(null); // Reiniciar el archivo seleccionado
            }
        } catch (error) {
            let mensaje = ''
            if (error.response?.data?.errors) {
                mensaje = error.response?.data?.errors?.map(err => err.errors.join(' --- ')).join(' --- ');
            } else if (error.response?.data?.mensaje) {
                mensaje = error.response?.data?.mensaje;
            } else {
                mensaje = "Error al procesar el archivo, asegúrate que sea excel (.xlsx) y no esté corrupto. Recuerda que si hiciste cambios en el archivo debes recargar la página e ingreasar el excel de nuevo. Si intentas hacer demasiados registros te recomendamos dividirlos en grupos ya que el sistema puede sobrecargarse y por eso no deja hacer el registo. Revisa tu conexión a internet y si aún no funciona intenta recargar la página o inicia sesión de nuevo";
            }

            Swal.fire({
                icon: "error",
                title:  "Por favor verifique los datos y el archivo",
                text: mensaje,
                confirmButtonColor: '#FC3F3F',
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup'
                }
            });
        }
    };

    return (
        <div className="w-[90%] md:max-w-[85%] mt-10 border border-neutral-400/40 m-4 p-6 shadow-lg shadow-[#1565c023] rounded-lg">
            <h1 className="font-bold text-center mb-9 mt-4 text-xl">Importar Excel</h1>
            <div className="grid grid-cols-2 gap-10">
                <input
                    type="file"
                    onChange={handleExcelChange}
                    className="mb-4 p-2 border border-gray-300 rounded-md w-full"
                />
                <button 
                    type="button" 
                    onClick={handleExcelUpload}
                    className="w-full bg-black text-white font-bold h-12 rounded-md hover:bg-gray-400 transition"
                >
                    Registrar Clientes
                </button>
            </div>
            <div className="mt-6">
                <h1 className="text-lg font-bold mb-2">Ten en cuenta:</h1>
                <ul className="list-disc pl-5">
                    <li className="mb-1">TIENE que ser un archivo excel (.xlsx)</li>
                    <li className="mb-1">SOLO puede tener una hoja de cálculo y debe ser la primera (Hoja1)</li>
                    <li className="mb-1">NO puede tener títulos (ej: nombre, correo...)</li>
                    <li className="mt-2">El grupo al que pertenece la persona tiene que estar registrado</li>
                    <li className="mt-2">La información debe estar de la siguiente manera:</li>
                    <ul className="list-decimal pl-5"><br/>
                        <li>En la columna A: número de documento</li>
                        <li>En la columna B: nombre completo</li>
                        <li>En la columna C: correo</li>
                        <li>En la columna D: número de contacto</li>
                        <li>En la columna E: contraseña (ÚNICAMENTE si es instructor)</li>
                        <li>En la columna F: fecha de inicio (día/mes/año)</li>
                        <li>En la columna G: fecha fin (día/mes/año)</li>
                        <li>En la columna H: el Código Grupo (puedes consultarlo en el apartado de Grupos/Lista)</li>
                        <li>En la columna I: observaciones</li>
                    </ul>
                    <li className="mt-2">Las observaciones no son obligatorias, puedes dejar la casilla vacía</li>
                    <li className="mt-2">Si el cliente NO es instructor la casilla de contraseña TIENE que dejarse vacía</li>
                    <li className="mt-2">El resto de los datos son OBLIGATORIOS para el registro de todos los clientes</li>
                    <li className="mt-2">Si corrige algún error en el excel recuerde que debe guardar los cambios en el archivo, luego recargar la página e ingresar el archivo nuevamente</li>
                    <li className="mt-2">El sistema le notificará si comete algún error en el registro. Si el sistema no permite hacer el registro y tampoco le especifica el problema  revise su conexión a internet, su aún no funciona intente reiniciar la página o iniciar sesión de nuevo</li>
                </ul>
            </div>
        </div>
    );
};

const ImportarExcelElemento = () => {
    const [file, setfile] = useState(null);

    const handleExcelChange = (event) => {
        setfile(event.target.files[0]);
    };

    const handleExcelUpload = async () => {
        if (!file) {
            Swal.fire({
                icon: "error",
                title:  "Error",
                text: "Por favor seleccione un archivo excel",
                confirmButtonColor: '#FC3F3F',
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup'
                }
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/importar-excel/elemento`, formData);

            if (response.status === 200) {
                Swal.fire({
                    title: response.data.mensaje || 'Elementos registrados sin problemas',
                    icon: "success",
                    iconColor: "#212121",
                    showConfirmButton: false,
                    timer: 1300,
                    customClass: {
                        container: 'swal2-container',
                        popup: 'swal2-popup'
                    }
                })
                setfile(null); // Reiniciar el archivo seleccionado
            }
        } catch (error) {
            let mensaje = ''
            if (error.response?.data?.errors) {
                mensaje = error.response?.data?.errors?.map(err => err.errors.join(' --- ')).join(' --- ');
            } else if (error.response?.data?.mensaje) {
                mensaje = error.response?.data?.mensaje;
            } else {
                mensaje = "Error al procesar el archivo, asegúrate que sea excel (.xlsx) y no esté corrupto. Recuerda que si hiciste cambios en el archivo debes recargar la página e ingreasar el excel de nuevo. Si intentas hacer demasiados registros te recomendamos dividirlos en grupos ya que el sistema puede sobrecargarse y por eso no deja hacer el registo. Revisa tu conexión a internet y si aún no funciona intenta recargar la página o inicia sesión de nuevo";
            }

            Swal.fire({
                icon: "error",
                title:  "Por favor verifique los datos y el archivo",
                text: mensaje,
                confirmButtonColor: '#FC3F3F',
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup'
                }
            });
        }
    };

    return (
        <div className="w-[90%] md:max-w-[85%] mt-10 border border-neutral-400/40 m-4 p-6 shadow-lg shadow-[#1565c023] rounded-lg">
            <h1 className="font-bold text-center mb-9 mt-4 text-xl">Importar Excel</h1>
            <div className="grid grid-cols-2 gap-10">
                <input
                    type="file"
                    onChange={handleExcelChange}
                    className="mb-4 p-2 border border-gray-300 rounded-md w-full"
                />
                <button 
                    type="button" 
                    onClick={handleExcelUpload}
                    className="w-full bg-black text-white font-bold h-12 rounded-md hover:bg-gray-400 transition"
                >
                    Registrar Elementos
                </button>
            </div>
            <div className="mt-6">
                <h1 className="text-lg font-bold mb-2">Ten en cuenta:</h1>
                <ul className="list-disc pl-5">
                    <li className="mb-1">TIENE que ser un archivo excel (.xlsx)</li>
                    <li className="mb-1">SOLO puede tener una hoja de cálculo y debe ser la primera (Hoja1)</li>
                    <li className="mb-1">NO puede tener títulos (ej: descripcion, cantidad...)</li>
                    <li className="mt-2">La información debe estar de la siguiente manera:</li>
                    <ul className="list-decimal pl-5"><br/>
                        <li>En la columna A: descripción (nombre del elemento)</li>
                        <li>En la columna B: disponibles</li>
                        <li>En la columna C: cantidad</li>
                        <li>En la columna D: ubicación</li>
                        <li>En la columna E: tipo (consumible o devolutivo)</li>
                        <li>En la columna F: estado (disponible o agotado)</li>
                        <li>En la columna G: cantidad minima</li>
                        <li>En la columna H: observaciones</li>
                    </ul>
                    <li className="mt-2">Las observaciones no son obligatorias, puedes dejar la casilla vacía</li>
                    <li className="mt-2">El resto de los datos son OBLIGATORIOS para el registro de todos los elementos</li>
                    <li className="mt-2">Si corrige algún error en el excel recuerde que debe guardar los cambios en el archivo, luego recargar la página e ingresar el archivo nuevamente</li>
                    <li className="mt-2">El sistema le notificará si comete algún error en el registro. Si el sistema no permite hacer el registro y tampoco le especifica el problema  revise su conexión a internet, su aún no funciona intente reiniciar la página o iniciar sesión de nuevo</li>
                </ul>
            </div>
        </div>
    );
};

export {ImportarExcelCliente, ImportarExcelElemento};
