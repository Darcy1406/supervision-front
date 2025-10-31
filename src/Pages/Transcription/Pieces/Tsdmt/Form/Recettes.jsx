import React, { useEffect, useRef, useState } from 'react'
import { formatNombreAvecEspaces, formatNumber } from '../../../../../functions/Function';
import { useFetch } from '../../../../../functions/fetchData';
import { API_URL } from '../../../../../Config';
import InputNumber from '../../../../../Composants/InputNumber/InputNumber';

export default function Recettes({ total, setTotal, setRecettes, comptes }) {

    const [refresh, setRefresh] = useState(true);

    const [comptes_recettes, setComptesRecettes] = useState([]);

    const filtrer_recettes = () => {
     
      const filter = comptes.filter(item => {
        if(!item['nature'].toLowerCase().includes('recette')){
          return false 
        }
        return true;
      })
      setComptesRecettes(filter);
      
    }


    const index_slice = useRef(0); 
    const length_comptes_recettes = useRef(0);

    const [montants, setMontants] = useState({});


    const create_state_montants = () => {
      const initialState = comptes_recettes.reduce((acc, item) => {
        const numero = item['compte__numero'];
        acc[numero] = 0
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
      setTotal(total.toFixed(2));
    }

    const get_recettes = () => {
      setRecettes(montants);
    } 


    const handleChange = (compte, value) => {

      // Retirer les espaces pour le state
      // const rawValue = value.replace(/\s/g, "");
      // // Si ce n’est pas un nombre, on ignore
      // if (!/^\d*$/.test(rawValue)) return;

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
      if(comptes){
        filtrer_recettes();
      }
    }, [comptes]);

    useEffect(() => {
      if(comptes_recettes){
        create_state_montants();
        index_slice.current = Math.floor(comptes_recettes.length / 2);
        length_comptes_recettes.current = comptes_recettes.length;
      }
      // console.log('montants', montants);
    }, [comptes_recettes]);


    


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
                      const formattedValue = formatNombreAvecEspaces(rawValue);
                      // console.log('toy', formattedValue);
                      
                      return (
                      
                        <tr key={compte}>
                          <td>{compte}</td>
                          <td>

                            {/* <input 
                              className='w-5/6 outline-none border-b-2 border-gray-300' 
                              type="text" 
                              inputMode='numeric'
                              name="" 
                              id="" 
                              value={formattedValue}
                              onChange={(e) => handleChange(compte, e.target.value.replace(/\s/g, "")) }
                            />Ar */}
                            <InputNumber 
                              value={formattedValue}
                              handleChange={ (e) => handleChange(compte, e.target.value.replace(/\s/g, "").replace(/,/g, ".")) }
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
                    
                      Object.keys(montants).slice(index_slice.current, length_comptes_recettes.current).map(compte => {
                        const rawValue = montants[compte];
                        const formattedValue = formatNombreAvecEspaces(rawValue);
                        return (
                          <tr key={compte}>

                            <td>{compte}</td>

                            <td>

                              {/* <input 
                                className='w-5/6 outline-none border-b-2 border-gray-300'
                                type="text" 
                                name="" 
                                id="" 
                                value={formattedValue} 
                                onChange={(e) =>  handleChange(compte, e.target.value.replace(/\s/g, "")) }
                              />Ar */}

                              <InputNumber 
                                value={formattedValue}
                                handleChange={ (e) => handleChange(compte, e.target.value.replace(/\s/g, "").replace(/,/g, ".")) }
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
