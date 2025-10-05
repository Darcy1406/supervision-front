import React, { useEffect, useState } from 'react'
import { AjoutPieces } from './AjoutPieces.jsx';
import { useFetch } from '../../../hooks/useFetch.js'
import { API_URL } from '../../../Config.js';

export default function Pieces() {

    const [isVisible, setIsVisible] = useState(false);
    const [refresh, setRefresh] = useState(true);

    // const [pieces, setPieces] = useState([])
    
    const [data_update, setDataUpdate] = useState([]);
    
    const get_data_update = (data) => {
        setDataUpdate(data);
        setIsVisible(true);
    }
    
   
    const {data: pieces} = useFetch(`${API_URL}/data/piece/get_pieces`, 'get', {}, refresh);
    
    
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


  return (
    <div id='piece'>

        <p className='text-2xl font-semibold bg-gray-100 py-4 px-6'>Liste des pieces comptables</p>

        <div className='container-table w-3/4 mx-auto my-2'>

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
                        pieces && pieces.map((item, index) => (
                            <PieceItem item={item} key={index}/>
                        ))
                    }
                </tbody>

            </table>

        </div>

        <AjoutPieces isVisible={isVisible} setIsvisible={setIsVisible} data={data_update} setData={setDataUpdate} setRefresh={setRefresh} refresh={refresh}/>

    </div>
  )
}

