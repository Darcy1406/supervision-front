import { useEffect, useRef, useState } from 'react';
import './FormCompte.css';
import Checkbox from '../../../Composants/Form/Checkbox';
import { sendData } from '../../../functions/sendData';
import { API_URL } from '../../../Config';
import { fetchData } from '../../../functions/fetchData';

export function FormCompte({isVisible, setIsVisible, data=[], setData, refresh, setRefresh, setResult, result}) {

    const form_compte = useRef(null);

    const [proprietaire, setProprietaire] = useState(null);


    const [id_compte, setIdCompte] = useState("");
    const [compte_regroupement, setCompteRegroupement] = useState("")

    const [info, setInfo] = useState({
        'classe': '',
        'poste': '',
        'rubrique': '',
        'numero': '',
        'libelle': '',
        'acte_reglementaire': '',
        'solde_en_cours_exo': '',
        'solde_fin_gest': '',
        'type': '',
        'proprietaire': '',
    }) 


    // Fcontion qui servir a donner des valeurs aux states
  const handleChange = (name, value) => {

    setInfo(prev => ({
      ...prev,
      [name]: value,
    }));

  }


    // Recuperer la liste des proprietaires disponibles
    const get_proprietaires = () => {
        fetchData(
            `${API_URL}/data/proprietaire/get`,
            'get',
            {},
            setProprietaire
        )
    }

    const show_form = () => {
        form_compte.current.classList.add('show');
    }


    const close_form = () => {
        form_compte.current.classList.remove('show');

        setIsVisible(false);
        Object.keys(info).forEach((name) => {
            handleChange(name, '')
        })

        setData([]);
    }


    const handlesbumit = (e) => {
        e.preventDefault();
        if(data.length > 0){
            fetchData(
                `${API_URL}/data/compte/update`,
                'put', 
                {
                    'action': 'update',
                    'id': id_compte,
                    'classe': info['classe'],
                    'poste': info['poste'],
                    'rubrique': info['rubrique'],
                    'numero': info['numero'],
                    'libelle': info['libelle'],
                    'acte_reglementaire': info['acte_reglementaire'],
                    'solde_en_cours_exo': info['solde_en_cours_exo'],
                    'solde_fin_gest': info['solde_fin_gest'],
                    'type': info['type'],
                    'proprietaire': info['proprietaire'],
                }, 
                setResult
            );
        }
        else{

            fetchData(
                `${API_URL}/data/compte/create`,
                'post', 
                {
                    'action': 'create',
                    'classe': info['classe'],
                    'poste': info['poste'],
                    'rubrique': info['rubrique'],
                    'numero': info['numero'],
                    'libelle': info['libelle'],
                    'acte_reglementaire': info['acte_reglementaire'],
                    'solde_en_cours_exo': info['solde_en_cours_exo'],
                    'solde_fin_gest': info['solde_fin_gest'],
                    'type': info['type'],
                    'proprietaire': info['proprietaire'],
                }, 
                setResult
            );

        }
        
    }

    const get_data = () => {
        setIdCompte(data[0].id)
        console.log(data);
        handleChange('classe', data[0].classe)
        handleChange('poste', data[0].poste)
        handleChange('rubrique', data[0].rubrique)
        handleChange('numero', data[0].numero)
        handleChange('libelle', data[0].libelle)
        handleChange('acte_reglementaire', data[0].acte_reglementaire)
        handleChange('solde_en_cours_exo', data[0].solde_en_cours_exo)
        handleChange('solde_fin_gest', data[0].solde_fin_gest)
        handleChange('type', data[0].type)
        handleChange('proprietaire', data[0].proprietaire)
    }


    useEffect(() => {
        get_proprietaires()
    }, [])


    useEffect(() => {
        if(!isVisible){
            close_form()
        }
    }, [isVisible])

    
    useEffect(() => {
        if(data.length > 0){
            get_data()
        }
    }, [data])


    useEffect(() => {
        if(result){
            if(result['succes']){
                close_form();
            }
        }
    }, [result])


    // useEffect(() => {
    //     if(isVisible){
    //         show_form();
    //     }
    //     else{
    //         close_form();
    //     }
    //     if(data.length > 0){
    //         get_data();
    //     }
    // }, [isVisible, data])


  return (
    <div id='form_compte' ref={form_compte}>

        <div className='container-form my-2 px-2 pt-2 pb-4 rounded-xl'>

            <p className='text-center my-2 text-2xl font-semibold'>
                {
                    data.length > 0 ?
                        'Modifier un compte'
                    : 'Ajouter un compte'
                }
                
            </p>

            <form className='px-4' onSubmit={(e) => { handlesbumit(e); } }>

                <div className='flex gap-2'>

                    {/* Classe */}
                    <div className=''>
                        <label className='label'>Classe</label>
                        <input type="number" className='input' value={info['classe']} onChange={(e) => handleChange('classe', e.target.value)} required/>
                    </div>

                    {/* Poste */}
                    <div className=''>
                        <label className='label'>Poste</label>
                        <input type="number" className='input' value={info['poste']} onChange={(e) => handleChange('poste', e.target.value)} required/>
                    </div>

                    {/* Rubrique */}
                    <div className=''>
                        <label className='label'>Rubrique</label>
                        <input type="number" className='input' value={info['rubrique']} onChange={(e) => handleChange('rubrique', e.target.value)} required/>
                    </div>

                    {/* Numero du compte */}
                    <div className="">
                            <label className='label'>Numéro</label>
                            <input type="number" className="input" name="numero" value={info['numero']} onChange={(e) => handleChange('numero', e.target.value)} required/>
                    </div>

                </div>

                {/* Libelle du compte */}
                <div className="field">
                    <div className="control">
                        <label className='label'>Libelle</label>
                        <textarea className='textarea' placeholder='La description du compte ici' value={info['libelle']} onChange={(e) => handleChange('libelle', e.target.value)} rows={2} required></textarea>
                    </div>
                </div>

                {/* Acte reglementaire */}
                <div className="field">
                    <div className="control">
                        <label className="label">Acte reglémentaire</label>
                        <input type="text" className="input" value={info['acte_reglementaire']} onChange={(e) => handleChange('acte_reglementaire', e.target.value)} required/>
                    </div>
                </div>


                <div className='flex gap-4 my-2'>

                    <div className='w-1/2'>
                        <label className="label">Solde en cours d'exercice</label>
                        <select className='bg-white w-full p-2 rounded-lg border border-gray-300' value={info['solde_en_cours_exo']} onChange={(e) => handleChange('solde_en_cours_exo', e.target.value)}>
                            <option value=""></option>
                            <option value="CREDITEUR">CREDITEUR</option>
                            <option value="DEBITEUR">DEBITEUR</option>
                        </select>
                    </div> 

                    <div className='w-1/2'>
                        <label className="label">Solde fin de gestion</label>
                        <select className='bg-white w-full p-2 rounded-lg border border-gray-300' value={info['solde_fin_gest']} onChange={(e) => handleChange('solde_fin_gest', e.target.value)}>
                            <option value=""></option>
                            <option value="CREDITEUR">CREDITEUR</option>
                            <option value="DEBITEUR">DEBITEUR</option>
                        </select>
                    </div>   
                </div>

                {/* Type du compte */}
                <div className="field">
                    <div className="control">
                        <label className='label'>Type</label>
                        <select value={info['type']} onChange={(e) => handleChange('type', e.target.value)} className='w-full border border-gray-200 p-2 rounded-lg shadow-sm cursor-pointer' required>
                            <option value=""></option>
                            <option value="Regroupement">Regroupement</option>
                            <option value="Opération">Opération</option>
                            <option value="Synthèse">Synthèse</option>
                        </select>
                    </div>
                </div>

                {/* Proprietaire */}
                <div className="field">
                    <div className="control">
                        <label className="label">Propriétaire</label>
                        <select name="" className='w-full bg-white p-2 border border-gray-300 rounded-lg' value={info['proprietaire']} onChange={(e) => handleChange('proprietaire', e.target.value)} required>
                            <option value=""></option>
                            {
                                proprietaire && proprietaire.map((item, index) => (
                                    <option key={index} value={item['id']}>{item['nom_proprietaire']}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                

                {/* Button d'envoi du formulaire */}
                <button type="submit" className={ data.length > 0 ? 'bg-black cursor-pointer px-4 py-2 text-white rounded-sm' : 'bg-blue-500 cursor-pointer px-4 py-2 text-white rounded-sm'}>
                    <span className='icone'>
                        <i className={ data.length > 0 ? 'fas fa-check' : 'fas fa-plus'}></i>
                        { data.length > 0 ? 'Valider' : 'Ajouter' }
                    </span>
                </button>

            </form>

        </div>
        

    </div>
  )
}
