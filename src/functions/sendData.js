export function sendData(url, method, data, setResult){

    const csrftoken = document.cookie.split("; ").find((row) => row.startsWith("csrftoken="))?.split("=")[1];

    fetch(`${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken, // ✅ envoie du token CSRF
      },
      credentials: "include", // important pour que le cookie soit envoyé
      body: JSON.stringify(data),
    })
    .then(response => {
      if(!response.ok){
        throw new Error('Error HTTP' + response.status)
      }
      return response.json();
    })
    .then(data => {
      // console.log(data);
      setResult(data);
    })
    .catch(error => {
      console.log('Erreur : ', error);
    });
}
  