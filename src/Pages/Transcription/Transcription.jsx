import React, { useEffect, useState } from 'react'
// import Tsdmt from './Pieces/Tsdmt/Tsdmt';
import Tsdmt from './Pieces/Tsdmt/Tsdmt';

export function Transcription() {

  const [liste_piece, setListePiece] = useState(['SJE', 'BOD', 'BOV', 'TSDMT', 'BTD', 'BTR', 'BTT'])
  const [piece, setPiece] = useState("")

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
            <button className='bg-blue-400 py-2 px-4 rounded-lg cursor-pointer text-white duration-150 ease-in-out hover:bg-blue-500'>
              <span>
                <i className='fas fa-plus'></i>
              </span>
                Ajouter
            </button>
          </div>

          {
            liste_piece.map((item, index) => (
              <ListePiece onChangeValue={piece_a_analyser} piece={item} key={index}/>
            ))
          }

        </div>
          
        <div className='body-analyse w-312'>
          {
            piece && piece == 'TSDMT' ?
              <Tsdmt />
            : null
          }
        </div>
    </section>
  )
}


function ListePiece({onChangeValue, piece}){
  return(
    <div className='liste-piece'>
      <label>
        <input value={piece} type="radio" name='piece' onChange={() => onChangeValue(piece)}/>
        {piece}
      </label>
    </div>
  )
}
