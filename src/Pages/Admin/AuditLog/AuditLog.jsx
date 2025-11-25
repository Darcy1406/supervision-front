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
        return (
            <tr>
                <td>{item['date_action']}</td>
                <td className={` ${item['action'] == 'Suppression' ?'text-red-400' : item['action'] == 'Modification' ? 'text-blue-400' : 'text-green-400'} font-semibold`}>{item['action']}</td>
                {/* <td>{JSON.stringify(item['nouvelle_valeur'])}</td> */}
                <td>{item['modele']}</td>
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
    <div className="audit_log">
        <h1 className='title is-3 mx-6 mt-4'>Traçabilité des actions</h1>
        <p className='subtitle is-6 mx-6'>Les actions effectuées sur ce système vont s'afficher ici</p>

        <div className="container-table px-6">

            <div className="container-recherche flex gap-4 items-center my-2">
                <div>
                    <label className="label">Utilisateur : </label>
                </div>
                <div className="w-1/3">
                    <input list="auditeurs" className="input" placeholder="Entrer un utilisateur" onChange={(e) => rechercher_logs(e.target.value)}/>

                    <datalist id="auditeurs">
                        {
                            auditeurs && auditeurs.map((item, index) => (
                                <option key={index} value={item['nom'] + " " + item['prenom']} />
                            ))
                        }
                    </datalist>

                </div>
            </div>

            <table className="table table-view is-fullwidth">
                
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Action</th>
                        {/* <th>Donnees</th> */}
                        <th>Modèle</th>
                        <th>Utilisateur</th>
                        <th>Adresse</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        data_paginate && data_paginate.length > 0 && data_paginate.map((item, index) => (
                            <LogsItem key={index} item={item}/>
                        ))
                    }
                </tbody>

            </table>
        </div>

        {
            logs?.length > itemsPerPage.current ?
              <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} liste={logs} reload={reload_data} setReload={setReloadData} description='Page'/>
            : null
          }

    </div>
  )
}
