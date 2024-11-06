import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import useGetData from '@/hooks/useGetData';
import useUpdate from '@/hooks/useUpdate';

const PerfilAdmin = () => {
  const [Admin, setAdmin] = useState({
    nombre: '',
    documento: '',
    contraseña:'',
    tipo:'',
    correo: '',
    numero:'',
    area:''
  });
 
  const { updateEntity: updateCorreo, loading: loadingUpdateCorreo } = useUpdate('admins/cambiar-correo', '/Perfil-Admin');
  const { updateEntity: updateContrasena, loading: loadingUpdateContrasena } = useUpdate('admins/cambiar-contrasena', '/Perfil-Admin');
  const { data, error: errorGet, loading: loadingGet } = useGetData(['admins/info-admin']);
  const navigate = useNavigate();

  useEffect(() => {
    if (data['admins/info-admin']) {
      setAdmin(data['admins/info-admin']);
    }
  }, [data]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setAdmin((prevAdmin) => ({
      ...prevAdmin,
      [name]: value,
    }));
  };

  const guardarCambios = () => {
    updateCorreo('', { correo: Admin.correo, numero: Admin.numero });
  };

  const Devolver = () => {
    navigate('/inicio');
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
    
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div >
            <span className="font-semibold">Nombre:</span><br />
            <span>{Admin.nombre}</span>
          </div>
          <div>
            <span className="font-semibold">Documento:</span><br />
            <span>{Admin.documento}</span>
          </div>
          <div>
            <label className="font-semibold">Lugar :</label><br />
            <span>{Admin.area}</span>
          </div>
          <div>
            <span className="font-semibold">Tipo:</span><br />
            <span>{Admin.tipo}</span>
          </div>
          <div>
            <span className="font-semibold">Celular:</span><br />
            <input 
              type="number" 
              name="numero" 
              value={Admin.numero} 
              onChange={manejarCambio} 
              className="border rounded p-1 w-full"
            />
          </div>
          <div>
            <span className="font-semibold">Correo Electrónico:</span><br/>
            <input 
              type="email" 
              name="correo" 
              value={Admin.correo} 
              onChange={manejarCambio} 
              className="border rounded p-1 w-full"
            />
          </div>
        </div>
        
        <hr color="black" size="5"/>

        <div className="flex justify-between mt-6 space-x-3">
          <button className="bg-black text-white rounded-md w-full py-1 px-1" onClick={Cambiarcontraseña}>
            Cambiar Contraseña
          </button>
          <button className="bg-black text-white rounded-md w-full py-1" onClick={guardarCambios}>
            Guardar Cambios
          </button>
          <button className="bg-black text-white rounded-md w-full py-1" onClick={Devolver}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilAdmin;