// import { Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

// // Enregistrer les modules nécessaires
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// export const DoughnutChart = ({labels, object, title, info, tabColor}) => {
//   const data = {
//     labels: labels,
//     datasets: [
//       {
//         label: object,
//         data: info,
//         borderColor: "rgba(75,192,192,1)",
//         backgroundColor: tabColor,
//         tension: 0.4, // courbe lissée
//       },
//     ],
//   };


//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { position: "top" },
//       title: { display: true, text: title },
//     },
//   };

//   return <Doughnut data={data} options={options} />;
// };


import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// 🔥 Seulement les modules nécessaires
ChartJS.register(Title, Tooltip, Legend, ArcElement);

export const DoughnutChart = ({ labels, object, title, info, tabColor }) => {

  const data = {
    labels,
    datasets: [
      {
        label: object,
        data: info,
        backgroundColor: tabColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 🔴 OBLIGATOIRE
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
    cutout: "65%", // optionnel : épaisseur du doughnut
  };

  return (
    // 🔴 Wrapper indispensable
    <div className="w-full h-full relative">
      <Doughnut data={data} options={options} />
    </div>
  );
};
