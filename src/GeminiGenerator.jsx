import React, { useState } from "react";
import { marked } from "marked";

function GeminiGenerator() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [keywords, setKeywords] = useState([]); // 🪄 new keyword list

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput("⏳ Generating...");
    setKeywords([]);

    try {
      const res = await fetch("http://localhost:3000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      // Convert Markdown → HTML
      setOutput(marked.parse(text));

      // 🪄 Generate keyword suggestions
      const plainText = text
        .replace(/[*_#.,]/g, "")
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 4 && word.length < 20);
      const frequency = {};
      plainText.forEach((word) => {
        frequency[word] = (frequency[word] || 0) + 1;
      });

      // Sort and get top 10 frequent words as keyword suggestions
      const sorted = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .map(([word]) => word)
        .slice(0, 10);

      setKeywords(sorted);
    } catch (err) {
      setOutput("⚠️ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🌗 Theme colors
  const theme = darkMode
    ? {
        background: "#0d1117",
        surface: "#161b22",
        text: "#e6edf3",
        border: "#30363d",
        accent: "#58a6ff",
        button: "#238636",
      }
    : {
        background: "#f8f9fa",
        surface: "#ffffff",
        text: "#212529",
        border: "#dee2e6",
        accent: "#007bff",
        button: "#198754",
      };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "auto",
        backgroundColor: theme.background,
        color: theme.text,
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Header */}
      <h2 style={{ textAlign: "center", color: theme.accent }}>
        ✨ Gemini SEO Title Generator
      </h2>

      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          marginBottom: "10px",
          float: "right",
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          color: theme.text,
          borderRadius: "6px",
          padding: "6px 12px",
          cursor: "pointer",
        }}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* Input */}
      <textarea
        rows="5"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{
          width: "100%",
          marginTop: "10px",
          backgroundColor: theme.surface,
          color: theme.text,
          border: `1px solid ${theme.border}`,
          borderRadius: "6px",
          padding: "10px",
          fontSize: "1rem",
          resize: "vertical",
        }}
        placeholder="Enter your topic (e.g., SEO ideas for tech blogs)"
      />

      {/* Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: loading ? theme.border : theme.button,
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          display: "block",
          width: "100%",
          fontWeight: "bold",
          transition: "background 0.2s",
        }}
      >
        {loading ? "Generating..." : "Generate SEO Title"}
      </button>

      {/* Output */}
      <div
        style={{
          marginTop: "20px",
          lineHeight: "1.7",
          background: theme.surface,
          padding: "16px",
          borderRadius: "8px",
          border: `1px solid ${theme.border}`,
          color: theme.text,
          whiteSpace: "pre-wrap",
          maxHeight: "400px",
          overflowY: "auto",
        }}
        dangerouslySetInnerHTML={{ __html: output }}
      ></div>

      {/* 🪄 Keyword Suggestions */}
      {keywords.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            background: theme.surface,
            padding: "12px",
            borderRadius: "8px",
            border: `1px solid ${theme.border}`,
          }}
        >
          <h3 style={{ color: theme.accent }}>🪄 Suggested SEO Keywords:</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            {keywords.map((word, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: theme.accent,
                  color: darkMode ? "#000" : "#fff",
                  padding: "6px 10px",
                  borderRadius: "16px",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                #{word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GeminiGenerator;
