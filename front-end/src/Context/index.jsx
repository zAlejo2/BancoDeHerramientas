import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const MediosContext = createContext();

export function MediosContextProvider({ children }) {
    const [inputs, setInputs] = useState({});
    const [loader, setLoader] = useState(true);
    const [admin, setAdmin] = useState(false);
    const [tokenSession, setTokenSessionState] = useState(localStorage.getItem('authToken'));
    const [role, setRole] = useState(null);
    const [area, setArea] = useState(null);

    useEffect(() => {
        if (tokenSession) {
            const decodedToken = jwtDecode(tokenSession);
            setRole(decodedToken.role);
            setArea(decodedToken.area); // Cambia 'role' por el nombre correcto en tu token
        }
        setLoader(false);
    }, [tokenSession]); // Ejecutar cuando tokenSession cambie

    const setTokenSession = (token) => {
        setTokenSessionState(token);
        if (token) {
            localStorage.setItem('authToken', token);
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.role); // Cambia 'role' por el nombre correcto
            setArea(decodedToken.area); 
        } else {
            localStorage.removeItem('authToken');
            setRole(null);
            setArea(null);
        }
    };

    return (
        <MediosContext.Provider
            value={{
                inputs,
                setInputs,
                loader,
                setLoader,
                admin,
                setAdmin,
                tokenSession,
                setTokenSession,
                role,
                area
            }}
        >
            {children}
        </MediosContext.Provider>
    );
}
