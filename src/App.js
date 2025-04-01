import React, { useEffect, useState } from "react";

// Read the API URL from the environment variable
const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [feedback, setFeedback] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load feedback entries on initial render
  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
  
      // If response includes Items (DynamoDB), use that
      if (data.Items) {
        setFeedback(data.Items);
      } else if (Array.isArray(data)) {
        setFeedback(data); // Already an array
      } else {
        console.error("Unexpected response format", data);
        setFeedback([]);
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError("Unable to load feedback at this time.");
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("API error");

      alert("Feedback submitted!");
      setForm({ name: "", email: "", message: "" });
      fetchFeedback(); // Refresh the list
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit feedback. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Feedback App</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        /><br /><br />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        /><br /><br />

        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        /><br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>All Feedback</h2>
      <ul>
        {feedback.map((f) => (
          <li key={f.id}>
            <strong>{f.name}</strong> ({f.email}): {f.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
