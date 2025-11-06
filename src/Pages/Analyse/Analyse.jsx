import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';

export default function Analyse({salutation}) {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Rapport d'anomalie";
  }, [])

  const [url_children, setUrlChildren] = useState("");

  const change_type_analyse = (value) => {

  }

  return (
    <div id='analyse' className='w-full h-full'>
      <label className='mx-2'>Type d'analyse : </label>
      <select name="" id="" value={url_children} className='bg-white p-2 rounded-sm border border-gray-300' onChange={(e) => { setUrlChildren(e.target.value); navigate(`/main/analysis/${e.target.value}`) } }>
        <option value="">Report SJE</option>
        <option value="equilibre_balance">Equilibre balance</option>
        <option value="solde_caisse">Verification Solde caisse</option>
        <option value="">Verification Solde anormale</option>
      </select>

      <div className='container-type-analyse w-full'>
        <Outlet />
      </div>

    </div>
  )
}
