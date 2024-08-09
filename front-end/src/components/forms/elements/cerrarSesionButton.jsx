import React from 'react';
import axios from 'axios';

const LogoutButton = ({ documento }) => {
  const handleLogout = async () => {
    try {
      // Elimina el token del almacenamiento local
      localStorage.removeItem('token');
      
      // Envía una solicitud al servidor para registrar el cierre de sesión
      await axios.post('/logout', { documento });

      // Redirige al usuario a la página de inicio de sesión
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <button onClick={handleLogout}>Cerrar Sesión</button>
  );
};

export default LogoutButton;
