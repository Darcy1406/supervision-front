import React, { useState } from 'react'
import BtnChoice from '../../../../Composants/BtnChoice/BtnChoice'
import Modal from '../../../../Composants/Modal/Modal';
import SaveFile from '../../../../Composants/Save-File/SaveFile';

export default function Sje() {
  const [isVisible, setIsVisible] = useState(false);

  const [doc, setDoc] = useState(null); // Va stocker les informations sur le document et le document lui-meme

  return (
    <div id='sje' className='h-full'>

      <div className='bg-gray-300 mt-2 p-4'>
        <p className='titre'>SITUATION JOURNALIERE de l'ENCAISSE</p>
      </div>

      <div className='flex gap-4 justify-center items-center'>

        <div className='w-2/3 container-form'>

          <div className="flex gap-4">

            {/* Date du sje */}
            <div className="w-1/2">
                <label className="label">Date du SJE</label>
                <input type="date" className="input" />
            </div>

              {/* Poste comptable */}
            <div className="flex-1">
                <label className="label">Poste Comptable</label>
                <input list='poste_comptable' className="input" placeholder='Choisissez le poste comptable'/>
                <datalist id='poste_comptable'>

                </datalist>
            </div>

          </div>

          {/* Report journee anterieure */}
          <div className="field">
                <div className="control">
                  <label className="label">Report journee anterieur</label>
                  <input type="text" className="input" />
                </div>
              </div>


          <div className='flex gap-4'>

            <fieldset className='w-1/2 border border-gray-300 p-4 rounded-xl'>

              <legend className='mx-6'>Recettes</legend>

              {/* Recettes propes */}
              <div className="field">
                <div className="control">
                  <label className="label">Recettes propres</label>
                  <input type="text" className="input" />
                </div>
              </div>

              {/* Approvisionnement de fonds */}
              <div className="field">
                <div className="control">
                  <label className="label">Approvisionnement de fonds</label>
                  <input type="text" className="input" />
                </div>
              </div>

              {/* Degagement de fonds effectuees par la RAF */}
              <div className="field">
                <div className="control">
                  <label className="label">Degagement de fonds effectuees par la RAF</label>
                  <input type="text" className="input" />
                </div>
              </div>

            </fieldset>

            <fieldset className="flex-1 border border-gray-300 p-4 rounded-xl">
              <legend className='mx-6'>Depenses</legend>

              {/* Degagements de fonds */}
              <div className="field">
                <div className="control">
                  <label className="label">Degagements de fonds</label>
                  <input type="text" className='input' />
                </div>
              </div>

              {/* Depenses */}
              <div className="field">
                <div className="control">
                  <label className="label">Depenses</label>
                  <input type="text" className='input' />
                </div>
              </div>

            </fieldset>

          </div>

          <div className="field">
            <div className="control">
              <label className='label'>Encaisse fin de journee</label>
              <input type="text" className='input'/>
            </div>
          </div>


        </div>

        <div className='flex-1'>

          <ul className=''>
            <li className='my-4 text-xl'>Total recettes : </li>
            <li className='my-4 text-xl'>Total depenses : </li>
            <li className='my-4 text-xl'>Solde :  </li>
          </ul>

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

            : <BtnChoice setIsvisible={setIsVisible}/>
          }


          <div className="container-btn-validation my-4">
            <button className='button is-dark is-block mx-auto'>
              <span className="icon mx-1">
                <i className="fas fa-check-circle"></i>
              </span>
              Valider
            </button>
          </div>

        </div>

        <Modal isVisible={isVisible} setIsvisible={setIsVisible}>
          <SaveFile type_piece="SJE" setFichier={setDoc}/>
        </Modal>

      </div>


    </div>
  )
}
