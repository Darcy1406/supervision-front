import React, { useEffect, useRef, useState } from 'react'
import './Main.css'
import { Outlet, RouterProvider, useLocation } from 'react-router-dom'

import Nav from './Composants/Nav/Nav.jsx';
import Notification from './Composants/Notification/Notification.jsx';
import { API_URL } from './Config.js';
import { useUserStore } from './store/useUserStore.js';
import { useAuthentification } from './hooks/useAuthentification.js';
import { Alert } from './Composants/Alert/Alert';
import { router } from './Router/Router.jsx';


export default function Main() {

  const [notification, setNotification] = useState([
    'Une analyse sur une piece ABC a ete lancee par Auditeur 1 le jour du 20/09/2025',
    'Une analyse sur une piece ABC a ete lancee par Auditeur 1 le jour du 20/09/2025',
    'Une analyse sur une piece ABC a ete lancee par Auditeur 1 le jour du 20/09/2025',
    'Une analyse sur une piece ABC a ete lancee par Auditeur 1 le jour du 20/09/2025',
    'Une analyse sur une piece ABC a ete lancee par Auditeur 1 le jour du 20/09/2025',
    'Une analyse sur une piece ABC a ete lancee par Auditeur 1 le jour du 20/09/2025',
    'Une analyse sur une piece ABC a ete lancee par Auditeur 1 le jour du 20/09/2025',
  ])

  // const boxRef = useRef(null);

  const { user, setUser } = useUserStore()

  const container_notification = useRef(null);
  // const navigate = useNavigate()

  // const getUser = async () => {
  //   const response = await fetch(`${API_URL}/users/get_user`, {
  //     method: 'GET',
  //     credentials: "include",
  //   })
  //   .then(response => {
  //     if(!response.ok){
  //       throw new Error('Error HTTP' + response.status)
  //     }
  //     return response.json();
  //   })
  //   .then(data => {
  //     console.log(data)
  //     // useUserStore.getState().setUser(data);
  //     setUser(data);
  //   })
  //   .catch(error => {
  //     console.log(error)
  //     useUserStore.getState().clearUser();
  //   })
  // }

  const location = useLocation();

  const { getUser } = useAuthentification()


  const toggle_notification = () => {
    container_notification.current.classList.toggle('show');
  }

  useEffect( () => {
    getUser(setUser)
  }, [location.pathname])

  // useEffect(() => {
  //   container_notification.current.scrollTo({
  //     top: container_notification.current.scrollHeight,
  //     behavior: "smooth",
  //   });
  // }, [notification]);

  return (
    <>
    {
      user ?
        <section id='main' className='bg-gray-50'>

          <div className='container-main flex justify-center'>

            <Nav />

            <div 
              className='container-notification border-r border-gray-400 w-1/7 h-full' 
              style={{overflowY: 'auto', }}
              ref={container_notification}
            >
                <Notification notification={notification}/>
            </div>

            <div className='px-2 py-2 cursor-pointer'>
              <span className='icon text-2xl' onClick={toggle_notification}>
                <i className="fas fa-columns"></i>
              </span>
            </div>

            <div className='container-body border-l border-gray-400 flex-1 py-2  px-4'>
                <Outlet />
                

                {/* <Alert /> */}
            </div>

          </div>
        </section>
      : null
    }
    </>
  )
}
