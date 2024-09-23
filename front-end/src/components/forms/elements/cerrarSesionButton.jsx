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
            
            Swal.fire({
                title: '¿Estás seguro de cerrar tu sesión?',
                text: "No podrás revertir esta acción",
                icon: 'warning',
                iconColor :'#007BFF',
                showCancelButton: true,  // Mostrar el botón de cancelar
                confirmButtonColor: '#007BFF',
                cancelButtonColor: '#81d4fa',
                confirmButtonText: 'Sí, continuar',  // Texto del botón de confirmación
                cancelButtonText: 'Cancelar',  // Texto del botón de cancelar
              }).then((result) => {
                if (result.isConfirmed) {
                  localStorage.removeItem('authToken');
                  axios.post(`${import.meta.env.VITE_API_URL}/logout`, { documento });
                  window.location.href = '/login';
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
