import React from 'react'
import './Confirmation.css'

export default function Confirmation({supprimer, setIsvisible}) {
  return (
    <div id='confirmation'>

        <p className='is-block text-5xl/18 text-red-400 text-center my-4'>
            <span className='border-4 border-red-400 rounded-full is-inline-block w-20 h-20'>
                <i className="fas fa-trash"></i>
            </span>
        </p>

        <p className='text-center text-red-400 font-bold text-4xl'>Suppression</p>

        <p className='text-center my-4 text-lg'>Voulez-vous-procedez à la suppression des données ?</p>

        <div className='flex gap-4 items-center justify-center'>
            <button className='button is-danger' onClick={supprimer}>Oui</button>
            <button className='button is-link' onClick={() => setIsvisible(false)}>Non</button>
        </div>

    </div>
  )
}
