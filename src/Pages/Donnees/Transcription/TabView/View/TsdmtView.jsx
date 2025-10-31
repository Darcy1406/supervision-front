import React, { useEffect, useState } from 'react'
import { formatNombreAvecEspaces, formatNumber } from '../../../../../functions/Function'

export default function TsdmtView({data}) {

    const [recettes, setRecettes] = useState([]);
    const [depenses, setDepenses] = useState([]);

    const [montant, setMontants] = useState({
        'total_depenses': 0,
        'total_recettes': 0,
        'report': 0,
        'solde': 0,
    })


    const handleChange = (compte, value) => {
        setMontants(prev => ({
          ...prev,
          [compte]: value,
        }));
    }


    // Rearranger les donnees recuperer depuis l'API pour styliser l'affichage
    const arranger_les_donnees = () => {

        setRecettes(data.filter(item => {
            if( item['nature'] != "recettes"){
                return false
            }
            return true;
        }))

        setDepenses(data.filter(item => {
            if( item['nature'] != "depenses"){
                return false
            }
            return true;
        }))

        data.forEach(item => {
            if(item['nature'] == 'total depenses'){
                handleChange('total_depenses', item['montant']);
            }
            if(item['nature'] == 'total recettes'){
                handleChange('total_recettes', item['montant']);
            }
            if(item['nature'] == 'report'){
                handleChange('report', item['montant']);
            }
            if(item['nature'] == 'solde'){
                handleChange('solde', item['montant']);
            }
        })
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
            arranger_les_donnees()
        }
    }, [data])


  return (
    <div>
        <table className='table table-view is-fullwidth'>
            <thead>
                <tr>
                    <th>Compte</th>
                    <th>Nature des opérations</th>
                    {/* <th>Nature</th> */}
                    <th>Montant</th>
                </tr>
            </thead>
            <tbody>

                <tr className='font-semibold text-lg'>
                    <td colSpan={2}>Encaise de la décade précédente</td>
                    <td className='text-blue-500'>{formatNombreAvecEspaces(montant['report'].toFixed(2)) || '0,00'} Ar</td>
                </tr>

                {
                    recettes && recettes.map((item, index) => (
                        <TabItem key={index} item={item}/>
                    ))
                }

                <tr className='font-semibold text-lg'>
                    <td colSpan={2}>Total Recettes</td>
                    <td>{formatNombreAvecEspaces(montant['total_recettes'].toFixed(2)) || '0,00'} Ar</td>
                </tr>

                
                {
                    depenses && depenses.map((item, index) => (
                        <TabItem key={index} item={item}/>
                    ))
                }

                <tr className='font-semibold text-lg'>
                    <td colSpan={2}>Total Dépenses</td>
                    <td className='text-red-500'>{formatNombreAvecEspaces(montant['total_depenses'].toFixed(2)) || '0,00'} Ar</td>
                </tr>
                
                <tr className='font-semibold text-lg'>
                    <td colSpan={2}>Encaisse fin de la décade </td>
                    <td className='text-green-500'>{formatNombreAvecEspaces(montant['solde'].toFixed(2)) || '0,00'} Ar</td>
                </tr>

            </tbody>
        </table>
    </div>
  )
}
