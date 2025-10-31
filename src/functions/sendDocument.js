import { API_URL } from "../Config";
import { getCSRFToken } from "../utils/csrf";

export const sendDocument = (formData, setIdDoc) => {

    // const formData = new FormData();

    // formData.append("fichier", doc['fichier']);
    // formData.append("nom_fichier", doc['nom_fichier']);
    // formData.append("type_fichier", doc['type_fichier']);
    // formData.append("piece", doc['piece']);
    // formData.append("poste_comptable", doc['poste_comptable']);
    // formData.append("exercice", doc['exercice']);
    // formData.append("periode", doc['periode']);
    // formData.append("decade", doc['decade']);
    // formData.append("mois", doc['mois']);
    // formData.append("date_arrivee", doc['date_arrivee']);
    // formData.append("action", 'ajouter_un_document');

    const csrftoken = getCSRFToken();
    fetch(`${API_URL}/data/document/save`, {
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
        console.log('id fichier :', data['id_fichier']);
    //   send_tsdmt(data['id_fichier']);
        // id_doc.current = data['id_fichier'];
        setIdDoc(data['id_fichier']);

    })
    .catch(error => {
      console.log('Erreur : ', error);
    });
    // console.log('fichier', doc['fichier']);
    // sendData(`${API_URL}/data/document/save`, 'POST', {"document": doc, "file": doc['fichier']}, setResult)
}