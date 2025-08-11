// src/services/aiServices.js
const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/ai"
    : "/api/ai";

export async function getMotivation(token, tone = "encouraging") {
  const res = await fetch(`${API_BASE}/motivation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tone }),
  });
  if (!res.ok) throw new Error("Failed to fetch motivation");
  return res.json();
}

export async function suggestGoals(token) {
  const res = await fetch(`${API_BASE}/suggest-goals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch goal suggestions");
  return res.json();
}
