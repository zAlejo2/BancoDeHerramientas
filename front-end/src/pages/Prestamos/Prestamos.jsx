import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Prestamos = () => {
  const { documento } = useParams();
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/prestamos/${documento}`);
        setPrestamos(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPrestamos();
  }, [documento]);

  return (
    <div>
      <h2>Préstamos para el documento: {documento}</h2>
      <ul>
        <li>{prestamos.idprestamo}, {prestamos.estado}
        </li>
        {/* {prestamos.map((prestamo) => ( */}
          {/* <li key={prestamo.id}>Muestra los detalles del préstamo aquí</li> */}
        {/* ))} */}
      </ul>
    </div>
  );
};

export default Prestamos;
