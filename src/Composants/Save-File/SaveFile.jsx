import { useEffect, useState } from 'react'
import { useUserStore } from '../../store/useUserStore';
import { fetchData } from '../../functions/fetchData';
import { API_URL } from '../../Config';

export default function SaveFile({type_piece, setFichier, onRegisterResetFile}) {
    const user = useUserStore((state) => state.user);

    const [file, setFile] = useState({
        "piece": type_piece,
        "poste_comptable": "",
        "periode": "",
        "exercice": "",
        "mois": "",
        "decade": "",
        "date_arrivee": "",
        "fichier": "",
        "nom_fichier": "",
        "type_fichier": "",
    })

    const [postes_comptables, setPostesComptables] = useState(null); // Va stoker tous les postes comptables liees aux auditeurs
    const [periode, setPeriode] = useState("");


    const handleChange = (item, value) => {
        setFile(prev => ({
            ...prev,
            [item]: value,
          }));
    }


    const reset_file = () => {
        Object.keys(file).forEach(item => {
            if(item != "piece"){
                handleChange(item, "");
            }
        })
    }


    const selectedFile = () => {
        const file = document.querySelector('.file-input-doc').files[0];
        handleChange("fichier", file);
        handleChange("type_fichier", file.name.split(".")[file.name.split(".").length - 1]);
        handleChange("nom_fichier", file.name)
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        setFichier(file);
        reset_file();
    }


    const obtenir_periode_piece = () => {
        fetchData(`${API_URL}/data/piece/periode`, 'post', {'action': 'recuperer_periode_piece', 'piece': type_piece}, setPeriode)
    }


    useEffect(() => {
        if(type_piece != ""){

            fetchData(`${API_URL}/users/poste_comptable/get`, 'POST', {"utilisateur_id": user[0]['id'], "piece": type_piece.toUpperCase(), 'action': 'afficher_les_postes_comptables_specifique_a_une_piece'}, setPostesComptables)
            handleChange('piece', type_piece)

            obtenir_periode_piece();
        }

    }, [type_piece])


    useEffect(() => {
        if(periode != ""){
            handleChange('periode', periode[0])
        }
    }, [periode])


    // useEffect(() => {
    //     onRegisterResetFile(reset_file);
    // }, [onRegisterResetFile])


  return (
    <div id='save-file'>

      <p className='text-center text-xl font-semibold italic mb-2 mt-4'>Enregistrer un fichier</p>

      <form className='px-4' onSubmit={(e) => handleSubmit(e)}>

        {/* Piece */}
        <div className="field">
            <div className="control">
                <label className="label">Pièce</label>
                <input type="text" className='input' placeholder='Entrer le type du pièce' value={file['piece']} onChange={() => {}} required/>
            </div>
        </div>

        {/* Poste comptable */}
        <div className="field">
            <div className="control">
                <label className="label">Poste comptable</label>
                <input list='poste_comptable' className='input' placeholder='Choisissez le poste comptable' value={file['poste_comptable']} onChange={(e) => handleChange('poste_comptable', e.target.value)}/>
                <datalist id='poste_comptable'>
                    {
                        postes_comptables && postes_comptables.map((item, index) => (
                            // <option value={item["id"]} key={index}>{ item['nom_poste_comptable'] + " " + item["prenom_poste_comptable"] }</option>
                            <option value={item['nom_poste']} key={index} />
                        ))
                    }

                </datalist>

            </div>
        </div>

        <div className="flex gap-4">

            {/* Periode */}
            <div className="field flex-1">
                <div className="control">
                    <label className="label">Période</label>
                    <select name="" id="" className='border border-gray-300 rounded-sm w-full p-2 cursor-pointer' value={file['periode']} onChange={(e) => handleChange('periode', e.target.value)} required>
                        <option value="" disabled></option>
                        <option value="Journalière">Journalière</option>
                        <option value="Décadaire">Décadaire</option>
                        <option value="Mensuelle">Mensuelle</option>
                    </select>
                </div>
            </div>

            {/* Exercice */}
            {
                file['periode'] != 'Journalière' && (
                    <div className="field w-1/3">
                        <div className="control">
                            <label className="label">Exercice</label>
                            <select name="" id="" className='border border-gray-300 rounded-sm w-full p-2 cursor-pointer' value={file['exercice']} onChange={(e) => handleChange('exercice', e.target.value)}>
                                <option value="" disabled></option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                            </select>
                        </div>
                    </div>
                )
            }

            {
                file['periode'] != 'Journalière' && (

                    <div className="field w-1/3">
                        <div className="control">
                            <label className="label">Mois</label>
                            <select name="" id="" className='border border-gray-300 rounded-sm w-full p-2 cursor-pointer' value={file['mois']} onChange={(e) => handleChange('mois', e.target.value)}>
                                <option value="" disabled></option>
                                <option value="1">Janvier</option>
                                <option value="2">Février</option>
                                <option value="3">Mars</option>
                                <option value="4">Avril</option>
                                <option value="5">Mai</option>
                                <option value="6">Juin</option>
                                <option value="7">Juillet</option>
                                <option value="8">Aout</option>
                                <option value="9">Septembre</option>
                                <option value="10">Octobre</option>
                                <option value="11">Novembre</option>
                                <option value="12">Décembre</option>
                            </select>
                        </div>
                    </div>

                )
            }   

        </div>

        {/* Decade */}
        {
            file['periode'] == "Décadaire" ?
                <div className="field">
                    <div className="control">
                        <label className="label">Décade</label>
                        <select name="" id="" className='border border-gray-300 rounded-sm w-full p-2 cursor-pointer' value={file['decade']} onChange={(e) => handleChange('decade', e.target.value)}>
                            <option value="" disabled>Choisissez le décade du document</option>
                            <option value="1ère décade">1ère</option>
                            <option value="2ème décade">2ème</option>
                            <option value="3ème décade">3ème</option>
                        </select>
                    </div>
                </div>
            : null
        }

        {/* Date d'arrivee du document */}
        <div className="field">
            <div className="control">
                <label className="label">Date d'arrivée</label>
                <input type="date" className='input' value={file['date_arrivee']} onChange={(e) => handleChange('date_arrivee', e.target.value)} required/>
            </div>
        </div>

        {/* Fichier */}
        <div className="field mt-5">
            <div className="control">
                <label className='label'>Fichier</label>
                <div className="flex items-center gap-4">
                    <div className="file">
                        <label className="file-label">
                            <input type="file" className="file-input file-input-doc" onChange={selectedFile} required/>
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
                    {
                        file['nom_fichier'] != "" ?
                            <div className=''>
                                <span>{file['nom_fichier']}</span>
                            </div>
                        : null
                    }
                </div>
            </div>
        </div>

        <div className='mt-5'>
            <button className='bg-green-400 px-5 py-2 rounded-lg shadow-sm cursor-pointer duration-150 ease-out hover:bg-green-500'>
                Importer
            </button>
        </div>

      </form>
    </div>
  )
}