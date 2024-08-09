import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { MediosContext } from '../Context';

export const ProtectedRoute = ({ children }) => {
    const { tokenSession } = useContext(MediosContext);
    const location = useLocation();

    if (!tokenSession) {
        // Redirige al login si no está autenticado
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};
