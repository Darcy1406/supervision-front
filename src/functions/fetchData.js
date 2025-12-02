import { useEffect, useState } from "react";
import { getCSRFToken } from "../utils/csrf";

/**
 * 
 * @param {string} url 
 * @param {FetchEventInit} options 
 */
export function fetchData(url, method, body = {}, setResult) {
        
    if(method.toUpperCase() != "GET"){

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
            setResult(data)
        })
        .catch((e) => {
            // console.log('error :', e.toString());
            setResult({'error': e.toString()})
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
            setResult(data);
        })
        .catch((e) => {
            setResult({'error': e.toString()})
        })
    }

}