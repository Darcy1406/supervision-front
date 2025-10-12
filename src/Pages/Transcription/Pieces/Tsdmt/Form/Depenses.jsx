import { React, useEffect, useState } from 'react'
import { formatNumber } from '../../../../../functions/Function';

export default function Depenses({setTotal, setDepenses}) {

    const [value, setValue] = useState("");

    const [montants, setMontants] = useState({
      1811211: "",
      1811212: "",
      181122: "",
      1811231: "",
      1811232: "",
      1811233: "",
      1811234: "",
      1811238: "",
      181124: "",
      181125: "",
      181128: "",
      181311: "",
      45213: "",
      45218: "",
      4522: "",
      4528: "",
      452842: "",
      4786: "",
      4787: ""
    });

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


  return (
    <div id='depenses'>
        <div>
          <p className='text-center bg-gray-300 p-4 font-semibold text-xl italic'>Dépenses</p>
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
                    Object.keys(montants).slice(0, 10).map(compte => {
                      const rawValue = montants[compte]
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
                              onChange={(e) => handleChange(compte, e.target.value)}
                            />Ar
                          </td>
                        </tr>
                      )
                    })
                  }


                  {/* <tr>
                    <td>1811212</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>181122</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>1811231</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>1811232</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>1811233</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>1811234</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>1811238</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>181124</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>181125</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>181128</td>
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
                    Object.keys(montants).slice(10, 19).map(compte => {
                      const rawValue = montants[compte]
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
                              onChange={(e) => handleChange(compte, e.target.value)}/>Ar
                          </td>
                        </tr>
                      )
                    })
                  }

                  {/* <tr>
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
                    <td>452842</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>4786</td>
                    <td>
                      <input className='w-32 outline-none border-b-2 border-gray-300' type="text" name="" id="" value={value} onChange={(e) => setValue(formatNumber(e.target.value))}/>Ar
                    </td>
                  </tr>

                  <tr>
                    <td>4787</td>
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
