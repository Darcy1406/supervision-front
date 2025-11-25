import { useEffect, useState } from 'react'
import { fetchData } from '../../functions/fetchData';
import { API_URL } from '../../Config';
import { useUserStore } from '../../store/useUserStore';
import { Alert } from '../../Composants/Alert/Alert';
import Resolution from './Resolution';
import Modal from '../../Composants/Modal/Modal';
import { getCSRFToken } from '../../utils/csrf';

export default function Anomalie() {
    const user = useUserStore((state) => state.user);

    const [anomalies, setAnomalies] = useState(null);
    const [anomalies_filtered, setAnomaliesFiltered] = useState(null);

    const [selected_anomalie, setSelectedAnomalie] = useState([]); 

    const [postes_comptables, setPostesComptables] = useState(null);

    // Status
    const [isNouveau, setIsNouveau] = useState(true);
    const [isEnCours, setIsEncours] = useState(true);
    const [isResolu, setIsResolu] = useState(true);


    //  Autres filtres
    const [poste_choisi, setPosteChoisi] = useState("");
    const [type_analyse, setTypeAnalyse] = useState("");
    const [exercice, setExercice] = useState("");

    const [isVisible, setIsVisible] = useState(false);

    const [result, setResult] = useState(null);

    const [resolution, setResolution] = useState(null); // Va stocker la description d'un resolution

    const [commentaire, setCommentaire] = useState(""); // State qui va contenir le commentaire concernant pour la resolution d'une anomalie

    const [ligneActive, setLigneActive] = useState(null);


    const recuperer_id_anomalie = (value, checked) => {
        if(checked){
            const selected = [...selected_anomalie, value];
            setSelectedAnomalie(selected);
        }
        else{
            const filter = selected_anomalie.filter(id => {
                if(id == value){
                    return false
                }
                return true
            })
            setSelectedAnomalie(filter)
        }
    }


    const change_state_anomalie = () => {
        // console.log('anomalie', selected_anomalie);
        fetchData(`${API_URL}/data/anomalie/change_state`, 'post', {'action': 'changer_statut_anomalie_en_cours', 'anomalies': selected_anomalie}, setResult)
    }


    const resoudre_anomalie = (e) => {
        e.preventDefault();
        fetchData(`${API_URL}/data/correction/insert`, 'post', {'action': 'ajouter_correction', 'commentaire': commentaire, 'anomalie': selected_anomalie[0]}, setResult)
    }


    const exporter_rapport = () => {
        const csrftoken = getCSRFToken();
        fetch(`${API_URL}/data/anomalie/rapport`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken, 
            },
            credentials: 'include',
            body: JSON.stringify({
                action: "exporter_rapport",
                anomalie: selected_anomalie[0]
            })
        })
        .then(res => {
            if (!res.ok) throw new Error("Erreur lors de la génération du PDF");
            return res.blob();  // <-- IMPORTANT
        })
        .then(blob => {
            // Crée une URL temporaire pour le blob
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `rapport_anomalie_${selected_anomalie[0]}.pdf`; // nom du fichier
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // libère la mémoire
        })
        .catch(err => {
            console.error(err);
            alert("Impossible de télécharger le rapport");
        });
    };



    // Filter les donnees en fonction
    const data_filter = () => {

        if(anomalies_filtered){

            const filter = anomalies_filtered.filter(item => {

                // Filtre pour les status
                if(item['statut'].toLowerCase() == 'nouvelle' && !isNouveau){
                    return false;
                }
                if( exercice != "" && item['document__exercice'] != exercice.toString()){
                    return false
                }
                if(item['statut'].toLowerCase() == 'en cours' && !isEnCours ){
                    return false;
                }
                if(['resolue', 'résolue'].includes(item['statut'].toLowerCase())  && !isResolu){
                    return false;
                }

                // Filtre par poste comptable, analyse, exercice
                if( item['document__exercice'] != exercice && exercice != "" ){
                    return false;
                }
                if( item['document__poste_comptable__nom_poste'] != poste_choisi && poste_choisi != "" ){
                    return false;
                }
                if( item['type_analyse'] != type_analyse && type_analyse != "" ){
                    return false;
                }

                return true;
            })

            setAnomalies(filter);
        }
    }


    // Filter les anomalies en fonction du poste comptable, analyse, exercice
    


    const voir_resolution = (id) => {
        fetchData(`${API_URL}/data/correction/voir_detail`, 'post', {'action': 'voir_detail_resolution_anomalie', 'anomalie': id}, setResolution)
    }


    useEffect(() => {
        data_filter();
    }, [isNouveau, isEnCours, isResolu, exercice, poste_choisi, type_analyse])


    useEffect(() => {
        fetchData(`${API_URL}/data/anomalie/get`, 'get', {}, setAnomalies);
        fetchData(`${API_URL}/data/anomalie/get`, 'get', {}, setAnomaliesFiltered);
        fetchData(`${API_URL}/users/poste_comptable/get`, 'POST', {"user_id": user[0]['id'], 'action': 'afficher_les_postes_comptables'}, setPostesComptables)
    }, [])


    const AnomalieItem = ({item}) => {
        const selected = selected_anomalie.includes(item['id'].toString())
        const estActive = ligneActive === item.id;
        return(

            <tr 
                className={` ${['résolue', 'resolue'].includes(item['statut'].toLowerCase()) ? 'cursor-pointer' : ''} ${estActive ? 'bg-blue-200' : ''} `} 
                onClick={['résolue', 'resolue'].includes(item['statut'].toLowerCase()) ? () => { setLigneActive(item.id); voir_resolution(item['id']) } : () => {} }
            >
                <td>
                    {
                        !( ['résolue', 'resolue'].includes(item['statut'].toLowerCase()) ) ? 
                            <input type="checkbox" value={item['id']} onChange={(e) => recuperer_id_anomalie(e.target.value, e.target.checked) } checked={selected} />
                        : null
                    }
                </td>
                <td>{item['document__poste_comptable__nom_poste']}</td>
                <td>{item['date_anomalie']}</td>
                <td>{item['description']}</td>
                <td>
                    {
                        item['statut'].toLowerCase() == 'nouvelle' ?
                            <p className='bg-red-300 p-2 rounded-xl border border-red-400 text-center'>{item['statut']}</p>

                        : item['statut'].toLowerCase() == 'en cours' ? 
                            <p className='bg-blue-300 p-2 rounded-xl border border-blue-400 text-center'>{item['statut']}</p>
                            
                        : <p className='bg-green-300 p-2 rounded-xl border border-green-400 text-center'>{item['statut']}</p>
                    }
                    
                </td>
                <td>{item['created_at']}</td>
            </tr>
        )
    }


    useEffect(() => {
        if(result){
            if(result['succes']){
                setSelectedAnomalie([])
                setIsVisible(false);
                fetchData(`${API_URL}/data/anomalie/get`, 'get', {}, setAnomalies);
                fetchData(`${API_URL}/data/anomalie/get`, 'get', {}, setAnomaliesFiltered);
                data_filter();
            }
        }
    }, [result])


    useEffect(() => {
    
        const original_title = document.title;
        document.title = 'Gestion des anomalies';
    
        return () => {
          document.title = original_title
        }
    
      }, [])


  return (
    <div id='anomalie'>
        <p className='p-4 bg-gray-300 text-lg'>Liste des anomalies</p>
        <div className="container-table">

            {/* Filtre */}
            <div className="recherche flex justify-center items-center my-2 py-2 px-4 gap-4">

                <div className='flex gap-2 items-center w-1/3'>

                    <div className='w-35'>
                        <label htmlFor="" className="label">Poste comptable : </label>
                    </div>

                    <div className="flex-1">
                        <input list='poste_comptable' className=' w-1/2 input' placeholder='Choisissez un poste comptable' value={poste_choisi} onChange={(e) => setPosteChoisi(e.target.value) }/>
                        <datalist id='poste_comptable'>
                            {
                                postes_comptables && postes_comptables.map((item, index) => (
                                    <option key={index} value={item['nom_poste']} />
                                ))
                            }
                        </datalist>
                    </div>
                </div>

                <div className='flex gap-2 w-1/3 items-center'>

                    <div className='w-35'>
                        <label htmlFor="" className="label">Type d'anomalie : </label>
                    </div>

                    <div className='flex-1'>
                        <select name="" id="" className='bg-white w-full p-2 border border-gray-300 rounded-lg' value={type_analyse} onChange={ (e) => setTypeAnalyse(e.target.value) }>
                            <option value="" disabled>------</option>
                            <option value="report_sje">Report SJE</option>
                            <option value="equilibre_balance">Equilibre Balance</option>
                            <option value="solde_caisse">Verification Solde caisse</option>
                            <option value="solde_anormale">Verification Solde anormale</option>
                        </select>
                    </div>

                </div>

                <div className='flex w-1/3 gap-2 items-center'>

                    <div className='w-20'>
                        <label htmlFor="" className="label">Exercice : </label>
                    </div>
                    
                    <div className='flex-1'>
                        <select name="" id="" className='bg-white w-full p-2 rounded-lg border border-gray-300' value={exercice} onChange={(e) => {setExercice(e.target.value)}}>
                            <option value="" disabled>------</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                        </select>
                    </div>
                </div>

            </div>

            {
                selected_anomalie.length > 0 ?
                    <div className="container-btn flex gap-4 my-4">
                        {
                            selected_anomalie.length > 1 ?
                                <button className='bg-blue-400 cursor-pointer px-4 py-2 rounded-sm border border-blue-500 duration-200 ease-in-out hover:bg-blue-500' onClick={change_state_anomalie}>
                                    Traiter({selected_anomalie.length})
                                </button>
                            :
                                <>
                                    <button className='bg-blue-400 cursor-pointer px-4 py-2 rounded-sm border border-blue-500 duration-200 ease-in-out hover:bg-blue-500' onClick={change_state_anomalie}>
                                        Traiter({selected_anomalie.length})
                                    </button>

                                    <button className='bg-green-400 cursor-pointer px-4 py-2 rounded-sm border border-green-500 duration-200 ease-in-out hover:bg-green-500' onClick={() => setIsVisible(true)}>
                                        Resoudre({selected_anomalie.length})
                                    </button>

                                    <button className='button is-dark text-white' onClick={exporter_rapport}>
                                        Exporter un rapport({selected_anomalie.length})
                                    </button>

                                </>
                        }
                        
                    </div>
                : null
            }


            {/* Description de la resolution de l'anomalie */}
            {
                resolution ?
                    resolution.length > 0 ?
                        <fieldset className='border-2 border-green-300 px-6 py-4 mx-2 w-1/2 rounded-lg'>
                            <legend>
                                <span className='mx-1 icon text-red-500 cursor-pointer duration-150 ease-in-out hover:text-red-600' onClick={() => { setResolution(null); setLigneActive(null) } }>
                                    <i className='fas fa-times-circle'></i>
                                </span>
                                Resoltion de l'anomalie
                            </legend>

                            <p>
                                {resolution[0].commentaire}
                            </p>
                        </fieldset>
                    : null
                : null
            }


            {/* Va contenir les checkboxs de filtres sur les status */}
            <div className='container-filtre is-pulled-right mx-4 my-2'>

                <label htmlFor="" className='mx-4'>
                    <input type="checkbox" value='nouvelle' name="" id="" className='checkbox' checked={isNouveau} onChange={(e) => setIsNouveau(e.target.checked)}/>
                    Nouvelle
                </label>

                <label htmlFor="" className='mx-4'>
                    <input type="checkbox" value='en cours' name="" id="" className='checkbox' checked={isEnCours} onChange={(e) => setIsEncours(e.target.checked)}/>
                    En cours
                </label>

                <label htmlFor="" className='mx-4'>
                    <input type="checkbox" value='résolue' name="" id="" className='checkbox' checked={isResolu} onChange={(e) => setIsResolu(e.target.checked)}/>
                    Résolue
                </label>

            </div>

            <table className='table is-fullwidth'>

                <thead>
                    <tr>
                        <th></th>
                        <th>Poste comptable</th>
                        <th>Date d'anomalie</th>
                        <th>Description</th>
                        <th className='w-35'>Statut</th>
                        <th>Date d'analyse</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        anomalies ? 
                            anomalies.length > 0 ?
                                anomalies.map((item, index) => (
                                    <AnomalieItem item={item} key={index}/>
                                ))
                            : 
                                <tr className='text-center'>
                                    <td colSpan={6}>Aucune donnée</td>    
                                </tr>
                        :   
                        <tr className='text-center'>
                            <td colSpan={6}>En attente des données</td>    
                        </tr>
                    }
                </tbody>

            </table>
        </div>


        <Modal isVisible={isVisible} setIsvisible={setIsVisible}>
            <Resolution handleSubmit={resoudre_anomalie} commentaire={commentaire} setCommentaire={setCommentaire}/>
        </Modal>


        {
            result ?
                result['succes'] ?
                    <Alert message={result['succes']} setMessage={setResult} bgColor='bg-green-300' borderColor='border-green-400' />
                : null
            : null
        }

    </div>
  )
}
