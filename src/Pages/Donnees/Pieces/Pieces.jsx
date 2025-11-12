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

export default function Pieces() {
    const location = useLocation();

    const [refresh, setRefresh] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [result, setResult] = useState(null);
    
    const [data_update, setDataUpdate] = useState([]);
    
    const get_data_update = (data) => {
        setDataUpdate(data);
        setIsVisible(true);
    }
    
   
    const [data_paginate, setDataPaginate] = useState(null);
    const [reload_data, setReloadData] = useState(false);

    const [pieces, setPieces] = useState(null);


    const currentPage = useRef(1);
    const itemsPerPage = useRef(6);
    
    
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
    
                <td>
                    <div>
                        <button className='button is-small is-success' onClick={() => get_data_update([{'id': item['pk'], 'nom_piece': item['fields']['nom_piece'], 'periode': item['fields']['periode']}])}>
                            <span className='icon mx-1'>
                                <i className='fas fa-edit'></i>
                            </span>
                            Modifier
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


    // useEffect(() => {
    //     console.log(location.pathname.split('/')[3]);
    //     set
    // }, [location.pathname])


  return (
    <div id='piece'>

        <p className='text-2xl font-semibold bg-gray-100 py-4 px-6'>Liste des pieces comptables</p>

        <div className='container-table-pieces w-3/4 mx-auto my-2 h-110'>

            <button className='bg-black px-4 py-2 text-white cursor-pointer rounded-lg my-2' onClick={() => setIsVisible(true)}>
                <span className='icon'>
                    <i className='fas fa-plus'></i>
                </span>
                Ajouter une piece
            </button>

            <table className='table is-fullwidth is-hoverable'>
                <thead>

                    <tr>
                        <th>Nom</th>
                        <th>Periode</th>
                        {/* <th>Liste des postes comptables</th> */}
                        <th>Date de creation</th>
                        <th>Date de modification</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        data_paginate && data_paginate.map((item, index) => (
                            <PieceItem item={item} key={index}/>
                        ))
                    }
                </tbody>

            </table>
            
            {
                pieces && pieces.length > itemsPerPage.current ?
                    <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} liste={pieces} reload={reload_data} setReload={setReloadData} description='Page'/>
                : null
            }

        </div>

        <Modal isVisible={isVisible} setIsvisible={setIsVisible}>
        
            <FormPieces isVisible={isVisible} setIsVisible={setIsVisible} data={data_update} setData={setDataUpdate} setRefresh={setRefresh} refresh={refresh} setMessage={setResult} message={result}/>

        </Modal>


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

