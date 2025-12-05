import { useEffect, useState } from 'react'
import Pieces from './Pieces/Pieces'
import Comptes from './Comptes/Comptes';
import { ListeTranscription } from './Transcription/ListeTranscription'
import Liste from '../ComptePiece/Liste';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';

export default function Data() {
  const user = useUserStore((state) => state.user);

  const location = useLocation();

  const [view_data, setViewData] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    setViewData(location.pathname.split('/')[3]);
  }, [location.pathname])


  useEffect(() => {
    
    const original_title = document.title;
    document.title = 'Gestion des données';

    return () => {
      document.title = original_title
    }

  }, [])


  return (
    <section id="data">
      <p className='text-lg font-semibold text-center'>Gestion des données</p>

      <div className='container-data-name py-2'>

        <select value={view_data} onChange={(e) => { setViewData(e.target.value); navigate(`/main/data/${e.target.value}`) } } name="" id="" className='bg-white px-4 py-2 ml-2 cursor-pointer shadow-lg rounded-sm border border-gray-300'>

          <option value="description" disabled>Choisissez les donnees que vous voulez traitez</option>

          {
            user ?
              user[0]['utilisateur__fonction'].toUpperCase() != 'auditeur'.toUpperCase() ?
                <option className='' value="pieces" >Pièces</option>
              : null
            : null
          }

          {
            user && user[0]['utilisateur__fonction'].toUpperCase() != 'auditeur'.toUpperCase() ?

              <option value="comptes">Comptes</option>

            : null
          }

          <option value="">Transcription</option>

          {
            user ?
              user[0]['utilisateur__fonction'].toUpperCase() != 'auditeur'.toUpperCase() ?
                <option className='' value="liaison_compte_piece">Liaison compte - piece</option>
              : null
            : null
          }

          

        </select>
      </div>

      <div className='w-full h-136'>
      
        <Outlet />

      </div>

    </section>
  )
}
