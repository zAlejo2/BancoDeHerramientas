// ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { MediosContext } from '../Context';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { tokenSession, role, loader } = useContext(MediosContext);
    const location = useLocation();

    // Si se recarga la página o aestá cargando para que no me redirija automáticamente a la ruta de acceso denegado
    if (loader) {
        return null; // o un loader si prefieres
    }

    if (!tokenSession) {
        // Redirige al login si no está autenticado
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirige a una página de acceso denegado si el rol no está permitido
        return <Navigate to="/access-denied" replace />;
    }

    return children;
};
