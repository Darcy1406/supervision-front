// export default function BalanceView({ data }) {
//     if (!data || data.length === 0) return <p>Aucune donnée</p>;

import { formatNombreAvecEspaces } from "../../../../../functions/Function"

  
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
  

// export default function TableauComptes({ data }) {

//   if (!data || data.length === 0) {
//     return <p className="text-gray-500 italic">Aucune donnée disponible</p>
//   }

//   const natures = [...new Set(data.map(item => item.nature))]

//   const comptes = data.reduce((acc, item) => {
//     const { compte__numero, nature, montant } = item
//     if (!acc[compte__numero]) acc[compte__numero] = { compte__numero }
//     acc[compte__numero][nature] = montant
//     return acc
//   }, {})

//   const comptesArray = Object.values(comptes)

//   return (

//     <div className="w-full mt-6" style={{overflowX: 'auto'}}>

//       <div className="overflow-x-auto max-w-full" style={{overflowX: 'auto'}}> 

//         <table className="min-w-max border-collapse border border-gray-300 text-sm text-gray-800" style={{overflowX: 'auto'}}>

//           <thead className="bg-gray-100 text-center">

//             <tr className="text-sm">

//               <th className="border border-gray-300 px-3 py-2 sticky left-0 bg-gray-100">
//                 Compte
//               </th>

//               <th>
//                 classe
//               </th>

//               {natures.map(nature => (
//                 <th
//                   key={nature}
//                   className="border border-gray-300 px-3 py-2 whitespace-nowrap"
//                 >
//                   {nature}
//                 </th>
//               ))}
//             </tr>

//           </thead>

//           <tbody>
//             {comptesArray.map((compte) => (

//               <tr key={compte.compte__numero}>

//                 <td className="border border-gray-300 text-xs px-3 bg-red-400 py-2 sticky left-0 bg-white font-medium">
//                   {compte.compte__numero}
//                 </td>

//                 <td>
//                   {compte.compte__classe}
//                 </td>

//                 {natures.map(nature => (
//                   <td
//                     key={nature}
//                     className="border border-gray-300 py-2 text-xs whitespace-nowrap"
//                   >

//                     <p className='text-right mx-1'>

//                       {compte[nature]
//                         ? formatNombreAvecEspaces(compte[nature])
//                         : 0
//                       } Ar
//                     </p>

//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }


export default function TableauComptes({ data }) {

  if (!data || data.length === 0) {
    return <p className="text-gray-500 italic">Aucune donnée disponible</p>
  }

  const natures = [...new Set(data.map(item => item.nature))]

  // Regrouper par compte__numero
  const comptes = data.reduce((acc, item) => {
    const { compte__numero, compte__classe, nature, montant } = item
    if (!acc[compte__numero]) acc[compte__numero] = { compte__numero, compte__classe }
    acc[compte__numero][nature] = montant
    return acc
  }, {})

  let comptesArray = Object.values(comptes)

  // 🔹 Trier correctement par compte__classe après regroupement
  comptesArray.sort((a, b) => {
    const classeA = a.compte__classe ? Number(a.compte__classe) : 0
    const classeB = b.compte__classe ? Number(b.compte__classe) : 0
    return classeA - classeB
  })

  return (
    <div className="w-full mt-6" style={{overflowX: 'auto'}}>
      <div className="overflow-x-auto max-w-full" style={{overflowX: 'auto'}}> 
        <table className="min-w-max border-collapse border border-gray-300 text-sm text-gray-800" style={{overflowX: 'auto'}}>
          <thead className="bg-gray-100 text-center">
            <tr className="text-sm">

              <th className="border border-gray-300 px-3 py-2 sticky left-0 bg-gray-100">
                Compte
              </th>

              {natures.map(nature => (
                <th
                  key={nature}
                  className="border border-gray-300 px-3 py-2 whitespace-nowrap"
                >
                  {nature}
                </th>
              ))}

            </tr>
          </thead>

          <tbody>
            {comptesArray.map((compte) => (
              <tr key={compte.compte__numero}>

                <td className="border border-gray-300 text-xs px-3 bg-red-400 py-2 sticky left-0 bg-white font-medium">
                  {compte.compte__numero}
                </td>

                {/* <td className="border border-gray-300 text-xs px-3 py-2">
                  {compte.compte__classe}
                </td> */}

                {natures.map(nature => (
                  <td
                    key={nature}
                    className="border border-gray-300 py-2 text-xs whitespace-nowrap"
                  >
                    <p className='text-right mx-1'>
                      {compte[nature] 
                        ? compte[nature].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") 
                        : 0
                      } Ar
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


