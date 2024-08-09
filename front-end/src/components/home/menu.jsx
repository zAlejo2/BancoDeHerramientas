import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { HomeIcon, BookIcon, PenToolIcon, ClipboardIcon, CircleAlertIcon, TriangleAlertIcon, UserIcon, FileTextIcon, SettingsIcon, LogOutIcon, XIcon, ChevronDownIcon, ClipboardList, List, HandCoins } from "lucide-react";
import { MdOutlineConstruction } from "react-icons/md";
import { Divider } from '@mui/material';
import LogoutButton from '../forms/elements/cerrarSesionButton';

export const Menu = ({ children }) => {
    const [selectedMenu, setSelectedMenu] = useState("Inicio");
    const [darkMode, setDarkMode] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const navigate = useNavigate();

    const menuItems = [
        { name: "Inicio", to: "/inicio" },
        { 
            name: "Prestamos", 
            to: "/prestamos", 
            subMenu: [
                { name: "Lista 1", to: "/prestamos/lista" }, 
                { name: "Lista 2", to: "/prestamos/lista2" }, 
            ]
        },
        { 
            name: "Elementos", 
            to: "/elementos", 
            subMenu: [
                { name: "Formulario", to: "/elementos/formulario" }, 
                // { name: "Encargos", to: "/elementos/encargos" }
            ]
        },
        { 
            name: "Areas", 
            to: "/areas", 
            subMenu: [
                { name: "Formulario", to: "/areas/formulario" }, 
                // { name: "Encargos", to: "/alertas/encargos" }
            ]
        },
        { 
            name: "Clientes", 
            to: "/clientes", 
            subMenu: [
                { name: "Formulario", to: "/usuarios/formulario" }, 
                // { name: "Encargos", to: "/usuarios/encargos" }
            ]
        },
        { 
            name: "Roles", 
            to: "/roles", 
            subMenu: [
                { name: "Formulario", to: "/roles/formulario" }, 
                // { name: "Encargos", to: "/roles/encargos" }
            ]
        },
        { 
            name: "Admin", 
            to: "/admin", 
            subMenu: [
                { name: "Formulario", to: "/administrador/formulario" }, 
                // { name: "Encargos", to: "/admin/encargos" }
            ]
        }
    ];

    return (
        <div className={`flex min-h-screen ${darkMode ? "dark" : ""}`}>
            <aside className="w-64 bg-background text-foreground flex flex-col border-r border-gray">
                <div className="flex items-center p-4 border-b">
                    <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>AB</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                        <h1 className="text-lg font-bold">Admin-B.H</h1>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <div key={item.name}>
                            {item.name === "Inicio" ? (
                                <Link
                                    to={item.to}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${selectedMenu === item.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                                    onClick={() => setSelectedMenu(item.name)}
                                >
                                    <Icon name={item.name} className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            ) : (
                                <div>
                                    <div
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors cursor-pointer hover:bg-muted ${openSubMenu === item.name ? "bg-primary hover:bg-primary text-primary-foreground" : ""}`}
                                        onClick={() => setOpenSubMenu(openSubMenu === item.name ? null : item.name)}
                                    >
                                        <Icon name={item.name} className="w-5 h-5" />
                                        <span>{item.name}</span>
                                        <ChevronDownIcon className={`w-4 h-4 ml-auto transition-transform ${openSubMenu === item.name ? "rotate-180" : ""}`} />
                                    </div>
                                    {openSubMenu === item.name && (
                                        <div className="pl-6 mt-2 space-y-1">
                                            {item.subMenu.map((submenu) => (
                                                <Link
                                                    key={submenu.name}
                                                    to={submenu.to}
                                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${selectedMenu === submenu.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                                                    onClick={() => {
                                                        setSelectedMenu(submenu.name);
                                                        setOpenSubMenu(null);
                                                    }}
                                                >
                                                    <Icon name={submenu.name} className="w-5 h-5" />
                                                    <span>{submenu.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>
            <Divider />
            <main className="flex-1 p-6 bg-background">
                <header className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Banco de Herramientas</h2>
                    <div className="flex items-center space-x-4">
                        <span>admin-B.H</span>
                        <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src="/placeholder-user.jpg" />
                                    <AvatarFallback>AB</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <UserIcon className="w-4 h-4 mr-2" />
                                    <span>Perfil</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <SettingsIcon className="w-4 h-4 mr-2" />
                                    <span>Configuración</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                    <LogOutIcon className="w-4 h-4 mr-2" />
                                    <LogoutButton>Cerrar Sesión</LogoutButton>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <Divider />
                {children}
            </main>
        </div>
    );
}

function Icon({ name, ...props }) {
    const icons = {
        "Inicio": <HomeIcon {...props} />,
        "Consumos": <PenToolIcon {...props} />,
        "Encargos": <ClipboardIcon {...props} />,
        "Areas": <CircleAlertIcon {...props} />,
        "Clientes": <UserIcon {...props} />,
        "Roles": <FileTextIcon {...props} />,
        "Admin": <SettingsIcon {...props} />,
        "Elementos": <MdOutlineConstruction {...props} />,
        "Formulario": <ClipboardList {...props} />,
        "Lista 1": <List {...props} />,
        "Lista 2": <List {...props} />,
        "Prestamos": <HandCoins {...props} />,
    };
    return icons[name] || <XIcon {...props} />;
}
