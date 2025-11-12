import { useEffect, useState } from 'react'
import { fetchData } from '../../../functions/fetchData.js';
import { API_URL } from '../../../Config';
import { FormCompte } from './FormCompte.jsx';
import { Checkbox } from '../../../Composants/Form/Checkbox'

export default function Comptes() {

  const [isVisible, setIsVisible] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const [isRegroupements, setIsRegroupements] = useState(true);
  const [isOperations, setIsOperations] = useState(true);
  const [isAnalyses, setIsAnalyses] = useState(true);

  const [data_update, setDataUpdate] = useState([]);
  const [comptes, setComptes] = useState([]);


  const get_data_update = (data) => {
    setDataUpdate(data);
    setIsVisible(true);
  }

  // const { data } = useFetch(`${API_URL}/data/compte/get_comptes`, 'get', {}, refresh);
  const data = ""


  // const {data: compte_regroupements, loading} = useFetch(`${API_URL}/data/compte/get_comptes_regroupements`, 'post', {'action': 'get_comptes_regroupements'}, refresh);
  const compte_regroupements = "";
  const loading = ""


  const data_filter_regroupements = () => {
    if(comptes && data){
      const filter = data.filter(item => {
        if(item['fields']['type'] == 'Regroupements' && !isRegroupements){
          return false;
        }
        if(item['fields']['type'] == 'Opérations' && !isOperations){
          return false;
        }
        if(item['fields']['type'] == 'Analyses' && !isAnalyses){
          return false;
        }
        return true;
      });
      setComptes(filter);
    }
  }


  const put_data_in_comptes = (data) => {
    setComptes(data)
  }



  function CompteItem({item}){
    return(
      <tr className={ item['fields']['type'] == 'Regroupements' ? 'cursor-pointer' : null }>
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
            <button className="button is-success is-small" onClick={() => get_data_update([{'id': item['pk'], 'numero': item['fields']['numero'], 'libelle': item['fields']['libelle'], 'type': item['fields']['type'], 'compte_regroupement': item['fields']['compte_regroupement']}])}>
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

  useEffect(()=> {
    put_data_in_comptes(data);
  }, [data])


  useEffect(()=> {
    data_filter_regroupements();
  }, [isRegroupements, isOperations, isAnalyses])


  return (
    <div id='compte'>
      <p className='text-2xl font-semibold bg-gray-100 px-6'>Liste des comptes</p>

      <div className="container-table w-6/7 mx-auto my-2">

        <div className='flex items-center gap-10'>
          <button className='bg-black px-4 py-2 text-white cursor-pointer rounded-lg my-2' onClick={() => setIsVisible(true)}>
            <span className='icon'>
              <i className='fas fa-plus'></i>
            </span>
              Ajouter un compte
          </button>

          <div className='container-show-item w-4/6 is-pulled-right'>
            <div className='inline float-right'>
              <Checkbox label='Regroupements' isChecked={isRegroupements} setIschecked={setIsRegroupements}/>
              <Checkbox label='Opérations'  isChecked={isOperations} setIschecked={setIsOperations}/>
              <Checkbox label='Analyses' isChecked={isAnalyses} setIschecked={setIsAnalyses}/>
            </div>
          </div>
        </div>

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
              loading ?
                <tr>
                  <td className='text-center' colSpan={5}>Aucun donnee trouvee</td>
                </tr>
              :
                comptes && comptes.map((item, index) => (
                  <CompteItem item={item} key={index}/>
                ))
            }
          </tbody>

        </table>

      </div>

      <FormCompte isVisible={isVisible} setIsVisible={setIsVisible} comptes_regroupements={compte_regroupements} refresh={refresh} setRefresh={setRefresh} data={data_update} setData={setDataUpdate}/>

    </div>
  )
}
