import { useEffect, useRef, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './Router/Router';

import Nav from './Composants/Nav/Nav';
import Tableau from './Composants/Affichage/Tableau';
import Login from './Composants/Login/Login';
import Main from './Main';


import './Assets/Css/Bulma/bulma.min.css';
import './Assets/fontawesome/css/all.min.css';
import './Assets/Css/output.css';
import './App.css'


function App() {

  const titre = ["Numero CIN", 'Nom', 'Prenom', 'Adresse', 'Ville', "Numero telephone", "Email", "Date de location", "nom_salle", "location"]

  const [donnee, setDonnee] = useState(null); 


  // function request(){

  //   const formData = new FormData()
  //   formData.append("num_cin_proprio", "123");

  //   fetch("http://localhost/Location/Controller/LouerController.php/afficher_location", {
  //       method: "post",
  //       body: formData
  //   })
  //   .then(response => {
  //       if(!response.ok){
  //           throw new Error('Error HTTP ' + response.status)
  //       }
  //       return response.json()
  //   })
  //   .then(data =>{
  //       console.log(data);
  //       setDonnee(data);
  //   })
  //   .catch(error => {
  //       console.log('Erreur :', error);
  //   })

  // } 

  useEffect(()=> {
    // request();
  }, [])


  return (
    <div className="App">
      {/* <Nav /> */}

      <RouterProvider router={router}/>
      
      {/* {
        donnee != null ?
          <Tableau titre={titre} data={donnee}/>
        : null
      } */}
    </div>
  );
}

export default App;
