import React, { useState } from 'react'
import { fetchData } from '../../../functions/fetchData';
import { API_URL } from '../../../Config';

export default function SoldeCaisse() {

    const [postes_comptables, setPostesComptables] = useState(null);
    const [poste_choisi, setPosteChoisi] = useState("");
    const [piece, setPiece] = useState("");
    const [mois, setMois] = useState("");
    const [exercice, setExercice] = useState("");

    const [data, setData] = useState(null); // Va stocker les donnees a analyser


    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData(`${API_URL}/data/analyse/equilibre_balance`, 'post', {'action': 'analyse_equilibre_balance', 'poste_comptable': poste_choisi, 'piece': piece, 'exercice': exercice, 'mois': mois}, setData)
    }

  return (
    <div id='solde_caisse'>

        <div className="bloc-form">
            <form onSubmit={handleSubmit}>
                <div className='flex gap-6 my-2'>

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

                    <div className='w-1/6 flex items-center justify-center gap-2'>
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

    </div>
  )
}
