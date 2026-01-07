import { useEffect, useMemo, useRef, useState } from 'react'
import './Dashboard.css'
import Calendrier from '../../Composants/Calendrier/Calendrier';
import { fetchData } from '../../functions/fetchData';
import { API_URL } from '../../Config'; 
import { sendData } from '../../functions/sendData';
import { BarChart } from '../../Composants/Graphique/BarChart'
import { LineChart } from '../../Composants/Graphique/LineChart';
import { DoughnutChart } from '../../Composants/Graphique/DoughnutChart';
import { useUserStore } from '../../store/useUserStore';
import { formatNombreAvecEspaces, getRandomColor } from '../../functions/Function';
import { useOutletContext } from "react-router-dom";
import { Alert } from '../../Composants/Alert/Alert';
import { useAuthentification } from '../../hooks/useAuthentification';

export default function Dashboard() {

  const user = useUserStore((state) => state.user);

  // const { handleReceiveFromDashboard } = useOutletContext();

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
  const [nb_transcription, setNbTranscription] = useState(0);

  const [data_anomalies, setDataAnomalies] = useState(null);
  const [data_anomalie_resolues, setDataAnomalieResolues] = useState(null);

  const [poste_comptables, setPosteComptables] = useState(null);
  const [poste_choisi, setPosteChoisi] = useState("");

  const [evenements, setEvenements] = useState([])

  const [exercices, setExercices] = useState(null)
  const [exercice_choisi, setExerciceChoisi] = useState("")

  const handleChange = (name, value, setState) => {
    setState(prev => ({
      ...prev,
      [name]: value,
    }));
  }


  const recuperer_evenements_utilisateurs = () => {
    fetchData(`${API_URL}/agenda/get`, 'post', {"utilisateur_id": user[0]["id"]}, setEvenements);
  }

  
  const Save_agenda = (e) => {
    e.preventDefault(e);
    if(user){
      fetchData(`${API_URL}/agenda/create`, 'post', {date_agenda, heure_agenda, description, "utilisateur_id": user[0]['id']}, setResult)
    }
    recuperer_evenements_utilisateurs();

  }


  const show_bloc_logout = () => {
    container_logout.current.classList.add('show');
  }


  const close_bloc_logout = () => {
    container_logout.current.classList.remove('show');
  }


  const voir_statistique_poste_comptable = () => {

    if(poste_choisi != ""){

      fetchData(`${API_URL}/data/document/count`, 'post', {'action': 'compter_nombre_documents_par_poste_comptable', 'poste_comptable': poste_choisi, 'exercice': exercice_choisi}, setNbDoc)

      fetchData(`${API_URL}/data/transcription/count`, 'post', {'action': 'compter_nombre_total_transcription_par_poste_comptable', 'poste_comptable': poste_choisi, 'exercice': exercice_choisi}, setNbTranscription)
      
      fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'compter_nombres_anomalies_par_poste_comptable', 'poste_comptable': poste_choisi, 'exercice': exercice_choisi}, setNbAnomalie)

      fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'compter_nombres_anomalies_resolu_par_poste_comptables', 'poste_comptable': poste_choisi, 'exercice': exercice_choisi}, setNbCorrige)


      fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'recuperer_nombre_anomalies_par_mois_par_comptable', 'poste_comptable': poste_choisi, 'exercice': exercice_choisi}, setDataAnomalies)

      fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'recuperer_nombres_anomalies_resolues_par_mois_par_poste_comptable', 'poste_comptable': poste_choisi, 'exercice': exercice_choisi}, setDataAnomalieResolues)

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
  const data_generale = () => {

    fetchData(`${API_URL}/data/document/count`, 'post', {'action': 'compter_nombre_documents_generale'}, setNbDoc)

    fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'compter_nombre_anomalies_generale'}, setNbAnomalie)

    fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'compter_nombre_anomalies_resolu'}, setNbCorrige)

    fetchData(`${API_URL}/data/transcription/count`, 'post', {'action': 'compter_nombre_total_transcription'}, setNbTranscription)

    fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'recuperer_nombre_anomalies_par_mois'}, setDataAnomalies)

    fetchData(`${API_URL}/data/anomalie/count`, 'post', {'action': 'recuperer_nombres_anomalies_resolues_par_mois'}, setDataAnomalieResolues)
  
  }


  // Affichage des postes comptables par fonction de l'utilisateur
  const liste_poste_comptables = () => {
      // auditeur
    if( user[0]['utilisateur__fonction'].toUpperCase() == 'auditeur'.toUpperCase() ){
      fetchData(`${API_URL}/users/poste_comptable/all`, 'post', {'action': 'afficher_les_postes_comptables', 'user_id': user[0]['utilisateur_id']}, setPosteComptables)
    }
      // Directeur
    else if(user[0]['utilisateur__fonction'].toUpperCase() == 'directeur'.toUpperCase() || user[0]['utilisateur__fonction'].toUpperCase() == 'autres'.toUpperCase()){
      fetchData(`${API_URL}/users/poste_comptable/all`, 'post', {'action': 'afficher_tous_les_postes_comptables', 'fonction': user[0]['utilisateur__fonction'],'user_id': user[0]['utilisateur_id']}, setPosteComptables)
    }
      // Chef d'unite
    else{
      fetchData(`${API_URL}/users/poste_comptable/all`, 'post', {'action': 'afficher_les_postes_comptables_zone', 'zone': user[0]['utilisateur__zone__id']}, setPosteComptables)
    }
  }

  // Recuperer tous les exercices disponibles
  const obtenir_la_liste_des_exercices = () => {
    fetchData(`${API_URL}/data/exercice/get`, 'get', {}, setExercices)
  }



  useEffect(() => {
    data_generale()
    obtenir_la_liste_des_exercices()
  }, [])


  
  useEffect(() => {
    if(user){
      liste_poste_comptables()
    }
  }, [user])

  useEffect(() => {
    recuperer_evenements_utilisateurs()
  }, [])



  useEffect(() => {
    if(result){
      if(result['succes']){
        setDateAgenda("")
        setDescription("")
        setHeureAgenda("")
        // envoyer_data_to_parent()
      }
    }
  }, [result])


  const { logout } = useAuthentification()


  return (
    <section id='dashboard' className='w-full'>

      <div className='w-full flex items-center justify-center gap-2'>

        {/* Count - Item 1 */}
        <div className='container-count w-1/7 h-full flex flex-wrap justify-center items-center gap-4'>

          {/* Document */}
          <div className='h-35 w-full rounded-sm shadow-sm border border-blue-400 bg-blue-50'>

            <p className='font-bold text-xl text-center mt-4 '>Document(s)</p>
            <p className='text-center text-4xl/20 font-thin text-blue-400'>{ nb_doc['total_doc'] ? formatNombreAvecEspaces(nb_doc['total_doc']) : 0 }</p>
            
          </div>

          {/* Transcription */}
          <div className='h-35 w-full rounded-sm shadow-sm border border-pink-400 bg-pink-50'>
            <p className='font-bold text-xl text-center mt-4'>Transcription(s)</p>
            <p className='text-center text-4xl/20 font-thin text-pink-400'>{ nb_transcription['total_transcription'] ? formatNombreAvecEspaces(nb_transcription['total_transcription']) : 0 }</p>
          </div>
          
          {/* Anomalie */}
          <div className='h-35 w-full rounded-sm shadow-sm border border-yellow-400 bg-yellow-50'>
            <p className='font-bold text-xl text-center mt-4'>Anomalie(s)</p>
            <p className='text-center text-4xl/20 font-thin text-yellow-400'>{ nb_anomalie['total_anomalies'] ? formatNombreAvecEspaces(nb_anomalie['total_anomalies']) : 0 }</p>
          </div>

          {/* Correction */}
          <div className='h-35 w-full rounded-sm shadow-sm border border-green-400 bg-green-50'>
            <p className='font-bold text-xl text-center mt-4'>Correction(s)</p>
            <p className='text-center text-4xl/20 font-thin text-green-400'>{ nb_corrige['total_anomalies_resolu'] ? formatNombreAvecEspaces(nb_corrige['total_anomalies_resolu']) : 0 }</p>
          </div>  

        </div>


        {/* Item - 2 */}
        <div className='container-chart w-4/7 h-full flex flex-col justify-center flex-wrap gap-1 p-1'>

          {/* Filtrer le tableau de bord par poste comptable et par annee */}
          <div className='flex items-center gap-4 p-2 bg-gray-200 rounded-sm'>

            {/* Poste comptable */}
            <div className='flex-1 flex items-center gap-2 bg-white rounded-sm shadow-sm border border-gray-300 p-2'>

              <span className='icone'>
                <i className="fas fa-search"></i>
              </span>

              <input list='poste_comptable' className='w-full outline-none' placeholder='Choisissez un poste comptable' value={poste_choisi} onChange={(e) => {setPosteChoisi(e.target.value)} }/>
              <datalist id='poste_comptable'>
                {
                  poste_comptables && poste_comptables.map((item, index) => (
                    <option key={index} value={item['nom_poste']} />
                  ))
                }
              </datalist>

            </div>

            {/* Annee */}
            <div className='flex-1'>
                <select className='w-full rounded-sm shadow-sm bg-white p-2 border border-gray-300' value={exercice_choisi} onChange={(e) => setExerciceChoisi(e.target.value)}>
                  <option value="" disabled>Exercice</option>
                    {
                      exercices?.map((item, index) => (
                          <option key={index} value={item['annee']}>{item['annee']}</option>
                      ))
                    }
                </select>
            </div>

            <div>

              <button className='button is-dark' disabled={poste_choisi == "" || exercice_choisi == ""} onClick={voir_statistique_poste_comptable}>
                Voir
              </button>

            </div>

          </div>

          {/* Titre */}
          <div className='w-full text-xl font-semibold text-gray-400'>

            <p className='italic tracking-widest'>
              {`Tableau de bord ${poste_choisi} ${exercice_choisi}`}
              
            </p>

          </div>


          {/* Les graphiques (anomalies) */}
          <div className='w-full h-65 flex justify-center items-center gap-2'>
           
            <div className='w-1/2 h-full flex justify-center items-center chart-1 rounded-sm shadow-sm bg-white'>

              <BarChart 
                info={data_anomalies} 
                tabColor={getRandomColor(1)}
                labels={["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']}
                object='Anomlies'
                title='Anomalies detectées par mois'
              />

            </div>

            <div className="flex-1 h-full flex justify-center items-center chart-2 rounded-sm shadow-sm bg-white">
              <BarChart 
                info={data_anomalies}
                tabColor={getRandomColor(12)}
                labels={["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']}
                object='Anomalies'
                title='Anomalies detectées par mois'
              />
            </div>
     

          </div>

          {/* Les graphiques (correction) */}
          <div className='w-full h-66 flex gap-2 w-full'>

            <div className='w-1/2 flex justify-center items-center rounded-sm shadow-sm bg-white'>

              <LineChart 
                info={data_anomalie_resolues} 
                tabColor={getRandomColor(1)}
                labels={["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']}
                object='Anomalies resolues'
                title='Anomalies resolues par mois'
              />

            </div> 

            <div className='flex-1 flex justify-center items-center h-full chart-4 rounded-sm shadow-sm bg-white'>
              <BarChart 
                info={data_anomalie_resolues}
                tabColor={getRandomColor(12)}
                labels={["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']}
                object='Anomalies resolues'
                title='Anomalies resolues par mois'
              />
            </div>

          </div>


        </div>


        
        {/* Item 3 */}
        <div className='relative mr-4 w-2/7 h-full p-2 rounded-sm shadow-sm bg-white'>

          <div className='container-logout p-4 bg-white rounded-sm border border-gray-300 cursor-pointer duration-150 ease-in-out hover:bg-black hover:text-white' ref={container_logout} onMouseEnter={show_bloc_logout} onMouseLeave={close_bloc_logout} onClick={logout}>
            <button className='cursor-pointer'>Déconnexion</button>
          </div>

          <div className='w-full h-16 rounded-lg flex items-center bg-gray-100 cursor-pointer duration-200 ease-in-out hover:border border-gray-300 hover:shadow-sm' onMouseEnter={show_bloc_logout} onMouseLeave={close_bloc_logout}>

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

            <form onSubmit={(e) => Save_agenda(e)} className=''>

              <div className='field'>
                <label className='label'>Date de l'evenement</label>
                <div className='control flex'>

                  <input type="date" className='input w-1/3' value={date_agenda} onChange={(e) => setDateAgenda(e.target.value)} required/>

                  <label className='block text-center is-size-5 label w-1/3'>à</label>

                  <input type="time" name="" id="" className='input w-1/3' value={heure_agenda} onChange={(e) => setHeureAgenda(e.target.value)} required/>
                </div>
              </div>

              <div className='field'>
                  <div className='control'>
                    <label className='label'>Description de l'evenement</label>
                    <textarea rows={2} className='textarea' placeholder="Description de l'evenement(reunion, ...)" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                  </div>
              </div>

              <button type='submit' className='button is-dark mx-4 my-2'>
                Planifier
              </button>

            </form>

            <Calendrier evenements={evenements}/>

          </div>
        
      
      </div>

      </div>

      {
        result ?
            result['succes'] ?
                <Alert message={result['succes']} setMessage={setResult} icon='fas fa-check-circle' bgColor='bg-green-300'/>
            : null
        : null
      }

    </section>
  )
}
