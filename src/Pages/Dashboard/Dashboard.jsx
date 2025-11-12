import { useEffect, useRef, useState } from 'react'
import './Dashboard.css'
import Calendrier from '../../Composants/Calendrier/Calendrier';
import { fetchData } from '../../functions/fetchData';
import { API_URL } from '../../Config'; 
import { sendData } from '../../functions/sendData';
import { BarChart } from '../../Composants/Graphique/BarChart'
import { LineChart } from '../../Composants/Graphique/LineChart';
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
  const [data_anomalie_resolues, setDataAnomalieResolues] = useState(null);

  const [poste_comptables, setPosteComptables] = useState(null);
  const [poste_choisi, setPosteChoisi] = useState("");


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

  const voir_statistique_poste_comptable = () => {
    if(poste_choisi != ""){

      fetchData(`${API_URL}/data/document/count`, 'post', {'action': 'compter_nombre_documents_par_poste_comptable', 'poste_comptable': poste_choisi}, setNbDoc)

      fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'compter_nombres_anomalies_par_poste_comptable', 'poste_comptable': poste_choisi}, setNbAnomalie)

      fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'compter_nombres_anomalies_resolu_par_poste_comptables', 'poste_comptable': poste_choisi}, setNbCorrige)

      fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'recuperer_nombre_anomalies_par_mois_par_comptable', 'poste_comptable': poste_choisi}, setDataAnomalies)

      fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'recuperer_nombres_anomalies_resolues_par_mois_par_poste_comptable', 'poste_comptable': poste_choisi}, setDataAnomalieResolues)

    }
  }


  
  useEffect(() => {
    
    const original_title = document.title;
    document.title = 'Tableau de bord';

    return () => {
      document.title = original_title
    }

  }, [])


  // Donnees generales
  useEffect(() => {

    fetchData(`${API_URL}/data/document/count`, 'post', {'action': 'compter_nombre_documents_generale'}, setNbDoc)

    fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'compter_nombre_anomalies_generale'}, setNbAnomalie)

    fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'compter_nombre_anomalies_resolu'}, setNbCorrige)

    fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'recuperer_nombre_anomalies_par_mois'}, setDataAnomalies)

    fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'recuperer_nombres_anomalies_resolues_par_mois'}, setDataAnomalieResolues)

  }, [])


  // useEffect(() => {
  //   if(poste_choisi != ""){

  //     fetchData(`${API_URL}/data/document/count`, 'post', {'action': 'compter_nombre_documents_par_poste_comptable', 'poste_comptable': poste_choisi}, setNbDoc)

  //     fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'compter_nombres_anomalies_par_poste_comptable', 'poste_comptable': poste_choisi}, setNbAnomalie)

  //     fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'compter_nombres_anomalies_resolu_par_poste_comptables', 'poste_comptable': poste_choisi}, setNbCorrige)

  //     fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'recuperer_nombre_anomalies_par_mois_par_comptable', 'poste_comptable': poste_choisi}, setDataAnomalies)

  //     fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'recuperer_nombres_anomalies_resolues_par_mois_par_poste_comptable', 'poste_comptable': poste_choisi}, setDataAnomalieResolues)

  //   }
  // }, [poste_choisi])


  // Affichage des postes comptables par fonction de l'utilisateur
  useEffect(() => {

    if( user[0]['utilisateur__fonction'].toUpperCase() == 'auditeur'.toUpperCase() ){
      fetchData(`${API_URL}/users/poste_comptable/all`, 'post', {'action': 'afficher_les_postes_comptables', 'user_id': user[0]['id']}, setPosteComptables)
    }
    else if(user[0]['utilisateur__fonction'].toUpperCase() == 'directeur'.toUpperCase()){
      fetchData(`${API_URL}/users/poste_comptable/all`, 'post', {'action': 'afficher_tous_les_postes_comptables', 'fonction': user[0]['utilisateur__fonction'],'user_id': user[0]['id']}, setPosteComptables)
    }
    else{
      fetchData(`${API_URL}/users/poste_comptable/all`, 'post', {'action': 'afficher_les_postes_comptables_zone', 'zone': user[0]['utilisateur__zone__nom_zone']}, setPosteComptables)
    }

  }, [])


  return (
    <section id='dashboard' className='w-full'>

      <div className='w-full flex items-center justify-center gap-2'>

        {/* Count */}
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

        <div className='container-chart w-3/6 h-full flex justify-center flex-wrap gap-1'>

          {/* Filtrer le tableau de bord par poste comptable */}
          <div className='flex items-center gap-4 p-2'>
            <div>
              <label className='label'>Poste comptable : </label>

            </div>

            <div>
              <input list='poste_comptable' className='input' placeholder='Poste comptable' value={poste_choisi} onChange={(e) => {setPosteChoisi(e.target.value)} }/>
              <datalist id='poste_comptable'>
                {
                  poste_comptables && poste_comptables.map((item, index) => (
                    <option key={index} value={item['nom_poste']} />
                  ))
                }
              </datalist>
            </div>

            <div>
                <button className='button is-dark' disabled={poste_choisi == ""} onClick={voir_statistique_poste_comptable}>
                  Voir
                </button>
            </div>

          </div>

          {/* Titre */}
          <div className='w-6/7 text-xl font-semibold text-gray-400'>

            <p className='italic tracking-widest'>
              {
                user ?
                  user[0]['utilisateur__fonction'].toUpperCase() == 'chef_unite'.toUpperCase() ?
                    `Tableau de bord zone ${user[0]['utilisateur__zone__nom_zone'].toLowerCase()}`
                  : `Tableau de bord ${poste_choisi}`
                : null
              }
              
            </p>
          </div>

          {/* Les graphiques */}
          <div className='w-6/7 h-65 bg-white rounded-xl shadow-lg p-4 flex justify-center items-center'>
            
            <BarChart 
              info={data_anomalies} 
              tabColor={getRandomColor(1)}
              labels={['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre']}
              object='Anomlies'
              title='Anomalies detectées par mois'
            />
     

          </div>

        {/* <div className='flex gap-2 w-full'> */}

          <div className='w-6/7 h-65 bg-white rounded-xl shadow-lg p-4 flex justify-center items-center'>
              <LineChart 
                info={data_anomalie_resolues} 
                tabColor={getRandomColor(1)}
                labels={['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre']}
                object='Anomalies resolues'
                title='Anomalies resolues par mois'
              />
            </div>

            {/* <div className='w-1/2 h-58 bg-white rounded-xl shadow-lg p-4 flex justify-center items-center'>
              <DoughnutChart info={[12, 19, 10, 5, 22, 30]} tabColor={getRandomColor(6)}/>

            </div> */}
          </div>

        {/* </div> */}

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
