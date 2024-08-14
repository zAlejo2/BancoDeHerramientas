import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const LogoutButton = () => {

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const decodedToken = jwtDecode(token);
            const documento = decodedToken.id; // Asegúrate de que el documento esté en el payload del token

            // Registrar el cierre de sesión en el backend
            await axios.post(`${import.meta.env.VITE_API_URL}/logout`, { documento });

            // Eliminar el token y otros datos del usuario del localStorage
            localStorage.removeItem('authToken');

            // Redirigir al usuario a la página de inicio de sesión
            window.location.href = '/login';
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
