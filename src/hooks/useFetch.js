import { useEffect, useState } from "react";
import { getCSRFToken } from "../utils/csrf";

/**
 * 
 * @param {string} url 
 * @param {FetchEventInit} options 
 */
export function useFetch(url, method, body = {}, reset) {
    
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [errors, setErrors] = useState(null)

    useEffect(() => {
        
        if(method.toUpperCase() == "POST"){

            const csrftoken = getCSRFToken();

            fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken, // ✅ envoie du token CSRF
                },
                credentials: "include",
                body: JSON.stringify(body),
            })
            .then(res => { 
                if(!res.ok){
                    throw new Error('Erreur HTTP : ' + res.status);
                }
                return res.json();
            })
            .then(data => {
                setData(data)
                // console.log(data);
            })
            .catch((e) => {
                setErrors(e)
            })
            .finally(() => {
                setLoading(false)
            })
        }
        else{
            fetch(url, {
                method: method,
                credentials: "include",
            })
            .then(res => { 
                if(!res.ok){
                    throw new Error('Erreur HTTP : ' + res.status);
                }
                return res.json();
            })
            .then(data => {
                setData(data);
                // console.log(data);
            })
            .catch((e) => {
                setErrors(e)
            })
            .finally(() => {
                setLoading(false)
            })
        }

    }, [reset])

    return {
        loading: loading,
        data: data,
        errors: errors 
    }

}