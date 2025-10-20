import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch';
import { API_URL } from '../../Config';
import { paginateData } from '../../functions/Function';
import Pagination from '../../Composants/Pagination/Pagination';

export default function Liste() {
    const navigate = useNavigate();

    const [refresh, setRefresh] = useState(true);

    const [data_paginate, setDataPaginate] = useState(null);
    const [reload_data, setReloadData] = useState(false);


    const {data: liste} = useFetch(`${API_URL}/data/piece_compte/lister`, 'get', {}, refresh);

    const currentPage = useRef(1);
    const itemsPerPage = useRef(6);

    useEffect(() => {
        if(liste){
            paginateData(currentPage.current, itemsPerPage.current, liste, setDataPaginate);
        }
        console.log('parent', currentPage.current);
    }, [liste, reload_data])


    const ListeItem = ({item}) => {
        return (
            <tr>
                <td>{item['piece__nom_piece']}</td>
                <td>{item['compte__numero']}</td>
                <td>{item['nature']}</td>
                <td>{item['created_at']}</td>
                <td>{item['updated_at']}</td>
                <td className='w-60'>
                    <button className='button is-success is-small mx-1'>
                        <span className='mx-1'>
                            <i className='fas fa-edit'></i>
                        </span>
                        Modifier
                    </button>
                    <button className='button is-danger is-small mx-1'>
                        <span className='mx-1'>
                            <i className='fas fa-trash'></i>
                        </span>
                        Supprimer
                    </button>
                </td>
            </tr>
        )
    }


  return (
    <section id='liste'>
        <div className='container-liste w-5/6 mx-auto mt-5'>

            <button className='bg-orange-400 px-6 py-2 rounded-sm cursor-pointer text-white durtion-200 ease-in-out hover:bg-orange-500 my-2' onClick={() => navigate('/main/compte_piece')}>
                Créer une liaison
            </button>

            <div className='container-title'>
                <p className='px-2 py-4 bg-gray-300 text-lg my-2 rounded-xs'>Liste des liaisons entre pièces et comptes</p>
            </div>

            <table className='table w-full'>

                <thead>
                    <tr>
                        <th>Pièce</th>
                        <th>Numéro de compte</th>
                        <th>Nature</th>
                        <th>Date d'enregistrement</th>
                        <th>Date de modification</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        data_paginate && data_paginate.map((item, index) => (
                            <ListeItem key={index} item={item} />
                        ))
                    }
                </tbody>
            </table>

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} liste={liste} setItem={setDataPaginate} reload={reload_data} setReload={setReloadData}/>

        </div>
    </section>
  )
}
