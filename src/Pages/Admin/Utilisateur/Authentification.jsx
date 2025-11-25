import { useEffect, useState } from "react"
import { fetchData } from "../../../functions/fetchData";
import { API_URL } from "../../../Config";
import { useNavigate } from "react-router-dom";
import Loading from "../../../Composants/Loading/Loading";

export default function Authentification({email, id_user, setIsVisible, setMessage}) {
    const navigate = useNavigate()

    const [identifiant, setIdentifiant] = useState("");
    const [password, setPassword] = useState("");
    // const [email, setEmail] = useState("");
    const [result, setResult] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);


    const generatePassword = (length) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@';
        let result = '';
        for (let i = 0; i<length; i++) {
            let randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }
        setPassword(result);
    }


    const envoyer_authentification_utilisateur = (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        fetchData(
            `${API_URL}/users/create_authentification`,
            'post', 
            {
                'action': 'creer_authentification_utilisateur',
                'id_user': id_user['user_id'],
                'email': email,
                'identifiant': identifiant,
                'password': password,
            },
            setResult
        )
    }


    useEffect(() => {
        if(result){
            setMessage(result)
            setIsVisible(false)
            setIsSubmitting(false)
            setIdentifiant("")
            setPassword("")
        }
    }, [result])


    useEffect(() => {
        console.log('id user', id_user);
    }, [id_user])


  return (
    <div>
        <p className="text-center text-lg my-2">Créer une authentification pour l'utilisateur</p>

        <form className="px-4" onSubmit={(e) => envoyer_authentification_utilisateur(e)  }>

            {/* Identifiant */}
            <div className="field">
                <div className="control">
                    <label className="label">Identifiant</label>
                    <input type="text" className="input" placeholder="Identifiant de l'utilisateur" value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} required/>
                </div>
            </div>

            {/* Mot de passe */}
            <div className="field">
                <div className="control">
                    <label className="label">Mot de passe</label>

                    <div className="flex justify-center items-center gap-4">

                        <div className="w-1/2">
                            <input type="password" value={password}  onChange={() => {}} className="input" placeholder="Veuillez generer un mot de passe"  required/>
                        </div>

                        <div className="flex-1">
                            <button type="button" className="button is-link" onClick={ () => generatePassword(6)}>Generer un mot de passe</button>
                        </div>

                    </div>
                </div>
            </div>

            <button type="submit" className="bg-orange-300 px-6 py-2 rounded-lg my-4 cursor-pointer duration-150 ease-in-out hover:bg-orange-400">
                {
                    isSubmitting ?
                        <Loading />
                    : 'Creer'
                }
            </button>

        </form>

    </div>
  )
}
