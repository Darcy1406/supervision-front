import React from 'react'
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import './SidebarAdmin.css';
import { useAuthentification } from '../../hooks/useAuthentification';

export default function SidebarAdmin() {

    const location = useLocation();

    const { logout } = useAuthentification()

  return (
    <div className="bloc-sidebar-admin">
        <h4 className="title is-4 my-4">Menu : </h4>
        <aside>
            <p className="menu-label">
                General
            </p>
            <ul className="menu-list">
                <li>
                        
                    <Link className={location.pathname == '/admin' ? 'is-current' : ''} to="/admin">
                        <span className='icon mx-1'>
                            <i className="fas fa-clipboard-list"></i>
                        </span>
                        Traçabilté
                    </Link>
                    
                </li>
                
            </ul>

            <p className="menu-label">
                Administration
            </p>

            <ul className="menu-list">
                <li>
                    
                    <Link className={location.pathname.includes('/admin/utilisateur') ? 'is-current' : ''} to="/admin/utilisateur">
                        <span className='icon mx-1'>
                            <i className="fas fa-users"></i>
                        </span>
                        Utilisateurs
                    </Link>
                    
                </li>

                <li>
                    
                    <Link className={location.pathname.includes('/admin/poste_comptable') ? 'is-current' : ''} to="../../admin/poste_comptable">
                        <span className='icon mx-1'>
                            <i className="fas fa-money-check-alt"></i>
                        </span>
                        Poste comptable
                    </Link>
                    
                </li>
            </ul>

        </aside>
        
        <button className='btn-connexion-admin' onClick={logout}>
            <span className='icon'>
                <i className="fas fa-sign-out-alt"></i>
            </span>
            Déconnexion
        </button>
    </div>
  )
}
