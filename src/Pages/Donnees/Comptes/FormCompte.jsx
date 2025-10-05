import React, { useEffect, useRef, useState } from 'react';
import './FormCompte.css';
import Checkbox from '../../../Composants/Form/Checkbox';
import { sendData } from '../../../functions/sendData';
import { API_URL } from '../../../Config';

export function FormCompte({isVisible, setIsVisible, comptes_regroupements = [], refresh, setRefresh}) {

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
    }


    const handlesbumit = (e) => {
        e.preventDefault();
        sendData(`${API_URL}/data/compte/create`, 'post', {numero, libelle, type, compte_regroupement, "action": "create"}, setResult);
        close_form_modal();
    }


    useEffect(() => {
        if(isVisible){
            show_form_modal();
        }
    }, [isVisible])

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
                                        <input type="radio" value={item['id']} name="compte_regroupement" id="compte_regroupement" onChange={(e) => setCompteRegroupement(e.target.value)}/>
                                    {item['numero']}
                                    </label>
                                </div>
                            </div>
                        ))
                
                    : null
                }

                {/* Button d'envoi du formulaire */}
                <button type="submit" className='bg-blue-500 text-white py-2 px-4 my-2 rounded-sm cursor-pointer duration:200 ease-in-out hover:bg-blue-600'>
                    <span className='icone'>
                        <i className='fas fa-plus'></i>
                        Ajouter
                    </span>
                </button>

            </form>

        </div>
        

    </div>
  )
}
