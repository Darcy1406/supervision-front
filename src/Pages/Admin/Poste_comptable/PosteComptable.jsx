import React, { useEffect, useRef, useState } from 'react'
import { fetchData } from '../../../functions/fetchData'
import { API_URL } from '../../../Config'
import { paginateData } from '../../../functions/Function';
import Pagination from '../../../Composants/Pagination/Pagination';
import { NavLink, useNavigate } from 'react-router-dom';
import { usePosteComptableStore } from '../../../store/usePosteComptableStore';
import Confirmation from '../../../Composants/Confirmation/Confirmation';
import Modal from '../../../Composants/Modal/Modal';
import { Alert } from '../../../Composants/Alert/Alert';

export default function PosteComptable() {
  const navigate = useNavigate()

  const { poste_comptable, setPosteComptable } = usePosteComptableStore();

  const [poste_comptables, setPosteComptables] = useState(null);
  const [donnee_a_filter, setDonneeAFiltrer] = useState(null);
  const [data_paginate, setDataPaginate] = useState(null);
  const [poste_comptable_id, setPosteComptableId] = useState(null)
  const [reload_data, setReloadData] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [result, setResult] = useState(null);


  const [isVisible, setIsvisible] = useState(false); // State utilie pour une confirmation avant suppression

  const currentPage = useRef(1)
  const itemsPerPage = useRef(6)




  // Obtenir depuis l'API tous les postes comptables
  const get_poste_comptables = (setState) => {

    fetchData(`${API_URL}/users/poste_comptable/all`, 'post', {'action': 'recuperer_les_infos_des_postes_comptables'}, setState)

  }



  // Remplir le store (usePosteComptableStore) par les donnees du poste comptable a modifier
  const modifier_un_poste_comptable = (id, code_poste, nom_poste, lieu, poste, responsable, auditeur) => {
    
    const data = {
      'id': id,
      'code_poste': code_poste,
      'nom_poste': nom_poste,
      'lieu': lieu,
      'poste': poste,
      'responsable': responsable,
      'auditeur': auditeur
    }
    setPosteComptable(data)
    navigate('/admin/poste_comptable/form')
  }


  // Affiche la confirmation lorsque l'admin veut supprimer un poste comptable
  const show_confirmation = (id) => {
    setIsvisible(true)
    setPosteComptableId(id)
  }


  // Supprimer un poste comptable
  const supprimer_un_poste_comptable = () => {
    fetchData(
      `${API_URL}/users/poste_comptable/delete`, 
      'delete', 
      {
        'id': poste_comptable_id
      },
      setResult
    )
  }


  // Rechercher un poste comptable
  const rechercher_poste_comptable = (value) => {
    const filter = donnee_a_filter.filter((item) => {
      if(!item['nom_poste'].toLowerCase().includes(value.toLowerCase())){
        return false;
      }
      return true;
    })
    currentPage.current = 1
    setPosteComptables(filter)
  }
  

  // Interface JSX pour afficher les postes comptables
  const PosteComptableItem = ({item}) => {
    return (
      <tr>
        <td>{item['code_poste']}</td>
        <td>{item['nom_poste']}</td>
        {/* <td>{item['lieu']}</td> */}
        <td>{item['poste']}</td>
        <td>{item['responsable']}</td>
        <td>
          <div className="flex gap-2">
            <button className="button is-success is-small" onClick={() => modifier_un_poste_comptable(item['id'], item['code_poste'], item['nom_poste'], item['lieu'], item['poste'], item['responsable'], item['utilisateur_id'])}>
              Modifier
            </button>
            <button className="button is-danger is-small" onClick={() => show_confirmation(item['id'])}>Supprimer</button>
          </div>
        </td>
      </tr>
    )
  }


  // Executer la fonction pour paginer les donnees au moment du rendu (dependances : poste_comptable, reload_data)
  useEffect(() => {
    if(poste_comptables){
        paginateData(currentPage.current, itemsPerPage.current, poste_comptables, setDataPaginate);
    }
  }, [poste_comptables, reload_data])


  // Executer la recuperation de tous les postes comptables au moment du rendu
  useEffect(() => {
    get_poste_comptables(setPosteComptables)
    get_poste_comptables(setDonneeAFiltrer)
  }, [])


  // Executer la recuperation de tous les postes comptables au moment du rendu (dependances : result)
  useEffect(() => {
    if(result){
      if(result['succes']){
        setIsvisible(false)
        get_poste_comptables(setPosteComptables)
        get_poste_comptables(setDonneeAFiltrer)
      }
    }
  }, [result])


  // Titre de l'interface
  useEffect(() => {
    const original_title = document.title
    document.title = 'Poste comptable'
    return () => {
        document.title = original_title
    }
  }, [])

  return (

    <>
      <div id='poste_comptable' className=''>

        <NavLink to='/admin/poste_comptable/form' className='button is-dark mx-6 my-4'>Ajouter un poste Comptable</NavLink>


        <div className="container-table px-6 my-2">

          <p className='text-xl bg-gray-300 p-4 rounded-sm my-2'>Liste des comptables</p>
        
          <div className='container-recherche w-1/3'>
            <label className='label'>Rechercher</label>
            <input type="text" className="input" placeholder='Entrer le nom du poste comptable' onChange={(e) => rechercher_poste_comptable(e.target.value)} />
          </div>

          <table className='table table-view is-fullwidth' style={{background: 'none'}}>

            <thead>
              <tr>
                <th>Code</th>
                <th>Nom</th>
                <th>Poste</th>
                <th>Responsable</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {
                data_paginate ?
                  data_paginate.length > 0 ?
                    data_paginate.map((item, index) => (
                      <PosteComptableItem key={index} item={item}/>
                    ))

                  : <tr>
                    <td colSpan={5}>
                      <p className='text-center'>Aucune donnée à afficher</p>
                    </td>
                  </tr>

                : <tr>
                  <td colSpan={5}>
                    <p className='text-center'>En attente des données</p>
                  </td>
                </tr>
              }
            </tbody>

          </table>

          {
            poste_comptables?.length > itemsPerPage.current ?
              <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} liste={poste_comptables} reload={reload_data} setReload={setReloadData} description='Page'/>
            : null
          }

        </div>

        {
          result ?
              result['succes'] ?
                  <Alert message={result['succes']} setMessage={setResult} icon='fas fa-check-circle' bgColor='bg-green-300' borderColor='border-green-400'/>
              : 
                <Alert message={result['error']} setMessage={setResult} icon='fas fa-exclamation-triangle' bgColor='bg-red-300' borderColor='border-red-400'/>
          : null
        } 

      </div>

      <Modal isVisible={isVisible} setIsvisible={setIsvisible} width_children='w-1/3'>
          <Confirmation supprimer={supprimer_un_poste_comptable} setIsvisible={setIsvisible}/>
      </Modal>

    </>
  )
}
