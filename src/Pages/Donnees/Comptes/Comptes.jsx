import { useEffect, useRef, useState } from 'react'
import { fetchData } from '../../../functions/fetchData.js';
import { API_URL } from '../../../Config';
import { FormCompte } from './FormCompte.jsx';
import { Checkbox } from '../../../Composants/Form/Checkbox'
import { paginateData } from '../../../functions/Function';
import Pagination from '../../../Composants/Pagination/Pagination.jsx';
import Modal from '../../../Composants/Modal/Modal.jsx';
import { Alert } from '../../../Composants/Alert/Alert.jsx';
import Confirmation from '../../../Composants/Confirmation/Confirmation.jsx';

export default function Comptes() {

  const [isVisible, setIsVisible] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const [isRegroupements, setIsRegroupements] = useState(true);
  const [isOperations, setIsOperations] = useState(true);
  const [isSynthese, setIsSynthese] = useState(true);

  const [data_update, setDataUpdate] = useState([]);
  const [comptes, setComptes] = useState(null);
  const [comptes_copie, setComptesCopie] = useState(null);
  const [id_compte, setIdCompte] = useState("")

  const [data_paginate, setDataPaginate] = useState(null);
  const [reload_data, setReloadData] = useState(false);

  const [result, setResult] = useState(null);

  const [isDelete, setIsDelete] = useState(false)


  const currentPage = useRef(1)
  const itemsPerPage = useRef(4)


  const get_data_update = (data) => {
    setDataUpdate(data);
    setIsVisible(true);
  }


  const recuperer_tous_les_comptes = (setState) => {
    fetchData(`${API_URL}/data/compte/get_comptes`, 'post', {'action': 'lister_tous_les_comptes'}, setState)
  }


  const compte_regroupements = "";
  const loading = ""


  // Filtrer l'affichage des comptes
  const filter_comptes = () => {
    if(comptes && comptes_copie){
      const filter = comptes_copie.filter(item => {
        if(item['type'] == 'Regroupement' && !isRegroupements){
          return false;
        }
        if(item['type'] == 'Opération' && !isOperations){
          return false;
        }
        if(item['type'] == 'Synthèse' && !isSynthese){
          return false;
        }
        return true;
      });
      currentPage.current = 1;
      setComptes(filter);
    }
  }


   // Rechercher un poste comptable
   const rechercher_compte = (value) => {

    const filter = comptes_copie.filter(item => {
      if(item['type'] == 'Regroupement' && !isRegroupements){
        return false;
      }
      if(item['type'] == 'Opération' && !isOperations){
        return false;
      }
      if(item['type'] == 'Synthèse' && !isSynthese){
        return false;
      }
      if(!item['numero'].includes(value)){
        return false
      }
      return true;
    });
      
    currentPage.current = 1
    setComptes(filter)
  }


  // Cette fonction va afficher la fenetre modale de confirmation
  const confirmation_suppresion = (id) => {
    setIdCompte(id);
    setIsDelete(true);
    setIsVisible(true);
}



  // Cette fonction va demander de supprimer un compte
  const supprimer_un_compte = () => {
    fetchData(
        `${API_URL}/data/compte/delete`, 
        'delete', 
        {
          'id': id_compte
        },
        setResult
    )
    setIsDelete(false)
    setIsVisible(false)
}



  function CompteItem({item}){
    return(
      <tr className={ item['type'] == 'Regroupements' ? 'cursor-pointer' : null }>
        <td>{item['numero']}</td>
        <td>{item['libelle']}</td>
        <td>
          <span className={ item['type'] == 'Regroupement' ? 'bg-gray-300 px-2 rounded-xl text-blue-600 border border-gray-400' : item['type'] == 'Opération' ? 'bg-gray-300 px-2 rounded-xl text-yellow-600 border border-gray-400' : 'bg-gray-300 px-2 rounded-xl text-pink-600 border border-gray-400' }>
            {item['type']}
          </span>
        </td>
        <td>{item['proprietaire__nom_proprietaire']}</td>
        <td>{item['created_at']}</td>
        <td>

          <div className='flex gap-2'>

            <button className="button is-success is-small" onClick={() => get_data_update([{'id': item['id'], 'classe': item['classe'], 'rubrique': item['rubrique'], 'poste': item['poste'], 'numero': item['numero'], 'libelle': item['libelle'], 'acte_reglementaire': item['acte_reglementaire'], 'solde_en_cours_exo': item['solde_en_cours_exo'], 'solde_fin_gest': item['solde_fin_gest'], 'type': item['type'], 'proprietaire': item['proprietaire_id']}])}>
              Modifier
            </button>

            <button className='button is-danger is-small' onClick={() => confirmation_suppresion(item['id'])}>
              Suprrimer
            </button>

          </div>

        </td>
      </tr>

    )
  }


  useEffect(() => {
    recuperer_tous_les_comptes(setComptes)
    recuperer_tous_les_comptes(setComptesCopie)
  }, [])


  useEffect(() => {
    if(result){
      if(result['succes']){
        recuperer_tous_les_comptes(setComptes)
        recuperer_tous_les_comptes(setComptesCopie)
      }
    }
  }, [result])



  // Executer la fonction pour paginer les donnees au moment du rendu (dependances : comptes, reload_data)
  useEffect(() => {
    if(comptes){
        paginateData(currentPage.current, itemsPerPage.current, comptes, setDataPaginate);
    }
}, [comptes, reload_data])


  useEffect(()=> {
    filter_comptes();
  }, [isRegroupements, isOperations, isSynthese])


  return (
    <div id='compte'>

      <button className='mx-6 mt-2 bg-black px-4 py-2 text-white cursor-pointer rounded-lg ' onClick={() => setIsVisible(true)}>
            <span className='icon'>
              <i className='fas fa-plus'></i>
            </span>
              Ajouter un compte
      </button>

      <div className="container-table px-2 w-full mx-auto my-2">

        <p className='text-2xl font-semibold bg-gray-100 p-4'>Liste des comptes</p>

        <div className='container-recherche flex justify-center items-center gap-4 w-1/3 my-2'>
          <div>
            <label className='label'>Rechercher : </label>
          </div>
          <div className='flex-1'>
            <input type="text" className="input" placeholder='Entrer le numero du compte' onChange={(e) => rechercher_compte(e.target.value)} />
          </div>
        </div>

        <div className='my-2'>
          
          <div className='container-show-item w-4/6 is-pulled-right'>
            <div className='inline float-right'>

              <Checkbox label='Regroupements' isChecked={isRegroupements} setIschecked={setIsRegroupements}/>

              <Checkbox label='Opérations'  isChecked={isOperations} setIschecked={setIsOperations}/>

              <Checkbox label='Synthèse' isChecked={isSynthese} setIschecked={setIsSynthese}/>
            </div>
          </div>

        </div>

        <table className='table is-fullwidth is-hoverable'>

          <thead>
            <tr>
              <th>Compte</th>
              <th>Libellé</th>
              <th>Type</th>
              <th>Propriétaire</th>
              <th>Date de création</th>
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
              data_paginate && data_paginate.map((item, index) => (
                  <CompteItem item={item} key={index}/>
                ))
            }
          </tbody>

        </table>

        {
          comptes?.length > itemsPerPage.current ?
          <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} liste={comptes} reload={reload_data} setReload={setReloadData} description='Page'/>
          : null
        }

      </div>

      {/* Mesage d'alert */}
      {
        result ?
          result['succes'] ?
          <Alert message={result['succes']} setMessage={setResult} icon='fas fa-check-circle' bgColor='bg-green-300' borderColor='border-green-400'/>
          : 
            <Alert message={result['error']} setMessage={setResult} icon='fas fa-exclamation-triangle' bgColor='bg-red-300' borderColor='border-red-400'/>
        : null
      } 


      {
        isDelete ?
          <Modal isVisible={isVisible} setIsvisible={setIsVisible} width_children='w-1/3'>
            <Confirmation supprimer={supprimer_un_compte} setIsvisible={setIsVisible}/>
          </Modal>
        :
          <Modal isVisible={isVisible} setIsvisible={setIsVisible} width_children='w-1/2'>

            <FormCompte isVisible={isVisible} setIsVisible={setIsVisible} refresh={refresh} setRefresh={setRefresh} data={data_update} setData={setDataUpdate} setResult={setResult} result={result}/>
            
          </Modal>
      }



    </div>
  )
}
