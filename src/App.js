import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [feedback, setFeedback] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (Array.isArray(data)) {
        setFeedback(data);
      } else if (data.Items) {
        setFeedback(data.Items);
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError("Unable to load feedback.");
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

      if (!response.ok) throw new Error("Failed to submit feedback");

      setForm({ name: "", email: "", message: "" });
      fetchFeedback();
    } catch (err) {
      setError("Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Feedback App</h1>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <h2>All Feedback</h2>
      <div className="feedback-list">
      {[...feedback].reverse().map((f) => (
        <div className="feedback-card" key={f.id}>
          <p><strong>{f.name}</strong> ({f.email})</p>
          <p>{f.message}</p>
        </div>
      ))}

      </div>
    </div>
  );
}

export default App;
