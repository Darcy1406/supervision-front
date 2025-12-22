import { useRef } from 'react';
import './NavAdmin.css';
import { useAuthentification } from '../../hooks/useAuthentification';

export default function NavAdmin() {

  const ref_icon = useRef(null);
  const ref_logout = useRef(null);

  const show_button_menu = () => {
    ref_icon.current.classList.toggle('rotate')
    ref_logout.current.classList.toggle('show')
  }

  const { logout } = useAuthentification()

  return (
    <div id='navigation-admin' className='bg-white shadow-sm rounded-sm'>

      <div className='container-description flex items-center justify-center'>

        <div className='bloc-description flex-1 border-r border-gray-300 px-4'>

            <div className='container-title is-fullwidth is-pulled-right'>

              <span className='text-xl'>
                Espace administrateur
              </span>

                <span className='mx-1 text-2xl cursor-pointer' onClick={show_button_menu}>
                    <i className="fas fa-angle-left" ref={ref_icon}></i>
                </span>

            </div>

        </div>

        <div className='container-btn-logout' ref={ref_logout}>
              <button type='button' className='cursor-pointer p-2 rounded-sm duration-150 hover:bg-gray-300' onClick={logout}>
                <span className='icon'>
                  <i className="fas fa-sign-out-alt"></i>
                </span>
                  Déconnexion
              </button>
            
        </div>

      </div>

    </div>
  )
}
