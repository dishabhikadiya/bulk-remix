import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
const demo = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Monthly Sales",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.4)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: [55, 50, 70, 81, 56, 34, 22, 23, 43, 34, 34, 23],
      },
    ],
  };
  console.log(data);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  console.log(options);
  return (
    <div>
      <React.Suspense fallback={<p>loading...</p>}>
        <Doughnut data={data} options={options} />
      </React.Suspense>
    </div>
  );
};

export default demo;
