import React, { useEffect, useState } from 'react'
import { formatNumber } from '../../../../functions/Function'
import './TabView.css'; 
import TsdmtView from './View/TsdmtView';
import BtdView from './View/BtdView';
import BtrView from './View/BtrView';
import SjeView from './View/SjeView';
import BalanceView from './View/BalanceView';


export default function TabView({data, titre, piece}){

    // const TabItem = ({item}) => {
    //     return(
    //         <tr className={item['compte__numero'] == null ? 'bg-gray-300' : null}>

    //             {
    //                 item['compte__numero'] ?
    //                 <>
    //                     <td>{item['compte__numero']}</td>
    //                     <td>{item['compte__libelle']}</td>
    //                     {/* <td><strong>{item['nature']}</strong></td> */}
    //                 </>
    //                 : <td colSpan={2}>{item['nature']}</td>
    //             }

    //             <td className='w-35'>{ item['montant'] == 0 ? "0" : formatNumber(item['montant'])} Ar</td>
    //         </tr>
    //     )
    // }


    useEffect(() => {
        if(data){
            // arranger_les_donnees()
            console.log(data);
        }
    }, [data])
    

  return (
    <div id='container-table'>
        <p className='text-center font-semibold text-lg my-4' style={{ whiteSpace: 'pre-line' }}>{titre}</p>

        {
            piece ?
                piece.toUpperCase() == 'TSDMT' ?
                    <TsdmtView data={data} piece/>
                : piece.toUpperCase() == 'BTD' ?
                    <BtdView data={data}/>
                : piece.toUpperCase() == 'BTR' ?
                    <BtrView data={data}/>
                : piece.toUpperCase() == "SJE" ?
                    <SjeView data={data}/>
                : <BalanceView data={data}/>
            : null
        }

    </div>
  )
}
