import React, { use } from 'react'
import { useUserStore } from '../../store/useUserStore'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function PrivateRoute() {
    const user = useUserStore((state) => state.user);
    const location = useLocation();

    if(location.pathname == '/main/transcription'){
      if(user[0]['utilisateur__fonction'] != 'Auditeur') return <Navigate to='/unauthorized'/>
    }
    else{
      if(user[0]['utilisateur__fonction'] == 'Auditeur') return <Navigate to='/unauthorized'/>
    }


  return (
    // <div>
        <Outlet />
    // </div>
  )
}
