import { useEffect, useState } from 'react'
import BtnChoice from '../../../../Composants/BtnChoice/BtnChoice';
import Modal from '../../../../Composants/Modal/Modal';
import SaveFile from '../../../../Composants/Save-File/SaveFile';
import { sendDocument } from '../../../../functions/sendDocument';
import { sendBalance } from '../../../../functions/sendBalance';
import { Alert } from '../../../../Composants/Alert/Alert';
import Loading from '../../../../Composants/Loading/Loading';

export default function Balance() {

    const [isVisible, setIsVisible] = useState(false);
    const [fichier, setFichier] = useState(null); // Va contenir le fichier excel a transcrire
    const [type, setType] = useState(""); // Tye de la balance
    const [proprietaire, setProprietaire] = useState("");
    const [doc, setDoc] = useState(null);

    const [id_doc, setIdDoc] = useState(null); // Va stocker l'id du document (pieces comptables)

    const [result, setResult] = useState(null); // Va stocker des messages recus depuis l'API

    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedFile = () => {
        const file = document.querySelector('.file-input-balance').files[0];
        setFichier(file);
    }

    // Envoyer le document : balance (pieces comptables)
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("fichier", doc['fichier']);
        formData.append("nom_fichier", doc['nom_fichier']);
        formData.append("type_fichier", doc['type_fichier']);
        formData.append("piece", doc['piece']);
        formData.append("poste_comptable", doc['poste_comptable']);
        formData.append("exercice", doc['exercice']);
        formData.append("periode", doc['periode']);
        formData.append("info_supp", proprietaire);
        formData.append("mois", doc['mois']);
        formData.append("date_arrivee", doc['date_arrivee']);
        formData.append("action", 'ajouter_un_document');

        sendDocument(formData, setIdDoc);
    }


    // Envoyer la balance vers l'API
    const send_balance = () => {
        const formData = new FormData();
        formData.append('action', 'ajouter_transcription_balance')
        formData.append('fichier', fichier);
        formData.append('document_id', id_doc);

        sendBalance(formData, setResult);
    }


    useEffect(() => {
        if(doc != null){
          setIsVisible(false);
        }
    }, [doc])


    useEffect(() => {
        if(id_doc){
            send_balance();
        }
    }, [id_doc])


    useEffect(() => {
        if(result && result['succes']){
            setIsSubmitting(false)
            setProprietaire("")
            setType("");
            setFichier(null);
            setDoc(null);
        }
    }, [result])


  return (
    <div id='balance'>

        <div className="container-form w-1/2 mx-auto my-4">
            <p className='p-4 bg-gray-300 text-lg'>Balance</p>

            <form onSubmit={(e) => handleSubmit(e)}>

                {/* Fichier */}
                <div className="field mt-5">
                    <div className="control">
                        <label className='label'>Fichier</label>
                        <div className="flex items-center gap-4">
                            <div className="file">
                                <label className="file-label">
                                    <input type="file" className="file-input file-input-balance" onChange={selectedFile} accept=".xls,.xlsx"/>
                                    <span className="file-cta">
                                        <span className="file-icon">
                                            <i className="fas fa-upload"></i>
                                        </span>
                                        <span className="file-label">
                                            Choisir un fichier
                                        </span>
                                    </span>
                                </label>
                            </div>
                            {
                                fichier ?
                                    <div className=''>
                                        <span>{fichier['name']}</span>
                                    </div>
                                : null
                            }
                        </div>
                    </div>
                </div>

                {/* Type */}
                <div className="field">
                    <div className="control">
                        <label htmlFor="" className="label">Type</label>
                        <select name="" id="" className='w-full bg-white p-2 rounded-lg border border-gray-300' value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="" disabled>Choisissez le type de la balance</option>
                            <option value="BOD">BOD</option>
                            <option value="BOV">BOV</option>
                        </select>
                    </div>
                </div>

                {/* Proprietaire */}
                <div className="field">
                    <div className="control">
                        <label className="label">Proprietaire</label>
                        <select className='w-full bg-white p-2 rounded-lg border border-gray-300' value={proprietaire} onChange={(e) => setProprietaire(e.target.value)}>
                            <option value="" disabled>Choisissez le proprietaire</option>
                            <option value="ETAT">ETAT</option>
                            <option value="REGION">REGION</option>
                            <option value="COMMUNE">COMMUNE</option>
                        </select>
                    </div>
                </div>

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
                        <BtnChoice setIsvisible={setIsVisible} isDisabled={type == ""}/>
                }

                <button className='bg-green-400 text-white py-2 rounded-sm w-full my-4' style={{fontSize: '20px'}}>
                    {
                        isSubmitting ?
                            <Loading />
                        : 'Valider'
                    }
                    
                </button>

            </form>

        </div>

        <Modal isVisible={isVisible} setIsvisible={setIsVisible}>
            <SaveFile type_piece={type} setFichier={setDoc}/>
        </Modal>


        {
            result ?
                result['succes'] ?
                    <Alert message={result['succes']} setMessage={setResult} icon='fas fa-check-circle' bgColor='bg-green-300' borderColor='border-green-400'/>
                : 
                    <Alert message={result['error']} setMessage={setResult} icon='fas fa-times-circle' bgColor='bg-red-300' borderColor='border-red-400'/>
            : null
        }

    </div>
  )
}
