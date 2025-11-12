import { useEffect, useState } from 'react'
import { API_URL } from '../../../Config';
import { fetchData } from '../../../functions/fetchData';
import { useUserStore } from '../../../store/useUserStore';
import { Alert } from '../../../Composants/Alert/Alert';

export default function SoldeAnormale() {
    const user = useUserStore((state) => state.user);

    const [postes_comptables, setPostesComptables] = useState(null);

    const [poste_choisi, setPosteChoisi] = useState("");
    const [piece, setPiece] = useState("");
    const [proprietaire, setProprietaire] = useState("");
    const [mois, setMois] = useState("");
    const [exercice, setExercice] = useState("");

    const [data, setData] = useState(null);
    const [anomalies, setAnomalies] = useState(null);

    const [result, setResult] = useState(null); // Va stocker un message en cas d'anomalie detectee et inseree

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData(`${API_URL}/data/transcription/data_analyse`, 'post', {'action': 'analyser_solde_anormale', 'poste_comptable': poste_choisi, 'piece': piece, 'proprietaire': proprietaire, 'exercice': exercice, 'mois': mois}, setData)
    }


    const lancer_analyse = () => {
        const anomalies = data.filter(item => {
            const solde = item.compte__solde_en_cours_exo?.toUpperCase();
            const nature = item.nature?.toUpperCase();
          
            // Règle 1 : DEBITEUR → doit être SLD_D
            if (solde === "DEBITEUR" && nature !== "SLD_D") {
              return true;
            }
          
            // Règle 2 : CREDITEUR → doit être SLD_C
            if (solde === "CREDITEUR" && nature !== "SLD_C") {
              return true;
            }
          
            return false;
          });

        
        setAnomalies(anomalies)
        let description = '';

        if(anomalies.length > 0){

            anomalies.forEach(item => {
                description += ` ${item.compte__numero} : ${item.compte__solde_en_cours_exo} mais ${item.nature} = ${item.montant.toLocaleString('fr-FR')} Ar\n`  
            })

            const anomalie = [{
                date: data[0].document__date_arrivee,
                description: description,
                fichier: [data[0].document__nom_fichier],
                analyse: 'solde_anormale'
            }]

            
            fetchData(`${API_URL}/data/anomalie/insert`, 'post', {'action': 'ajouter_anomalie', 'data': anomalie}, setResult)

        }
          
        console.log("Anomalies détectées :", anomalies);
    }



    useEffect(() => {
        fetchData(`${API_URL}/users/poste_comptable/get`, 'POST', {"utilisateur_id": user[0]['id'], "piece": ['BOD', 'BOV'], 'action': 'afficher_les_postes_comptables_specifique_a_une_piece'}, setPostesComptables)
    }, [])


    useEffect(() => {
        if(data){
            // console.log('data', data);
            lancer_analyse();
        }
        console.log(data);
    }, [data])


  return (
    <div id='solde_anormale bg-green-400'>

        <div className='my-2'>
            <p className='text-center text-xl font-semibold italic'>Verification de solde anormale</p>
        </div>

        <div className="bloc-form px-4 py-2 border-b border-gray-300">

            <form onSubmit={handleSubmit}>

                <div className='flex gap-6 my-2'>

                    {/* Poste comptable */}
                    <div className='w-3/6 gap-2'>

                        <div className=''>
                            <label className='label'>Poste comptable : </label>
                        </div>

                        <div className=''>
                            <input list='poste_comptable' className='input' placeholder='Choisissez un poste comptable' value={poste_choisi} onChange={(e) => setPosteChoisi(e.target.value)} required/>
                            <datalist id='poste_comptable'>
                                {
                                    postes_comptables && postes_comptables.map((item, index) => (
                                        <option key={index} value={item['nom_poste']} />
                                    ))
                                }
                            </datalist>
                        </div>

                    </div>

                    {/* Piece */}
                    <div className='w-1/6 justify-center gap-2'>

                        <div className=''>
                            <label className="label">Piece : </label>
                        </div>

                        <div className='flex-1'>
                            <select value={piece} onChange={(e) => setPiece(e.target.value)} className='bg-white w-full p-2 rounded-sm border border-gray-300' required>
                                <option value="">-----</option>
                                <option value="BOD">BOD</option>
                                <option value="BOV">BOV</option>
                            </select>
                        </div>

                    </div>

                    {/* Proprietaire */}
                    <div className="w-1/6">
                        <div className="">
                            <label className="label">Proprietaire</label>
                        </div>

                        <div>
                            <select className='w-full bg-white p-2 rounded-sm border border-gray-300' value={proprietaire} onChange={(e) => setProprietaire(e.target.value)}>
                                <option value="">------</option>
                                <option value="ETAT">ETAT</option>
                                <option value="REGION">REGION</option>
                                <option value="COMMUNE">COMMUNE</option>
                            </select>
                        </div>

                    </div>


                    <div className='w-1/6'>

                        <div className=''>
                            <label className='label'>Mois : </label>
                        </div>

                        <div className=''>
                            <select className='bg-white w-full p-2 border border-gray-300 rounded-sm' value={mois} onChange={(e) => setMois(e.target.value)} required>
                                <option value="">-----</option>
                                <option value="01">Janvier</option>
                                <option value="02">Fevrier</option>
                                <option value="03">Mars</option>
                                <option value="04">Avril</option>
                                <option value="05">Mai</option>
                                <option value="06">Juin</option>
                                <option value="07">Juillet</option>
                                <option value="08">Août</option>
                                <option value="09">Septembre</option>
                                <option value="10">Octobre</option>
                                <option value="11">Novembre</option>
                                <option value="12">Décembre</option>
                            </select>
                        </div>

                    </div>


                    <div className='w-1/6'>

                        <div className=''>
                            <label className='label'>Exercice : </label>
                        </div>

                        <div className=''>

                            <select className='w-full bg-white p-2 rounded-sm border border-gray-300' value={exercice} onChange={(e) => setExercice(e.target.value)}>
                                <option value="">------</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                            </select>

                        </div>

                    </div>

                    <div className='flex-1 flex items-center justify-center gap-2'>
                        <div className="">
                            <button className="button is-dark">
                                Lancer
                            </button>
                        </div>
                    </div>



                </div>

            </form>

        </div>

        {
            data ?

                data.length > 0 ?

                    anomalies ?
                        anomalies.length > 0 ?
                            <ul className='text-center my-4 text-lg font-semibold'>
                                {anomalies.map((a, index) => (
                                    <li className='my-4 bg-yellow-200 p-4' key={index}>
                                        ⚠️ {a.document__nom_fichier} — {a.compte__numero} : il s'agit d'un compte {a.compte__solde_en_cours_exo} mais a une {a.nature} de {a.montant.toLocaleString('fr-FR')} Ar
                                    </li>
                                ))}
                        </ul> 
                        : 
                          <div className='w-full mx-auto border border-yellow-300 p-6 rounded-xl my-6'>
                              <p className='text-center text-lg font-semibold'>Aucune anomalie détectée ✅</p>
                          </div>
                    : 
                        null

                : <div className='w-full mx-auto border-2 border-yellow-300 p-6 rounded-xl my-6'>
                    <p className='text-center text-lg font-semibold'>Aucune donnée à analyser</p>
                </div>

            : 
                <div className='w-full mx-auto border-2 border-gray-300 p-6 rounded-xl my-6'>
                    <p className='text-center text-lg font-semibold'>Veuillez lancer une analyse</p>
                </div>

        }


        {
            result ?
                result['inserted'] > 0 ?
                    <Alert 
                        message={`${result['inserted']} nouvelle(s) anomalie(s) detectée(s)`}  
                        bgColor='bg-yellow-300' 
                        borderColor='border-yellow-400' 
                        setMessage={setResult}/>
                : null
            : null
        }

    </div>
  )
}
