import React, { useEffect, useRef } from 'react'
import './Loading.css'

export default function Loading() {

    const ref_liste = useRef(null)

    let index = useRef(0)

    function chargement(){

        if( ref_liste.current != null ){
            const item_liste = ref_liste.current.children

            if( index.current == 3 ){

                index.current = 0

                for (let i = 0; i < item_liste.length; i++) {
                    item_liste[i].classList.remove("show");
                }

                return;

            }

            console.log('index', index.current);
            item_liste[index.current].classList.add("show");
            index.current += 1
        }

    }


    useEffect(() => {
        const interval = setInterval(chargement, 500);
    
        return () => clearInterval(interval); // Nettoyage à la destruction du composant
      }, []);

  return (
    <div id='loading'>
        <p>
            Patientez 
        </p>
        <ul ref={ref_liste}>
            <li className='item-liste-1'>.</li>
            <li className='item-liste-2'>.</li>
            <li className='item-liste-3'>.</li>
        </ul>
    </div>
  )
}
