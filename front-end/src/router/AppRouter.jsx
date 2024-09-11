// routes.js
import { useRoutes, Navigate } from 'react-router-dom';
import {ProtectedRoute} from './ProtectedRoute';
import {LoginRoute} from './LoginRoute';
import { Login } from '../pages/login/LoginPage';
import { HomePage } from '../pages/home/Homepage';
import { FormElementos } from '@/pages/Elementos/FormElementos';
import { FormRoles } from '@/pages/Roles/FormRoles';
import { FormClientes } from '@/pages/Clientes/FormClientes';
import PrestamosActivos from '@/pages/Prestamos/PrestamosActivos';
import ListaElementos from '@/pages/Prestamos/ListaElementos';
import { FormAreas } from '@/pages/Areas/FormAreas';
import { FormAdmin } from '@/pages/Administradores/FormAdmin';
import { FormCrearConsumo } from '../pages/Consumos/FormCrearConsumo.jsx';
import { FormAgregarEditarConsumo } from '../pages/Consumos/FormAgregegarEditar.jsx';
import { FormAgregarEditarPrestamo } from '../pages/Prestamos/FormAgregarEditar.jsx';
import ElementosList from '@/pages/Elementos/ListaElementos';

export const AppRoutes = ({tokenSession}) => {
    return useRoutes([
        { 
            path: '/', 
            element: (
                <LoginRoute>
                    <Login /> 
                </LoginRoute>
            )
        },
        { 
            path: '/login', 
            element: (
                <LoginRoute>
                    <Login /> 
                </LoginRoute>
            )
        },
        {
            path: '/inicio',
            element: (
                <ProtectedRoute>
                    <HomePage />
                </ProtectedRoute>
            ),
        },
        {
            path: '/elementos/formulario',
            element: (
                <ProtectedRoute>
                    <FormElementos />
                </ProtectedRoute>
            ),
        },
        {
            path: '/elementos/lista',
            element: (
                <ProtectedRoute>
                    <ElementosList />
                </ProtectedRoute>
            ),
        },
        {
            path: '/roles/formulario',
            element: (
                <ProtectedRoute>
                    <FormRoles />
                </ProtectedRoute>
            ),
        },
        {
            path: '/usuarios/formulario',
            element: (
                <ProtectedRoute>
                    <FormClientes />
                </ProtectedRoute>
            ),
        },
        {
            path: '/prestamos/lista',
            element: (
                <ProtectedRoute>
                    <PrestamosActivos />
                </ProtectedRoute>
            ),
        },
        {
            path: '/prestamos/lista2',
            element: (
                <ProtectedRoute>
                    <ListaElementos />
                </ProtectedRoute>
            ),
        },
        {
            path: '/areas/formulario',
            element: (
                <ProtectedRoute>
                    <FormAreas />
                </ProtectedRoute>
            ),
        },
        {
            path: '/administrador/formulario',
            element: (
                <ProtectedRoute>
                    <FormAdmin />
                </ProtectedRoute>
            ),
        },
        {
            path: '/consumos',
            element: (
                <ProtectedRoute>
                    <FormCrearConsumo/>
                </ProtectedRoute>
            )
        },
        {
            path: '/consumos/elementos/:idconsumo',
            element: (
                <ProtectedRoute>
                    <FormAgregarEditarConsumo/>
                </ProtectedRoute>
            )
        },
        {
            path: '/prestamos/elementos/:idprestamo',
            element: (
                <ProtectedRoute>
                    <FormAgregarEditarPrestamo/>
                </ProtectedRoute>
            )
        },
        {
            path: '*',  
            element: <Navigate to={tokenSession ? "/inicio" : "/login"} replace />
        }
    ]);
};

export const routeLogin = () => {
    return useRoutes([
        
    ]);
}

