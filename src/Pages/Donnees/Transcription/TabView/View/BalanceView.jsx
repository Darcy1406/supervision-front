// export default function BalanceView({ data }) {
//     if (!data || data.length === 0) return <p>Aucune donnée</p>;
  
//     // Regroupement par compte
//     const comptes = data.reduce((acc, item) => {
//       const { compte__numero, nature, montant } = item;
//       if (!acc[compte__numero]) acc[compte__numero] = [];
//       acc[compte__numero].push({ nature, montant });
//       return acc;
//     }, {});
  
//     return (
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
//         {Object.entries(comptes).map(([numero, lignes]) => (
//           <div
//             key={numero}
//             className="rounded-2xl shadow-md border border-gray-200 bg-white p-4 hover:shadow-lg transition"
//           >
//             <h2 className="font-bold text-indigo-600 mb-2">
//               Compte n° {numero}
//             </h2>
//             <table className="w-full text-sm">
//               <tbody>
//                 {lignes.map((ligne) => (
//                   <tr key={ligne.nature}>
//                     <td className="py-1 text-gray-500">{ligne.nature}</td>
//                     <td className="py-1 text-right font-medium">
//                       <p className="text-base">{ligne.montant.toLocaleString('fr-FR') || 0} Ar</p>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ))}
//       </div>
//     );
// }
  

import React from 'react'

export default function TableauComptes({ data }) {

  if (!data || data.length === 0) {
    return <p className="text-gray-500 italic">Aucune donnée disponible</p>
  }

  const natures = [...new Set(data.map(item => item.nature))]

  const comptes = data.reduce((acc, item) => {
    const { compte__numero, nature, montant } = item
    if (!acc[compte__numero]) acc[compte__numero] = { compte__numero }
    acc[compte__numero][nature] = montant
    return acc
  }, {})

  const comptesArray = Object.values(comptes)

  return (
    <div className="w-full mt-6" style={{overflowX: 'auto'}}>
      <div className="overflow-x-auto max-w-full" style={{overflowX: 'auto'}}> 
        <table className="min-w-max border-collapse border border-gray-300 text-sm text-gray-800" style={{overflowX: 'auto'}}>
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-left sticky left-0 bg-gray-100">
                Numéro de compte
              </th>
              {natures.map(nature => (
                <th
                  key={nature}
                  className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap"
                >
                  {nature}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comptesArray.map((compte) => (
              <tr key={compte.compte__numero}>

                <td className="border border-gray-300 px-3 py-2 sticky left-0 bg-white font-medium">
                  {compte.compte__numero}
                </td>

                {natures.map(nature => (
                  <td
                    key={nature}
                    className="border border-gray-300 px-3 py-2 text-right whitespace-nowrap"
                  >

                    <p className='text-right'>

                      {compte[nature]
                        ? compte[nature].toLocaleString('fr-FR')
                        : 0
                      }
                    </p>

                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


