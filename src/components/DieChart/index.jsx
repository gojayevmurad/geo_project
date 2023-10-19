import React from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  scales,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DieChart = ({ chartData }) => {
  // Get count of items which status equals to parameter
  const getCount = (num) =>
    chartData.filter((item) => item.status == num).length;

  const status2Count = getCount(2);
  const status1Count = getCount(1);
  const status0Count = getCount(0);
  const data = {
    labels: [
      `Status 0 : ${((100 * status0Count) / chartData.length).toFixed(1)}%`,
      `Status 1 : ${((100 * status1Count) / chartData.length).toFixed(1)}%`,
      `Status 2 : ${((100 * status2Count) / chartData.length).toFixed(1)}%`,
    ],
    datasets: [
      {
        label: "Count",
        data: [status0Count, status1Count, status2Count],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div>
      <Pie data={data} height={400} width={400} />
    </div>
  );
};

export default DieChart;
