import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import useLogin from '@/hooks/useLogin';
import Swal from 'sweetalert2';


const LogoutButton = () => {

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const decodedToken = jwtDecode(token);
            const documento = decodedToken.id; 

            await axios.post(`${import.meta.env.VITE_API_URL}/logout`, { documento });

            localStorage.removeItem('authToken');

            



            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esta acción",
                icon: 'warning',
                showCancelButton: true,  // Mostrar el botón de cancelar
                confirmButtonText: 'Sí, continuar',  // Texto del botón de confirmación
                cancelButtonText: 'Cancelar',  // Texto del botón de cancelar
                reverseButtons: true  // Opcional: invierte el orden de los botones
              }).then((result) => {
                if (result.isConfirmed) {
                  // Acción a tomar si se presiona "Sí, continuar"
                  Swal.fire(
                    '¡Hecho!',
                    'Tu Sesión ha sido Cerrada Correctamente.',
                    'success'
                  ).then(()=>{
                    window.location.href = '/login';
                  })
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  // Acción a tomar si se presiona "Cancelar"
                  Swal.fire(
                    'Cancelado',
                    'Tu acción ha sido cancelada.',
                    'error'
                  )
                }
              });
              
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <button onClick={handleLogout}>
            Cerrar Sesión
        </button>
    );
};

export default LogoutButton;
