import { useCallback, useEffect, useState } from 'react'
import Recettes from './Form/Recettes';
import Depenses from './Form/Depenses';
import ChooseFile from './Form/ChooseFile';
import { formatNombreAvecEspaces, formatNumber } from '../../../../functions/Function';
import { sendData } from '../../../../functions/sendData.js';
import { API_URL } from '../../../../Config';
import Modal from '../../../../Composants/Modal/Modal.jsx';
import SaveFile from '../../../../Composants/Save-File/SaveFile.jsx';
import { getCSRFToken } from '../../../../utils/csrf.js';
import { Alert } from '../../../../Composants/Alert/Alert.jsx';
import { fetchData } from '../../../../functions/fetchData.js';
import { useUserStore } from '../../../../store/useUserStore.js';

export default function Tsdmt() {
  const user = useUserStore((state) => state.user);

  const [doc, setDoc] = useState(null);

  const [total_recettes, setTotalRecettes] = useState(0);
  const [recettes, setRecettes] = useState(undefined);

  const [total_depenses, setTotalDepenses] = useState(0);
  const [depenses, setDepenses] = useState(undefined);

  const [report, setReport] = useState(0);
  const [reportFormatted, setReportFormatted]= useState("");

  const [solde, setSolde] = useState(0);

  const [isVisible, setIsvisible] = useState(false);

  const [reset_all_montant, setResetAllMontant] = useState(false);

  const [result, setResult] = useState("");

  const [comptes, setComptes] = useState(null); // Va stocker tous les comptes liees au piece TSDMT


  // const handleResetFile = useCallback((fn) => {
  //   setResetFile(() => fn);
  // }, [])


  const get_report_formatted = () => {
    setReportFormatted(formatNombreAvecEspaces(report));
  }


  const get_solde = () => {
    const solde = parseFloat(report) + parseFloat(total_recettes) - parseFloat(total_depenses);
    setSolde(solde.toFixed(2));
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
      send_tsdmt(data['id_fichier']);
    })
    .catch(error => {
      console.log('Erreur : ', error);
    });
    // console.log('fichier', doc['fichier']);
    // sendData(`${API_URL}/data/document/save`, 'POST', {"document": doc, "file": doc['fichier']}, setResult)
  }
  

  const send_tsdmt = (id_doc) => {

    sendData(`${API_URL}/data/transcription/create`, 'POST', {
      'action': 'ajouter_transcription', 
      
      "natures": ['recettes', 'depenses', 'report', 'solde', 'total recettes', 'total depenses'], 
      "recettes": recettes, 
      "depenses": depenses, 
      "report": report, 
      "solde": solde, 
      'total recettes': total_recettes, 
      'total depenses': total_depenses, 
      
      'id_doc': id_doc,

      'utilisateur': user[0]['id'],
      'piece': doc['piece'],
    }, setResult)
  
    // reset_file();
  }


  const change_state_modal = () => {
    setIsvisible(false);
  }


  useEffect(() => {
    get_report_formatted();
  }, [report])

  useEffect(() => {
    get_solde();
  }, [report, total_recettes, total_depenses])


  useEffect(() => {
    if(doc != null){
      change_state_modal();
    }
  }, [doc])


  useEffect(() => {
    fetchData(`${API_URL}/data/piece_compte/liste_liaison_pour_une_piece`, 'post', {'piece': 'TSDMT', 'action': 'filtrer_liaison'}, setComptes)
  }, []);



  useEffect(() => {
    if(result && result['succes']){
      setDoc(null);
      setReport(0);
      setResetAllMontant(true);
    }
  }, [result])


  return (

    <section id='tsdmt'>
      <div className='h-150 flex gap-2 justify-center pt-2'>

        {/* Tableau des recettes */}
        <div className='w-3/7'>
          <Recettes comptes={comptes} total={total_recettes} setTotal={setTotalRecettes} setRecettes={setRecettes} reset_all_montant={reset_all_montant}/>
        </div>

          {/* Tabelau des depenses */}
        <div className='flex-1'>
          <Depenses comptes={comptes} setTotal={setTotalDepenses} setDepenses={setDepenses} reset_all_montant={reset_all_montant}/>
        </div>

        <div className='w-1/7'>
          
          <div className=''>
            <label className='label'>Report</label>

            <input 
              className='w-5/6 bg-white p-2 border border-gray-200 rounded-lg shadow-sm outline-none'
              type="text" 
              placeholder='Entrer le report'
              value={reportFormatted}
              onChange={(e) => setReport(e.target.value.replace(/\s/g, "").replace(/,/g, "."))}
              pattern='^[0-9,\s]+$'
            /> Ar

          </div>

          <div className='my-4 text-green-500'>
            <p className='font-semibold text-green-600'>Recettes :</p>
            <p className='text-xl'>{ formatNombreAvecEspaces(total_recettes) } Ar</p>
          </div>

          <div className='my-4 text-red-500'>
            <p className='font-semibold text-red-600'>Dépenses :</p>
            <p className='text-xl'>{formatNombreAvecEspaces(total_depenses)} Ar</p>
          </div>

          <div className='my-4 text-blue-500'>
            <p className='font-semibold text-blue-600'>Solde :</p>

            <p className='text-xl'>
              { report != 0 ?

                  solde > 0 ? 
                    formatNombreAvecEspaces(solde)

                  : solde < 0  ? 
                    solde

                  : null

                : "0,00"
              } Ar
            </p>
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
                <div className='is-block mx-auto dropdown mt-6' id='drop' onClick={show_button_menu}>
                  <div className='dropdown-trigger'>
                    <button className='button is-fullwidth is-block mx-auto' aria-haspopup='true' aria-controls='dropdown-menu'>
                      Importer un fichier
                      <span className='mx-1 is-small'>
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </button>
                  </div>

                  <div className='dropdown-menu' id='dropdown-menu' role='menu'>
                    <div className="dropdown-content is-block">
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
            <button className='button is-dark is-block mx-auto' onClick={send_document} disabled={doc == null || report == 0}>
              <span className='mx-1'>
                <i className='fas fa-check-circle'></i>
              </span>
              Valider
            </button>
          </div>

        </div>

      
      </div>

      <Modal isVisible={isVisible} setIsvisible={setIsvisible}>
        <SaveFile type_piece="TSDMT" setFichier={setDoc} />
      </Modal>

      {
        result ?
            result['succes'] ?
              <Alert message={result['succes']} setMessage={setResult} icon='fas fa-check-circle' bgColor='bg-green-300'/>
            : 
              <Alert message={result['error']} setMessage={setResult} icon='fas fa-exclamation-triangle' bgColor='bg-red-300' borderColor='border-red-400'/>
        : null
      }

    </section>

  )
}
