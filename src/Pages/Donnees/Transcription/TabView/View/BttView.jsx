import { useEffect } from "react"
import { formatNombreAvecEspaces } from "../../../../../functions/Function";

export default function BttView({data}) {

    useEffect(() => {
        if(data){
            console.log('data', data);
        }
    }, [data])

    const BtdItem = ({item}) => {
        return(
            
            <tr>
                {
                    item['compte__numero'] ?
                        <>
                            <td>{item['compte__numero']}</td>

                            <td>{item['compte__libelle']}</td>

                            <td className="w-40 text-lg font-semibold">
                                <p className="text-right">
                                    {
                                        item['nature'] == 'Credit' ?
                                            formatNombreAvecEspaces(item['montant'])
                                        : 0
                                    } Ar
                                </p>
                
                            </td>

                            <td className="w-40 text-lg font-semibold">
                                <p className="text-right">
                                    {
                                        item['nature'] == 'Debit' ?
                                            formatNombreAvecEspaces(item['montant'])
                                        : 0
                                    } Ar
                                </p>
                            </td>

                        </>
                    : 
                        <>
                            <td colSpan={3}>{item['nature']}</td>
                            <td className="w-40 text-lg font-semibold">
                                <p className="text-right">
                                    {formatNombreAvecEspaces(item['montant']) || 0} Ar
                                </p>
                            </td>
                        </>
                }
                
            </tr>
        )
        
    }

  return (
    <div id="btd-view">
        <table className="table table-view is-fullwidth">
            <thead>
                <tr>
                    <th>Compte</th>
                    <th>Libelle</th>
                    <th>Credit</th>
                    <th>Debit</th>
                </tr>
            </thead>

            <tbody>
                {
                    data && data.map((item, index) => (
                        <BtdItem key={index} item={item}/>
                    ))
                }
            </tbody>

        </table>
    </div>
  )
}
