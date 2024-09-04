import { useState, useEffect } from 'react';

function useReturnData(initialData) {
  const [data, setData] = useState(initialData || []);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Función para validar los datos antes de devolverlos
  const validateData = (data) => {
    if (!Array.isArray(data)) {
      setErrorMessage('Los datos deben ser un array.');
      setIsValid(false);
      return false;
    }

    for (let item of data) {
      if (!item.id || !item.name) {
        setErrorMessage('Cada item debe tener un id y un nombre.');
        setIsValid(false);
        return false;
      }
    }

    setErrorMessage('');
    setIsValid(true);
    return true;
  };

  // Efecto para validar los datos cada vez que cambian
  useEffect(() => {
    validateData(data);
  }, [data]);

  // Función para actualizar los datos
  const updateData = (newData) => {
    if (validateData(newData)) {
      setData(newData);
    }
  };

  // Función para devolver los datos si son válidos
  const returnData = () => {
    if (isValid) {
      return data;
    } else {
      return null;
    }
  };

  return {
    data,
    isValid,
    errorMessage,
    updateData,
    returnData,
  };
}

export default useReturnData;
