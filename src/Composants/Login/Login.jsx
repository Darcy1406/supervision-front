import React, { useReducer, useState } from 'react'
import { NavLink, Router, useLocation, useNavigate } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import './Login.css'
import { API_URL } from '../../Config'
import { getCSRFToken } from '../../utils/csrf'
import { useAuthentification } from '../../hooks/useAuthentification'
import { Alert } from '../Alert/Alert'


export default function Login() {

  const [result, setResult] = useState(null);

  const [captchaToken, setCaptchaToken] = useState(null);
  const [identifiant, setIdentifiant] = useState("")
  // const [role, setRole] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const navigate = useNavigate();


  // async function fetchCsrfToken() {
  //   const response = 
  //   // le cookie csrftoken est maintenant dans le navigateur
  // }

  const { login } = useAuthentification()

  return (
    <section id='login'>

      <div className='flex items-center justify-center w-screen h-screen bg-gray-50'>

          <div>

            <p className='text-3xl text-center font-bold'>Connexion</p>
            <span className='block text-center mb-6'>Connectez-vous a votre compte</ span>

            <div className='w-125 h-125 py-4 px-6 rounded-xl bg-white shadow-md'>

              <p className='font-bold text-2xl mb-2'>Se connecter</p>
              <span>Entrez vos identifiants pour acceder a votre compte</span>

              <form onSubmit={(e) => { setResult(null); login(e, identifiant, password, captchaToken, setIsSubmitting, setResult); }}>

                {/* Email */}
                <div className='my-4'>
                  <label htmlFor="" className='block mb-2 font-semibold'>Email</label>
                  <div className='border border-gray-200 p-2 rounded-lg'>
                    <span className='icon mr-2'>
                      <i className='fas fa-user'></i>
                    </span>
                    <input className='inline-block w-88 outline-none' type="text" placeholder='votre@gmail.com' value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} required/>
                  </div>
                </div>
              
                {/* Mot de passe */}
                <div className='my-4'>
                  <label htmlFor="" className='block mb-2 font-semibold'>Mot de passe</label>
                  <div className='border border-gray-200 p-2 rounded-lg'>
                    <span className='icon mr-2'>
                      <i className='fas fa-lock'></i>
                    </span>
                    <input className='inline-block w-88 outline-none' type="password" placeholder='Au mois 8 caracteres' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                  </div>
                </div>

                {/* Rôle */}
                {/* <div className='my-4'>
                  <label htmlFor="" className='block mb-2 font-semibold'>Rôle</label>
                  <select name="" id="" className='border border-gray-200 block w-full p-2 rounded-lg' defaultValue={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="" disabled>Quel est votre rôle</option>
                    <option value="Auditeur">Auditeur</option>
                    <option value="Chef d'Unité">Chef d'Unité</option>
                  </select>
                </div> */}

                <ReCAPTCHA 
                  sitekey='6LeVF8srAAAAALAiB0y2lXFh1y8facfBKsJU-Foq'
                  onChange={setCaptchaToken}
                />

                <NavLink to='/inscription' style={{ textDecoration: 'underline' }} className='block my-4 float-right'>S'inscrire</NavLink>

                <button className='bg-black w-full text-white py-2 rounded-xl cursor-pointer duration-150 hover:text-lg'>
                  { isSubmitting ? "Connexion..." : "Se connecter" }
                </button>

              </form>
              
            </div>
          </div>

      </div>

      {
        result ?
          <Alert message={result} icon='fas fa-exclamation-triangle' bgColor='bg-red-300' setMessage={setResult} borderColor='border-red-400' />
        : null
      }

    </section>
  )
}
