import { useRoutes, BrowserRouter } from "react-router-dom";
import NavBar from "../components/navbar"
import Home from "../pages/Home"
import Roles from "../pages/roles";
import Prestamos from "../pages/prestamos"
import Daños from "../pages/daños"
import Consumos from "../pages/consumos"
import Usuarios from "../pages/usuarios"
import CerrarSesion from "../pages/cerrarsesion"
import 'bootstrap/dist/css/bootstrap.min.css';


function AppRoutes() {
    let routes = useRoutes([
        { path:"/inicio", element: <Home /> },
        { path:"/roles", element: <Roles /> },
        { path:"/prestamos", element: <Prestamos /> },
        { path:"/daños", element: <Daños /> },
        { path:"/consumos", element: <Consumos /> },
        { path:"/usuarios", element: <Usuarios /> },
        { path:"/cerrarsesion", element: <CerrarSesion /> },
    ]);
    return routes
}
/* La función AppUi es un componente de React que define la estructura y el diseño de la aplicación.
Devuelve código JSX que representa la interfaz de usuario de la aplicación. */

export const AppUi = () => {

    return (
        <>
            <BrowserRouter>
                <NavBar />
                <AppRoutes />
            </BrowserRouter>
        </>
    )
}