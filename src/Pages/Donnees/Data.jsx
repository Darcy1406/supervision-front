import React from 'react'
import Pieces from './Pieces/Pieces'

export default function Data() {
  return (
    <section id="data">
      <h1 className='title is-3 mt-2 mb-0 text-center'>Gestion des données</h1>

      <div className='container-data-name py-4'>
        <select name="" id="" className='bg-white px-4 py-2 ml-2 cursor-pointer shadow-lg rounded-sm' value="Pièces">
          <option value="" disabled>Choisissez les donnees que vous voulez traitez</option>
          <option value="Pièces">Pièces</option>
          <option value="Comptes">Comptes</option>
        </select>
      </div>

      <div className='bg-green-500 w-full h-136'>
        <Pieces />
      </div>

    </section>
  )
}
