import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BookIcon, CircleAlertIcon, ClipboardIcon, PenToolIcon, TriangleAlertIcon, UserIcon, FileTextIcon, HomeIcon, SettingsIcon, XIcon, List, HandCoins  } from "lucide-react";
import { LuArrowDownLeftFromCircle } from "react-icons/lu";
import useGetData from "@/hooks/useGetData";
import InputPrestamo from '../Prestamos/InputPrestamo.jsx';
import { AiOutlineAlert } from "react-icons/ai";
import { CgReorder } from "react-icons/cg";
import { GiReturnArrow } from "react-icons/gi";
import { MdManageHistory } from "react-icons/md";

export const HomePage = () => {
  const { data: cantidad } = useGetData(["prestamos/todosPrestamos"]);
  const { data: prestamosData, error, loading } = useGetData(["historial"]);
  const prestamos = prestamosData['historial'] || [];
  const cantidadPrestamos = cantidad['prestamos/todosPrestamos'] || [];

  // Función para obtener el préstamo con la fecha más actual
  const getLatestPrestamos = () => {
    if (prestamos.length === 0) return [];
  
    // Encuentra la fecha más actual
    const maxDate = prestamos.reduce((max, prestamo) => {
      const fecha = new Date(prestamo.fecha_accion || 0);
      return fecha.getTime() > max.getTime() ? fecha : max;
    }, new Date(0)); // Valor inicial: la fecha más temprana posible
  
    // Filtra los préstamos que tienen la fecha máxima
    return prestamos.filter(prestamo => {
      const fecha = new Date(prestamo.fecha_accion || 0);
      return fecha.getTime() === maxDate.getTime();
    });
  };  

  const countPrestamosByState = (state) => {
    return cantidadPrestamos.filter(prestamo => prestamo.estado === state).length;
  };

  const latestPrestamos = getLatestPrestamos();

  return (
    <>
      <section className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-5 ">
        {["Préstamos", "Encargos", "Mora", "Daños", "Préstamos Especiales"].map((item, index) => (
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
              <TableHead className="text-white text-center">Documento</TableHead>
              <TableHead className="text-white text-center">Usuario</TableHead>
              <TableHead className="text-white text-center">Elemento</TableHead>
              <TableHead className="text-white text-center">Acción</TableHead>
              <TableHead className="text-white text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan="4">Cargando...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan="5">Error al cargar datos</TableCell>
                  </TableRow>
                    ) : latestPrestamos.length > 0 ? (
                      latestPrestamos.map((prestamo) => (
                        <TableRow key={prestamo.id_historial}>
                          <TableCell>{prestamo.cliente_id}</TableCell>
                          <TableCell>{prestamo.cliente_nombre}</TableCell>
                          <TableCell>{prestamo.elemento_nombre}</TableCell>
                          <TableCell>{prestamo.accion}</TableCell>
                          <TableCell>{prestamo.estado}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                <TableRow>
                  <TableCell colSpan="5">No hay préstamos</TableCell>
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
    "Daños": <MdManageHistory {...props} />,
    "Elementos": <PenToolIcon {...props} />,
    "Lista": <List {...props} />,
    "Usuarios": <UserIcon {...props} />,
    "Roles": <FileTextIcon {...props} />,
    "Admin": <SettingsIcon {...props} />,
    "Préstamos Especiales": <GiReturnArrow {...props} />
  };
  return icons[name] || <XIcon {...props} />;
}
