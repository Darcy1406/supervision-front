import React, { useEffect, useState } from 'react'
import './Main.css'
import { Outlet, useNavigate } from 'react-router-dom'

import Nav from './Composants/Nav/Nav.jsx';
import Notification from './Composants/Notification/Notification.jsx';
import { API_URL } from './Config.js';
import { useUserStore } from './store/useUserStore.js';
import { useAuthentification } from './hooks/useAuthentification.js';
import { Alert } from './Composants/Alert/Alert';


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

  const { user, setUser } = useUserStore()
  const navigate = useNavigate()

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

  const { getUser } = useAuthentification()

  useEffect( () => {
    getUser(setUser)
  }, [])

  return (
    <>
    {
      user ?
        <section id='main' className='bg-gray-50'>
          <Nav />

          <div className='container-main flex items-center justify-center gap-4'>

            <div className='container-menu border-r border-gray-400 w-1/6 h-full' style={{overflowY: 'auto'}}>
                <Notification notification={notification}/>
            </div>

            <div className='container-body w-5/6'>
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
