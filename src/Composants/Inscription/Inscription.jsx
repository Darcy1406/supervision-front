import React, { useEffect, useRef, useState } from 'react'
import { Checkbox } from '../Form/Checkbox';
import '../../Assets/Css/output.css';

export default function Inscription() {

    const [role, setRole] = useState("");
    
    const ref_search_comptable = useRef(null);
    const ref_search_auditeur = useRef(null);
    const ref_search_piece = useRef(null);

    const [poste_comptable, setPosteComptable] = useState(['Darcy', 'Tatiana', 'Heurio', 'Bless', 'Comptable 5', 'Comptable 6', 'Comptable 7', 'Comptable 8']);
    const [poste_comptable_slice, setPosteComptableSlice] = useState([]);
    
    const [auditeur, setAuditeur] = useState(['Auditeur 1', 'Essai', 'Test', 'Jacob', 'Aud', 'Pratique']);
    const [auditeur_slice, setAuditeurSlice] = useState([]);

    const [liste_piece, setListePiece] = useState(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5', 'Piece 6', 'Piece 7']);
    const [liste_piece_slice, setListePieceSlice] = useState([]);



    // Cete fonction va se charger de filtrer les postes comptables pour trouver des comptables specifiques a assigner a un auditeur
    const recherche_poste_comptable = () => {

        setPosteComptableSlice(poste_comptable.filter(item => {
            if( ref_search_comptable.current.value && item.includes(ref_search_comptable.current.value)){
                // console.log('search : ' + search + " et item : " + item + "resultat : " + item.includes(search));
                return true
            }
            return false;
        }))
        
    }
    
    
    // Cete fonction va se charger de filtrer les auditeurs pour trouver des comptables specifiques a assigner a un auditeur
    const recherche_auditeur = () => {

        setAuditeurSlice(auditeur.filter(item => {
            if( ref_search_auditeur.current.value && item.includes(ref_search_auditeur.current.value)){
                // console.log('search : ' + search + " et item : " + item + "resultat : " + item.includes(search));
                return true;
            }
            return false;
        }))
        
    }
    
    // Cete fonction va se charger de filtrer les pieces comptables pour trouver des comptables specifiques a assigner a un auditeur
    const recherche_piece = () => {

        setListePieceSlice(liste_piece.filter(item => {
            if( ref_search_piece.current.value && item.includes(ref_search_piece.current.value)){
                // console.log('search : ' + search + " et item : " + item + "resultat : " + item.includes(search));
                return true
            }
            return false;
        }).slice(0, 4))
        
    }


    useEffect(() => {

        if( poste_comptable.length > 4){
            setPosteComptableSlice(poste_comptable.slice(0, 4));
        }
        else{
            setPosteComptableSlice(poste_comptable);
        }

    
    }, [poste_comptable])
    

    useEffect(() => {

        if( auditeur.length > 4){
            setAuditeurSlice(auditeur.slice(0, 4));
        }
        else{
            setAuditeurSlice(auditeur);
        }

    
    }, [auditeur])
    

    useEffect(() => {

        if( liste_piece.length > 4){
            setListePieceSlice(liste_piece.slice(0, 4));
        }
        else{
            setListePieceSlice(auditeur);
        }

    
    }, [liste_piece])



  return (
    <section id='inscription' className='bg-gray-50'>

    <div id='inscription' className='w-1/2 h-screen border-l border-r border-gray-200 mx-auto'>
        <h1 className='title is-3 text-center py-4'>S'inscrire</h1>

            <form className='px-6'>

            {/* Nom */}
            <div className='field'>
                <div className='control'>
                    <label className='label'>Nom</label>
                    <input className='input' type="text" placeholder='votre nom'/>
                </div>
            </div>

            {/* Prenom */}
            <div className='field'>
                <div className='control'>
                    <label className='label'>Prénom(s)</label>
                    <input className='input' type="text" placeholder='votre prenom'/>
                </div>
            </div>

            {/* Email */}
            <div className='field'>
                <div className='control'>
                    <label className='label'>Email</label>
                    <input className='input' type="text" placeholder='adresse@gmail.com'/>
                </div>
            </div>

            {/* Email */}
            <div className='field'>
                <div className='control'>
                    <label className='label'>Rôle</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} name="" id="" className='w-full p-2 border border-gray-200 rounded-sm'>
                        <option value="" disabled selected>Quel est votre rôle ?</option>
                        <option value="Auditeur">Auditeur</option>
                        <option value="Poste comptable">Poste comptable</option>
                    </select>
                </div>
            </div>

            {
                role == "Auditeur" ?
                    <>
                        <div>
                            <input name='search' className='block w-full border-b border-gray-100 p-2 outline-none' type="text" placeholder='Rechercher un poste comptable' onChange={(e) => { recherche_poste_comptable()} } ref={ref_search_comptable}/>
                        </div>

                        <div className='my-2'>
                            <p className='inline-block text-base font-semibold'>Liste des postes comptables :</p>
                            <div className='flex flex-wrap gap-4'>
                                {
                                    poste_comptable_slice.map((item, index) => (
                                        <Checkbox label={item}/>
                                    ))
                                }

                            </div>

                        </div>
                    </>

                : role == "Poste comptable" ?
                    <div>
                        

                        
                        <div>
                            <div className='flex gap-6'>

                                <div className='w-1/2'>
                                    <input name='search' className='block w-full border-b border-gray-100 p-2 outline-none' type="text" placeholder='Rechercher un auditeur' onChange={(e) => { recherche_auditeur()} } ref={ref_search_auditeur}/>
                                </div>

                                <div className='w-1/2'>
                                    <input name='search' className='block w-full border-b border-gray-100 p-2 outline-none' type="text" placeholder='Rechercher une piece' onChange={(e) => { recherche_piece()} } ref={ref_search_piece}/>
                                </div>
                            </div>
                        </div>

                        <div className='my-2'>
                            <p className='inline-block text-base font-semibold'>Liste des auditeurs : </p>
                            <div className='flex flex-wrap gap-4'>
                                {
                                    auditeur_slice.map((item, index) => (
                                        <Checkbox label={item}/>
                                    ))
                                }

                            </div>
                        </div>

                        <div className='my-2'>
                            <p className='inline-block text-base font-semibold'>Liste des pieces a rendre : </p>
                            <div className='flex flex-wrap gap-4'>
                                {
                                    liste_piece_slice.map((item, index) => (
                                        <Checkbox label={item}/>
                                    ))
                                }

                            </div>
                        </div>

                    </div>
                : null
            }


            <button type='submit' className='my-4 bg-blue-500 px-6 py-4 rounded-lg text-white text-base cursor-pointer'>S'inscrire</button>
        </form>

    </div>

    </section>
  )
}
