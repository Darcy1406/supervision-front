import { useEffect, useState } from 'react'
import CalendrierAnnuel from '../../../Composants/CalendrierAnnuel/CalendrierAnnuel'
import { useUserStore } from '../../../store/useUserStore';
import { fetchData } from '../../../functions/fetchData';
import { API_URL } from '../../../Config';
import { Alert } from '../../../Composants/Alert/Alert';

export default function SjeAnalyse() {
    const user = useUserStore((state) => state.user);

    const [year, setYear] = useState(new Date().getFullYear());

    const [poste_choisi, setPosteChoisi] = useState("");
    const [postes_comptables, setPostesComptables] = useState("");

    const [transcription, setTranscription] = useState(null);

    const [result, setResult] = useState(null);

    const [anomalies, setAnomalies] = useState(null);


    const lancer_analyse = (e) => {
        e.preventDefault();
        fetchData(`${API_URL}/data/transcription/data_analyse`, 'POST', {'action': 'analyser_transcription_sje', 'piece': 'SJE', 'poste_comptable': poste_choisi, 'exercice': year}, setTranscription)
    }
    

    useEffect(() => {
        if(anomalies){
            console.log('anomalies', anomalies);
            fetchData(`${API_URL}/data/anomalie/insert`, 'post', {'action': 'ajouter_anomalie', 'data': anomalies, 'type_analyse': 'report_sje', 'poste_comptable': poste_choisi, 'exercice': year}, setResult);
        }
    }, [anomalies])


    useEffect(() => {
        if(result){
            console.log('result', result);
        }
    }, [result])


    // Charger les poste comptables
    useEffect(() => {
        fetchData(`${API_URL}/users/poste_comptable/get`, 'POST', {"utilisateur_id": user[0]['utilisateur_id'], "piece": 'SJE', 'action': 'afficher_les_postes_comptables_specifique_a_une_piece'}, setPostesComptables)
    }, [])

  return (
    <div className='p-2 mx-auto'>

        {/* Lancement de l'analyse */}
        <form onSubmit={lancer_analyse}>

            <div className="flex justify-center items-center gap-6 py-2 px-4 rounded-sm shadow-sm mb-2 mx-auto border-b border-gray-200 bg-white">

            

                <div className="flex-1 bg-white p-2 flex items-center gap-2 border border-gray-300 rounded-sm shadow-sm">
                    <span>
                        <i className='fas fa-search'></i>
                    </span>

                    <input list="poste_comptable" placeholder="Choisissez un poste comptable" className="flex-1 outline-none" value={poste_choisi} onChange={(e) => setPosteChoisi(e.target.value) } required/>
                    <datalist id="poste_comptable">
                        {
                            postes_comptables && postes_comptables.map((item, index) => (
                                <option value={item['nom_poste']} key={index} />
                            ))
                        }
                        
                    </datalist>

                </div>

                <div>
                    <button type='button' onClick={() => setYear((y) => y - 1)}>◀</button>
                    <span className="mx-2">{year}</span>
                    <button type='button' onClick={() => setYear((y) => y + 1)}>▶</button>
                </div>

                <div>
                    <button type='submit' className='py-2 px-4 bg-blue-500 text-white rounded-sm cursor-pointer duration-150 ease-in-out hover:bg-blue-600'>
                        <span className="icone mx-1">
                            <i className='fas fa-rocket'></i>
                        </span>
                        Lancer
                    </button>
                </div>

            </div>

        </form>

        <CalendrierAnnuel year={year} data={transcription} setAnomalies={setAnomalies}/>
        
        {
            result ?
                result['inserted'] > 0 ?
                    <Alert message={`${result['inserted']} nouvelle(s) anomalie(s) detectée(s)`}  bgColor='bg-yellow-300' borderColor='border-yellow-400' setMessage={setResult}/>
                : null
            : null
        }
        
      
    </div>
  )
}
