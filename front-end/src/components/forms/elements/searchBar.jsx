import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGetData from '../../../hooks/useGetData.jsx';

const SearchBar = () => {
  const [documento, setDocumento] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { data, loading } = useGetData([`clients/`]); // Modificado para traer todos los clientes

  const handleSearch = (e) => {
    e.preventDefault();

    if (loading) return;

    // Busca el cliente en el array
    const clienteEncontrado = data['clients/']?.find(
      (cliente) => cliente.documento.toString() === documento
    );

    if (clienteEncontrado) {
      navigate(`/prestamos/${documento}`);
    // console.log("si existe en la bd")
    } else {
      setError('El documento no existe en la base de datos.');
    }
  };

  return (
    <div className="search-container">
    <center>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Ingrese el número de documento"
          value={documento}
          onChange={(e) => {
            setDocumento(e.target.value);
            setError(null);
          }}
          style={{
            border: '2px solid black',
            padding: '8px',
            borderRadius: '4px',
            width: '300px',
            alignContent: 'center',
            marginBottom: '40px',
            margin: '10px'
          }}
        />
        <button type="submit" style={{backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '4px'}}>Buscar</button>
      </form>
    </center>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SearchBar;

