import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const LogoutButton = () => {

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const decodedToken = jwtDecode(token);
            const documento = decodedToken.id; 

            await axios.post(`${import.meta.env.VITE_API_URL}/logout`, { documento });

            localStorage.removeItem('authToken');

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
