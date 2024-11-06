import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import useGetData from '@/hooks/useGetData';
import useUpdate from '@/hooks/useUpdate';

const PerfilCliente = () => {
  const [cliente, setCliente] = useState({
    nombre: '',
    documento: '',
    contrasena: '',
    fechaInicio: '',
    fechaFin: '',
    numero:'',
    correo: '',
    foto: '',
  });

  const { updateEntity: updateCorreo, loading: loadingUpdateCorreo } = useUpdate('clients/cambiar-correo', '/Perfil-Cliente');
  const { updateEntity: updateContrasena, loading: loadingUpdateContrasena } = useUpdate('clients/cambiar-contrasena', '/Perfil-Cliente');
  const { data, error: errorGet, loading: loadingGet } = useGetData(['clients/info-cliente']);
  const navigate = useNavigate();

  useEffect(() => {
    if (data['clients/info-cliente']) {
      setCliente(data['clients/info-cliente']);
    }
  }, [data]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setCliente((prevCliente) => ({
      ...prevCliente,
      [name]: value,
    }));
  };

  const guardarCambios = () => {
    updateCorreo('', { correo: cliente.correo, numero: cliente.numero });
  };

  const Devolver = () => {
    navigate('/encargos/lista');
  };

  const Cambiarcontraseña = () => {
    Swal.fire({
      title: 'Cambiar Contraseña',
      html: `<input type="password" id="newPassword" class="swal2-input" placeholder="Nueva contraseña">
             <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirmar contraseña">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#007BFF',
      cancelButtonColor: '#81d4fa',
      preConfirm: () => {
        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        if (!newPassword || !confirmPassword) {
          Swal.showValidationMessage('Ambos campos son obligatorios');
          return false;
        }

        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('Las contraseñas no coinciden');
          return false;
        }

        return { contrasena: newPassword };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        updateContrasena('', result.value)
      }
    });
  };

  if (loadingGet) return <p>Cargando datos...</p>;

  return (
    <div className="flex justify-center items-center m-6">
      <div className="bg-white border border-neutral-200/40 shadow-lg shadow-[#1565c023] rounded-lg p-8 w-[32rem]">
        <h2 className="text-2xl font-bold mb-4 text-center">Mi Perfil</h2>

        <hr color="black" size="5"/><br></br>

        <div className="flex justify-center mb-4">
          <img src={`${import.meta.env.VITE_IMAGENES_URL}/${cliente.foto}`} alt="Foto del cliente" className="rounded-full w-24 h-24" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="font-semibold">Nombre:</span><br />
            <span>{cliente.nombre}</span>
          </div>
          <div>
            <span className="font-semibold">Documento:</span><br />
            <span>{cliente.documento}</span>
          </div>
          <div>
            <span className="font-semibold">Fecha Inicio:</span><br />
            <span>{cliente.fechaInicio}</span>
          </div>
          <div>
            <span className="font-semibold">Fecha Fin:</span><br />
            <span>{cliente.fechaFin}</span>
          </div>
          <div>
            <span className="font-semibold">Celular:</span><br />
            <input 
              type="number" 
              name="numero" 
              value={cliente.numero} 
              onChange={manejarCambio} 
              className="border rounded p-1 w-full"
            />
          </div>
          <div>
            <span className="font-semibold">Correo Electrónico:</span><br />
            <input 
              type="email" 
              name="correo" 
              value={cliente.correo} 
              onChange={manejarCambio} 
              className="border rounded p-1 w-full"
            />
          </div>
        </div>

        <hr color="black" size="8"/><br></br>

        <div className="flex justify-between mt-6 space-x-2">
          <button className="bg-black text-white rounded-md w-full py-1 px-1" onClick={Cambiarcontraseña}>
            Cambiar Contraseña
          </button>
          <button className="bg-black text-white rounded-md w-full py-1" onClick={guardarCambios} disabled={loadingUpdateCorreo}>
            {loadingUpdateCorreo ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button className="bg-black text-white rounded-md w-full py-1" onClick={Devolver}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilCliente;
