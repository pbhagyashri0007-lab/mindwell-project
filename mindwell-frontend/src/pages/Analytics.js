import { useEffect, useState } from "react";
import API from "../api/axios";
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

function Analytics() {
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await API.get("/mood");
        setMoods(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMoods();
  }, []);

  // Count moods
  const moodCounts = moods.reduce((acc, mood) => {
    acc[mood.mood] = (acc[mood.mood] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(moodCounts),
    datasets: [
      {
        label: "Mood Count",
        data: Object.values(moodCounts),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
      },
    ],
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h2>Mood Analytics 📊</h2>
      <Bar data={data} />
    </div>
  );
}

export default Analytics;
