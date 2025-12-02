import { useEffect, useState } from 'react'
import { API_URL } from '../../../../Config';
import { fetchData } from '../../../../functions/fetchData';
import { formatNombreAvecEspaces } from '../../../../functions/Function';
import InputNumber from '../../../../Composants/InputNumber/InputNumber';
import Modal from '../../../../Composants/Modal/Modal';
import SaveFile from '../../../../Composants/Save-File/SaveFile';
import { Alert } from '../../../../Composants/Alert/Alert';
import BtnChoice from '../../../../Composants/BtnChoice/BtnChoice';
import { getCSRFToken } from '../../../../utils/csrf';
import { sendData } from '../../../../functions/sendData';
import { useUserStore } from '../../../../store/useUserStore';


export default function Bar() {
    const user = useUserStore((state) => state.user);

    const [comptes, setComptes] = useState(null);

    const [isVisible, setIsvisible] = useState(false); // Pour gerer la fenetre modale (afficher/fermer)

    const [doc, setDoc] = useState(null);

    const [comptes_debit, setComptesDebit] = useState([]);
    const [comptes_credit, setComptesCredit] = useState([]);

    const [montant_credit, setMontantCredit] = useState({});
    const [montant_debit, setMontantDebit] = useState({});

    const [result, setResult] = useState(null);


    const create_state_montants = (comptes, setState) => {
        const initialState = comptes.reduce((acc, item) => {
          const numero = item['compte__numero'];
          acc[numero] = 0
          return acc;
        }, {});
        setState(initialState);
    }


    const handleChange = (compte, value, setState) => {

        // Retirer les espaces pour le state
        // const rawValue = value.replace(/\s/g, "");
        // // Si ce n’est pas un nombre, on ignore
        // if (!/^\d*$/.test(rawValue)) return;
  
        setState(prev => ({
          ...prev,
          [compte]: value,
        }));
    }


    const reset_all_montant = (nature, setState) => {
        Object.keys(nature).forEach(key => {
            handleChange(key, 0, setState);
        })
    }



    const filtrer_debit = () => {
     
        const filter = comptes.filter(item => {
          if(!(item['nature'].toLowerCase().includes('debit') || item['nature'].toLowerCase().includes('débit') )){
            return false 
          }
          return true;
        })
        setComptesDebit(filter);
        
    }


    const filtrer_credit = () => {
     
        const filter = comptes.filter(item => {
          if(!(item['nature'].toLowerCase().includes('credit') || item['nature'].toLowerCase().includes('crédit') )){
            return false 
          }
          return true;
        })
        setComptesCredit(filter);
        
    }


    const send_document = (e) => {
        e.preventDefault();

        const formData = new FormData();
        const data = new FormData(e.target);
    
        const info_supp = `${doc['decade']}, Numero d'ordre: ${data.get('num_ordre')}\nDate BAR: ${data.get('date_bar')}\nReference BAR: ${data.get('ref_bar')}\nDate de reception: ${data.get('date_reception')}\nDate de couverture: ${data.get('date_couverture')}`

        formData.append("fichier", doc['fichier']);
        formData.append("nom_fichier", doc['nom_fichier']);
        formData.append("type_fichier", doc['type_fichier']);
        formData.append("piece", doc['piece']);
        formData.append("poste_comptable", doc['poste_comptable']);
        formData.append("exercice", doc['exercice']);
        formData.append("periode", doc['periode']);
        formData.append("info_supp", info_supp);
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
            if(data['id_fichier']){
                send_btt(data['id_fichier']);
                e.target.reset();
                reset_all_montant(montant_credit, setMontantCredit)
                reset_all_montant(montant_debit, setMontantDebit)
                setDoc(null);
            }
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
          
          "natures": ['credit', 'debit'], 
          "credit": montant_credit, 
          "debit": montant_debit, 
          
          
          'id_doc': id_doc,
    
          'utilisateur': user[0]['id'],
          'piece': doc['piece'],
        }, setResult)
      
        // reset_file();
    }


    useEffect(() => {
        fetchData(`${API_URL}/data/piece_compte/liste_liaison_pour_une_piece`, 'post', {'piece': 'BAR', 'action': 'filtrer_liaison'}, setComptes)
    }, [])


    useEffect(() => {
        if(doc != null){
          setIsvisible(false);
        }
    }, [doc])


    useEffect(() => {
        if(comptes){
          filtrer_debit();
          filtrer_credit();
        }
    }, [comptes]);


    useEffect(() => {
        if(comptes_debit){
          create_state_montants(comptes_credit, setMontantCredit);
          create_state_montants(comptes_debit, setMontantDebit);
        }
        // console.log('montants', montants);
    }, [comptes_debit]);


  return (
    <div id='bar'>

        <form onSubmit={(e) => send_document(e)}>

            <div className='flex gap-4 justify-center'>
                
                <div className='w-2/6 p-2'>

                    {/* Numero ordre */}
                    <div className="field">
                        <div className="control">
                            <label className="label">Numero d'ordre : </label>
                            <input type="text" name='num_ordre' className='input' required/>
                        </div>
                    </div>

                    {/* Date BAR */}
                    <div className="field">
                        <div className="control">
                            <label className="label">Date BAR : </label>
                            <input type="date" name='date_bar' className='input' required/>
                        </div>
                    </div>
                    
                    {/* Reference */}
                    <div className="field">
                        <div className="control">
                            <label className="label">Reference BAR : </label>
                            <input type="input" name='ref_bar' className='input' required/>
                        </div>
                    </div>

                    {/* Date de reception */}
                    <div className="field">
                        <div className="control">
                            <label className="label">Date de reception : </label>
                            <input type="date" name='date_reception' className='input' required/>
                        </div>
                    </div>

                    {/* Date de couverture */}
                    <div className="field">
                        <div className="control">
                            <label className="label">Date de couverture : </label>
                            <input type="date" name='date_couverture' className='input' required/>
                        </div>
                    </div>


                </div>

                <div className="w-2/6 p-2">

                    <div className='my-4'>
                        <p className='p-4 text-center bg-gray-300'>Debit</p>
                        <table className='table is-fullwidth'>
                            <thead>
                                <tr>
                                    <th>Compte</th>
                                    <th>Montant</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    Object.keys(montant_debit).slice(0, Object.keys(montant_debit).length).map(compte => {
                                        const rawValue = montant_debit[compte];
                                        const formattedValue = formatNombreAvecEspaces(rawValue);

                                        return (
                                            <tr key={compte}>
          
                                                <td>{compte}</td>
          
                                                <td>
          
                                                    <InputNumber 
                                                        value={formattedValue}
                                                        handleChange={ (e) => handleChange(compte, e.target.value.replace(/\s/g, "").replace(/,/g, "."), setMontantDebit) }
                                                    />Ar
          
                                                </td>
                                            </tr>
                                        )
                                    })
                                }

                            </tbody>

                        </table>
                    </div>

                    <div className='my-4'>

                        <p className='p-4 text-center bg-gray-300'>Credit</p>
                        <table className='table is-fullwidth'>

                            <thead>
                                <tr>
                                    <th>Compte</th>
                                    <th>Montant</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    Object.keys(montant_credit).slice(0, Object.keys(montant_credit).length).map(compte => {
                                        const rawValue = montant_credit[compte];
                                        const formattedValue = formatNombreAvecEspaces(rawValue);

                                        return (
                                            <tr key={compte}>
          
                                                <td>{compte}</td>
          
                                                <td>
          
                                                    <InputNumber 
                                                        value={formattedValue}
                                                        handleChange={ (e) => handleChange(compte, e.target.value.replace(/\s/g, "").replace(/,/g, "."), setMontantCredit) }
                                                    />Ar
          
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>

                        </table>

                    </div>
                </div>

                <div className="w-2/6">

                    <p className='my-4 text-center text-xl'>BAR</p>
                    
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
            <SaveFile type_piece="BAR" setFichier={setDoc} />
        </Modal>


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
