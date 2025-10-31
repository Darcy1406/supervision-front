import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement} from "chart.js";

// Enregistrer les modules nécessaires
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

export const LineChart = ({info, tabColor}) => {

  const data = {
    labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin"],
    datasets: [
      {
        label: "Ventes",
        data: info,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: tabColor,
        tension: 0.4, // courbe lissée
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Évolution des ventes" },
    },
  };

  return <Bar data={data} options={options} className=""/>;
};

