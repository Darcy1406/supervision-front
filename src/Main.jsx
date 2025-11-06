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
import { fetchData } from './functions/fetchData.js';


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
  const [traces, setTraces] = useState(null);

  const container_notification = useRef(null);
  const bloc_main = useRef(null);
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
    bloc_main.current.classList.toggle('show');
  }

  useEffect( () => {
    getUser(setUser)
  }, [location.pathname])


  useEffect(() => {
    fetchData(`${API_URL}/data/trace/get`, 'get', {}, setTraces);
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

          <div className='container-main'>


            <div 
              className='container-notification border-r border-gray-400 w-1/7 h-full'
              ref={container_notification}
            >
                <Notification notification={traces}/>
            </div>

            <div className="bloc-main" ref={bloc_main}>
              <Nav />


              <div className='px-2 py-2 cursor-pointer'>
                <span className='icon text-2xl' onClick={toggle_notification}>
                  <i className="fas fa-columns"></i>
                </span>
              </div>

              <div className='container-body py-2 px-4'>
                  <Outlet />
                  

                  {/* <Alert /> */}
              </div>
            </div>


          </div>
        </section>
      : null
    }
    </>
  )
}
