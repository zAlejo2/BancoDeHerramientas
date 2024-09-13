import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BookIcon, CircleAlertIcon, ClipboardIcon, PenToolIcon, TriangleAlertIcon, UserIcon, FileTextIcon, HomeIcon, SettingsIcon, XIcon, List, HandCoins  } from "lucide-react";
import { LuArrowDownLeftFromCircle } from "react-icons/lu";
import useGetData from "@/hooks/useGetData";
import InputPrestamo from '../Prestamos/InputPrestamo.jsx';
import { AiOutlineAlert } from "react-icons/ai";
import { CgReorder } from "react-icons/cg";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const { data: prestamosData, error, loading } = useGetData(["prestamos/todosPrestamos"]);
  const prestamos = prestamosData['prestamos/todosPrestamos'] || [];

  // Función para obtener el préstamo con la fecha más actual
  const getLatestPrestamos = () => {
    if (prestamos.length === 0) return [];

    // Encuentra la fecha más actual
    const maxDate = prestamos.reduce((max, prestamo) => {
      const fechaEntrega = new Date(prestamo.fecha_entrega || 0);
      const fechaDevolucion = new Date(prestamo.fecha_devolucion || 0);
      const maxDateForPrestamo = Math.max(fechaEntrega, fechaDevolucion);
      return Math.max(max, maxDateForPrestamo);
    }, 0);

    // Filtra los préstamos que tienen la fecha máxima
    return prestamos.filter(prestamo => {
      const fechaEntrega = new Date(prestamo.fecha_entrega || 0);
      const fechaDevolucion = new Date(prestamo.fecha_devolucion || 0);
      const maxDateForPrestamo = Math.max(fechaEntrega, fechaDevolucion);
      return maxDateForPrestamo === maxDate;
    });
  };

  const countPrestamosByState = (state) => {
    return prestamos.filter(prestamo => prestamo.estado === state).length;
  };

  const latestPrestamos = getLatestPrestamos();

  return (
    <>
      <section className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-4">
        {["Préstamos", "Encargos", "Mora", "Daños"].map((item, index) => (
          <Card key={index} className="bg-primary text-primary-foreground">
            <CardHeader className="flex justify-between">
              <CardTitle> {item === "Préstamos" ? countPrestamosByState("actual") : Math.floor(Math.random() * 5000)}</CardTitle>
              <Icon name={item} className="w-6 h-6" />
            </CardHeader>
            <CardContent>
              <CardDescription style={{ color: 'white' }}>{item}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="mt-6">
        <InputPrestamo/>
        <Card className="border-input">
          <Table>
          <TableHeader sx={{ color: 'white', textAlign: 'center' }}>
            <TableRow>
              <TableHead className="text-white text-center">DOCUMENTO</TableHead>
              <TableHead className="text-white text-center">USUARIO</TableHead>
              <TableHead className="text-white text-center">DESCRIPCION</TableHead>
              <TableHead className="text-white text-center">ESTADO</TableHead>
            </TableRow>
          </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan="4">Cargando...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan="4">Error al cargar datos</TableCell>
                  </TableRow>
                    ) : latestPrestamos.length > 0 ? (
                      latestPrestamos.map((prestamo) => (
                        <TableRow key={prestamo.PrestamoCorriente.documento}>
                          <TableCell>{prestamo.PrestamoCorriente.Cliente.documento}</TableCell>
                          <TableCell>{prestamo.PrestamoCorriente.Cliente.nombre}</TableCell>
                          <TableCell>{prestamo.Elemento.descripcion}</TableCell>
                          <TableCell>{prestamo.estado}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                <TableRow>
                  <TableCell colSpan="4">No hay préstamos</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </section>
    </>
  );
};

function Icon({ name, ...props }) {
  const icons = {
    "Inicio": <HomeIcon {...props} />,
    "Préstamos": <HandCoins {...props} />,
    "Consumos": <LuArrowDownLeftFromCircle {...props} />,
    "Encargos": <CgReorder {...props} />,
    "Mora": <AiOutlineAlert {...props} />,
    "Daños": <TriangleAlertIcon {...props} />,
    "Elementos": <PenToolIcon {...props} />,
     "Lista": <List {...props} />,
    "Usuarios": <UserIcon {...props} />,
    "Roles": <FileTextIcon {...props} />,
    "Admin": <SettingsIcon {...props} />
  };
  return icons[name] || <XIcon {...props} />;
}
