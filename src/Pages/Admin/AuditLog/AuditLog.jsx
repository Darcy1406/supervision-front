import { useEffect, useRef, useState } from "react"
import { fetchData } from "../../../functions/fetchData";
import { API_URL } from "../../../Config";
import Pagination from "../../../Composants/Pagination/Pagination";
import { paginateData } from "../../../functions/Function";

export default function AuditLog() {

    const [logs, setLogs] = useState(null) // Va contenir toutes les logs
    const [logs_filter, setLogsFilter] = useState(null) // Va contenir toutes les logs (copie) -> utile pour le filtre
    const [data_paginate, setDataPaginate] = useState(null) // Va contenir les donnees a afficher en pagination
    const [auditeurs, setAuditeurs] = useState(null) // Va contenir la liste de tous les auditeurs

    const currentPage = useRef(1)
    const itemsPerPage = useRef(7)

    const [reload_data, setReloadData] = useState(false) // Dependance de la fonction de pagination pour reloader les donnees a afficher


    // Recuperation de tous les logs
    const recuperer_tous_les_logs = (setState) => {
        fetchData(
            `${API_URL}/audit/get`, 
            'get', 
            {}, 
            setState
        )
    }


    // Filtrer les logs par rapport aux donnees entrees par l'utilisateur
    const rechercher_logs = (value) => {
        const filter = logs_filter.filter((item) => {
            if( !item['utilisateur'].toLowerCase().includes(value.toLowerCase()) ){
                return false
            }
            return true
        })
        setLogs(filter);
    }


    // Interface JSX pour afficher tous les logs
    const LogsItem = ({item}) => {
        const date = new Date(item.date_action);  // JS interprète correctement le fuseau
        const date_formatted = date.toLocaleString("fr-FR", { hour12: false });

        return (
            <tr>
                {/* <td>{item['date_action']}</td> */}
                <td>{date_formatted}</td>
                <td className={` ${item['action'].toLowerCase() == 'suppression' ?'text-red-500' : item['action'].toLowerCase() == 'modification' ? 'text-green-500' : item['action'].toLowerCase() == 'creation' ? 'text-blue-500' : item['action'].toLowerCase() == 'login' ? 'text-dark' : 'text-yellow-500' } font-light text-lg`}>{item['action']}</td>
                {/* <td>{JSON.stringify(item['nouvelle_valeur'])}</td> */}
                <td>{item['modele']}</td>
                <td>{item['document_filename'] || ''}</td>
                <td>{item['utilisateur']}</td>
                <td>{item['adresse_ip']}</td>
            </tr>
        )
    }


    // Les fonctions qui vont s'executer aux moment du rendu de ce composant (sans dependances)
    useEffect(() => {

        recuperer_tous_les_logs(setLogs)
        recuperer_tous_les_logs(setLogsFilter)

        fetchData(
            `${API_URL}/users/get_auditeurs`,
            'post',
            {
                'action': 'recuperer_auditeurs',
            },
        setAuditeurs
        )
    }, [])


    // Les fonctions qui vont s'executer aux moment du rendu de ce composant (avec dependances : logs et reload_data)
    useEffect(() => {
        if(logs){
            paginateData(currentPage.current, itemsPerPage.current, logs, setDataPaginate);
        }
    }, [logs, reload_data])



    // Titre de l'interface
    useEffect(() => {
        const original_title = document.title
        document.title = 'Logs'
        return () => {
            document.title = original_title
        }
    }, [])



      // Interface du composant
    return (

    <div className="audit_log p-2 bg-white my-4 rounded-sm shadow-sm">

        {/* Titre */}
        <div className="bg-white p-4 border-b border-gray-200">
            <h1 className='title is-4'>Traçabilité des actions</h1>

            <p className='subtitle is-6'>Les actions effectuées sur ce système vont s'afficher ici</p>
        </div>

        <div className="container-table">

            <div className="py-2 px-4 border-b border-gray-200">

                <div className="bg-gray-200 p-2">

                    <div className="container-recherche flex p-2 bg-white items-center rounded-sm shadow-sm">
                        
                        <span className="">
                            <i className="fas fa-search"></i>
                        </span>

                        <div className="flex-1">

                            <input type="text" className="outline-none w-full mx-2" placeholder="Entrer un utilisateur" onChange={(e) => rechercher_logs(e.target.value)}/>

                        </div>
                    </div>

                </div>

            </div>



            <table className="table border-b border-gray-200 is-hoverable is-marginless is-fullwidth">
                
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Action</th>
                        {/* <th>Donnees</th> */}
                        <th>Modèle</th>
                        <th>Document concerne</th>
                        <th>Utilisateur</th>
                        <th>Adresse</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        data_paginate ?

                            data_paginate.length > 0 ?
                                data_paginate.map((item, index) => (
                                    <LogsItem key={index} item={item}/>
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
                                    En attente des données ...
                                </p>
                            </td>
                        </tr>
                    }
                </tbody>

            </table>

            {
                logs?.length > 0 ?
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} liste={logs} reload={reload_data} setReload={setReloadData} description='Page'/>
                : null
            }

        </div>


    </div>
  )
}
