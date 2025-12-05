import React, { useEffect, useRef, useState } from 'react'
import { fetchData } from '../../../functions/fetchData'
import { API_URL } from '../../../Config'
import { useNavigate } from 'react-router-dom';
import { paginateData } from '../../../functions/Function';
import Pagination from '../../../Composants/Pagination/Pagination';
import Modal from '../../../Composants/Modal/Modal';
import Confirmation from '../../../Composants/Confirmation/Confirmation';
import { Alert } from '../../../Composants/Alert/Alert';
import { useDataUserStore } from '../../../store/useDataUserStore';

export default function Utilisateur() {
    const navigate = useNavigate()

    const {data_user, setDataUser} = useDataUserStore()

    const [users, setUsers] = useState([]);
    const [donnee_a_filter, setDonneeAFiltrer] = useState(null);
    const [user_id, setUserId] = useState(null)

    const [data_paginate, setDataPaginate] = useState(null);
    const [reload_data, setReloadData] = useState(false);

    const currentPage = useRef(1)
    const itemsPerPage = useRef(6)

    const [isVisible, setIsvisible] = useState(false); // State utilie pour une confirmation avant suppression

    const [result, setResult] = useState(null);

    // Cette fonction recupere la liste de tous les utilisateurs
    const liste_de_tous_les_utilisateurs = (setState) => {
        fetchData(`${API_URL}/users/liste`, 'post', {'action': 'lister_tous_les_utilisateurs'}, setState)
    }


    // Remplir le store (useDataUserStore) par les donnees a modifier
    const modifier_un_utilisateur = (id, nom, prenom, email, fonction, zone,  authentification) => {
    
        const data = {
          'id': id,
          'nom': nom,
          'prenom': prenom,
          'email': email,
          'fonction': fonction,
          'zone': zone,
          'authentification': authentification,
        }
        setDataUser(data)
        navigate('/admin/utilisateur/form')
    }


    // Cette fonction demande de supprimer un utilisateur
    const supprimer_un_utilisateur = () => {
        fetchData(
          `${API_URL}/users/delete`, 
          'delete', 
          {
            'id': user_id
          },
          setResult
        )
    }


    // Rechercher un utilisateur
    const rechercher_utilisateur = (value) => {
        const filter = donnee_a_filter.filter((item) => {
          if(!(item['nom'] + " " + item['prenom']).toLowerCase().includes(value.toLowerCase())){
            return false;
          }
          return true;
        })
        setUsers(filter)
        currentPage.current = 1
    }


    // Cette fonction va afficher la confirmation avant de lancer la suppression
    const show_confirmation = (id) => {
        setIsvisible(true)
        setUserId(id)
    }


    // Interface JSX pour afficher les utilisateurs
    const UserItem = ({item}) => {
        return (
            <tr>
                <td>{item['nom']}</td>
                <td>{item['prenom']}</td>
                <td>{item['email']}</td>
                <td>{item['fonction']}</td>
                <td>{item['zone__nom_zone']}</td>

                <td className=''>
                    <p className='text-center'>
                        {
                            item['authentification'] ?
                                <span className='text-green-500 text-xl'>
                                    <i className="fas fa-check"></i>
                                </span>
                            : 
                                <span className='text-red-500 text-xl'>
                                    <i className="fas fa-times"></i>
                                </span>
                        }
                    </p>
                </td>

                <td>
                    <div className='flex gap-2'>
                        <button className="button is-success is-small" onClick={() => modifier_un_utilisateur(item['id'], item['nom'], item['prenom'], item['email'], item['fonction'], item['zone_id'], item['authentification'])}>
                            Modifier
                        </button>

                        <button className="button is-danger is-small" onClick={() => show_confirmation(item['id'])}>
                            Supprimer
                        </button>

                    </div>
                </td>

            </tr>
        )
    } 


    // Au rendu du composant charger les donnees utilisateurs
    useEffect(() => {
        liste_de_tous_les_utilisateurs(setUsers)
        liste_de_tous_les_utilisateurs(setDonneeAFiltrer)
    }, [])


    // Executer la fonction pour paginer les donnees au moment du rendu (dependances : users, reload_data)
    useEffect(() => {
        if(users.length > 0){
            paginateData(currentPage.current, itemsPerPage.current, users, setDataPaginate);
        }
    }, [users, reload_data])


    // Executer la recuperation de tous les utilisateurs au moment du rendu (dependances : result)
    useEffect(() => {
        if(result){
          if(result['succes']){
            setIsvisible(false)
            liste_de_tous_les_utilisateurs(setUsers)
            liste_de_tous_les_utilisateurs(setDonneeAFiltrer)
          }
        }
    }, [result])


    // Titre de l'interface
    useEffect(() => {
        const original_title = document.title
        document.title = 'Utilisateur'
        return () => {
            document.title = original_title
        }
    }, [])


  return (
    <>
        <div id='utilisateur_liste'>

            <button className='button is-dark mx-6 my-4' onClick={() => navigate('/admin/utilisateur/form')}>Ajouter un utilisateur</button>

            <div className="container-table px-6">

                <p className='text-xl bg-gray-300 p-4 rounded-sm my-2'>Liste des utilisateurs du système</p>

                <div className='container-recherche w-1/3 my-2'>
                    <label className='label'>Rechercher</label>
                    <input type="text" className="input" placeholder="Entrer le nom ou le prenom de l'utilisateur" onChange={(e) => rechercher_utilisateur(e.target.value)} />
                </div>

                <table className="table table-view is-fullwidth">

                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Email</th>
                            <th>Fonction</th>
                            <th>Zone</th>
                            <th>Peut s'authentifier ?</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            data_paginate ? 

                                data_paginate.length > 0 ?

                                    data_paginate.map((item, index) => (
                                        <UserItem key={index} item={item}/>
                                    ))

                                : <tr>
                                    <td colSpan={7}>
                                        <p className="text-center">
                                            Aucune donnée à afficher
                                        </p>
                                    </td>
                                </tr>

                            : <tr>
                                <td colSpan={7}>
                                    <p className='text-center'>
                                        En attente des données
                                    </p>
                                </td>
                            </tr>
                        }
                    </tbody>

                </table>

                {
                    users?.length > itemsPerPage.current ?
                    <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} liste={users} reload={reload_data} setReload={setReloadData} description='Page'/>
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

        </div>

        <Modal isVisible={isVisible} setIsvisible={setIsvisible} width_children='w-1/3'>
        <Confirmation supprimer={supprimer_un_utilisateur} setIsvisible={setIsvisible}/>
        </Modal>

    </>
  )
}
