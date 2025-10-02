import { createBrowserRouter } from "react-router-dom";

import Login from "../Composants/Login/Login";
import Inscription from "../Composants/Inscription/Inscription";
import Main from '../Main';
import Analyse from "../Pages/Analyse/Analyse";
import Rapport from "../Pages/Rapport/Rapport";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Data from "../Pages/Donnees/Data";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />
    },
    {
        path: '/inscription',
        element: <Inscription />
    },
    {
        path: '/main',
        element: <Main />,
        children: [
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'data',
                element: <Data />
            },
            {
                path: 'analysis',
                element: <Analyse />
            },
            {
                path: 'reporting',
                element: <Rapport />
            },
        ]
    }
])