import React, { useEffect, useState } from 'react'
import Recettes from './Form/Recettes';
import Depenses from './Form/Depenses';
import ChooseFile from './Form/ChooseFile';
import { formatNumber } from '../../../../functions/Function';
import { sendData } from '../../../../functions/sendData';
import { API_URL } from '../../../../Config';
import Modal from '../../../../Composants/Modal/Modal.jsx';
import SaveFile from '../../../../Composants/Save-File/SaveFile.jsx';
import { getCSRFToken } from '../../../../utils/csrf.js';
import { Alert } from '../../../../Composants/Alert/Alert.jsx';

export default function Tsdmt() {

  const [doc, setDoc] = useState(null);

  const [total_recettes, setTotalRecettes] = useState(0);
  const [recettes, setRecettes] = useState(undefined);

  const [total_depenses, setTotalDepenses] = useState(0);
  const [depenses, setDepenses] = useState(undefined);

  const [report, setReport] = useState(0);
  const [reportFormatted, setReportFormatted]= useState("");

  // const [solde, setSolde] = useState(0);

  const [isVisible, setIsvisible] = useState(false);

  const [reset_file, setResetFile] = useState(null);

  const [result, setResult] = useState("");


  const handleResetFile = (fn) => {
    setResetFile(() => fn);
  }


  const get_report_formatted = () => {
    setReportFormatted(formatNumber(report));
  }

  const show_button_menu = () => {
    const drop = document.getElementById('drop');
    drop.classList.toggle('is-active');  
  }


  const send_document = () => {

    const formData = new FormData();

    formData.append("fichier", doc['fichier']);
    formData.append("nom_fichier", doc['nom_fichier']);
    formData.append("type_fichier", doc['type_fichier']);
    formData.append("piece", doc['piece']);
    formData.append("poste_comptable", doc['poste_comptable']);
    formData.append("exercice", doc['exercice']);
    formData.append("periode", doc['periode']);
    formData.append("decade", doc['decade']);
    formData.append("mois", doc['mois']);
    formData.append("date_arrivee", doc['date_arrivee']);

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
      send_tsdmt(data['id_fichier']);
    })
    .catch(error => {
      console.log('Erreur : ', error);
    });
    // console.log('fichier', doc['fichier']);
    // sendData(`${API_URL}/data/document/save`, 'POST', {"document": doc, "file": doc['fichier']}, setResult)
  }
  

  const send_tsdmt = (id_doc) => {
    sendData(`${API_URL}/data/transcription/create`, 'POST', { "recettes": recettes, "depenses": depenses, "report": parseInt(report, 10), "solde": (parseInt(report, 10) + parseInt(total_recettes, 10) - parseInt(total_depenses, 10)), "natures": ['recettes', 'depenses', 'report', 'solde'], 'id_doc': id_doc}, setResult)
    setDoc(null);
    reset_file();
  }


  const change_state_modal = () => {
    setIsvisible(false);
  }


  useEffect(() => {
    get_report_formatted();
  }, [report])


  useEffect(() => {
    if(doc != null){
      change_state_modal();
    }
    // console.log('doc', doc);
  }, [doc])


  return (

    <section id='tsdmt'>
      <div className='w-full h-150 flex gap-4 justify-center pt-2'>

        {/* Tableau des recettes */}
        <Recettes total={total_recettes} setTotal={setTotalRecettes} setRecettes={setRecettes}/>

        {/* Tabelau des depenses */}
        <Depenses setTotal={setTotalDepenses} setDepenses={setDepenses}/>

        <div className=''>
          
          <div className=''>
            <label className='label'>Report</label>
            <input 
              type="text" 
              inputMode='numeric'
              className='w-40 bg-white p-2 border border-gray-200 rounded-lg shadow-sm outline-none'
              placeholder='Entrer le report'
              value={reportFormatted}
              onChange={(e) => setReport(e.target.value.replace(/\s/g, ""))}
            /> Ar
          </div>

          <div className='my-4 text-green-500'>
            <p className='font-semibold text-green-600'>Recettes :</p>
            <p className='text-xl'>{ formatNumber(total_recettes) } Ar</p>
          </div>

          <div className='my-4 text-red-500'>
            <p className='font-semibold text-red-600'>Dépenses :</p>
            <p className='text-xl'>{formatNumber(total_depenses)} Ar</p>
          </div>

          <div className='my-4 text-blue-500'>
            <p className='font-semibold text-blue-600'>Solde :</p>
            <p className='text-xl'>{ report != 0 && (parseInt(report, 10) + parseInt(total_recettes, 10) - parseInt(total_depenses, 10) > 0) ? formatNumber(parseInt(report, 10) + parseInt(total_recettes, 10) - parseInt(total_depenses, 10)) : report != 0 && (parseInt(report, 10) + parseInt(total_recettes, 10) - parseInt(total_depenses, 10) < 0)  ? parseInt(report, 10) + parseInt(total_recettes, 10) - parseInt(total_depenses, 10) : 0 } Ar</p>
          </div>

          <div>

            {
              doc ? 
                <div className='text-xl mt-6 mb-4'>
                  <span>
                    <i className='fas fa-check text-green-400'></i>
                  </span>
                  <span> Fichier importé</span>
                </div>
              :
                <div className='dropdown mt-6' id='drop' onClick={show_button_menu}>
                  <div className='dropdown-trigger'>
                    <button className='button' aria-haspopup='true' aria-controls='dropdown-menu'>
                      Importer un fichier
                      <span className='mx-1 is-small'>
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </button>
                  </div>

                  <div className='dropdown-menu' id='dropdown-menu' role='menu'>
                    <div className="dropdown-content">
                      <button className='dropdown-item' onClick={() => setIsvisible(true)}>
                        Locale
                      </button>
                      <button className='dropdown-item'>
                        G.E.D
                      </button>
                    </div>
                  </div>
                </div>
            }


          </div>


          <div className='mt-4'>
            <button className='button is-dark is-block mx-auto' onClick={send_document}>
              <span className='mx-1'>
                <i className='fas fa-check-circle'></i>
              </span>
              Valider
            </button>
          </div>

        </div>

      
      </div>

      <Modal isVisible={isVisible} setIsvisible={setIsvisible}>
        <SaveFile type_piece="TSDMT" setFichier={setDoc} onRegisterResetFile={handleResetFile}/>
      </Modal>

      {
        result ?
          <Alert message={result['message']} setMessage={setResult} icon='fas fa-check-circle' bgColor='bg-green-300'/>
        : null
      }

    </section>

  )
}
