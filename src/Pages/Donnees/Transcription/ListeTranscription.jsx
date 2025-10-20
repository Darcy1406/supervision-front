import React, { useEffect, useRef, useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { API_URL } from '../../../Config'
import { useUserStore } from '../../../store/useUserStore';
import { formatNumber, month_int_to_string, paginateData } from '../../../functions/Function';
import { sendData } from '../../../functions/sendData';
import Pagination from '../../../Composants/Pagination/Pagination.jsx'

export function ListeTranscription() {
    const user = useUserStore((state) => state.user);

    const [refresh, setRefresh] = useState(true);

    const [documents, setDocuments] = useState(null);

    const [transcription, setTranscription] = useState(null);
    const [transcription_paginate, setTranscriptionPaginate] = useState(null);
    const [reload_data, setReloadData] = useState(false);

    const [selected, setSelected] = useState(null);

    const recherche = useRef({
        'piece': '',
        'poste_comptable': '',
        'date': '',
        'mois': '',
        'exercice': '',
    })


    const handleChange = (item, value) => {
        // setRecherche(prev => ({
        //   ...prev,
        //   [item]: value,
        // }));
    }


    const {data} = useFetch(`${API_URL}/data/document/liste`, 'get', {}, refresh)


    const {data: pieces} = useFetch(`${API_URL}/data/piece/get_pieces`, 'get', {}, refresh);


    const {data: poste_comptables} = useFetch(`${API_URL}/users/poste_comptable/all`, 'post', {'action': 'afficher_tous_les_postes_comptables', 'user_id': user['id']}, refresh)


    const put_data_in_documents = (data) => {
        setDocuments(data);
    }


    const search_execute = (item, value) => {

        recherche.current[item] = value;
        console.log(recherche.current);

        sendData(`${API_URL}/data/document/rechercher`, 'post', {'piece': recherche.current['piece'], 'poste_comptable': recherche.current['poste_comptable'], 'date': recherche.current['date'], 'mois': recherche.current['mois'], 'exercice': recherche.current['exercice'], 'action': 'rechercher_un_document'}, setDocuments);

    }


    const checker_detail_transcription = (piece, poste_comptable, date, exercice, mois, index) => {
        setSelected(index);
        sendData(`${API_URL}/data/transcription/liste`, 'post', {'piece': piece, 'poste_comptable': poste_comptable, 'date': date, 'mois': mois, 'exercice': exercice, 'action': 'voir_detail_transcription'}, setTranscription);
    }


    const ListeItem = ({item, index}) => {
        return (
            <>
                <tr 
                    className='cursor-pointer'  
                    onClick={(e) => checker_detail_transcription(item['piece__nom_piece'], [item['poste_comptable__nom_poste_comptable'], item['poste_comptable__prenom_poste_comptable']], item['date_arrivee'], item['exercice'], item['mois'], index)}
                    onDoubleClick={() => setSelected(null)}
                    style={{
                        backgroundColor: selected === index ? "#d1e7dd" : "white",
                    }}
                >
                    <td>{item['piece__nom_piece']}</td>
                    <td>{item['poste_comptable__nom_poste_comptable'] + " " + item['poste_comptable__prenom_poste_comptable']}</td>
                    <td>{item['nom_fichier']}</td>
                    <td>{item['date_arrivee']}</td>
                    <td>{month_int_to_string(item['mois'])}</td>
                    <td>{item['exercice']}</td>
                </tr>
            </>
        )
    }


    useEffect(() => {
        put_data_in_documents(data);
    }, [data])


    const currentPage = useRef(1);
    const itemsPerPage = useRef(10);


    useEffect(() => {
        if(transcription){
            paginateData(currentPage.current, itemsPerPage.current, transcription, setTranscriptionPaginate);
        }
    }, [transcription, reload_data])


  return (
    <section id='liste-transcription'>
        <div className='w-full flex gap-2'>

            <div className='w-3/4'>

                <p className='text-lg p-4 bg-gray-300'>Liste des transcriptions</p>

                {/* Recherche */}
                <div className='my-2 container-recherche flex items-center justify-center gap-6'>

                    <div>
                        <p className='italic text-lg  font-semibold underline'>Rechercher : </p>
                    </div>

                    <div>
                        <label className='label'>Piece</label>
                        <select className='bg-white p-2 rounded-sm shadow-sm' onChange={(e) => search_execute('piece', e.target.value)}>
                            <option value="" disabled>Pièce</option>
                            {
                                pieces && pieces.map((item, index) => (
                                    <option key={index} value={item['pk']}>{item['fields']['nom_piece']}</option>
                                ))
                            }

                        </select>
                    </div>

                    <div>
                        <label className='label'>Poste comptable</label>
                        <input list='poste_comptable' className='input' onChange={(e) => search_execute('poste_comptable', e.target.value)} placeholder='Poste comptable'/>
                        <datalist id='poste_comptable' className='bg-white p-2 rounded-sm shadow-sm'>
                            <option value="" disabled>Poste comptable</option>
                            {
                                poste_comptables && poste_comptables.map((item, index) => (
                                    <option key={index} value={item['nom_poste_comptable'] + " " + item["prenom_poste_comptable"]} />
                                ))
                            }
                        </datalist>
                    </div>

                    <div>
                        <label className="label">Date d'arrivee</label>

                        <input type="date" className='input' onChange={(e) => { search_execute('date', e.target.value)} }/>

                    </div>

                    <div>
                        <label className="label">Mois</label>
                        <select className='bg-white p-2 rounded-sm shadow-sm' onChange={(e) => search_execute('mois', e.target.value)}>
                            <option value="" disabled>Mois</option>
                            <option value="01">Janvier</option>
                            <option value="02">Février</option>
                            <option value="03">Mars</option>
                            <option value="04">Avril</option>
                            <option value="05">Mai</option>
                            <option value="06">Juin</option>
                            <option value="07">Juillet</option>
                            <option value="08">Août</option>
                            <option value="09">Septembre</option>
                            <option value="10">Octobre</option>
                            <option value="11">Novembre</option>
                            <option value="11">Décembre</option>
                        </select>
                    </div>
                    <div>
                        <label className='label'>Exercice</label>
                        <select className='bg-white p-2 rounded-sm shadow-sm' onChange={(e) => search_execute('exercice', e.target.value)}>
                            <option value="" disabled>Exercice</option>
                            <option value="">2025</option>
                            <option value="">2026</option>
                        </select>
                    </div>
                    


                </div>

                <table className='table is-fullwidth is-hoverable'>
                    <thead>
                        <tr>
                            <th>Pièce</th>
                            <th>Poste comptable</th>
                            <th>Document</th>
                            <th>Date</th>
                            <th>Mois</th>
                            <th>Année</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            documents && documents.map((item, index) => (
                                <ListeItem key={index} index={index} item={item}/>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {/* Detail des transcriptions */}
            <div className='w-1/4 py-2 px-4 bg-white rounded-lg shadow-xl'>
                {
                    transcription_paginate && selected != null ?

                        transcription_paginate.map((item, index) => (
                            <div key={index} className='p-2'>
                                {
                                    
                                    item['numero_compte'] ?
                                        <p className='text-lg'><strong>{item['numero_compte']}</strong>, <strong>{item['nature']}:</strong> <strong>{formatNumber(item['montant']) || 0} Ar</strong></p>
                                    : <p className='text-lg'><strong>{item['nature']}:</strong> <strong>{formatNumber(item['montant'])} Ar</strong></p>
                                }
                            </div>
                        ))
                        
                    : <p>Aucune information</p>
                }

                {
                    transcription  && transcription.length > itemsPerPage.current ?
                        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} liste={transcription} reload={reload_data} setReload={setReloadData}/>
                    : null
                }

            </div>
        </div>
    </section>
  )
}
