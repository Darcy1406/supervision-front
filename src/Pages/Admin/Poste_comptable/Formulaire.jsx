import React, { useEffect, useRef, useState } from 'react'
import { fetchData } from '../../../functions/fetchData'
import { API_URL } from '../../../Config';
import { Alert } from '../../../Composants/Alert/Alert';
import { NavLink } from 'react-router-dom';
import { usePosteComptableStore } from '../../../store/usePosteComptableStore';

export default function Formulaire() {

  const poste_comptable = usePosteComptableStore((state) => state.poste_comptable);
  const clearPosteComptable = usePosteComptableStore((state) => state.clearPosteComptable);

  const [postes, setPostes] = useState(null);
  const [poste_choisi, setPosteChoisi] = useState("");
  const [auditeurs, setAuditeurs] = useState(null);
  const [result, setResult] = useState(null);

  const ref_nom_poste = useRef(null);
  const ref_code_poste = useRef(null);
  const ref_lieu = useRef(null);
  const ref_poste = useRef(null);
  const ref_responsable = useRef(null);
  const ref_auditeur = useRef(null);


  const recuperer_les_types_de_poste = () => {
    fetchData(`${API_URL}/users/poste_comptable/type`, 'get', {}, setPostes)
  }

  
  const recuperer_tous_les_auditeurs = () => {
    fetchData(`${API_URL}/users/get_auditeurs_zone`, 'post', {'action': 'recuperer_auditeurs'}, setAuditeurs)
  }


  const handlesbumit = (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const code_poste = data.get('code_poste');
    const nom_poste = data.get('nom_poste');
    const lieu = data.get('lieu');
    const poste = data.get('poste');
    const responsable = data.get('responsable');
    const auditeur = data.get('auditeur').split(' ')[0];

    if(!poste_comptable){

      fetchData(
        `${API_URL}/users/poste_comptable/create`,
        'post',
        {
          'action': 'ajouter_poste_comptable',
          'code_poste': code_poste,
          'nom_poste': nom_poste,
          'lieu': lieu,
          'poste': poste,
          'responsable': responsable,
          'auditeur': auditeur
        },
        setResult
      )

    }
    else{

      fetchData(
        `${API_URL}/users/poste_comptable/update`,
        'put',
        {
          'action': 'modifier_poste_comptable',
          'id': poste_comptable.id,
          'code_poste': code_poste,
          'nom_poste': nom_poste,
          'lieu': lieu,
          'poste': poste,
          'responsable': responsable,
          'auditeur': auditeur
        },
        setResult
      )

    }

    setPosteChoisi("")
    clearPosteComptable()

  }


  const data_a_modifier = () => {
    if(poste_comptable){
      ref_code_poste.current.value = poste_comptable.code_poste || ""
      ref_nom_poste.current.value = poste_comptable.nom_poste || ""
      ref_lieu.current.value = poste_comptable.lieu || ""
      ref_responsable.current.value = poste_comptable.responsable || ""
      setPosteChoisi(poste_comptable.poste);

      auditeurs.forEach((item) => {
        if(item['id'] == poste_comptable.auditeur){
          ref_auditeur.current.value = item['id'] + " " + item['nom'] + " " + item['prenom']
        }
      })
    }
  }


  // Exécute la logique quand les données changent
  useEffect(() => {
    if (auditeurs && poste_comptable) {
      data_a_modifier();
    }
  }, [poste_comptable, auditeurs]);


    //Cleanup exécuté uniquement quand le composant est démonté
  useEffect(() => {
    return () => {
      clearPosteComptable();
    };
  }, []);
    

  useEffect(() => {
    recuperer_les_types_de_poste()
    recuperer_tous_les_auditeurs()
  }, [])


  // Titre de l'interface
  useEffect(() => {
    const original_title = document.title
    document.title = 'Formulaire poste comptable'
    return () => {
        document.title = original_title
    }
}, [])


  return (
    <div id='form-poste-comptable' className='w-3/4 mx-auto p-4'>

      <p className='text-center text-xl mx-auto my-2 font-semibold bg-white rounded-sm shadow-sm p-2'>

        {
          poste_comptable ?
            'Modifier un poste comptable'
          : 'Ajouter un poste comptable'
        }

      </p>



      {/* Formulaire */}
      <form onSubmit={ (e) => { handlesbumit(e); e.target.reset() } } className='bg-white p-4 rounded-sm shadow-sm'>

        <NavLink className='button is-dark my-4' to='/admin/poste_comptable'>
          <span className='icon mx-1'>
            <i className='fas fa-list'></i>
          </span>
          Liste des postes comptables
        </NavLink>

        <div className='flex mb-2 gap-4 items-center justify-center'>

          {/* Code poste comptable */}
          <div className="flex-1">
            {/* <div className="control"> */}
              <label className="label">Code</label>
              <input type="text" name='code_poste' className='input' placeholder='Entrer le code du poste comptable' required ref={ref_code_poste}/>
            {/* </div> */}
          </div>

          {/* Nom poste comptable */}
          <div className="flex-1">
            {/* <div className="control"> */}
              <label className="label">Nom</label>
              <input type="text" name='nom_poste' className='input' placeholder='Entrer le nom du poste comptable' required ref={ref_nom_poste}/>
            {/* </div> */}
          </div>

        </div>


        <div className='flex gap-4'>

          {/* Lieu poste comptable */}
          <div className="flex-1">
              <label className="label">Lieu</label>
              <input type="text" name='lieu' className='input' placeholder='Entrer le lieu du poste comptable' required ref={ref_lieu}/>
          </div>
          
          {/* Poste */}
          <div className="flex-1">
              <label className="label">Poste</label>

              <input list="poste" className="input" placeholder='Veuillez choisir un poste' value={poste_choisi} onChange={(e) => setPosteChoisi(e.target.value)} required/>
              <datalist id='poste'>
                {
                  postes && postes.map((item, index) => (
                    <option key={index} value={item['poste']} />
                  ))
                }
              </datalist>
          </div>

        </div>
        

        {/* Responsable */}
        <div className="field">
          <div className="control">
            <label className="label">Responsable</label>
            <input type="text" name='responsable' className='input' placeholder='Entrer le responsable du poste comptable' required ref={ref_responsable}/>
          </div>
        </div>

        <div className='field'>
            <div className="control">
              <label className="label">Veuillez choisir l'auditeur qui sera en charge du poste comptable</label>
              <input list='auditeurs' name='auditeur' placeholder='Choisir un auditeur' className='input' required ref={ref_auditeur}/>
              <datalist id='auditeurs'>
              {
                auditeurs && auditeurs.map((auditeur, index) => (
                    <option key={index} value={auditeur['id'] + " " + auditeur['nom'] + " " + auditeur['prenom']} />
                ))
              }
              </datalist>
            </div>
        </div>

        
        <button type="submit" className={`${poste_comptable ? 'bg-green-400' : 'bg-blue-400'} px-4 py-2 rounded-sm my-4 cursor-pointer duration-150 ease-in-out hover:bg-blue-500`}>
          {
            poste_comptable ?
              'Valider'
            : 'Ajouter'
          }
        </button>

      </form>


      {/* Mesage d'alert */}
      {
        result ?
            result['succes'] ?
              <Alert message={result['succes']} setMessage={setResult} icon='fas fa-check-circle' bgColor='bg-green-300' borderColor='border-color-400'/>
            : 
              <Alert message={result['error']} setMessage={setResult} icon='fas fa-times-circle' bgColor='bg-red-300' borderColor='border-red-400'/>
        : null
        } 

    </div>
  )
}
