import React, { useEffect, useState } from 'react'
import Modal from '../../../Composants/Modal/Modal';
import Authentification from './Authentification';
import { fetchData } from '../../../functions/fetchData';
import { API_URL } from '../../../Config';
import { Alert } from '../../../Composants/Alert/Alert';
import { useNavigate } from 'react-router-dom';
import { useDataUserStore } from '../../../store/useDataUserStore';

export default function Form() {
    const navigate = useNavigate()

    const data_user = useDataUserStore((state) => state.data_user)
    const clearDataUser = useDataUserStore((state) => state.clearDataUser)

    console.log('data user', data_user);

    const [isVisible, setIsVisible] = useState(false);

    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [fonction, setFonction] = useState("");
    const [email, setEmail] = useState("");
    const [zone_choisi, setZoneChoisi] = useState("");

    const [zones, setZones] = useState(null);

    const [id_user, setIdUser] = useState("");

    const [result, setResult] = useState(null);


    // Envoie du formulaire pour creer/modifier un utilisateur
    const handlesbumit = (e) => {
        e.preventDefault();
        
        if(!data_user){
            fetchData(
                `${API_URL}/users/create_user`,
                'post', 
                {
                    'action': 'ajouter_utilisateur',
                    'nom': nom,
                    'prenom': prenom,
                    'email': email,
                    'fonction': fonction,
                    'zone': zone_choisi
                }, setIdUser)
            setIsVisible(true);
        }
        else{
            fetchData(`${API_URL}/users/update_user`,
                'put', 
                {
                    'action': 'modifier_utilisateur',
                    'id': data_user.id,
                    'nom': nom,
                    'prenom': prenom,
                    'email': email,
                    'fonction': fonction,
                    'zone': zone_choisi
            }, setResult)
        }
    }


    // Vider le formulaire apres envoie
    const reset_form = () => {
        setNom("")
        setPrenom("")
        setFonction("")
        setEmail("")
        setZoneChoisi("")
        setIdUser("")
        clearDataUser()
    }


    // Recuperer la liste de toutes les zones
    const liste_zones = () => {
        fetchData(`${API_URL}/users/zone/get`, 'get', {}, setZones);
    }


    // Mettre comme valeur par defaut aux states les donnees a modifier
    const data_a_modifier = () => {
        if(data_user){
            setNom(data_user.nom)
            setPrenom(data_user.prenom)
            setEmail(data_user.email)
            setFonction(data_user.fonction)
            setZoneChoisi(data_user.zone)
            setIdUser({'user_id': data_user.id})
        }
    }


    // Recuperer toutes les zones existantes
    useEffect(() => {
        liste_zones();

        return () => {
            clearDataUser()
        }

    }, [])


    // Si result n'est pas null et result['succes'] existe on reset() le formulaire
    useEffect(() => {
        if(result){
            if(result['succes']){
                reset_form()
            }
        }
    }, [result])


    // Si data_user n'est pas on donne comme valeurs par defauts aux states ses valeurs
    useEffect(() => {
        if (data_user) {
          data_a_modifier();
        }
    }, [data_user]);


    // Titre de l'interface
    useEffect(() => {
        const original_title = document.title
        document.title = 'Formulaire utilisateur'
        return () => {
            document.title = original_title
        }
    }, [])


  return (
    <div className='form-user w-1/2 p-6 mx-auto h-full border-l border-r border-gray-300'>

        <p className='text-center my-2 text-xl font-semibold'>
            {
                data_user ?
                    'Modifier un utilisateur'
                : 'Créer un nouveau utilisateur'
            }
            
        </p>

        {/* Fomrulaire */}
        <form onSubmit={handlesbumit} className='mx-auto my-2'>

            <button type='button' className='button is-link my-4' onClick={() => navigate('/admin/utilisateur')}>Liste des utilisateurs</button>

            {/* Nom */}
            <div className='field'>
                <div className="control">
                    <label className='label'>Nom</label>
                    <input type="text" name='nom' className="input" placeholder="Entrer le nom de l'utilisateur" value={nom} onChange={(e) => setNom(e.target.value)} required/>
                </div>
            </div>

            {/* Prénom(s) */}
            <div className='field'>
                <div className="control">
                    <label className='label'>Prénom(s)</label>
                    <input type="text" name='prenom' className="input" placeholder="Entrer le prenom de l'utilisateur" value={prenom} onChange={(e) => setPrenom(e.target.value)}/>
                </div>
            </div>

            {/* Email */}
            <div className='field'>
                <div className="control">
                    <label className='label'>Email</label>
                    <input type="email" className="input" placeholder="Entrer l'email de l'utilisateur" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
            </div>

            {/* Fonction de l'utilisateur */}
            <div className='field'>
                <div className="control">
                    <label className='label'>Fonction</label>
                    <select name="fonction" className='w-full bg-white p-2 border border-gray-300 rounded-sm cursor-pointer' value={fonction} onChange={(e) => setFonction(e.target.value)}>
                        <option value="" disabled>Quel est la fonction de l'utilisateur ?</option>
                        <option value="Auditeur">Auditeur</option>
                        <option value="Chef_unite">Chef d'unité</option>
                        <option value="Directeur">Directeur</option>
                    </select>
                </div>
            </div>

            {
                fonction != "" && fonction != 'Directeur' && (

                    <div className="field">
                        <div className="control">
                            <label className="label">Zone</label>
                            <select name="zone" className='w-full bg-white p-2 border border-gray-300 rounded-sm cursor-pointer' value={zone_choisi} onChange={(e) => setZoneChoisi(e.target.value)} required={fonction != "" && fonction != 'Directeur'}>
                                <option value="" disabled>Veuillez choisir une zone</option>
                                {
                                    zones && zones.map((item, index) => (
                                        <option key={index} value={item['id']}>{item['nom_zone']}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                )
            }


            

            <div className="flex gap-4 my-4">
                <div>
                    <button className={`${data_user ? 'bg-yellow-300' : 'bg-blue-300'} px-6 py-2 rounded-lg cursor-pointer duration-150 ease-in-out ${data_user ? 'hover:bg-yellow-400' : 'hover:bg-blue-400'}`}>
                        {
                        data_user ?
                            'Valider'
                            : 'Ajouter'
                        }
                    </button>
                </div>

                {
                    data_user ?
                        !data_user.authentification ?
                            <div>
                                <button type='button' className='button is-dark' onClick={() => setIsVisible(true)}>Créer une authentification pour l'utilisateur</button>
                            </div>
                        : null
                    : null
                }
            </div>


        </form>

        {/* Mesage d'alert */}
        {
            result ?
                result['succes'] ?
                    <Alert message={result['succes']} setMessage={setResult} icon='fas fa-check-circle' bgColor='bg-green-300' borderColor='border-green-400'/>
                : 
                    <Alert message={result['error']} setMessage={setResult} icon='fas fa-times-circle' bgColor='bg-red-300' borderColor='border-red-400'/>
            : null
        }


        {/* Modal avec comme {children} le formulaire pour creer l'authentification de l'utilisateur */}
        <Modal isVisible={isVisible} setIsvisible={setIsVisible} width_children='w-1/2'>
            <Authentification email={email} id_user={id_user} setIsVisible={setIsVisible} setMessage={setResult}/>
        </Modal>

    </div>
  )
}
