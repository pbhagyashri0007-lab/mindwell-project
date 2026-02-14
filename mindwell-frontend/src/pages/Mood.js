import { useEffect, useState } from "react";
import API from "../api/axios";

function Mood() {
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [emotion, setEmotion] = useState("");
  const [history, setHistory] = useState([]);

  const fetchMoods = async () => {
    const res = await API.get("/mood");
    setHistory(res.data);
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const handleSubmit = async () => {
    await API.post("/mood", { mood, energy, emotion });
    fetchMoods();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mood Tracker 📊</h2>

      <input
        type="number"
        value={mood}
        min="1"
        max="10"
        onChange={(e) => setMood(e.target.value)}
        placeholder="Mood (1-10)"
      />

      <input
        type="number"
        value={energy}
        min="1"
        max="10"
        onChange={(e) => setEnergy(e.target.value)}
        placeholder="Energy (1-10)"
      />

      <input
        type="text"
        value={emotion}
        onChange={(e) => setEmotion(e.target.value)}
        placeholder="Emotion"
      />

      <button onClick={handleSubmit}>
        Save Mood
      </button>

      <hr />

      <h3>History</h3>

      {history.map((item) => (
        <div key={item.id}>
          Mood: {item.mood} | Energy: {item.energy} | Emotion: {item.emotion}
        </div>
      ))}
    </div>
  );
}

export default Mood;
