import { useState } from 'react';
import axiosInstance from '../helpers/axiosConfig';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const useUpdate = (baseUrl, redirectUrl) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const updateEntity = async (id, updatedData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.put(`${baseUrl}/${id}`, updatedData);
            
            Swal.fire({
                icon: 'success',
                title: 'Actualización exitosa',
                text: `La información ha sido actualizado correctamente.`,
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                navigate(redirectUrl); // Redirige después de la actualización
            });

            return response.data;
        } catch (err) {
            console.error(`Error al actualizar:`, err);

            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar',
                text: `Hubo un problema al actualizar.`,
                confirmButtonText: 'Ok',
            });

            setError(`Error al actualizar`);
        } finally {
            setLoading(false);
        }
    };

    return { updateEntity, loading, error };
};

export default useUpdate;
