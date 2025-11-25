import { API_URL } from "../Config";
import { getCSRFToken } from "../utils/csrf";

export const sendBalance = (formData, setResult) => {

    const csrftoken = getCSRFToken();
    fetch(`${API_URL}/data/transcription/create`, {
      method: 'post',
      headers: {
        // "Content-Type": "application/json",
        "X-CSRFToken": csrftoken, // ✅ envoie du token CSRF
      },
      credentials: "include",
      body: formData
    })
    .then(response => {
      if(!response.ok){
        throw new Error('Error HTTP' + response.status)
      }
      return response.json();
    })
    .then(data => {
        setResult(data);
    })
    .catch(error => {
      setResult({'error': error.toString()});
    });
}