import React, { useEffect, useState } from 'react'
import { formatNumber } from '../../../../../functions/Function';

export default function Recettes({ total, setTotal, setRecettes }) {

    // const [value, setValue] = useState("");

    const [montants, setMontants] = useState({
      4522: "",
      4528: "",
      4787: "",
      45213: "",
      45218: "",
      181112: "", 
      181118: "",
      181311: "",
      181312: "",
      181321: "",
      181322: "",
      181331: "",
      181332: "",
      181341: "",
      1811111: "",
      1811112: "",
    });

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


    useEffect(() => {
      get_recettes();
      get_total_recettes();
    }, [montants]);


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


  return (
    <div id='recettes'>
        <div>
          <p className='text-center bg-gray-300 p-4 font-semibold italic text-xl'>Recettes</p>
          <div className='container-recettes flex gap-2'>
            <div className=''>
              <table className='table table-1'>

                <thead>

                  <tr>
                    <th>Compte</th>
                    <th>Montant</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    Object.keys(montants).slice(0,9).map(compte => {
                      const rawValue = montants[compte]
                      const formattedValue = formatNumber(rawValue);
                      // console.log('toy', formattedValue);
                      
                      return (
                      
                        <tr key={compte}>
                          <td>{compte}</td>
                          <td>
                            <input 
                              className='w-32 outline-none border-b-2 border-gray-300' 
                              type="text" 
                              inputMode='numeric'
                              name="" 
                              id="" 
                              value={formattedValue}
                              onChange={(e) => handleChange(compte, e.target.value) }
                            />Ar
                          </td>
                        </tr>
                       
                      )
                    })
                  }

                  {/* <tr>
                    <td>1811112</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>181112</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>181118</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>45213</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>45218</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>4522</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>4528</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>4787</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>181311</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>181321</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr> */}

                </tbody>
              </table>

            </div>


            <div>
              <table className='table table-2'>

                <thead>

                  <tr>
                    <th>Compte</th>
                    <th>Montant</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    Object.keys(montants).slice(9, 16).map(compte => {
                      const rawValue = montants[compte];
                      const formattedValue = formatNumber(rawValue);
                      return (
                        <tr key={compte}>
                          <td>{compte}</td>
                          <td>
                            <input 
                              className='w-32 outline-none border-b-2 border-gray-300'
                              type="text" 
                              name="" 
                              id="" 
                              value={formattedValue} 
                              onChange={(e) =>  handleChange(compte, e.target.value) }
                            />Ar
                          </td>
                        </tr>
                      )
                    }

                  )}

                  {/* <tr>
                    <td>181341</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>181312</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>181322</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>181332</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>181341</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr> */}

                </tbody>
              </table>

              {/* <button className='button is-dark'>
                  <span className='mx-1'>
                    <i className='fas fa-check-circle'></i>
                  </span>
                  Valider
              </button> */}
            </div>
            

          </div>  

        </div>
    </div>
  )
}
