import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstance from '../helpers/axiosConfig';

const useDeleteData = (url, ruta) => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const deleteData = async () => {
        const confirmResult = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmResult.isConfirmed) {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.delete(`${import.meta.env.VITE_API_URL}/${url}`);
                setData(response.data);
                navigate(ruta, { replace: true });

                // Mostrar una notificación de éxito
                Swal.fire(
                    'Eliminado!',
                    'El registro ha sido eliminado.',
                    'success'
                );
            } catch (err) {
                setError(err.response ? err.response.data : 'Error de conexión');
                
                // Mostrar una notificación de error
                Swal.fire(
                    'Error!',
                    'Hubo un problema al eliminar el registro.',
                    'error'
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    return { deleteData, data, isLoading, error };
};

export default useDeleteData;
