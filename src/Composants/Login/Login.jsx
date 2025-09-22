import React from 'react'
import { NavLink } from 'react-router-dom'
import './Login.css'


export default function Login() {
  return (
    <div className='flex items-center justify-center w-screen h-screen bg-gray-50'>
        <div>

          <p className='text-3xl text-center font-bold'>Connexion</p>
          <span className='block text-center mb-6'>Connectez-vous a votre compte</ span>

          <div className='w-125 h-125 py-4 px-6 rounded-xl bg-white shadow-md'>

            <p className='font-bold text-2xl mb-2'>Se connecter</p>
            <span>Entrez vos identifiants pour acceder a votre compte</span>

            <form action="">

              {/* Email */}
              <div className='my-4'>
                <label htmlFor="" className='block mb-2 font-semibold'>Email</label>
                <div className='border border-gray-200 p-2 rounded-lg'>
                  <span className='icon mr-2'>
                    <i className='fas fa-user'></i>
                  </span>
                  <input className='inline-block w-88 outline-none' type="text" placeholder='votre@gmail.com' />
                </div>
              </div>
            
              {/* Mot de passe */}
              <div className='my-4'>
                <label htmlFor="" className='block mb-2 font-semibold'>Mot de passe</label>
                <div className='border border-gray-200 p-2 rounded-lg'>
                  <span className='icon mr-2'>
                    <i className='fas fa-lock'></i>
                  </span>
                  <input className='inline-block w-88 outline-none' type="password" placeholder='Au mois 8 caracteres' />
                </div>
              </div>

              {/* Rôle */}
              <div className='my-4'>
                <label htmlFor="" className='block mb-2 font-semibold'>Rôle</label>
                <select name="" id="" className='border border-gray-200 block w-full p-2 rounded-lg'>
                  <option selected disabled>Quel est votre rôle</option>
                  <option value="">Auditeur</option>
                  <option value="">Chef d'Unité</option>
                </select>
              </div>

              <NavLink to='/inscription' style={{ textDecoration: 'underline' }} className='block my-4 float-right'>S'inscrire</NavLink>

              <button className='bg-black w-full text-white py-2 rounded-xl cursor-pointer duration-150 hover:text-lg'>Se connecter</button>

            </form>
            
          </div>
        </div>
    </div>
  )
}
