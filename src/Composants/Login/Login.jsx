import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import './Login.css'


export default function Login() {

  const [captchaToken, setCaptchaToken] = useState(null);
  const [identifiant, setIdentifiant] = useState("")
  const [role, setRole] = useState("")
  const [password, setPassword] = useState("")


  async function fetchCsrfToken() {
    const response = await fetch("http://127.0.0.1:8000/api/csrf/", {
      credentials: "include"  // pour recevoir le cookie
    });
    // le cookie csrftoken est maintenant dans le navigateur
  }


  const send_login = (e) => {
    e.preventDefault();

    if(!captchaToken){
      alert("Veuillez valider le reCAPTCHA");
      return
    }

    const csrftoken = document.cookie.split("; ").find((row) => row.startsWith("csrftoken="))?.split("=")[1];

    const formData = new FormData();
    formData.append('identifiant', identifiant)
    formData.append('password', password)
    formData.append('role', role)
    formData.append('token', captchaToken)

    fetch("http://127.0.0.1:8000/users/login", {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken, // ✅ envoie du token CSRF
      },
      credentials: "include", // important pour que le cookie soit envoyé
      body: JSON.stringify({
        identifiant,
        password,
        token: captchaToken
      }),
    })
    .then(response => {
      if(!response.ok){
        throw new Error('Error HTTP' + response.status)
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log('Erreur : ', error);
    });
  }

  return (
    <div className='flex items-center justify-center w-screen h-screen bg-gray-50'>
        <div>

          <p className='text-3xl text-center font-bold'>Connexion</p>
          <span className='block text-center mb-6'>Connectez-vous a votre compte</ span>

          <div className='w-125 h-140 py-4 px-6 rounded-xl bg-white shadow-md'>

            <p className='font-bold text-2xl mb-2'>Se connecter</p>
            <span>Entrez vos identifiants pour acceder a votre compte</span>

            <form onSubmit={(e) => send_login(e)}>

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
              <div className='my-4'>
                <label htmlFor="" className='block mb-2 font-semibold'>Rôle</label>
                <select name="" id="" className='border border-gray-200 block w-full p-2 rounded-lg' defaultValue={role} onChange={(e) => setRole(e.target.value)} required>
                  <option value="" disabled>Quel est votre rôle</option>
                  <option value="Auditeur">Auditeur</option>
                  <option value="Chef d'Unité">Chef d'Unité</option>
                </select>
              </div>

              <ReCAPTCHA 
                sitekey='6LeVF8srAAAAALAiB0y2lXFh1y8facfBKsJU-Foq'
                onChange={setCaptchaToken}
              />

              <NavLink to='/inscription' style={{ textDecoration: 'underline' }} className='block my-4 float-right'>S'inscrire</NavLink>

              <button className='bg-black w-full text-white py-2 rounded-xl cursor-pointer duration-150 hover:text-lg'>Se connecter</button>

            </form>
            
          </div>
        </div>
    </div>
  )
}
