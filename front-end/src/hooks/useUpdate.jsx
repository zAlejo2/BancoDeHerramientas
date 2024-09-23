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
                iconColor: 'black',
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                console.log('SweetAlert mostrada');
                setTimeout(() => {
                    navigate(redirectUrl);
                }, 2000);           
            });

            return response.data;
        } catch (err) {
            const mensaje = err.response?.data?.mensaje || "Error inesperado";

            Swal.fire({
                icon: 'error',
                title: mensaje,
                text: `Hubo un problema al actualizar.`,
                confirmButtonColor: '#FC3F3F',
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
