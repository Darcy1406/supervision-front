import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Enregistrer les modules nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const LineChart = ({ labels, object, title, info, tabColor }) => {

  const data = {
    labels: labels,
    datasets: [
      {
        label: object,
        data: info,
        borderColor: tabColor?.[0] || "rgba(75,192,192,1)",
        backgroundColor: tabColor?.[0] || "rgba(75,192,192,0.2)",
        tension: 0.4, // rend la courbe lissée
        fill: true, // zone remplie sous la courbe
      },
    ],
  };

  const valeurs = data?.datasets?.[0]?.data || [];
  const valeurMax = valeurs.length > 0 ? Math.max(...valeurs) : 0;
  const valeurMaxAvecMarge = valeurMax * 3 || 10; // Valeur par défaut si vide

  const step = valeurMax > 0 ? Math.ceil(valeurMax / 5) : 1;

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: title },
    },
    scales: {
      y: {
        beginAtZero: true,
        // 👇 on fixe la valeur max manuellement
        max: valeurMaxAvecMarge,
        ticks: {
          stepSize: step,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};