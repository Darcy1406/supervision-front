import { useEffect, useRef, useState } from 'react'
import './Pieces.css';
import { sendData } from '../../../functions/sendData';
import { API_URL } from '../../../Config';
import { getCSRFToken } from '../../../utils/csrf';
import { fetchData } from '../../../functions/fetchData';
// import { isVisible } from '@testing-library/user-event/dist/utils';

export function FormPieces({setIsVisible, data=[], setData, refresh, setRefresh, setMessage, message}) {
    // const [refresh, setRefresh] = useState(true); // State utile pour relancer les fetch()

    const ref_close_modal = useRef(null);
    const ref_form_modal = useRef(null);
    const btn_form = useRef(null);

    const [nom_piece, setNomPiece] = useState("");
    const [periode, setPeriode] = useState("");
    const [id, setId] = useState("");

    const [result, setResult] = useState(message);

    const [type_poste_comptable, setTypePosteComptable] = useState([]);

    const [postes, setPostes] = useState(null); // State pour stocker les postes liees au piece a modifier


    const add_type_poste = (value, isChecked) => {

        if(isChecked){
            const nvTab = [...type_poste_comptable, value]
            setTypePosteComptable(nvTab);
        }
        else{
            const nvTab = [...type_poste_comptable]
            const filter = nvTab.filter(poste => {
                if(poste == value){
                    return false;
                }
                return true;
            })
            setTypePosteComptable(filter);
            
        }
    }


    const handleChange = (item, value) => {
        setTypePosteComptable(prev => ({
            ...prev,
            [item]: value,
          }));
    }


    const show_form_modal = () => {
        ref_form_modal.current.classList.add('show');
    }
    

    const close_form_modal = () => {
        // ref_form_modal.current.classList.remove('show');
        setIsVisible(false);
        setData([]);
        setTypePosteComptable([]);
        setNomPiece("");
        setPeriode("");
    }


    // const send_ajout = () => {
    // }


    const handlesbumit = (e) => {
        e.preventDefault();
        if(btn_form.current.textContent == 'Ajouter'){
            sendData(`${API_URL}/data/piece/create`, 'POST', {'action': 'ajouter_piece', nom_piece, periode, "poste_comptable": type_poste_comptable}, setResult);
            // setRefresh(!refresh)
        }
        else{
            sendData(`${API_URL}/data/piece/update`, 'PUT', {id, nom_piece, periode, "poste_comptable": type_poste_comptable}, setResult);
            setData([]);
            setTypePosteComptable([]);
        }
        // console.log(type_poste_comptable);
        close_form_modal();
    }


    const update_data = (e) => {
        e.preventDefault();

        // const csrftoken = getCSRFToken();
        // fetch(`${API_URL}/data/piece/update`,{
        //     method: 'PUT',
        //     headers: {
        //         "Content-Type": "application/json",
        //         "X-CSRFToken": csrftoken, // ✅ envoie du token CSRF
        //     },
        //     credentials: "include", // important pour que le cookie soit envoyé
        //     body: JSON.stringify({
        //         id,
        //         nom_piece,
        //         periode
        //     })
        // })
        // .then(res => {
        //     if(!res.ok){
        //         throw new Error('Erreur HTTP : ' + res.status);
        //     }
        //     return res.json();
        // })  
        // .then(data => {
        //     console.log(data);
        // })
        // .catch(error => {
        //     console.log(error);
        // })
    }


    const recuperer_les_postes_liees_au_piece_a_modifier = () => {
        sendData(`${API_URL}/users/poste_comptable/selectionner_poste_piece`, 'post', {'action': 'selectionner_poste_piece', 'piece': data[0].nom_piece}, setPostes);
    }

    
    const get_data = () => {
        setNomPiece(data[0].nom_piece);
        setPeriode(data[0].periode);
        setId(data[0]['id']);
    }


    useEffect(() => {
        // if(isVisible){
        //     show_form_modal();
        // }
        if(data.length > 0){
            get_data();
            recuperer_les_postes_liees_au_piece_a_modifier();
        }
    }, [data])


    useEffect(() => {
        if(data.length > 0 && postes){          
            setTypePosteComptable(postes);
            // console.log('poste', postes);
        }
    }, [data, postes])


    // useEffect(() => {
    //     if
    //     console.log('type', type_poste_comptable);
    // }, [isVisible])



    useEffect(() => {
        if(result){
            setRefresh(!refresh);
            setMessage(result);
        }
    }, [result])


    // const {data: poste} = useFetch(`${API_URL}/users/poste_comptable/type`, 'GET', {}, refresh);
    const [type_postes, setTypePostes] = useState(null);
    // console.log(poste);


    useEffect(() => {
        fetchData(`${API_URL}/users/poste_comptable/type`, 'GET', {}, setTypePostes)
    }, [])



  return (
    <>

            {/* <span className='block text-right is-marginless cursor-pointer' ref={ref_close_modal} onClick={close_form_modal}>
                <i className='fas fa-times-circle block text-xl text-red-600 duration:150 ease-in-out hover:text-red-700'></i>
            </span> */}

            <p className='text-center my-2 text-2xl font-semibold'>
                {
                    data.length > 0 ?
                        'Modifier une pièce'
                    : 'Ajouter une pièce'
                }
            </p>

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

                <div className="field">
                    <div className="control">
                        <label className='label'>Qui sont les postes comptables pouvant rendre la piece ?</label>

                        <div className='flex gap-4 flex-wrap'>

                            {
                                type_postes && type_postes.map((item, index) => (
                                    <label key={index} htmlFor="">
                                        <input 
                                            type="checkbox" 
                                            value={item['poste']} 
                                            checked={type_poste_comptable.includes(item['poste'])}
                                            onChange={(e) => add_type_poste(e.target.value, e.target.checked) }
                                        />
                                        {item['poste']}
                                    </label>
                                ))
                            }

                        </div>

                    </div>
                </div>

                <button className={ data.length > 0 ? 'button is-dark' : 'button is-link'} ref={btn_form} disabled={nom_piece == "" || periode=="" || type_poste_comptable.length == 0}>
                    <span className='icone mx-1'>
                        <i className={ data.length > 0 ? 'fas fa-check' : 'fas fa-plus'}></i>
                    </span>     
                    { data.length > 0 ? 'Valider' : 'Ajouter' }
                </button>
            </form>
    </>
  )
}
