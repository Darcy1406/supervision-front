import { useEffect, useState } from 'react'
import { API_URL } from '../../../../Config'
import { fetchData } from '../../../../functions/fetchData'
import Credit from './Form/Credit'
import Debit from './Form/Debit'
import { formatNombreAvecEspaces } from '../../../../functions/Function'
import { getCSRFToken } from '../../../../utils/csrf'
import { sendData } from '../../../../functions/sendData'
import { useUserStore } from '../../../../store/useUserStore'
import BtnChoice from '../../../../Composants/BtnChoice/BtnChoice'
import Modal from '../../../../Composants/Modal/Modal'
import SaveFile from '../../../../Composants/Save-File/SaveFile'
import { Alert } from '../../../../Composants/Alert/Alert'


export default function Btt() {
    const user = useUserStore((state) => state.user);

    const [isVisible, setIsvisible] = useState(false); // Pour gerer la fenetre modale (afficher/fermer)

    const [comptes, setComptes] = useState(null);

    const [doc, setDoc] = useState(null);

    const [total_credit, setTotalCredit] = useState(0);
    const [credit, setCredit] = useState(undefined);

    const [total_debit, setTotalDebit] = useState(0);
    const [debit, setDebit] = useState(undefined);

    const [result, setResult] = useState(null);


    const send_document = (e) => {
        e.preventDefault();
        const formData = new FormData();
    
        formData.append("fichier", doc['fichier']);
        formData.append("nom_fichier", doc['nom_fichier']);
        formData.append("type_fichier", doc['type_fichier']);
        formData.append("piece", doc['piece']);
        formData.append("poste_comptable", doc['poste_comptable']);
        formData.append("exercice", doc['exercice']);
        formData.append("periode", doc['periode']);
        formData.append("info_supp", doc['decade']);
        formData.append("mois", doc['mois']);
        formData.append("date_arrivee", doc['date_arrivee']);
        formData.append("action", 'ajouter_un_document');
    
        const csrftoken = getCSRFToken();
        fetch(`${API_URL}/data/document/save`, {
          method: 'post',
          headers: {
            // "Content-Type": "application/json",
            "X-CSRFToken": csrftoken, // ✅ envoie du token CSRF
          },
          credentials: "include",
          body: formData
        })
        .then(response => {
          if(!response.ok){
            throw new Error('Error HTTP' + response.status)
          }
          return response.json();
        })
        .then(data => {
          send_btt(data['id_fichier']);
        })
        .catch(error => {
          console.log('Erreur : ', error);
        });
        // console.log('fichier', doc['fichier']);
        // sendData(`${API_URL}/data/document/save`, 'POST', {"document": doc, "file": doc['fichier']}, setResult)
    }


    const send_btt = (id_doc) => {

        sendData(`${API_URL}/data/transcription/create`, 'POST', {
          'action': 'ajouter_transcription', 
          
          "natures": ['credit', 'debit', 'total debits', 'total credits'], 
          "credit": credit, 
          "debit": debit, 
          'total debits': total_debit, 
          'total credits': total_credit, 
          
          'id_doc': id_doc,
    
          'utilisateur': user[0]['id'],
          'piece': doc['piece'],
        }, setResult)
      
        // reset_file();
    }


    useEffect(() => {
        fetchData(`${API_URL}/data/piece_compte/liste_liaison_pour_une_piece`, 'post', {'piece': 'BTT', 'action': 'filtrer_liaison'}, setComptes)
    }, [])

  return (
    <section id='btt'>

        <form onSubmit={(e) => send_document(e)}>

            <div className='flex justify-center gap-2 pt-2'>
                

                <div className='w-3/7'>

                    <Credit 
                        comptes={comptes}
                        total={total_credit}
                        setTotal={setTotalCredit}
                        setCredit={setCredit}
                    />

                </div>

                <div className='w-3/7'>
                    <Debit 
                        comptes={comptes}
                        total={total_debit}
                        setTotal={setTotalDebit}
                        setDebit={setDebit}
                    />
                </div>

                <div className='w-1/7'>

                    <ul>
                        <li className='my-4'>
                            Total credit :
                            <strong className='is-block text-xl'>{formatNombreAvecEspaces(total_credit) || 0} Ar</strong>
                        </li>

                        <li className='my-4'>
                            Total debit : 
                            <strong className='is-block text-xl'>{formatNombreAvecEspaces(total_debit) || 0} Ar</strong>
                        </li>

                    </ul>

                    {
                        doc ?
                            <div className='text-xl mt-6 mb-4'>
                                <p className='text-center'>
                                    <span>
                                        <i className='fas fa-check text-green-400'></i>
                                    </span>
                                    <span> Fichier importé</span>
                                </p>
                            </div>
                        :
                            <BtnChoice setIsvisible={setIsvisible}/>
                    }

                    <div className='mt-4'>
                        <button className='button is-dark is-block mx-auto' disabled={doc == null}>
                            <span className='mx-1'>
                                <i className='fas fa-check-circle'></i>
                            </span>
                            Valider
                        </button>
                    </div>

                </div>

            </div>

        </form>

        <Modal isVisible={isVisible} setIsvisible={setIsvisible}>
            <SaveFile type_piece="BTT" setFichier={setDoc} />
        </Modal>

        {
            result ?
                result['succes'] ?
                    <Alert message={result['succes']} setMessage={setResult} icon='fas fa-check-circle' bgColor='bg-green-300'/>
                : null
            : null
        } 

    </section>
  )
}
