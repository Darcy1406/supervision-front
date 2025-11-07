import React, { useEffect, useState } from 'react'
import { fetchData } from '../../../functions/fetchData';
import { API_URL } from '../../../Config';
import { useUserStore } from '../../../store/useUserStore';

export default function SoldeCaisse() {
    const user = useUserStore((state) => state.user);

    const [postes_comptables, setPostesComptables] = useState(null);
    const [poste_choisi, setPosteChoisi] = useState("");
    const [piece, setPiece] = useState("");
    const [mois, setMois] = useState("");
    const [exercice, setExercice] = useState("");

    const [data, setData] = useState(null); // Va stocker les donnees a analyser


    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData(`${API_URL}/data/analyse/solde_caisse`, 'post', {'action': 'verfication_solde_caisse', 'poste_comptable': poste_choisi, 'exercice': exercice, 'mois': mois}, setData)
    }


    useEffect(() => {
        fetchData(`${API_URL}/users/poste_comptable/get`, 'POST', {"utilisateur_id": user[0]['id'], "piece": 'SJE', 'action': 'afficher_les_postes_comptables_specifique_a_une_piece'}, setPostesComptables)
    }, [])


  return (
    <div id='solde_caisse'>
        <p className='text-center my-4 text-2xl'>Verification du solde de caisse</p>

        <div className="bloc-form">
            <form onSubmit={handleSubmit}>
                <div className='flex gap-6 my-2 px-6'>

                    <div className='w-3/6 flex items-center justify-center gap-2'>
                        <div className='w-1/3'>
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

                    {/* <div className='w-1/6 flex items-center justify-center gap-2'>
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
                    </div> */}

                    <div className='w-1/6 flex items-center justify-center gap-2'>
                        <div className='w-1/3'>
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

                    <div className='w-2/6 flex items-center justify-center gap-2'>
                        <div className='w-1/3'>
                            <label className='label'>Exercice : </label>
                        </div>
                        <div className='flex-1'>
                            <input type='number' className='input' placeholder='Année' value={exercice} onChange={(e) => setExercice(e.target.value)} required/>
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


        <div className='container-verification mt-4 px-6 py-4'>

            <div className='p-4 bg-gray-300 mt-4 rounded-lg border border-gray-400'>
                <p className='underline'>Situation Journaliere d'Encaisse : Encaisse du fin du mois</p>
                <p className='my-2'>
                    Montant : 
                    <strong className='mx-1 text-xl'>
                        {(data?.sje[0]['total'] || 0).toLocaleString('fr-FR') } Ar
                    </strong>
                </p>
            </div>
            
            <div className='p-4 bg-gray-300 mt-4 rounded-lg border border-gray-400'>
                <p className='underline'>Solde compte 5310 du mois</p>
                <p className='my-2'>
                    Montant : 
                    <strong className='mx-1 text-xl'>
                        {(data?.balance[0]['total'] || 0).toLocaleString('fr-FR') } Ar
                    </strong>
                </p>
            </div>
        </div>

        {
            data ?
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
        }


    </div>
  )
}
