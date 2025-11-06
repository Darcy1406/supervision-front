import React, { useEffect, useState } from 'react'
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

    const [anomalies, setAnomalies] = useState([]);

    const [result, setResult] = useState(null);


    const lancer_analyse = (e) => {
        e.preventDefault();
        fetchData(`${API_URL}/data/transcription/analyse`, 'POST', {'action': 'analyser_transcription_sje', 'piece': 'SJE', 'poste_comptable': poste_choisi, 'exercice': year}, setTranscription)
    }
    

    useEffect(() => {
        if(anomalies.length > 0){
            fetchData(`${API_URL}/data/anomalie/insert`, 'post', {'action': 'ajouter__anomalie', 'data': anomalies}, setResult);
        }
    }, [anomalies])


    useEffect(() => {
        if(result){
            console.log('result', result);
        }
    }, [result])


    useEffect(() => {
        fetchData(`${API_URL}/users/poste_comptable/get`, 'POST', {"utilisateur_id": user[0]['id'], "piece": 'SJE', 'action': 'afficher_les_postes_comptables_specifique_a_une_piece'}, setPostesComptables)
    }, [])

  return (
    <div>

        {/* Lancement de l'analyse */}
        <form onSubmit={lancer_analyse}>

            <div className="flex justify-center items-center gap-6 py-4">

            

                <div className="container-filtre flex justify-center items-center gap-2 w-1/2">

                    <div className=''>
                        <label htmlFor="" className="label">Poste comptable : </label>
                    </div>

                    <div className='flex-1 bg-'>
                        <input list="poste_comptable" placeholder="Choisissez un poste comptable" className="bg-white p-2 border border-gray-300 rounded-lg w-full" value={poste_choisi} onChange={(e) => setPosteChoisi(e.target.value) } required/>
                        <datalist id="poste_comptable">
                            {
                                postes_comptables && postes_comptables.map((item, index) => (
                                    <option value={item['nom_poste']} key={index} />
                                ))
                            }
                            
                        </datalist>
                    </div>

                </div>

                <div>
                    <button type='button' onClick={() => setYear((y) => y - 1)}>◀</button>
                    <span className="mx-2">{year}</span>
                    <button type='button' onClick={() => setYear((y) => y + 1)}>▶</button>
                </div>

                <div>
                    <button type='submit' className='button is-dark'>
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
