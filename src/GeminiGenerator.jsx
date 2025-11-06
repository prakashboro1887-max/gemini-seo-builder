import React, { useState } from "react";
import "./GeminiGenerator.css";
import { Rocket } from "lucide-react";

const GeminiGenerator = () => {
  const [input, setInput] = useState("");
  const [titles, setTitles] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const handleGenerate = () => {
    if (!input.trim()) return;

    const newTitles = [
      `Everything You Need to Know About ${input}`,
      `${input}: Complete Guide & Insights`,
      `Discover the Secrets and Beauty of ${input}`,
    ];

    const newKeywords = input
      .toLowerCase()
      .split(" ")
      .filter((w) => w.length > 3);

    setTitles(newTitles);
    setKeywords(newKeywords);
  };

  return (
    <div className={`page ${darkMode ? "dark" : ""}`}>
      <div className="app-container">
        <header>
          <h1>✨ Gemini SEO Title Generator</h1>
          <button className="toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </header>

        <div className="input-area">
          <textarea
            placeholder="Enter your topic or question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
          <button className="generate-btn" onClick={handleGenerate}>
            <Rocket size={18} /> Generate
          </button>
        </div>

        {titles.length > 0 && (
          <div className="results">
            <h3>✨ SEO Title Ideas:</h3>
            <ul>
              {titles.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>

            <h3>🔑 Keywords:</h3>
            <div className="keywords">
              {keywords.map((k, i) => (
                <span key={i}>{k}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiGenerator;
