import { useNavigate } from "react-router-dom";
import { API_URL } from "../Config";
import { sendData } from "../functions/sendData"
import { getCSRFToken } from "../utils/csrf";
import { useUserStore } from "../store/useUserStore"

export const useAuthentification = () => {
    const navigate = useNavigate()


    const login = async (e, identifiant, password, captchaToken, setIsSubmitting, setResult) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        await fetch(`${API_URL}/users/csrf`, {
          method: "GET",
          credentials: "include"  // pour recevoir le cookie
        });
    
        // if(!captchaToken){
        //   setResult("Veuillez valider le reCAPTCHA");
        //   setIsSubmitting(false)
        //   return
        // }
    
    
        const csrftoken = getCSRFToken();
    
    
        const res = await fetch(`${API_URL}/users/login`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken, // ✅ envoie du token CSRF
          },
          body: JSON.stringify({
            identifiant,
            password,
            captchaToken
            // token: captchaToken
          }),
          credentials: "include", // important pour que le cookie soit envoyé
    
        })
        .then(response => {
          if(!response.ok){
            throw new Error('Error HTTP' + res.status)
          }
          return response.json();
        })
        .then(data => {
          
    
          if(data.detail == 'Connecté'){
            if(data.identifiant.toLowerCase() == 'admin'){
              navigate('/admin')
            }
            else{
              navigate('/main/dashboard')
            }
            setIsSubmitting(false);
          }
          else{
            setResult(data['error']);
          setIsSubmitting(false);  
          }
        })
        .catch(error => {
          console.log('Erreur : ', error.toString());
        });
    }


    const getUser = async (setUser) => {
        const response = await fetch(`${API_URL}/users/get_user`, {
          method: 'GET',
          credentials: "include",
        })
        .then(res => {
          if(!res.ok){
            throw new Error('Error HTTP' + response.status)
          }
          return res.json();
        })
        .then(data => {
          setUser(data);
        })
        .catch(error => {
          console.log(error)
          useUserStore.getState().clearUser();
          navigate("/")
          
        })
    }

    
    const logout = async (setUser) => {
        const csrfToken = getCSRFToken();
        await fetch(`${API_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrfToken,
        },
        })
        .then(response => {
            if(!response.ok){
                throw new Error('Erreur HTTP : ' + response.status)
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            getUser(setUser);
        })
        .catch(error => {
            console.log('Erreur : ' + error);
        });
    }


    return {
        login,
        getUser,
        logout
    }
}