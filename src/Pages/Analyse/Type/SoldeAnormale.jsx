import { useEffect, useState } from 'react'
import { API_URL } from '../../../Config';
import { fetchData } from '../../../functions/fetchData';
import { useUserStore } from '../../../store/useUserStore';
import { Alert } from '../../../Composants/Alert/Alert';
import { formatNombreAvecEspaces } from '../../../functions/Function';

export default function SoldeAnormale() {
    const user = useUserStore((state) => state.user);

    const [postes_comptables, setPostesComptables] = useState(null);

    const [poste_choisi, setPosteChoisi] = useState("");
    const [piece, setPiece] = useState("");
    const [proprietaire, setProprietaire] = useState("");
    const [mois, setMois] = useState("");

    const [liste_exercices, setListeExercices] = useState(null)
    const [exercice, setExercice] = useState("");

    const [data, setData] = useState(null);
    const [anomalies, setAnomalies] = useState(null);
    const [anomalies_description, setAnomaliesDescription] = useState(null)

    const [result, setResult] = useState(null); // Va stocker un message en cas d'anomalie detectee et inseree

    const obtenir_la_liste_des_exercices = () => {
        fetchData(`${API_URL}/data/exercice/get`, 'get', {}, setListeExercices)
    }


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

        setAnomaliesDescription(anomalies)

        let description = '';

        if(anomalies.length > 0){

            anomalies.forEach(item => {
                description += ` ${item.compte__numero} : ${item.compte__solde_en_cours_exo} mais a une ${item.nature} = ${formatNombreAvecEspaces(item.montant)} Ar\n`  
            })

            const anomalie = [{
                date: data[0].document__date_arrivee,
                description: description,
                fichier: [data[0].document__nom_fichier],
                analyse: 'solde_anormale'
            }]

            setAnomalies(anomalie)

        }
        else{
            setAnomalies([]);
        }
        
    }


    const envoyer_anomalie = () => {
        fetchData(
            `${API_URL}/data/anomalie/insert`, 
            'post', 
            {
                'action': 'ajouter_anomalie', 
                'data': anomalies, 
                'type_analyse': 'solde_anormale', 
                'poste_comptable': poste_choisi, 
                'exercice': exercice, 
                'mois': mois, 
                'proprietaire': proprietaire, 
                'piece': piece
            }, 
            setResult
        )
    }


    useEffect(() => {
        if(anomalies){
            envoyer_anomalie()
        }
    }, [anomalies])


    // Charger les poste comptables et les exercices
    useEffect(() => {

        fetchData(`${API_URL}/users/poste_comptable/get`, 'POST', {"utilisateur_id": user[0]['utilisateur_id'], "piece": ['BOD', 'BOV'], 'action': 'afficher_les_postes_comptables_specifique_a_une_piece'}, setPostesComptables)

        obtenir_la_liste_des_exercices()

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
            
        </div>

        <div className="bloc-form w-8/9 mx-auto px-4 py-2 border-b border-gray-300 bg-white rounded-sm shadow-sm">

            <form onSubmit={handleSubmit}>

                <div className='flex items-center border-b border-gray-200 py-2 px-4'>

                    <p className='flex-1 text-xl font-semibold'>Verification de solde anormale</p>


                    <div className="">
                        <button type='submit' className="py-2 px-4 bg-blue-500 text-white rounded-sm cursor-pointer duration-150 ease-in-out hover:bg-blue-600">
                            <span className="icone mx-1">
                                <i className='fas fa-rocket'></i>
                            </span>
                            Lancer
                        </button>
                    </div>


                </div>

                <div className='flex items-center justify-center gap-6 my-3 p-4 bg-white rounded-sm border border-gray-300'>

                    {/* Poste comptable */}
                    <div className='flex-1 flex items-center gap-2 rounded-sm border border-gray-300 p-2'>

                        <span className='icone mx-1'>
                            <i className="fas fa-search"></i>
                        </span>

                        <input list='poste_comptable' className='outline-none flex-1' placeholder='Choisissez un poste comptable' value={poste_choisi} onChange={(e) => setPosteChoisi(e.target.value)} required/>
                        <datalist id='poste_comptable'>
                            {
                                postes_comptables && postes_comptables.map((item, index) => (
                                    <option key={index} value={item['nom_poste']} />
                                ))
                            }
                        </datalist>

                    </div>

                    {/* Piece */}
                    <div className='flex-1 flex items-center gap-2'>

                        <select value={piece} onChange={(e) => setPiece(e.target.value)} className='bg-white w-full p-2 rounded-sm border border-gray-300' required>
                            <option value="" disabled>Pièces</option>
                            <option value="BOD">BOD</option>
                            <option value="BOV">BOV</option>
                        </select>

                    </div>

                    {/* Proprietaire */}
                    <div className="flex-1 flex items-center gap-2">

                        <select className='w-full bg-white p-2 rounded-sm border border-gray-300' value={proprietaire} onChange={(e) => setProprietaire(e.target.value)}>
                            <option value="" disabled>Propriétaire</option>
                            <option value="ETAT">ETAT</option>
                            <option value="REGION">REGION</option>
                            <option value="COMMUNE">COMMUNE</option>
                        </select>


                    </div>


                    <div className='flex-1 flex items-center gap-2'>

                        <div className='flex-1'>
                            <select className='bg-white w-full p-2 border border-gray-300 rounded-sm' value={mois} onChange={(e) => setMois(e.target.value)} required>
                                <option value="" disabled>Mois</option>
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


                    <div className='flex-1 flex items-center gap-2'>

                        <select className='w-full bg-white p-2 rounded-sm border border-gray-300' value={exercice} onChange={(e) => setExercice(e.target.value)}>
                            <option value="" disabled>Exercice</option>

                            {
                                liste_exercices && liste_exercices.map((item , index) => (
                                    <option key={index} value={item['annee']}>{item['annee']}</option>
                                ))
                            }

                        </select>

                    </div>

                    



                </div>

            </form>

        </div>

        {
            data ?

                data.length > 0 ?

                    anomalies_description ?
                        anomalies_description.length > 0 ?
                            <ul className='text-center my-4 text-lg font-semibold'>
                                {anomalies_description.map((a, index) => (
                                    <li className='my-4 mx-auto border-2 border-yellow-300 rounded-sm bg-white  p-4 w-6/7 text-xl' key={index}>

                                        <span className='icon mx-2 text-yellow-300'>
                                            <i className="fas fa-exclamation-triangle"></i>
                                        </span>

                                        {a.document__nom_fichier} — {a.compte__numero} : il s'agit d'un compte {a.compte__solde_en_cours_exo} mais a une {a.nature} de {formatNombreAvecEspaces(a.montant) || 0} Ar
                                    </li>
                                ))}
                        </ul> 
                        : 
                          <div className='w-full mx-auto border border-yellow-300 p-6 rounded-xl my-6'>
                              <p className='text-center text-lg font-semibold'>Aucune anomalie détectée</p>
                          </div>
                    : 
                        null

                : <div className='w-6/7 mx-auto border-2 border-yellow-300 p-6 rounded-xl my-6'>
                    <p className='text-center text-lg font-semibold'>
                        <span className='mx-2 text-3xl'>
                            <i className="fas fa-database"></i>
                        </span>
                        Aucune donnée à analyser
                    </p>
                </div>

            : 
                <div className='w-6/7  mx-auto border-2 border-gray-300 p-6 rounded-xl my-6'>
                    <p className='text-center text-lg font-semibold'>
                        <span className='mx-2 text-3xl'>
                            <i className="fas fa-rocket"></i>
                        </span>
                        Veuillez lancer une analyse
                    </p>
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
