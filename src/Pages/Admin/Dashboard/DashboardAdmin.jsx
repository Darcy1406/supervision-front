import { useEffect, useMemo, useState } from "react"
import { fetchData } from "../../../functions/fetchData"
import { API_URL } from "../../../Config"
import { DoughnutChart } from "../../../Composants/Graphique/DoughnutChart"
import { LineChart } from "../../../Composants/Graphique/LineChart"
import { getRandomColor } from "../../../functions/Function"
import { BarChart } from "../../../Composants/Graphique/BarChart"

export default function DashboardAdmin() {
  const [users_count, setUsersCount] = useState(null)
  const [poste_comptables_count, setPosteComptablesCount] = useState(null)
  const [comptes_count, setComptes] = useState(null)
  const [pieces_count, setPieces] = useState(null)
  const [users_authenticated_by_moth, setUsersAuthenticatedByMonth] = useState(null)


  const obtenir_nombre_total_utilisateurs = () => {
    fetchData(`${API_URL}/users/count`, 'post', {'action': 'obtenir_nombre_total_utilisateurs'}, setUsersCount)
  }


  const obtenir_nombre_total_poste_comptables = () => {
    fetchData(`${API_URL}/users/poste_comptable/count`, 'post', {'action': 'obtenir_nombre_total_poste_comptables'}, setPosteComptablesCount)
  }


  const obtenir_nombre_total_comptes = () => {
    fetchData(`${API_URL}/data/compte/count`, 'post', {'action': 'obtenir_nombre_total_comptes'}, setComptes)
  }


  const obtenir_nombre_total_pieces = () => {
    fetchData(`${API_URL}/data/piece/count`, 'post', {'action': 'obtenir_nombre_total_pieces'}, setPieces)
  }


  const obtenir_nombre_utilisateurs_authentifie_par_mois = () => {
  fetchData(`${API_URL}/audit/count`, 'post', {}, setUsersAuthenticatedByMonth)
  }


  useEffect(() => {
    obtenir_nombre_total_utilisateurs()
    obtenir_nombre_total_poste_comptables()
    obtenir_nombre_total_comptes()
    obtenir_nombre_total_pieces()

    obtenir_nombre_utilisateurs_authentifie_par_mois()
  }, [])


  useMemo(() => {
    const original_title = document.title
    document.title = 'Tableau de bord admin'

    return () => {
      document.title = original_title
    }
  }, [])


  return (
    <section id="dashboard-admin" className="h-full p-1">

      <p className="my-4 text-2xl">Tableau de bord administrateur</p>

      {/* Nombre total (count) */}
      <div className="container-count flex justify-center items-center gap-4 my-4">
        
        <div className="flex-1 flex items-center bg-white border-l-5 border-gray-400 rounded-sm shadow-sm p-5">
          <p className="text-lg">Utilisateurs</p>
          <p className="flex-1 text-right text-4xl">
            {users_count?.['total_utilisateur'] || 0}
          </p>
        </div>

        <div className="flex-1 flex items-center bg-white border-l-5 border-blue-400 rounded-sm shadow-sm p-5">
          <p className="text-lg">Poste comptables</p>
          <p className="flex-1 text-right text-4xl">
            {poste_comptables_count?.['total_poste_comptables'] || 0}
          </p>
        </div>

        <div className="flex-1 flex items-center bg-white border-l-5 border-green-400 rounded-sm shadow-sm p-5">
          <p className="text-lg">Comptes</p>
          <p className="flex-1 text-right text-4xl">
            {comptes_count?.['total_comptes'] || 0}
          </p>
        </div>

        <div className="flex-1 flex items-center bg-white border-l-5 border-pink-400 rounded-sm shadow-sm p-5">
          <p className="text-lg">Pièces comptables</p>
          <p className="flex-1 text-right text-4xl">
            {pieces_count?.['total_pieces'] || 0}
          </p>
        </div>

      </div>

      {/* Graphique */}
      <div className="container-chart flex gap-2 my-6" style={{height: 'calc(100% - 230px)'}}>

        <div className="w-1/2 flex justify-center items-center bg-white rounded-sm shadow-sm p-2">
          <LineChart 
            info={users_authenticated_by_moth}
            tabColor={getRandomColor(1)}
            labels={['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre']}
            object='Utilisateurs authentifiés'
            title="Nombre d'authentification par mois"

          />
        </div>

        <div className="w-1/2 flex justify-center items-center bg-white rounded-sm shadow-sm p-2">

          <BarChart 
            info={users_authenticated_by_moth}
            tabColor={getRandomColor(1)}
            labels={["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']}
            object='Utilisateurs authentifiés'
            title="Nombre d'authentification par mois"
          />

        </div>

      </div>

    </section>
  )
}
