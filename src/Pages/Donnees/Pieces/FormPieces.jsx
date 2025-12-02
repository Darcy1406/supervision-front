import { useEffect, useRef, useState } from 'react'
import './Pieces.css';
import { sendData } from '../../../functions/sendData';
import { API_URL } from '../../../Config';
import { getCSRFToken } from '../../../utils/csrf';
import { fetchData } from '../../../functions/fetchData';
// import { isVisible } from '@testing-library/user-event/dist/utils';

export function FormPieces({setIsVisible, isVisible, data=[], setData, refresh, setRefresh, setMessage, message}) {
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

    const [type_postes, setTypePostes] = useState(null);


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
    

    const reset_data = () => {
        setData([]);
        setTypePosteComptable([]);
        setNomPiece("");
        setPeriode("");
    }

    const close_form_modal = () => {
        // ref_form_modal.current.classList.remove('show');
        setIsVisible(false);
        reset_data()
    }


    // Cette fonction va soumettre (submit) le formulaire
    const handlesbumit = (e) => {
        e.preventDefault();
        if(btn_form.current.textContent == 'Ajouter'){
            sendData(`${API_URL}/data/piece/create`, 'POST', {'action': 'ajouter_piece', nom_piece, periode, "poste_comptable": type_poste_comptable}, setResult);
        }
        else{
            sendData(`${API_URL}/data/piece/update`, 'PUT', {id, nom_piece, periode, "poste_comptable": type_poste_comptable}, setResult);
            setData([]);
            setTypePosteComptable([]);
        }
        close_form_modal();
    }


    // Cette fonction va recuperer les types de postes comptables liees au piece a modifier
    const recuperer_les_postes_liees_au_piece_a_modifier = () => {
        sendData(`${API_URL}/users/poste_comptable/selectionner_poste_piece`, 'post', {'action': 'selectionner_poste_piece', 'piece': data[0].nom_piece}, setPostes);
    }

    
    // Cette fonction va placer les valeurs a modifier dans les states adequats
    const get_data = () => {
        setNomPiece(data[0].nom_piece);
        setPeriode(data[0].periode);
        setId(data[0]['id']);
    }


    useEffect(() => {
        if(data.length > 0){
            get_data();
            recuperer_les_postes_liees_au_piece_a_modifier();
        }
    }, [data])


    useEffect(() => {
        if(data.length > 0 && postes){          
            setTypePosteComptable(postes);
        }
    }, [data, postes])



    useEffect(() => {
        if(result){
            setRefresh(!refresh);
            setMessage(result);
        }
    }, [result])


    useEffect(() => {
        fetchData(`${API_URL}/users/poste_comptable/type`, 'GET', {}, setTypePostes)
    }, [])


    useEffect(() => {
        if(!isVisible){
            reset_data()
        }
    }, [isVisible])



  return (
    <>

            <p className='text-center my-2 text-2xl font-semibold'>
                {
                    data.length > 0 ?
                        'Modifier une pièce'
                    : 'Ajouter une pièce'
                }
            </p>

                {/* Formulaire */}
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
                            <option value="Mensuelle">Mensuelle</option>
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
