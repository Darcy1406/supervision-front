import React from 'react'
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import './SidebarAdmin.css';
import { useAuthentification } from '../../hooks/useAuthentification';
import { useUserStore } from '../../store/useUserStore';

export default function SidebarAdmin() {
    const user = useUserStore((state) => state.user);

    const location = useLocation();

  return (
    <div className="bloc-sidebar-admin">

        <div className='container-title h-35 border-b boredr-gray-100 w-full p-1 text-white'>
            <span className='is-block text-center text-5xl mt-5'>
                <i className='fas fa-cogs'></i>
            </span>
            <p className='text-center font-light text-lg'>Administration</p>
        </div>

        <aside className='text-white'>

            <ul className="w-full is-block">
                <li>
                        
                    <Link className={location.pathname == '/admin' ? 'is-current' : ''} to="/admin">
                        <span className='icon mx-1'>
                            <i className="fas fa-clipboard-list"></i>
                        </span>
                        Tableau de bord
                    </Link>
                    
                </li>

                <li>
                        
                    <Link className={location.pathname == '/admin/log' ? 'is-current' : ''} to="/admin/log">
                        <span className='icon mx-1'>
                            <i className="fas fa-clipboard-list"></i>
                        </span>
                        Traçabiltés
                    </Link>
                    
                </li>
                
                <li>
                    
                    <Link className={location.pathname.includes('/admin/utilisateur') ? 'is-current' : ''} to="/admin/utilisateur">
                        <span className='icon mx-1'>
                            <i className="fas fa-users"></i>
                        </span>
                        Utilisateurs
                    </Link>
                    
                </li>

                <li>
                    
                    <Link className={location.pathname.includes('/admin/poste_comptable') ? 'is-current' : ''} to="/admin/poste_comptable">
                        <span className='icon mx-1'>
                            <i className="fas fa-money-check-alt"></i>
                        </span>
                        Postes comptables
                    </Link>
                    
                </li>

                <li>
                    
                    <Link className={location.pathname.includes('/admin/pieces') ? 'is-current' : ''} to="/admin/pieces">
                        <span className='icon mx-1'>
                            <i className="fas fa-paste"></i>
                        </span>
                        Pièces
                    </Link>
                    
                </li>

                {/* Comptes */}
                <li>
                    <Link className={location.pathname.includes('/admin/comptes') ? 'is-current' : ''} to="/admin/comptes">
                        <span className='icon mx-1'>
                            <i className="fas fa-credit-card"></i>
                        </span>
                        Comptes
                    </Link>
                </li>

                {/* Exercice */}
                <li>
                    
                    <Link className={location.pathname.includes('/admin/exercice') ? 'is-current text-white' : 'text-white'} to="/admin/exercice">
                        <span className='icon mx-1'>
                            <i className="fas fa-vote-yea"></i>
                        </span>
                        Exercices
                    </Link>
                    
                </li>

            </ul>



        </aside>


        <div className='container-info-admin flex gap-2'>
            <span className='text-white'>
                <i className="fas fa-user"></i>
            </span>

            <p className='font-light text-white'>{user?.[0]['utilisateur__nom'] + " " + user?.[0]['utilisateur__prenom']}</p>
        </div>
        
        {/* <button className='btn-connexion-admin' onClick={logout}>
            <span className='icon'>
                <i className="fas fa-sign-out-alt"></i>
            </span>
            Déconnexion
        </button> */}
    </div>
  )
}
