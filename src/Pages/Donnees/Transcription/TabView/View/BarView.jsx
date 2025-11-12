import { useEffect, useState } from 'react'
import { formatNombreAvecEspaces } from '../../../../../functions/Function';

export default function BarView({info_supplementaire, data=[]}) {

  const [credit, setCredit] = useState([]);
  const [debit, setDebit] = useState([]);


  const arranger_les_donnees = () => {
    data.forEach(item => {
      if( ['crédit', 'credit'].includes(item['nature'].toLowerCase()) ){
        setCredit([...credit, item]);
      }
      if(['débit', 'debit'].includes(item['nature'].toLowerCase())){
        setDebit([...debit, item]);
      }
    })
  }


  const DataItem = ({item}) => {
    return (
      <tr>
        <td>{item['compte__numero']}</td>
        <td>{item['compte__libelle']}</td>
        <td className='font-bold text-lg'>{ formatNombreAvecEspaces(item['montant']) || '0,00' } Ar</td>
      </tr>
    )
  }


  useEffect(() => {
    if( data && data.length > 0){
      arranger_les_donnees();
    }
    return () => {
      setCredit([]);
      setDebit([]);
    }
  }, [data])

  return (
    <div>
      <p className='mx-2 text-lg font-semibold w-1/3 py-2 border-b border-gray-300' style={{ whiteSpace: 'pre-line', lineHeight: '35px' }}>
        {
          info_supplementaire
        }
      </p>


      <div className='container-credit mx-auto mt-4 mb-6'>
          <p className='text-center py-2 text-lg bg-gray-300'>Credit</p>

          <table className='table is-fullwidth'>
            <thead>
              <tr>
                <th>Compte</th>
                <th>Libelle</th>
                <th>Montant</th>
              </tr>
            </thead>

            <tbody>
              {
                credit.length > 0 && credit.map((item, index) => (
                  <DataItem key={index} item={item} />
                ))
              }
            </tbody>

          </table>

      </div>

      <div className='container-debit mx-auto mt-6'>
          <p className='text-center py-2 text-lg bg-gray-300'>Debit</p>
          <table className='table is-fullwidth'>
            <thead>
              <tr>
                <th>Compte</th>
                <th>Libelle</th>
                <th>Montant</th>
              </tr>
            </thead>

            <tbody>
              {
                debit.length > 0 && debit.map((item, index) => (
                  <DataItem key={index} item={item} />
                ))
              }
            </tbody>

          </table>
      </div>


      
    </div>
  )
}
