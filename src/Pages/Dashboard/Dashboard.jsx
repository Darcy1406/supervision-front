import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import Calendrier from '../../Composants/Calendrier/Calendrier';
import { useFetch } from '../../hooks/useFetch';
import { API_URL } from '../../Config'; 
import { sendData } from '../../functions/sendData';
import { LineChart } from '../../Composants/Graphique/LineChart'
import { PieChart } from '../../Composants/Graphique/PieChart';
import { DoughnutChart } from '../../Composants/Graphique/DoughnutChart';
import { useUserStore } from '../../store/useUserStore';

export default function Dashboard() {

  const user = useUserStore((state) => state.user);

  const [date_agenda, setDateAgenda] = useState("")
  const [heure_agenda, setHeureAgenda] = useState("")
  const [description, setDescription] = useState("")
  const [result, setResult] = useState("")

  
  const Save_agenda = (e) => {
    e.preventDefault(e);
    if(user){
      sendData(`${API_URL}/agenda/create`, 'post', {date_agenda, heure_agenda, description, "utilisateur_id": user['id']}, setResult)
    }
  }

  
  const {data: evenements} = useFetch(`${API_URL}/agenda/get`, 'post', {"utilisateur_id": user["id"]});


  // const {
  //   data: list_agenda,
  //   loading: loading,
  //   errors: errors
  // } = useFetch(`${API_URL}/agenda`)

  
  useEffect(() => {
    // console.log('erreur : ', new Date(list_agenda[0].fields.date_evenement).getDate())
    document.title = 'Tableau de bord';
  }, [])

  return (
    <section id='dashboard' className='w-full h-full'>

      <div className='w-full h-full flex gap-2'>

        <div className='container-count w-1/6 h-full flex flex-wrap justify-center items-center gap-2'>

          <div className='bg-white h-35 w-5/6 rounded-xl shadow-lg'>
            <p className='font-bold text-xl text-center mt-4'>Document(s)</p>
            <p className='text-center is-size-1 font-thin text-blue-400'>60</p>
            
          </div>

          <div className='bg-white h-35 w-5/6 rounded-xl shadow-lg'>
            <p className='font-bold text-xl text-center mt-4'>Analyse(s)</p>
            <p className='text-center is-size-1 font-thin text-yellow-400'>60</p>
          </div>
          
          <div className='bg-white h-35 w-5/6 rounded-xl shadow-lg'>
            <p className='font-bold text-xl text-center mt-4'>Anomalie(s)</p>
            <p className='text-center is-size-1 font-thin text-red-400'>20</p>
          </div>

          <div className='bg-white h-35 w-5/6 rounded-xl shadow-lg'>
            <p className='font-bold text-xl text-center mt-4'>Correction(s)</p>
            <p className='text-center is-size-1 font-thin text-green-400'>15</p>
          </div>
        </div>

        {/* Les graphiques */}
        <div className='container-chart w-3/6 h-full flex items-center justify-center flex-wrap gap-2'>
          <div className='text-2xl w-full font-semibold text-2xl text-gray-400'>
            <p className='italic tracking-widest'>Tableau de bord</p>
          </div>
          <div className='w-180 h-80 bg-white rounded-xl shadow-lg p-4 flex justify-center items-center'>
            <LineChart />
          </div>

          <div className='w-78 h-60 bg-white rounded-xl shadow-lg p-4 flex justify-center items-center'>
            <PieChart />
          </div>

          <div className='w-78 h-60 bg-white rounded-xl shadow-lg p-4 flex justify-center items-center'>
            <DoughnutChart />
          </div>
        </div>

        <div className='relative mr-4 w-2/6 h-full p-2'>

          <div className='w-full h-16 bg-white rounded-lg flex items-center'>

            <div className='ml-2 w-15 h-15 flex items-center justify-center'>
                <span className='icon'>
                  <i className='fas fa-user text-3xl/8'></i>
                </span>
            </div>

            
            <div className=''>
              <p className='font-semibold text-base italic'>{ user ? user['fonction'] + " : " + user['nom'] + " " + user['prenom'] : null} </p>

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
