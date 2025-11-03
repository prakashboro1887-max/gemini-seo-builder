app.post("/api/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "No prompt provided." });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!data.candidates) {
      console.error("Gemini API error:", data);
      return res.status(500).json({
        error: data.error?.message || "No response from Gemini API",
      });
    }

    const output =
      data.candidates[0]?.content?.parts?.[0]?.text || "No response text.";

    res.json({ output });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
});
