import React, { useCallback, useEffect, useRef, useState } from 'react'
import { fetchData } from '../../../../functions/fetchData'
import { API_URL } from '../../../../Config'
import { formatNombreAvecEspaces, formatNumber, paginateData } from '../../../../functions/Function';
import BtnChoice from '../../../../Composants/BtnChoice/BtnChoice';
import Modal from '../../../../Composants/Modal/Modal';
import SaveFile from '../../../../Composants/Save-File/SaveFile';
import { sendDocument } from '../../../../functions/sendDocument';
import { sendData } from '../../../../functions/sendData';
import { Alert } from '../../../../Composants/Alert/Alert';
import Pagination from '../../../../Composants/Pagination/Pagination';
import '../../Transcription.css';
import { useBtdSore } from '../../../../store/useTranscriptionStore';
import InputNumber from '../../../../Composants/InputNumber/InputNumber';

export default function Btd() {
    // const currentPage = useRef(1);
    // const itemsPerPage = useRef(9)
    // const [reload_data, setReloadData] = useState(true);
    // const [data_paginate, setDataPaginate] = useState(null);

    const [refresh, setRefresh] = useState("");

    const [isVisible, setIsvisible] = useState(false);
    const [reset_file, setResetFile] = useState(null);
    const [doc, setDoc] = useState(null);
    const [id_doc, setIdDoc] = useState(null); // Recuperer l'id du document apres enregistrement
    const [result, setResult] = useState(null) // Recuperer le retour depuis l'API (message)

    const [anterieur, setAnterieur] = useState({});
    const [en_cours, setEnCours] = useState({});
    const [cumule, setCumule] = useState({});

    const [comptes, setComptes] = useState(null);

    const [total, setTotal] = useState({
        'anterieur': 0.00,
        'en_cours': 0.00,
        'cumule': 0.00
    });


    const create_dynamic_state = (data, setState) => {
        const initialState = data.reduce((acc, item) => {
            const numero = item['compte__numero'];
            acc[numero] = 0
            return acc;
        }, {});
        setState(initialState);
    }


    const calcul_total_cumule = () => {
        Object.keys(cumule).forEach(compte => {
            const total = (parseFloat(anterieur[compte]) + parseFloat(en_cours[compte]) || 0)
            if(total == 0){
            
                handleChange(compte, 0, setCumule)
            }
            else{
                handleChange(compte, total.toFixed(2).toString(), setCumule);

            }
        })
    }


    const total_data_calculate = (name, nature) => {
        let total = 0
        Object.values(nature).forEach(v => {

            const valeur = Number(String(v || "").replace(/\s/g, "")) || 0;
            total += valeur;
            // console.log('valeur', anterieur[item['compte__numero']]);
        })
        handleChange(name, total.toFixed(2).toString(), setTotal);
    }


    const handleChange = (name, value, setState) => {

        // // Retirer les espaces pour le state
        // const rawValue = value.replace(/\s/g, "");
        // // Si ce n’est pas un nombre, on ignore
        // if (!/^\d*$/.test(rawValue)) return;
  
        setState(prev => ({
          ...prev,
          [name]: value,
        }));
    }


    const handleResetFile = useCallback((fn) => {
        setResetFile(() => fn);
    }, []) 


    const reset_all_montant = (nature, setState) => {
        Object.keys(nature).forEach(key => {
            handleChange(key, 0, setState);
        })
    }


    const CompteItem = ({item}) => {
        const rawValue = anterieur[item['compte__numero']]
        const formattedValue = formatNumber(rawValue);
        return(
            <tr>
                <td>{item['compte__numero']}</td>

                <td>
                    <input 
                        className='w-5/6 outline-none border-b-2 border-gray-300'
                        type="text"
                        inputMode='numeric'
                        name=''
                        id=''
                        value={formattedValue}
                        onChange={(e) => handleChange(item['compte__numero'], e.target.value.replace(/\s/g, ""))}
                    />Ar
                </td>

                <td>
                    <input 
                        className='w-5/6 outline-none border-b-2 border-gray-300'
                        type="text"
                        inputMode='numeric'
                        name=''
                        id=''

                    />Ar
                </td>

                <td>0 Ar</td>
            </tr>
        )
    }
    

    // Enregistrer vers la BD le document (fichier)
    const save_file = () => {
        const formData = new FormData();

        formData.append("fichier", doc['fichier']);
        formData.append("nom_fichier", doc['nom_fichier']);
        formData.append("type_fichier", doc['type_fichier']);
        formData.append("piece", doc['piece']);
        formData.append("poste_comptable", doc['poste_comptable']);
        formData.append("exercice", doc['exercice']);
        formData.append("periode", doc['periode']);
        formData.append("decade", doc['decade']);
        formData.append("mois", doc['mois']);
        formData.append("date_arrivee", doc['date_arrivee']);
        formData.append("action", 'ajouter_un_document');

        sendDocument(formData, setIdDoc);
        
    }


    // Envoyer les informations BTD transcrites
    const send_btd = () => {
        sendData(`${API_URL}/data/transcription/create`, 'POST', {
            'action': 'ajouter_transcription',

            'natures': ['anterieur', 'en_cours', 'cumule', 'total_anterieur', 'total_en_cours', 'total_cumule'],
            'anterieur': anterieur,
            'en_cours': en_cours,
            'cumule': cumule,
            'total_anterieur': total['anterieur'],
            'total_en_cours': total['en_cours'],
            'total_cumule': total['cumule'],

            'id_doc': id_doc,
        }, setResult)

        reset_all_montant(anterieur, setAnterieur);
        reset_all_montant(en_cours, setEnCours);
        reset_all_montant(cumule, setCumule);
        setDoc(null);
    }

    useEffect(() => {
        fetchData(`${API_URL}/data/piece_compte/liste_liaison_pour_une_piece`, 'post', {piece: 'BTD', 'action': 'filtrer_liaison'}, setComptes)
    }, [])


    useEffect(() => {
        if(comptes){
            create_dynamic_state(comptes, setAnterieur)
            create_dynamic_state(comptes, setEnCours)
            create_dynamic_state(comptes, setCumule)
            // paginateData(currentPage.current, itemsPerPage.current, comptes, setDataPaginate, reload_data)
        }
    }, [comptes])


    // useEffect(() => {
    //     if(comptes){
    //         paginateData(currentPage.current, itemsPerPage.current, comptes, setDataPaginate, reload_data)
    //         console.log(totalData);
    //     }
    // }, [comptes, reload_data])

    // useEffect(() => {
    //     setTotalData(total);
    // }, [total])


    useEffect(() => {
        if(comptes){
            calcul_total_cumule();
        }
    }, [anterieur, en_cours])


    useEffect(() => {
        if(comptes){
            
            total_data_calculate('anterieur', anterieur);
            total_data_calculate('en_cours', en_cours);
            total_data_calculate('cumule', cumule);
            
        }
    }, [anterieur, en_cours, cumule])


    useEffect(() => {
        if(doc != null){
          setIsvisible(false);
        }
    }, [doc])


    useEffect(() => {
        if(id_doc != null){
            console.log('id_doc non null', id_doc);
            send_btd();
        }
      }, [id_doc])


  return (
    <div id='btd'>
        <div className='bg-gray-300 mt-2 p-4'>
            <p className="titre">BORDEREAU DE TRANSFERT-DEPENSES</p>
        </div>

        <div className='flex gap-4 justify-center'>

            <div className="container-table w-4/6 h-full" style={{overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(211, 211, 211, 0.8) white'}}>

                <table className='table form-tab is-fullwidth' >
                    <thead>
                        <tr>
                            <th>Compte</th>
                            <th>Anteriéur</th>
                            <th>En cours</th>
                            <th>Cumulé</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            comptes ?
                                comptes.map((item, index) => {
                                // const rawValue = anterieur[item['compte__numero']]
                                const formatted_value_anterieur = formatNombreAvecEspaces(anterieur[item['compte__numero']]);
                                const formatted_value_en_cours = formatNombreAvecEspaces(en_cours[item['compte__numero']]);
                                
                                

                                return(
                                    <tr key={index}>
                                        <td>{item['compte__numero']}</td>

                                        {/* Anterieur */}
                                        <td>

                                            <InputNumber 
                                                value={formatted_value_anterieur}
                                                handleChange={(e) => handleChange(item['compte__numero'], e.target.value.replace(/\s/g, "").replace(/,/g, "."), setAnterieur)}
                                            />Ar

                                        </td>

                                        {/* En cours */}
                                        <td>
                                            {/* <input 
                                                className='w-5/6 outline-none border-b-2 border-gray-300'
                                                type="text"
                                                inputMode='numeric'
                                                name=''
                                                id=''
                                                value={formatted_value_en_cours}
                                                onChange={(e) => handleChange(item['compte__numero'], e.target.value.replace(/\s/g, ""), setEnCours)}

                                            />Ar */}
                                            <InputNumber 
                                                value={formatted_value_en_cours}
                                                handleChange={(e) => handleChange(item['compte__numero'], e.target.value.replace(/\s/g, "").replace(/,/g, "."), setEnCours)}
                                            />Ar
                                        </td>

                                        {/* Cumule */}
                                        <td className='font-semibold w-45 has-text-right'>{formatNombreAvecEspaces(cumule[item['compte__numero']])} Ar</td>
                                    </tr>
                                )
                            })
                            : null
                        }
                    </tbody>

                </table>

                {/* <button onClick={handleScroll}>Teste</button> */}
                {/* <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} liste={comptes} reload={reload_data} setReload={setReloadData}/> */}

            </div>

            <div className='w-2/6 p-4'>
                <p className='text-center text-2xl my-4 font-semibold italic'>Liste récapitulatif</p>

                <fieldset className='border border-gray-400 px-4 py-2 rounded-lg'>
                    <legend className='ml-4 text-xl'>Totaux</legend>
                    <ul className='text-xl'>
                        <li className='my-4'>Antérieur : <strong>{formatNombreAvecEspaces(total['anterieur'])} Ar</strong></li>
                        <li className='my-4'>En cours : <strong>{formatNombreAvecEspaces(total['en_cours'])} Ar</strong></li>
                        <li className='my-4'>Cumulé : <strong>{formatNombreAvecEspaces(total['cumule'])} Ar</strong></li>
                    </ul>
                </fieldset>

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
                    :
                        <BtnChoice setIsvisible={setIsvisible}/>
                }

                <div className='container-btn-validation my-4'>
                    <button 
                        className='button is-dark is-block mx-auto' 
                        onClick={save_file}
                        disabled={doc == null}
                    >
                        <span className='icon mx-1'>
                            <i className='fas fa-check-circle'></i>
                        </span>
                        Valider
                    </button>
                </div>

            </div>

            <Modal isVisible={isVisible} setIsvisible={setIsvisible}>
                <SaveFile type_piece="BTD" setFichier={setDoc} onRegisterResetFile={handleResetFile}/>
            </Modal>

            {
                result ?
                    result['succes'] ?
                        <Alert message={result['succes']} setMessage={setResult} icon='fas fa-check-circle' bgColor='bg-green-300'/>
                    : null
                : null
            }

        </div>
    </div>
  )
}
