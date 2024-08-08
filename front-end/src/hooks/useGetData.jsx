import { useState, useEffect } from "react";
import axiosInstance from '../helpers/axiosConfig';

function useGetData(urls) {
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const requests = urls.map(url => axiosInstance.get(`${import.meta.env.VITE_API_URL}/${url}`));
            const results = await Promise.all(requests);
            const updatedData = results.reduce((prevData, responseData, index) => {
                const key = urls[index];
                return { ...prevData, [key]: responseData.data };
            }, {});

            setData(updatedData);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setError('Error al obtener los datos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); 

    return { data, error, loading };
}

export default useGetData;
