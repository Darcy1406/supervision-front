import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SidebarAdmin from './Composants/Sidebar/SidebarAdmin'

import './MainAdmin.css'
import NavAdmin from './Composants/NavAdmin/NavAdmin'
import { useAuthentification } from './hooks/useAuthentification'
import { useUserStore } from './store/useUserStore'

export default function MainAdmin() {
  const { user, setUser } = useUserStore();

  const location = useLocation();

  const { getUser } = useAuthentification()


  useEffect( () => {
    getUser(setUser)
  }, [location.pathname])


  return (
    <section id='main-admin'>
        <NavAdmin />
        <SidebarAdmin />

        <div className='bloc-body-admin h-screen'>
            <Outlet />
        </div>

    </section>
  )
}
