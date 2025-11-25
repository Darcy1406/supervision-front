import { createBrowserRouter } from "react-router-dom";

import Login from "../Composants/Login/Login.jsx";
import Inscription from "../Composants/Inscription/Inscription.jsx";
import Main from '../Main.jsx';
import { Transcription } from '../Pages/Transcription/Transcription.jsx'
import Analyse from "../Pages/Analyse/Analyse.jsx";
import Dashboard from "../Pages/Dashboard/Dashboard.jsx";
import Data from "../Pages/Donnees/Data.jsx";
import ComptePiece from "../Pages/ComptePiece/ComptePiece.jsx";
import { Tsdmt } from "../Pages/Transcription/Pieces/Tsdmt/Tsdmt.jsx";
import Pieces from "../Pages/Donnees/Pieces/Pieces.jsx";
import Comptes from "../Pages/Donnees/Comptes/Comptes.jsx";
import { ListeTranscription } from "../Pages/Donnees/Transcription/ListeTranscription.jsx";
import Liste from "../Pages/ComptePiece/Liste.jsx";
import Unauthorized from "../Composants/Unauthorized/Unauthorized.jsx";
import PrivateRoute from "../Composants/PrivateRoute/PrivateRoute.jsx";
import SjeAnalyse from "../Pages/Analyse/Type/SjeAnalyse.jsx";
import Anomalie from "../Pages/Anomalie/Anomalie.jsx";
import BalanceAnalyse from "../Pages/Analyse/Type/BalanceAnalyse.jsx";
import SoldeCaisse from "../Pages/Analyse/Type/SoldeCaisse.jsx";
import SoldeAnormale from "../Pages/Analyse/Type/SoldeAnormale.jsx";
import MainAdmin from "../MainAdmin.jsx";
import AuditLog from "../Pages/Admin/AuditLog/AuditLog.jsx";
import Form from "../Pages/Admin/Utilisateur/Form.jsx";
import Calendrier from "../Composants/Calendrier/Calendrier.jsx";
import PosteComptable from "../Pages/Admin/Poste_comptable/PosteComptable.jsx";
import Formulaire from "../Pages/Admin/Poste_comptable/Formulaire.jsx";
import Utilisateur from "../Pages/Admin/Utilisateur/Utilisateur.jsx";
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
                ]
            },
            {
                path: 'analysis',
                element: <Analyse />,
                children: [
                    {
                        index: true,
                        element: <SjeAnalyse />
                    },
                    {
                        path: 'equilibre_balance',
                        element: <BalanceAnalyse />
                    },
                    {
                        path: 'solde_caisse',
                        element: <SoldeCaisse />
                    },
                    {
                        path: 'solde_anormale',
                        element: <SoldeAnormale />
                    }
                ]
            },
            {
                path: 'anomalie',
                element: <Anomalie />
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
    },

    {
        path: '/admin',
        element: <MainAdmin />,
        children: [
            {
                element: <PrivateRoute />,
                children: [

                    {
                        path: '',
                        element: <AuditLog />
                    },
                    {
                        path: 'utilisateur',
                        element: <Utilisateur />
                    },
                    {
                        path: 'utilisateur/form',
                        element: <Form />
                    },
                    {
                        path: 'poste_comptable',
                        element: <PosteComptable />
                    },
                    {
                        path: 'poste_comptable/form',
                        element: <Formulaire />
                    }

                ]

            }
        ]
    },
    {
        path: '/cal',
        element: <Calendrier/>
    }
])