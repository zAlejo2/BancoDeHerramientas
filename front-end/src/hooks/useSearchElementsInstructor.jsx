// hooks/useSearchElements.js
import { useState, useEffect } from "react";
import axiosInstance from "../helpers/axiosConfig";

function useSearchElements(searchTerm) {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!searchTerm) {
            setData([]);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/elements/by-description/instructor/${searchTerm}`);
                setData(response.data);
            } catch (error) {
                console.log('Error al obtener los datos:', error);
                // setError('Elemento no encontrado');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchTerm]); // Dependencia: solo vuelve a ejecutar cuando searchTerm cambie

    return { data, error, loading };
}

export default useSearchElements;
