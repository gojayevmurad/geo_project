import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ chartData }) => {
  const getSum = (num) =>
    chartData
      .filter((item) => item.status == num)
      .reduce((acc, value) => acc + value.len, 0);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
    },
  };
  const labels = ["Status 0", "Status 1", "Status 2"];
  const data = {
    labels,
    datasets: [
      {
        label: "Sum",
        data: [getSum(0), getSum(1), getSum(2)],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <div>
      <Bar options={options} data={data} />
    </div>
  );
};

export default BarChart;
