import { React, useEffect, useRef, useState } from 'react'
import { formatNumber } from '../../../../../functions/Function';
import { useFetch } from '../../../../../hooks/useFetch';
import { API_URL } from '../../../../../Config';

export default function Depenses({setTotal, setDepenses}) {
  const [refresh, setRefresh] = useState(true);

  const { data: liaison_recettes } = useFetch(`${API_URL}/data/piece_compte/lister_comptes_recette`, 'post', {'nature': 'dépense', 'action': 'filtrer_liaison'}, refresh)

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


  const get_total_depenses = () => {
    let total = 0;
    Object.values(montants).forEach(v => {
      const valeur = Number(String(v || "").replace(/\s/g, "")) || 0;
      total += valeur;
    })
    setTotal(total);
  }


  const get_depenses = () => {
    setDepenses(montants);
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
    get_depenses();
    get_total_depenses();
    // console.log(Object.keys(montants));
  }, [montants]);


  useEffect(() => {
    if(liaison_recettes){
      create_state_montants();
      index_slice.current = Math.floor(liaison_recettes.length / 2);
      length_liaison_recettes.current = liaison_recettes.length;
    }
  }, [liaison_recettes]);


  return (
    <div id='depenses' className='w-full'>
        <div>
          <p className='text-center bg-gray-300 p-4 font-semibold text-xl italic'>Dépenses</p>
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
                              onChange={(e) => handleChange(compte, e.target.value.replace(/\s/g, ""))}
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
              <table className='table is-fullwidth table-2'>

                <thead>

                  <tr>
                    <th>Compte</th>
                    <th>Montant</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    Object.keys(montants).slice(index_slice.current, length_liaison_recettes.current).map(compte => {
                      const rawValue = montants[compte]
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
                              onChange={(e) => handleChange(compte, e.target.value.replace(/\s/g, ""))}/>Ar
                          </td>
                        </tr>
                      )
                    })
                  }

                </tbody>

              </table>

            </div>
            

          </div>  

        </div>
    </div>
  )
}
