import React, { useState } from 'react'
import './Main.css'
import { Outlet } from 'react-router-dom'

import Nav from './Composants/Nav/Nav.jsx';
import Notification from './Composants/Notification/Notification.jsx';


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

  return (
    <section id='main' className='bg-gray-50'>
      <Nav />

      <div className='container-main flex items-center justify-center gap-4'>

        <div className='container-menu border-r border-gray-400 w-1/6 h-full' style={{overflowY: 'auto'}}>
            <Notification notification={notification}/>
        </div>

        <div className='container-body w-5/6'>
            <Outlet />
        </div>

      </div>
    </section>
  )
}
