import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement} from "chart.js";

// Enregistrer les modules nécessaires
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

export const BarChart = ({labels, object, title, info, tabColor}) => {

  


  const data = {
    labels: labels,
    datasets: [
      {
        label: object,
        data: info,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: tabColor,
        tension: 0.4, // courbe lissée
        fill: true
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

  return <Bar data={data} options={options} className=""/>;
};

