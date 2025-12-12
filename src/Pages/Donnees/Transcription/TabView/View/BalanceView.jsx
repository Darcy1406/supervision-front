import { formatNombreAvecEspaces } from "../../../../../functions/Function"


export default function TableauComptes({ data }) {

  if (!data || data.length === 0) {
    return <p className="text-gray-500 italic text-center">Aucune donnée disponible</p>
  }

  const natures = [...new Set(data.map(item => item.nature))]

  // Regrouper par compte__numero
  const comptes = data.reduce((acc, item) => {
    const { compte__numero, compte__classe, nature } = item
    const montantNum = Number(item.montant) || 0   // 👈 Conversion obligatoire

    if (!acc[compte__numero]) {
      acc[compte__numero] = { compte__numero, compte__classe }
    }

    // Si une nature apparaît plusieurs fois, on additionne
    acc[compte__numero][nature] = 
      (acc[compte__numero][nature] || 0) + montantNum

    return acc
  }, {})

  let comptesArray = Object.values(comptes)

  // Trier par compte__classe
  comptesArray.sort((a, b) => {
    const classeA = a.compte__classe ? Number(a.compte__classe) : 0
    const classeB = b.compte__classe ? Number(b.compte__classe) : 0
    return classeA - classeB
  })

  // 🔹 TOTAL PAR NATURE (corrigé : conversion en nombre)
  const totals = natures.reduce((acc, nature) => {
    acc[nature] = data
      .filter(item => item.nature === nature)
      .reduce((sum, item) => sum + (Number(item.montant) || 0), 0)
    return acc
  }, {})

  return (
    <div className="w-full mt-6" style={{overflowX: 'auto'}}>
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-max border-collapse border border-gray-300 text-sm text-gray-800">

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

                <td className="border border-gray-300 text-xs px-3 py-2 sticky left-0 bg-white font-medium">
                  {compte.compte__numero}
                </td>

                {natures.map(nature => (
                  <td
                    key={nature}
                    className="border border-gray-300 py-2 text-xs whitespace-nowrap"
                  >
                    <p className='text-right mx-1'>

                      {formatNombreAvecEspaces(compte[nature]) || 0 } Ar
                      
                    </p>
                  </td>
                ))}

              </tr>
            ))}

            {/* 🔥 LIGNE DES TOTAUX */}
            <tr className="bg-gray-100 font-semibold">
              <td className="border border-gray-300 px-3 py-2 sticky left-0 bg-gray-100">
                Total
              </td>

              {natures.map(nature => (
                <td
                  key={nature}
                  className="border border-gray-300 py-2 text-xs whitespace-nowrap"
                >
                  <p className="text-right mx-1">

                    {formatNombreAvecEspaces(totals[nature]) || 0 } Ar
                    
                  </p>
                </td>
              ))}
            </tr>

          </tbody>

        </table>
      </div>
    </div>
  )
}

