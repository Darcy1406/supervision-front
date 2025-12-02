import { useEffect, useState } from "react"
import { fetchData } from "../../../functions/fetchData"
import { API_URL } from "../../../Config"
import { Alert } from "../../../Composants/Alert/Alert"

export default function Exercice() {

    const [exercices, setExercices] = useState(null)
    const [annee, setAnnee] = useState("")
    const [result, setResult] = useState(null)

    const obtenir_la_liste_des_exercices = () => {
        fetchData(`${API_URL}/data/exercice/get`, 'get', {}, setExercices)
    }

    const creer_un_nouveau_exercice = (e) => {
        e.preventDefault()
        fetchData(`${API_URL}/data/exercice/create`, 'post', {'annee': annee}, setResult)
    }

    const ExerciceItem = ({item}) => {
        return (
            <tr>
                <td>{item['id']}</td>
                <td>{item['annee']}</td>
            </tr>
        )
    }


    useEffect(() => {
        obtenir_la_liste_des_exercices()
    }, [])


    useEffect(() => {
        if(result){
            if(result['succes']){
                obtenir_la_liste_des_exercices()
                setAnnee("")
            }
        }
    }, [result])


  return (
    <div id="exercice" className="p-4 w-3/4 mx-auto">
        <p className="p-4 bg-gray-300">Exercice</p>

        <div className="container-table w-1/3 mx-auto my-4">

            <div className="container_formulaire my-2">
                <form onSubmit={creer_un_nouveau_exercice} className="flex gap-4 justify-center items-center">

                    <div className="w-2/3">
                        <input type="number" className="input" placeholder="Ajouter un nouveau exercice" value={annee} onChange={(e) => setAnnee(e.target.value)} required/>
                    </div>

                    <div>
                        <button type="submit" className="button is-link" disabled={annee == ""}>Ajouter</button>
                    </div>

                </form>
            </div>

            <table className="table table-view is-fullwidth">

                <thead>
                    <tr>
                        <th></th>
                        <th>Année</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        exercices && exercices.map((item, index) => (
                            <ExerciceItem key={index} item={item}/>
                        ))
                    }
                </tbody>

            </table>

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
  )
}
