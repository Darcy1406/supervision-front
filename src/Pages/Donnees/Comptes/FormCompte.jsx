import React, { useEffect, useRef, useState } from 'react';
import './FormCompte.css';
import Checkbox from '../../../Composants/Form/Checkbox';
import { sendData } from '../../../functions/sendData';
import { API_URL } from '../../../Config';

export function FormCompte({isVisible, setIsVisible, data=[], setData, comptes_regroupements = [], refresh, setRefresh}) {

    const form_compte = useRef(null);

    const [numero, setNumero] = useState("");
    const [libelle, setLibelle] = useState("");
    const [type, setType] = useState("");
    const [compte_regroupement, setCompteRegroupement] = useState("")
    const [result, setResult] = useState("")

    const show_form_modal = () => {
        form_compte.current.classList.add('show');
    }


    const close_form_modal = () => {
        form_compte.current.classList.remove('show');
        setIsVisible(!isVisible);
        setNumero("");
        setLibelle("");
        setType("");
        setCompteRegroupement("");
        setData([]);
    }


    const handlesbumit = (e) => {
        e.preventDefault();
        sendData(`${API_URL}/data/compte/create`, 'post', {numero, libelle, type, compte_regroupement, "action": "create"}, setResult);
        close_form_modal();
    }

    const get_data = () => {
        setNumero(data[0].numero);
        setLibelle(data[0].libelle);
        setType(data[0].type);
        setCompteRegroupement(data[0].compte_regroupement);
    }


    useEffect(() => {
        if(isVisible){
            show_form_modal();
        }
        if(data.length > 0){
            get_data();
        }
    }, [isVisible, data])


  return (
    <div id='form_compte' ref={form_compte}>

        <div className='container-form w-130 bg-white mx-auto my-2 px-2 pt-2 pb-4 rounded-xl shadow-2xl'>
            <span className='block text-right is-marginless cursor-pointer' onClick={close_form_modal}>
                <i className="fas fa-times-circle block text-xl text-red-600 duration:150 ease-in-out hover:text-red-700"></i>
            </span>

            <p className='text-center my-2 text-2xl font-semibold'>Ajouter un compte</p>

            <form className='px-4' onSubmit={(e) => { handlesbumit(e); setRefresh(!refresh) } }>
                {/* Numero du compte */}
                <div className="field">
                    <div className="control">
                        <label className='label'>Numero</label>
                        <input type="number"  className="input" name="" id="" placeholder='Entrer le numero du compte' value={numero} onChange={(e) => setNumero(e.target.value)}/>
                    </div>
                </div>

                {/* Libelle du compte */}
                <div className="field">
                    <div className="control">
                        <label className='label'>Libelle</label>
                        <textarea className='textarea' placeholder='La description du compte ici' value={libelle} onChange={(e) => setLibelle(e.target.value)}></textarea>
                    </div>
                </div>

                {/* Type du compte */}
                <div className="field">
                    <div className="control">
                        <label className='label'>Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} name="" id="" className='w-full border border-gray-200 p-2 rounded-lg shadow-sm cursor-pointer'>
                            <option value="">Veuillez choisir le type du compte</option>
                            <option value="Regroupements">Regroupements</option>
                            <option value="Opérations">Operations</option>
                            <option value="Analyses">Analyses</option>
                        </select>
                    </div>
                </div>

                {
                    (type != 'Regroupements' && type != "") && comptes_regroupements != null ?
                        
                        comptes_regroupements.map((item, index) => (
                            <div className='field' key={index}>
                                <div className="control">
                                    <label htmlFor="compte_regroupement" className='label'>
                                        <input type="radio" value={item['id']} name="compte_regroupement" id="compte_regroupement" checked={item['id'] == compte_regroupement ? true : false} onChange={(e) => setCompteRegroupement(e.target.value)}/>
                                    {item['numero']}
                                    </label>
                                </div>
                            </div>
                        ))
                
                    : null
                }

                {/* Button d'envoi du formulaire */}
                <button type="submit" className={ data.length > 0 ? 'bg-black cursor-pointer px-4 py-2 text-white rounded-sm my-2' : 'bg-blue-500 cursor-pointer px-4 py-2 text-white rounded-sm my-2'}>
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
