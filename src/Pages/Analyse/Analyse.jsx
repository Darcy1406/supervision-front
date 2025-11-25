import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function Analyse({salutation}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [url_children, setUrlChildren] = useState("");


  useEffect(() => {
    setUrlChildren(location.pathname.split('/')[3]);
  }, [location.pathname])


  useEffect(() => {
    
    const original_title = document.title;
    document.title = 'Analyse des données';

    return () => {
      document.title = original_title
    }

  }, [])


  return (
    <div id='analyse' className='w-full h-full'>

      <label className='mx-2'>Type d'analyse : </label>
      
      <select name="" id="" value={url_children} className='bg-white p-2 rounded-sm border border-gray-300' onChange={(e) => { setUrlChildren(e.target.value); navigate(`/main/analysis/${e.target.value}`) } }>
        <option value="">Report SJE</option>
        <option value="equilibre_balance">Equilibre balance</option>
        <option value="solde_caisse">Verification Solde caisse</option>
        <option value="solde_anormale">Verification Solde anormale</option>
      </select>

      <div className='container-type-analyse w-full'>
        <Outlet />
      </div>

    </div>
  )
}
