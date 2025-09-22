import React, { useEffect } from 'react'
import './Dashboard.css'
import Calendrier from '../../Composants/Calendrier/Calendrier';

export default function Dashboard() {

  useEffect(() => {
    document.title = 'Tableau de bord';
  }, [])

  return (
    <section id='dashboard' className='w-full h-full'>

      <div className='w-full h-full flex gap-2'>
        <div className='container-count w-1/6 h-full bg-blue-200 flex flex-wrap justify-center items-center gap-2'>
          <div className='bg-white h-40 w-5/6 rounded-xl shadow-lg'></div>
          <div className='bg-white h-40 w-5/6 rounded-xl shadow-lg'></div>
          <div className='bg-white h-40 w-5/6 rounded-xl shadow-lg'></div>
          <div className='bg-white h-40 w-5/6 rounded-xl shadow-lg'></div>
        </div>

        {/* Les graphiques */}
        <div className='container-chart w-3/6 h-full flex items-center justify-center flex-wrap gap-2'>
          <div className='text-2xl w-full font-bold text-2xl text-gray-400'>
            <p>Tableau de bord</p>
          </div>
          <div className='w-180 h-85 bg-white rounded-xl shadow-xl'></div>
          <div className='w-78 h-70 bg-green-600 rounded-xl shadow-xl'></div>
          <div className='w-78 h-70 bg-red-200 rounded-xl shadow-xl'></div>
        </div>

        <div className='relative mr-4 container-chart w-2/6 h-full p-2'>

          <div className='w-full h-16 bg-white rounded-lg flex items-center'>

            <div className='ml-2 w-15 h-15 flex items-center justify-center'>
                <span className='icon'>
                  <i className='fas fa-user text-3xl/8'></i>
                </span>
            </div>

            
            <div className=''>
              <p className='font-semibold text-base italic'>Auditeur : MILAMANA Darcy</p>

            </div>
            
          </div>

          <div className='container-planification-reunion h-9/10 mt-2'>
            <p className='text-center font-semibold italic text-xl underline'>Enregistrer un evenement</p>
            <form>

              <div className='field'>
                  <div className='control'>
                    <label className='label'>Date de l'evenement</label>
                    <input type="date" className='input'/>
                  </div>
              </div>

              <div className='field'>
                  <div className='control'>
                    <label className='label'>Date de l'evenement</label>
                    <textarea name="" className='textarea' placeholder="Description de l'evenement(reunion, ...)"></textarea>
                  </div>
              </div>
              <button className='bg-black text-white py-2 px-4 rounded-lg cursor-pointer mx-4 my-2'>Planifier</button>
            </form>
            <Calendrier />
          </div>
          

        </div>

      </div>

    </section>
  )
}
