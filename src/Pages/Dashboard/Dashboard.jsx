import React, { useEffect, useRef, useState } from 'react'
import './Dashboard.css'
import Calendrier from '../../Composants/Calendrier/Calendrier';
import { fetchData } from '../../functions/fetchData';
import { API_URL } from '../../Config'; 
import { sendData } from '../../functions/sendData';
import { BarChart } from '../../Composants/Graphique/BarChart'
import { PieChart } from '../../Composants/Graphique/PieChart';
import { DoughnutChart } from '../../Composants/Graphique/DoughnutChart';
import { useUserStore } from '../../store/useUserStore';
import { getRandomColor } from '../../functions/Function';

export default function Dashboard() {

  const user = useUserStore((state) => state.user);

  // Agenda
  const [date_agenda, setDateAgenda] = useState("")
  const [heure_agenda, setHeureAgenda] = useState("")
  const [description, setDescription] = useState("")

  const [result, setResult] = useState("")

  const container_logout = useRef(null);

  const [data, setData] = useState(null);

  const [nb_doc, setNbDoc] = useState(0);
  const [nb_anomalie, setNbAnomalie] = useState(0);
  const [nb_corrige, setNbCorrige] = useState(0);

  const [data_anomalies, setDataAnomalies] = useState(null);


  const handleChange = (name, value, setState) => {
    setState(prev => ({
      ...prev,
      [name]: value,
    }));
  }


  
  const Save_agenda = (e) => {
    e.preventDefault(e);
    if(user){
      sendData(`${API_URL}/agenda/create`, 'post', {date_agenda, heure_agenda, description, "utilisateur_id": user['id']}, setResult)
    }
  }


  const show_bloc_logout = () => {
    container_logout.current.classList.add('show');
  }



  const close_bloc_logout = () => {
    container_logout.current.classList.remove('show');
  }

  
  // const {data: evenements} = useFetch(`${API_URL}/agenda/get`, 'post', {"utilisateur_id": user["id"]});
  const evenements = ""


  // const {
  //   data: list_agenda,
  //   loading: loading,
  //   errors: errors
  // } = useFetch(`${API_URL}/agenda`)

  
  useEffect(() => {
    // console.log('erreur : ', new Date(list_agenda[0].fields.date_evenement).getDate())
    document.title = 'Tableau de bord';
  }, [])


  useEffect(() => {
    fetchData(`${API_URL}/data/document/count`, 'post', {'action': 'compter_nombre_documents_generale'}, setNbDoc)

    fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'compter_nombre_anomalies_generale'}, setNbAnomalie)

    fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'compter_nombre_anomalies_resolu'}, setNbCorrige)

    fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'recuperer_nombre_anomalies_par_mois'}, setDataAnomalies)

  }, [])


  return (
    <section id='dashboard' className='w-full'>

      <div className='w-full flex items-center justify-center gap-2'>

        <div className='container-count w-1/6 h-full flex flex-wrap justify-center items-center gap-6'>

          <div className='bg-white h-35 w-5/6 rounded-xl shadow-lg'>

            <p className='font-bold text-xl text-center mt-4'>Document(s)</p>
            <p className='text-center is-size-1 font-thin text-blue-400'>{ nb_doc['total_doc'] ? nb_doc['total_doc'] : 0 }</p>
            
          </div>

          {/* <div className='bg-white h-35 w-5/6 rounded-xl shadow-lg'>
            <p className='font-bold text-xl text-center mt-4'>Analyse(s)</p>
            <p className='text-center is-size-1 font-thin text-yellow-400'>60</p>
          </div> */}
          
          <div className='bg-white h-35 w-5/6 rounded-xl shadow-lg'>
            <p className='font-bold text-xl text-center mt-4'>Anomalie(s)</p>
            <p className='text-center is-size-1 font-thin text-red-400'>{ nb_anomalie['total_anomalies'] ? nb_anomalie['total_anomalies'] : 0 }</p>
          </div>

          <div className='bg-white h-35 w-5/6 rounded-xl shadow-lg'>
            <p className='font-bold text-xl text-center mt-4'>Correction(s)</p>
            <p className='text-center is-size-1 font-thin text-green-400'>{ nb_corrige['total_anomalies_resolu'] ? nb_corrige['total_anomalies_resolu'] : 0 }</p>
          </div>
        </div>

        {/* Les graphiques */}
        <div className='container-chart w-3/6 h-full flex items-center justify-center flex-wrap gap-2'>

          <div className='text-2xl w-full font-semibold text-2xl text-gray-400'>
            <p className='italic tracking-widest'>
              {
                user ?
                  user[0]['utilisateur__fonction'].toUpperCase() == 'chef_unite'.toUpperCase() ?
                    `Tableau de bord zone ${user[0]['utilisateur__zone__nom_zone'].toLowerCase()}`
                  : 'Tableau de bord'
                : null
              }
              
            </p>
          </div>

          <div className='flex-1 h-80 bg-white rounded-xl shadow-lg p-4 flex justify-center items-center'>

            <BarChart 
              info={data_anomalies} 
              tabColor={getRandomColor(6)}
              labels={['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre']}
              object='Anomlies'
              title='Anomalies detectées par mois'
            />

          </div>

        <div className='flex gap-2 w-full'>

          <div className='w-1/2 h-58 bg-white rounded-xl shadow-lg p-4 flex justify-center items-center'>
              <PieChart info={[12, 19, 10, 5, 22, 30]} tabColor={getRandomColor(6)}/>
            </div>

            <div className='w-1/2 h-58 bg-white rounded-xl shadow-lg p-4 flex justify-center items-center'>
              <DoughnutChart info={[12, 19, 10, 5, 22, 30]} tabColor={getRandomColor(6)}/>

            </div>
          </div>
        </div>

        <div className='relative mr-4 w-2/6 h-full p-2'>

          <div className='container-logout p-4 bg-white rounded-sm border border-gray-300 cursor-pointer duration-150 ease-in-out hover:bg-black hover:text-white' ref={container_logout} onMouseEnter={show_bloc_logout} onMouseLeave={close_bloc_logout}>
              <button className='cursor-pointer'>Deconnexion</button>
          </div>

          <div className='w-full h-16 rounded-lg flex items-center bg-white cursor-pointer duration-200 ease-in-out hover:border border-gray-300 hover:shadow-sm' onMouseEnter={show_bloc_logout} onMouseLeave={close_bloc_logout}>

            <div className='ml-2 w-15 h-15 flex items-center justify-center'>
                <span className='icon'>
                  <i className='fas fa-user text-3xl/8'></i>
                </span>
            </div>

            
            <div className=''>

              <p className='font-semibold text-base italic'>
                { user ? 
                    user[0]['utilisateur__fonction'].toUpperCase() == "chef_unite".toUpperCase() ?
                      "Chef d'unité" + " : " + user[0]['utilisateur__nom'] + " " + user[0]['utilisateur__prenom']
                    : 
                      user[0]['utilisateur__fonction'] + " : " + user[0]['utilisateur__nom'] + " " + user[0]['utilisateur__prenom']
                  : null
                } 
                </p>

            </div>

            
            
          </div>

          <div className='container-planification-reunion h-9/10 mt-2'>
            <p className='text-center font-semibold italic text-xl underline'>Enregistrer un evenement</p>

            <form onSubmit={(e) => Save_agenda(e)}>

              <div className='field'>
                  <label className='label'>Date de l'evenement</label>
                  <div className='control flex'>

                    <input type="date" className='input w-1/3' value={date_agenda} onChange={(e) => setDateAgenda(e.target.value)}/>

                    <label className='block text-center is-size-5 label w-1/3'>à</label>

                    <input type="time" name="" id="" className='input w-1/3' value={heure_agenda} onChange={(e) => setHeureAgenda(e.target.value)} />
                  </div>
              </div>

              <div className='field'>
                  <div className='control'>
                    <label className='label'>Description de l'evenement</label>
                    <textarea name="" className='textarea' placeholder="Description de l'evenement(reunion, ...)" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                  </div>
              </div>
              <button type='submit' className='bg-black text-white py-2 px-4 rounded-lg cursor-pointer mx-4 my-2'>Planifier</button>
            </form>
            <Calendrier evenements={evenements}/>
          </div>
          

        </div>

      </div>

    </section>
  )
}
