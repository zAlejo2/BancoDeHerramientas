import { useState, useEffect } from "react";
import axiosInstance from '../helpers/axiosConfig';
import Swal from "sweetalert2";

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
            setError('Error al obtener los datos');
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Parece que hubo un error al obtener los datos.",
                confirmButtonColor: "#6fc390",
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [urls]); 

    return { data, error, loading };
}

export default useGetData;
