import React, { useState } from 'react'
import { useFetch } from '../../../hooks/useFetch';
import { API_URL } from '../../../Config';
import { FormCompte } from './FormCompte.jsx';

export default function Comptes() {

  const [isVisible, setIsVisible] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const [data_update, setDataUpdate] = useState([]);

  const get_data_update = (data) => {
    setDataUpdate(data);
    setIsVisible(true);
  }

  const {data: comptes} = useFetch(`${API_URL}/data/compte/get_comptes`, 'get', {}, refresh);

  const {data: compte_regroupements} = useFetch(`${API_URL}/data/compte/get_comptes_regroupements`, 'post', {'action': 'get_comptes_regroupements'}, refresh);



  function CompteItem({item}){
    return(
      <tr>
        <td>{item['fields']['numero']}</td>
        <td>{item['fields']['libelle']}</td>
        <td>
          <span className={ item['fields']['type'] == 'Regroupements' ? 'bg-gray-300 px-2 rounded-xl text-blue-600 border border-gray-400' : item['fields']['type'] == 'Opérations' ? 'bg-gray-300 px-2 rounded-xl text-yellow-600 border border-gray-400' : 'bg-gray-300 px-2 rounded-xl text-pink-600 border border-gray-400' }>
            {item['fields']['type']}
          </span>
        </td>
        <td>{item['fields']['created_at']}</td>
        <td>{item['fields']['updated_at']}</td>
        <td>
          <div>
            <button className="button is-success is-small">
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
    <div id='compte'>
      <p className='text-2xl font-semibold bg-gray-100 px-6'>Liste des comptes</p>

      <div className="container-table w-3/4 mx-auto my-2">

        <button className='bg-black px-4 py-2 text-white cursor-pointer rounded-lg my-2' onClick={() => setIsVisible(true)}>
          <span className='icon'>
            <i className='fas fa-plus'></i>
          </span>
            Ajouter un compte
        </button>

        <table className='table is-fullwidth is-hoverable'>

          <thead>
            <tr>
              <th>Numéro de compte</th>
              <th>Libellé</th>
              <th>Type</th>
              <th>Date de création</th>
              <th>Date de modification</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {
              comptes && comptes.map((item, index) => (
                <CompteItem item={item} key={index}/>
              ))
            }
          </tbody>

        </table>

      </div>

      <FormCompte isVisible={isVisible} setIsVisible={setIsVisible} comptes_regroupements={compte_regroupements} refresh={refresh} setRefresh={setRefresh}/>

    </div>
  )
}
