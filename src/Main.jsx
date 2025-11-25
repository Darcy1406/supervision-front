import { use, useEffect, useRef, useState } from 'react'
import './Main.css'
import { Outlet, RouterProvider, useLocation } from 'react-router-dom'

import Nav from './Composants/Nav/Nav.jsx';
import Notification from './Composants/Notification/Notification.jsx';
import { API_URL } from './Config.js';
import { useUserStore } from './store/useUserStore.js';
import { useAuthentification } from './hooks/useAuthentification.js';
import { Alert } from './Composants/Alert/Alert';
import { router } from './Router/Router.js';
import { fetchData } from './functions/fetchData.js';


export default function Main() {

  // const boxRef = useRef(null);

  const { user, setUser } = useUserStore();

  const [traces, setTraces] = useState(null);

  const container_notification = useRef(null);
  const bloc_main = useRef(null);

  const location = useLocation();

  const { getUser } = useAuthentification()

  const [evenements, setEvenements] = useState(null);

  const today = new Date().toISOString().split("T")[0];


  const recuperer_evenements_utilisateurs = () => {
    fetchData(`${API_URL}/agenda/get`, 'post', {"utilisateur_id": user[0]["id"]}, setEvenements);
  }


  const toggle_notification = () => {
    container_notification.current.classList.toggle('show');
    bloc_main.current.classList.toggle('show');
  }


  // const handleReceiveFromDashboard = (data) => {
  //   setEvenements(data);
  // };


  useEffect( () => {
    getUser(setUser)
  }, [location.pathname])


  useEffect(() => {
    if(user){
      recuperer_evenements_utilisateurs()
    }
  }, [user])


  return (
    <>
    {
      user ?
        <section id='main' className='bg-gray-50'>

          <div className='container-main bg-gray-50'>


            <div 
              className='container-notification border-r border-gray-400 w-1/7 h-full bg-gray-50'
              ref={container_notification}

            >
              <p className='text-center underline my-2'>Agenda : </p>
              {
                evenements ? 
                  evenements.map((item, index) => (
                    <div key={index} className={`px-2 py-4 mx-2 mb-2 border-b border-gray-300 shadow-sm cursor-pointer rounded-lg duration-150 ease-in-out hover:shadow-lg ${item['fields']['date_evenement'] == today ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                      <p className='text-sm' style={{ whiteSpace: 'pre-line' }}>
                        {item['fields']['date_evenement'] + " à " + item['fields']['heure_evenement'] + "\n" + item['fields']['description']} 
                        
                      </p>
                    </div>
                ))
                : <p className='text-center'>Aucun évènement</p>
              }
             
            </div>

            <div className="bloc-main bg-gray-50" ref={bloc_main}>

              <Nav />


              <div className='px-2 py-2 cursor-pointer container-btn-toggle-notification'>

                <span className='icon text-2xl' onClick={toggle_notification}>
                  <i className="fas fa-columns"></i>
                </span>

              </div>

              <div className='container-body py-2 px-4'>
                  {/* <Outlet context={{ handleReceiveFromDashboard }} /> */}
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
