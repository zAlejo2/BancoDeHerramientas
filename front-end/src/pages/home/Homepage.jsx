import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BookIcon, CircleAlertIcon, ClipboardIcon, PenToolIcon, TriangleAlertIcon, UserIcon, FileTextIcon, HomeIcon, SettingsIcon, LogOutIcon, XIcon } from "lucide-react";
import useGetData from "@/hooks/useGetData"; // Adjust path as needed
import SearchBar from "@/components/forms/elements/searchBar.jsx";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const { data, error, loading } = useGetData(["elements"]);
  const elementos = data.elements || [];

  return (
    <>
      <section className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-4">
        {["Préstamos", "Encargos", "Mora", "Daños"].map((item, index) => (
          <Card key={index} className="bg-primary text-primary-foreground">
            <CardHeader className="flex justify-between">
              <CardTitle>{Math.floor(Math.random() * 5000)}</CardTitle>
              <Icon name={item} className="w-6 h-6" />
            </CardHeader>
            <CardContent>
              <CardDescription>{item}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="mt-6">
        <SearchBar></SearchBar>
        <Card className="border-input">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Ubicacion</TableHead>
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
              ) : (
                elementos.map((elemento, index) => (
                  <TableRow key={elemento.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{elemento.descripcion}</TableCell>
                    <TableCell>{elemento.cantidad}</TableCell>
                    <TableCell>{elemento.ubicacion}</TableCell>
                  </TableRow>
                ))
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
    "Préstamos": <BookIcon {...props} />,
    "Consumos": <PenToolIcon {...props} />,
    "Encargos": <ClipboardIcon {...props} />,
    "Moras": <CircleAlertIcon {...props} />,
    "Daños": <TriangleAlertIcon {...props} />,
    "Elementos": <PenToolIcon {...props} />,
    "Usuarios": <UserIcon {...props} />,
    "Roles": <FileTextIcon {...props} />,
    "Admin": <SettingsIcon {...props} />
  };
  return icons[name] || <XIcon {...props} />;
}
