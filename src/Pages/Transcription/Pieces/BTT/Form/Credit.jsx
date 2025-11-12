import { useEffect, useRef, useState } from 'react'
import InputNumber from '../../../../../Composants/InputNumber/InputNumber';
import { formatNombreAvecEspaces } from '../../../../../functions/Function';

export default function Credit({comptes, total, setTotal, setCredit}) {

    const [comptes_credit, setComptesCredit] = useState([]);

    const index_slice = useRef(0); 
    const length_comptes_credit = useRef(0);

    const [montants, setMontants] = useState({});


    const create_state_montants = () => {
        const initialState = comptes_credit.reduce((acc, item) => {
          const numero = item['compte__numero'];
          acc[numero] = 0
          return acc;
        }, {});
        setMontants(initialState);
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


    const filtrer_credit = () => {
     
        const filter = comptes.filter(item => {
          if(!(item['nature'].toLowerCase().includes('credit') || item['nature'].toLowerCase().includes('crédit') )){
            return false 
          }
          return true;
        })
        setComptesCredit(filter);
        
    }

    // Calculer et obtenir le montant total des credits
    const get_total_credit = () => {
        let total = 0
        Object.values(montants).forEach(v => {
          const valeur = Number(String(v || "").replace(/\s/g, "")) || 0;
          total += valeur;
        })
        setTotal(total.toFixed(2));
    }


    // Obtenir l'integralite des credits
    const get_credit = () => {
        setCredit(montants);
    }


    useEffect(() => {
        get_credit();
        get_total_credit();
    }, [montants]);


    useEffect(() => {
        if(comptes){
          filtrer_credit();
        }
    }, [comptes]);

    
    useEffect(() => {
        if(comptes_credit){
          create_state_montants();
          index_slice.current = Math.floor(comptes_credit.length / 2);
          length_comptes_credit.current = comptes_credit.length;
        }
        // console.log('montants', montants);
    }, [comptes_credit]);


  return (
    <div id='credit'>
        <p className='text-center bg-gray-300 p-4 font-semibold italic text-xl'>Credit</p>

        <div className="container-credit flex gap-2">

            <div className='w-1/2'>
                <table className="table is-fullwidth">
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
                                return (
                                    <tr key={compte}>
                                        <td>{compte}</td>
                                        <td>
                                            <InputNumber 
                                                value={formattedValue}
                                                handleChange={ (e) => handleChange(compte, e.target.value.replace(/\s/g, "").replace(/,/g, ".")) }
                                            />
                                        </td>
                                    </tr>
                                )
                        })
                        }
                    </tbody>

                </table>
            </div>

            <div className="w-1/2">
                <table className="table is-fullwidth">

                    <thead>
                        <tr>
                            <th>Compte</th>
                            <th>Montant</th>
                        </tr>
                        
                    </thead>

                    <tbody>
                        {
                            Object.keys(montants).slice(index_slice.current, length_comptes_credit.current).map(compte => {
                                const rawValue = montants[compte];
                                const formattedValue = formatNombreAvecEspaces(rawValue);

                                return (
                                    <tr key={compte}>
          
                                      <td>{compte}</td>
          
                                      <td>
          
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

        </div>


    </div>
  )
}
