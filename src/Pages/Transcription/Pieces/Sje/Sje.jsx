import { useEffect, useState } from 'react'
import BtnChoice from '../../../../Composants/BtnChoice/BtnChoice'
import Modal from '../../../../Composants/Modal/Modal';
import SaveFile from '../../../../Composants/Save-File/SaveFile';
import { fetchData } from '../../../../functions/fetchData';
import { API_URL } from '../../../../Config';
import InputNumber from '../../../../Composants/InputNumber/InputNumber';
import { formatNombreAvecEspaces } from '../../../../functions/Function';
import { sendDocument } from '../../../../functions/sendDocument';
import { Alert } from '../../../../Composants/Alert/Alert';
import { useUserStore } from '../../../../store/useUserStore';

export default function Sje() {
  const user = useUserStore((state) => state.user);

  const [isVisible, setIsVisible] = useState(false); // State pour afficher/former la fenetre modale

  const [doc, setDoc] = useState(null); // Va stocker les informations sur le document et le document lui-meme
  const [id_doc, setIdDoc] = useState(null);

  const [result, setResult] = useState(null); // Va stocker les messages recuperer depuis l'API

  const [liaison, setLiaison] = useState(null);

  const [recettes, setRecettes] = useState({
    "Recettes propres": 0,
    "Approvisionnement de fonds": 0,
    "Degagement de fonds effectuees par la RAF": 0,
  });

  const [depenses, setDepenses] = useState({
    "Degagements de fonds": 0,
    "Depenses": 0,
  });

  const [total, setTotal] = useState({
    'recettes': 0,
    'depenses': 0
  })

  const [info_supp, setInfoSupp] = useState({
    "date_sje": "",
    "poste_comptable": "",
    "report": 0,
    "solde_calcule": 0,
    "solde": 0,
  })


  const handleChange = (name, value, setState) => {
  
    setState(prev => ({
      ...prev,
      [name]: value,
    }));
  }


  const reset_data = (data, value, setState) => {
    Object.keys(data).forEach(key => {
      console.log('key', key);
      handleChange(key, value, setState);
    })
  }


  const calcule_total_recettes = () => {
    let total_recettes = 0
    Object.values(recettes).forEach((value) => {
      total_recettes = parseFloat(total_recettes) + parseFloat(value || 0)
    })
    if(total_recettes == 0){
      handleChange('recettes', total_recettes, setTotal);
    }
    handleChange('recettes', total_recettes, setTotal);
  }


  const calcule_total_depenses = () => {
    let total_depenses = 0
    Object.values(depenses).forEach((value) => {
      total_depenses = parseFloat(total_depenses) + parseFloat(value || 0)
    })
    if(total_depenses == 0){
      handleChange('depenses', total_depenses, setTotal);
    }
    handleChange('depenses', total_depenses, setTotal);
  }


  const calcule_solde = () => {
    let solde = (parseFloat(Number(info_supp['report']).toFixed(2)) + parseFloat(total['recettes']) - parseFloat(total['depenses'])) || 0;
    handleChange('solde_calcule', Number(solde.toFixed(2)), setInfoSupp);
  }


  // Enregistrer vers la BD le document (fichier)
  const save_file = () => {
    const formData = new FormData();
    
    const date = new Date(info_supp['date_sje'])

    formData.append("fichier", doc['fichier']);
    formData.append("nom_fichier", doc['nom_fichier']);
    formData.append("type_fichier", doc['type_fichier']);
    formData.append("piece", doc['piece']);
    formData.append("poste_comptable", doc['poste_comptable']);
    formData.append("exercice", date.getFullYear());
    formData.append("periode", doc['periode']);
    formData.append("info_supp", info_supp['date_sje']);
    formData.append("mois", (date.getMonth() + 1));
    formData.append("date_arrivee", doc['date_arrivee']);
    formData.append("action", 'ajouter_un_document');

    sendDocument(formData, setIdDoc);
    
}


  useEffect(() => {
    if(id_doc){
      
      fetchData(`${API_URL}/data/transcription/create`, 'POST', {
        'action': 'ajouter_transcription',

        natures: ["Recettes propres", "Approvisionnement de fonds", "Degagement de fonds effectuees par la RAF", "Degagements de fonds",  "Depenses", "total_recettes", "total_depenses", "report", "solde"],

        "Recettes propres": {"5310": recettes['Recettes propres']},
        "Approvisionnement de fonds": {"5310": recettes['Approvisionnement de fonds']},
        "Degagement de fonds effectuees par la RAF": {"5310": recettes['Degagement de fonds effectuees par la RAF']},
        "Degagements de fonds": {"5310": depenses['Degagements de fonds']},
        "Depenses": {"5310": depenses['Depenses']},
        "total_recettes": total['recettes'],
        "total_depenses": total['depenses'],
        "report": info_supp['report'],
        "solde": info_supp['solde_calcule'],
        'id_doc': id_doc,

        'utilisateur': user[0]['id'],
        'piece': doc['piece'],

      }, setResult)
    }
  }, [id_doc])


  useEffect(() => {
    fetchData(`${API_URL}/data/piece_compte/liste_liaison_pour_une_piece`, 'post', {'action': 'filtrer_liaison', 'piece': 'SJE'}, setLiaison);
  }, [])


  useEffect(() => {
    if(recettes){
      calcule_total_recettes()
    }
  }, [recettes])


  useEffect(() => {
    if(depenses){
      calcule_total_depenses()
    }
  }, [depenses])


  useEffect(() => {
    if(info_supp['report'] != 0){
      calcule_solde();
    }
  }, [info_supp['report'], total['recettes'], total['depenses']])

  useEffect(() => {
    if(doc != null){
      setIsVisible(false);
    }
  }, [doc])


  useEffect(() => {
    if(result && result['succes']){
      reset_data(recettes, 0, setRecettes);
      reset_data(depenses, 0, setDepenses);
      reset_data(total, 0, setTotal);
      handleChange('date_sje', "", setInfoSupp);
      handleChange('poste_comptable', "", setInfoSupp);
      handleChange('report', 0, setInfoSupp);
      handleChange('solde', 0, setInfoSupp);
      handleChange('solde_calcule', 0, setInfoSupp);
      setDoc(null);
    }
  }, [result])





  // useEffect(() => {
  //   if(liaison){
  //     create_dynamique_state();
  //   }
  // }, [liaison])




  return (
    <div id='sje' className='h-full'>

      <div className='bg-gray-300 mt-2 p-4'>
        <p className='titre'>SITUATION JOURNALIERE de l'ENCAISSE</p>
      </div>

      <div className='flex gap-4 justify-center items-center'>

        <div className='w-2/3 container-form'>

          <div className="flex gap-4">

            {/* Date du sje */}
            <div className="w-1/2">
                <label className="label">Date du SJE</label>
                <input type="date" className="input input-sje" value={info_supp['date_sje']} onChange={(e) => handleChange('date_sje', e.target.value, setInfoSupp)} required/>
            </div>
            

          </div>

          {/* Report journee anterieure */}
          <div className="field">
                <div className="control">
                  <label className="label">Report journee anterieur</label>

                  <input 
                    type='text'
                    className='input input-sje'
                    value={formatNombreAvecEspaces(info_supp['report'])}
                    onChange={(e) => handleChange('report', e.target.value.replace(/\s/g, "").replace(/,/g, "."), setInfoSupp) }
                    placeholder="Entrer le montant"
                    pattern='^[0-9,\s]+$'
                    required
                  />

                </div>
              </div>


          <div className='flex gap-4'>

            <fieldset className='w-1/2 border border-gray-300 p-4 rounded-xl'>

              <legend className='mx-6'>Recettes</legend>

              {/* Recettes propes */}
              <div className="field">
                <div className="control">
                  <label className="label">Recettes propres</label>
                  <input 
                    type='text'
                    className='input input-sje'
                    value={formatNombreAvecEspaces(recettes['Recettes propres'])}
                    onChange={(e) => handleChange('Recettes propres', e.target.value.replace(/\s/g, "").replace(/,/g, "."), setRecettes) }
                    placeholder="Entrer le montant"
                    pattern='^[0-9,\s]+$'
                  />
                </div>
              </div>

              {/* Approvisionnement de fonds */}
              <div className="field">
                <div className="control">
                  <label className="label">Approvisionnement de fonds</label>

                  <input 
                    type='text'
                    className='input input-sje'
                    value={formatNombreAvecEspaces(recettes['Approvisionnement de fonds'])}
                    onChange={(e) => handleChange('Approvisionnement de fonds', e.target.value.replace(/\s/g, "").replace(/,/g, "."), setRecettes) }
                    placeholder="Entrer le montant"
                    pattern='^[0-9,\s]+$'
                  />

                </div>
              </div>

              {/* Degagement de fonds effectuees par la RAF */}
              <div className="field">
                <div className="control">
                  <label className="label">Dégagement de fonds effectuees par la RAF</label>

                  <input 
                    type='text'
                    className='input input-sje'
                    value={formatNombreAvecEspaces(recettes['Degagement de fonds effectuees par la RAF'])}
                    onChange={(e) => handleChange('Degagement de fonds effectuees par la RAF', e.target.value.replace(/\s/g, "").replace(/,/g, "."), setRecettes) }
                    placeholder="Entrer le montant"
                    pattern='^[0-9,\s]+$'
                  />

                </div>
              </div>

            </fieldset>

            <fieldset className="flex-1 border border-gray-300 p-4 rounded-xl">
              <legend className='mx-6'>Dépenses</legend>

              {/* Degagements de fonds */}
              <div className="field">
                <div className="control">
                  <label className="label">Dégagements de fonds</label>
                  <input 
                    type='text'
                    className='input input-sje'
                    value={formatNombreAvecEspaces(depenses['Degagements de fonds'])}
                    onChange={(e) => handleChange('Degagements de fonds', e.target.value.replace(/\s/g, "").replace(/,/g, "."), setDepenses)}
                    placeholder="Entrer le montant"
                    pattern='^[0-9,\s]+$'
                  />
                </div>
              </div>

              {/* Depenses */}
              <div className="field">
                <div className="control">
                  <label className="label">Dépenses</label>
                  <input 
                    type='text'
                    className='input input-sje'
                    value={formatNombreAvecEspaces(depenses['Depenses'])}
                    onChange={(e) => handleChange('Depenses', e.target.value.replace(/\s/g, "").replace(/,/g, "."), setDepenses) }
                    placeholder="Entrer le montant"
                    pattern='^[0-9,\s]+$'
                  />
                </div>
              </div>

            </fieldset>

          </div>

          <div className="field">
            <div className="control">
              <label className='label'>Encaisse fin de journée</label>
              <input 
                type='text'
                className='input input-sje'
                value={formatNombreAvecEspaces(info_supp['solde'])}
                onChange={(e) => handleChange('solde', e.target.value.replace(/\s/g, "").replace(/,/g, "."), setInfoSupp) }
                placeholder="Entrer le montant"
                pattern='^[0-9,\s]+$'
                required
              />
            </div>
          </div>


        </div>

        <div className='flex-1'>

          <ul className=''>

            <li className='my-4 text-xl'>
              Total recettes : 
              <strong className='is-block text-green-300'>{formatNombreAvecEspaces(total['recettes'].toFixed(2))} Ar</strong>
            </li>


            <li className='my-4 text-xl'>
              Total depenses : 
              <strong className='is-block text-green-300'>{formatNombreAvecEspaces(total['depenses'].toFixed(2))} Ar</strong>
            </li>

            <li className='my-4 text-xl'>
              Solde : 
              <strong className='is-block text-green-300'>{formatNombreAvecEspaces(info_supp['solde_calcule'].toFixed(2)) } Ar</strong> 
            </li>

          </ul>

          {
            info_supp['solde'] != 0 ?

              <div className="container-message">
                {
                  parseFloat(info_supp['solde']).toFixed(2) == info_supp['solde_calcule'].toFixed(2) ?

                    <p className='text-green-500 text-lg text-center'>
                        <span className='icon mx-2'>
                          <i className="fas fa-thumbs-up"></i>
                        </span>
                        Le solde calculé et solde saisie coincide
                    </p>

                  :
                    <p className='text-yellow-500 text-lg text-center'>
                        <span className='icon mx-2'>
                          <i className="fas fa-exclamation-triangle is-size-4"></i>
                        </span>
                        Attention incoherence entre le solde calcule et le solde saisie
                    </p>
                }

              </div>

            : null
          }


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

            : <BtnChoice setIsvisible={setIsVisible}/>
          }


          <div className="container-btn-validation my-4">
            <button className='button is-dark is-block mx-auto' onClick={save_file} disabled={ !doc || info_supp['date_sje'] == "" || info_supp['solde'] == 0 || info_supp['report'] == 0 ? true : false}>
              <span className="icon mx-1">
                <i className="fas fa-check-circle"></i>
              </span>
              Valider
            </button>
          </div>

        </div>

        <Modal isVisible={isVisible} setIsvisible={setIsVisible}>
          <SaveFile type_piece="SJE" setFichier={setDoc}/>
        </Modal>

      </div>

      {
        result ?
          result['succes'] ?
            <Alert message={result['succes']} setMessage={setResult} icon='fas fa-check-circle' bgColor='bg-green-300' borderColor='border-green-400'/>
          : null
        : null
      }

    </div>
  )
}
