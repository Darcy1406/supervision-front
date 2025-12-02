import { useUserStore } from '../../store/useUserStore'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function PrivateRoute() {
    const user = useUserStore((state) => state.user);
    const location = useLocation();

    // Seul un utilisateur portant l'identifiant admin peut acceder a l'interface administrateur
    // if(location.pathname.includes('/admin') && user[0]['identifiant'].toLowerCase() != 'admin') return <Navigate to='/unauthorized' />

    // Un auditeur a le droit de suelement consulter les transcriptions
    if(location.pathname.includes('/main/data')){
      if(location.pathname != '/main/data' && user[0]['utilisateur__fonction'].toLowerCase() == 'auditeur') return <Navigate to='/unauthorized'/>
    }

    // Seul un auditeur peut acceder a la page d'analyse
    if(location.pathname.includes('/main/analysis') && user[0]['utilisateur__fonction'].toLowerCase() != 'auditeur') return <Navigate to='/unauthorized'/>
    
    // Seul un auditeur peut acceder a la page de transcription des donnes
    if(location.pathname == '/main/transcription' && user[0]['utilisateur__fonction'].toLowerCase() != 'auditeur') return <Navigate to='/unauthorized'/>


  return (
    // <div>
        <Outlet />
    // </div>
  )
}
