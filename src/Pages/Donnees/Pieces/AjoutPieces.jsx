import React, { useEffect, useRef, useState } from 'react'
import './AjoutPieces.css';
import { sendData } from '../../../functions/sendData';
import { API_URL } from '../../../Config';
import { getCSRFToken } from '../../../utils/csrf';

export function AjoutPieces({isVisible, setIsvisible, data=[], setData, refresh, setRefresh}) {

    const ref_close_modal = useRef(null);
    const ref_form_modal = useRef(null);
    const btn_form = useRef(null);

    const [nom_piece, setNomPiece] = useState("");
    const [periode, setPeriode] = useState("");
    const [id, setId] = useState("");

    const [result, setResult] = useState("");


    const show_form_modal = () => {
        ref_form_modal.current.classList.add('show');
    }
    

    const close_form_modal = () => {
        ref_form_modal.current.classList.remove('show');
        setIsvisible(!isVisible);
        setData([])
        setNomPiece("");
        setPeriode("");
    }


    // const send_ajout = () => {
    // }


    const handlesbumit = (e) => {
        e.preventDefault();
        if(btn_form.current.textContent == 'Ajouter'){
            sendData(`${API_URL}/data/piece/create`, 'POST', {nom_piece, periode}, setResult);
            
            // setRefresh(!refresh)
        }
        else{
            sendData(`${API_URL}/data/piece/update`, 'PUT', {id, nom_piece, periode}, setResult);
        }
        // const timer =setTimeout(() => {
        close_form_modal();
        // }, 150)
        // clearTimeout(timer)
    }


    const update_data = (e) => {
        e.preventDefault();
        const csrftoken = getCSRFToken();
        fetch(`${API_URL}/data/piece/update`,{
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken, // ✅ envoie du token CSRF
            },
            credentials: "include", // important pour que le cookie soit envoyé
            body: JSON.stringify({
                id,
                nom_piece,
                periode
            })
        })
        .then(res => {
            if(!res.ok){
                throw new Error('Erreur HTTP : ' + res.status);
            }
            return res.json();
        })  
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    
    const get_data = () => {
        setNomPiece(data[0].nom_piece);
        setPeriode(data[0].periode);
        setId(data[0]['id']);
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
    <div id='ajout_piece' ref={ref_form_modal}>

        <div className="container-form w-130 h-90 bg-white mx-auto my-2 p-2 rounded-xl shadow-2xl border-2-b border-blue-400">

            <span className='block text-right is-marginless cursor-pointer' ref={ref_close_modal} onClick={close_form_modal}>
                <i className='fas fa-times-circle block text-xl text-red-600 duration:150 ease-in-out hover:text-red-700'></i>
            </span>

            <p className='text-center my-2 text-2xl font-semibold'>Ajouter une pièce</p>

            <form onSubmit={(e) => { handlesbumit(e); setRefresh(!refresh) } } className='px-8'>
                <div className='field'>
                    <div className="control">
                        <label className="label">Nom</label>
                        <input type="text" className="input" placeholder='Entrer le nom de la pièce' value={nom_piece} onChange={(e) => setNomPiece(e.target.value)}/>
                    </div>
                </div>
                <div className='field'>
                    <div className="control">
                        <label className="label">Période</label>
                        <select name="" id="" className='bg-white w-full border border-gray-100 py-2 px-4 rounded-sm shadow-sm cursor-pointer' value={periode} onChange={(e) => setPeriode(e.target.value)}>
                            <option value="">Choisissez la période de rendu de la pièce</option>
                            <option value="Journalière">Journalière</option>
                            <option value="Décadaire">Décadaire</option>
                            <option value="Mensuel">Mensuel</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className={ data.length > 0 ? 'bg-black cursor-pointer px-4 py-2 text-white rounded-sm my-2' : 'bg-blue-500 cursor-pointer px-4 py-2 text-white rounded-sm my-2'} ref={btn_form}>
                    <span className='icone mx-1'>
                        <i className={ data.length > 0 ? 'fas fa-check' : 'fas fa-plus'}></i>
                    </span>     
                    { data.length > 0 ? 'Valider' : 'Ajouter' }
                </button>
            </form>
        </div>
    </div>
  )
}
