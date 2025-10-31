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
import Pieces from "../Pages/Donnees/Pieces/Pieces.jsx";
import Comptes from "../Pages/Donnees/Comptes/Comptes.jsx";
import { ListeTranscription } from "../Pages/Donnees/Transcription/ListeTranscription.jsx";
import Liste from "../Pages/ComptePiece/Liste.jsx";
import Unauthorized from "../Composants/Unauthorized/Unauthorized.jsx";
import PrivateRoute from "../Composants/PrivateRoute/PrivateRoute.jsx";
// import { Liste as Liste_transcription } from "../Pages/Transcription/Liste.jsx";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />
    },
    {
        path: '/unauthorized',
        element: <Unauthorized />
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
                element: <PrivateRoute />,
                children: [
                    {
                        path: 'transcription',
                        element: <Transcription />,    
                    }
                ]
            },
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'data',
                element: <Data />,
                children: [
                    {
                        element: <PrivateRoute />,
                        children: [
                            {
                                path: 'liaison_compte_piece',
                                element: <Liste />
                            },
                            {
                                path: 'ajouter_liaison_compte_piece',
                                element: <ComptePiece />
                            },
                        ]
                    },
                    {
                        index: true,
                        element: <ListeTranscription />
                    },
                    {
                        path: 'pieces',
                        element: <Pieces />
                    },
                    {
                        path: 'comptes',
                        element: <Comptes />
                    },
                    {
                        path: 'liaison_compte_piece',
                        element: <Liste />
                    },
                    // {
                    //     path: 'ajouter_liaison_compte_piece',
                    //     element: <ComptePiece />
                    // },
                ]
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
            
            // {
            //     path: 'liste_transcription',
            //     element: <Liste_transcription />
            // }
        ]
    }
])