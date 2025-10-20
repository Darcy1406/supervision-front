import { createBrowserRouter } from "react-router-dom";

import Login from "../Composants/Login/Login";
import Inscription from "../Composants/Inscription/Inscription";
import Main from '../Main';
import { Transcription } from '../Pages/Transcription/Transcription'
import Rapport from "../Pages/Rapport/Rapport";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Data from "../Pages/Donnees/Data";
import ComptePiece from "../Pages/ComptePiece/ComptePiece";
import { Tsdmt } from "../Pages/Transcription/Pieces/Tsdmt/Tsdmt.jsx";
import Liste from "../Pages/ComptePiece/Liste.jsx";
// import { Liste as Liste_transcription } from "../Pages/Transcription/Liste.jsx";


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
                path: 'reporting',
                element: <Rapport />
            },
            {
                path: 'compte_piece',
                element: <ComptePiece />
            },
            {
                path: 'compte_piece_list',
                element: <Liste />
            },
            {
                path: 'transcription',
                element: <Transcription />,
            }, 
            // {
            //     path: 'liste_transcription',
            //     element: <Liste_transcription />
            // }
        ]
    }
])