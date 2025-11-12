import { useEffect, useRef, useState } from 'react'
import './Form.css';
import { fetchData } from '../../../../../functions/fetchData';
import { API_URL } from "../../../../../Config"
import { useUserStore } from '../../../../../store/useUserStore';
import { sendData } from '../../../../../functions/sendData';

export default function ChooseFile({isVisible, setIsvisible, setDocuments}) {

    const user = useUserStore((state) => state.user);
    const choose_file = useRef(null);
    const [refresh, setRefresh] = useState(true);

    const [doc, setDoc] = useState({
        "poste_comptable": "",
        "exercice": "",
        "decade": "",
        "fichier": "",
        "nom_fichier": "",
        "type_fichier": "",
        "date_arrive": ""
    })

    const handleChange = (item, value) => {
        setDoc(prev => ({
            ...prev,
            [item]: value,
          }));
    }


    const selectedFile = () => {
        const file = document.querySelector('.file-input').files[0];
        handleChange("fichier", file);
        console.log(file.name.split(".")[file.name.split(".").length - 1]);
        handleChange("type_fichier", file.name.split(".")[file.name.split(".").length - 1]);
        handleChange("nom_fichier", file.name)
    }


    const send_doc = (e) => {
        e.preventDefault();
        setDocuments(doc);
        close_choose_file();
    } 


    const show_choose_file = () => {
        choose_file.current.classList.add('show');
    }


    const close_choose_file = () => {
        choose_file.current.classList.remove('show');
        setIsvisible(false);
        Object.keys(doc).forEach(item => {
            handleChange(item, "");
        })
    }


    // const {data: postes_comptables} = useFetch(`${API_URL}/users/poste_comptable/get`, 'POST', {"utilisateur": user['id'], "piece": "TSDMT"}, refresh)
    const postes_comptables = ""

    // const send_info_tsdmt = () => {
    //     sendData(`${API_URL}/data/tsdmt/create`, 'POST',)
    // }

    
    
    useEffect(() => {
        if(isVisible){
            show_choose_file();
        }
    }, [isVisible])

  return (
    <div id='choose-file' ref={choose_file}>
      <div className='file-list w-1/3 bg-white mt-8 mx-auto rounded-xl pt-1 px-2 pb-4'>
        
        <span className='is-pulled-right text-red-500 text-xl cursor-pointer duration-150 ease-out hover:text-red-600' onClick={close_choose_file}>
            <i className='fas fa-times-circle'></i>
        </span>

        <p className='text-center text-xl font-semibold italic my-4'>Importer un fichier</p>

        <form onSubmit={(e) => send_doc(e)} className='px-4'>

            <div className='field'>
                <div className="control">
                    <label htmlFor="comptable" className='label'>Poste comptable</label>
                    <input list="comptable" className='input' value={doc['poste_comptable']} onChange={(e) => handleChange('poste_comptable', e.target.value)} placeholder='Veuillez choisir le poste comptable'/>
                    <datalist id="comptable">
                        {
                            postes_comptables && postes_comptables.map((item, index) => (
                                <option value={item["id"]} key={index}>{ item['nom_poste_comptable'] + " " + item["prenom_poste_comptable"] }</option>
                            ))
                        }
                    </datalist>
                </div>
            </div>

            <div className="field">
                <div className="control">
                    <label className='label'>Decade</label>
                    <div className='select is-fullwidth'>
                        <select name="" id="" value={doc['decade']} onChange={(e) => handleChange('decade', e.target.value)}>
                            <option value="1er">1er</option>
                            <option value="2eme">2eme</option>
                            <option value="3eme">3eme</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="field">
                <div className="control">
                    <label className='label'>Exercice</label>
                    <div className="select is-fullwidth">
                        <select name="" id="" value={doc["exercice"]} onChange={(e) => handleChange('exercice', e.target.value)}>
                            <option value="" disabled>Choisissez un exercice</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="field mt-5">
                <div className="control">
                    <div className="file">
                        <label className="file-label">
                            <input type="file" className="file-input" onChange={selectedFile}/>
                            <span className="file-cta">
                                <span className="file-icon">
                                    <i className="fas fa-upload"></i>
                                </span>
                                <span className="file-label">
                                    Choisir un fichier
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="field mt-5">
                <div className="control">
                    <label className="label">Date d'arrivée : </label>
                    <input type="date" value={doc['date_arrive']} onChange={(e) => handleChange('date_arrive', e.target.value)} className='input' />
                </div>
            </div>

            <button className='button is-link my-4'>
                Importer
            </button>

        </form>
      </div>
    </div>
  )
}
