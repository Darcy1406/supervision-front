import { useEffect, useRef, useState } from "react"
import { fetchData } from "../../../functions/fetchData"
import { API_URL } from "../../../Config"
import { Alert } from "../../../Composants/Alert/Alert"
import Pagination from "../../../Composants/Pagination/Pagination"
import { paginateData } from "../../../functions/Function"
import Modal from "../../../Composants/Modal/Modal"
import Confirmation from "../../../Composants/Confirmation/Confirmation"

export default function Exercice() {

    const [exercices, setExercices] = useState(null)
    const [data_paginate, setDataPaginate] = useState(null)
    const [reload_data, setReloadData] = useState(false)
    const [annee, setAnnee] = useState("")
    const [result, setResult] = useState(null)

    const [isVisible, setIsVisible] = useState(false);
    const [id_exercice, setIdExercice] = useState(0);

    const currentPage = useRef(1)
    const itemsPerPage = useRef(5)

    const obtenir_la_liste_des_exercices = () => {
        fetchData(`${API_URL}/data/exercice/get`, 'get', {}, setExercices)
    }


    const creer_un_nouveau_exercice = (e) => {
        e.preventDefault()
        fetchData(`${API_URL}/data/exercice/create`, 'post', {'annee': annee}, setResult)
    }


    // Cette fonction va afficher la fenetre modale de confirmation
    const confirmation_suppresion = (id) => {
        setIdExercice(id);
        setIsVisible(true);
    }


    // Cette fonction va demander de supprimer un exercice
    const supprimer_un_exercice = () => {
        fetchData(
            `${API_URL}/data/exercice/delete`, 
            'delete', 
            {
              'id': id_exercice
            },
            setResult
        )
        setIsVisible(false)
    }


    const ExerciceItem = ({item}) => {
        return (

            <div className="my-4 bg-white rounded-sm shadow-sm p-4 relative">

                <div className="bg-gray-400 rounded-xl text-center" style={{position: 'absolute', top: '-10px', left: '-10px', height: '30px', width: '30px', lineHeight: '30px', borderRadius: '9999px'}}>

                    {item['id']}

                </div>

                <p className="text-center text-lg">{item['annee']}</p>

                <div className="container-button flex gap-2 mx-2" style={{position: 'absolute', right: '10px', bottom: '5px'}}>
    
                    <button className="text-red-400 cursor-pointer duration-150 ease-in-out hover:text-red-500" onClick={() => confirmation_suppresion(item['id'])}>
                        <span className="text-xl">
                            <i className="fas fa-trash-alt"></i>
                        </span>
                    </button>

                </div>
            </div>
        )
    }


    useEffect(() => {
        const original_title = document.title
        document.title = 'Liste des exercices'
        obtenir_la_liste_des_exercices()
        return () => {
            document.title = original_title
        }
    }, [])


    // Executer la fonction pour paginer les donnees au moment du rendu (dependances : users, reload_data)
    useEffect(() => {
        if(exercices){
            paginateData(currentPage.current, itemsPerPage.current, exercices, setDataPaginate);
        }
    }, [exercices, reload_data])


    useEffect(() => {
        if(result){
            if(result['succes']){
                obtenir_la_liste_des_exercices()
                setAnnee("")
            }
        }
    }, [result])


  return (

    <div id="exercice" className="h-full p-1 flex gap-2">

        
        {/* Formulaire */}
        <div className="w-1/3 container-form px-4 py-1 border-r border-gray-300">

            <form onSubmit={creer_un_nouveau_exercice} className="my-4">

                <p className="text-center text-2xl font-bold">Formulaire</p>

                <div className="">
                    <label className="is-block my-1">Entrer un exercice</label>
                    <input type="number" className="input" placeholder="Ajouter un nouveau exercice" value={annee} onChange={(e) => setAnnee(e.target.value)} required/>
                </div>

                <div className="my-4">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-sm my-2 cursor-pointer duration-150 ease-in-out " disabled={annee == ""}>
                        <span className="icone mx-1">
                            <i className="fas fa-plus"></i>
                        </span>
                        Ajouter
                    </button>
                </div>

            </form>

        </div>

        {/* Liste des donnees */}
        <div className="container-table flex-1 mx-auto my-4 px-4">

        <p className="text-xl font-semibold p-4 bg-white rounded-sm shadow-sm">Liste des exercices</p>

        <p className="my-2 italic text-lg">
            La liste des exercices disponibles pour les pièces comptables en entrées s'affichent ici
        </p>

        <div className="mt-4">

            {
                data_paginate ?

                    data_paginate.length > 0 ?
                        data_paginate.map((item, index) => (
                            <ExerciceItem key={index} item={item}/>
                        ))

                    : <p className="text-center">Aucune donnée à afficher</p>

                : <p className="text-center">En attente des données ...</p>
            }   

        </div>



        {
            exercices?.length > 0 ?
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} liste={exercices} reload={reload_data} setReload={setReloadData} description='Page'/>
            : null
        }

        </div>


        {
            <Modal isVisible={isVisible} setIsvisible={setIsVisible} width_children="w-1/3">
                <Confirmation supprimer={supprimer_un_exercice} setIsvisible={setIsVisible}/>

            </Modal>
        }


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
  )
}
