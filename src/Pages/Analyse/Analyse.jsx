import React, { useEffect, useState } from 'react'
import Abc from './Composants/Abc';
import Cde from './Composants/Cde';
import Fgh from './Composants/Fgh';

export default function Analyse() {

  const [liste_piece, setListePiece] = useState(['ABC', 'CDE', 'FGH', 'IJK', 'LMN'])
  const [piece, setPiece] = useState("")

  const piece_a_analyser = (piece) => {
    setPiece(piece);
  }


  useEffect(() => {
    document.title = "Analyse des donnees";
  }, [])


  return (
    <section id='analyse' className='bg-green-200 h-full'>

        <div className='bloc-type-doc bg-green-100 flex gap-6 justify-center items-center p-2'>

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
          
        <div className='body-analyse'>
          {
            piece && piece == 'ABC' ?
              <Abc />
            : piece && piece == 'CDE' ?
              <Cde />
            : piece && piece === 'FGH' ?
              <Fgh />
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
