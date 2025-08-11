import { useEffect, useState } from "react";
import { getMotivation, suggestGoals } from "../services/aiServices";

function AISidebar() {
  const token = localStorage.getItem("token");
  const [tip, setTip] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loadingTip, setLoadingTip] = useState(true);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    async function fetchAI() {
      try {
        setLoadingTip(true);
        setLoadingGoals(true);
        setError(null);

        const mot = await getMotivation(token, "encouraging");
        setTip(mot.message);
        setLoadingTip(false);

        const s = await suggestGoals(token);
        setGoals(s.suggestions || []);
        setLoadingGoals(false);
      } catch (e) {
        console.error(e);
        setError("Failed to load AI data.");
        setLoadingTip(false);
        setLoadingGoals(false);
      }
    }

    fetchAI();
  }, [token]);

  if (!token) return <aside>Please log in to see AI suggestions.</aside>;

  return (
    <aside style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8, maxWidth: 320 }}>
      <div style={{ marginBottom: 20 }}>
        <h4>Motivation</h4>
        {loadingTip ? (
          <p>Loading motivational tip...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <p>{tip}</p>
        )}
      </div>

      <div>
        <h4>Suggested Goals</h4>
        {loadingGoals ? (
          <p>Loading goals...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : goals.length === 0 ? (
          <p>No goals suggested.</p>
        ) : (
          <ul style={{ paddingLeft: 20 }}>
            {goals.map((goal, idx) => (
              <li key={idx} style={{ marginBottom: 12 }}>
                <strong>{goal.title}</strong>
                <p style={{ fontSize: "0.9rem", color: "#555", marginTop: 4 }}>{goal.why}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

export default AISidebar;
