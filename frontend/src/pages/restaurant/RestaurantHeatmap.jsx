import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix"; // 🔑 matrix chart
import "chartjs-chart-matrix";

// Register Chart.js components including matrix
ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  MatrixController,
  MatrixElement
);

const RestaurantHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeatmap = async () => {
      setLoading(true);
      try {
        const res = await API.get("/analytics/restaurant/heatmap"); // backend route
        setHeatmapData(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch heatmap", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeatmap();
  }, []);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Initialize 7x24 matrix
  const matrix = Array(7)
    .fill()
    .map(() => Array(24).fill(0));

  heatmapData.forEach((d) => {
    if (
      matrix[d.dayOfWeek] &&
      typeof matrix[d.dayOfWeek][d.hour] !== "undefined"
    ) {
      matrix[d.dayOfWeek][d.hour] = d.orders;
    }
  });

  const data = {
    datasets: [
      {
        label: "Orders Heatmap",
        data: matrix.flatMap((row, dayIdx) =>
          row.map((value, hourIdx) => ({
            x: hourIdx,
            y: dayIdx,
            v: value,
          }))
        ),
        backgroundColor: (ctx) => {
          const value = ctx.dataset.data[ctx.dataIndex].v;
          const alpha = value ? Math.min(value / 20, 1) : 0; // adjust scaling
          return `rgba(255, 99, 132, ${alpha})`;
        },
        borderWidth: 1,
        width: ({ chart }) => chart.chartArea?.width / 24 - 2,
        height: ({ chart }) => chart.chartArea?.height / 7 - 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `Day: ${days[ctx.raw.y]}, Hour: ${ctx.raw.x}:00, Orders: ${
              ctx.raw.v
            }`,
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        ticks: { stepSize: 1, callback: (val) => `${val}:00` },
      },
      y: {
        type: "linear",
        ticks: { stepSize: 1, callback: (val) => days[val] },
      },
    },
  };

  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">🔥 Order Heatmap</h2>
      <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow mb-10">
        <h3 className="text-xl font-semibold mb-4">Orders by Day & Hour</h3>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading heatmap...</p>
        ) : (
          <Chart
            key={heatmapData.length} // 🔑 forces new chart instance when data changes
            type="matrix"
            data={data}
            options={options}
          />
        )}
      </div>
    </div>
  );
};

export default RestaurantHeatmap;
