import { useEffect, useState } from "react";

function Breathing() {
  const [phase, setPhase] = useState("Inhale");
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const inhale = () => {
      setPhase("Inhale");
      setScale(1.5);

      setTimeout(() => {
        setPhase("Hold");
        setScale(1.5);

        setTimeout(() => {
          setPhase("Exhale");
          setScale(1);

        }, 7000); // hold 7 sec
      }, 4000); // inhale 4 sec
    };

    inhale();
    const interval = setInterval(inhale, 19000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <h1>Breathing Assistant</h1>

      <div
        style={{
          ...styles.circle,
          transform: `scale(${scale})`,
        }}
      />

      <h2>{phase}</h2>
      <p>4s Inhale – 7s Hold – 8s Exhale</p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
    color: "white"
  },
  circle: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    backgroundColor: "#4cafef",
    transition: "transform 4s ease-in-out",
    margin: "20px"
  }
};

export default Breathing;
