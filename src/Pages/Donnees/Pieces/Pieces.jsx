import { useEffect, useRef, useState } from 'react'
import { FormPieces } from './FormPieces.jsx';
import { fetchData } from '../../../functions/fetchData.js'
import { API_URL } from '../../../Config.js';
import { Alert } from '../../../Composants/Alert/Alert.jsx';
import Pagination from '../../../Composants/Pagination/Pagination.jsx';
import { paginateData } from '../../../functions/Function.js';
import Modal from '../../../Composants/Modal/Modal.jsx'
import './Pieces.css';
import { useLocation } from 'react-router-dom';
import Confirmation from '../../../Composants/Confirmation/Confirmation.jsx';

export default function Pieces() {
    const location = useLocation()

    const [refresh, setRefresh] = useState(true)
    const [isVisible, setIsvisible] = useState(false) // Statut utilise pour le modale
    const [isDelete, setIsDelete] = useState(false)
    const [id_piece, setIdPiece] = useState(false)
    const [result, setResult] = useState(null)
    
    const [data_update, setDataUpdate] = useState([]);
    
    const get_data_update = (data) => {
        setDataUpdate(data);
        setIsvisible(true);
    }
    
   
    const [data_paginate, setDataPaginate] = useState(null);
    const [reload_data, setReloadData] = useState(false);

    const [pieces, setPieces] = useState(null);


    const currentPage = useRef(1);
    const itemsPerPage = useRef(6);


    // Cette fonction va afficher la fenetre modale de confirmation
    const confirmation_suppresion = (id) => {
        setIdPiece(id);
        setIsDelete(true);
        setIsvisible(true);
    }


    // Cette fonction va demander de supprimer une piece
    const supprimer_une_piece = () => {
        fetchData(
            `${API_URL}/data/piece/delete`, 
            'delete', 
            {
              'id': id_piece
            },
            setResult
        )
        setIsvisible(false)
        setIsDelete(false)
    }

    
    // Interface JSX pour afficher les pieces
    function PieceItem({item}){
        return(
            <tr>
                <td>{ item['fields']['nom_piece'] }</td>
                <td className=''>
                    <span className={ item['fields']['periode'] == 'Journalière' ? 'bg-gray-300 px-2 rounded-2xl text-yellow-600 border border-gray-400' : item['fields']['periode'] == 'Décadaire' ? 'bg-gray-300 px-2 rounded-2xl text-pink-600 border border-gray-400' : 'bg-gray-300 px-2 rounded-2xl text-blue-600 border border-gray-400' }>
                        {item['fields']['periode']}
                    </span>
                </td>
                {/* <td>P1, P2, P3, P4</td> */}
                <td>{item['fields']['created_at']}</td>
                <td>{item['fields']['updated_at']}</td>
    
                <td className='w-60'>
                    <div className='flex gap-2'>

                        <button className='button is-small is-success' onClick={() => get_data_update([{'id': item['pk'], 'nom_piece': item['fields']['nom_piece'], 'periode': item['fields']['periode']}])}>
                            <span className='icon mx-1'>
                                <i className='fas fa-edit'></i>
                            </span>
                            Modifier
                        </button>

                        <button className='button is-danger is-small' onClick={() => confirmation_suppresion(item['pk'])}>
                            <span className='icon mx-1'>
                                <i className='fas fa-trash-alt'></i>
                            </span>
                            Supprimer
                        </button>

                    </div>
                </td>
            </tr>
        )
    }
    


    useEffect(() => {
        fetchData(`${API_URL}/data/piece/get_pieces`, 'get', {}, setPieces);
    }, [refresh])


    useEffect(() => {
        if(pieces){
            paginateData(currentPage.current, itemsPerPage.current, pieces, setDataPaginate);
        }
    }, [pieces, reload_data])


    useEffect(() => {
        if(result){
            if(result['succes']){
                setRefresh(!refresh)
            }
        }
    }, [result])


  return (
    <div id='piece' className='h-full p-1'>

        <div className='container-table-pieces p-1 my-2 bg-white rounded-sm shadow-sm'>
            
            <div className='flex items-center bg-white py-2 px-4 border-b border-gray-200'>

                <p className='flex-1 text-xl font-semibold'>Liste des pieces comptables</p>

                <button className=' button is-link bg-black text-white cursor-pointer p-2 rounded-sm my-2' onClick={() => setIsvisible(true)}>
                    <span className='icone mx-1'>
                        <i className='fas fa-plus'></i>
                    </span>
                    Ajouter une pièce
                </button>

            </div>



            <table className='table is-hoverable is-fullwidth is-marginless border-b border-gray-200'>
                <thead>

                    <tr>
                        <th>Nom</th>
                        <th>Periode</th>
                        <th>Date de creation</th>
                        <th>Date de modification</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        
                        data_paginate ?

                            data_paginate.length > 0 ?

                                data_paginate.map((item, index) => (
                                    <PieceItem item={item} key={index}/>
                                ))

                            : <tr>
                                <td colSpan={5}>
                                    <p className='text-center'>Aucune donnée à afficher</p>
                                </td>
                            </tr>

                        : <tr>
                            <td colSpan={5}>
                            <p className='text-center'>En attente des données ...</p>
                            </td>
                        </tr>

                    }
                </tbody>

            </table>
            
            {
                pieces && pieces.length > 0 ?
                    <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} liste={pieces} reload={reload_data} setReload={setReloadData} description='Page'/>
                : null
            }

        </div>

        {
            isDelete ?
                <Modal isVisible={isVisible} setIsvisible={setIsvisible} width_children='w-1/3'>
                    <Confirmation supprimer={supprimer_une_piece} setIsvisible={setIsvisible}/>
                </Modal>
            :
                <Modal isVisible={isVisible} setIsvisible={setIsvisible}>
                
                    <FormPieces isVisible={isVisible} setIsVisible={setIsvisible} data={data_update} setData={setDataUpdate} setRefresh={setRefresh} refresh={refresh} setMessage={setResult} message={result}/>

                </Modal>
        }





        {
            result ?
                result['succes'] ?
                    <Alert message={result['succes']} setMessage={setResult} icon='fas fa-check-circle' bgColor='bg-green-300' borderColor='border-green-400' />
                : null
            : null
        }

    </div>
  )
}

