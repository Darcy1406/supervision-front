import React, { useState } from 'react'
import Pieces from './Pieces/Pieces'
import Comptes from './Comptes/Comptes';
import { ListeTranscription } from './Transcription/ListeTranscription'

export default function Data() {

  const [view_data, setViewData] = useState("Pièces");

  return (
    <section id="data">
      <h1 className='title is-3 mb-0 text-center'>Gestion des données</h1>

      <div className='container-data-name py-2'>
        <select value={view_data} onChange={(e) => setViewData(e.target.value)} name="" id="" className='bg-white px-4 py-2 ml-2 cursor-pointer shadow-lg rounded-sm'>
          <option value="" disabled>Choisissez les donnees que vous voulez traitez</option>
          <option value="Pièces">Pièces</option>
          <option value="Comptes">Comptes</option>
          <option value="Transcription">Transcription</option>
        </select>
      </div>

      <div className='w-full h-136'>
        {
          view_data == 'Pièces' ?
            <Pieces />
          : view_data == 'Comptes' ? 
            <Comptes />
          : <ListeTranscription />
        }
      </div>

    </section>
  )
}
