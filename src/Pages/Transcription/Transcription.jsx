import React, { useEffect, useState } from 'react'
import Tsdmt from './Pieces/Tsdmt/Tsdmt';
import Sje from './Pieces/Sje/Sje'
import { NavLink, useNavigate } from 'react-router-dom';
import Btd from './Pieces/BTD/Btd';
import Btr from './Pieces/BTR/Btr';
import InputNumber from '../../Composants/InputNumber/InputNumber';

export function Transcription() {

  const navigate = useNavigate();

  const [liste_piece, setListePiece] = useState(['SJE', 'BOD', 'BOV', 'TSDMT', 'BTD', 'BTR', 'BTT'])
  const [piece, setPiece] = useState('SJE')

  const piece_a_analyser = (piece) => {
    setPiece(piece);
  }


  useEffect(() => {
    document.title = "Analyse des donnees";
  }, [])


  return (
    <section id='analyse' className='h-full'>

        <div className='bloc-type-doc flex gap-6 justify-center items-center p-2 border-b border-gray-300'>

          <div className='container-ajout-nouveau-doc border-r gray-400 px-2'>
            <button to='../compte_piece' className='bg-blue-400 py-2 px-4 rounded-lg cursor-pointer text-white duration-150 ease-in-out hover:bg-blue-500' onClick={() => navigate('../compte_piece')}>
              <span>
                <i className='fas fa-plus'></i>
              </span>
                Ajouter
            </button>
          </div>

          {
            liste_piece.map((item, index) => (
              <ListePiece onChangeValue={piece_a_analyser} piece_label={item} key={index} piece={piece}/>
            ))
          }

        </div>
          
        <div className='body-analyse w-full'>
          {
            piece == 'TSDMT' ?
              <Tsdmt />
            : piece == 'SJE' ?
              <Sje />
            : piece == 'BTD' ?
              <Btd />
            : piece == 'BTR' ?
              <Btr />
            : null
          }
        </div>
    </section>
  )
}


function ListePiece({onChangeValue, piece_label, piece}){
  return(
    <div className='liste-piece'>
      <label htmlFor={piece_label} className='label'>
        <input value={piece_label} type="radio" id={piece_label} name='piece' onChange={() => onChangeValue(piece_label)} checked={piece_label == piece}/>
        {piece_label}
      </label>
    </div>
  )
}
