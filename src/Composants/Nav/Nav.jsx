import { useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom';
import './Nav.css';
import { useAuthentification } from '../../hooks/useAuthentification';
import { useUserStore } from '../../store/useUserStore';

export default function Nav() {

    const user = useUserStore((state) => state.user);
    const location = useLocation();

    const ref_btn_show_navigation = useRef(null);
    const ref_container_navigation = useRef(null);
    const ref_navigation = useRef(null);
    const ref_fond = useRef(null);


    const show_or_close_navigation = () =>{
        ref_container_navigation.current.classList.toggle("show");
        ref_btn_show_navigation.current.classList.toggle('active');
        ref_navigation.current.classList.toggle('show');
        ref_fond.current.classList.toggle('show');
    }


    const { logout } = useAuthentification()

  return (
    <section id='navigation'>
    
        <div id='container-navigation' ref={ref_container_navigation}>

            {/* Navigation */}
            <nav className='navigation' ref={ref_navigation}>
                <ul>

                        {/* Tableau de bord */}
                        <NavLink to='/main/dashboard' onClick={show_or_close_navigation}>
                            <li>
                                <div className={location.pathname == '/main/dashboard' ? 'bloc-item-nav current' : 'bloc-item-nav'}>
                                    <span className='icon'>
                                        <i className="fas fa-columns"></i>
                                    </span>
                                    <p>Tableau de bord</p>
                                </div>
                            </li>
                        </NavLink>

                        {/* Consultation des donnees */}
                        <NavLink to='/main/data' onClick={show_or_close_navigation}>
                            <li>
                                <div className={location.pathname.includes('/main/data') ? 'bloc-item-nav current' : 'bloc-item-nav'}>
                                    <span className='icon'>
                                        <i className="fas fa-database"></i>
                                    </span>
                                    <p>Consultation</p>
                                </div>
                            </li>
                        </NavLink>

                        {/* Afficher les menus : Transcription et analyse quand  un auditeur est connecté*/}
                        {
                            user ?
                                user[0]['utilisateur__fonction'].toUpperCase() == 'auditeur'.toUpperCase() ?
                                <>
                                    <NavLink to='/main/transcription' onClick={show_or_close_navigation}>
                                        <li>
                                            <div className={location.pathname == '/main/transcription' ? 'bloc-item-nav current' : 'bloc-item-nav'}>
                                                <span className='icon'>
                                                    <i className="fas fa-sitemap"></i>
                                                </span>
                                                <p>Transcription</p>
                                            </div>
                                        </li>
                                    </NavLink>

                                    <NavLink to='/main/analysis' onClick={show_or_close_navigation} className='current'>
                                    <li>
                                        <div className={location.pathname.includes('/main/analysis') ? 'bloc-item-nav current' : 'bloc-item-nav'}>
                                            <span className='icon'>
                                                <i className="fas fa-chart-pie"></i>
                                            </span>
                                            <p>Analyse</p>
                                        </div>
                                    </li>
                                    </NavLink>
                                </>

                                : null
                            : null
                        }

                        


                    {/* Anomalie */}
                    <NavLink to='/main/anomalie' onClick={show_or_close_navigation} className='current'>
                        <li>
                            <div className={ location.pathname == '/main/anomalie' ?'bloc-item-nav current' : 'bloc-item-nav'}>
                                <span className='icon'>
                                    <i className="fas fa-bug"></i>
                                </span>
                                {/* <NavLink style={{display: 'block'}} to='/main/rapport'>Rapports</NavLink> */}
                                <p>Anomalie</p>
                            </div>
                        </li>
                    </NavLink>


                    
                </ul>
            </nav>

            <div className='container-btn-toggle-navigation'>
                <div className="flex gap-6">
                    <div className='w-7/6 px-4'>
                        <p className='text-lg text-center font-light'>Plateforme d'analyse automatisée et ciblé des comptes</p>
                    </div>
                    <div>
                        <span className='icon'>
                            <i className="fas fa-chevron-down" ref={ref_btn_show_navigation} onClick={show_or_close_navigation}></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div className='fond' ref={ref_fond}>

        </div>
    </ section>
  )
}
