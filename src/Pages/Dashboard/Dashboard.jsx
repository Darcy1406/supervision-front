import React, { useEffect } from 'react'
import './Dashboard.css'

export default function Dashboard() {

  useEffect(() => {
    document.title = 'Tableau de bord';
  }, [])

  return (
    <section id='dashboard' className='w-full h-full'>

      <div className='w-full h-full flex gap-2'>
        <div className='container-count w-1/5 h-full bg-blue-200 flex flex-wrap justify-center items-center gap-2'>
          <div className='bg-white h-40 w-5/6 rounded-xl shadow-lg'></div>
          <div className='bg-white h-40 w-5/6 rounded-xl shadow-lg'></div>
          <div className='bg-white h-40 w-5/6 rounded-xl shadow-lg'></div>
          <div className='bg-white h-40 w-5/6 rounded-xl shadow-lg'></div>
        </div>

        <div className='container-chart w-3/5 h-full flex items-center justify-center flex-wrap gap-2'>
          <div className='w-180 h-85 bg-white rounded-xl shadow-xl'></div>
          <div className='w-80 h-85 bg-white rounded-xl shadow-xl'></div>
          <div className='w-100 h-85 bg-white rounded-xl shadow-xl'></div>
        </div>

        <div className='mr-4 container-chart w-1/5 h-full p-2'>

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

        </div>

      </div>

    </section>
  )
}
