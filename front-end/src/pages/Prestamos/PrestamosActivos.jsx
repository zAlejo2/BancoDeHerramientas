import useGetData from '../../hooks/useGetData';

const PrestamosActivos = () => {
  const { data, error, loading } = useGetData(['prestamos/todosPrestamos']);

  console.log(data); // Verifica la estructura de los datos aquí

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  // Accede directamente a los préstamos que obtienes de la respuesta
  const prestamos = data['prestamos/todosPrestamos'] || [];

  // Filtra los préstamos activos
  const prestamosActivos = prestamos.filter(prestamo => prestamo.estado === 'actual');

  return (
    <div><br/>
      <h1>Elementos Prestados</h1><br/>
      <table>
        <thead>
          <tr>
            <th>DOCUMENTO</th>
            <th>NOMBRE</th>
            <th>GRUPO</th>
            <th>CODIGO</th>
            <th>DESCRIPCION</th>
            <th>CANTIDAD</th>
            <th>FECHA</th>
          </tr>
        </thead>
        <tbody>
          {prestamosActivos.map((prestamo) => (
            <tr key={prestamo.PrestamoCorriente.Cliente.documento}>
              <td>{prestamo.PrestamoCorriente.Cliente.documento}</td>
              <td>{prestamo.PrestamoCorriente.Cliente.nombre}</td>
              <td>{prestamo.PrestamoCorriente.Cliente.roles_idrol}</td>
              <td>{prestamo.Elemento.idelemento}</td>
              <td>{prestamo.Elemento.descripcion}</td>
              <td>{prestamo.cantidad}</td>
              <td>{prestamo.fecha_entrega}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrestamosActivos;
