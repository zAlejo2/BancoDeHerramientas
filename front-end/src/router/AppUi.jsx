// AppUi.js
import React, { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MediosContext } from '../Context';
import Loader from '../components/Loader';
import { AppRoutes } from './AppRouter';
import { Menu } from '@/components/home/menu';

export const AppUi = () => {
    const { loader, tokenSession } = useContext(MediosContext);

    return (
        <BrowserRouter>
            {loader && <Loader />}
                <Menu>
                <AppRoutes />
                </Menu>
        </BrowserRouter>
    );
};
