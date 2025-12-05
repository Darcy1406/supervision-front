import { useEffect, useState } from 'react'
import { fetchData } from '../../../functions/fetchData';
import { API_URL } from '../../../Config';
import { Alert } from '../../../Composants/Alert/Alert';
import { useUserStore } from '../../../store/useUserStore';
import { formatNombreAvecEspaces } from '../../../functions/Function';

export default function SoldeCaisse() {
    const user = useUserStore((state) => state.user);

    const [postes_comptables, setPostesComptables] = useState(null);
    const [poste_choisi, setPosteChoisi] = useState("");
    const [proprietaire, setProprietaire] = useState("");
    const [mois, setMois] = useState("");

    const [liste_exercices, setListeExercices] = useState(null)
    const [exercice, setExercice] = useState("");

    const [data, setData] = useState(null); // Va stocker les donnees a analyser

    const [result, setResult] = useState(null); // Va stocker un message en cas d'anomalie detectee et inseree

    const [anomalies, setAnomalies] = useState(null);


    const obtenir_la_liste_des_exercices = () => {
        fetchData(`${API_URL}/data/exercice/get`, 'get', {}, setListeExercices)
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData(`${API_URL}/data/analyse/solde_caisse`, 'post', {'action': 'verfication_solde_caisse', 'poste_comptable': poste_choisi, 'proprietaire': proprietaire, 'exercice': exercice, 'mois': mois}, setData)
    }


    useEffect(() => {

        fetchData(`${API_URL}/users/poste_comptable/get`, 'POST', {"utilisateur_id": user[0]['id'], "piece": 'BOD', 'action': 'afficher_les_postes_comptables_specifique_a_une_piece'}, setPostesComptables)

        obtenir_la_liste_des_exercices()

    }, [])


    // Cette fonction va tester s'il y anomalie ou pas. Si oui, elle va effectuer une insertion vers la base
    const detection_anomalie = () => {

        if( Number(data.balance[0]['total']) != Number(data.sje[0]['total']) ){
            const texte = `Le solde compte 5310 du mois de ${mois} : ${data.balance[0]['total'].toLocaleString('fr-FR')} Ar ne correspond pas a l'encaisse journaliere du fin de ce mois : ${data.sje[0]['total'].toLocaleString('fr-FR')} Ar`;

            const anomalie = [{
                date: data.balance[0].date_arrivee,
                description: texte,
                fichier: [data.balance[0]['nom_fichier'], data.sje[0]['nom_fichier']],
                analyse: 'solde_caisse'
            }]

            setAnomalies(anomalie);

            // fetchData(`${API_URL}/data/anomalie/insert`, 'post', {'action': 'ajouter_anomalie', 'data': anomalie}, setResult)
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
                'type_analyse': 'solde_caisse', 
                'poste_comptable': poste_choisi, 
                'exercice': exercice, 
                'mois': mois, 
                'proprietaire': proprietaire, 
                'piece': 'BOD'
            }, 
            setResult
        )
    }


    useEffect(() => {
        if(anomalies){
            envoyer_anomalie()
        }
    }, [anomalies])



    useEffect(() => {
        if(data && data.sje.length > 0 && data.balance.length > 0){
            detection_anomalie();
        }   
    }, [data])


  return (
    <div id='solde_caisse'>
        <p className='text-center my-4 text-2xl'>Verification du solde de caisse</p>

        <div className="bloc-form">

            <form onSubmit={handleSubmit}>

                
                <div className='flex justify-center items-center gap-6 my-2 px-6'>
                    
                    <div className='flex items-center gap-2'>

                        {/* Poste comptable */}
                        <div className=''>
                            <label className='label'>Poste comptable : </label>
                        </div>

                        <div className='w-70'>
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

                    {/* Proprietaire */}
                    <div className='flex items-center gap-2'>

                        <div className="">
                            <label className='label'>Proprietaire</label>
                        </div>

                        <div className="">
                            <select className='w-full bg-white p-2 rounded-sm border border-gray-300' value={proprietaire} onChange={(e) => setProprietaire(e.target.value)}>
                                <option value="">------</option>
                                <option value="ETAT">ETAT</option>
                                <option value="REGION">REGION</option>
                                <option value="COMMUNE">COMMUNE</option>
                            </select>
                        </div>

                    </div>


                    {/* Mois */}
                    <div className='flex items-center gap-2'>

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

                    {/* Exercice */}
                    <div className='flex items-center gap-2'>

                        <div className=''>
                            <label className='label'>Exercice : </label>
                        </div>

                        <div className=''>
                            <select className='w-full bg-white p-2 rounded-sm border border-gray-300' value={exercice} onChange={(e) => setExercice(e.target.value)}>
                                <option value="">------</option>

                                {
                                    liste_exercices && liste_exercices.map((item, index) => (
                                        <option key={index} value={item['annee']}>{item['annee']}</option>
                                    ))
                                }
                              
                            </select>
                        </div>

                    </div>

                    <div className=''>
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
                data.balance.length > 0 && data.sje.length > 0 ?

                    <div className='container-verification w-6/7 mx-auto mt-4 py-4'>

                        <div className='p-4 bg-gray-300 mt-4 rounded-lg border border-gray-400'>
                            <p className='underline'>Situation Journaliere d'Encaisse : Encaisse du fin du mois</p>
                            <p className='my-2'>
                                Montant : 
                                <strong className='mx-1 text-xl'>
                                    { formatNombreAvecEspaces(data?.sje?.[0]['total']) || 0 } Ar
                                </strong>
                            </p>
                        </div>
                        
                        <div className='p-4 bg-gray-300 mt-4 rounded-lg border border-gray-400'>
                            <p className='underline'>Solde compte 5310 du mois</p>
                            <p className='my-2'>
                                Montant : 
                                <strong className='mx-1 text-xl'>
                                    { formatNombreAvecEspaces(data?.balance?.[0]['total']) || 0 } Ar
                                </strong>
                            </p>
                        </div>

                    </div>
                : 
                    <div className='w-6/7 mx-auto border-2 border-yellow-300 p-6 rounded-lg my-6'>
                        <p className='text-center text-xl font-semibold'>
                            <span className='mx-2 text-3xl'>
                                <i className="fas fa-database"></i>
                            </span>
                            Les données ne sont pas encore aux complets pour éffectuer une analyse
                        </p>
                    </div>
            : 
            <div className='w-6/7 mx-auto border-2 border-gray-300 p-6 rounded-lg my-6'>
                <p className='text-center text-xl font-semibold'>
                    <span className='mx-2 text-3xl'>
                        <i className="fas fa-rocket"></i>
                    </span>
                    Veuillez lancer une analyse
                </p>
            </div>
        }


        {
            data ?
                data.balance.length > 0 && data.sje.length > 0 ?
                    <div className='w-1/2 mx-auto p-4'>
                        <fieldset className={ Number(data?.balance[0]['total']) == Number(data?.sje[0]['total']) ?  'border border-green-400 rounded-sm px-6 py-4' : 'border border-red-400 rounded-sm px-6 py-4'}>
                            <legend>
                                {
                                    Number(data?.balance[0]['total']) == Number(data?.sje[0]['total']) ?
                                        <span className='is-size-2 text-green-400'>
                                            <i className="far fa-thumbs-up mx-auto"></i>
                                        </span>
                                    :
                                        <span className='is-size-2 text-red-400'>
                                            <i className='fas fa-times'></i>
                                        </span>
                                }
                            </legend>
                            {
                                Number(data?.balance[0]['total']) == Number(data?.sje[0]['total']) ?
                                    <>
                                        <p className='text-center text-lg text-green-400'>Le solde est authentique</p>
                                    </>
                                : 
                                    <p className='text-center text-lg text-red-400'>Le solde n'est pas authentique</p>
                            
                            }
                        </fieldset>
                    </div>
                : null
            : null
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
