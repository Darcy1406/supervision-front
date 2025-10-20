import React, { useEffect, useRef, useState } from 'react'
import { formatNumber } from '../../../../../functions/Function';
import { useFetch } from '../../../../../hooks/useFetch';
import { API_URL } from '../../../../../Config';

export default function Recettes({ total, setTotal, setRecettes }) {

  const [refresh, setRefresh] = useState(true);

    // const [value, setValue] = useState("");

    const { data: liaison_recettes } = useFetch(`${API_URL}/data/piece_compte/lister_comptes_recette`, 'post', {'nature': 'recette', 'action': 'filtrer_liaison'}, refresh)

    const index_slice = useRef(0); 
    const length_liaison_recettes = useRef(0);

    const [montants, setMontants] = useState({});


    const create_state_montants = () => {
      const initialState = liaison_recettes.reduce((acc, item) => {
        const numero = item['compte__numero'];
        acc[numero] = ""
        return acc;
      }, {});
      setMontants(initialState);
    }

    const get_total_recettes = () => {
      let total = 0
      Object.values(montants).forEach(v => {
        const valeur = Number(String(v || "").replace(/\s/g, "")) || 0;
        total += valeur;
      })
      setTotal(total);
    }

    const get_recettes = () => {
      setRecettes(montants);
    } 


    const handleChange = (compte, value) => {

      // Retirer les espaces pour le state
      const rawValue = value.replace(/\s/g, "");
      // Si ce n’est pas un nombre, on ignore
      if (!/^\d*$/.test(rawValue)) return;

      setMontants(prev => ({
        ...prev,
        [compte]: value,
      }));
    }


    useEffect(() => {
      get_recettes();
      get_total_recettes();
    }, [montants]);

    useEffect(() => {
      if(liaison_recettes){
        create_state_montants();
        index_slice.current = Math.floor(liaison_recettes.length / 2);
        length_liaison_recettes.current = liaison_recettes.length;
      }
      // console.log('montants', montants);
    }, [liaison_recettes]);


    


  return (
    <div id='recettes'>
        <div>
          <p className='text-center bg-gray-300 p-4 font-semibold italic text-xl'>Recettes</p>
          <div className='container-recettes flex gap-2'>

            <div className='w-1/2'>
              <table className='table is-fullwidth table-1'>

                <thead>

                  <tr>
                    <th>Compte</th>
                    <th>Montant</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    Object.keys(montants).slice(0, index_slice.current).map(compte => {
                      const rawValue = montants[compte]
                      const formattedValue = formatNumber(rawValue);
                      // console.log('toy', formattedValue);
                      
                      return (
                      
                        <tr key={compte}>
                          <td>{compte}</td>
                          <td>
                            <input 
                              className='w-5/6 outline-none border-b-2 border-gray-300' 
                              type="text" 
                              inputMode='numeric'
                              name="" 
                              id="" 
                              value={formattedValue}
                              onChange={(e) => handleChange(compte, e.target.value.replace(/\s/g, "")) }
                            />Ar
                          </td>
                        </tr>

                       
                      )
                    })
                  }

                </tbody>
              </table>

            </div>


            <div className='w-1/2'>
              <table className='table table-2 is-fullwidth'>

                <thead>

                  <tr>
                    <th>Compte</th>
                    <th>Montant</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    
                      Object.keys(montants).slice(index_slice.current, length_liaison_recettes.current).map(compte => {
                        const rawValue = montants[compte];
                        const formattedValue = formatNumber(rawValue);
                        return (
                          <tr key={compte}>
                            <td>{compte}</td>
                            <td>
                              <input 
                                className='w-5/6 outline-none border-b-2 border-gray-300'
                                type="text" 
                                name="" 
                                id="" 
                                value={formattedValue} 
                                onChange={(e) =>  handleChange(compte, e.target.value.replace(/\s/g, "")) }
                              />Ar
                            </td>
                          </tr>
                        )
                      }

                  )}

                </tbody>
              </table>

            </div>

          </div>  

        </div>
        
    </div>
  )
}
