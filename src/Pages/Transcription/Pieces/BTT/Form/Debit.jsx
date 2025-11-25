import { useEffect, useRef, useState } from 'react'
import { formatNombreAvecEspaces } from '../../../../../functions/Function';
import InputNumber from '../../../../../Composants/InputNumber/InputNumber';

export default function Debit({comptes, total, setTotal, setDebit, reset_all_montant}) {

    const [comptes_debit, setComptesDebit] = useState([]);

    const index_slice = useRef(0); 
    const length_comptes_debit = useRef(0);

    const [montants, setMontants] = useState({});


    const create_state_montants = () => {
        const initialState = comptes_debit.reduce((acc, item) => {
          const numero = item['compte__numero'];
          acc[numero] = 0
          return acc;
        }, {});
        setMontants(initialState);
    }


    const handleChange = (compte, value) => {
  
        setMontants(prev => ({
          ...prev,
          [compte]: value,
        }));

    }


    const reset_data = () => {
        Object.keys(montants).forEach(key => {
          handleChange(key, 0);
        })
    }


    const filtrer_debit = () => {
     
        const filter = comptes.filter(item => {
          if(!(item['nature'].toLowerCase().includes('debit') || item['nature'].toLowerCase().includes('débit') )){
            return false 
          }
          return true;
        })
        setComptesDebit(filter);
        
    }


    // Calculer et obtenir le montant total des credits
    const get_total_debit = () => {
        let total = 0
        Object.values(montants).forEach(v => {
          const valeur = Number(String(v || "").replace(/\s/g, "")) || 0;
          total += valeur;
        })
        setTotal(total.toFixed(2));
    }


    // Obtenir l'integralite des credits
    const get_debit = () => {
        setDebit(montants);
    }


    useEffect(() => {
        get_debit();
        get_total_debit();
    }, [montants]);


    useEffect(() => {
        if(comptes){
          filtrer_debit();
        }
    }, [comptes]);


    useEffect(() => {
        if(comptes_debit){
          create_state_montants();
          index_slice.current = Math.floor(comptes_debit.length / 2);
          length_comptes_debit.current = comptes_debit.length;
        }
        // console.log('montants', montants);
    }, [comptes_debit]);


    // Ecouter le state reset_all_montant pour effacer les donnees
    useEffect(() => {
        if(reset_all_montant){
            reset_data();
        }
    }, [reset_all_montant])


  return (
    <div id='debit'>
        <p className='text-center bg-gray-300 p-4 font-semibold italic text-xl'>Debit</p>

        <div className="container-debit flex gap-2">
            
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
                            Object.keys(montants).slice(index_slice.current, length_comptes_debit.current).map(compte => {
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
