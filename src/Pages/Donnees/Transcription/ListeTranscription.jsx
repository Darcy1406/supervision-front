import { useEffect, useRef, useState, version } from 'react';
import { fetchData } from '../../../functions/fetchData.js'
import { API_URL } from '../../../Config'
import { useUserStore } from '../../../store/useUserStore';
import { formatNumber, month_int_to_string, paginateData } from '../../../functions/Function';
import { sendData } from '../../../functions/sendData';
import Pagination from '../../../Composants/Pagination/Pagination.jsx'
import Modal from '../../../Composants/Modal/Modal.jsx';
import TabView from './TabView/TabView.jsx';

export function ListeTranscription() {

    const user = useUserStore((state) => state.user); // Va contenir les informations de l'utilisateur connectee au systeme

    const [refresh, setRefresh] = useState(true);
    const [isVisible, setIsvisible] = useState(false); // State afficher la fenetre modale
    const [piece, setPiece] = useState(""); // Ce state va recuperer le nom de la piece a detailler (transcription_detail)

    const [documents, setDocuments] = useState(null);
    const [documents_a_filter, setDocumentsAFiltrer] = useState(null);
    const [documents_paginate, setDocumentsPaginate] = useState(null);


    const [transcription, setTranscription] = useState(null); // Va stocker les details sur la transcription
    const [reload_data, setReloadData] = useState(false);

    const [selected, setSelected] = useState(null);

    const [detail_titre, setDetailTitre] = useState("")

    const [exercices, setExercices] = useState(null)

    // Va contenir les infos sur les filtres (Poste comptable, .....)
    const recherche = useRef({
        'piece': '',
        'poste_comptable': '',
        'date': '',
        'mois': '',
        'exercice': '',
    })

    const [liste_pieces, setListePieces] = useState(null);

    const [poste_comptables, setPosteComptables] = useState(null);
    const [poste_comptables_copie, setPosteComptablesCopie] = useState(null);

    const [auditeurs, setAuditeurs] = useState(null);
    const [auditeurs_copie, setAuditeursCopie] = useState(null);

    const [zones, setZones] = useState(null); // Va stocker toutes les zones
    const [zone_selected, setZoneSelected] = useState(""); // Va contenir la zone selectionee

    const currentPage = useRef(1);
    const itemsPerPage = useRef(4);


    // Filtrer les documents
    const search_execute = (item, value) => {

        recherche.current[item] = value;
        

        const filter = documents_a_filter.filter(item => {
            if(recherche.current['piece']){
                if( item['piece__nom_piece'] != recherche.current['piece'] ){
                    return false;
                }
            }

            if(recherche.current['poste_comptable']){
                if(item['poste_comptable__nom_poste'] != recherche.current['poste_comptable']){
                    return false;
                }
            }

            if(recherche.current['date']){
                if( item['date_arrivee'] != recherche.current['date'] ){
                    return false;
                }
            }

            if(recherche.current['mois']){
                if( item['mois'] != recherche.current['mois'] ){
                    return false;
                }
            }

            if(recherche.current['exercice']){
                if( item['exercice'] != recherche.current['exercice'] ){
                    return false;
                }
            }
           
            return true;
        });

        setDocuments(filter);
    }


    // Cette fonction va recuperer les transcriptions du document
    const checker_detail_transcription = (version, piece, nom_fichier, poste_comptable, date, exercice, mois, index) => {

        setTranscription(null);
        let texte = '';
     
        setSelected(index);
        setIsvisible(true);
        setPiece(piece);

        if(piece.toUpperCase() == 'SJE'){
            texte += `${piece} du ${nom_fichier.split(', ')[1]} ${poste_comptable}`
        }

        else if(piece.toUpperCase() == 'BAR'){
            const decade = nom_fichier.split(", ")[1];
            texte += `${piece}, ${month_int_to_string(mois)} - ${decade} ${poste_comptable}; ${nom_fichier.split(', ')[2]}`
        }

        else if(piece.toUpperCase() != 'SJE'){
            const decade = nom_fichier.split(", ")[1];
            texte += `${piece}, ${month_int_to_string(mois)} - ${decade} ${poste_comptable}`
        }


        else{
            texte += `${piece} ${poste_comptable}`
        }

        setDetailTitre(texte);

        sendData(`${API_URL}/data/transcription/liste`, 'post', {'piece': piece, 'poste_comptable': poste_comptable, 'date': date, 'mois': mois, 'exercice': exercice, 'version': version, 'action': 'voir_detail_transcription'}, setTranscription);
    }


    const ListeItem = ({item, index}) => {
        return (
            <>
                <tr 
                    className='cursor-pointer'  
                    onClick={(e) => checker_detail_transcription(item['version'], item['piece__nom_piece'], item['nom_fichier'], item['poste_comptable__nom_poste'], item['date_arrivee'], item['exercice'], item['mois'], index)}
                    onDoubleClick={() => setSelected(null)}
                    // style={{
                    //     backgroundColor: selected === index ? "#d1e7dd" : "white",
                    // }}
                >
                    <td>{item['piece__nom_piece']}</td>
                    <td>{item['poste_comptable__nom_poste']}</td>
                    <td>{item['nom_fichier'].split(", ")[0] + ", " + item['nom_fichier'].split(", ")[1]}</td>
                    <td>{item['date_arrivee']}</td>
                    <td>{month_int_to_string(item['mois'].toString())}</td>
                    <td>{item['exercice']}</td>
                </tr>
            </>
        )
    }


    // Cette fonction va recupérer les documents liées a un auditeur (pour un auditeur), les documents liées a une zone (pour les chef d'unités) et tous les documents (pour le directeur ou autres)
    const liste_documents = (setState) => {

        if(user[0]['utilisateur__fonction'].toUpperCase() == 'directeur'.toUpperCase() || user[0]['utilisateur__fonction'].toUpperCase() == 'autres'.toUpperCase()){
            fetchData(
                `${API_URL}/data/document/liste`, 
                'post', 
                {
                    'action': 'listes_documents_directeur', 
                    'fonction': user[0]['utilisateur__fonction'], 
                    'utilisateur': user[0]['id']
                }, 
                setState
            )
        }
        else if(user[0]['utilisateur__fonction'].toUpperCase() == 'chef_unite'.toUpperCase()){
            fetchData(
                `${API_URL}/data/document/liste`, 
                'post', 
                {
                    'action': 'listes_documents_chef_unite', 
                    'zone': user[0]['utilisateur__zone__nom_zone']
                }, 
                setState
            )
        }
        else{
            fetchData(
                `${API_URL}/data/document/liste`, 
                'post', 
                {
                    'action': 'listes_documents_auditeur', 
                    'utilisateur': user[0]['id']
                }, 
                setState
            )
        }

    }


    // Cette fonction va recuperer les postes comptables liées a un auditeur (pour un auditeur), les postes comptables liées a une zone (pour les chef d'unités) et tous les postes comptables (pour le directeur ou autres)
    const liste_poste_comptables = (setState) => {

        if(user[0]['utilisateur__fonction'].toUpperCase() == 'directeur'.toUpperCase() || user[0]['utilisateur__fonction'].toUpperCase() == 'autres'.toUpperCase()){
            fetchData(`${API_URL}/users/poste_comptable/all`, 'post', {'action': 'afficher_tous_les_postes_comptables', 'fonction': user[0]['utilisateur__fonction'],'user_id': user[0]['id']}, setState)
        }
        else if(user[0]['utilisateur__fonction'].toUpperCase() == 'chef_unite'.toUpperCase()){
            fetchData(`${API_URL}/users/poste_comptable/all`, 'post', {'action': 'afficher_les_postes_comptables_zone', 'zone': user[0]['utilisateur__zone__id']}, setState)
        }
        else{
            fetchData(`${API_URL}/users/poste_comptable/all`, 'post', {'action': 'afficher_les_postes_comptables', 'user_id': user[0]['id']}, setState)
        }

    }


    // Cette fonction va recupérer les auditeurs d'une zone (pour les chefs d'unités) ou tous les auditeurs (pour le directeur)
    const liste_auditeurs = (setState) => {

        if(user[0]['utilisateur__fonction'].toUpperCase() == 'directeur'.toUpperCase() || user[0]['utilisateur__fonction'].toUpperCase() == 'autres'.toUpperCase()){
            fetchData(`${API_URL}/users/get_auditeurs`, 'post', {'action': 'recuperer_auditeurs'}, setState)
        }

        else if(user[0]['utilisateur__fonction'].toUpperCase() == 'chef_unite'.toUpperCase()){
            fetchData(`${API_URL}/users/get_auditeurs_zone`, 'post', {'action': 'recuperer_auditeurs_zone', 'zone': user[0]['utilisateur__zone__id']}, setState)
        }

    }


    // Cette fonction va recupérer toutes les zones existantes (pour l'utilisateur : Directeur)
    const liste_zones = () => {
        if(user[0]['utilisateur__fonction'].toUpperCase() == 'directeur'.toUpperCase() || user[0]['utilisateur__fonction'].toUpperCase() == 'autres'.toUpperCase()){
            fetchData(`${API_URL}/users/zone/get`, 'get', {}, setZones);
        }
    }


    // Cette fonction va filtrer les donnees initiales(auditeurs et postes comptables) recupérer par rapport au zone selectionnée (pour un directeur)
    const filtrer_les_auditeurs_et_les_postes_comptables_par_zone = (value) => {

        const auditeurs_filter = auditeurs_copie.filter((item) => {
            if(item['zone_id']?.toString() != value){
                return false
            }
            return true
        })
        setAuditeurs(auditeurs_filter)

        const poste_comptable_filter = poste_comptables_copie.filter((item) => {
            if(item['utilisateur__zone_id']?.toString() != value ){
                return false
            }
            return true
        })
        setPosteComptables(poste_comptable_filter)
    }


    // // Cette fonction va filtrer les donnees initiales(poste comptables) recupérer par rapport au zone selectionnée (pour un directeur et les chef d'unités)
    const recuperer_les_postes_comptables_liees_a_un_auditeur = (value) => {


        if(value != ""){
            const id = value.split(" ")[0];
            const filter = poste_comptables_copie.filter((item) => {
                if( item['utilisateur_id']?.toString() != id ){
                    return false
                }
                return true
            })
            setPosteComptables(filter)
        }
        else{
            if(zone_selected != ""){
                filtrer_les_auditeurs_et_les_postes_comptables_par_zone(zone_selected)
            }
            else{
                setPosteComptables(poste_comptables_copie)
            }
        }


    }


    const obtenir_la_liste_des_exercices = () => {
        fetchData(`${API_URL}/data/exercice/get`, 'get', {}, setExercices)
    }


    useEffect(() => {
        fetchData(`${API_URL}/data/piece/get_pieces`, 'get', {}, setListePieces)
        obtenir_la_liste_des_exercices()
    }, [])



    useEffect(() => {
        if(user){

            liste_documents(setDocuments)
            liste_documents(setDocumentsAFiltrer)

            liste_poste_comptables(setPosteComptables)
            liste_poste_comptables(setPosteComptablesCopie)

            liste_auditeurs(setAuditeurs)
            liste_auditeurs(setAuditeursCopie)

            liste_zones()

        }
    }, [user])


    useEffect(() => {
        if(documents){
            paginateData(currentPage.current, itemsPerPage.current, documents, setDocumentsPaginate);
        }
    }, [documents, reload_data])


  return (
    <section id='liste-transcription'>
        <p className='text-lg p-4 bg-gray-300'>Liste des transcriptions</p>
        
        <div className='w-full h-full flex justify-center gap-2'>
            

            <div className='w-full relative h-115'>


                {/* Liste des auditeurs (afficher si l'utilisateur connecte n'est pas un auditeur) */}
                {
                    user ?
                        user[0]['utilisateur__fonction'].toUpperCase() != 'Auditeur'.toUpperCase() ?
                            <>
                                <div className='flex gap-6 justify-center items-center'>
                                    {
                                        user[0]['utilisateur__fonction'].toUpperCase() == 'Directeur'.toUpperCase() || user[0]['utilisateur__fonction'].toUpperCase() == 'Autres'.toUpperCase() ?
                                            <div className='w-1/2 flex items-center gap-4 container-zone'>
                                                <label className="label">Zone: </label>
                                                <select className='bg-white p-2 w-full rounded-lg border border-gray-300' value={zone_selected} onChange={(e) => { setZoneSelected(e.target.value) ; filtrer_les_auditeurs_et_les_postes_comptables_par_zone(e.target.value) } }>
                                                    <option value="" disabled>Choisissez une zone</option>
                                                    {
                                                        zones && zones.map((item, index) => (
                                                            <option key={index} value={item['id']}>{item['nom_zone']}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        : null
                                    }


                                    <div className='flex-1 p-4 flex items-center gap-4'>
                                        <label className="label">Auditeur: </label>
                                        <input list="auditeurs" className='bg-white p-2 rounded-lg border border-gray-300 w-full' placeholder='Votre auditeur ?' onChange={(e) => recuperer_les_postes_comptables_liees_a_un_auditeur(e.target.value)}/>
                                        <datalist id='auditeurs'>
                                            {
                                                auditeurs && auditeurs.map((auditeur, index) => (
                                                    <option key={index} value={auditeur['id'] + " " + auditeur['nom'] + " " + auditeur['prenom']} />
                                                ))
                                            }
                                        </datalist>
                                    </div>

                                </div>
                            </>
                        : null
                    : null
                }

                {/* Recherche */}
                <div className='my-2 container-recherche flex items-center justify-center gap-6'>

                    <div>
                        <p className='italic text-lg  font-semibold underline'>Rechercher : </p>
                    </div>

                    <div>
                        <label className='label'>Piece</label>
                        <select className='bg-white p-2 rounded-sm shadow-sm' value={recherche.current['piece']} onChange={(e) => search_execute('piece', e.target.value)}>
                            <option value="" disabled>Pièce</option>
                            {
                                liste_pieces && liste_pieces.map((item, index) => (
                                    <option key={index} value={item['fields']['nom_piece']}>{item['fields']['nom_piece']}</option>
                                ))
                            }

                        </select>
                    </div>

                    <div>
                        <label className='label'>Poste comptable</label>
                        <input list='poste_comptable' className='input' onChange={(e) => search_execute('poste_comptable', e.target.value)} placeholder='Poste comptable'/>
                        <datalist id='poste_comptable' className='bg-white p-2 rounded-sm shadow-sm'>
                            <option value="" disabled>Poste comptable</option>
                            {
                                poste_comptables && poste_comptables.map((item, index) => (
                                       <option key={index} value={item['nom_poste']} />
                                ))
                            }
                        </datalist>
                    </div>

                    <div>
                        <label className="label">Date d'arrivee</label>

                        <input type="date" className='input' onChange={(e) => { search_execute('date', e.target.value)} }/>

                    </div>

                    <div>
                        <label className="label">Mois</label>
                        <select className='bg-white p-2 rounded-sm shadow-sm' value={recherche.current['mois']} onChange={(e) => search_execute('mois', e.target.value)}>
                            <option value="" disabled>Mois</option>
                            <option value="01">Janvier</option>
                            <option value="02">Février</option>
                            <option value="03">Mars</option>
                            <option value="04">Avril</option>
                            <option value="05">Mai</option>
                            <option value="06">Juin</option>
                            <option value="07">Juillet</option>
                            <option value="08">Août</option>
                            <option value="09">Septembre</option>
                            <option value="10">Octobre</option>
                            <option value="11">Novembre</option>
                            <option value="11">Décembre</option>
                        </select>
                    </div>
                    <div>
                        <label className='label'>Exercice</label>
                        <select className='bg-white p-2 rounded-sm shadow-sm' value={recherche.current['exercice']} onChange={(e) => search_execute('exercice', e.target.value)}>
                            <option value="" disabled>Exercice</option>
                            {
                                exercices?.map((item, index) => (
                                    <option key={index} value={item['annee']}>{item['annee']}</option>
                                ))
                            }
                        </select>
                    </div>
                    


                </div>

                <table className='table table-view is-fullwidth'>
                    <thead>
                        <tr>
                            <th>Pièce</th>
                            <th>Poste comptable</th>
                            <th>Document</th>
                            <th>Date</th>
                            <th>Mois</th>
                            <th>Année</th>
                        </tr>
                    </thead>

                    <tbody>
                        {

                            documents_paginate ?

                                documents_paginate.length > 0 ?

                                    documents_paginate.map((item, index) => (
                                        <ListeItem key={index} index={index} item={item}/>
                                    ))
                                
                                : <tr>
                                    <td colSpan={6}>
                                        <p className="text-center">
                                            Aucune donnée à afficher
                                        </p>
                                    </td>
                                </tr>

                            : <tr>
                                <td colSpan={6}>
                                    <p className="text-center">
                                        En attente des données
                                    </p>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>

                {
                    documents?.length > itemsPerPage.current ?
                        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} liste={documents} reload={reload_data} setReload={setReloadData} description='Page'/>
                    : null
                }


            </div>

            <Modal isVisible={isVisible} setIsvisible={setIsvisible} width_children='w-2/3'>
                <TabView data={transcription} titre={detail_titre} piece={piece}/>
            </Modal>

        </div>
    </section>
  )
}
