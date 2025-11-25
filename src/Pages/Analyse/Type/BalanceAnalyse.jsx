import { useEffect, useMemo, useState } from 'react'
import { fetchData } from '../../../functions/fetchData';
import { API_URL } from '../../../Config';
import { useUserStore } from '../../../store/useUserStore';
import { Alert } from '../../../Composants/Alert/Alert';
import { formatNombreAvecEspaces } from '../../../functions/Function'

export default function BalanceAnalyse() {
    const user = useUserStore((state) => state.user);

    const [postes_comptables, setPostesComptables] = useState(null);
    const [poste_choisi, setPosteChoisi] = useState("");
    const [piece, setPiece] = useState("");
    const [proprietaire, setProprietaire] = useState("");
    const [mois, setMois] = useState("");
    const [exercice, setExercice] = useState("");

    const [data, setData] = useState(null);

    const [description, setDescription] = useState("Aucune description pour l'instant");

    const [anomalies, setAnomalies] = useState(null);

    const [result, setResult] = useState(null);

    // Ordre d'affichage souhaité
    const displayOrder = [
    'BE_D', 'BE_C',
    'OG_D', 'OG_C',
    'TOT_D', 'TOT_C',
    'SLD_D', 'SLD_C',
    'OFG_D', 'OFG_C',
    'BS_D', 'BS_C'
    ];

    // Transformer les données en objet pour un accès rapide
    // const dataMap = {};
    // data?.forEach(item => {
    //     dataMap[item.nature] = item.total;
    // });
    const dataMap = useMemo(() => {
        const map = {};
        data?.forEach(item => {
          map[item.nature] = item.total;
        });
        return map;
    }, [data]);
      


    const description_analyse = () => {
        let texte = ""

        if( dataMap['BE_D'] != dataMap['BE_C']  || dataMap['OG_D'] != dataMap['OG_C'] || dataMap['TOT_D'] != dataMap['TOT_C'] || dataMap['SLD_D'] != dataMap['SLD_C'] || dataMap['OFG_D'] != dataMap['OFG_C'] || dataMap['BS_D'] != dataMap['BS_C'] ){

            texte += "La balance n'est pas equilibrée\n"

            if(dataMap['BE_D'] != dataMap['BE_C'] ){
                texte += "-BE_D # BE_C\n"
            }

            if(dataMap['OG_D'] != dataMap['OG_C'] ){
                texte += "-OG_D # OG_C\n"
            }

            if(dataMap['TOT_D'] != dataMap['TOT_C'] ){
                texte += "-TOT_D # TOT_C\n"
            }

            if(dataMap['SLD_D'] != dataMap['SLD_C'] ){
                texte += "-SLD_D # SLD_C\n"
            }

            if(dataMap['OFG_D'] != dataMap['OFG_C'] ){
                texte += "-OFG_D # OFG_C\n"
            }

            if(dataMap['BS_D'] != dataMap['BS_C'] ){
                texte += "-BS_D # BS_C\n"
            }

            setDescription(texte)

            const anomalies = [{
                date: data[0]?.date_arrivee,
                description: texte,
                fichier: [data[0].nom_fichier],
                analyse: 'equilibre_balance'
            }]

            setAnomalies(anomalies)
        }
        else{
            setDescription("La balance est equilibrée")
            setAnomalies([]);
        }

    }


    const envoyer_anomalie = () => {
        fetchData(`${API_URL}/data/anomalie/insert`, 'post', {'action': 'ajouter_anomalie', 'data': anomalies, 'type_analyse': 'equilibre_balance', 'poste_comptable': poste_choisi, 'exercice': exercice, 'mois': mois, 'proprietaire': proprietaire, 'piece': piece}, setResult)
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        setDescription("Aucune description pour l'instant");
        fetchData(`${API_URL}/data/analyse/equilibre_balance`, 'post', {'action': 'analyse_equilibre_balance', 'poste_comptable': poste_choisi, 'piece': piece, 'proprietaire': proprietaire , 'exercice': exercice, 'mois': mois}, setData)
    }

    useEffect(() => {
        fetchData(`${API_URL}/users/poste_comptable/get`, 'POST', {"utilisateur_id": user[0]['id'], "piece": ['BOD', 'BOV'], 'action': 'afficher_les_postes_comptables_specifique_a_une_piece'}, setPostesComptables)
    }, [])


    useEffect(() => {
        if(Object.keys(dataMap).length > 0){
            description_analyse()
        }
    }, [dataMap])


    useEffect(() => {
        if(anomalies){
            envoyer_anomalie()
        }
    }, [anomalies])


  return (
    <div id='equilibre_balance'>

        <div className="bloc-form">
            <form onSubmit={handleSubmit}>

                <div className='flex gap-6 my-2 px-6'>

                    {/* Poste comptable */}
                    <div className='w-2/6 justify-center gap-2'>
                        <div className='w-35'>
                            <label className='label'>Poste comptable : </label>
                        </div>
                        <div className='flex-1'>
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
                    <div className='w-1/6 gap-2'>

                        <div className='w-14'>
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
                        <div>
                            <label className='label'>Propriétaire : </label>
                        </div>
                        <div>
                            <select className='w-full bg-white rounded-sm border border-gray-300 p-2' value={proprietaire} onChange={(e) => setProprietaire(e.target.value)} required>
                                <option value="">------</option>
                                <option value="ETAT">ETAT</option>
                                <option value="REGION">REGION</option>
                                <option value="COMMUNE">COMMUNE</option>
                            </select>
                        </div>
                    </div>

                    {/* Mois */}
                    <div className='w-1/6'>

                        <div className=''>
                            <label className='label'>Mois : </label>
                        </div>

                        <div className='flex-1'>
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
                    <div className='w-1/6'>

                        <div className=''>
                            <label className='label'>Exercice : </label>
                        </div>

                        <div className=''>

                            <select className='bg-white w-full p-2 rounded-sm shadow border border-gray-300' value={exercice} onChange={(e) => setExercice(e.target.value)}>
                                <option value="">------</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                            </select>
 
                        </div>
                    </div>


                    {/* Bouton */}
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

        <div className="flex gap-4 items-center justify-center w-full h-120 py-4">

            <div className='w-1/3 h-full border-r border-gray-300 p-4'>
                <textarea className={ description == "La balance est equilibrée" ? 'textarea has-text-succes' : description.includes("La balance n'est pas equilibrée") ? 'textarea has-text-danger' : 'textarea'} rows={10} value={description} onChange={() => {}}>
                    {/* {description} */}
                </textarea>

                {
                    description.includes("La balance n'est pas equilibrée") ?
                        <div className="my-4 h-20 w-full">
                            <button className='bg-red-300 border border-red-400 py-2 px-4 cursor-pointer rounded-sm duration-200 ease-in-out hover:bg-red-400' onClick={envoyer_anomalie}>Considerée comme anomalie</button>
                        </div>
                    : null
                }


            </div>


            <div className='flex-1 p-4'>
                {
                    data ?
                        data.length > 0 ?
                            <>
                            
                                <p className='text-center py-4 text-lg'>Analyse : Equilibre balance</p>

                                <table className="table is-fullwidth rounded-lg shadow-sm">
                                    <tbody>

                                        <tr className={ dataMap['BE_D'] != dataMap['BE_C'] ? 'bg-yellow-200' :'' }>
                                            <td>
                                                <p>BE_D</p>
                                                <p className='mx-4'>
                                                    Montant : 
                                                    <strong className='mx-1 text-xl'>
                                                        { formatNombreAvecEspaces(dataMap['BE_D'] || 0) } Ar
                                                    </strong>
                                                </p>
                                            </td>
                                            <td>
                                                <p>BE_C</p>
                                                <p className='mx-4'>
                                                    Montant : 
                                                    <strong className='mx-1 text-xl'>
                                                        { formatNombreAvecEspaces(dataMap['BE_C']) || 0 } Ar
                                                    </strong>
                                                </p>
                                            </td>
                                        </tr>

                                        <tr className={ dataMap['OG_D'] != dataMap['OG_C'] ? 'bg-yellow-200' :'' }>
                                            <td>
                                                <p>OG_D</p>
                                                <p className='mx-4'>
                                                    Montant : 
                                                    <strong className='mx-1 text-xl'>
                                                        { formatNombreAvecEspaces(dataMap['OG_D']) || 0} Ar
                                                    </strong>
                                                </p>
                                            </td>
                                            <td>
                                                <p>OG_C</p>
                                                <p className='mx-4'>
                                                    Montant : 
                                                    <strong className='mx-1 text-xl'>
                                                        { formatNombreAvecEspaces(dataMap['OG_C']) || 0} Ar
                                                    </strong>
                                                </p>
                                            </td>
                                        </tr>

                                        <tr className={ dataMap['TOT_D'] != dataMap['TOT_C'] ? 'bg-yellow-200' :'' }>
                                            <td>
                                                <p>TOT_D</p>
                                                <p className='mx-4'>
                                                    Montant : 
                                                    <strong className='mx-1 text-xl'>
                                                        { formatNombreAvecEspaces(dataMap['TOT_D']) || 0 } Ar
                                                    </strong>
                                                </p>
                                            </td>
                                            <td>
                                                <p>TOT_C</p>
                                                <p className='mx-4'>
                                                    Montant :
                                                    <strong className='mx-1 text-xl'>
                                                        { formatNombreAvecEspaces(dataMap['TOT_C']) || 0 } Ar
                                                    </strong>
                                                </p>
                                            </td>
                                        </tr>

                                        <tr className={ dataMap['SLD_D'] != dataMap['SLD_C'] ? 'bg-yellow-200' :'' }>
                                            <td>
                                                <p>SLD_D</p>
                                                <p className='mx-4'>
                                                    Montant :
                                                    <strong className='mx-1 text-xl'>
                                                        { formatNombreAvecEspaces(dataMap['SLD_D']) || 0 } Ar
                                                    </strong>
                                                </p>
                                            </td>
                                            <td>
                                                <p>SLD_C</p>
                                                <p className='mx-4'>
                                                    Montant :
                                                    <strong className='mx-1 text-xl'>
                                                        { formatNombreAvecEspaces(dataMap['SLD_C']) || 0 } Ar
                                                    </strong>
                                                </p>
                                            </td>
                                        </tr>

                                        <tr className={ dataMap['OFG_D'] != dataMap['OFG_C'] ? 'bg-yellow-200' :'' }>
                                            <td>
                                                <p>OFG_D</p>
                                                <p className='mx-4'>
                                                    Montant :
                                                    <strong className='mx-1 text-xl'>
                                                        { formatNombreAvecEspaces(dataMap['OFG_D']) || 0} Ar
                                                    </strong>
                                                </p>
                                            </td>
                                            <td>
                                                <p>OFG_C</p>
                                                <p className='mx-4'>
                                                    Montant :
                                                    <strong className='mx-1 text-xl'>
                                                        { formatNombreAvecEspaces(dataMap['OFG_C']) || 0 } Ar
                                                    </strong>
                                                </p>
                                            </td>
                                        </tr>

                                        <tr className={ dataMap['BS_D'] != dataMap['BS_C'] ? 'bg-yellow-200' :'' }>
                                            <td>
                                                <p>BS_D</p>
                                                <p className='mx-4'>
                                                    Montant :
                                                    <strong className='mx-1 text-xl'>
                                                        { formatNombreAvecEspaces(dataMap['BS_D']) || 0 } Ar
                                                    </strong>
                                                </p>
                                            </td>
                                            <td>
                                                <p>BS_C</p>
                                                <p className='mx-4'>
                                                    Montant :
                                                    <strong className='mx-1 text-xl'>
                                                        { formatNombreAvecEspaces(dataMap['BS_C']) || 0 } Ar
                                                    </strong>
                                                </p>
                                            </td>
                                        </tr>

                                        
                                    </tbody>
                                </table>
                            
                            </>
                        : 

                            <p className='text-center text-2xl font-bold'>
                                <span className='mx-2 text-3xl'>
                                    <i className="fas fa-times-circle text-yellow-400"></i>
                                </span>
                                Aucune donnée à analyser
                            </p>
                    :   
                    <>
                            
                        <p className='text-center py-4 text-lg'>Analyse : Equilibre balance</p>

                        <table className="table is-fullwidth rounded-lg shadow-sm">
                            <tbody>

                                <tr className={ dataMap['BE_D'] != dataMap['BE_C'] ? 'bg-yellow-200' :'' }>

                                    <td>
                                        <p>BE_D</p>
                                        <p className='mx-4'>
                                            Montant : 
                                            <strong className='mx-1 text-xl'>
                                                0 Ar
                                            </strong>
                                        </p>
                                    </td>

                                    <td>
                                        <p>BE_C</p>
                                        <p className='mx-4'>
                                            Montant : 
                                            <strong className='mx-1 text-xl'>
                                                0 Ar
                                            </strong>
                                        </p>
                                    </td>
                                </tr>

                                <tr className={ dataMap['OG_D'] != dataMap['OG_C'] ? 'bg-yellow-200' :'' }>
                                    <td>
                                        <p>OG_D</p>
                                        <p className='mx-4'>
                                            Montant : 
                                            <strong className='mx-1 text-xl'>
                                                0 Ar
                                            </strong>
                                        </p>
                                    </td>
                                    <td>
                                        <p>OG_C</p>
                                        <p className='mx-4'>
                                            Montant : 
                                            <strong className='mx-1 text-xl'>
                                                0 Ar
                                            </strong>
                                        </p>
                                    </td>
                                </tr>

                                <tr className={ dataMap['TOT_D'] != dataMap['TOT_C'] ? 'bg-yellow-200' :'' }>
                                    <td>
                                        <p>TOT_D</p>
                                        <p className='mx-4'>
                                            Montant : 
                                            <strong className='mx-1 text-xl'>
                                                0 Ar
                                            </strong>
                                        </p>
                                    </td>
                                    <td>
                                        <p>TOT_C</p>
                                        <p className='mx-4'>
                                            Montant :
                                            <strong className='mx-1 text-xl'>
                                                0 Ar
                                            </strong>
                                        </p>
                                    </td>
                                </tr>

                                <tr className={ dataMap['SLD_D'] != dataMap['SLD_C'] ? 'bg-yellow-200' :'' }>
                                    <td>
                                        <p>SLD_D</p>
                                        <p className='mx-4'>
                                            Montant :
                                            <strong className='mx-1 text-xl'>
                                                0 Ar
                                            </strong>
                                        </p>
                                    </td>
                                    <td>
                                        <p>SLD_C</p>
                                        <p className='mx-4'>
                                            Montant :
                                            <strong className='mx-1 text-xl'>
                                                0 Ar
                                            </strong>
                                        </p>
                                    </td>
                                </tr>

                                <tr className={ dataMap['OFG_D'] != dataMap['OFG_C'] ? 'bg-yellow-200' :'' }>
                                    <td>
                                        <p>OFG_D</p>
                                        <p className='mx-4'>
                                            Montant :
                                            <strong className='mx-1 text-xl'>
                                                0 Ar
                                            </strong>
                                        </p>
                                    </td>
                                    <td>
                                        <p>OFG_C</p>
                                        <p className='mx-4'>
                                            Montant :
                                            <strong className='mx-1 text-xl'>
                                                0 Ar
                                            </strong>
                                        </p>
                                    </td>
                                </tr>

                                <tr className={ dataMap['BS_D'] != dataMap['BS_C'] ? 'bg-yellow-200' :'' }>
                                    <td>
                                        <p>BS_D</p>
                                        <p className='mx-4'>
                                            Montant :
                                            <strong className='mx-1 text-xl'>
                                                0 Ar
                                            </strong>
                                        </p>
                                    </td>
                                    <td>
                                        <p>BS_C</p>
                                        <p className='mx-4'>
                                            Montant :
                                            <strong className='mx-1 text-xl'>
                                                0 Ar
                                            </strong>
                                        </p>
                                    </td>
                                </tr>

                                
                            </tbody>
                        </table>
                
                    </>

                }


            </div>
        </div>


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
