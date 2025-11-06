import React, { useEffect, useState } from 'react'
import { formatNombreAvecEspaces } from '../../../../../functions/Function'

export default function SjeView({data}) {

    const [recettes, setRecettes] = useState({
        "Recettes propres": 0,
        "Approvisionnement de fonds": 0,
        "Degagement de fonds effectuees par la RAF": 0,
    });


    const [depenses, setDepenses] = useState({
        "Degagements de fonds": 0,
        "Depenses": 0,
    });


    const [total, setTotal] = useState({
        'recettes': 0,
        'depenses': 0
    })


    const [info_supp, setInfoSupp] = useState({
        "report": 0,
        "solde": 0,
    })


    const arranger_les_donees = () => {
        data.forEach(item => {
            if(item['nature'] == "Degagements de fonds"){
                handleChange('Degagements de fonds', item['montant'], setDepenses)
            }
            else if(item['nature'] == "Depenses"){
                handleChange('Depenses', item['montant'], setDepenses);
            }
            else if(item['nature'] == "Degagement de fonds effectuees par la RAF"){
                handleChange('Degagement de fonds effectuees par la RAF', item['montant'], setRecettes);
            }
            else if(item['nature'] == "Approvisionnement de fonds"){
                handleChange('Approvisionnement de fonds', item['montant'], setRecettes);
            }
            else if(item['nature'] == "Recettes propres"){
                handleChange('Recettes propres', item['montant'], setRecettes);
            }
            else if(item['nature'] == "total_recettes"){
                handleChange('recettes', item['montant'], setTotal);
            }
            else if(item['nature'] == "total_depenses"){
                handleChange('depenses', item['montant'], setTotal);
            }
            else if(item['nature'] == "report"){
                handleChange('report', item['montant'], setInfoSupp);
            }
            else if(item['nature'] == "solde"){
                handleChange('solde', item['montant'], setInfoSupp);
            }
        })
    }


    const handleChange = (name, value, setState) => {
  
        setState(prev => ({
          ...prev,
          [name]: value,
        }));
    }


    const TabItem = ({item}) => {
        return(
            <tr className={item['compte__numero'] == null ? 'bg-gray-300' : null}>

                {
                    item['compte__numero'] ?
                    <>
                        <td>{item['compte__numero']}</td>
                        <td>{item['compte__libelle']}</td>
                        {/* <td><strong>{item['nature']}</strong></td> */}
                    </>
                    : <td colSpan={2}>{item['nature']}</td>
                }

                <td className='w-35'>{ item['montant'] == 0 ? "0" : formatNombreAvecEspaces(item['montant'].toFixed(2))} Ar</td>
            </tr>
        )
    }


    useEffect(() => {
        if(data){
            arranger_les_donees()
        }
    }, [data])

  return (
    <div id='container-view'>
        <p>

        </p>
        <table className='table table-view is-fullwidth'>
            <tbody>
                
                <tr>
                    <td>Encaisse de la decade precedente</td>
                    <td>{formatNombreAvecEspaces((Number(info_supp['report']).toFixed(2)))} Ar</td>
                </tr>

                <tr>
                    <td>Recettes propres</td>
                    <td>{formatNombreAvecEspaces((Number(recettes['Recettes propres']).toFixed(2)))} Ar</td>
                </tr>

                <tr>
                    <td>Approvisionnement de fonds</td>
                    <td>{formatNombreAvecEspaces((Number(recettes['Approvisionnement de fonds']).toFixed(2)))} Ar</td>
                </tr>

                <tr>
                    <td>Degagement de fonds effectuees par la RAF</td>
                    <td>{formatNombreAvecEspaces((Number(recettes['Degagement de fonds effectuees par la RAF']).toFixed(2)))} Ar</td>
                </tr>

                <tr>
                    <td>Total recettes</td>
                    <td>{formatNombreAvecEspaces((Number(total['recettes']).toFixed(2)))} Ar</td>
                </tr>

                <tr>
                    <td>Degagements de fonds</td>
                    <td>{formatNombreAvecEspaces((Number(depenses['Degagements de fonds']).toFixed(2)))} Ar</td>
                </tr>
                <tr>
                    <td>Depenses</td>
                    <td>{formatNombreAvecEspaces((Number(depenses['Depenses']).toFixed(2)))} Ar</td>
                </tr>
                <tr>
                    <td>Total depenses</td>
                    <td>{formatNombreAvecEspaces((Number(total['depenses']).toFixed(2)))} Ar</td>
                </tr>
                <tr>
                    <td>Encaisse fin de la decade</td>
                    <td>{formatNombreAvecEspaces((Number(info_supp['solde']).toFixed(2)))} Ar</td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}
