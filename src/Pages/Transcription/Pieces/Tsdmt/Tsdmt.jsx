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

  const [result, setResult] = useState(false);

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
      console.log(data);
      setResult(data);
    })
    .catch(error => {
      console.log('Erreur : ', error);
    });
    // console.log('fichier', doc['fichier']);
    // sendData(`${API_URL}/data/document/save`, 'POST', {"document": doc, "file": doc['fichier']}, setResult)
  }
  
  const send_tsdmt = () => {
    sendData(`${API_URL}/data/transcription/create`, 'POST', { "recettes": recettes, "depenses": depenses, "report": parseInt(report, 10), "solde": (parseInt(report, 10) + parseInt(total_recettes, 10) - parseInt(total_depenses, 10)), "natures": ['recettes', 'depenses', 'report', 'solde']}, setResult)
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
    // <section className='tsdmt'>

    //   <div className='container-tsdmt w-full gap-4 flex justify-center pt-4'>

    //     <div className='box-recettes w-130 bg-white rounded-xl shadow-lg pb-2'>

    //       <p className='bg-gray-300 p-4 text-2xl italic font-semibold rounded-t-xl text-center'>Recettes</p>

    //       <form action="" className='px-4 my-4'>
    //         {/* Numero de compte */}
    //         <div className='field'>
    //           <div className="control">
    //             <label className='label'>Numero de compte</label>
    //             <input type="number" className="input" placeholder='Entrer le numero de compte'/>
    //           </div>
    //         </div>

    //         {/* Libelle */}
    //         <div className='field'>
    //           <div className="control">
    //             <label className='label'>Libellé</label>
    //             <textarea name="" className='textarea' placeholder='Le libellé du compte ici'></textarea>
    //           </div>
    //         </div>

    //         <div className='field'>
    //           <div className="control">
    //             <label className='label'>Montant</label>
    //             <input type="number" className='input' placeholder='Entrer le montant'/>
    //           </div>
    //         </div>

    //         <button className='bg-black cursor-pointer px-4 py-2 text-white rounded-sm shadow-xs mt-2'>
    //           <span className='icon'>
    //             <i className='fas fa-check-circle'></i>
    //           </span>
    //           Valider
    //         </button>

    //         <div className='mx-6 inline-block is-pulled-right'>
    //           <p className=''>Montant total : 0 Ar</p>
    //           <p>Nombre de depenses validées : 0</p>
    //         </div>

    //       </form>

    //     </div>

    //     <div className='box-depenses w-130 bg-white rounded-xl shadow-lg duration-150'>

    //       <p className='bg-gray-300 p-4 text-2xl font-semibold italic rounded-t-xl text-center'>Dépenses</p>

    //       <form action="" className='px-4 my-4'>
    //         {/* Numero de compte */}
    //         <div className='field'>
    //           <div className="control">
    //             <label className='label'>Numero de compte</label>
    //             <input type="number" className="input" placeholder='Entrer le numero de compte'/>
    //           </div>
    //         </div>

    //         {/* Libelle */}
    //         <div className='field'>
    //           <div className="control">
    //             <label className='label'>Libellé</label>
    //             <textarea name="" className='textarea' placeholder='Le libellé du compte ici'></textarea>
    //           </div>
    //         </div>

    //         <div className='field'>
    //           <div className="control">
    //             <label className='label'>Montant</label>
    //             <input type="number" className='input' placeholder='Entrer le montant'/>
    //           </div>
    //         </div>

    //         <button className='bg-black cursor-pointer px-4 py-2 text-white rounded-sm shadow-xs mt-2'>
    //           <span className='icon'>
    //             <i className='fas fa-check-circle'></i>
    //           </span>
    //           Valider
    //         </button>

    //         <div className='mx-6 inline-block is-pulled-right'>
    //           <p className=''>Montant total : 0Ar</p>
    //           <p>Nombre de depenses validées : 0</p>
    //         </div>

    //       </form>
    //     </div>
        

    //   </div>

    //   <button className='button is-link is-block mx-auto my-4'>
    //     <span className='icone mx-1'>
    //       <i class="fas fa-info"></i>
    //     </span>
    //     Transcrire les donnees
    //   </button>

    // </section>

    <section id='tsdmt'>
      <div className='border border-red-400 w-full h-150 flex gap-4 justify-center pt-2'>

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
            <button className='button is-dark is-block mx-auto' onClick={send_tsdmt}>
              <span className='mx-1'>
                <i className='fas fa-check-circle'></i>
              </span>
              Valider
            </button>
          </div>

        </div>

      
      </div>

      <Modal isVisible={isVisible} setIsvisible={setIsvisible}>
        <SaveFile type_piece="TSDMT" setFichier={setDoc}/>
      </Modal>
      {/* <ChooseFile isVisible={isVisible} setIsvisible={setIsvisible} setDocuments={setDoc}/> */}

    </section>

  )
}
